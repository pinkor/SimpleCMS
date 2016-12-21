Ext.define('SimpleCMS.controller.Viewport', {
    extend: 'Ext.app.Controller',
    requires: [
        'SimpleCMS.ux.window.Login',
        'SimpleCMS.view.Main',
        'SimpleCMS.view.Header',
        'Ext.History',
        'Ext.state.Manager',
        'Ext.state.CookieProvider'
    ],

    refs: [
        {
            ref: 'viewport',
            selector: 'viewport'
        }
    ],

    onLaunch: function () {
        Ext.Ajax.request({
            url: 'Account/GetUserInfo',
            success: function (response, opts) {
                var me =this,
                    obj = Ext.decode(response.responseText);
                if (obj.success) {
                    Ext.apply(SimpleCMS.Config, obj.data);
                    Ext.History.init();
                    Ext.state.Manager.setProvider(new Ext.state.CookieProvider({
                        listeners: {
                            //statechange: me.onStateChange,
                            scope: me
                        }
                    }));
                    me.getViewport().add({
                        xtype: 'app-header',
                        height: 51,
                        id: 'app-header'
                    }, {
                        xtype: 'app-main',
                        flex: 1,
                        id: 'app-main',
                        listeners: {
                            tabchange: me.onTabChange,
                            afterrender: me.onMainAfterRender,
                            scope: me
                        }
                    });
                } else {
                    SimpleCMS.Login.setSize(450, 300);
                    SimpleCMS.Login.setTitle('简单的CMS管理系统后台登录窗口');
                    SimpleCMS.Login.show()
                }
            },
            failure: SimpleCMS.FailureProcess.Ajax,
            scope: this
        });
    },

    onTabChange: function (tabPanel, tab) {
        Ext.History.add(tab.getId());
    },

    onMainAfterRender: function () {
        Ext.History.on('change', this.onHistoryChange);
    },

    onHistoryChange: function (token) {
        var tab = Ext.getCmp(token);
        Ext.getCmp('app-main').setActiveTab(tab || 0);
    }

    /*
    onStateChange: function (stateProvider, key, value, eOpts) {
        var cfg = SimpleCMS.Config,
            seedId, newToken;
        if (value.stateTab || value.width) {
            seedId = cfg.stateSeed++;
            newToken = key + '_' + seedId;
            if (value.width) {
                value['oldValue'] = cfg.currentStateValue[key];
                cfg.currentStateValue[key] = value.width;
            }
            cfg.stateHistory[newToken] = value;
            cfg.tokens.push(newToken);
            Ext.History.add(newToken);
        }
    },

    onMainAfterRender: function (cmp, opts) {
        var stateCmps = cmp.query('[stateful=true]'),
            cfg = SimpleCMS.Config.currentStateValue;
        for (var i = stateCmps.length - 1; i >= 0 ; i--) {
            cfg[stateCmps[i].stateId] = stateCmps[i].getWidth();
        }
        Ext.History.on('change', this.onHistoryChange);
    },

    onHistoryChange: function (token) {
        var partId, parts, tabpanel, items, item, stateValue, value, cfg, oldWidth,
            tokens = SimpleCMS.Config.tokens;
        if (tokens[tokens.length - 1] == token) return;
        if (token) {
            partId = token.substring(0, token.indexOf('_')).replace(/state/, ''),
            parts = Ext.getCmp(partId);
            if (parts) {
                parts.suspendEvents(false);
                cfg = SimpleCMS.Config;
                value = cfg.stateHistory[token];
                if (value.stateTab) {
                    parts.setActiveTab(value.stateTab || 0);
                } else if (value.width) {
                    oldWidth = cfg.currentStateValue['state' + partId];
                    tabpanel = parts.up('tabpanel');
                    if (tabpanel) {
                        items = tabpanel.items.items;
                        for (var i = items.length - 1; i >= 0; i--) {
                            item = items[i];
                            if (item.down(partId)) {
                                break;
                            }
                        }
                    }
                    tabpanel.setActiveTab(item);
                    parts.setWidth(value.oldValue);
                    cfg.currentStateValue['state' + partId] = value.oldValue;
                }
                parts.resumeEvents();
            }
        }
    }
    */

});
