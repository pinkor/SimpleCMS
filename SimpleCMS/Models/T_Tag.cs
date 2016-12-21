using System;
using System.Collections.Generic;

namespace SimpleCMS.Models
{
    public partial class T_Tag
    {
        public T_Tag()
        {
            this.T_Content = new List<T_Content>();
        }

        public int TagId { get; set; }
        public string TagName { get; set; }
        public virtual ICollection<T_Content> T_Content { get; set; }
    }
}
