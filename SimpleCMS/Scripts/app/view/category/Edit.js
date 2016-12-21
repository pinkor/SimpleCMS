Ext.define('SimpleCMS.view.category.Edit', {
    extend: 'Ext.window.Window',
    xtype: 'categoryEditView',

    requires: [
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.container.Container',
        'Ext.toolbar.*',
        'Ext.button.*',
        'Ext.layout.container.Fit',
        'SimpleCMS.ux.data.FailureProcess',
        'Ext.ux.TreePicker',
        'Ext.form.FieldContainer',
        'Ext.form.FieldSet',
        'Ext.ux.form.field.TinyMCE'
    ],

    modal: true,
    closable: true,
    resizable: true,
    closeAction: 'hide',
    hideMode: 'offsets',
    layout: 'fit',
    title: '',
    width: 800,
    height: 600,

    initComponent: function () {
        var me = this,
            store = Ext.data.StoreManager.lookup('Categories');

        me.form = new Ext.form.Panel({
            border: false,
            trackResetOnLoad: true,
            bodyPadding: 5,
            defaultType: 'textfield',
            fieldDefaults: {
                labelWidth: 80,
                labelSeparator: '：',
                anchor: '0',
                allowBlank: false,
            },
            items: [
                {
                    xtype: 'container', layout: 'hbox',
                    items: [
                        {
                            xtype: 'container', flex: 1, layout: 'anchor', padding: 5,
                            items: [
                                { xtype: 'textfield', fieldLabel: '类别编号', name: 'CategoryId', readOnly: true, allowBlank: true },
                                { xtype: 'textfield', fieldLabel: '类别名称', name: 'Title', maxLength: 255 },
                                {
                                    xtype: 'fieldcontainer', layout: 'hbox', fieldLabel: '题图',
                                    items: [
                                        { xtype: 'textfield', flex: 1, name: 'Image', maxLength: 255, hideLabel: true, itemId: 'ImageField' },
                                        { xtype: 'button', width: 80, text: '选择', itemId: 'SelectImage' }
                                    ]
                                },
                                {
                                    xtype: 'treepicker', fieldLabel: '父类别', name: 'ParentId',
                                    editable: false, store: store, displayField: 'text'
                                },
                                { xtype: 'numberfield', fieldLabel: '排序序数', name: 'SortOrder' },
                                {
                                    xtype: 'textfield', fieldLabel: '创建日期', name: 'Created', readOnly: true,
                                    allowBlank: true, submitValue: false
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset', width: 180, height: 190, title: '题图预览',
                            items: { xtype: 'image', alt: '题图预览', width: 160, height: 160, src: '' },
                        }
                    ]
                },
                {
                    xtype: 'tinymcefield',
                    name: 'Content',
                    fieldLabel: '说明',
                    labelAlign: 'top',
                    anchor: '0 -220',
                    tinymceConfig: SimpleCMS.Config.tinymceConfig
                }
            ],
            dockedItems: [{
                xtype: 'toolbar', dock: 'bottom', ui: 'footer', layout: { pack: 'center' },
                items: [
                    { text: '保存', width: 80, disabled: true, formBind: true, itemId: 'Save'},
                    { text: '重置', width: 80, itemId: 'Reset' }
                ]
            }]
        });

        me.items = [me.form];

        me.callParent(arguments);

        me.firstField = me.form.getForm().findField('Title');;
    }

});
