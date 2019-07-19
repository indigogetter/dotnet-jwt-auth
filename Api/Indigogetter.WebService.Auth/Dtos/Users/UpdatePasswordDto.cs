using System;
using System.ComponentModel.DataAnnotations;

namespace Indigogetter.WebService.Auth.Dtos.Users
{
    [Serializable]
    public class UpdatePasswordDto
    {
        [Required]
        public long UserId { get; set; }

        [Required]
        [StringLength(64, ErrorMessage = "Password must be between 6 and 64 characters.", MinimumLength = 6)]
        public string Password { get; set; }

        public string Username { get; set; }

        public string Email { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public DateTime UserCreatedDate { get; set; }

        public DateTime UserModifiedDate { get; set; }

        public override string ToString()
        {
            return $"UserId: {UserId}, Username: {Username}, Email: {Email}, Password: [{Password.Length} characters], FirstName: {FirstName}, LastName: {LastName}, UserCreatedDate: {UserCreatedDate}, UserModifiedDate: {UserModifiedDate}";
        }
    }
}
