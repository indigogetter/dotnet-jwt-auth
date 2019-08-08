using System;

namespace Indigogetter.WebService.Auth.Services
{
        [Serializable]
        public class DecodedRefreshTokenClaims
        {
            public string Username { get; set; }
            public DateTime ExpiryDate { get; set; }
            public byte[] Secret { get; set; }
        }
}
