using System;
using System.Collections.Generic;

namespace Indigogetter.Libraries.Models.DotnetJwtAuth
{
    [Serializable]
    public class User
    {
        public User()
        {
            Project = new HashSet<Project>();
        }

        public long UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime UserCreatedDate { get; set; }
        public DateTime UserModifiedDate { get; set; }
        public byte IsDeleted { get; set; }
        public byte IsLocked { get; set; }

        public virtual ICollection<Project> Project { get; set; }
    }
}
