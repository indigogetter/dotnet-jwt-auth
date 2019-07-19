using System;
using System.ComponentModel.DataAnnotations;

namespace Indigogetter.WebService.Auth.Dtos.Users
{
    [Serializable]
    public class ReadUserDto
    {
        [Required]
        public long UserId { get; set; }

        [StringLength(50)]
        public string Username { get; set; }

        [StringLength(320)]
        public string Email { get; set; }

        [StringLength(50)]
        public string FirstName { get; set; }

        [StringLength(50)]
        public string LastName { get; set; }

        public DateTime UserCreatedDate { get; set; }

        public DateTime UserModifiedDate { get; set; }

        public override string ToString()
        {
            return $"UserId: {UserId}, Username: {Username}, Email: {Email}, FirstName: {FirstName}, LastName: {LastName}, UserCreatedDate: {UserCreatedDate}, UserModifiedDate: {UserModifiedDate}";
        }
    }
}
