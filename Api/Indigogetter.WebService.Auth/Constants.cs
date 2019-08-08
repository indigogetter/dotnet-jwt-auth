using System;

namespace Indigogetter.WebService.Auth
{
    internal static class Constants
    {
        // Salt for SHA hashing algorithm is the same length as the spec, so for SHA512
        // the salt is 512 bits (64 bytes).
        public const int SaltLength = 64;
        public const int PasswordLength = 64;
        public const int InitialVectorLength = 16;
        public const int AesKeyLength = 16;

        public const string ReceiveMessageMethodName = "ReceiveMessage";
        public const string ClientProjectNotificationMethodName = "ProjectNotification";
        public const string ClientUserNotificationMethodName = "UserNotification";
        public const string ProjectsHubRoute = "/hubs/projects";
        public const string UsersHubRoute = "/hubs/users";
        public const string ProjectSubscriberGroupName = "CREATED_PROJECTS_SUBSCRIBERS";
        public const string UserSubscriberGroupName = "CREATED_USERS_SUBSCRIBERS";
    }
}
