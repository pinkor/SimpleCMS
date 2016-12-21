Ext.define('SimpleCMS.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires:[
        'Ext.layout.container.VBox',
        'SimpleCMS.view.Main'
    ],

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    /*
    items: [{
        xtype: 'app-main'
    }]
    */
});
