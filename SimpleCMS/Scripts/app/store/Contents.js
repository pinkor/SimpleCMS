Ext.define("SimpleCMS.store.Contents", {
    extend: 'Ext.data.Store',
    requires: [
        'SimpleCMS.ux.data.proxy.Format',
        'SimpleCMS.model.Content'
    ],
    model: 'SimpleCMS.model.Content',
    remoteFilter: true,
    remoteSort: true,
    buffered: true,
    sorters: [{ property: 'ContentId', direction: 'DESC' }],
    pageSize: 100,
    proxy: {
        type: "format",
        api: {
            read: "Content/List"
        }
    }
})
