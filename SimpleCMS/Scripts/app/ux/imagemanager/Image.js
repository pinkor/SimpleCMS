Ext.define('SimpleCMS.ux.imagemanager.Image', {
    extend: 'Ext.view.View',
    xtype: 'imageManagerImageView',
    mixins: {
        draggable: 'Ext.ux.DataView.Draggable'
    },

    initComponent: function () {
        var me = this;
        me.mixins.draggable.init(me, {
            ddConfig: {
                ddGroup: 'imageDD'
            },
            ghostTpl: [
                '<tpl for=".">',
                    '<img src="Thumbnail{path}{Name}?width=30&height=30" />',
                    '<tpl if="xindex % 4 == 0"><br /></tpl>',
                '</tpl>',
                '<div class="count">',
                    '选择了{[values.length]}个图片文件。',
                '<div>'
            ]
        });

        me.callParent();
    }


});
