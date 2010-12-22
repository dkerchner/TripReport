// create the Data Store
var tripds = new Ext.data.Store({
    autoLoad: true,
    proxy: new Ext.data.HttpProxy({
        url: 'http://localhost:8080/TripReportSPT/trip/listJSON'}),
    reader: new Ext.data.JsonReader({
        results: 'total',
        root:'items',
        id:'id'
    },
            [
                {name: 'version', type: 'int', mapping: 'version'},
                {name: 'id', type: 'int', mapping: 'id'},
                {name: 'name', type: 'string', mapping: 'name'},
                {name: 'startDate', type: 'date', mapping: 'startDate'},
                {name: 'endDate', type: 'date', mapping: 'endDate'},
                {name: 'purpose', type: 'string', mapping: 'purpose'},
                {name: 'approved', type: 'boolean', mapping: 'approved'} ,
                {name: 'approvedBy', type: 'string', mapping: 'approvedBy'},
                {name: 'events', type: 'string', mapping: 'events'},
                {name: 'contracts', type: 'string', mapping: 'contracts'},
                {name: 'attendees', type: 'string', mapping: 'attendees'},
                {name: 'locations', type: 'string', mapping: 'locations'}

            ]
            ),
    baseParams:     {
        now:        (new Date()).getTime()
    },
    writer: new Ext.data.JsonWriter({
        encode:     true
    })
});

// create the Data Store
var reportds = new Ext.data.Store({
    autoLoad: true,
    proxy: new Ext.data.HttpProxy({
        url: 'http://localhost:8080/TripReportSPT/report/listJSON'}),
    reader: new Ext.data.JsonReader({
        results: 'total',
        root:'items',
        id:'id'
    },
            [
                {name: 'version', type: 'int', mapping: 'version'},
                {name: 'id', type: 'int', mapping: 'id'},
                {name: 'name', type: 'string', mapping: 'name'},
                {name: 'trip', type: 'string', mapping: 'trip'},
                {name: 'author', type: 'string', mapping: 'author'},
                {name: 'usefulness', type: 'int', mapping: 'usefulness'},
                {name: 'issues', type: 'string', mapping: 'issues'},
                {name: 'topics', type: 'string', mapping: 'topics'},
                {name: 'actionItems', type: 'string', mapping: 'actionItems'},
                {name: 'contacts', type: 'string', mapping: 'contacts'}
            ]
            )
});

var eventds = new Ext.data.Store({
    autoLoad: true,
    proxy: new Ext.data.HttpProxy({
        url: 'http://localhost:8080/TripReportSPT/event/listJSON'}),
    reader: new Ext.data.JsonReader({
        results: 'total',
        root:'items',
        id:'id'
    },
            [
                {name: 'version', type: 'int', mapping: 'version'},
                {name: 'id', type: 'int', mapping: 'id'},
                {name: 'name', type: 'string', mapping: 'name'},
                {name: 'startDate', type: 'date', mapping: 'startDate'},
                {name: 'endDate', type: 'date', mapping: 'endDate'},
                {name: 'description', type: 'string', mapping: 'description'},
                {name: 'location', type: 'string', mapping: 'location.name'}
            ]
            ),
    baseParams:     {
        now:        (new Date()).getTime()
    },
    writer: new Ext.data.JsonWriter({
        encode:     true
    })
});
