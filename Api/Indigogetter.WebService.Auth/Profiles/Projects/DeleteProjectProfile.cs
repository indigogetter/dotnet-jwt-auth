using System;
using AutoMapper;
using Indigogetter.WebService.Auth.Dtos.Projects;
using Indigogetter.Libraries.Models.DotnetJwtAuth;

namespace Indigogetter.WebService.Auth.Profiles.Projects
{
    public class DeleteProjectProfile : Profile
    {
        public DeleteProjectProfile()
        {
            CreateMap<Project, DeleteProjectDto>();
        }
    }
}
