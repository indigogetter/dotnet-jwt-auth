using System;
using AutoMapper;
using Indigogetter.WebService.Auth.Dtos.Users;
using Indigogetter.Libraries.Models.DotnetJwtAuth;

namespace Indigogetter.WebService.Auth.Profiles.Users
{
    public class ReadUserProfile : Profile
    {
        public ReadUserProfile()
        {
            CreateMap<User, ReadUserDto>();
        }
    }
}
