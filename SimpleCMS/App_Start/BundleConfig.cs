using System.Web.Optimization;

namespace SimpleCMS
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/plupload").Include(
                        "~/Scripts/plupload/js/plupload.js",
                        "~/Scripts/plupload/js/plupload.html4.js",
                        "~/Scripts/plupload/js/plupload.html5.js",
                        "~/Scripts/plupload/js/plupload.flash.js",
                        "~/Scripts/plupload/js/plupload.silverlight.js"
                        ));

            bundles.Add(new ScriptBundle("~/Scripts/tinymce").Include(
                        "~/Scripts/tinymce/tiny_mce.js",
                        "~/Scripts/tinymce/langs/zh.js",
                        "~/Scripts/tinymce/themes/advanced/langs/zh.js"
                        ).IncludeDirectory("~/Scripts/tinymce/plugins/", "*/editor_plugin.js", true)
                        .IncludeDirectory("~/Scripts/tinymce/plugins/", "*/zh_dlg.js", true)
                        );

            bundles.Add(new StyleBundle("~/Scripts/tinymce/themes/advanced/skins/extjs/").Include(
                      "~/Scripts/tinymce/themes/advanced/skins/extjs/*.css",
                      "~/Scripts/tinymce/plugins/inlinepopups/skins/clearlooks2/window.css")
                      );

        }
    }
}