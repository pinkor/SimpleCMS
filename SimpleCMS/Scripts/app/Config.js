Ext.define('SimpleCMS.Config', {
    singleton: true,

    tinymceConfig: {
        theme: 'advanced', //使用高级选项
        language: 'zh',   //使用中文
        inline_styles: true,
        theme_advanced_row_height: 27,
        delta_height: 0,
        convert_urls: false,
        relative_urls: true,

        //要添加那些插件
        plugins: 'autolink,lists,pagebreak,style,layer,table,advhr,advimage,advlink,inlinepopups,media,searchreplace,contextmenu,paste,directionality,noneditable,visualchars,nonbreaking,advlist,ImageSelect',

        // 样式选项，用来设置显示那些操作按钮
        theme_advanced_buttons1: 'bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect',
        theme_advanced_buttons2: 'cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,code,|,forecolor,backcolor',
        theme_advanced_buttons3: 'tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,media,advhr,|,ltr,rtl,|,ImageSelectButton',
        theme_advanced_buttons4: '',
        theme_advanced_toolbar_location: 'top',
        theme_advanced_toolbar_align: 'left',
        theme_advanced_statusbar_location: 'bottom',
    },

    /*
    stateSeed: 1,
    stateHistory: {},
    currentStateValue: {},
    tokens: []
    */
})
