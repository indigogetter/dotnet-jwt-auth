using System;
using System.ComponentModel.DataAnnotations;
using Indigogetter.WebService.Auth.Dtos.Users;

namespace Indigogetter.WebService.Auth.Dtos.Projects
{
    [Serializable]
    public class ReadProjectDto
    {
        [Required]
        public long ProjectId { get; set; }

        [StringLength(50)]
        public string Title { get; set; }

        [StringLength(21800)]
        public string Content { get; set; }

        public ReadUserDto ProjectOwner { get; set; }
        
        public DateTime ProjectCreatedDate { get; set; }

        public DateTime ProjectModifiedDate { get; set; }

        public override string ToString()
        {
            var projectOwnerId = ProjectOwner == null ? -1 : ProjectOwner.UserId;
            return $"ProjectId: {ProjectId}, Title: {Title}, Content: {Content}, ProjectOwnerId: {projectOwnerId}, ProjectCreatedDate: {ProjectCreatedDate}, ProjectModifiedDate: {ProjectModifiedDate}";
        }
    }
}
