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
    public class FileController : Controller
    {
        //
        // GET: /File/

        private string root = AppSettings.GetSettingAsString("ImagePath") ?? "~/upload";

        public JObject List()
        {
            string path = Request["Path"] ?? "";
            if (string.IsNullOrEmpty(path))
            {
                return ExtJS.WriterJObject(false, msg: "清选择目录。");
            }
            DirectoryInfo dir = new DirectoryInfo(Server.MapPath(root + path));
            if (dir.Exists)
            {
                var q = dir.GetFiles();
                JArray ja = new JArray();
                foreach (var c in q)
                {
                    ja.Add(new JObject(
                        new JProperty("id", path + c.Name),
                        new JProperty("path", path),
                        new JProperty("Name", c.Name),
                        new JProperty("LastWriteTime", c.LastWriteTime.ToString("yyyy-MM-dd hh:mm:ss")),
                        new JProperty("Length", c.Length)
                        ));
                }
                return ExtJS.WriterJObject(true, data: ja);
            }
            else
            {
                return ExtJS.WriterJObject(false, msg: "目录不存在或已被删除。");
            }
        }

        [HttpPost]
        public JObject Search(FileSearchModel model)
        {
            if (!ModelState.IsValid)
            {
                return ExtJS.WriterJObject(false, errors: ExtJS.ModelStateToJObject(ModelState));
            }
            if (string.IsNullOrEmpty(model.FileName) & !model.StartDate.HasValue & !model.EnddDate.HasValue & !model.Length.HasValue)
            {
                return ExtJS.WriterJObject(false, errors: new JObject(
                    new JProperty("Filename", "搜索要指定至少一个条件。")
                    ));
            }
            string path = Server.MapPath(root);
            DirectoryInfo dir = new DirectoryInfo(path);
            var q = dir.EnumerateFiles(model.FileName ?? "*", SearchOption.AllDirectories);
            if (model.StartDate.HasValue)
            {
                q = q.Where(m => m.LastWriteTime >= model.StartDate);
            }
            if (model.EnddDate.HasValue)
            {
                q = q.Where(m => m.LastWriteTime <= model.EnddDate);
            }
            if (model.Length.HasValue)
            {
                int index = (int)model.Length;
                int[] valueList = new int[] { 0, 10240, 102400, 1048576, 5242880, 10485760 };
                if (index == 0)
                {
                    q = q.Where(m => m.Length == 0);
                }
                else if (index > 0 & index < 6)
                {
                    q = q.Where(m => m.Length > valueList[index - 1] & m.Length <= valueList[index]);
                }
                else
                {
                    q = q.Where(m => m.Length > valueList[5]);
                }
            }
            JArray ja = new JArray();
            foreach (var c in q)
            {
                ja.Add(new JObject(
                    new JProperty("id", c.FullName.Replace(path + "\\", "/").Replace("\\", "/")),
                    new JProperty("path", c.DirectoryName.Replace(path, "").Replace("\\", "/") + "/"),
                    new JProperty("Name", c.Name),
                    new JProperty("LastWriteTime", c.LastWriteTime.ToString("yyyy-MM-dd hh:mm:ss")),
                    new JProperty("Length", c.Length)
                    ));
            }
            return ExtJS.WriterJObject(true, data: ja);
        }

        public JObject Rename()
        {
            string filename = Request["File"] ?? "";
            string newName = Request["NewName"] ?? "";
            if (string.IsNullOrEmpty(filename) | string.IsNullOrEmpty(newName))
            {
                return ExtJS.WriterJObject(false, msg: "提交值错误。");
            }
            FileInfo file = new FileInfo(Server.MapPath(root + filename));
            if (file.Exists)
            {
                string newPath = file.DirectoryName + "\\" + newName;
                FileInfo newfile = new FileInfo(newPath);
                if (newfile.Exists)
                {
                    return ExtJS.WriterJObject(false, msg: "文件“" + newName + "”已存在。");
                }
                else
                {
                    file.MoveTo(newPath);
                    return ExtJS.WriterJObject(true);
                }
            }
            else
            {
                return ExtJS.WriterJObject(false, msg: "要修改的文件不存在或已被删除。");
            }
        }

        public JObject Drop()
        {
            string destinationPath = Request["Destination"] ?? "";
            string source = Request["Source"] ?? "";
            if (String.IsNullOrEmpty(destinationPath))
            {
                return ExtJS.WriterJObject(false, msg: "错误的目的目录。");
            }
            if (String.IsNullOrEmpty(source))
            {
                return ExtJS.WriterJObject(false, msg: "错误的源文件。");
            }
            string[] files = source.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);
            if (files.Length > 0)
            {
                DirectoryInfo dir = new DirectoryInfo(Server.MapPath(root + destinationPath));
                if (dir.Exists)
                {
                    string msg = "";
                    foreach (var c in files)
                    {
                        FileInfo file = new FileInfo(Server.MapPath(root + c));
                        if (file.Exists)
                        {
                            string newPath = dir.FullName + "\\" + file.Name;
                            FileInfo newFile = new FileInfo(newPath);
                            if (newFile.Exists)
                            {
                                msg += "目的目录存在与文件“" + file.Name + "”同名文件，不能移动。</br>";
                            }
                            else
                            {
                                file.MoveTo(newPath);
                            }
                        }
                        else
                        {
                            msg += "文件“" + file.Name + "”不存在或已被删除。</br>";
                        }
                    }
                    return ExtJS.WriterJObject(true, msg: msg);
                }
                else
                {
                    return ExtJS.WriterJObject(false, msg: "目的目录不存在或已被删除。");
                }
            }
            else
            {
                return ExtJS.WriterJObject(false, msg: "错误的源文件。");
            }
        }

        public JObject Delete()
        {
            string filesString = Request["Files"] ?? "";
            if (String.IsNullOrEmpty(filesString))
            {
                return ExtJS.WriterJObject(false, msg: "错误的提交值。");
            }
            string[] files = filesString.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);
            if (files.Length > 0)
            {
                foreach (var c in files)
                {
                    FileInfo file = new FileInfo(Server.MapPath(root + c));
                    if (file.Exists)
                    {
                        file.Delete();
                    }
                }
                return ExtJS.WriterJObject(true);
            }
            else
            {
                return ExtJS.WriterJObject(false, msg: "错误的提交值。");
            }
        }

        public JObject Upload()
        {
            string path = Request["Path"] ?? "";
            string dir = Server.MapPath(root + path);
            if (Directory.Exists(dir))
            {
                HttpPostedFileBase file = Request.Files["file"];
                string filename = file.FileName.ToLower();
                string extname = filename.Substring(filename.LastIndexOf(".") + 1, 3);
                if (file.ContentLength <= 0)
                {
                    return ExtJS.WriterJObject(false, msg: "不允许上传0字节文件。");
                }
                if (file.ContentLength > 10485760)
                {
                    return ExtJS.WriterJObject(false, msg: "文件超过了10M。");
                }
                string[] filetypes = { "jpg", "gif", "png", "bmp" };
                if (!filetypes.Contains(extname))
                {
                    return ExtJS.WriterJObject(false, msg: "文件类型错误。");
                }
                file.SaveAs(dir + "\\" + filename);
                return ExtJS.WriterJObject(true);
            }
            else
            {
                return ExtJS.WriterJObject(false, msg: "保存目录不存在或已被删除。");
            }
        }

    }
}
