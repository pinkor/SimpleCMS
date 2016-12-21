Ext.define('SimpleCMS.Application', {
    name: 'SimpleCMS',
    requires: [
        'SimpleCMS.Config',
        'SimpleCMS.ux.data.proxy.Format',
        'SimpleCMS.ux.data.FailureProcess'
    ],

    appFolder: 'Scripts/app',

    extend: 'Ext.app.Application',

    views: [
        // TODO: add views here
        'category.Main'
    ],

    controllers: [
        // TODO: add controllers here
        'Viewport', 'Header', 'user.Main', 'category.Main', 'category.Edit','content.Main', 'content.Edit'
    ],

    stores: [
        // TODO: add stores here
        'Users', 'Contents', 'Categories', 'Tags'
    ]

});
