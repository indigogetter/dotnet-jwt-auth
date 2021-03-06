using System;

namespace Indigogetter.WebService.Auth.Config
{
    public interface IAuthConfig
    {
        string Audience { get; }
        string Issuer { get; }
        string Secret { get; }
    }
}
