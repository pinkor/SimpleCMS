Ext.define('SimpleCMS.view.category.Toolbar', {
    extend: 'SimpleCMS.ux.toolbar.Action',
    xtype: 'categoryToolbar',
    requires: [
        'SimpleCMS.view.category.Edit',
        'SimpleCMS.view.category.Details'
    ],
    tooltipText: '文章类别',

    displayInfo: false,
    buttonIconCSS: 'folder',
    viewRef: {
        main: 'categoryView',
        edit: 'categoryEditView',
        details: 'categoryDetailsView'
    },
    defaultValues: {
        CategoryId: '',
        Title: '',
        Image: '',
        ParentId: -1,
        SortOrder: 0,
        Created: '',
        Content: ''
    },
    customCheck: function (data) {
        data = data[0];
        if (data.getId() <= 10000) {
            return false;
        }
        return true;
    },
    titleField: 'text',
    confirmMsg: "确认要删除以下文章类别？<br/>{0}<br/><p style='color:red'>注意：该文章分类下的子类会被删除，而文章将会被移动到未分类类别。</p>",
    api: {
        read: 'Category/Details',
        destory: 'Category/Delete'
    },
    onDeleteSuccess: function () {
        this.getMainView().getStore().load();
    }
});