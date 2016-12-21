Ext.define('SimpleCMS.ux.imagemanager.model.File', {
    extend: 'Ext.data.Model',
    fields: [
        'id', 'Name', 'path', 'LastWriteTime',
        { name: 'Length', type: 'int' }
    ]
});
