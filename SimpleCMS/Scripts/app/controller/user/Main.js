Ext.define('SimpleCMS.controller.user.Main', {
    extend: 'Ext.app.Controller',

    refs: [
        {
            ref: 'userView',
            selector: '#userMain'
        }
    ],

    init: function () {
        var me = this;
        me.control({
            '#userMain': {
                show: {
                    single: true,
                    fn: me.onViewShow
                },
                selectionchange: me.onSelectUser
            },
            '#userMain #Add': {
                click: me.onAddUser
            },
            '#userMain #Delete': {
                click: me.onDeleteUser
            },
            '#userMain #ResetPassword': {
                click: me.onResetPassword
            }
        });
    },

    onViewShow: function () {
        var me = this;
        me.getUserView().rowEditing.on({
            scope: me,
            canceledit: me.onCancelEdit,
            edit: me.onCompleteEdit
        });
        Ext.getStore('Users').load();
        me.getUserView().columns[3].on('checkchange', me.onCheckChange);
    },

    onAddUser: function () {
        var me = this
        edit = me.getUserView().rowEditing,
        store = Ext.getStore('Users');
        edit.cancelEdit();
        store.insert(0, new SimpleCMS.model.User());
        edit.startEdit(0, 0);
    },

    onCancelEdit: function (editor, context, eOpts) {
        Ext.getStore('Users').rejectChanges();
    },

    onCompleteEdit: function () {
        Ext.getStore('Users').sync({
            success: function (e, opts) {
            },
            failure: function (e, opts) {
                Ext.Msg.alert("保存用户发生错误", e.exceptions[0].error);
                Ext.getStore("Users").rejectChanges();
            },
            scope: this
        });
    },

    onSelectUser: function (sm, selected, eOpts) {
        var view = this.getUserView(),
            disabled = (selected.length == 0);
        view.down('#Delete').setDisabled(disabled);
        view.down('#ResetPassword').setDisabled(disabled);
    },

    onDeleteUser: function () {
        var me = this,
            sm = me.getUserView().getSelectionModel();
        if (sm.hasSelection()) {
            var rs = sm.getSelection(),
                ids = [],
                content = ["确定删除以下用户？"];
            for (var i = 0; ln = rs.length, i < ln; i++) {
                ids.push(rs[i].data.id)
                content.push(rs[i].data.UserName);
            }
            Ext.Msg.confirm("删除用户", content.join("<br/>"),
                function (btn) {
                    if (btn == "yes") {
                        Ext.Ajax.request({
                            url: 'User/Delete',
                            params: { data: ids },
                            success: function (response, opts) {
                                var obj = Ext.decode(response.responseText);
                                if (obj.success) {
                                    Ext.getStore("Users").load();
                                } else {
                                    Ext.Msg.alert('删除用户', obj.msg);
                                }
                            },
                            failure: SimpleCMS.FailureProcess.Ajax,
                        });
                    }
                }
            , me);
        } else {
            Ext.Msg.alert('删除用户', '请选择要删除的用户。');
        }
    },

    onResetPassword: function () {
        var me = this,
            sm = me.getUserView().getSelectionModel();
        if (sm.hasSelection()) {
            var rs = sm.getSelection(),
                content = ["确定要重置以下用户的密码？"];
            for (var i = 0; ln = rs.length, i < ln; i++) {
                if (!rs[i].data.IsConfirmed) {
                    Ext.Msg.alert('重置密码', '用户“' + rs[i].data.UserName + '”不允许登录，不能修改密码，操作中止。');
                    return;
                }
                content.push(rs[i].data.UserName);
            }
            Ext.Msg.confirm("重置密码", content.join("<br/>"),
                function (btn) {
                    if (btn == "yes") {
                        Ext.Ajax.request({
                            url: 'User/ResetPassword',
                            params: { data: content.slice(1) },
                            success: function (response, opts) {
                                var obj = Ext.decode(response.responseText);
                                if (obj.success) {
                                    Ext.Msg.alert('重置密码', '重置密码成功。');;
                                } else {
                                    Ext.Msg.alert('重置密码', obj.msg);
                                }
                            },
                            failure: SimpleCMS.FailureProcess.Ajax,
                        });
                    }
                }
            , me);
        } else {
            Ext.Msg.alert('重置密码', '请选择要重置密码的用户。');
        }
    },

    onCheckChange: function (cmp, rowIndex, checked, eOpts) {
        var record = Ext.getStore("Users").getAt(rowIndex);
        Ext.Ajax.request({
            url: 'User/CheckChange',
            params: { data: record.data.id },
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText),
                    store = Ext.getStore("Users");
                if (obj.success) {
                    store.commitChanges();
                } else {
                    store.rejectChanges();
                }
            },
            failure: SimpleCMS.FailureProcess.Ajax,
        });
    }


});
