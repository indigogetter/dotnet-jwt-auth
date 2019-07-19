using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using Indigogetter.Libraries.Models.DotnetJwtAuth;

namespace Indigogetter.WebService.Auth.Services
{
    public class ProjectService : IProjectService
    {
        private readonly DotnetJwtAuthContext _dbContext;

        public ProjectService(DotnetJwtAuthContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Project CreateProject(User creator, string title, string content)
        {
            var project = new Project
            {
                Title = title,
                Content = content,
                UserId = creator.UserId,
            };

            var projectEntity = _dbContext.Project.Add(project).Entity;
            _dbContext.SaveChanges();

            projectEntity.User = creator;

            return projectEntity;
        }

        public Project GetProject(User requester, long projectId)
        {
            return _dbContext.Project
                .Include(p => p.User)
                .Where(p => p.ProjectId == projectId)
                .FirstOrDefault();
        }

        public Project UpdateProject(User modifier, long projectId, string title, string content)
        {
            var project = GetProject(modifier, projectId);

            if (project == null)
                return null;

            project.Title = title;
            project.Content = content;
            var projectEntity = _dbContext.Project.Update(project).Entity;
            _dbContext.SaveChanges();

            return projectEntity;
        }

        public bool DeleteProject(User requester, long projectId)
        {
            throw new NotImplementedException();
        }
    }
}
