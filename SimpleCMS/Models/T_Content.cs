using System;
using System.Collections.Generic;

namespace SimpleCMS.Models
{
    public partial class T_Content
    {
        public T_Content()
        {
            this.T_Tag = new List<T_Tag>();
        }

        public int ContentId { get; set; }
        public string Title { get; set; }
        public int CategoryId { get; set; }
        public string Image { get; set; }
        public string Summary { get; set; }
        public string Content { get; set; }
        public System.DateTime Created { get; set; }
        public int Hits { get; set; }
        public int State { get; set; }
        public int SortOrder { get; set; }
        public virtual T_Category T_Category { get; set; }
        public virtual ICollection<T_Tag> T_Tag { get; set; }
    }
}
