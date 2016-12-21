Ext.define('SimpleCMS.controller.Header', {
    extend: 'Ext.app.Controller',
    requires: [
        'SimpleCMS.ux.window.ChangePassword'
    ],

    init: function () {
        var me = this;
        me.control({
            '#app-header #logout': {
                click: me.onLogout
            },
            '#app-header #changePassword': {
                click: me.onChangePassoword
            }
        });
    },

    onLogout: function () {
        window.location = "Account/Logout";
    },

    onChangePassoword: function () {
        SimpleCMS.ChangePassword.show();
    }

});
