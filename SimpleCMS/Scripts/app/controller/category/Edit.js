Ext.define('SimpleCMS.controller.category.Edit', {
    extend: 'Ext.app.Controller',
    requires: [
        'SimpleCMS.ux.window.ImageSelected'
    ],

    refs: [
        {
            ref: 'categoryEditView',
            selector: '#categoryEditView'
        },
        {
            ref: 'imageSelectedView',
            selector: '#imageSelectedView',
            xtype: 'imageSelectedView',
            id: 'imageSelectedView',
            autoCreate: true
        }
    ],

    init: function () {
        var me = this;
        me.control({
            categoryEditView: {
                show: me.onViewShow
            },
            '#categoryEditView #SelectImage': {
                click: me.onSelectImage
            },
            '#categoryEditView #ImageField': {
                change: me.onImageFieldChange
            },
            '#categoryEditView #Save': {
                click: me.onSave
            },
            '#categoryEditView #Reset': {
                click: me.onReset
            }
        });
    },

    onViewShow: function () {
        this.getCategoryEditView().firstField.focus(true, 10);
    },

    onSelectImage: function () {
        var me = this,
            win = me.getImageSelectedView();
        win.setEditor(me.getCategoryEditView().form.getForm().findField('Image'));
        win.show();
    },

    onImageFieldChange: function (cmp, newValue, oldValue, eOpts) {
        if (newValue != oldValue) {
            var re = new RegExp(SimpleCMS.Config.ImagePath),
                src = newValue;
            if (re.exec(newValue)) {
                src = newValue.replace(re, "Thumbnail") + "?width=160&height=160";
            }
            this.getCategoryEditView().down('image').setSrc(src);
        }
    },

    onSave: function () {
        var me = this,
            view = me.getCategoryEditView(),
            f = view.form.getForm();
        if (f.isValid()) {
            f.submit({
                url: "Category/" + (view.title == '添加文章类别' ? 'Add' : 'Edit'),
                waitMsg: "正在保存，请等待……",
                waitTitle: "正在保存",
                success: function (form, action) {
                    var me = this,
                        store = Ext.getStore('Categories');
                    if (me.title == '添加类别') {
                        var node = store.getNodeById(form.findField('ParentId').getValue());
                        if (node) {
                            if (node.isExpanded()) {
                                var newnode = new SimpleCMS.model.Category(action.result.data);
                                node.appendChild(newnode);
                            } else {
                                node.expand();
                            }
                        } else {
                            store.load({ node: store.getRootNode() });
                        }
                    } else {
                        store.load({ node: store.getRootNode() });
                    }
                    me.close();
                },
                failure: SimpleCMS.FailureProcess.Form,
                scope: view
            });
        }
    },

    onReset: function () {
        this.getCategoryEditView().form.getForm().reset();
    }


});
