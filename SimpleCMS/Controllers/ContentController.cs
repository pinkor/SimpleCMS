using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using SimpleCMS.Helper;
using SimpleCMS.Models;
using System.Linq.Dynamic;

namespace SimpleCMS.Controllers
{
    [Authorize(Roles = "系统管理员,编辑")]
    public class ContentController : Controller
    {
        //
        // GET: /Content/
        /*
        [AllowAnonymous]
        public Boolean Index()
        {
            using (var ctx = new SimpleCMSContext())
            {
                Random ro = new Random();
                for (int i = 0; i < 2000; i++)
                {
                    T_Content content = new T_Content()
                    {
                        Title = "文章" + i.ToString(),
                        Image = "",
                        Content = "内容" + i.ToString(),
                        Summary = "摘要" + i.ToString(),
                        CategoryId = 10000,
                        Created = DateTime.Now.AddDays(-1 * ro.Next(1, 365)),
                        Hits = ro.Next(1, 10000),
                        SortOrder = ro.Next(1, 1000),
                        State = 0,
                    };
                    ctx.T_Content.Add(content);
                }
                ctx.SaveChanges();
            }
            return true;
        }
        */

        private List<SearchObject> searchObject = new List<SearchObject> 
        { 
            new SearchObject{Field = "CategoryId", SearchString= "it.CategoryId {0} @0" , FieldType = typeof(int)},
            new SearchObject{Field = "Title", SearchString= "it.Title.{0}(@0)" , FieldType = typeof(string)},
            new SearchObject{Field = "Content", SearchString= "it.Content.{0}(@0)" , FieldType = typeof(string)},
            new SearchObject{Field = "Summary", SearchString= "it.Summary.{0}(@0)" , FieldType = typeof(string)},
            new SearchObject{Field = "Created", SearchString= "it.Created {0} @0" , FieldType = typeof(DateTime)},
            new SearchObject{Field = "SortOrder", SearchString= "it.SortOrder {0} @0" , FieldType = typeof(int)},
            new SearchObject{Field = "Hits", SearchString= "it.Hits {0} @0" , FieldType = typeof(int)},
            new SearchObject{Field = "Tags", SearchString= "it.T_Tag.Any(TagName.{0}(@0))" , FieldType = typeof(string)}
        };

        public JObject List()
        {
            int pagesize = 100;
            int start = 0;
            int.TryParse(Request["start"], out start);
            string sort = Request["sort"] ?? "";
            sort = ExtJS.parseSorter(new string[] { "ContentId", "Title", "Created", "SortOrder", "Hits" }, sort, "it.ContentId DESC", "");
            string filterStr = Request["filter"] ?? "";
            int total = 0;
            JArray ja = new JArray();
            using (var ctx = new SimpleCMSContext())
            {
                var q = ctx.T_Content.Where(m => m.State == 0);
                ExtJS.parseFilter<T_Content>(searchObject, filterStr, ref q);
                total = q.Count();
                if (start < total)
                {
                    foreach (var c in q.OrderBy(sort).Skip(start).Take(pagesize))
                    {
                        JObject jo = new JObject(
                            new JProperty("ContentId", c.ContentId),
                            new JProperty("CategoryId", c.CategoryId),
                            new JProperty("Title", c.Title),
                            new JProperty("Created", String.Format("{0:yyyy-MM-dd hh:mm:ss}", c.Created)),
                            new JProperty("Hits", c.Hits),
                            new JProperty("SortOrder", c.SortOrder),
                            new JProperty("Tags", new JArray(c.T_Tag.Select(m => m.TagName)))
                            );
                        ja.Add(jo);
                    }
                }
                return ExtJS.WriterJObject(true, total: total, data: ja);
            }
        }

        [HttpPost]
        public JObject Add(ContentModel model)
        {
            if (!ModelState.IsValid)
            {
                return ExtJS.WriterJObject(false, errors: ExtJS.ModelStateToJObject(ModelState));
            }
            using (var ctx = new SimpleCMSContext())
            {
                var content = new T_Content()
                {
                    Title = model.Title,
                    Image = model.Image,
                    SortOrder = model.SortOrder,
                    Content = model.Content,
                    Summary = model.Summary,
                    CategoryId = model.CategoryId == -1 ? 10000 : model.CategoryId,
                    Created = DateTime.Now,
                    State = 0
                };
                ctx.T_Content.Add(content);
                string[] tags = model.Tags.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
                if (tags.Count() > 0)
                {
                    //先搜索标签表已存在的记录
                    var q = ctx.T_Tag.Where(m => tags.Contains(m.TagName));
                    foreach (var c in q)
                    {
                        content.T_Tag.Add(c);
                    }
                    //再搜索标签表内不存在的标签
                    var qq = tags.Where(m => !q.Select(n => n.TagName).Contains(m));
                    foreach (var c in qq)
                    {
                        T_Tag tag = new T_Tag { TagName = c };
                        ctx.T_Tag.Add(tag);
                        content.T_Tag.Add(tag);
                    }
                }
                ctx.SaveChanges();
                return ExtJS.WriterJObject(true);
            }
        }

