Ext.define('SimpleCMS.model.User', {
    extend: 'Ext.data.Model',
    fields: [
        "id",
        { name: "UserName", defaultValue: "newuser" },
          { name: "Roles", defaultValue: "编辑" },
        { name: "CreateDate", type: "date", dateFormat: "Y-m-d H:i:s", defaultValue: new Date() },
         { name: "IsConfirmed", type: "bool", defaultValue: true }
    ]
});
