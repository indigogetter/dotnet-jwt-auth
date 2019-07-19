using System;
using System.ComponentModel.DataAnnotations;

namespace Indigogetter.WebService.Auth.Dtos.Projects
{
    [Serializable]
    public class DeleteProjectDto
    {
        [Required]
        public long ProjectId { get; set; }

        public override string ToString()
        {
            return $"ProjectId: {ProjectId}";
        }
    }
}
