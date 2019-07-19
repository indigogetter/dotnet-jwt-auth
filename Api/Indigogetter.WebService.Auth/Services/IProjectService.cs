using System;
using Indigogetter.Libraries.Models.DotnetJwtAuth;

namespace Indigogetter.WebService.Auth.Services
{
    public interface IProjectService
    {
        Project CreateProject(User creator, string title, string content);
        Project GetProject(User requester, long projectId);
        Project UpdateProject(User modifier, long projectId, string title, string content);
        bool DeleteProject(User requester, long projectId);
    }
}
