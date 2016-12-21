Ext.define('SimpleCMS.ux.toolbar.Action', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'actiontoolbar',
    requires: [
        'Ext.toolbar.TextItem'
    ],

    tooltipText: '',

    baseButtonCSS: 'simplecms-icon-',
    buttonIconCSS: 'file',
    bnuttonDisplayState: [true, true, true, true, true],
    prependButtons: false,
    displayInfo: false,
    displayMsg: '记录总数：{0}',
    defaultValues: null,
    viewRef:{
        main: '',
        edit: '',
        details: ''
    },
    confirmMsg: '',
    titleField: null,
    customCheck: null,
    api: {
        read: '',
        destory: ''
    },

    initComponent: function () {
        var me = this,
            actionItems = me.getActionItems(),
            userItems = me.items || [];

        for (var i = 0 ; ln = actionItems.length, i < ln; i++) {
            var item = actionItems[i];
            if (item.itemId != 'Refresh') {
                item.iconCls = me.baseButtonCSS + me.buttonIconCSS + "-" + item.itemId;
                item.tooltip = item.tooltip + me.tooltipText;
            }
            item.hidden = ! me.bnuttonDisplayState[i];
        }

        if (me.prependButtons) {
            me.items = userItems.concat(actionItems);
        } else {
            me.items = actionItems.concat(userItems);
        }

        if (me.displayInfo) {
            me.items.push('->');
            me.items.push({ xtype: 'tbtext', itemId: 'displayItem' });
        }
        me.callParent(arguments);
    },

    afterRender: function () {
        var me = this,
            view = me.getMainView();
        me.getMainView().on('selectionchange', me.onSelectionChange, me);
        if (me.displayInfo) {
            me.getMainView().getStore().on('refresh', me.onStoreRefresh, me);
        }
        me.callParent(arguments);
    },

    getActionItems: function () {
        var me = this;

        return [
            { iconCls: "", tooltip: "", itemId: 'Add', handler: me.onButtonAdd, scope: me, hidden: true},
            { iconCls: "", disabled: true, tooltip: "", itemId: 'Edit', handler: me.onButtonEdit, scope: me, hidden: true },
            { iconCls: "", disabled: true, tooltip: "", itemId: 'Delete', handler: me.onButtonDelete, scope: me, hidden: true },
            { iconCls: "", disabled: true, tooltip: "", itemId: 'Details', handler: me.onButtonDetails, scope: me, hidden: true },
            { iconCls: "x-tbar-loading", tooltip: "刷新", itemId: 'Refresh', handler: me.onButtonRefresh, scope: me, hidden: true }
        ];
    },

    getMainView: function () {
        var me = this;
        if (!me.mainView) {
            me.mainView = Ext.getCmp(me.viewRef.main);
            if (Ext.isEmpty(me.mainView)) {
                Ext.log.error('功能工具栏获取不到视图。')
            }
        }
        return me.mainView;
    },

    getEditView: function () {
        var me = this;        
        if (!me.editView) {
            me.editView = Ext.getCmp(me.viewRef.edit) || Ext.widget({ xtype: me.viewRef.edit, id: me.viewRef.edit});
        }
        return me.editView;
    },

    getDetailsView: function(){
        var me = this;
        if (!me.detailsView) {
            me.detailsView = Ext.getCmp(me.viewRef.details) || Ext.widget({ xtype: me.viewRef.details, id: me.viewRef.details });
        }
        return me.detailsView;
    },

    onButtonAdd: function () {
        var me =this,
            win = me.getEditView(),
            f = win.form.getForm();
        win.setTitle('添加' + me.tooltipText);
        if (Ext.isString(me.defaultValues)) {
            f.loadRecord(Ext.create(me.defaultValues));
        } else {
            f.setValues(me.defaultValues);
        }
        win.show();
    },

    checkSelected: function () {
        var selmodel = this.getMainView().getSelectionModel();
        if (selmodel.hasSelection()) {
            return selmodel.getSelection();
        } else {
            Ext.Msg.alert('信息', Ext.String.format('请选择{0}，再进行操作。', me.tooltipText));
            return [];
        };
    },

    onButtonEdit: function () {
        var me = this,
            data = me.checkSelected(),
            win = this.getEditView();
        if (data.length == 0) return;
        if (me.customCheck && !me.customCheck(data)) {
            Ext.Msg.alert('信息', Ext.String.format('不允许编辑{0}：{1}', me.tooltipText, data[0].data[me.titleField]));
            return;;
        }
        data = data[0];
        win.setTitle(Ext.String.format("编辑{0}：{1}", me.tooltipText, data.data[me.titleField]));
        if (Ext.isString(me.defaultValues)) {
            win.form.getForm().loadRecord(data);
            win.show();
        } else {
            win.form.load({
                url: me.api.read,
                waitMsg: "正在加载，请等待……",
                waitTitle: "正在加载",
                params: { id: data.getId() },
                success: function (form, action) {
                    this.show();
                },
                failure: SimpleCMS.FailureProcess.Form,
                scope: win
            });
        }
    },

    onButtonDelete: function () {
        var me = this,
            data = me.checkSelected(),
            ln =data.length,
            ids = [],
            content = [];
        if (ln == 0) return;
        if (me.customCheck && !me.customCheck(data)) {
            Ext.Msg.alert('删除', Ext.String.format('不允许删除{0}：{1}', me.tooltipText, data[0].data[me.titleField]));
            return;
        }
        for (var i = 0 ; i < ln ; i++) {
            ids.push(data[i].getId());
            content.push(data[i].data[me.titleField]);
        }
        Ext.Msg.confirm("删除", Ext.String.format(me.confirmMsg, content.join('<br/>')),
            function (btn) {
                if (btn == "yes") {
                    Ext.Ajax.request({
                        url: me.api.destory,
                        params: { id: ids },
                        scope: this,
                        success: function (response, opts) {
                            var me = this;
                                obj = Ext.decode(response.responseText);
                            if (obj.success) {
                                me.onDeleteSuccess(obj,response, opts);
                            } else {
                                me.onDeleteFailure(obj, response, opts);
                            }
                        },
                        failure: SimpleCMS.FailureProcess.Ajax
                    });
                }
            }
        , me);
    },

    onDeleteSuccess: Ext.emptyFn,
    onDeleteFailure: function (obj, response, opts) {
        Ext.Msg.alert('删除', obj.msg);
    },

    onButtonDetails: function () {
        var me = this,
            data = me.checkSelected();
        if (data.length == 0) return;
        if (me.customCheck && !me.customCheck(data)) {
            Ext.Msg.alert('信息', Ext.String.format('不允许查看{0}：{1}', me.tooltipText, data[0].data[me.titleField]));
            return;
        }
        data = data[0];
        var newview = Ext.widget({
            xtype: me.viewRef.details,
            title: Ext.String.format( '{0}：{1}' , me.tooltipText, data.data[me.titleField]),
            closable: true
        });
        me.up('tabpanel').add(newview);
        newview.load(data.getId());
    },

    onButtonRefresh: function () {
        var me = this,
            view = me.getMainView(),
            store = view.getStore(),
            data;
        if (store instanceof Ext.data.TreeStore) {
            data = me.checkSelected();
            data = data.length == 0 ? view.getRootNode() : data[0];
            store.load({ node: data });
        } else {
            store.load();
        }
    },

    onSelectionChange: function (sm, selected, eOpts) {
        var me = this,
            disabled = !sm.hasSelection();
        if (sm.hasSelection() && me.customCheck) {
            disabled = !me.customCheck(selected);
        }
        me.down('#Edit').setDisabled(disabled);
        me.down('#Delete').setDisabled(disabled);
        me.down('#Details').setDisabled(disabled);
    },

    onStoreRefresh: function (store, opts) {
        var me = this;
        me.down('#displayItem').update(Ext.String.format(me.displayMsg, store.getCount()));
    }

});
