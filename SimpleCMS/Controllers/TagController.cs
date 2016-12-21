using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SimpleCMS.Models;
using SimpleCMS.Helper;
using Newtonsoft.Json.Linq;

namespace SimpleCMS.Controllers
{
    [Authorize(Roles = "系统管理员,编辑")]
    public class TagController : Controller
    {
        //
        // GET: /Tag/

        public JObject List()
        {
            using (var ctx = new SimpleCMSContext())
            {
                var q = ctx.T_Tag.OrderBy(m => m.TagName);
                JArray ja = new JArray();
                foreach (var c in q)
                {
                    ja.Add(new JObject(
                        new JProperty("TagId", c.TagId),
                        new JProperty("TagName", c.TagName)
                        ));
                }
                return ExtJS.WriterJObject(true, data: ja);
            }
        }

    }
}
