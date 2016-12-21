Ext.define('SimpleCMS.store.Tags', {
    extend: 'Ext.data.Store',
    requires: [
        'SimpleCMS.ux.data.proxy.Format',
        'SimpleCMS.ux.data.FailureProcess'
    ],
    fields: [
        { name: 'TagId', type: 'int' },
        'TagName'
    ],
    proxy: {
        type: 'format',
        api: {
            read: 'Tag/List'
        }
    }

});
