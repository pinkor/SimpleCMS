Ext.define('SimpleCMS.ux.data.proxy.Format', {
    extend: 'Ext.data.proxy.Ajax',
    alias: 'proxy.format',
    requires: [
        'SimpleCMS.ux.data.FailureProcess'
    ],

    reader: {
        type: 'json',
        root: "data",
        messageProperty: "msg"
    },
    writer: {
        type: "json",
        encode: true,
        root: "data",
        allowSingle: false
    },
    listeners: {
        exception: function () {
            SimpleCMS.FailureProcess.Proxy.apply(this, arguments);
        }
    },
    encodeFilters: function (filters) {
        var min = [],
            length = filters.length,
            i = 0;

        for (; i < length; i++) {
            min[i] = {
                property: filters[i].property,
                value: filters[i].value,
                operator: filters[i].operator
            };
        }
        return this.applyEncoding(min);
    }

})
