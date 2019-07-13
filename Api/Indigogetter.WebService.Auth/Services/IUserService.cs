using System;
using Indigogetter.Libraries.Models.DotnetJwtAuth;

namespace Indigogetter.WebService.Auth.Services
{
    public interface IUserService
    {
        User Authenticate(string username, string password);
    }
}
