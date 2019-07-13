using System;
using System.Collections.Generic;

namespace Indigogetter.Libraries.Models.DotnetJwtAuth
{
    [Serializable]
    public class User
    {
        public long UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public DateTime UserCreateDate { get; set; }
        public DateTime UserModifiedDate { get; set; }
    }
}
