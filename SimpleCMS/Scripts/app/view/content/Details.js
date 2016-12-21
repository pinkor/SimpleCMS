Ext.define('SimpleCMS.view.content.Details', {
    extend: 'Ext.container.Container',
    xtype: 'contentDetailsView',
    requires: [
        'Ext.Template'
    ],

    autoScroll: true,
    padding: 5,


    tpl: [
        '<table class="simplecms-category-details">',
        '<tr><td class="label">编号<td><td>：</td><td width="600">{ContentId}</td><td rowspan="7"><img src={Image} alt="题图"></td></tr>',
        '<tr><td class="label">标题<td><td>：</td><td>{Title}</td></tr>',
        '<tr><td class="label">题图<td><td>：</td><td>{Image}</td></tr>',
        '<tr><td class="label">类别<td><td>：</td><td>{CategoryTitle}</td></tr>',
        '<tr><td class="label">排序序数<td><td>：</td><td>{SortOrder}</td></tr>',
        '<tr><td class="label">标签<td><td>：</td><td>{Tags}</td></tr>',
        '<tr><td class="label">创建日期<td><td>：</td><td>{Created}</td></tr>',
        '</table>',
        '<hr>',
        '<h2>摘要：</h2>',
        '<hr>',
        '<div>{Summary}</div>',
        '<h2>内容：</h2>',
        '<hr>',
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
            url: 'Content/Details',
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
    }



});
