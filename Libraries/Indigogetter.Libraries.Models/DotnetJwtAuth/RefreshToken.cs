using System;
using System.Collections.Generic;

namespace Indigogetter.Libraries.Models.DotnetJwtAuth
{
    [Serializable]
    public class RefreshToken
    {
        public long RefreshTokenId { get; set; }
        public long UserId { get; set; }
        public DateTime RefreshTokenExpiryDate { get; set; }
        public byte[] InitialVector { get; set; }
        public byte[] EncryptionKey { get; set; }
        public bool IsRevoked { get; set; }
        public DateTime RefreshTokenCreatedDate { get; set; }
        public DateTime RefreshTokenModifiedDate { get; set; }

        public virtual User User { get; set; }
    }
}
