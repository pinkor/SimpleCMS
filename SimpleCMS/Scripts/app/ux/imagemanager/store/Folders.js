Ext.define('SimpleCMS.ux.imagemanager.store.Folders', {
    extend: 'Ext.data.TreeStore',
    requires: [
        'SimpleCMS.ux.imagemanager.model.Folder'
    ],
    model: 'SimpleCMS.ux.imagemanager.model.Folder',
    storeId: 'Folders',
    root: {
        id: '/',
        text: '根目录'
    }
});
