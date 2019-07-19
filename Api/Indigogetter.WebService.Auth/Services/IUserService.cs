using System;
using Indigogetter.Libraries.Models.DotnetJwtAuth;

namespace Indigogetter.WebService.Auth.Services
{
    public interface IUserService
    {
        User Authenticate(string username, string password);
        User Create(string username, string email, string password, string firstName, string lastName);
        User Read(long userId);
        User Read(string username);
        User UpdateProfile(long userId, string username, string email, string firstName, string lastName);
        User UpdatePassword(long userId, string password);
        bool Delete(long userId);
    }
}
