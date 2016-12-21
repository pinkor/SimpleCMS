using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SimpleCMS.Helper;

namespace SimpleCMS.Controllers
{
    public class VerifyCodeController : Controller
    {
        //
        // GET: /VerifyCode/

        public FileContentResult Index()
        {
            VerifyCode v = new VerifyCode();
            string code = v.CreateVerifyCode();                //取随机码
            Session["vcode"] = code;
            v.Padding = 10;
            byte[] bytes = v.CreateImage(code);
            return File(bytes, @"image/jpeg");
        }

    }
}
