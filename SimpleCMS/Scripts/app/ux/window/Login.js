Ext.define('SimpleCMS.ux.window.Login', {
    extend: 'Ext.window.Window',
    alternateClassName: 'SimpleCMS.Login',
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
        'Ext.util.KeyNav'
    ],

    modal: true,
    closable: false,
    resizable: false,
    closeAction: 'hide',
    hideMode: 'offsets',
    layout: 'fit',

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
                { fieldLabel: '用户名', name: 'UserName' },
                { fieldLabel: '密码', name: "Password", inputType: 'password' },
                { fieldLabel: '验证码', name: 'Vcode', minLength: 6, maxLength: 6},
                {
                    xtype: 'container', height: 80, anchor: '-5', layout: 'fit',
                    items: [
                        me.image = new Ext.Img({
                            style: 'cursor:pointer',
                            src: '/VerifyCode',
                            listeners: {
                                click: {
                                    fn: me.onRefreshImage,
                                    element: 'el',
                                    scope: me,
                                },
                                /*
                                afterrender: function () {
                                    console.log('图片组件渲染后。');
                                }
                                */
                            }
                        })
                    ]
                },
                {
                    xtype: 'container', anchor: '-5', html: '**验证码不区分大小写，如果看不清楚验证码，可单击图片刷新验证码。',
                    style: 'color:#00f'
                }
            ],
            dockedItems: [{
                xtype: 'toolbar', dock: 'bottom', ui: 'footer', layout: { pack: 'center' },
                items: [
                    { text: '登录', width: 80, disabled: true, formBind: true, handler: me.onLogin, scope: me },
                    { text: '重置', width: 80, handler: me.onReset, scope: me }
                ]
            }]
        });

        //// 使用on方法为图片组件绑定单击事件 
        /*
        me.image.on({
            click: me.onRefreshImage,
            element: 'el',
            scope: me
        })

        ///另一种写法
        me.image.on('click', me.onRefreshImage, me, { element: 'el' });
        */
        me.items = [me.form];

        me.callParent(arguments);

        me.firstField = me.form.down('textfield[name=UserName]');
        me.on('show', me.onMyShow, me);
    },

    onRefreshImage: function () {
        this.image.setSrc('/VerifyCode?_dc=' + (new Date()).getTime());
    },

    onReset: function () {
        var me = this;
        me.form.getForm().reset();
        me.firstField.focus(true, 10);
        me.onRefreshImage();
    },

    onLogin: function () {
        var me = this,
            f = me.form.getForm();
        if (f.isValid()) {
            f.submit({
                url: "Account/Login",
                waitMsg: "正在登录，请等待……",
                waitTitle: "正在登录",
                success: function (form, action) {
                    window.location.reload();
                },
                failure: SimpleCMS.FailureProcess.Form,
                scope: me
            });
        }
    },

    onMyShow: function () {
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
