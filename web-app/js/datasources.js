// create the Data Store

var tripDS = new Ext.data.Store({
    autoLoad: false,
    proxy: new Ext.data.HttpProxy({
        url: 'http://localhost:8080/TripReportSPT/trip/showJSON'}),
    reader: new Ext.data.JsonReader({},
            [
                {name: 'version', type: 'int', mapping: 'version'},
                {name: 'id', type: 'int', mapping: 'id'},
                {name: 'name', type: 'string', mapping: 'name'},
                {name: 'startDate', type: 'date', mapping: 'startDate'},
                {name: 'endDate', type: 'date', mapping: 'endDate'},
                {name: 'purpose', type: 'string', mapping: 'purpose'},
                {name: 'estimatedCost', type: 'float', mapping: 'estimatedCost'},
                {name: 'events', type: 'array', mapping: 'events'},
                {name: 'contracts', type: 'array', mapping: 'contracts'},
                {name: 'attendees', type: 'array', mapping: 'attendees'},
                {name: 'locations', type: 'array', mapping: 'locations'}

            ]
            ),
    baseParams:     {
        now:        (new Date()).getTime()
    }/*,
    writer: new Ext.data.JsonWriter({
        encode:     true
    }) */
});


var attendeeDS = new Ext.data.Store({
    autoLoad: false,
    proxy: new Ext.data.HttpProxy({
        url: 'http://localhost:8080/TripReportSPT/userTrip/showJSON'}),
    reader: new Ext.data.JsonReader({},
            [
                {name: 'version', type: 'int', mapping: 'version'},
                {name: 'id', type: 'int', mapping: 'id'},
                {name: 'name', type: 'string', mapping: 'name'},
                {name: 'startDate', type: 'date', mapping: 'startDate'},
                {name: 'endDate', type: 'date', mapping: 'endDate'},
                {name: 'purpose', type: 'string', mapping: 'purpose'},
                {name: 'estimatedCost', type: 'float', mapping: 'estimatedCost'},
                //{name: 'approved', type: 'boolean', mapping: 'approved'} ,
                //{name: 'approvedBy', type: 'string', mapping: 'approvedBy'},
                {name: 'events', type: 'array', mapping: 'events'},
                {name: 'contracts', type: 'array', mapping: 'contracts'},
                {name: 'attendee', type: 'string', mapping: 'attendee'},
                {name: 'attendeeId', type: 'int', mapping: 'attendeeId'},
                {name: 'tripId', type: 'int', mapping: 'tripId'},
                {name: 'approved', type: 'boolean', mapping: 'approved'},
                {name: 'approvedBy', type: 'string', mapping: 'approvedBy'},
                {name: 'locations', type: 'array', mapping: 'locations'}

            ]
            ),
    baseParams:     {
        now:        (new Date()).getTime()
    }
});

// create the Data Store

var reportDS = new Ext.data.Store({
    autoLoad: false,
    proxy: new Ext.data.HttpProxy({
        url: 'http://localhost:8080/TripReportSPT/report/showJSON'}),
    reader: new Ext.data.JsonReader({},
            [
                {name: 'version', type: 'int', mapping: 'version'},
                {name: 'id', type: 'int', mapping: 'id'},
                {name: 'name', type: 'string', mapping: 'name'},
                {name: 'trip', type: 'string', mapping: 'trip'},
                {name: 'author', type: 'string', mapping: 'author'},
                {name: 'usefulness', type: 'int', mapping: 'usefulness'},
                {name: 'issues', type: 'string', mapping: 'issues'},
                {name: 'topics', type: 'string', mapping: 'topics'},
                {name: 'actionItems', type: 'array', mapping: 'actionItems'},
                {name: 'contacts', type: 'array', mapping: 'contacts'}
            ]
            ),
    baseParams:     {
        now:        (new Date()).getTime()
    }
});

