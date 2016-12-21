Ext.define('SimpleCMS.ux.window.ChangePassword', {
    extend: 'Ext.window.Window',
    alternateClassName: 'SimpleCMS.ChangePassword',
    singleton: true,

    requires: [
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.Img',
        'Ext.container.Container',
        'Ext.toolbar.*',
        'Ext.button.*',
        'Ext.layout.container.Fit',
        'SimpleCMS.ux.data.FailureProcess',
        'Ext.util.KeyNav',
        'Ext.form.field.VTypes'
    ],

    modal: true,
    closable: true,
    resizable: false,
    closeAction: 'hide',
    hideMode: 'offsets',
    layout: 'fit',
    title: '修改密码',
    width: 400,
    height: 200,

    initComponent: function () {
        var me = this;
        me.form = new Ext.form.Panel({
            border: false,
            bodyPadding: 5,
            defaultType: 'textfield',
            fieldDefaults: {
                labelWidth: 80,
                labelSeparator: '：',
                anchor: '0',
                allowBlank: false
            },
            items: [
                {
                    fieldLabel: '旧密码', name: 'OldPassword', inputType: 'password'
                },
                {
                    fieldLabel: '新密码', name: 'NewPassword', inputType: 'password',  minLength: 8,
                    itemId: 'NewPassword', regex: /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W])[\da-zA-Z\W]{8,}$/, regexText: '密码必须由字母、数字和符号组成'
                },
                {
                    fieldLabel: '确认密码', name: 'ConfirmPassword', inputType: 'password',
                    vtype: 'password', initialPassField: 'NewPassword'
                }
            ],
            dockedItems: [{
                xtype: 'toolbar', dock: 'bottom', ui: 'footer', layout: { pack: 'center' },
                items: [
                    { text: '保存', width: 80, disabled: true, formBind: true, handler: me.onSave, scope: me },
                    { text: '重置', width: 80, handler: me.onReset, scope: me }
                ]
            }]
        });

        me.items = [me.form];

        me.callParent(arguments);

        me.firstField = me.form.down('textfield[name=OldPassword]');
        me.on('show', me.onMyShow, me);
    },

    onReset: function () {
        var me = this;
        me.form.getForm().reset();
        me.firstField.focus(true, 10);
    },

    onSave: function () {
        var me = this,
            f = me.form.getForm();
        if (f.isValid()) {
            f.submit({
                url: "Account/ChangePassword",
                waitMsg: "正在保存，请等待……",
                waitTitle: "正在保存",
                success: function (form, action) {
                    Ext.Msg.alert('信息', '密码修改成功，请重新登录系统',
                        function () {
                            window.location.reload();
                        }
                   );
                },
                failure: SimpleCMS.FailureProcess.Form,
                scope: me
            });
        }
    },

    onMyShow: function () {
        this.onReset();
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
