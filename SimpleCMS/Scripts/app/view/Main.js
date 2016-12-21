Ext.define('SimpleCMS.view.Main', {
    extend: 'Ext.tab.Panel',
    requires: [
        'SimpleCMS.Config',
        'SimpleCMS.view.user.Main',
        'SimpleCMS.ux.imagemanager.View',
        'SimpleCMS.view.content.Main'
    ],
    
    xtype: 'app-main',
    /*
    stateId: 'stateapp-main',
    stateful: true,
    stateEvents: ['tabchange'],
    getState : function()
    {
        if (this.stateful)
        {
            var state = this.callParent() || {};
            state.stateTab = this.activeTab.getId();
            return state;
        }
        return {};
    },
    */
    
    items: [
        {
            title: '文章管理',
            layout: 'border',
            id: 'contentMain',
            //stateId: 'statecontentMain',
            //stateful: true,
            items: [
                {
                    xtype: 'categoryView', id: 'categoryView', region: "west", collapsible: true, width: 200, minWidth: 100, split: true,
                    stateId: 'categoryView', stateful: true
                },
                {
                    region: 'center', title: '文章', id: 'contentView', xtype: 'contentMain',
                    stateId: 'contentView', stateful: true
                }
            ]
        },
        {
            title: '图片管理',
            xtype: 'imageManagerView'
        }
    ],

    initComponent: function () {
        var me = this,
            roles = "." + SimpleCMS.Config.Roles.join('.') + ".";

        if (roles.indexOf(".系统管理员.") >= 0) {
            me.items.push({ title: "用户管理", xtype: 'userMain', id: 'userMain' });
        }

        me.callParent(arguments);
    }

});