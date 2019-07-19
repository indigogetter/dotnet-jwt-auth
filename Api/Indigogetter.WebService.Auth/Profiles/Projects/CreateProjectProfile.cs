using System;
using AutoMapper;
using Indigogetter.WebService.Auth.Dtos.Projects;
using Indigogetter.WebService.Auth.Dtos.Users;
using Indigogetter.Libraries.Models.DotnetJwtAuth;

namespace Indigogetter.WebService.Auth.Profiles.Projects
{
    public class CreateProjectProfile : Profile
    {
        public CreateProjectProfile()
        {
            CreateMap<Project, CreateProjectDto>();
            CreateMap<User, ReadUserDto>();
        }
    }
}
