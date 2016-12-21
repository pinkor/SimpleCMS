Ext.define('SimpleCMS.controller.content.Edit', {
    extend: 'Ext.app.Controller',
    requires: [
        'SimpleCMS.ux.window.ImageSelected'
    ],

    refs: [
        {
            ref: 'contentEditView',
            selector: '#contentEditView'
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
            contentEditView: {
                show: me.onViewShow
            },
            '#contentEditView #SelectImage': {
                click: me.onSelectImage
            },
            '#contentEditView #ImageField': {
                change: me.onImageFieldChange
            },
            '#contentEditView #TagList': {
                itemclick: me.onTagListItemClick
            }
        });
    },

    onViewShow: function () {
        Ext.getStore('Tags').load();
    },

    onSelectImage: function () {
        var me = this,
            win = me.getImageSelectedView();
        win.setEditor(me.getContentEditView().form.getForm().findField('Image'));
        win.show();
    },

    onImageFieldChange: function (cmp, newValue, oldValue, eOpts) {
        if (newValue != oldValue) {
            var re = new RegExp(SimpleCMS.Config.ImagePath),
                src = newValue,
                img = this.getContentEditView().down('image');
            if (img.rendered) {
                if (re.exec(newValue)) {
                    src = newValue.replace(re, "Thumbnail") + Ext.String.format("?width={0}&height={1}", img.getWidth(), img.getHeight());
                }
                img.setSrc(src);
            }
        }
    },

    onTagListItemClick: function (cmp, record, item, index, e, eOpts) {
        var field = this.getContentEditView().down('#TagField'),
            value = field.getValue(),
            addtag = record.data.TagName;
        if ((',' + value + ',').indexOf(',' + addtag + ',') == -1) {
            field.setValue(Ext.isEmpty(value) ? addtag : value + ',' + addtag);
        }
    }


});
