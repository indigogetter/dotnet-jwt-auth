using System;
using AutoMapper;
using Indigogetter.WebService.Auth.Dtos.Projects;
using Indigogetter.WebService.Auth.Dtos.Users;
using Indigogetter.Libraries.Models.DotnetJwtAuth;

namespace Indigogetter.WebService.Auth.Profiles.Projects
{
    public class ReadProjectProfile : Profile
    {
        public ReadProjectProfile()
        {
            CreateMap<Project, ReadProjectDto>();
            CreateMap<User, ReadUserDto>();
        }
    }
}
