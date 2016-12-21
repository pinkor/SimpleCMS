using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
using SimpleCMS.Validations;

namespace SimpleCMS.Models
{
    public class ContentModel
    {
        public int? ContentId { get; set; }

        [Required]
        [MaxLength(255)]
        [Display(Name = "标题")]
        public string Title { get; set; }

        [Required]
        [MaxLength(255)]
        [Display(Name = "题图")]
        public string Image { get; set; }

        [Required]
        [IncludedInCategory(ErrorMessage = "类别不存在或已本删除")]
        [Display(Name = "类别")]
        public int CategoryId { get; set; }

        [Required]
        [Display(Name = "排序序数")]
        public int SortOrder { get; set; }

        [Required]
        [Display(Name = "标签")]
        public string Tags { get; set; }

        [Required]
        [AllowHtml]
        [Display(Name = "摘要")]
        public string Summary { get; set; }

        [Required]
        [AllowHtml]
        [Display(Name = "内容")]
        public string Content { get; set; }
    }

    public class CategoryModel
    {
        public int? CategoryId { get; set; }

        [Required]
        [MaxLength(255)]
        [Display(Name = "标题")]
        public string Title { get; set; }

        [Required]
        [MaxLength(255)]
        [Display(Name = "题图")]
        public string Image { get; set; }

        [Required]
        [Display(Name = "父类别")]
        [IncludedInCategory(ErrorMessage = "父类别不存在或已被删除")]
        public int ParentId { get; set; }

        [Required]
        [Display(Name = "排序序数")]
        public int SortOrder { get; set; }

        [Required]
        [AllowHtml]
        [Display(Name = "说明")]
        public string Content { get; set; }

    }

}