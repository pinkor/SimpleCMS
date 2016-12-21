using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using SimpleCMS.Helper;
using SimpleCMS.Models;
using System.IO;

namespace SimpleCMS.Controllers
{
    [Authorize(Roles = "系统管理员,编辑")]
    public class FolderController : Controller
    {
        //
        // GET: /Folder/

        private string root = AppSettings.GetSettingAsString("ImagePath") ?? "~/upload";

        public ActionResult Index()
        {
            return View();
        }

        public JObject List()
        {
            string path = Request["node"];
            if (string.IsNullOrEmpty(path))
            {
                return ExtJS.WriterJObject(false, msg: "错误的提交值。");
            }
            DirectoryInfo dir = new DirectoryInfo(Server.MapPath(root + path));
            JArray ja = new JArray();
            foreach (var c in dir.GetDirectories())
            {
                ja.Add(new JObject { 
				    new JProperty("id",path+c.Name +"/"),
				    new JProperty("text",c.Name)
			    });
            }
            return ExtJS.WriterJObject(true, data: ja);
        }

        [HttpPost]
        public JObject Add(FolderModel model)
        {
            if (!ModelState.IsValid)
            {
                return ExtJS.WriterJObject(false, errors: ExtJS.ModelStateToJObject(ModelState));
            }

            if (String.IsNullOrEmpty(model.Path))
            {
                return ExtJS.WriterJObject(false, msg: "请选择父目录。");
            }
            DirectoryInfo dir = new DirectoryInfo(Server.MapPath(root + model.Path));
            if (dir.Exists)
            {
                DirectoryInfo subdir = new DirectoryInfo(Server.MapPath(root + model.Path + model.Name));
                if (subdir.Exists)
                {
                    return ExtJS.WriterJObject(false, errors: new JObject(
                        new JProperty("Name", string.Format("目录名称“{0}”已存在。", model.Name))
                        ));
                }
                subdir.Create();
                return ExtJS.WriterJObject(true, data: new JObject(
                    new JProperty("id", model.Path + model.Name + "/"),
                    new JProperty("text", model.Name)
                    ));
            }
            else
            {
                return ExtJS.WriterJObject(false, msg: "父目录不存在。");
            }
        }

        [HttpPost]
        public JObject Edit(FolderModel model)
        {
            if (!ModelState.IsValid)
            {
                return ExtJS.WriterJObject(false, errors: ExtJS.ModelStateToJObject(ModelState));
            }

            if (String.IsNullOrEmpty(model.Path))
            {
                return ExtJS.WriterJObject(false, msg: "请选择要编辑的目录。");
            }
            string oldPath = Server.MapPath(root + model.Path);
            DirectoryInfo dir = new DirectoryInfo(oldPath);
            if (dir.Exists)
            {
                string path = model.Path.Substring(0, model.Path.LastIndexOf(dir.Name)) + model.Name + "/";
                string newPath = Server.MapPath(root + path);
                DirectoryInfo newdir = new DirectoryInfo(newPath);
                if (newdir.Exists)
                {
                    return ExtJS.WriterJObject(false, errors: new JObject(
                        new JProperty("Name", string.Format("目录名称“{0}”已存在。", model.Name))
                        ));
                }
                Directory.Move(oldPath, newPath);
                return ExtJS.WriterJObject(true, data: new JObject(
                    new JProperty("id", path),
                    new JProperty("text", model.Name)
                    ));
            }
            else
            {
                return ExtJS.WriterJObject(false, msg: "要编辑的目录不存在或已被删除。");
            }
        }

        public JObject Delete()
        {
            string path = Request["Path"] ?? "";
            if (String.IsNullOrEmpty(path))
            {
                return ExtJS.WriterJObject(false, msg: "请选择要删除的目录。");
            }
            DirectoryInfo dir = new DirectoryInfo(Server.MapPath(root + path));
            if (dir.Exists)
            {
                dir.Delete(true);
                return ExtJS.WriterJObject(true);
            }
            else
            {
                return ExtJS.WriterJObject(false, msg: "要删除的目录不存在或已被删除。");
            }
        }

        public JObject Drop()
        {
            string destinationPath = Request["Destination"] ?? "";
            string sourcePath = Request["Source"] ?? "";
            if (String.IsNullOrEmpty(destinationPath))
            {
                return ExtJS.WriterJObject(false, msg: "错误的目的目录。");
            }
            if (String.IsNullOrEmpty(sourcePath))
            {
                return ExtJS.WriterJObject(false, msg: "错误的源目录。");
            }
            DirectoryInfo destination = new DirectoryInfo(Server.MapPath(root + destinationPath));
            if (destination.Exists)
            {
                DirectoryInfo source = new DirectoryInfo(Server.MapPath(root + sourcePath));
                if (source.Exists)
                {
                    string path = destination.FullName + "/" + source.Name;
                    DirectoryInfo check = new DirectoryInfo(path);
                    if (check.Exists)
                    {
                        return ExtJS.WriterJObject(false, msg: "已存在同名目录，不能移动。");
                    }
                    else
                    {
                        Directory.Move(source.FullName, check.FullName);
                        return ExtJS.WriterJObject(true);
                    }
                }
                else
                {
                    return ExtJS.WriterJObject(false, msg: "要移动的源目录不存在。");
                }
            }
            else
            {
                return ExtJS.WriterJObject(false, msg: "要移动的目的目录不存在。");
            }
        }


    }
}
