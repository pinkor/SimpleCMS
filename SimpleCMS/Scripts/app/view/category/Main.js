Ext.define('SimpleCMS.view.category.Main', {
    extend: 'Ext.tree.Panel',
    requires: [
        'Ext.tree.plugin.TreeViewDragDrop',
        'SimpleCMS.view.category.Toolbar'
    ],
    xtype: 'categoryView',
    title: "文章类别",
    store: "Categories",
    /*
    tbar: [
        { iconCls: "simplecms-icon-folderAdd", tooltip: "添加文章类别", itemId: 'Add' },
        { iconCls: "simplecms-icon-folderEdit", disabled: true, tooltip: "编辑文章类别", itemId: 'Edit' },
        { iconCls: "simplecms-icon-folderDelete", disabled: true, tooltip: "删除文章类别", itemId: 'Delete' },
        { iconCls: "simplecms-icon-folderDetails", disabled: true, tooltip: "查看文章类别", itemId: 'Details' },
        { iconCls: "x-tbar-loading", tooltip: "刷新", itemId: 'Refresh' }
    ],
    */
    tbar: {xtype: 'categoryToolbar'},

    viewConfig: {
        plugins: {
            ptype: 'treeviewdragdrop',
            containerScroll: true,
            ddGroup: 'categoryDD'
        }
    }

});
