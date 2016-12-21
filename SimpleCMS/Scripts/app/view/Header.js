Ext.define('SimpleCMS.view.Header', {
    extend: 'Ext.toolbar.Toolbar',

    xtype: 'app-header',

    items: [
        { xtype: 'tbtext', text: '简单的CMS后台管理系统', cls: 'app-header-title' },
        '->',
        { itemId: 'changePassword', iconCls: 'simplecms-icon-changepassword', tooltip: '修改密码', scale: "large", cls: 'simplecms-header-button', overCls: 'header-button-over' },
        { itemId: 'logout', iconCls: 'simplecms-icon-logout', tooltip: '退出', scale: "large", cls: 'simplecms-header-button', overCls: 'header-button-over' }
    ]
});
