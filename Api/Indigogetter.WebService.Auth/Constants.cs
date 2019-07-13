using System;

namespace Indigogetter.WebService.Auth
{
    internal static class Constants
    {
        // Salt for SHA hashing algorithm is the same length as the spec, so for SHA512
        // the salt is 512 bits (64 bytes).
        public static readonly int SaltLength = 64;
        public static readonly int PasswordLength = 64;
    }
}