// List data sources (more than one row)
var attendeeListDS = new Ext.data.Store({
    autoLoad: true,
    proxy: new Ext.data.HttpProxy({
        url: 'http://localhost:8080/TripReportSPT/userTrip/listJSON'}),
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
                {name: 'estimatedCost', type: 'float', mapping: 'estimatedCost'},
                //{name: 'approved', type: 'boolean', mapping: 'approved'} ,
                //{name: 'approvedBy', type: 'string', mapping: 'approvedBy'},
                {name: 'events', type: 'array', mapping: 'events'},
                {name: 'contracts', type: 'array', mapping: 'contracts'},
                {name: 'attendee', type: 'string', mapping: 'attendee'},
                {name: 'attendeeId', type: 'int', mapping: 'attendeeId'},
                {name: 'tripId', type: 'int', mapping: 'tripId'},
                {name: 'approved', type: 'boolean', mapping: 'approved'},
                {name: 'approvedBy', type: 'string', mapping: 'approvedBy'},
                {name: 'locations', type: 'array', mapping: 'locations'}

            ]
            ),
    baseParams:     {
        now:        (new Date()).getTime()
    },
    writer: new Ext.data.JsonWriter({
        encode:     true
    })
});

var actionItemListDS = new Ext.data.Store({
    autoLoad: true,
    proxy: new Ext.data.HttpProxy({
        url: 'http://localhost:8080/TripReportSPT/actionItem/listJSON'}),
    reader: new Ext.data.JsonReader({
        results: 'total',
        root:'items',
        id:'id'
    },
            [
                {name: 'version', type: 'int', mapping: 'version'},
                {name: 'id', type: 'int', mapping: 'id'},
                {name: 'name', type: 'string', mapping: 'name'},
                {name: 'description', type: 'string', mapping: 'description'},
                {name: 'report', type: 'string', mapping: 'report'},
                {name: 'dueDate', type: 'date', mapping: 'dueDate'}
            ]
            ),
    baseParams:     {
        now:        (new Date()).getTime()
    },
    writer: new Ext.data.JsonWriter({
        encode:     true
    })
});

var contactListDS = new Ext.data.Store({
    autoLoad: true,
    proxy: new Ext.data.HttpProxy({
        url: 'http://localhost:8080/TripReportSPT/contact/listJSON'}),
    reader: new Ext.data.JsonReader({
        results: 'total',
        root:'items',
        id:'id'
    },
            [
                {name: 'version', type: 'int', mapping: 'version'},
                {name: 'id', type: 'int', mapping: 'id'},
                {name: 'firstName', type: 'string', mapping: 'firstName'},
                {name: 'lastName', type: 'string', mapping: 'lastName'},
                {name: 'organization', type: 'string', mapping: 'organization'},
                {name: 'email', type: 'string', mapping: 'email'},
                {name: 'phoneNumber', type: 'string', mapping: 'phoneNumber'}
            ]
            ),
    baseParams:     {
        now:        (new Date()).getTime()
    },
    writer: new Ext.data.JsonWriter({
        encode:     true
    })
});

var contractListDS = new Ext.data.Store({
    autoLoad: true,
    proxy: new Ext.data.HttpProxy({
        url: 'http://localhost:8080/TripReportSPT/contract/listJSON'}),
    reader: new Ext.data.JsonReader({
        results: 'total',
        root:'items',
        id:'id'
    },
            [
                {name: 'version', type: 'int', mapping: 'version'},
                {name: 'id', type: 'int', mapping: 'id'},
                {name: 'name', type: 'string', mapping: 'name'},
                {name: 'organization', type: 'string', mapping: 'organization'},
                {name: 'manager', type: 'string', mapping: 'manager'},
                {name: 'active', type: 'boolean', mapping: 'active'}
            ]
            ),
    baseParams:     {
        now:        (new Date()).getTime()
    },
    writer: new Ext.data.JsonWriter({
        encode:     true
    })
});

