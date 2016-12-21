using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace SimpleCMS.Models
{
    public class FolderModel
    {
        public string Path { get; set; }

        [Required]
        [MaxLength(100)]
        [RegularExpression(@"^(\w+\.?)*\w+$", ErrorMessage = "请输入正确的目录名称")]
        [Display(Name = "目录名称")]
        public string Name { get; set; }
    }

    public class FileSearchModel
    {
        [MaxLength(100)]
        [RegularExpression(@"^(\w?\.?\*?-?\??)*$", ErrorMessage = "请输入正确的搜索字符。")]
        [Display(Name = "文件名")]
        public string FileName { get; set; }

        [Display(Name = "开始日期")]
        public DateTime? StartDate { get; set; }

        [Display(Name = "结束日期")]
        public DateTime? EnddDate { get; set; }

        [Display(Name = "文件大小")]
        public int? Length { get; set; }
    }

}