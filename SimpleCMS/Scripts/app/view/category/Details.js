Ext.define('SimpleCMS.view.category.Details', {
    extend: 'Ext.container.Container',
    xtype: 'categoryDetailsView',
    requires: [
        'Ext.Template'
    ],

    autoScroll: true,
    padding: 5,

    config: {
        categoryId: null
    },

    tpl: [
        '<table class="simplecms-category-details">',
        '<tr><td class="label">编号<td><td>：</td><td width="600">{CategoryId}</td><td rowspan="6"><img src={Image} alt="题图"></td></tr>',
        '<tr><td class="label">标题<td><td>：</td><td>{Title}</td></tr>',
        '<tr><td class="label">题图<td><td>：</td><td>{Image}</td></tr>',
        '<tr><td class="label">父类别<td><td>：</td><td>{ParentTitle}</td></tr>',
        '<tr><td class="label">排序序数<td><td>：</td><td>{SortOrder}</td></tr>',
        '<tr><td class="label">创建日期<td><td>：</td><td>{Created}</td></tr>',
        '</table>',
        '<hr>',
        '<h2>内容：</h2>',
        '<div>{Content}</div>'
    ],

    initComponent: function () {
        var me = this,
            tpl = new Ext.Template(me.tpl);
        tpl.compile();
        me.tpl = tpl;
        me.callParent(arguments);
    },

    load: function (id) {
        var me = this;
        Ext.Ajax.request({
            url: 'Category/Details',
            params: { id: id },
            success: me.onSuccess,
            failure: SimpleCMS.FailureProcess.Ajax,
            scope: me
        });
    },

    onSuccess: function (response, opts) {
        var me = this,
            obj = Ext.decode(response.responseText);
        if (obj.success) {
            var html = me.tpl.apply(obj.data);
            me.update(html);
        } else {
            Ext.Msg.alert('信息', obj.msg);
        }
    },

    updateCategoryId: function (v) {
        this.load(v);
    }


});
