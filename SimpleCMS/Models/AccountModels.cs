using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace SimpleCMS.Models
{
    public class LoginModel
    {
        [Required]
        [Display(Name = "用户名")]
        public string UserName { get; set; }

        [Required]
        [Display(Name = "密码")]
        public string Password { get; set; }

        [Required]
        [StringLength(6, ErrorMessage = "验证码必须是6位字符。", MinimumLength = 6)]
        [Display(Name = "验证码")]
        public string Vcode { get; set; }
    }

    public class ChangePasswordModel
    {
        [Required]
        [Display(Name = "旧密码")]
        public string OldPassword { get; set; }

        [Required]
        [MinLength(8)]
        [RegularExpression(@"^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W])[\da-zA-Z\W]{8,}", ErrorMessage = "密码必须由字母、数字和符号组成")]
        [Display(Name = "新密码")]
        public string NewPassword { get; set; }

        [Display(Name = "确认密码")]
        [Compare("NewPassword", ErrorMessage = "新密码和确认密码不匹配。")]
        public string ConfirmPassword { get; set; }
    }
}