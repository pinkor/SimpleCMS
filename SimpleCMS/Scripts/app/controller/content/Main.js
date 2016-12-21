Ext.define('SimpleCMS.controller.content.Main', {
    extend: 'Ext.app.Controller',
    requires: [
        'SimpleCMS.view.content.Edit',
        'SimpleCMS.view.content.Details'
    ],

    refs: [
        {
            ref: 'contentView',
            selector: '#contentView'
        },
        {
            ref: 'contentEditView',
            selector: '#contentEditView',
            xtype: 'contentEditView',
            id: 'contentEditView',
            autoCreate: true
        },
        {
            ref: 'main',
            selector: '#app-main'
        },
        {
            ref: 'categoryView',
            selector: '#categoryView'
        }
    ],

    init: function () {
        var me = this;
        me.control({
            /*
            '#contentView': {
                selectionchange: me.onSelectContent
            },
            '#contentView #Add': {
                click: me.onAddContent
            },
            '#contentView #Edit': {
                click: me.onEditContent
            },
            '#contentView #Delete': {
                click: me.onDeleteContent
            },
            '#contentView #Details': {
                click: me.onDetailsContent
            },
            '#contentView #Refresh': {
                click: me.onRefresh
            },
            */
            '#contentView #searchGrid': {
                startfilter: me.onStartFilter
            }
        });
    },

    onAddContent: function () {
        var win = this.getContentEditView();
        win.setTitle('添加文章');
        win.form.getForm().setValues({
            ContentId: '',
            Title: '',
            CategoryId: 10000,
            SortOrder: 0,
            Tags: '',
            Image: '',
            Summary: '',
            Content: ''
        });
        win.show();
    },

    onSelectContent: function (sm, selected, eOpts) {
        var view = this.getContentView(),
            disabled = !sm.hasSelection();
        view.down('#Edit').setDisabled(disabled);
        view.down('#Delete').setDisabled(disabled);
        view.down('#Details').setDisabled(disabled);
    },

    checkSelected: function () {
        var selmodel = this.getContentView().getSelectionModel();
        if (selmodel.hasSelection()) {
            return selmodel.getSelection();
        } else {
            Ext.Msg.alert('信息', '请选择文章，再操作。');
            return [];
        };
    },


    onEditContent: function () {
        var me = this,
            data = me.checkSelected(),
            win = this.getContentEditView();
        if (data.length == 0) return;
        data = data[0].data;
        win.setTitle("编辑文章：" + data.Title);
        win.form.load({
            url: "Content/Details",
            waitMsg: "正在加载，请等待……",
            waitTitle: "正在加载",
            params: { id: data.ContentId },
            success: function (form, action) {
                var me = this,
                    filed = form.findField('CategoryId'),
                    record = filed.store.getNodeById(action.result.data.CategoryId);
                if (!record) {
                    var value = action.result.data.CategoryTitle;
                    me.setCategoryTitle(value);
                    field.setRawValue(value);
                }
                this.show();
            },
            failure: SimpleCMS.FailureProcess.Form,
            scope: win
        });
    },

    onDeleteContent: function () {
        var me = this,
            data = me.checkSelected(),
            ln = data.length,
            ids = [],
            content = ['确定要删除以下文章?'];
        if (ln == 0) return;
        for (var i = 0 ; i < ln ; i++) {
            ids.push(data[i].data.ContentId);
            content.push(data[i].data.Title);
        }
        Ext.Msg.confirm("删除文章", content.join('<br/>'),
            function (btn) {
                if (btn == "yes") {
                    Ext.Ajax.request({
                        url: 'Content/Delete',
                        params: { id: ids },
                        scope: this,
                        success: function (response, opts) {
                            var obj = Ext.decode(response.responseText);
                            if (obj.success) {
                                this.getContentView().getStore().load();
                            } else {
                                Ext.Msg.alert('删除文章', obj.msg);
                            }
                        },
                        failure: SimpleCMS.FailureProcess.Ajax
                    });
                }
            }
        , me);
    },

    onDetailsContent: function () {
        var me = this,
            data = me.checkSelected();
        if (data.length == 0) return;
        data = data[0].data;
        var newview = new SimpleCMS.view.content.Details({ title: '文章：' + data.Title, closable: true });
        me.getMain().add(newview);
        newview.load(data.ContentId);
    },

    onRefresh: function () {
        this.getContentView().getStore().load();
    },


    onStartFilter: function (grid, eOpts) {
        var me = this,
            titleSearchString = false,
            hasCaterogy = grid.down('checkbox').getValue(),
            store = grid.getStore(),
            count = store.getCount(),
            filters = [],
            view = me.getContentView(),
            contentStore = view.getStore();
        if (hasCaterogy) {
            var sm = me.getCategoryView().getSelectionModel();
            if (sm.hasSelection()) {
                var rs = sm.getSelection()[0];
                filters.push({ property: 'CategoryId', value: rs.data.id, operator: rs.data.id < 10000 ? ">" : '==' })
            }
        }
        for (var i = 0; i < count ; i++) {
            var data = store.getAt(i).data;
            filters.push({ property: data.property, value: data.value, operator: data.operator });
            if (data.property == 'Title') titleSearchString = data.value;
        }
        view.setTitleSearchString(titleSearchString);
        view.setTitle("文章：搜索");
        contentStore.clearFilter(true);
        contentStore.filter(filters);
        grid.findParentByType('menu').hide();
    }

});
