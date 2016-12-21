using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SimpleCMS.Filters;
using Newtonsoft.Json.Linq;
using SimpleCMS.Helper;
using SimpleCMS.Models;
using WebMatrix.WebData;
using System.Web.Security;

namespace SimpleCMS.Controllers
{
    [InitializeSimpleMembership]
    [Authorize(Roles = "系统管理员,编辑")]
    public class AccountController : Controller
    {
        //
        // GET: /Account/

        [AllowAnonymous]
        [HttpPost]
        public JObject Login(LoginModel model)
        {
            if (!ModelState.IsValid)
            {
                return ExtJS.WriterJObject(false, errors: ExtJS.ModelStateToJObject(ModelState));
            }
            string vcode = (string)Session["vcode"] ?? "";
            if (String.IsNullOrEmpty(model.Vcode) || vcode.ToLower() != model.Vcode.ToLower())
            {
                return ExtJS.WriterJObject(false, errors: new JObject() { new JProperty("Vcode", "验证码错误") });
            }
            if (!WebSecurity.UserExists(model.UserName))
            {
                return ExtJS.WriterJObject(false, errors: new JObject() { 
                    new JProperty("UserName", "错误的用户名或密码"),
                    new JProperty("Password", "错误的用户名或密码")
                });
            }
            int lockoutInterval = (AppSettings.GetSettingAsInteger("LockoutInterval") ?? 60) * 60;
            int allowedPasswordAttempts = AppSettings.GetSettingAsInteger("AllowedPasswordAttempts") ?? 5;
            if (WebSecurity.IsAccountLockedOut(model.UserName, allowedPasswordAttempts, lockoutInterval))
            {
                TimeSpan ts = WebSecurity.GetLastPasswordFailureDate(model.UserName).AddMinutes(lockoutInterval) - DateTime.Now;
                return ExtJS.WriterJObject(false, errors: new JObject() { 
                    new JProperty("UserName", "用户名已被锁定，" + ts.Minutes + "分钟后才能再次尝试登录。")
                });
            }
            if (!WebSecurity.Login(model.UserName, model.Password))
            {
                return ExtJS.WriterJObject(false, errors: new JObject() { 
                    new JProperty("UserName", "错误的用户名或密码"),
                    new JProperty("Password", "错误的用户名或密码")
                    });
            }
            if (Roles.IsUserInRole(model.UserName, "系统管理员") | Roles.IsUserInRole(model.UserName, "编辑"))
            {
                return ExtJS.WriterJObject(true);
            }
            else
            {
                WebSecurity.Logout();
                return ExtJS.WriterJObject(false, errors: new JObject() { 
                    new JProperty("UserName", "您没有权限登录系统")
                    });
            }
        }

        [AllowAnonymous]
        public JObject GetUserInfo()
        {
            if (WebSecurity.IsAuthenticated)
            {
                JArray ja = new JArray();
                foreach (var role in Roles.GetRolesForUser(WebSecurity.CurrentUserName))
                {
                    ja.Add(new JValue(role));
                }
                return ExtJS.WriterJObject(true, data: new JObject(
                    new JProperty("UserName", WebSecurity.CurrentUserName),
                    new JProperty("Roles", ja),
                    new JProperty("ImagePath", AppSettings.GetSettingAsString("ImageVirtualFolder"))
                    ));
            }
            else
            {
                return ExtJS.WriterJObject(false);
            }
        }

        [AllowAnonymous]
        public ActionResult LogOut()
        {
            WebSecurity.Logout();
            return RedirectToAction("Index", "Home");
        }

        [HttpPost]
        public JObject ChangePassword(ChangePasswordModel model)
        {
            if (!ModelState.IsValid)
            {
                return ExtJS.WriterJObject(false, errors: ExtJS.ModelStateToJObject(ModelState));
            }
            if (WebSecurity.ChangePassword(WebSecurity.CurrentUserName, model.OldPassword, model.NewPassword))
            {
                WebSecurity.Logout();
                return ExtJS.WriterJObject(true);
            }
            else
            {
                return ExtJS.WriterJObject(false, msg: "修改密码失败。");
            }
        }

    }
}
