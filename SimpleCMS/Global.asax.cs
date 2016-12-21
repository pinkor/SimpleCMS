using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Optimization;
using System.IO;
using SimpleCMS.Helper;
using Elmah;

namespace SimpleCMS
{
    // 注意: 有关启用 IIS6 或 IIS7 经典模式的说明，
    // 请访问 http://go.microsoft.com/?LinkId=9394801
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            CreateRootFolder();
        }

        private void CreateRootFolder()
        {
            string path = Server.MapPath(AppSettings.GetSettingAsString("ImagePath") ?? "~/upload");
            var dir = new DirectoryInfo(path);
            if (!dir.Exists)
            {
                dir.Create();
            }
        }

        protected void Application_Error(object sender, EventArgs e)
        {
            bool isAjaxCall = string.Equals("XMLHttpRequest", Context.Request.Headers["x-requested-with"], StringComparison.OrdinalIgnoreCase);
            Exception exception = Server.GetLastError();
            Response.Clear();
            ErrorSignal.FromCurrentContext().Raise(new System.ApplicationException(exception.Message + exception.StackTrace, exception)); 
            var httpStatusCode = (exception is HttpException) ? (exception as HttpException).GetHttpCode() : 500;
            string msg = "";
            switch (httpStatusCode)
            {
                case 403:
                    msg = "没有访问权限。";
                    break;
                case 404:
                    msg = "没有找到页面。";
                    break;
                case 500:
                    msg = "服务器内部错误。";
                    break;
                default:
                    msg = "发生错误。";
                    break;
            }

            Server.ClearError();
            if (isAjaxCall)
            {
                Response.Write(ExtJS.WriterJObject(false, msg: msg).ToString()); ;
            }
            else
            {
                Response.Charset = "utf-8";
                Response.Write(msg);
            }
            Response.End();

        }

    }

}