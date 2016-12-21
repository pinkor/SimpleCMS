Ext.define('SimpleCMS.ux.window.Form', {
    extend: 'Ext.window.Window',
    xtype: 'formWindow',

    requires: [
        'Ext.form.Panel',
        'Ext.form.field.*',
        'Ext.toolbar.*',
        'Ext.button.*',
        'Ext.layout.container.Fit',
        'SimpleCMS.ux.data.FailureProcess'
    ],

    modal: true,
    closeAction: 'hide',
    hideMode: 'offsets',
    layout: 'fit',
    closable: true,
    resizable: false,
    saveButtonText: '保存',
    resetButtonText: '重置',
    url: "",
    waitMsg: "正在保存，请等待……",
    waitTitle: "正在保存",
    firstFieldName:  null,

    initComponent: function () {
        var me = this,
            form;

        form = me.getForm();
        me.items = [form];

        me.callParent(arguments);

        if(me.firstFieldName ){
            me.firstField = me.form.getForm().findField(me.firstFieldName);
            if (me.firstField) {
                me.on('show', me.onWindowShow, me);
            }
        }

    },

    getForm: function () {
        var me = this,
            fieldDefaults;
        if (!me.form) {

            fieldDefaults = Ext.apply({
                labelWidth: 80,
                labelSeparator: '：',
                anchor: '0',
                allowBlank: false
            }, me.fieldDefaultsConfig);

            me.form = new Ext.form.Panel(Ext.apply({
                border: false,
                trackResetOnLoad: true,
                defaultType: 'textfield',
                bodyPadding: 5,
                fieldDefaults: fieldDefaults,
                dockedItems: [{
                    xtype: 'toolbar', dock: 'bottom', ui: 'footer', layout: { pack: 'center' },
                    items: [
                        { text: me.saveButtonText, width: 80, disabled: true, formBind: true, itemId: 'Save', handler: me.onSave, scope: me },
                        { text: me.resetButtonText, width: 80, itemId: 'Reset',handler: me.onReset, scope: me  }
                    ]
                }]
            },me.formConfig));
        }
        return me.form;
    },

    onReset: function () {
        this.form.getForm().reset();
    },

    onSave: function () {
        var me = this,
            f = me.form.getForm();
        if (f.isValid()) {
            f.submit({
                url: me.url,
                waitMsg: me.waitMsg,
                waitTitle: me.waitTitle,
                success: me.onSubmitSuccess,
                failure: me.onSubmitFailure,
                scope: me
            });
        }
    },

    onSubmitSuccess: function () {
        this.close();
    },

    onSubmitFailure: function () {
        SimpleCMS.FailureProcess.Form.apply(this,arguments);
    },

    onWindowShow: function () {
        this.firstField.focus(true, 10);
    },

    afterRender: function () {
        var me = this;
        me.callParent(arguments);
        me.keyNav = new Ext.util.KeyNav(me.form.body, {
            enter: me.onFoucs,
            scope: me
        });
    },

    onFoucs: function (e) {
        var me = this,
             nextField = me.form.getForm().findField(e.getTarget().name).nextNode('field:not(hiddenfield)') || me.firstField;
        nextField.focus(true, 10);
    },

    onDestroy: function () {
        var me = this;
        me.keyNav.destroy();
        me.callParent(arguments);
    }


});
