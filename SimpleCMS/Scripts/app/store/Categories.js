Ext.define("SimpleCMS.store.Categories", {
    extend: 'Ext.data.TreeStore',
    requires: [
        'SimpleCMS.model.Category'
    ],
    model: 'SimpleCMS.model.Category',
    root: { id: -1, text: '全部分类' }
})
