Ext.define('SimpleCMS.controller.category.Main', {
    extend: 'Ext.app.Controller',
    requires: [
        'SimpleCMS.view.category.Edit',
        'SimpleCMS.view.category.Details'
    ],

    refs: [
        {
            ref: 'categoryView',
            selector: '#categoryView'
        },
        {
            ref: 'categoryEditView',
            selector: '#categoryEditView',
            xtype: 'categoryEditView',
            id: 'categoryEditView',
            autoCreate: true
        },
        {
            ref: 'main',
            selector: '#app-main'
        },
        {
            ref: 'contentView',
            selector: '#contentView'
        }
    ],

    init: function () {
        var me = this;
        me.control({
            categoryView: {
                afterrender: {
                    single: true,
                    fn: me.onViewRender
                },
                selectionchange: me.onSelectCategory
            },
            /*
            '#categoryView #Add': {
                click: me.onAddCategory
            },
            '#categoryView #Edit': {
                click: me.onEditCategory
            },
            '#categoryView #Delete': {
                click: me.onDeleteCategory
            },
            '#categoryView #Details': {
                click: me.onDetailsCategory
            },
            '#categoryView #Refresh': {
                click: me.onRefresh
            }
            */
        });
    },

    onViewRender: function () {
        var me = this,
            view = me.getCategoryView(),
            root = view.getRootNode();
        root.expand();
        view.getView().on('drop', me.onDropCategory, me);
        view.getSelectionModel().select(root);
    },

    onAddCategory: function () {
        var win = this.getCategoryEditView();
        win.setTitle('添加类别');
        win.form.getForm().setValues({
            CategoryId: '',
            Title: '',
            Image: '',
            ParentId: -1,
            SortOrder: 0,
            Created: '',
            Content: ''
        });
        win.show();
    },

    onSelectCategory: function (sm, selected, eOpts) {
        var view = this.getCategoryView(),
            rs = selected[0],
            disabled = (rs && rs.data.id <= 10000);
        //view.down('#Edit').setDisabled(disabled);
        //view.down('#Delete').setDisabled(disabled);
        //view.down('#Details').setDisabled(disabled);
        if (rs) {
            var store = Ext.getStore('Contents');
            store.clearFilter(true);
            store.filter({ property: 'CategoryId', value: rs.data.id, operator: rs.data.id < 10000 ? ">" : '==' });
            var contentView = this.getContentView();
            contentView.setTitle('文章：' + rs.data.text);
            contentView.setTitleSearchString(false);
            //this.getContentView().setTitle('文章：' + rs.data.text);
        }
    },

    checkSelected: function () {
        var selmodel = this.getCategoryView().getSelectionModel();
        if (selmodel.hasSelection()) {            
            return selmodel.getSelection();
        } else {
            Ext.Msg.alert('信息', '请选择文章类别，再操作。');
            return [];
        };
    },


    onEditCategory: function () {
        var me =this,
            data = me.checkSelected(),
            win = this.getCategoryEditView();
        if (data.length == 0) return;
        data = data[0].data;
        if (data.id <= 10000) {
            Ext.Msg.alert('信息', '文章类别' + data.text + '不允许编辑。');
            return;
        }
        win.setTitle("编辑文章类别：" + data.text);
        win.form.load({
            url: "Category/Details",
            waitMsg: "正在加载，请等待……",
            waitTitle: "正在加载",
            params: { id: data.id },
            success: function (form, action) {
                this.show();
            },
            failure: SimpleCMS.FailureProcess.Form,
            scope: win
        });
    },

    onDeleteCategory: function () {
        var me = this,
            data = me.checkSelected();
        if (data.length == 0) return;
        data = data[0];
        if (data.data.id <= 10000) {
            Ext.Msg.alert('删除文章分类', '文章分类'+ data.data.text +'不能删除');
            return;
        }
        var content = "确定删除文章类别“" + data.data.text + "”？<br/><p style='color:red'>注意：该文章分类下的子类会被删除，而文章将会被移动到未分类类别。</p>";
        Ext.Msg.confirm("删除文章类别", content,
            function (btn) {
                if (btn == "yes") {
                    Ext.Ajax.request({
                        url: 'Category/Delete',
                        params: { id : data.data.id },
                        node: data,
                        scope: this,
                        success: function (response, opts) {
                            var obj = Ext.decode(response.responseText);
                            if (obj.success) {
                                var node = opts.node,
                                    parentNode = node.parentNode;
                                parentNode.removeChild(node);
                                this.getCategoryView().getSelectionModel().select(parentNode);
                            } else {
                                Ext.Msg.alert('删除文章类别', obj.msg);
                            }
                        },
                        failure: SimpleCMS.FailureProcess.Ajax
                    });
                }
            }
        , me);
    },

    onDetailsCategory: function () {
        var me = this,
            data = me.checkSelected();
        if (data.length == 0) return;
        data = data[0].data;
        if (data.id <= 10000) {
            Ext.Msg.alert('信息', '不能查看文章类别：' + data.text);
            return;
        }
        var newview = new SimpleCMS.view.category.Details({ title: '类别：' + data.text, closable: true });
        me.getMain().add(newview);
        newview.setCategoryId(data.id);
        //newview.load(data.id);
        me.getMain().setActiveTab(newview);
    },

    onRefresh: function () {
        var me = this,
            view = me.getCategoryView(),
            data = me.checkSelected();
        data = data.length == 0 ? view.getRootNode() : data[0];
        view.getStore().load({ node: data });
    },

    onDropCategory: function (node, data, overModel, dropPosition, eOpts) {
        if (data.view instanceof Ext.grid.View) {
            var rs = data.records,
                ids= [];
            for (var i = rs.length - 1; i >= 0; i--) {
                ids.push(rs[i].data.id);
            }
            Ext.Ajax.request({
                url: 'Content/Drop',
                params: { Destination: overModel.data.id, Source: ids },
                scope: this,
                success: function (response, opts) {
                    var me = this,
                        obj = Ext.decode(response.responseText);
                    if (obj.msg) {
                        Ext.Msg.alert('移动文章', obj.msg);
                    }
                    Ext.getStore('Contents').load();
                },
                failure: SimpleCMS.FailureProcess.Ajax,
            });
        } else {
            Ext.Ajax.request({
                url: 'Category/Drop',
                params: { Destination: overModel.data.id, Source: data.records[0].data.id },
                scope: this,
                success: function (response, opts) {
                    var me = this,
                        obj = Ext.decode(response.responseText),
                        store = me.getCategoryView().getStore();
                    if (obj.success) {
                    } else {
                        Ext.Msg.alert('移动文章类别', obj.msg);
                    }
                    store.load({ node: store.getRootNode() });
                },
                failure: SimpleCMS.FailureProcess.Ajax
            });
        }
    }


});
