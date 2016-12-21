Ext.define("SimpleCMS.ux.imagemanager.model.Folder", {
    extend: "Ext.data.Model",
    fields: ['id', 'text'],
    requires: [
        'SimpleCMS.ux.data.proxy.Format'
    ],
    proxy: {
        type: 'format',
        api: {
            read: 'Folder/List'
        }
    }
});
