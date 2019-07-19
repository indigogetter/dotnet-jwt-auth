using System;
using System.ComponentModel.DataAnnotations;

namespace Indigogetter.WebService.Auth.Dtos.Users
{
    [Serializable]
    public class AuthResponseDto
    {
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public DateTime TokenExpirationDate { get; set; }
        public DateTime? RefreshTokenExpirationDate { get; set; }

        public long UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime UserCreatedDate { get; set; }
        public DateTime UserModifiedDate { get; set; }

        public override string ToString()
        {
            return $"Token: {Token}, RefreshToken: {RefreshToken}, UserId: {UserId}, Username: {Username}, Email: {Email}, FirstName: {FirstName}, LastName: {LastName}, UserCreatedDate: {UserCreatedDate}, UserModifiedDate: {UserModifiedDate}";
        }
    }
}
