Ext.define('SimpleCMS.ux.window.ImageSelected', {
    extend: 'Ext.window.Window',
    xtype: 'imageSelectedView',
    requires: [
        'Ext.toolbar.*',
        'Ext.button.*',
        'Ext.layout.container.Fit'
    ],

    modal: true,
    closable: true,
    resizable: true,
    closeAction: 'hide',
    hideMode: 'offsets',
    layout: 'fit',
    title: '图片选择',
    width: 1000,
    height: 600,

    config: {
        editor: null
    },

    initComponent: function () {
        var me = this;
        me.view = new SimpleCMS.ux.imagemanager.View();
        me.items = [me.view];
        me.dockedItems = [{
            xtype: 'toolbar', dock: 'bottom', ui: 'footer', layout: { pack: "center" },
            items: [
        { text: "插入", width: 80, handler: me.onInsert, scope: me },
                { text: "取消", width: 80, handler: me.onCancel, scope: me }
            ]
        }];


        me.callParent(arguments);

    },

    onCancel: function () {
        this.close();
    },

    onInsert: function () {
        var me = this,
            sm = me.view.dataview.getSelectionModel();
        if (sm.hasSelection()) {
            var rs = sm.getSelection(),
                editor = me.getEditor(),
                path = SimpleCMS.Config.ImagePath;
            if (editor.isFormField) {
                editor.setValue(Ext.String.format("{0}{1}", path, rs[0].data.id));
            } else {
                var html = "";
                for (var i = 0; ln = rs.length, i < ln; i++) {
                    html += Ext.String.format("<img src='{0}{1}' >", path, rs[i].data.id);
                }
                editor.execCommand('mceInsertContent', false, html);
            }
            me.close()

        } else {
            Ext.Msg.alert('信息', '请选择图片后再插入。')
        }
    }

});
