using System;
using System.Linq;
using Indigogetter.Libraries.Models.DotnetJwtAuth;

namespace Indigogetter.WebService.Auth.Services
{
    public class UserService : IUserService
    {
        private readonly DotnetJwtAuthContext _dbContext;

        public UserService(DotnetJwtAuthContext dbContext)
        {
            _dbContext = dbContext;
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
            throw new NotImplementedException();
        }
    }
}
