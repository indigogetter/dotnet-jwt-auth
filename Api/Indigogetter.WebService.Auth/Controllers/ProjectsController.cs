using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Indigogetter.WebService.Auth.Config;
using Indigogetter.WebService.Auth.Dtos.Projects;
using Indigogetter.WebService.Auth.Dtos.Users;
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
        private readonly IAuthConfig _authConfig;
        private readonly IProjectService _projectService;
        private readonly IUserService _userService;

        public ProjectsController(
            IMapper mapper,
            IHttpContextAccessor httpContextAccessor,
            IAuthConfig authConfig,
            IProjectService projectService,
            IUserService userService)
        {
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _authConfig = authConfig;
            _projectService = projectService;
            _userService = userService;
        }

        [HttpPost("create")]
        [Consumes("application/json")]
        [Produces("application/json")]
        public IActionResult Create([FromBody]CreateProjectDto projectDto)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            var currentUser = _userService.Read(currentUserId);
            var project = _projectService.CreateProject(currentUser, projectDto.Title, projectDto.Content);

            if (project == null)
                return BadRequest(new { Message = "Failed to create project." });

            return Ok(_mapper.Map<CreateProjectDto>(project));
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

            return Ok(_mapper.Map<ReadProjectDto>(project));
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

