using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using SimpleCMS.Helper;
using SimpleCMS.Models;
using System.Linq.Dynamic;
using WebMatrix.WebData;
using System.Web.Security;

namespace SimpleCMS.Controllers
{
    [Authorize(Roles = "系统管理员,编辑")]
    public class UserController : Controller
    {
        //
        // GET: /User/

        private string[] sortFields = new string[] { "UserName", "CreateDate", "IsConfirmed" };

        public JObject List()
        {
            int pagesize = 50;
            int start = 0;
            int.TryParse(Request["start"], out start);
            int total = 0;
            string sort = ExtJS.parseSorter(sortFields, Request["sort"] ?? "" , "it.UserName ASC", "");
            JArray ja = new JArray();
            using (var ctx = new SimpleCMSContext())
            {
                total = ctx.UserProfiles.Count();
                var q = ctx.UserProfiles.Select(m => new
                {
                    id = m.UserId,
                    UserName = m.UserName,
                    CreateDate = m.webpages_Membership.CreateDate,
                    IsConfirmed = m.webpages_Membership.IsConfirmed,
                    Roles = m.webpages_Roles
                });
                if (start < total)
                {
                    foreach (var c in q.OrderBy(sort).Skip(start).Take(pagesize))
                    {
                        JObject jo = new JObject(
                            new JProperty("id", c.id),
                            new JProperty("UserName", c.UserName),
                            new JProperty("CreateDate", String.Format("{0:yyyy-MM-dd hh:mm:ss}", c.CreateDate)),
                            new JProperty("IsConfirmed", c.IsConfirmed),
                            new JProperty("Roles", new JArray(c.Roles.Select(m => m.RoleName)))
                            );
                        ja.Add(jo);
                    }
                }
            }
            return  ExtJS.WriterJObject(true, total: total, data: ja);
        }

        public JObject Add()
        {
            JObject jo = ExtJS.parseDataToJObject(Request["data"] ?? "");
            if (jo.HasValues)
            {
                string username = (string)jo["UserName"];
                using (var ctx = new SimpleCMSContext())
                {
                    var user = ctx.UserProfiles.SingleOrDefault(m => m.UserName.ToLower() == username.ToLower());
                    if (user == null)
                    {
                        var newuser = new UserProfile() { UserName = username };
                        var membership = new webpages_Membership()
                        {
                            UserId = newuser.UserId,
                            Password = "",
                            CreateDate = DateTime.Now,
                            PasswordSalt = "",
                            IsConfirmed = (bool)jo["IsConfirmed"]
                        };
                        ctx.UserProfiles.Add(newuser);
                        ctx.webpages_Membership.Add(membership);
                        var roles = ((JArray)jo["Roles"]).Values<string>();
                        var rolesInTable = ctx.webpages_Roles.Where(m => roles.Contains(m.RoleName));
                        foreach (var c in rolesInTable)
                        {
                            newuser.webpages_Roles.Add(c);
                        }
                        ctx.SaveChanges();
                        string token = WebSecurity.GeneratePasswordResetToken(username);
                        WebSecurity.ResetPassword(token, "123456");
                        jo["CreateDate"] = String.Format("{0:yyyy-MM-dd hh:mm:ss}", membership.CreateDate);
                        jo["id"] = newuser.UserId;
                        return ExtJS.WriterJObject(true, data: new JArray(jo));
                    }
                    else
                    {
                        return ExtJS.WriterJObject(false, msg: "用户名已存在，请使用别的用户名创建用户。");
                    }
                }
            }
            else
            {
                return ExtJS.WriterJObject(false, msg: "错误的提交数据。");
            }
        }

        public JObject Edit()
        {
            JObject jo = ExtJS.parseDataToJObject(Request["data"] ?? "");
            if (jo.HasValues)
            {
                int id = (int)jo["id"];
                string username = (string)jo["UserName"];
                using (var ctx = new SimpleCMSContext())
                {
                    var user = ctx.UserProfiles.SingleOrDefault(m => m.UserName.ToLower() == username.ToLower() & m.UserId != id);
                    if (user == null)
                    {
                        var edituser = ctx.UserProfiles.SingleOrDefault(m => m.UserId == id);
                        if (edituser != null)
                        {
                            edituser.UserName = username;
                            edituser.webpages_Membership.IsConfirmed = (bool)jo["IsConfirmed"];
                            edituser.webpages_Roles.Clear();
                            var roles = ((JArray)jo["Roles"]).Values<string>();
                            var rolesInTable = ctx.webpages_Roles.Where(m => roles.Contains(m.RoleName));
                            foreach (var c in rolesInTable)
                            {
                                edituser.webpages_Roles.Add(c);
                            }
                            ctx.SaveChanges();
                            return ExtJS.WriterJObject(true, data: new JArray(jo));
                        }
                        else
                        {
                            return ExtJS.WriterJObject(false, msg: "要编辑的用户不存在或已被删除。");
                        }
                    }
                    else
                    {
                        return ExtJS.WriterJObject(false, msg: "用户名已存在，请使用别的用户名。");
                    }
                }
            }
            else
            {
                return ExtJS.WriterJObject(false, msg: "错误的提交数据。");
            }
        }

        public JObject Delete()
        {
            var idList = ExtJS.splitStringToList<int>(Request["data"] ?? String.Empty, new char[] { ',' });
            if (idList.Count > 0)
            {
                using (var ctx = new SimpleCMSContext())
                {
                    var q = ctx.UserProfiles.Where(m => idList.Contains(m.UserId));
                    foreach (var c in q)
                    {
                        ctx.webpages_Membership.Remove(c.webpages_Membership);
                        c.webpages_Roles.Clear();
                        ctx.UserProfiles.Remove(c);
                    }
                    ctx.SaveChanges();
                    return ExtJS.WriterJObject(true);
                }
            }
            else
            {
                return ExtJS.WriterJObject(false, msg: "错误的提交数据");
            }
        }

        public JObject ResetPassword()
        {
            string data = Request["data"] ?? String.Empty;
            if (string.IsNullOrEmpty(data))
            {
                return ExtJS.WriterJObject(false, msg: "错误的提交数据");
            }
            string[] list = data.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
            foreach (var c in list)
            {
                if (WebSecurity.UserExists(c) & WebSecurity.IsConfirmed(c))
                {
                    string token = WebSecurity.GeneratePasswordResetToken(c);
                    WebSecurity.ResetPassword(token, "123456");
                }
            }
            return ExtJS.WriterJObject(true);
        }

        public JObject CheckChange()
        {
            int id = 0;
            int.TryParse(Request["data"], out id);
            if (id == 0)
            {
                return ExtJS.WriterJObject(false, msg: "错误的提交数据。");
            }
            using (var ctx = new SimpleCMSContext())
            {
                var user = ctx.UserProfiles.SingleOrDefault(m => m.UserId == id);
                if (user != null)
                {
                    user.webpages_Membership.IsConfirmed = !user.webpages_Membership.IsConfirmed;
                    ctx.SaveChanges();
                    return ExtJS.WriterJObject(true);
                }
                else
                {
                    return ExtJS.WriterJObject(false, msg: "用户不存在或已被删除。");
                }
            }
        }

        
    }
}
