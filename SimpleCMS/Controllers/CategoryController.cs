using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using SimpleCMS.Helper;
using SimpleCMS.Models;

namespace SimpleCMS.Controllers
{
    [Authorize(Roles = "系统管理员,编辑")]
    public class CategoryController : Controller
    {
        //
        // GET: /Category/

        public JObject List()
        {
            int id = 0;
            int.TryParse(Request["node"], out id);
            if (id < 10000 & id != -1)
            {
                return ExtJS.WriterJObject(false, msg: "错误的父节点");
            }
            using (var ctx = new SimpleCMSContext())
            {
                var q = id == -1 ? ctx.T_Category.Where(m => m.HierarchyLevel == 0 & m.State == 0 & m.CategoryId != 10000).OrderBy(m => m.Title)
                    : ctx.T_Category.Where(m => m.ParentId == id & m.State == 0);
                    JArray ja = new JArray();
                    if (id == -1)
                    {
                        ja.Add(new JObject(
                            new JProperty("id", 10000),
                            new JProperty("text" , "未分类")
                            ));
                    }
                    foreach (var c in q.OrderBy(m => m.Title))
                    {
                        ja.Add(new JObject(
                            new JProperty("id", c.CategoryId),
                            new JProperty("text", c.Title)
                        ));
                    }
                    return ExtJS.WriterJObject(true, data: ja);
            }
        }

        [HttpPost]
        public JObject Add(CategoryModel model)
        {
            if (!ModelState.IsValid)
            {
                return ExtJS.WriterJObject(false, errors: ExtJS.ModelStateToJObject(ModelState));
            }
            using (var ctx = new SimpleCMSContext())
            {
                var category = new T_Category()
                {
                    Title = model.Title,
                    Image = model.Image,
                    SortOrder = model.SortOrder,
                    Content = model.Content,
                    Created = DateTime.Now,
                    State = 0
                };
                if (model.ParentId >= 10000) category.ParentId = model.ParentId;
                ctx.T_Category.Add(category);
                ctx.SaveChanges();
                return ExtJS.WriterJObject(true, data: new JObject(
                    new JProperty("id", category.CategoryId),
                    new JProperty("text", category.Title)
                    ));
            }
        }

        public JObject Details()
        {
            int id = 0;
            int.TryParse(Request["id"], out id);
            if (id <= 10000)
            {
                return ExtJS.WriterJObject(false, msg: "错误的类别编号。");
            }
            using (var ctx = new SimpleCMSContext())
            {
                var q = ctx.T_Category.SingleOrDefault(m => m.CategoryId == id & m.State == 0);
                return q == null ? ExtJS.WriterJObject(false, msg: "要编辑的类别不存在或已被删除") :
                    ExtJS.WriterJObject(true, data: new JObject(
                        new JProperty("CategoryId", q.CategoryId),
                        new JProperty("Title", q.Title),
                        new JProperty("Image", q.Image),
                        new JProperty("ParentTitle", q.ParentId == null ? "" : q.Parent.Title),
                        new JProperty("ParentId", q.ParentId == null ? -1 : q.ParentId),
                        new JProperty("SortOrder", q.SortOrder),
                        new JProperty("Content", q.Content),
                        new JProperty("Created", q.Created.ToString("yyyy-MM-dd hh:mm:ss"))
                        ));
            }
        }

        [HttpPost]
        public JObject Edit(CategoryModel model)
        {
            if (!ModelState.IsValid)
            {
                return ExtJS.WriterJObject(false, errors: ExtJS.ModelStateToJObject(ModelState));
            }
            if (!model.CategoryId.HasValue)
            {
                return ExtJS.WriterJObject(false, msg: "要编辑的类别不存在或已被删除");
            }
            using (var ctx = new SimpleCMSContext())
            {
                var category = ctx.T_Category.SingleOrDefault(m => m.CategoryId == model.CategoryId & m.State == 0);
                if (category == null)
                {
                    return ExtJS.WriterJObject(false, msg: "要编辑的类别不存在或已被删除");
                }
                category.Title = model.Title;
                category.Image = model.Image;
                category.SortOrder = model.SortOrder;
                category.Content = model.Content;
                if (model.ParentId >= 10000)
                {
                    category.ParentId = model.ParentId;
                }
                else
                {
                    category.ParentId = null;
                }
                ctx.SaveChanges();
                return ExtJS.WriterJObject(true);
            }
        }

        public JObject Delete()
        {
            int id = 0;
            int.TryParse(Request["id"], out id);
            if (id <= 10000)
            {
                return ExtJS.WriterJObject(false, msg: "错误的文章类别编号");
            }
            using (var ctx = new SimpleCMSContext())
            {
                var category = ctx.T_Category.SingleOrDefault(m => m.CategoryId == id & m.State == 0);
                if (category == null)
                {
                    return ExtJS.WriterJObject(false, msg: "要删除的类别不存在或已被删除");
                }
                var sub = ctx.T_Category.Where(m => m.FullPath.StartsWith(category.FullPath));
                var content = ctx.T_Content.Where(m => sub.Select(n => n.CategoryId).Contains(m.CategoryId));
                foreach (var c in sub)
                {
                    c.State = 1;
                }
                foreach (var c in content)
                {
                    c.CategoryId = 10000;
                }
                ctx.SaveChanges();
                return ExtJS.WriterJObject(true);
            }
        }

        public JObject Drop()
        {
            int destId = 0;
            int.TryParse(Request["Destination"], out destId);
            int sourceId = 0;
            int.TryParse(Request["Source"], out sourceId);
            if ( destId != -1 && destId < 10000 )
            {
                return ExtJS.WriterJObject(false, msg: "错误的目的类别。");
            }
            if (sourceId < 10000)
            {
                return ExtJS.WriterJObject(false, msg: "错误的源类别。");
            }
            using (var ctx = new SimpleCMSContext())
            {
                var source = ctx.T_Category.SingleOrDefault(m => m.CategoryId == sourceId & m.State == 0);
                if (source == null)
                {
                    return ExtJS.WriterJObject(false, msg: "源类别不存在或已被删除。");
                }
                if (destId == -1)
                {
                    source.ParentId = null;
                }
                else
                {
                    var dest = ctx.T_Category.SingleOrDefault(m => m.CategoryId == destId & m.State == 0);
                    if (dest == null)
                    {
                        return ExtJS.WriterJObject(false, msg: "目的类别不存在或已被删除。");
                    }
                    source.ParentId = destId;
                }
                ctx.SaveChanges();
                return ExtJS.WriterJObject(true);
            }
        }

    }
}
