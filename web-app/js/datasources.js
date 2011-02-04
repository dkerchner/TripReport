/* This contains all of the data.Store objects for the application. These are in charge of making AJAX requests
 * to the service layer to extract data. The columns in the JsonReader map to the columns of the JSON data returned
 * by the service layer. 
 */

// data.Store objects for individual recors. Used mainly in view or edit commands
var attendeeDS = new Ext.data.Store({
    autoLoad: false,
    proxy: new Ext.data.HttpProxy({
        url: 'userTrip/showJSON'}),
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

var actionItemDS = new Ext.data.Store({
    autoLoad: true,
    proxy: new Ext.data.HttpProxy({
        url: 'actionItem/showJSON'}),
    reader: new Ext.data.JsonReader({},
            [
                {name: 'version', type: 'int', mapping: 'version'},
                {name: 'id', type: 'int', mapping: 'id'},
                {name: 'name', type: 'string', mapping: 'name'},
                {name: 'description', type: 'string', mapping: 'description'},
                {name: 'reportName', type: 'string', mapping: 'report'},
                {name: 'report', type: 'int', mapping: 'reportId'},
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

var companyDS = new Ext.data.Store({
    autoLoad: true,
    proxy: new Ext.data.HttpProxy({
        url: 'company/showJSON'}),
    reader: new Ext.data.JsonReader({},
            [
             {name: 'version', type: 'int'},
             {name: 'id', type: 'int'},
             {name: 'name', type: 'string'},
             {name: 'url', type: 'string'}
            ]
            ),
    baseParams:     {
        now:        (new Date()).getTime()
    },
    writer: new Ext.data.JsonWriter({
        encode:     true
    })
});

var contactDS = new Ext.data.Store({
    autoLoad: true,
    proxy: new Ext.data.HttpProxy({
        url: 'contact/showJSON'}),
    reader: new Ext.data.JsonReader({},
            [
                {name: 'version', type: 'int', mapping: 'version'},
                {name: 'id', type: 'int', mapping: 'id'},
                {name: 'name', type:'string'},
                {name: 'firstName', type: 'string', mapping: 'firstName'},
                {name: 'lastName', type: 'string', mapping: 'lastName'},
                {name: 'organization', type: 'string', mapping: 'organization'},
                {name: 'email', type: 'string', mapping: 'email'},
                {name: 'phoneNumber', type: 'string', mapping: 'phoneNumber'},
                {name: 'notes', type: 'string'}
            ]
            ),
    baseParams:     {
        now:        (new Date()).getTime()
    },
    writer: new Ext.data.JsonWriter({
        encode:     true
    })
});

var contractDS = new Ext.data.Store({
    autoLoad: true,
    proxy: new Ext.data.HttpProxy({
        url: 'contract/showJSON'}),
    reader: new Ext.data.JsonReader({},
            [
                {name: 'version', type: 'int', mapping: 'version'},
                {name: 'id', type: 'int', mapping: 'id'},
                {name: 'name', type: 'string', mapping: 'name'},
                {name: 'contractNumber', type: 'string', mapping: 'contractNumber'},
                {name: 'organizationName', type: 'string', mapping: 'organization'},
                {name: 'organization', type: 'int', mapping: 'organizationId'},
                //{name: 'manager', type: 'string', mapping: 'manager'},
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

var eventDS = new Ext.data.Store({
    autoLoad: true,
    proxy: new Ext.data.HttpProxy({
        url: 'event/showJSON'}),
    reader: new Ext.data.JsonReader({},
            [
                {name: 'version', type: 'int', mapping: 'version'},
                {name: 'id', type: 'int', mapping: 'id'},
                {name: 'name', type: 'string', mapping: 'name'},
                {name: 'startDate', type: 'date', mapping: 'startDate'},
                {name: 'endDate', type: 'date', mapping: 'endDate'},
                {name: 'description', type: 'string', mapping: 'description'},
                {name: 'location'},
                {name: 'trips'}
            ]
            ),
    baseParams:     {
        now:        (new Date()).getTime()
    }
});

var locationDS = new Ext.data.Store({
    autoLoad: true,
    proxy: new Ext.data.HttpProxy({
        url: 'location/showJSON'}),
    reader: new Ext.data.JsonReader({},
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

var organizationDS = new Ext.data.Store({
    autoLoad: true,
    proxy: new Ext.data.HttpProxy({
        url: 'organization/showJSON'}),
    reader: new Ext.data.JsonReader({},
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

var reportDS = new Ext.data.Store({
    autoLoad: false,
    proxy: new Ext.data.HttpProxy({
        url: 'report/showJSON'}),
    reader: new Ext.data.JsonReader({},
            [
                {name: 'version', type: 'int', mapping: 'version'},
                {name: 'id', type: 'int', mapping: 'id'},
                {name: 'name', type: 'string', mapping: 'name'},
                {name: 'trip', type: 'int', mapping: 'tripId'},
                {name: 'tripName', type: 'string', mapping: 'trip'},
                {name: 'author', type: 'int', mapping: 'authorId'},
                {name: 'authorName', type: 'string', mapping: 'author'},
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

var roleDS = new Ext.data.Store({
    autoLoad: true,
    proxy: new Ext.data.HttpProxy({
        url: 'role/showJSON'}),
    reader: new Ext.data.JsonReader({},
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

var tripDS = new Ext.data.Store({
    autoLoad: false,
    proxy: new Ext.data.HttpProxy({
        url: 'trip/showJSON'}),
    reader: new Ext.data.JsonReader({},
            [
                {name: 'version', type: 'int', mapping: 'version'},
                {name: 'id', type: 'int', mapping: 'id'},
                {name: 'name', type: 'string', mapping: 'name'},
                {name: 'shortDescription', type: 'string', mapping: 'shortDescription'},
                {name: 'startDate', type: 'date', mapping: 'startDate', dateFormat:'m/d/Y'},
                {name: 'endDate', type: 'date', mapping: 'endDate', dateFormat:'m/d/Y'},
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

var userDS = new Ext.data.Store({
    autoLoad: false,
    proxy: new Ext.data.HttpProxy({
        url: 'user/showJSON'}),
    reader: new Ext.data.JsonReader({},
            [
             {name: 'version', type: 'int', mapping: 'version'},
             {name: 'id', type: 'int', mapping: 'id'},
             {name: 'displayName', type: 'string', mapping: 'name'},
             {name: 'name', type: 'string', mapping: 'fullName'},
             {name: 'userName', type: 'string', mapping: 'userName'},
             {name: 'email', type: 'string', mapping: 'email'},
             {name: 'company', type: 'int', mapping: 'company.id'},
             {name: 'companyName', type: 'string', mapping: 'company.name'},
             {name: 'contracts'},
             {name: 'roles'}
            ]
            ),
    baseParams:     {
        now:        (new Date()).getTime()
    }/*,
    writer: new Ext.data.JsonWriter({
        encode:     true
    }) */
});

// List data sources (more than one row). These are mainly used by the data grids and comboboxes. 
var attendeeListDS = new Ext.data.Store({
    autoLoad: true,
    proxy: new Ext.data.HttpProxy({
        url: 'userTrip/listJSON'}),
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
        url: 'actionItem/listJSON'}),
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
                {name: 'reportName', type: 'string', mapping: 'report'},
                {name: 'report', type: 'string', mapping: 'reportId'},
                {name: 'dueDate', type: 'date', mapping: 'dueDate'}
            ]
            ),
    baseParams:     {
        now:        (new Date()).getTime()
    }
});

var companyListDS = new Ext.data.Store({
    autoLoad: true,
    proxy: new Ext.data.HttpProxy({
        url: 'company/listJSON'}),
    reader: new Ext.data.JsonReader({
        results: 'total',
        root:'items',
        id:'id'
    },
            [
             {name: 'version', type: 'int'},
             {name: 'id', type: 'int'},
             {name: 'name', type: 'string'},
             {name: 'url', type: 'string'}
            ]
            ),
    baseParams:     {
        now:        (new Date()).getTime()
    }
});



var contactListDS = new Ext.data.Store({
    autoLoad: true,
    proxy: new Ext.data.HttpProxy({
        url: 'contact/listJSON'}),
    reader: new Ext.data.JsonReader({
        results: 'total',
        root:'items',
        id:'id'
    },
            [
                {name: 'version', type: 'int', mapping: 'version'},
                {name: 'id', type: 'int', mapping: 'id'},
                {name: 'name', type: 'string', mapping: 'name'},
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
        url: 'contract/listJSON'}),
    reader: new Ext.data.JsonReader({
        results: 'total',
        root:'items',
        id:'id'
    },
            [
                {name: 'version', type: 'int', mapping: 'version'},
                {name: 'id', type: 'int', mapping: 'id'},
                {name: 'name', type: 'string', mapping: 'name'},
                {name: 'contractNumber', type: 'string', mapping: 'contractNumber'},
                {name: 'organization', type: 'string', mapping: 'organization'},
                {name: 'organizationId', type: 'int', mapping: 'organizationId'},

                //{name: 'manager', type: 'string', mapping: 'manager'},
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
        url: 'event/listJSON'}),
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
                {name: 'location'},
                {name: 'trips'}
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
        url: 'location/listJSON'}),
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
        url: 'organization/listJSON'}),
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
        url: 'report/listJSON'}),
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
        url: 'role/listJSON'}),
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
        url: 'trip/listJSON'}),
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
                {name: 'contracts'},
                {name: 'attendees'},
                {name: 'locations'}

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
        url: 'user/listJSON'}),
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
                {name: 'email', type: 'string', mapping: 'email'},
                {name: 'company'},
                {name: 'contracts'},
                {name: 'roles'}
            ]
            ),
    baseParams:     {
        now:        (new Date()).getTime()
    }
});
