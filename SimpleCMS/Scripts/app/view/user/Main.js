Ext.define('SimpleCMS.view.user.Main', {
    extend: 'Ext.grid.Panel',
    xtype: 'userMain',
    requires: [
        'Ext.grid.column.*',
        'Ext.grid.plugin.RowEditing',
        'Ext.form.field.*'
    ],

    store: 'Users',
    selType: "checkboxmodel",
    selModel: { checkOnly: false, mode: "MULTI" },

    initComponent: function () {
        var me = this;

        me.columns = [
            {
                text: '用户名', dataIndex: 'UserName', flex: 1,
                editor: { allowBlank: false }
            },
            {
                text: '角色', dataIndex: 'Roles', flex: 1, sortable: false,
                editor: {
                    xtype: 'combo', multiSelect: true, allowBlank: false, editable: false,
                    emptyText: "请选择角色", forceSelection: true, store: ['系统管理员', '编辑', '注册用户']
                }

            },
            { xtype: "datecolumn", text: '创建时间', dataIndex: 'CreateDate', format: "Y-m-d H:i:s", width: 150 },
            {
                xtype: 'checkcolumn', dataIndex: "IsConfirmed", text: "允许登录", winth: 150,
                editor: { xtype: 'checkbox' }
            }
        ];
        
        me.tbar = {
            xtype: "pagingtoolbar", pageSize: 50, displayInfo: true, store: me.store,
            items: [
                '-',
                { iconCls: "simplecms-icon-userAdd", tooltip: '添加用户', itemId: "Add" },
                { iconCls: "simplecms-icon-userDelete", tooltip: '删除用户', itemId: "Delete", disabled: true },
                '-',
                { iconCls: "simplecms-icon-restPassword", tooltip: '重置密码', itemId: "ResetPassword", disabled: true }
            ]
        };

        me.bbar = [
            {
                xtype:'tbtext', style: 'line-height: 30px;color:blue', 
                text: '双击用户可进入编辑状态，用户密码默认为“123456”。重置密码可将用户密码重置为“123456”。'
            }
        ];

        me.rowEditing = new Ext.grid.plugin.RowEditing({
            clicksToMoveEditor: 1,
            autoCancel: false,
            saveBtnText: '保存',
            cancelBtnText: '取消',
            errorsText: '错误',
            dirtyText: "你要确认或取消更改"
        });

        me.plugins = [me.rowEditing];

        me.callParent(arguments);
    }
});
