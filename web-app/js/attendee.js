/*
 * Ext JS Library 2.0 Beta 1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://extjs.com/license
 */




var attendeecm = new Ext.grid.ColumnModel([
    {header: 'version', readOnly: true, dataIndex: 'version', width: 40, renderer: function(value, cell) {
        cell.css = "readonlycell";
        return value;
    }, hidden: true},
    {header: '#', readOnly: true, dataIndex: 'tripId', width: 40, renderer: function(value, cell) {
        cell.css = "readonlycell";
        return value;
    }, hidden: true},
    {header: '#', readOnly: true, dataIndex: 'attendeeId', width: 40, renderer: function(value, cell) {
        cell.css = "readonlycell";
        return value;
    }, hidden: true},
    {header: "Name", width: 100, dataIndex: 'attendee', sortable: true,
        editor: new Ext.form.TextField({
            allowBlank: false,
            maxLength: 100,
            maskRe: /([a-zA-Z0-9\s]+)$/
        })},
    {header: "Trip", width: 100, dataIndex: 'name', sortable: true,
        editor: new Ext.form.TextField({
            allowBlank: false,
            maxLength: 100,
            maskRe: /([a-zA-Z0-9\s]+)$/
        })},
    {header: "Events", width: 115, dataIndex: 'events', sortable: true, renderer: function(value, cell) {
        return buildStringFromArray(value, 'name', ', ');
    }},
    {header: "Locations", width: 115, dataIndex: 'locations', sortable: true, renderer: function(value, cell) {
        return buildStringFromArray(value, 'name', ', ');
    }},
    {header: "Start Date", width: 115, dataIndex: 'startDate', renderer: Ext.util.Format.dateRenderer('m/d/Y'), sortable: true,
        editor: new Ext.form.DateField({
            format: 'm/d/Y'
        })},
    {header: "End Date", width: 115, dataIndex: 'endDate', renderer: Ext.util.Format.dateRenderer('m/d/Y'), sortable: true,
        editor: new Ext.form.DateField({
            format: 'm/d/Y'
        })},
    {header: "Purpose", width: 255, dataIndex: 'purpose', sortable: true,
        editor: new Ext.form.TextField({
            allowBlank: false,
            maxLength: 100,
            maskRe: /([a-zA-Z0-9\s]+)$/
        })},
    {header: "Approved", width: 115, dataIndex: 'approved', sortable: true, renderer: function(value, cell) {
            if (value) {
                cell.css = "approved";
                value = 'Yes'
            } else {
                cell.css = "unapproved";
                value = 'No'
            }
            return value;
        }, editor: new Ext.form.Checkbox({
        })},
    {header: "Approved By", width: 115, dataIndex: 'approvedBy', sortable: true},
    {header: "Contracts", width: 115, dataIndex: 'contracts', sortable: true, renderer: function(value, cell) {
        return buildStringFromArray(value, 'name', ', ');
    }}
]);

attendeecm.defaultSortable = true;

// create the grid
var attendeeGrid = new Ext.grid.GridPanel({
    title: 'Attendees',
    id: 'attendee-grid',
    ds: attendeeListDS,
    cm: attendeecm,
    //renderTo: 'center-div',
    //width:700,
    //height:350,
    //enableColLock:false,
    //clicksToEdit:1,
    selModel: new Ext.grid.RowSelectionModel({singleSelect:true}),
    bbar: new Ext.PagingToolbar({
        pageSize: 15,
        store: attendeeListDS,
        displayInfo: true
    }),
    tbar: [
    ]
});

// display or bring forth the form
function displayAttendeeViewWindow() {
    if (attendeeGrid.selModel.getCount()) {
        if (!AttendeeViewWindow.isVisible()) {
            AttendeeViewWindow.show();
        } else {
            AttendeeViewWindow.toFront();
        }
    }
}

// This was added in Tutorial 6
function confirmApproveTrips() {
    if (attendeeGrid.selModel.getCount() == 1) // only one president is selected here
    {
        Ext.MessageBox.confirm('Confirmation', 'You are about to approve this person\'s trip. Continue?', approveTrips);
    } else if (tripGrid.selModel.getCount() > 1) {
        Ext.MessageBox.confirm('Confirmation', 'Approve those trips?', approveTrips);
    } else {
        Ext.MessageBox.alert('Uh oh...', 'You can\'t really approve something you haven\'t selected huh?');
    }
}

