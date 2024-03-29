/*
 * Ext JS Library 2.0 Beta 1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://extjs.com/license
 */

/* All components related to the management of UserTrip information. 
 * This shows the users that have requested to take a trip and whether 
 * or not that trip is approved for that user. 
 */

// The column model for the DataGrid
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

//The data grid
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

//Display the creation form
function displayAttendeeViewWindow() {
    if (attendeeGrid.selModel.getCount()) {
        var selections = attendeeGrid.selModel.getSelections();
        attendeeDS.on('load', attendeeDSOnLoad);
        attendeeDS.load({params: {'tripId': selections[0].json.tripId, 'attendeeId': selections[0].json.attendeeId}});
        if (!AttendeeViewWindow.isVisible()) {
            AttendeeViewWindow.show();
        } else {
            AttendeeViewWindow.toFront();
        }
    }
}

//Display the view form
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

//Creates an Ajax request to approve the trip for the user
function approveTrips(btn) {
    if (btn == 'yes') {
        var selections = attendeeGrid.selModel.getSelections();
        Ext.Ajax.request({
            waitMsg: 'Please Wait',
            url: 'userTrip/approveJSON',
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

//Called by the context menu right click event
function onAttendeeListingEditorGridContextMenu(grid, rowIndex, e) {
    e.stopEvent();
    var coords = e.getXY();
    AttendeeListingContextMenu.rowRecord = grid.store.getAt(rowIndex);
    grid.selModel.selectRow(rowIndex);
    AttendeeListingRow = rowIndex;
    AttendeeListingContextMenu.showAt([coords[0], coords[1]]);
}

//Called by the DataGrid double click event
function onAttendeeListingEditorGridDoubleClick(grid, rowIndex, e) {
    e.stopEvent();
    var coords = e.getXY();
    //alert(grid.store.getAt(rowIndex).json.id);
    displayAttendeeViewWindow();
}

//DataGrid event listeners
attendeeGrid.addListener('rowcontextmenu', onAttendeeListingEditorGridContextMenu);
attendeeGrid.addListener('rowdblclick', onAttendeeListingEditorGridDoubleClick);

//The context menu construct
AttendeeListingContextMenu = new Ext.menu.Menu({
    id: 'AttendeeListingEditorGridContextMenu',
    items: [
        { text: 'Approve this Trip', handler: confirmApproveTrips }
    ]
});

//Initial load of attendeeListDS *Important*
attendeeListDS.load({params: {start: 0, limit: 15}});
//attendeeGrid.on('afteredit', saveTheTrip);

//Called when the attendeeDS is loaded for the view form
function attendeeDSOnLoad() {
    var form = AttendeeViewForm.getForm();
    form.setValues(attendeeDS.getAt(0).data);
    form.findField('eventsDisplayFieldAttendee').setValue(buildStringFromArray(attendeeDS.getAt(0).data.events, "name", "<br/>"));
    form.findField('contractsDisplayFieldAttendee').setValue(buildStringFromArray(attendeeDS.getAt(0).data.contracts, "name", "<br/>"));
    form.findField('locationsDisplayFieldAttendee').setValue(buildStringFromArray(attendeeDS.getAt(0).data.locations, "name", "<br/>"));
    // Only allow approving if the user is a manager. Utilizes a global flag set the gsp tags. 
    if (admin_user){form.findField('approveButton').disabled = false; }
}

//The Attendee view form construct
var AttendeeViewForm = new Ext.FormPanel({
    labelAlign: 'top',
    bodyStyle:'padding:5px',
    width: 600,
    store: attendeeDS,
    items: [
        {
            layout:'column',
            border:false,
            items:[
                {
                    columnWidth:0.5,
                    layout: 'form',
                    border:false,
                    items: [Ext.applyIf({id:'attendeeDisplayFieldAttendee'}, attendeeDisplayField), Ext.applyIf({id:'shortDescriptionDisplayFieldAttendee'}, shortDescriptionDisplayField), Ext.applyIf({id:'purposeDisplayFieldAttendee'}, purposeDisplayField), Ext.applyIf({id:'eventsDisplayFieldAttendee'}, eventsDisplayField), Ext.applyIf({id:'locationsDisplayFieldAttendee'}, locationsDisplayField)]
                },
                {
                    columnWidth:0.5,
                    layout: 'form',
                    border:false,
                    items: [Ext.applyIf({id:'startDateDisplayFieldAttendee'}, startDateDisplayField), Ext.applyIf({id:'endDateDisplayFieldAttendee'}, endDateDisplayField), Ext.applyIf({id:'contractsDisplayFieldAttendee'}, contractsDisplayField), Ext.applyIf({id:'idFieldAttendee', name:'tripId'}, idField), Ext.applyIf({id:'idField2Attendee', name: 'attendeeId'}, idField2)]
                }
            ]
        }
    ],
    buttons: [
        {
             id: 'approveButton',
             text: 'Approve',
             handler: confirmApproveTrips,
             iconCls: 'approve',
             disabled: true
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

//The window in which to display the Attendee edit form
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
