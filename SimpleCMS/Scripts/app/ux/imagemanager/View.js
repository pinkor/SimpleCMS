Ext.define('SimpleCMS.ux.imagemanager.View', {
    extend: 'Ext.container.Container',
    xtype: 'imageManagerView',
    requires: [
        'SimpleCMS.ux.imagemanager.store.Folders',
        'SimpleCMS.ux.imagemanager.store.Files',
        'Ext.tree.Panel',
        'Ext.layout.container.Border',
        'SimpleCMS.ux.imagemanager.FolderEdit',
        'Ext.tree.plugin.TreeViewDragDrop',
        'Ext.ux.DataView.DragSelector',
        'SimpleCMS.ux.button.MultiSort',
        'Ext.ux.DataView.Animated',
        'Ext.ux.DataView.LabelEditor',
        'SimpleCMS.ux.imagemanager.Image',
        'Ext.ux.upload.Button'
    ],
    layout: "border",
    displayMsg: '{0} 个文件',

    initComponent: function () {
        var me = this,
            dataViewId = Ext.id(),
            foldersStore = me.foldersStore = Ext.getStore("Folders") || new SimpleCMS.ux.imagemanager.store.Folders(),
            filesStore = me.filesStore = Ext.getStore("Files") || new SimpleCMS.ux.imagemanager.store.Files();

        me.tree = new Ext.tree.Panel({
            title: '目录', region: 'west', collapsible: true, rootVisible: true,
            width: 250, minWidth: 100, maxWidth: 500, split: true, store: me.foldersStore,
            tbar: [
                { iconCls: "simplecms-icon-folderAdd", handler: me.onAddFolder, scope: me, tooltip: "添加目录" },
                { iconCls: "simplecms-icon-folderEdit", handler: me.onEditFolder, scope: me, disabled: true, tooltip: "编辑目录", itemId: 'Edit' },
                { iconCls: "simplecms-icon-folderDelete", handler: me.onDeleteFolder, scope: me, disabled: true, tooltip: "删除目录", itemId: 'Delete' },
                { iconCls: "x-tbar-loading", handler: me.onRefreshFolder, scope: me, tooltip: "刷新目录树" }
            ],
            viewConfig: {
                plugins: {
                    ptype: 'treeviewdragdrop',
                    containerScroll: true,
                    ddGroup: 'imageDD'
                },
                listeners: {
                    scope: me,
                    drop: me.onDropFolder
                }
            },
            listeners: {
                scope: me,
                selectionchange: me.onSelectFolder
            }
        });

        me.dataview = new SimpleCMS.ux.imagemanager.Image({
            store: me.filesStore, autoScroll: true, itemSelector: 'div.simplecms-imageList',
            selectedItemCls: 'simplecms-imagList-selected', overItemCls: 'simplecms-imagList-overItem',
            multiSelect: true, id: dataViewId,
            plugins: [
                { xclass: 'Ext.ux.DataView.DragSelector' },
                //{ xclass: 'Ext.ux.DataView.Animated' }
                {
                    xclass: 'Ext.ux.DataView.LabelEditor', dataIndex: 'Name',
                    listeners: {
                        scope: me,
                        complete: me.onFilenameEditComplete
                    }
                }
            ],
            tpl: [
                '<tpl for=".">',
                    '<div class="simplecms-imageList">',
                        '<img width="160" height="160" src="Thumbnail{id}?width=160&height=160" data-qtip="文件名：{Name}<br/>修改日期：{LastWriteTime}<br>大小：{Length:this.filesize}" /><br/>',
                        '<p class="x-editable ellipsis">{Name}</p>',
                    '</div>',
                '</tpl>',
                '<div class="x-clear"></div>',
                {
                    filesize: function (v) {
                        if (v < 1024) {
                            return v + " 字节";
                        } else if (v < 1048576) {
                            return (Math.round(((v * 10) / 1024)) / 10) + " KB";
                        } else {
                            return (Math.round(((v * 10) / 1048576)) / 10) + " MB";
                        }
                    }
                }
            ],
            listeners: {
                scope: me,
                selectionchange: me.onSelectFile
            }
        });

        me.searchForm = new Ext.form.Panel({
            border: false,
            bodyPadding: 5,
            width: 400,
            defaultType: 'textfield',
            fieldDefaults: {
                labelWidth: 80,
                labelSeparator: '：',
                anchor: '0',
                allowBlank: true
            },
            items: [
                {
                    fieldLabel: '文件名', name: 'Filename', regex: /^(\w?\.?\*?-?\??)*$/, regexText: '请输入正确的查询字符', maxLength: 100
                },
                {
                    xtype: 'datefield', fieldLabel: '开始日期', name: 'StartDate', itemId: 'startdt', vtype: 'daterange', endDateField: 'enddt'
                },
                {
                    xtype: 'datefield', fieldLabel: '结束日期', name: 'EndDate', itemId: 'enddt', vtype: 'daterange', startDateField: 'startdt'
                },
                {
                    xtype: 'combo', fieldLabel: '大小', name: 'Length', editable: true, forceSelection: false, valueField: 'id', displayField: 'text',
                    store: [
                        [0, '空（0kb）'],
                        [1, '微小（0 - 10 KB）'],
                        [2, '小（10 - 100 KB）'],
                        [3, '中（100 KB - 1 MB）'],
                        [4, '大（1 - 5 MB）'],
                        [5, '特大（5 - 10 MB）'],
                        [6, '巨大（> 10 MB）']
                    ]
                },
                {
                    xtype: 'container', anchor: '-5', html: '注意：文件名搜索允许的查询字符包括：小写字母、大写字母、小数点（.）、连接符（-）、底线（_）、星号（*)和问号（?)，其中星号和问号为通配符，星号可代替一个或多个字符，一个问号只能代替一个字符。', style: 'color:#00f'
                }
            ],
            dockedItems: [{
                xtype: 'toolbar', dock: 'bottom', ui: 'footer', layout: { pack: 'center' },
                items: [
                    { text: '搜索', width: 80, disabled: true, formBind: true, handler: me.onSearch, scope: me },
                    { text: '重置', width: 80, handler: me.onResetSearchForm, scope: me }
                ]
            }]
        });

        me.progress = Ext.widget("progressbar", { text: "上传进度", flex: 1 });

        me.items = [
            me.tree,
            {
                title: "文件", region: "center", layout: 'fit', items: [me.dataview],
                tbar: [
                    '排序：',
                    { xtype: 'multisortbutton', direction: 'DESC', dataIndex: 'LastWriteTime', text: '最后修改时间', handler: me.onUpdateSorter, scope: me },
                    { xtype: 'multisortbutton', dataIndex: 'Name', text: '文件名', handler: me.onUpdateSorter, scope: me },
                    { xtype: 'multisortbutton', dataIndex: 'Length', text: '文件大小', handler: me.onUpdateSorter, scope: me },
                    {
                        text: '搜索', menu: {
                            xtype: 'menu',
                            plain: true,
                            items: me.searchForm
                        }
                    },
                    { iconCls: "simplecms-icon-pagewhite-delete", handler: me.onDeleteFile, scope: me, disabled: true, tooltip: "删除文件", itemId: 'Delete' },
                    { iconCls: "x-tbar-loading", handler: me.onRefreshFile, scope: me, tooltip: "刷新文件列表" },
                    '->',
                    { xtype: 'tbtext' , itemId: 'FileCount' }
                ],
                bbar: [
                    {
                        xtype: 'uploadbutton', text: '上传文件',
                        uploader:
                        {
                            url: 'File/Upload',
                            drop_element: dataViewId,
                            max_file_size: '10mb',
                            statusQueuedText: '准备上传',
                            statusUploadingText: '正在上传 ({0}%)',
                            statusFailedText: '<span style="color: red">错误</span>',
                            statusDoneText: '<span style="color: green">完成</span>',

                            statusInvalidSizeText: '文件太大',
                            statusInvalidExtensionText: '无效的文件类型',
                            filters: [
                                { title: "图片文件", extensions: "jpg,gif,png,bmp" },
                            ]
                        },
                        listeners:
                        {
                            filesadded: me.onFilesAdded,
                            uploadprogress: me.onUpoadProgress,
                            uploadcomplete: me.onUploadComplete,
                            scope: me
                        }
                    },
                    me.progress
                ]
            }
        ];


        me.callParent(arguments);
        me.filesStore.on('refresh', me.onFileStoreRefresh, me);
    },

    afterRender: function () {
        var me = this,
            root = me.foldersStore.getRootNode(),
            selmodel = me.tree.getSelectionModel();
        if (!root.isExpanded()) {
            root.expand();
        }

        if (!selmodel.hasSelection()) {
            selmodel.select(root);
        }
        me.callParent(arguments);
    },

    checkSelected: function(){
        var selmodel = this.tree.getSelectionModel();
        if (selmodel.hasSelection()) {
            return selmodel.getSelection();
        } else {
            Ext.Msg.alert('信息', '请选择目录，再操作。');
            return [];
        };
    },

    onAddFolder: function () {
        var me = this,
            data = me.checkSelected(),
            node = data.length == 0 ? me.foldersStore.getRootNode() : data[0];
        SimpleCMS.ImageManagerFolderEdit.setState(node, "Add");
    },

    onSelectFolder: function (sm, selected, eOpts) {
        var me = this,
            node = selected[0],
            disabled = (node && node.isRoot());
        me.tree.down('#Edit').setDisabled(disabled);
        me.tree.down('#Delete').setDisabled(disabled);
        if (node) {
            me.dataview.up().setTitle('文件：目录“' + node.data.text + '”');
            me.filesStore.proxy.extraParams.Path = node.data.id;
            me.filesStore.load();
        }
    },

    onEditFolder: function () {
        var me = this,
            data = me.checkSelected();
        if (data.length == 0) return;
        data = data[0];
        if (data.isRoot()) {
            Ext.Msg.alert('编辑目录', '根目录不允许编辑');
            return;
        }
        SimpleCMS.ImageManagerFolderEdit.setState(data, "Edit");
    },

    onDeleteFolder: function () {
        var me = this,
            data = me.checkSelected();
        if (data.length == 0) return;
        data = data[0];
        if (data.isRoot()) {
            Ext.Msg.alert('删除目录', '根目录不允许删除');
            return;
        }
        var content = "确定删除目录“" + data.data.text + "”？<br/><p style='color:red'>注意：目录下的文件及子目录都会被删除。</p>";
        Ext.Msg.confirm("删除目录", content,
            function (btn) {
                if (btn == "yes") {
                    Ext.Ajax.request({
                        url: 'Folder/Delete',
                        params: { Path: data.data.id },
                        node: data,
                        scope: this,
                        success: function (response, opts) {
                            var obj = Ext.decode(response.responseText);
                            if (obj.success) {
                                var node = opts.node,
                                    parentNode = node.parentNode;
                                parentNode.removeChild(node);
                                this.tree.getSelectionModel().select(parentNode);
                            } else {
                                Ext.Msg.alert('删除目录', obj.msg);
                            }
                        },
                        failure: SimpleCMS.FailureProcess.Ajax
                    });
                }
            }
        , me);
    },

    onRefreshFolder: function () {
        var me = this,
            data = me.checkSelected(),
            node = data.length == 0 ? me.foldersStore.getRootNode() : data[0];
        me.foldersStore.load({ node: node });
    },

    onDropFolder: function (node, data, overModel, dropPosition, eOpts) {
        if (data.view) {
            Ext.Ajax.request({
                url: 'Folder/Drop',
                params: { Destination: overModel.data.id, Source: data.records[0].data.id },
                scope: this,
                success: function (response, opts) {
                    var me = this,
                        obj = Ext.decode(response.responseText);
                    if (obj.success) {
                    } else {
                        Ext.Msg.alert('移动目录', obj.msg);
                    }
                    me.foldersStore.load({ node: me.foldersStore.getRootNode() });
                },
                failure: SimpleCMS.FailureProcess.Ajax
            });
        } else {
            var rs = this.dataview.getSelectionModel().getSelection(),
                ids = [];
            for (var i = rs.length -1;  i >= 0; i--) {
                ids.push(rs[i].data.path + rs[i].data.Name);
            }
            Ext.Ajax.request({
                url: 'File/Drop',
                params: { Destination: overModel.data.id, Source: ids },
                scope: this,
                success: function (response, opts) {
                    var me = this,
                        obj = Ext.decode(response.responseText);
                    if (obj.msg) {
                        Ext.Msg.alert('移动文件', obj.msg);
                    }
                    me.foldersStore.load({ node: me.foldersStore.getRootNode() });
                    me.filesStore.load();
                },
                failure: SimpleCMS.FailureProcess.Ajax,
            });
        }
    },

    onUpdateSorter: function (btn, e) {
        btn.toggleDirection();
        this.filesStore.sort(btn.getDataIndex(), btn.getDirection());
    },

    onSearch: function () {
        var me = this,
            f = me.searchForm.getForm(),
            values = f.getValues(),
            hasValue = false;
        Ext.Object.each(values, function (key, value, myself) {
            if (!Ext.isEmpty(value)) {
                hasValue = true;
                return false;
            }
        });
        if (hasValue) {
            if (f.isValid()) {
                f.submit({
                    url: 'File/Search',
                    waitMsg: "正在提交，请等待……",
                    waitTitle: "正在提交",
                    success: function (form, action) {
                        var me = this,
                        f = me.searchForm.getForm(),
                        values = f.getValues(),
                        lenght = f.findField('Length').getRawValue();
                        me.dataview.up().setTitle(Ext.String.format('文件：搜索结果（文件名：“{0}”,日期：“{1}~{2}”,大小：“{3}”）',
                            values.Filename, values.StartDate, values.EndDate, lenght));
                        Ext.getStore('Files').loadData(action.result.data);

                    },
                    failure: SimpleCMS.FailureProcess.Form,
                    scope: me
                });
            }
        } else {
            Ext.Msg.alert('信息', '请指定至少一个条件。');
        }
    },

    onResetSearchForm: function () {
        this.searchForm.getForm().reset();
    },

    onFilenameEditComplete: function (edit, value, startValue, eOpts) {
        if (value != startValue) {
            var record = edit.activeRecord;
            Ext.Ajax.request({
                url: 'File/Rename',
                params: { File: record.data.id, NewName: value },
                record: record,
                scope: this,
                success: function (response, opts) {
                    var obj = Ext.decode(response.responseText);
                    if (obj.success) {
                        opts.record.commit();
                    } else {
                        Ext.Msg.alert('修改文件名', obj.msg);
                        opts.record.reject();
                    }
                },
                failure: SimpleCMS.FailureProcess.Ajax,
            });
        }
    },

    onSelectFile: function (sm, selected, eOpts) {
        this.dataview.up().down('#Delete').setDisabled(selected.length == 0);
    },

    onDeleteFile: function () {
        var me = this,
            sm = me.dataview.getSelectionModel();
        if (sm.hasSelection()) {
            var rs = sm.getSelection(),
                ln = rs.length,
                ids = [],
                content = ['确定要删除以下文件?'];
            for (var i = 0 ; i < ln ; i++) {
                ids.push(rs[i].data.id);
                content.push(rs[i].data.Name);
            }
            Ext.Msg.confirm("删除文件", content.join('<br/>'),
                function (btn) {
                    if (btn == "yes") {
                        Ext.Ajax.request({
                            url: 'File/Delete',
                            params: { Files: ids },
                            scope: this,
                            success: function (response, opts) {
                                var obj = Ext.decode(response.responseText);
                                if (obj.success) {
                                } else {
                                    Ext.Msg.alert('删除文件', obj.msg);
                                }
                                Ext.getStore('Files').load();
                            },
                            failure: SimpleCMS.FailureProcess.Ajax,
                        });
                    }
                }
            , me);
        } else {
            Ext.Msg.alert('删除文件', '请选择要删除的文件');
        }
    },

    onRefreshFile: function () {
        this.filesStore.load();
    },

    onFileStoreRefresh: function () {
        var me = this;
        me.dataview.up().down('#FileCount').update(Ext.String.format(me.displayMsg, me.filesStore.getCount()));
    },

    onFilesAdded: function (uploader, files) {
        var sm = this.tree.getSelectionModel();
        uploader.multipart_params.Path = sm.hasSelection() ? sm.getSelection()[0].data.id : '/';
        uploader.start();
    },

    onUpoadProgress: function (uploader, file, name, size, percent) {
        this.progress.updateProgress(percent,
            Ext.String.format('正在上传文件：{0}， 大小：{1}，进度： {0}% ', name, size, percent)
        );
    },

    onUploadComplete: function (uploader, success, failed) {
        var me = this;
        me.progress.updateProgress(0,
            Ext.String.format('文件已经全部上传。成功：{0} ，失败： {1}', success.length, failed.length)
         );
        me.filesStore.load();
    }

});
