using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Indigogetter.WebService.Auth.Config;
using Indigogetter.WebService.Auth.Dtos.Users;
using Indigogetter.WebService.Auth.Hubs;
using Indigogetter.WebService.Auth.Services;
using Indigogetter.Libraries.Models.DotnetJwtAuth;

namespace Indigogetter.WebService.Auth.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IHubContext<UsersHub> _userHubContext;
        private readonly IAuthConfig _authConfig;
        private readonly IUserService _userService;

        public UsersController(
            IMapper mapper,
            IHttpContextAccessor httpContextAccessor,
            IHubContext<UsersHub> userHubContext,
            IAuthConfig authConfig,
            IUserService userService)
        {
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _userHubContext = userHubContext;
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
                return Unauthorized(new { Message = "Username or password is incorrect." });
            else if (user.IsDeleted)
                return Unauthorized(new { Message = "This username has been permanently deactivated." });
            else if (user.IsLocked)
                return Unauthorized(new { Message = "This user has been locked.  Please contact system administrator." });

            var tokenExpiration = DateTime.Now.AddDays(7);
            var refreshTokenExpiration = DateTime.Now.AddDays(30);
            var tokenHandler = new JwtSecurityTokenHandler();
            var keyBytes = Encoding.ASCII.GetBytes(_authConfig.Secret);
            var securityKey = new SymmetricSecurityKey(keyBytes);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Issuer = _authConfig.Issuer,
                Audience = _authConfig.Audience,
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                    new Claim(ClaimTypes.Expiration, tokenExpiration.ToString())
                }),
                Expires = tokenExpiration,
                SigningCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature),
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var responseDto = _mapper.Map<AuthResponseDto>(user);
            responseDto.Token = tokenHandler.WriteToken(token);
            responseDto.TokenExpirationDate = tokenExpiration;
            responseDto.RefreshTokenExpirationDate = refreshTokenExpiration;
            responseDto.RefreshToken = _userService.EncodeRefreshToken(user.Username, refreshTokenExpiration);

            return Ok(responseDto);
        }

        [AllowAnonymous]
        [HttpPost("refresh")]
        [Consumes("application/json")]
        [Produces("application/json")]
        public IActionResult Refresh([FromBody]RefreshDto refreshDto)
        {
            try
            {
                var isTokenValid = _userService.ValidateRefreshToken(refreshDto.RefreshToken, out DecodedRefreshTokenClaims decodedClaims, out User user);

                if (decodedClaims.ExpiryDate < DateTime.Now)
                    return Unauthorized(new { Message = "Refresh token has expired." });
                else if (!isTokenValid)
                    return Unauthorized(new { Message = "Invalid refresh token." });
                else if (user == null)
                    return Unauthorized(new { Message = "Unable to identify user associated to the refresh token provided." });
                else if (user.IsDeleted)
                    return Unauthorized(new { Message = "This username has been permanently deactivated." });
                else if (user.IsLocked)
                    return Unauthorized(new { Message = "This user has been locked.  Please contact system administrator." });

                var tokenExpiration = DateTime.Now.AddDays(7);
                var refreshTokenExpiration = DateTime.Now.AddDays(30);
                var tokenHandler = new JwtSecurityTokenHandler();
                var keyBytes = Encoding.ASCII.GetBytes(_authConfig.Secret);
                var securityKey = new SymmetricSecurityKey(keyBytes);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Issuer = _authConfig.Issuer,
                    Audience = _authConfig.Audience,
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                        new Claim(ClaimTypes.Expiration, tokenExpiration.ToString())
                    }),
                    Expires = tokenExpiration,
                    SigningCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature),
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                var responseDto = _mapper.Map<RefreshResponseDto>(user);
                responseDto.Token = tokenHandler.WriteToken(token);
                responseDto.TokenExpirationDate = tokenExpiration;
                responseDto.RefreshTokenExpirationDate = refreshTokenExpiration;
                responseDto.RefreshToken = _userService.EncodeRefreshToken(user.Username, refreshTokenExpiration);

                return Ok(responseDto);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Encountered exception while attempting to satisfy refreshToken claim.  Message: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
            }

            return Unauthorized(new { Message = "Failed to generate new authentication token from the provided refresh token." });
        }

        [AllowAnonymous]
        [HttpPost("create")]
        [Consumes("application/json")]
        [Produces("application/json")]
        public async Task<IActionResult> Create([FromBody]CreateUserDto userDto)
        {
            var user = _userService.Create(userDto.Username, userDto.Email, userDto.Password, userDto.FirstName, userDto.LastName);

            if (user == null)
                return BadRequest(new { Message = "Failed to create new user." });

            var createdUserDto = _mapper.Map<CreateUserDto>(user);

            try
            {
                // Notify all subscribers (logged in users) that a new project has been created.
                await _userHubContext.Clients
                    .Groups(Constants.UserSubscriberGroupName)
                    .SendAsync(Constants.ClientUserNotificationMethodName, new
                    {
                        CreatedUserDto = createdUserDto,
                    });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Encountered exception while attempting to publish user creation to subscribers.  Message: {ex.Message}.");
                Console.WriteLine(ex.StackTrace);
            }

            return Ok(createdUserDto);
        }

        [HttpPost("update")]
        [Consumes("application/json")]
        [Produces("application/json")]
        public IActionResult Update([FromBody]UpdateUserDto userDto)
        {
            var user = _userService.UpdateProfile(userDto.UserId, userDto.Username, userDto.Email, userDto.FirstName, userDto.LastName);

            if (user == null)
                return BadRequest(new { Message = "Failed to update user." });

            return Ok(_mapper.Map<UpdateUserDto>(user));
        }

        [HttpPost("password")]
        [Consumes("application/json")]
        [Produces("application/json")]
        public IActionResult Password([FromBody]UpdatePasswordDto userDto)
        {
            var user = _userService.UpdatePassword(userDto.UserId, userDto.Password);

            if (user == null)
                return BadRequest(new { Message = "Failed to update password." });

            return Ok(_mapper.Map<UpdateUserDto>(user));
        }

        [HttpGet("read")]
        [Produces("application/json")]
        public IActionResult Read([FromQuery]ReadUserDto userDto)
        {
            var user = _userService.Read(userDto.UserId);

            if (user == null)
                return BadRequest(new { Message = "Failed to find user with specified ID." });

            return Ok(_mapper.Map<ReadUserDto>(user));
        }

        [HttpDelete("delete")]
        public IActionResult Delete([FromQuery]DeleteUserDto userDto)
        {
            var result = _userService.Delete(userDto.UserId);

            if (result)
                return Ok();
            else
                return NoContent();
        }
    }
}

