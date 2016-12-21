Ext.define("SimpleCMS.store.Users", {
    extend: 'Ext.data.Store',
    requires: [
        'SimpleCMS.model.User'
    ],
    model: 'SimpleCMS.model.User',
    pageSize: 50,
    remoteSort:true,
    proxy: {
        type: 'format',
        api:{
            read: 'User/List',
            destroy: 'User/Delete',
            update: "User/Edit",
            create: "User/Add"
        }
    }
});
