using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MySql.Data.EntityFrameworkCore.Extensions;
using Indigogetter.WebService.Auth.Config;
using Indigogetter.WebService.Auth.Services;
using Indigogetter.WebService.Auth.Hubs;
using Indigogetter.Libraries.Models.DotnetJwtAuth;

namespace Indigogetter.WebService.Auth
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            // Indicate that we would like to use AutoMapper to transcribe data between the data models (Indigogetter.Libraries.Models)
            // and the data transfer objects (Indigogetter.WebService.Auth.Dtos).
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            // Allow CORS but the policy must be well-defined to enable token authentication via SignalR requests.
            // Specifically, the connection requests will fail if the origins are not specified.
            var corsPolicyConfigSection = Configuration.GetSection("CorsPolicyConfig");
            var allowedOrigins = corsPolicyConfigSection.GetValue<string>("AllowedOrigins");
            services.AddCors(options => options.AddDefaultPolicy(policyBuilder =>
            {
                policyBuilder.AllowAnyMethod()
                    .AllowCredentials()
                    .AllowAnyHeader()
                    .WithOrigins(allowedOrigins.Split(',', StringSplitOptions.RemoveEmptyEntries));
            }));

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            services.AddSignalR();

            // Pull in the connection string from the environment variables.
            // On Windows environments this may be set via:
            //      Control Panel => System Security => System => Advanced System Settings => Environment Variables
            // On Linux environments this may be set in the file:
            //      /etc/environment
            var connectionString = Environment.GetEnvironmentVariable("AUTH_CONNECTION_STRING");
            services.AddDbContext<DotnetJwtAuthContext>(options => options.UseMySQL(connectionString));

            // The appsettings.json and appsettings.<environmentName>.json configuration files were read in
            // Program.cs initialization.  Call Configuration.GetSection("<SectionName>") to access the configured
            // values.
            var jwtSection = Configuration.GetSection("JwtConfig");
            var authConfig = jwtSection.Get<AuthConfig>();
            var secretKey = Encoding.ASCII.GetBytes(authConfig.Secret);
            Console.WriteLine(authConfig.Secret);
            services.AddAuthentication(options =>
            {
                // Indicate that requests should be challenged by default using a JWT bearer authentication scheme,
                // i.e. check the "Authentication" http/https header for a value of "Bearer <encodedJwtToken>" on
                // every request where the controller or the action has an [Authorize] attribute (unless overridden
                // with the [AllowAnonymous] attribute).
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    // Encoded info must indicate it was issued by the JwtConfig.Issuer value defined in appsettings.
                    ValidIssuer = authConfig.Issuer,
                    // Encoded info must indicate it is being used by the JwtConfig.Audience value defined in appsettings.
                    ValidAudience = authConfig.Audience,
                    // This value is used to encrypt/decrypt the JWT token returned to the user on sign-in and, while the
                    // encoded token is sent to the user, the security key is not.
                    IssuerSigningKey = new SymmetricSecurityKey(secretKey),
                    // Define the method to check that the token is not expired.  The default implementation has proven to work.
                    // LifetimeValidator = (before, expires, token, param) => expires > DateTime.UtcNow,

                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true
                };
                options.Events = new JwtBearerEvents
                {
                    // Allow the JWT authentication handler to access the token from the query string when
                    // the client (SignalR) is unable to include it in the Authorization header directly.
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        var path = context.HttpContext.Request.Path;
                        var isProjectHubPath = path.StartsWithSegments(Constants.ProjectsHubRoute);
                        var isUsersHubPath = path.StartsWithSegments(Constants.UsersHubRoute);
                        Console.WriteLine($"Encountered message. Path: [{path}], IsProjectHubPath: [{isProjectHubPath}], IsUsersHubPath: [{isUsersHubPath}], AccessToken: [{accessToken}]");
                        if (!String.IsNullOrEmpty(accessToken) && (isProjectHubPath || isUsersHubPath))
                            context.Token = accessToken;
                        return Task.CompletedTask;
                    },
                };
            });

            // Take advantage of the built-in dependency injection model via the services IServiceCollection.
            // Singleton instances are shared for every request over the life of the hosted process.
            services.AddSingleton<IAuthConfig>(authConfig);

            // Register the HttpContextAccessor to enable us to retrieve claims from the JWT, such as UserId.
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            // Register the HubConnectionContext accessor to implicitly retrieve user id on SignalR communications.
            // Alternatively, the EmailBasedUserIdProvider may be used if the email claim should be used as the userId,
            // but that is not inline with how this API is setup (i.e. email addresses may be updated with a User record).
            services.AddSingleton<IUserIdProvider, NameUserIdProvider>();

            // Scoped instances are generated anew for each request.
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IProjectService, ProjectService>();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            // Set the global cors policy.
            app.UseCors();

            // Indicate that the hosted application should use the configured default authentication scheme (JWT).
            app.UseAuthentication();

            // app.UseHttpsRedirection();

            // Register SignalR middleware for push notifications.
            app.UseSignalR(routes =>
            {
                routes.MapHub<ProjectsHub>(Constants.ProjectsHubRoute);
                routes.MapHub<UsersHub>(Constants.UsersHubRoute);
            });

            app.UseMvc();
        }
    }
}
