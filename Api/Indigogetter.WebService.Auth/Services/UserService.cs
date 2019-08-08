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
        private readonly DotnetJwtAuthContext _dbContext;
        private readonly BinaryFormatter _binaryFormatter;

        public UserService(DotnetJwtAuthContext dbContext)
        {
            _dbContext = dbContext;
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
            };
            var encodedToken = String.Empty;

            using (var serializerStream = new MemoryStream())
            using (var aesInstance = Aes.Create())
            {
                var encryptor = aesInstance.CreateEncryptor(refreshTokenEntity.EncryptionKey, refreshToken.InitialVector);

                using (var encryptionMemoryStream = new MemoryStream())
                using (var cryptoStream = new CryptoStream(encryptionMemoryStream, encryptor, CryptoStreamMode.Write))
                {
                    var openSecretBytes = BitConverter.GetBytes(refreshToken.RefreshTokenId);
                    cryptoStream.Write(openSecretBytes, 0, openSecretBytes.Length);
                    cryptoStream.Flush();
                    refreshTokenClaims.Secret = encryptionMemoryStream.ToArray();
                }

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

                using (var aesInstance = Aes.Create())
                {
                    var decryptor = aesInstance.CreateDecryptor(activeToken.EncryptionKey, activeToken.InitialVector);

                    using (var decryptionMemoryStream = new MemoryStream(refreshTokenClaims.Secret))
                    using (var cryptoStream = new CryptoStream(decryptionMemoryStream, decryptor, CryptoStreamMode.Read))
                    using (var binaryStream = new BinaryReader(cryptoStream))
                    {
                        var decryptedSecret = binaryStream.ReadInt64();
                        Console.WriteLine($"{nameof(ValidateRefreshToken)} ActiveRefreshTokenId: {activeToken.RefreshTokenId}, DecryptedTokenId: {decryptedSecret}");

                        if (activeToken.RefreshTokenId == decryptedSecret)
                            return true;
                    }
                }
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