// This was added in Tutorial 6
function approveTrips(btn) {
    if (btn == 'yes') {
        var selections = attendeeGrid.selModel.getSelections();
        Ext.Ajax.request({
            waitMsg: 'Please Wait',
            url: 'http://localhost:8080/TripReportSPT/userTrip/approveJSON',
            params: {
                tripId:selections[0].json.tripId,
                attendeeId:selections[0].json.attendeeId
            },
            success:
            function(response) {
                var result = eval(response.responseText);
                switch (result) {
                    case 1:  // Success : simply reload
                        Ext.MessageBox.alert('Success','You have successfully approved this person\'s trip!');
                        attendeeDS.reload();
                        break;
                    default:
                        Ext.MessageBox.alert('Fail','You have already approved this person\'s trip.');
                        break;
                }
            },
            failure: function(response) {
                var result = response.responseText;
                Ext.MessageBox.alert('error', 'could not connect to the database. retry later');
            }
        });
    }
}

function onAttendeeListingEditorGridContextMenu(grid, rowIndex, e) {
    e.stopEvent();
    var coords = e.getXY();
    AttendeeListingContextMenu.rowRecord = grid.store.getAt(rowIndex);
    grid.selModel.selectRow(rowIndex);
    AttendeeListingRow = rowIndex;
    AttendeeListingContextMenu.showAt([coords[0], coords[1]]);
}

function onAttendeeListingEditorGridDoubleClick(grid, rowIndex, e) {
    e.stopEvent();
    var coords = e.getXY();
    //alert(grid.store.getAt(rowIndex).json.id);
    attendeeDS.on('load', attendeeDSOnLoad);
    attendeeDS.load({params: {'tripId': grid.store.getAt(rowIndex).json.tripId, 'attendeeId': grid.store.getAt(rowIndex).json.attendeeId}});
    displayAttendeeViewWindow();
}


attendeeGrid.addListener('rowcontextmenu', onAttendeeListingEditorGridContextMenu);
attendeeGrid.addListener('rowdblclick', onAttendeeListingEditorGridDoubleClick);


AttendeeListingContextMenu = new Ext.menu.Menu({
    id: 'AttendeeListingEditorGridContextMenu',
    items: [
        { text: 'Approve this Trip', handler: confirmApproveTrips }
    ]
});

attendeeListDS.load({params: {start: 0, limit: 15}});
//attendeeGrid.on('afteredit', saveTheTrip);

function attendeeDSOnLoad() {
    var form = AttendeeViewForm.getForm();
    form.findField('shortDescriptionDisplayField').setValue(attendeeDS.getAt(0).data.name);
    form.findField('purposeDisplayField').setValue(attendeeDS.getAt(0).data.purpose);
    form.findField('startDateDisplayField').setValue(attendeeDS.getAt(0).data.startDate.format('m/d/Y'));
    form.findField('endDateDisplayField').setValue(attendeeDS.getAt(0).data.endDate.format('m/d/Y'));
    form.findField('attendeeDisplayField').setValue(attendeeDS.getAt(0).data.attendee);
    form.findField('idField').setValue(attendeeDS.getAt(0).data.tripId);
    form.findField('idField2').setValue(attendeeDS.getAt(0).data.attendeeId);
    var events = attendeeDS.getAt(0).data.events;
    var contracts = attendeeDS.getAt(0).data.contracts;
    var locations = attendeeDS.getAt(0).data.locations;
    form.findField('eventsDisplayField').setValue(buildStringFromArray(events, "name", "<br/>"));
    form.findField('contractsDisplayField').setValue(buildStringFromArray(contracts, "name", "<br/>"));
    form.findField('locationsDisplayField').setValue(buildStringFromArray(locations, "name", "<br/>"));

}


var AttendeeViewForm = new Ext.FormPanel({
    labelAlign: 'top',
    bodyStyle:'padding:5px',
    width: 600,
    //store: attendeeDS,
    items: [
        {
            layout:'column',
            border:false,
            items:[
                {
                    columnWidth:0.5,
                    layout: 'form',
                    border:false,
                    items: [attendeeDisplayField, shortDescriptionDisplayField, purposeDisplayField, eventsDisplayField, locationsDisplayField]
                },
                {
                    columnWidth:0.5,
                    layout: 'form',
                    border:false,
                    items: [startDateDisplayField, endDateDisplayField, contractsDisplayField, idField, idField2]
                }
            ]
        }
    ],
    buttons: [
        {
             id: 'approveButton',
             text: 'Approve',
             handler: confirmApproveTrips,
             iconCls: 'approve'
         },
        {
            text: 'Close',
            handler: function() {
                // because of the global vars, we can only instantiate one window... so let's just hide it.
                AttendeeViewWindow.hide();
            }
        }
    ]
});

var AttendeeViewWindow = new Ext.Window({
    id: 'AttendeeViewWindow',
    title: 'Trip Details',
    closable:true,
    width: 610,
    height: 450,
    plain:false,
    layout: 'fit',
    items: AttendeeViewForm
});
