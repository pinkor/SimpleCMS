using System;
using System.Collections.Generic;

namespace SimpleCMS.Models
{
    public partial class T_Category
    {
        public T_Category()
        {
            this.Childs = new List<T_Category>();
            this.T_Content = new List<T_Content>();
        }

        public int CategoryId { get; set; }
        public Nullable<int> ParentId { get; set; }
        public Nullable<int> HierarchyLevel { get; set; }
        public string FullPath { get; set; }
        public string Title { get; set; }
        public string Image { get; set; }
        public string Content { get; set; }
        public int SortOrder { get; set; }
        public int State { get; set; }
        public System.DateTime Created { get; set; }
        public virtual ICollection<T_Category> Childs { get; set; }
        public virtual T_Category Parent { get; set; }
        public virtual ICollection<T_Content> T_Content { get; set; }
    }
}