var eventListDS = new Ext.data.Store({
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

var locationListDS = new Ext.data.Store({
    autoLoad: true,
    proxy: new Ext.data.HttpProxy({
        url: 'http://localhost:8080/TripReportSPT/location/listJSON'}),
    reader: new Ext.data.JsonReader({
        results: 'total',
        root:'items',
        id:'id'
    },
            [
                {name: 'version', type: 'int', mapping: 'version'},
                {name: 'id', type: 'int', mapping: 'id'},
                {name: 'name', type: 'string', mapping: 'name'},
                {name: 'city', type: 'string', mapping: 'city'},
                {name: 'state', type: 'string', mapping: 'state'},
                {name: 'country', type: 'string', mapping: 'country'}
            ]
            ),
    baseParams:     {
        now:        (new Date()).getTime()
    },
    writer: new Ext.data.JsonWriter({
        encode:     true
    })
});

var organizationListDS = new Ext.data.Store({
    autoLoad: true,
    proxy: new Ext.data.HttpProxy({
        url: 'http://localhost:8080/TripReportSPT/organization/listJSON'}),
    reader: new Ext.data.JsonReader({
        results: 'total',
        root:'items',
        id:'id'
    },
            [
                {name: 'version', type: 'int', mapping: 'version'},
                {name: 'id', type: 'int', mapping: 'id'},
                {name: 'name', type: 'string', mapping: 'name'},
                {name: 'url', type: 'string', mapping: 'url'}
            ]
            ),
    baseParams:     {
        now:        (new Date()).getTime()
    },
    writer: new Ext.data.JsonWriter({
        encode:     true
    })
});

var reportListDS = new Ext.data.Store({
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
                {name: 'actionItems', type: 'array', mapping: 'actionItems'},
                {name: 'contacts', type: 'array', mapping: 'contacts'}
            ]
    ),
    baseParams:     {
        now:        (new Date()).getTime()
    }
});

var roleListDS = new Ext.data.Store({
    autoLoad: true,
    proxy: new Ext.data.HttpProxy({
        url: 'http://localhost:8080/TripReportSPT/role/listJSON'}),
    reader: new Ext.data.JsonReader({
        results: 'total',
        root:'items',
        id:'id'
    },
            [
                {name: 'version', type: 'int', mapping: 'version'},
                {name: 'id', type: 'int', mapping: 'id'},
                {name: 'name', type: 'string', mapping: 'name'},
                {name: 'description', type: 'string', mapping: 'description'}
            ]
            ),
    baseParams:     {
        now:        (new Date()).getTime()
    },
    writer: new Ext.data.JsonWriter({
        encode:     true
    })
});


var tripListDS = new Ext.data.Store({
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
                {name: 'estimatedCost', type: 'float', mapping: 'estimatedCost'},
                //{name: 'approved', type: 'boolean', mapping: 'approved'} ,
                //{name: 'approvedBy', type: 'string', mapping: 'approvedBy'},
                {name: 'events', type: 'array', mapping: 'events'},
                {name: 'contracts', type: 'array', mapping: 'contracts'},
                {name: 'attendees', type: 'array', mapping: 'attendees'},
                {name: 'locations', type: 'array', mapping: 'locations'}

            ]
            ),
    baseParams:     {
        now:        (new Date()).getTime()
    }/*,
    writer: new Ext.data.JsonWriter({
        encode:     true
    }) */
});

var userListDS = new Ext.data.Store({
    autoLoad: true,
    proxy: new Ext.data.HttpProxy({
        url: 'http://localhost:8080/TripReportSPT/user/listJSON'}),
    reader: new Ext.data.JsonReader({
        results: 'total',
        root:'items',
        id:'id'
    },
            [
                {name: 'version', type: 'int', mapping: 'version'},
                {name: 'id', type: 'int', mapping: 'id'},
                {name: 'name', type: 'string', mapping: 'name'},
                {name: 'fullName', type: 'string', mapping: 'fullName'},
                {name: 'userName', type: 'string', mapping: 'userName'},
                {name: 'organization', type: 'string', mapping: 'organization'},
                {name: 'email', type: 'string', mapping: 'email'},
                {name: 'company', type: 'string', mapping: 'company'},
                {name: 'contracts', type: 'array', mapping: 'contracts'}
            ]
            ),
    baseParams:     {
        now:        (new Date()).getTime()
    },
    writer: new Ext.data.JsonWriter({
        encode:     true
    })
});
