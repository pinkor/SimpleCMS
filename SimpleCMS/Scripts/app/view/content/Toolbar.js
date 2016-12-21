Ext.define('SimpleCMS.view.content.Toolbar', {
    extend: 'SimpleCMS.ux.toolbar.Action',
    xtype: 'contentToolbar',
    requires: [
        'SimpleCMS.view.content.Edit',
        'SimpleCMS.view.content.Details'
    ],
    tooltipText: '文章',

    displayInfo: true,
    viewRef: {
        main: 'contentView',
        edit: 'contentEditView',
        details: 'contentDetailsView'
    },
    defaultValues: {
        ContentId: '',
        Title: '',
        CategoryId: 10000,
        SortOrder: 0,
        Tags: '',
        Image: '',
        Summary: '',
        Content: ''
    },

    titleField: 'Title',
    confirmMsg: '确认要删除以下文章？<br/>{0}',
    api: {
        read: 'Content/Details',
        destory: 'Content/Delete'
    },
    onDeleteSuccess: function () {
        this.getMainView().getStore().load();
    },

    items: [
        {
            text: '搜索', menu: {
                xtype: 'menu',
                plain: true,
                items: {
                    xtype: 'searchGrid', width: 600, height: 400, itemId: 'searchGrid',
                    fieldDatas: [
                        ['Title', '标题', 'string'], ['Content', '内容', 'string'], ['Summary', '摘要', 'string'],
                        ['Created', '创建时间', 'date'], ['SortOrder', '排序序数', 'number'], ['Hits', '点击量', 'number'],
                        ['Tags', '标签', 'string']
                    ],
                    bbar: [
                        { xtype: 'checkbox', boxLabel: '在当前类别内搜索', name: 'hasCaterogy', value: false }
                    ]
                }
            }
        },
    ]
});