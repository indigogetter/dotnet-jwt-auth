using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Indigogetter.WebService.Auth.Config;
using Indigogetter.WebService.Auth.Dtos.Projects;
using Indigogetter.WebService.Auth.Dtos.Users;
using Indigogetter.WebService.Auth.Hubs;
using Indigogetter.WebService.Auth.Services;
using Indigogetter.Libraries.Models.DotnetJwtAuth;

namespace Indigogetter.WebService.Auth.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IHubContext<ProjectsHub> _projectHubContext;
        private readonly IAuthConfig _authConfig;
        private readonly IProjectService _projectService;
        private readonly IUserService _userService;

        public ProjectsController(
            IMapper mapper,
            IHttpContextAccessor httpContextAccessor,
            IHubContext<ProjectsHub> projectHubContext,
            IAuthConfig authConfig,
            IProjectService projectService,
            IUserService userService)
        {
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _projectHubContext = projectHubContext;
            _authConfig = authConfig;
            _projectService = projectService;
            _userService = userService;
        }

        [HttpPost("create")]
        [Consumes("application/json")]
        [Produces("application/json")]
        public async Task<IActionResult> Create([FromBody]CreateProjectDto projectDto)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            var currentUser = _userService.Read(currentUserId);
            var project = _projectService.CreateProject(currentUser, projectDto.Title, projectDto.Content);

            if (project == null)
                return BadRequest(new { Message = "Failed to create project." });

            var createdProjectDto = _mapper.Map<CreateProjectDto>(project);
            createdProjectDto.ProjectOwner = _mapper.Map<ReadUserDto>(project.User);

            try
            {
                // Notify all subscribers (logged in users) that a new project has been created.
                await _projectHubContext.Clients
                    .Groups(Constants.ProjectSubscriberGroupName)
                    .SendAsync(Constants.ClientProjectNotificationMethodName, new
                    {
                        CreatedProjectDto = createdProjectDto,
                    });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Encountered exception while attempting to publish project creation to subscribers.  Message: {ex.Message}.");
                Console.WriteLine(ex.StackTrace);
            }

            return Ok(createdProjectDto);
        }

        [HttpGet("read")]
        [Produces("application/json")]
        public IActionResult Read([FromQuery]ReadProjectDto projectDto)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            var currentUser = _userService.Read(currentUserId);
            var project = _projectService.GetProject(currentUser, projectDto.ProjectId);

            if (project == null)
                return BadRequest(new { Message = "Failed to find project with specified ID." });

            var projectResponseDto = _mapper.Map<ReadProjectDto>(project);
            projectResponseDto.ProjectOwner = _mapper.Map<ReadUserDto>(project.User);

            return Ok(projectResponseDto);
        }

        [HttpGet("readall")]
        [Produces("application/json")]
        public IActionResult ReadAll([FromQuery]ReadAllProjectsDto readAllProjectsDto)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            var currentUser = _userService.Read(currentUserId);
            var now = DateTime.Now;
            var projects = _projectService.GetProjectsModifiedAfterDate(currentUser, readAllProjectsDto.StartingDate);

            return Ok(new ReadAllProjectsDto
            {
                StartingDate = now,
                Projects = projects
                    .Select(project => {
                        var projectResponseDto = _mapper.Map<ReadProjectDto>(project);
                        projectResponseDto.ProjectOwner = _mapper.Map<ReadUserDto>(project.User);
                        return projectResponseDto;
                    })
                    .ToList()
            });
        }

        [HttpPost("update")]
        [Consumes("application/json")]
        [Produces("application/json")]
        public IActionResult Update([FromBody]UpdateProjectDto projectDto)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            var currentUser = _userService.Read(currentUserId);
            var project = _projectService.UpdateProject(currentUser, projectDto.ProjectId, projectDto.Title, projectDto.Content);

            if (project == null)
                return BadRequest(new { Message = "Failed to update project with specified ID." });

            return Ok(_mapper.Map<UpdateProjectDto>(project));
        }

        [HttpDelete("delete")]
        public IActionResult Delete([FromQuery]DeleteProjectDto projectDto)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            var currentUser = _userService.Read(currentUserId);
            var result = _projectService.DeleteProject(currentUser, projectDto.ProjectId);

            if (result)
                return Ok();
            else
                return NoContent();
        }
    }
}

