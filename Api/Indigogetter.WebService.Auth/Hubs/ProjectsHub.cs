using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace Indigogetter.WebService.Auth.Hubs
{
    [Authorize]
    public class ProjectsHub : Hub
    {
        public async Task AddToGroup(string groupName) => await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

        public async Task RemoveFromGroup(string groupName) => await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
    }
}
