using System;
using System.ComponentModel.DataAnnotations;
using Indigogetter.WebService.Auth.Dtos.Users;

namespace Indigogetter.WebService.Auth.Dtos.Projects
{
    [Serializable]
    public class CreateProjectDto
    {
        public long ProjectId { get; set; }

        [Required]
        [StringLength(50)]
        public string Title { get; set; }

        [Required]
        [StringLength(21800)]
        public string Content { get; set; }

        public ReadUserDto ProjectOwner { get; set; }
        
        public DateTime ProjectCreatedDate { get; set; }

        public DateTime ProjectModifiedDate { get; set; }

        public override string ToString()
        {
            return $"ProjectId: {ProjectId}, Title: {Title}, Content: {Content}, ProjectOwnerId: {ProjectOwner.UserId}, ProjectCreatedDate: {ProjectCreatedDate}, ProjectModifiedDate: {ProjectModifiedDate}";
        }
    }
}
