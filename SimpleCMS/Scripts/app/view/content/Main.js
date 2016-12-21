Ext.define('SimpleCMS.view.content.Main', {
    extend: 'Ext.grid.Panel',
    xtype: 'contentMain',
    requires: [
        'Ext.grid.column.*',
        'Ext.selection.CheckboxModel',
        'Ext.grid.plugin.BufferedRenderer',
        'SimpleCMS.ux.grid.Search',
        'Ext.grid.plugin.DragDrop',
        'SimpleCMS.view.content.Toolbar'
    ],
    store: "Contents",
    selType: "checkboxmodel",
    selModel: { checkOnly: false, mode: "MULTI", pruneRemoved: false },

    plugins: 'bufferedrenderer',

    config: {
        titleSearchString: false
    },
    /*
    tbar: [
        { iconCls: "simplecms-icon-contentAdd", tooltip: "添加文章", itemId: 'Add' },
        { iconCls: "simplecms-icon-contentEdit", disabled: true, tooltip: "编辑文章", itemId: 'Edit' },
        { iconCls: "simplecms-icon-contentDelete", disabled: true, tooltip: "删除文章", itemId: 'Delete' },
        { iconCls: "simplecms-icon-contentDetails", disabled: true, tooltip: "查看文章", itemId: 'Details' },
        { iconCls: "x-tbar-loading", tooltip: "刷新", itemId: 'Refresh' },
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
    ]*/
    tbar: {xtype: 'contentToolbar'},

    initComponent: function () {
        var me = this;

        me.columns = [
            { text: '编号', dataIndex: 'ContentId', width: 80 },
            { text: '标题', dataIndex: 'Title', flex: 1, renderer: Ext.bind(me.onTitleRenderer , me)},
            { text: '标签', dataIndex: 'Tags', width: 200, sortable: false },
            { xtype: "datecolumn", text: '创建时间', dataIndex: 'Created', format: "Y-m-d H:i:s", width: 150 },
            { text: '排序序数', dataIndex: 'SortOrder', width: 80 },
            { text: '点击量', dataIndex: 'Hits', width: 80 }
        ],


        me.callParent(arguments);
    },

    onTitleRenderer: function (value) {
        var search = this.getTitleSearchString();
        return search ? value.replace(new RegExp(search), Ext.String.format('<em style="color:red">{0}</em>', search)) : value;
    },

    viewConfig: {
        plugins: {
            ptype: 'gridviewdragdrop',
            ddGroup: 'categoryDD',
            dragText: '移动文章'
        }
    }


});
