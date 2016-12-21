Ext.define('SimpleCMS.view.content.Edit', {
    extend: 'SimpleCMS.ux.window.Form',
    xtype: 'contentEditView',
    requires: [
        'Ext.container.Container',
        'Ext.ux.TreePicker',
        'Ext.form.FieldContainer',
        'Ext.form.FieldSet',
        'Ext.ux.form.field.TinyMCE'
    ],

    resizable: true,
    title: '',
    width: 800,
    height: 600,

    config: {
        categoryTitle: ''
    },


    initComponent: function () {
        var me = this,
            store = Ext.data.StoreManager.lookup('Categories');

        me.formConfig = {
            layout: 'fit',
            padding:0,
            items: [
                {
                    xtype: "tabpanel", activeTab: 0, deferredRender: false,
                    defaults: {
                        xtype: "container", border: false
                    },
                    items: [
                        {
                            title: '基本信息', layout: 'anchor',padding: 5,
                            items: [
                                { xtype: 'hidden', name: 'ContentId', allowBank: true },
                                { xtype: 'textfield', fieldLabel: '标题', name: 'Title', maxLength: 255 },
                                {
                                    xtype: 'treepicker', fieldLabel: '类别', name: 'CategoryId',
                                    editable: false, store: store, displayField: 'text'
                                },
                                { xtype: 'numberfield', fieldLabel: '排序序数', name: 'SortOrder' },
                                { xtype: 'textfield', fieldLabel: '标签', name: 'Tags', itemId: 'TagField' },
                                { xtype: 'container', html: "**请使用英文逗号分隔标签", anchor: "0", padding: "0 0 0 80px" },
                                {
                                    xtype: 'fieldset', title: '可选标签', anchor: '0 -80', padding: 5,
                                    layout: 'fit',
                                    items: [
                                        {
                                            xtype: 'dataview', store: 'Tags', emptyText: '还没有可选标签',
                                            overItemCls: "overitem", itemSelector: 'li.simplecms-taglist',
                                            autoScroll: true, itemId: 'TagList',
                                            tpl: [
                                                '<ul>',
                                                '<tpl for=".">',
                                                    '<li class="simplecms-taglist ellipsis">{TagName}</li>',
                                                '</tpl>',
                                                '</ul>',
                                                '<div class="x-clear"></div>'
                                            ],
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            title: '题图', layout: { type: 'vbox', align: 'stretch' }, padding: 5,
                            items: [
                                {
                                    xtype: 'fieldcontainer', layout: 'hbox', fieldLabel: '题图',
                                    items: [
                                        { xtype: 'textfield', flex: 1, name: 'Image', maxLength: 255, hideLabel: true, itemId: 'ImageField' },
                                        { xtype: 'button', width: 80, text: '选择', itemId: 'SelectImage' }
                                    ]
                                },
                                {
                                    xtype: 'fieldset', title: '题图预览', flex: 1, layout: 'fit',padding: 5,
                                    items: { xtype: 'image', alt: '题图预览', src: '' },
                                }
                            ]
                        },
                        {
                            title: '摘要', layout: 'fit',
                            items: [
                                {
                                    xtype: 'tinymcefield',
                                    name: 'Summary',
                                    tinymceConfig: SimpleCMS.Config.tinymceConfig
                                }
                            ]
                        },
                        {
                            title: '内容', layout: 'fit',
                            items: [
                                {
                                    xtype: 'tinymcefield',
                                    name: 'Content',
                                    tinymceConfig: SimpleCMS.Config.tinymceConfig
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        me.callParent(arguments);

    },

    onSave: function () {
        var me = this;
        me.url = "Content/" + (me.title == '添加文章' ? 'Add' : 'Edit');
        me.callParent(arguments);
    },

    onSubmitSuccess: function(){
        this.close();
        Ext.Msg.alert('信息', '文章已保存。');
    },

    onReset: function () {
            var form = this.form.getForm(),
            field = form.findField('CategoryId');
        form.reset();
        if (Ext.isEmpty(field.getRawValue())) field.setRawValue(me.getCategoryTitle());
    }

});
