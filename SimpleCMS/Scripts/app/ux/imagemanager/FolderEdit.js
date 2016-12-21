Ext.define('SimpleCMS.ux.imagemanager.FolderEdit', {
    extend: 'Ext.window.Window',
    alternateClassName: 'SimpleCMS.ImageManagerFolderEdit',
    singleton: true,

    requires: [
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.container.Container',
        'Ext.toolbar.*',
        'Ext.button.*',
        'Ext.layout.container.Fit',
        'SimpleCMS.ux.data.FailureProcess',
        'SimpleCMS.ux.imagemanager.model.Folder'
    ],

    modal: true,
    closable: true,
    resizable: false,
    closeAction: 'hide',
    hideMode: 'offsets',
    layout: 'fit',
    title: '',
    width: 400,
    height: 200,

    initComponent: function () {
        var me = this;
        me.form = new Ext.form.Panel({
            border: false,
            trackResetOnLoad: true,
            bodyPadding: 5,
            defaultType: 'textfield',
            fieldDefaults: {
                labelWidth: 80,
                labelSeparator: '：',
                anchor: '0',
                allowBlank: false,
                labelAlign: 'top',
            },
            items: [
	            {
	                fieldLabel: '请输入目录名称：', name: 'Name', regex: /^(\w+\.?)*\w+$/, regexText: '请输入正确的目录名称', maxLength: 100
	            },
	            {
	                xtype: 'container', anchor: '-5', html: '目录名称允许的字符包括：小写字母、大写字母、小数点（.）和底线（_）。', style: 'color:#00f'
	            }
            ],
            dockedItems: [{
                xtype: 'toolbar', dock: 'bottom', ui: 'footer', layout: { pack: 'center' },
                items: [
                    { text: '保存', width: 80, disabled: true, formBind: true, handler: me.onSave, scope: me },
                    { text: '重置', width: 80, handler: me.onReset, scope: me }
                ]
            }]
        });

        me.items = [me.form];

        me.callParent(arguments);

        me.firstField = me.form.down('textfield');
        me.on('show', me.onMyShow, me);
    },

    onReset: function () {
        var me = this;
        me.form.getForm().reset();
        me.firstField.focus(true, 10);
    },

    onSave: function () {
        var me = this,
            f = me.form.getForm();
        if (f.isValid()) {
            f.submit({
                url: "Folder/" + ( me.title == '添加目录' ? 'Add' : 'Edit'),
                waitMsg: "正在保存，请等待……",
                waitTitle: "正在保存",
                params:{ Path : me.node.data.id},
                success: function (form, action) {
                    var me = this;
                    if (me.title == '添加目录') {
                        if (me.node.isExpanded()) {
                            var newnode = new SimpleCMS.ux.imagemanager.model.Folder(action.result.data);
                            me.node.appendChild(newnode);
                        } else {
                            me.node.expand();
                        }
                    } else {
                        /*
                        //重新加载父节点
                        Ext.getStore('Folders').load({ node: me.node.parentNode });
                        */
                        me.node.set(action.result.data);
                        me.node.commit();
                    }
                    me.close();
                },
                failure: SimpleCMS.FailureProcess.Form,
                scope: me
            });
        }
    },

    onMyShow: function () {
        this.onReset();
    },

    setState: function (node, state) {
        var me = this,
            title = '添加目录',
            value = '';
        me.node = node;
        if (state.toLowerCase() == 'edit') {
            value = node.data.text;
            title = '编辑目录——' + value;
        }
        me.setTitle(title);
        me.form.getForm().setValues({ Name: value });
        me.show()
    }

});
