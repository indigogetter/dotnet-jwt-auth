using System;
using System.Collections.Generic;

namespace Indigogetter.Libraries.Models.DotnetJwtAuth
{
    [Serializable]
    public class Project
    {
        public long ProjectId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public long UserId { get; set; }
        public DateTime ProjectCreatedDate { get; set; }
        public DateTime ProjectModifiedDate { get; set; }
        public byte IsDeleted { get; set; }

        public virtual User User { get; set; }
    }
}
