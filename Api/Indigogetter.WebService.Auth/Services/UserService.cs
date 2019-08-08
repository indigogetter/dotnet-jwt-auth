using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Formatters.Binary;
using System.Security.Cryptography;
using System.Text;
using Indigogetter.Libraries.Models.DotnetJwtAuth;

namespace Indigogetter.WebService.Auth.Services
{
    public class UserService : IUserService
    {
        /**
         *   The "purpose" passed into CreateProtector is the only chance to anonymize the data.
         *   Otherwise, anyone that is able to guess the input string will be able to decrypt
         *   or else encryption/decryption is tied to the host, in which case the servers are
         *   no longer stateless... recommend using something like AES encryption.
         *   The RefreshToken table already supports InitialVector and EncryptionKey fields,
         *   but the exercise of implementing such a solution in EncodeRefreshToken and
         *   ValidateRefreshToken is left to any consumers of this application.
         */
        private readonly DotnetJwtAuthContext _dbContext;
        private readonly IDataProtector _dataProtector;
        private readonly BinaryFormatter _binaryFormatter;

        public UserService(DotnetJwtAuthContext dbContext, IDataProtectionProvider dataProtectionProvider)
        {
            _dbContext = dbContext;
            _dataProtector = dataProtectionProvider.CreateProtector(nameof(UserService));
            _binaryFormatter = new BinaryFormatter();
        }

        public User Authenticate(string username, string password)
        {
            Console.WriteLine($"Attempting to authenticate username [{username}] with password [{password.Length}].");
            var user = _dbContext.User.Where(u => u.Username == username).FirstOrDefault();

            if (user == null)
                return null;
            else if (!PasswordHelper.VerifyPassword(password, user.PasswordSalt, user.PasswordHash))
            {
                Console.WriteLine($"Password verification for user [{username}] failed.");
                return null;
            }

            return user;
        }

        public string EncodeRefreshToken(string username, DateTime expiryDate)
        {
            var user = Read(username);
            var previousTokens = _dbContext.RefreshToken
                .Where(token => token.UserId == user.UserId && !token.IsRevoked)
                .ToList();
            foreach (var token in previousTokens)
                token.IsRevoked = true;
            var refreshToken = new RefreshToken
            {
                UserId = user.UserId,
                RefreshTokenExpiryDate = expiryDate,
                InitialVector = PasswordHelper.GenerateInitialVector(),
                EncryptionKey = PasswordHelper.GenerateAesKey(),
            };
            var refreshTokenEntity = _dbContext.RefreshToken.Add(refreshToken).Entity;
            _dbContext.RefreshToken.UpdateRange(previousTokens);
            _dbContext.SaveChanges();

            var refreshTokenClaims = new DecodedRefreshTokenClaims
            {
                Username = username,
                ExpiryDate = expiryDate,
                Secret = _dataProtector.Protect(BitConverter.GetBytes(refreshToken.RefreshTokenId)),
            };
            var encodedToken = String.Empty;

            using (var serializerStream = new MemoryStream())
            {
                Console.WriteLine($"{nameof(EncodeRefreshToken)} refreshTokenClaims: [{refreshTokenClaims.ToString()}]");
                _binaryFormatter.Serialize(serializerStream, refreshTokenClaims);
                encodedToken = Convert.ToBase64String(serializerStream.ToArray());
            }

            return encodedToken;
        }

        public bool ValidateRefreshToken(string encodedRefreshToken, out DecodedRefreshTokenClaims refreshTokenClaims, out User user)
        {
            using (var deserializerStream = new MemoryStream(Convert.FromBase64String(encodedRefreshToken)))
            {
                refreshTokenClaims = (DecodedRefreshTokenClaims)_binaryFormatter.Deserialize(deserializerStream);
                user = null;

                if (refreshTokenClaims.ExpiryDate < DateTime.Now)
                    return false;

                var username = refreshTokenClaims.Username;
                var activeToken = _dbContext.RefreshToken
                    .Include(rt => rt.User)
                    .Where(rt => rt.User.Username == username && !rt.IsRevoked)
                    .FirstOrDefault();
                user = activeToken.User;

                if (activeToken == null)
                    return false;

                Console.WriteLine($"{nameof(ValidateRefreshToken)} refreshTokenClaims: [{refreshTokenClaims}]");
                Console.WriteLine($"{nameof(ValidateRefreshToken)} EncryptionKey: [{BitConverter.ToString(activeToken.EncryptionKey)}], InitialVector: [{BitConverter.ToString(activeToken.InitialVector)}]");
                var decryptedBytes = _dataProtector.Unprotect(refreshTokenClaims.Secret);
                var decryptedSecret = BitConverter.ToInt64(decryptedBytes);
                Console.WriteLine($"{nameof(ValidateRefreshToken)} ActiveRefreshTokenId: {activeToken.RefreshTokenId}, DecryptedTokenId: {decryptedSecret}");

                if (activeToken.RefreshTokenId == decryptedSecret)
                    return true;
            }

            return false;
        }

        public User Create(string username, string email, string password, string firstName, string lastName)
        {
            var salt = PasswordHelper.GenerateSalt();
            var passwordHash = PasswordHelper.GeneratePasswordHash(password, salt);
            var user = new User
            {
                Username = username,
                Email = email,
                PasswordHash = passwordHash,
                PasswordSalt = salt,
                FirstName = firstName,
                LastName = lastName,
            };
            var userEntity = _dbContext.User.Add(user).Entity;
            _dbContext.SaveChanges();

            return userEntity;
        }

        public User Read(long userId)
        {
            return _dbContext.User
                .Where(u => u.UserId == userId)
                .FirstOrDefault();
        }

        public User Read(string username)
        {
            return _dbContext.User
                .Where(u => u.Username == username)
                .FirstOrDefault();
        }

        public User UpdateProfile(long userId, string username, string email, string firstName, string lastName)
        {
            var user = Read(userId);
            user.Username = username;
            user.Email = email;
            user.FirstName = firstName;
            user.LastName = lastName;
            _dbContext.User.Update(user);
            _dbContext.SaveChanges();

            return user;
        }

        public User UpdatePassword(long userId, string password)
        {
            var salt = PasswordHelper.GenerateSalt();
            var passwordHash = PasswordHelper.GeneratePasswordHash(password, salt);
            var user = Read(userId);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = salt;
            _dbContext.User.Update(user);
            _dbContext.SaveChanges();

            return user;
        }

        public bool Delete(long userId)
        {
            var user = Read(userId);
            user.IsDeleted = true;
            _dbContext.User.Update(user);
            _dbContext.SaveChanges();

            return true;
        }
    }
}
