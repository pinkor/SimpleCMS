Ext.define('SimpleCMS.ux.grid.Search', {
    extend: 'Ext.grid.Panel',
    xtype: 'searchGrid',
    requires: [
        'Ext.grid.column.*',
        'Ext.data.Store'
    ],

    fieldDatas: null,

    initComponent: function () {
        var me = this;

        me.store = new Ext.data.Store({
            fields: [
               'property', 'operator', 'value',
               'propertyName', 'operatorName'
            ]
        });

        me.columns = [
               { text: '字段', dataIndex: 'propertyName', flex: 1 },
               { text: '操作符', dataIndex: 'operatorName', flex: 1 },
               { text: '值', dataIndex: 'value', flex: 1 },
               {
                   xtype: 'actioncolumn',
                   cls: 'simplecms-column-delete x-column-header-text',
                   width: 24,
                   iconCls: 'simplecms-icon-delete',
                   tooltip: '删除',
                   menuDisabled: true,
                   sortable: false,
                   draggable: false,
                   resizable: false,
                   hideable: false,
                   handler: Ext.bind(me.onDeleteFilter, me)
               }
        ];

        me.propertyStore = new Ext.data.ArrayStore({
            fields: ['id', 'text', 'type'],
            data: me.fieldDatas
        });


        me.operatorStore = new Ext.data.ArrayStore({
            fields: [
                'id', 'text',
                { name: 'stringOnly', type: 'boolean' }
            ],
            data: [
                ['>', '大于', false], ['>=', '大于等于', false],
                ['<', '小于', false], ['<=', '小于等于', false],
                ['==', '等于', false], ['!=', '不等于', false],
                ['Contains', '匹配任何位置', true],
                ['StartsWith', '匹配开始位置', true],
                ['EndsWith', '匹配结尾位置', true],
                ['Equals', '等于', true]
            ]
        });

        me.propertyField = new Ext.form.field.ComboBox({
            name: 'property', width: 100, valueField: 'id',
            forceSelection: true, allowBlank: false,
            editable: false, store: me.propertyStore,
            listeners: {
                change: me.onFieldChange,
                scope: me
            }
        });

        me.operatorField = new Ext.form.field.ComboBox({
            name: 'operator', width: 120, valueField: 'id',
            forceSelection: true, allowBlank: false,
            editable: false, store: me.operatorStore,
            queryMode: 'local'
        });

        me.textField = new Ext.form.field.Text({
            name: 'value', allowBlank: false, width: 200,
            listeners: {
                change: me.onValueChange,
                scope: me
            }
        });

        me.numberField = new Ext.form.field.Number({
            hidden: true, name: 'numbervalue', allowBlank: false,
            width: 200, hideTrigger: true,
            listeners: {
                change: me.onValueChange,
                scope: me
            }
        });
        me.dateField = new Ext.form.field.Date({
            hidden: true, name: 'datevalue', allowBlank: false, width: 200,
            listeners: {
                change: me.onValueChange,
                scope: me
            }
        });

        me.addButton = new Ext.button.Button({
            iconCls: 'simplecms-addFilter', tooltip: '添加条件', disabled: true,
            handler: me.onAddFilter, scope: me
        });

        me.emptyButton = new Ext.button.Button({
            iconCls: 'simplecms-emptyFilter', tooltip: '清空条件', disabled: true,
            handler: me.onEmptyFilter, scope: me
        });

        me.searchButton = new Ext.button.Button({
            iconCls: 'simplecms-search', tooltip: '开始搜索', disabled: true,
            handler: me.onStartSearch, scope: me
        });

        me.tbar = [
            me.propertyField,
            me.operatorField,
            me.textField,
            me.numberField,
            me.dateField,
            me.addButton,
            '->',
            me.emptyButton,
            me.searchButton
        ];

        me.callParent(arguments);

        me.propertyField.setValue(me.propertyStore.getAt(0).data.id);
        me.store.on('datachanged', me.onDataChanged, me);
        me.addEvents('startfilter');
    },

    onFieldChange: function (cmp, newValue, oldValue, eOpts) {
        var me = this;
        if (newValue != oldValue) {
            var rs = me.propertyStore.getById(newValue)
            if (rs) {
                me.operatorStore.clearFilter(true);
                me.operatorStore.filter('stringOnly', rs.data.type == 'string');
                me.operatorField.setValue(me.operatorStore.getById(rs.data.type == 'string' ? 'Contains' : '>').data.id);
                me.dateField.reset();
                me.numberField.reset();
                me.textField.reset();
                if (rs.data.type == 'date') {
                    me.dateField.show();
                    me.numberField.hide();
                    me.textField.hide();
                } else if (rs.data.type == 'number') {
                    me.numberField.show();
                    me.textField.hide();
                    me.dateField.hide();
                } else {
                    me.textField.show();
                    me.numberField.hide();
                    me.dateField.hide();
                }
            }
        }
    },

    onValueChange: function (cmp, newValue, oldValue, eOpts) {
        this.addButton.setDisabled(!cmp.isValid());
    },

    onAddFilter: function () {
        var me = this,
            property = me.propertyField.getValue(),
            rs = me.propertyStore.getById(property),
            value = rs.data.type == 'date' ? Ext.Date.format(me.dateField.getValue(), 'Y-m-d') :
                rs.data.type == 'number' ? me.numberField.getValue() : me.textField.getValue();
        me.store.add({
            property: property,
            propertyName: me.propertyField.getRawValue(),
            operator: me.operatorField.getValue(),
            operatorName: me.operatorField.getRawValue(),
            value: value
        });
    },

    onDeleteFilter: function (view, rowIndex, colIndex, item, e, record, row) {
        this.store.remove(record);
    },

    onDataChanged: function (store, eOpts) {
        var me = this,
            disabled = store.getCount() == 0;
        me.emptyButton.setDisabled(disabled);
        me.searchButton.setDisabled(disabled);
    },

    onEmptyFilter: function () {
        this.store.removeAll();
    },

    onStartSearch: function (btn, e) {
        this.fireEvent('startfilter', this, e);
    }

})
