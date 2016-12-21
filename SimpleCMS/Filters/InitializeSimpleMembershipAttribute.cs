using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Threading;
using System.Web.Mvc;
using WebMatrix.WebData;
using SimpleCMS.Models;
using System.Web.Security;

namespace SimpleCMS.Filters
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
    public sealed class InitializeSimpleMembershipAttribute : ActionFilterAttribute
    {
        private static SimpleMembershipInitializer _initializer;
        private static object _initializerLock = new object();
        private static bool _isInitialized;

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            // 确保每次启动应用程序时只初始化一次 ASP.NET Simple Membership
            LazyInitializer.EnsureInitialized(ref _initializer, ref _isInitialized, ref _initializerLock);
        }

        private class SimpleMembershipInitializer
        {
            public SimpleMembershipInitializer()
            {
                //Database.SetInitializer<SimpleCMSContext>(null);

                try
                {
                    using (var context = new SimpleCMSContext())
                    {
                        if (!context.Database.Exists())
                        {
                            // 创建不包含 Entity Framework 迁移架构的 SimpleMembership 数据库
                            ((IObjectContextAdapter)context).ObjectContext.CreateDatabase();
                        }
                    }

                    WebSecurity.InitializeDatabaseConnection("SimpleCMSContext", "UserProfile", "UserId", "UserName", autoCreateTables: false);


                    #region 用户自行添加权限设置
                    var roles = (SimpleRoleProvider)Roles.Provider;
                    var membership = (SimpleMembershipProvider)Membership.Provider;
                    string[] rolesAll = new string[] { "系统管理员", "编辑", "注册用户" };
                    foreach (var c in rolesAll)
                    {
                        if (!roles.RoleExists(c))
                        {
                            roles.CreateRole(c);
                        }
                    }
                    if (membership.GetUser("Admin", false) == null)
                    {
                        membership.CreateUserAndAccount("Admin", "123456");
                        roles.AddUsersToRoles(new string[] { "Admin" }, new string[] { "系统管理员" });
                    }
                    if (membership.GetUser("test", false) == null)
                    {
                        membership.CreateUserAndAccount("test", "123456");
                        roles.AddUsersToRoles(new string[] { "test" }, new string[] { "编辑" });
                    }
                    if (membership.GetUser("reguser", false) == null)
                    {
                        membership.CreateUserAndAccount("reguser", "123456");
                        roles.AddUsersToRoles(new string[] { "reguser" }, new string[] { "注册用户" });
                    } 
                    #endregion
                }
                catch (Exception ex)
                {
                    throw new InvalidOperationException("无法初始化 ASP.NET Simple Membership 数据库。有关详细信息，请参阅 http://go.microsoft.com/fwlink/?LinkId=256588", ex);
                }
            }
        }
    }
}