        public JObject Details()
        {
            int id = 0;
            int.TryParse(Request["id"], out id);
            using (var ctx = new SimpleCMSContext())
            {
                var q = ctx.T_Content.SingleOrDefault(m => m.ContentId == id & m.State == 0);
                return q == null ? ExtJS.WriterJObject(false, msg: "要编辑的文章不存在或已被删除") :
                    ExtJS.WriterJObject(true, data: new JObject(
                        new JProperty("ContentId", q.ContentId),
                        new JProperty("Title", q.Title),
                        new JProperty("Image", q.Image),
                        new JProperty("CategoryTitle", q.T_Category.Title),
                        new JProperty("CategoryId", q.CategoryId),
                        new JProperty("SortOrder", q.SortOrder),
                        new JProperty("Summary", q.Summary),
                        new JProperty("Content", q.Content),
                        new JProperty("Tags", new JArray(q.T_Tag.Select(m => m.TagName))),
                        new JProperty("Created", q.Created.ToString("yyyy-MM-dd hh:mm:ss"))
                        ));
            }
        }

        [HttpPost]
        public JObject Edit(ContentModel model)
        {
            if (!ModelState.IsValid)
            {
                return ExtJS.WriterJObject(false, errors: ExtJS.ModelStateToJObject(ModelState));
            }
            if (!model.ContentId.HasValue)
            {
                return ExtJS.WriterJObject(false, msg: "要编辑的文章不存在或已被删除");
            }
            using (var ctx = new SimpleCMSContext())
            {
                var content = ctx.T_Content.SingleOrDefault(m => m.ContentId == model.ContentId & m.State == 0);
                if (content == null)
                {
                    return ExtJS.WriterJObject(false, msg: "要编辑的文章不存在或已被删除");
                }
                string[] tags = model.Tags.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
                if (tags.Count() > 0)
                {
                    //选择已关联，且新的标签不再关联的记录，操作：删除
                    var t = ctx.T_Tag.Where(m => m.T_Content.Select(n => n.ContentId).Contains((int)model.ContentId) & !tags.Contains(m.TagName));
                    foreach (var c in t)
                    {
                        c.T_Content.Remove(content);

                    }
                    //选择没有关联，且新标签需要关联的记录，操作：添加
                    var q = ctx.T_Tag.Where(m => !m.T_Content.Select(n => n.ContentId).Contains((int)model.ContentId) & tags.Contains(m.TagName));
                    foreach (var c in q)
                    {
                        c.T_Content.Add(content);
                    }

                    //选择在T_Tag已含有的标签
                    var tt = ctx.T_Tag.Where(n => tags.Contains(n.TagName));
                    //选择还没有包含在T_Tag中的标签
                    var qq = tags.Where(m => !tt.Select(n => n.TagName).Contains(m));
                    foreach (var c in qq)
                    {
                        T_Tag tag = new T_Tag { TagName = c };
                        ctx.T_Tag.Add(tag);
                        content.T_Tag.Add(tag);
                    }
                    content.Title = model.Title;
                    content.Image = model.Image;
                    content.SortOrder = model.SortOrder;
                    content.Summary = model.Summary;
                    content.Content = model.Content;
                    content.CategoryId = model.CategoryId == -1 ? 10000 : model.CategoryId;
                    ctx.SaveChanges();
                }
                return ExtJS.WriterJObject(true);
            }
        }

        public JObject Delete()
        {
            var ids = ExtJS.splitStringToList<int>(Request["id"] ?? "", new char[] { ',' });
            if (ids.Count() == 0)
            {
                return ExtJS.WriterJObject(false, msg: "错误的文章编号");
            }
            using (var ctx = new SimpleCMSContext())
            {
                var q = ctx.T_Content.Where(m => ids.Contains(m.ContentId) & m.State == 0);
                foreach (var c in q)
                {
                    c.State = 1;
                }
                ctx.SaveChanges();
                return ExtJS.WriterJObject(true);
            }
        }

        public JObject Drop()
        {
            int destId = 0;
            int.TryParse(Request["Destination"], out destId);
            if (destId == -1) destId = 10000;
            var ids = ExtJS.splitStringToList<int>(Request["Source"], new char[] { ',' });
            if (destId < 10000)
            {
                return ExtJS.WriterJObject(false, msg: "错误的类别。");
            }
            if (ids.Count() == 0)
            {
                return ExtJS.WriterJObject(false, msg: "请选择要移动的文章。");
            }
            using (var ctx = new SimpleCMSContext())
            {
                if (destId > 10000)
                {
                    var dest = ctx.T_Category.SingleOrDefault(m => m.CategoryId == destId & m.State == 0);
                    if (dest == null)
                    {
                        return ExtJS.WriterJObject(false, msg: "类别不存在或已被删除。");
                    }
                }
                var source = ctx.T_Content.Where(m => ids.Contains(m.ContentId) & m.State == 0);
                foreach (var c in source)
                {
                    c.CategoryId = destId;
                }
                ctx.SaveChanges();
                return ExtJS.WriterJObject(true);
            }
        }

    }
}
