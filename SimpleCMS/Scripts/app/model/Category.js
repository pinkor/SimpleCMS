Ext.define("SimpleCMS.model.Category", {
    extend: "Ext.data.Model",
    fields: ['id', 'text'],
    requires: [
        'SimpleCMS.ux.data.proxy.Format'
    ],
    proxy: {
        type: 'format',
        api: {
            read: 'Category/List'
        }
    }
});
