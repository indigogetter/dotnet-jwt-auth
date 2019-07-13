using System;
using System.ComponentModel.DataAnnotations;

namespace Indigogetter.WebService.Auth.Dtos.Users
{
    [Serializable]
    public class AuthDto
    {
        [Required]
        [StringLength(50)]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
