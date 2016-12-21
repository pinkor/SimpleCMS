Ext.define('SimpleCMS.ux.button.MultiSort', {
    extend: 'Ext.button.Button',
    xtype: 'multisortbutton',

    config: {
        direction: "ASC",
        dataIndex: undefined
    },

    constructor: function (config) {
        this.addEvents(
            'changeDirection'
        );

        this.initConfig(config);

        this.callParent(arguments);
    },

    handler: function () {
        this.toggleDirection();
    },

    updateDirection: function (direction) {
        this.setIconCls('sort-direction-' + direction.toLowerCase());
        this.fireEvent('changeDirection', direction);
    },

    toggleDirection: function () {
        this.setDirection(Ext.String.toggle(this.direction, "ASC", "DESC"));
    }
});
