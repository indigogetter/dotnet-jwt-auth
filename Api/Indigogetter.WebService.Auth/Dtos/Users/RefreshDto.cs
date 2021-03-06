using System;
using System.ComponentModel.DataAnnotations;

namespace Indigogetter.WebService.Auth.Dtos.Users
{
    [Serializable]
    public class RefreshDto
    {
        [Required]
        public string RefreshToken { get; set; }

        public override string ToString()
        {
            return $"RefreshToken: {RefreshToken}";
        }
    }
}
