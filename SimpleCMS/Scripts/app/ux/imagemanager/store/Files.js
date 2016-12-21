Ext.define('SimpleCMS.ux.imagemanager.store.Files', {
    extend: 'Ext.data.Store',
    requires: [
        'SimpleCMS.ux.imagemanager.model.File',
        'SimpleCMS.ux.data.proxy.Format'
    ],
    model: 'SimpleCMS.ux.imagemanager.model.File',
    storeId: 'Files',
    sorters: [
        { property: "LastWriteTime", direction: "DESC" }
    ],
    proxy: {
        type: 'format',
        api: {
            read: 'File/List'
        }
    }
});
