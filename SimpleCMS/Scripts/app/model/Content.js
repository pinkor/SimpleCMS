Ext.define('SimpleCMS.model.Content', {
    extend: 'Ext.data.Model',
    fields: [
    	{ name: "ContentId", type: "int" },
        { name: "CategoryId", type: "int", defaultValue: 10000 },
    	"Title",
    	{ name: "Created", type: "date", dateFormat: "Y-m-d H:i:s", defaultValue: new Date() },
        { name: "Hits", type: "int" },
        { name: "SortOrder", type: "int", defaultValue: 0 },
        "Tags"
    ],
    idProperty: "ContentId"
});
