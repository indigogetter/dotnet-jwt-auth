using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using Indigogetter.WebService.Auth.Dtos.Users;

namespace Indigogetter.WebService.Auth.Dtos.Projects
{
    [Serializable]
    public class ReadAllProjectsDto
    {
        [Required]
        public DateTime StartingDate { get; set; }

        public List<ReadProjectDto> Projects { get; set; }

        public override string ToString()
        {
            var sb = new StringBuilder();

            foreach (var project in Projects ?? Enumerable.Empty<ReadProjectDto>())
                sb.AppendLine($"\t{project.ToString()},");

            return $"StartingDate: {StartingDate}, Projects: [{Environment.NewLine}{sb.ToString()}]";
        }
    }
}
