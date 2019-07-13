using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Indigogetter.WebService.Auth.Config;
using Indigogetter.WebService.Auth.Dtos.Users;
using Indigogetter.WebService.Auth.Services;
using Indigogetter.Libraries.Models.DotnetJwtAuth;

namespace Indigogetter.WebService.Auth.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IAuthConfig _authConfig;
        private readonly IUserService _userService;

        public UsersController(IAuthConfig authConfig, IUserService userService)
        {
            _authConfig = authConfig;
            _userService = userService;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        [Consumes("application/json")]
        [Produces("application/json")]
        public IActionResult Authenticate([FromBody]AuthDto authDto)
        {
            var user = _userService.Authenticate(authDto.Username, authDto.Password);

            if (user == null)
                return BadRequest(new { Message = "Username or password is incorrect." });

            return Ok(user);
        }

        /**
            Want to add:
                CreateUser
                UpdatePassword
         */
    }
}

