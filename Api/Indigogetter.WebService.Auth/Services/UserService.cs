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
    }
}
