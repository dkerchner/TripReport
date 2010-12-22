/*
 * Ext JS Library 2.0 Beta 1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://extjs.com/license
 */




var tripcm = new Ext.grid.ColumnModel([
    {header: 'version', readOnly: true, dataIndex: 'version', width: 40, renderer: function(value, cell) {
        cell.css = "readonlycell";
        return value;
    }, hidden: true},
    {header: '#', readOnly: true, dataIndex: 'id', width: 40, renderer: function(value, cell) {
        cell.css = "readonlycell";
        return value;
    }, hidden: false},
    {header: "Name", width: 100, dataIndex: 'name', sortable: true,
        editor: new Ext.form.TextField({
            allowBlank: false,
            maxLength: 100,
            maskRe: /([a-zA-Z0-9\s]+)$/
        })},
    {header: "Events", width: 115, dataIndex: 'events', sortable: true},
    {header: "Locations", width: 115, dataIndex: 'locations', sortable: true},
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
    {header: "Contracts", width: 115, dataIndex: 'contracts', sortable: true},
    {header: "Attendees", width: 115, dataIndex: 'attendees', sortable: true}
]);
tripcm.defaultSortable = true;

// create the grid
var tripGrid = new Ext.grid.EditorGridPanel({
    title: 'Trips',
    id: 'trip-grid',
    ds: tripds,
    cm: tripcm,
    //renderTo: 'center-div',
    //width:700,
    //height:350,
    enableColLock:false,
    clicksToEdit:1,
    selModel: new Ext.grid.RowSelectionModel({singleSelect:true}),
    bbar: new Ext.PagingToolbar({
        pageSize: 15,
        store: tripds,
        displayInfo: true
    }),
    tbar: [
        {
            text: 'Add',
            tooltip: 'Submit a trip',
            iconCls:'add',                      // reference to our css
            handler: displayFormWindow
        },
        '-',
        {
            text: 'Delete',
            tooltip: 'Delete the selected trip.',
            handler: confirmDeleteTrips,   // Confirm before deleting
            iconCls:'remove'
        }/*,
        '-',
        { // Added in Tutorial 8
            text: 'Search',
            tooltip: 'Advanced Search',
            handler: startAdvancedSearch,
            iconCls:'search'
        },
        '-',
        new Ext.app.SearchField({
            store: tripds,
            params: {start: 0, limit: 15},
            width: 120
        }) */
    ]
});


// This saves the president after a cell has been edited
function saveTheTrip(oGrid_event) {
    Ext.Ajax.request({
        waitMsg: 'Please wait...',
        url: 'http://localhost:8080/TripReportSPT/trip/updateJSON',
        params: {
            //version: oGrid_event.record.data.version,
            id: oGrid_event.record.data.id,
            shortDescription: oGrid_event.record.data.shortDescription,
            purpose: oGrid_event.record.data.purpose,
            startDate: oGrid_event.record.data.startDate.format('Y/m/d'),
            endDate: oGrid_event.record.data.endDate.format('Y/m/d')
        },
        success: function(response) {
            var result = eval(response.responseText);
            switch (result) {
                case 1:
                    tripds.commitChanges();
                    tripds.reload();
                    break;
                default:
                    Ext.MessageBox.alert('Error', response.responseText);
                    break;
            }
        },
        failure: function(response) {
            var result = response.responseText;
            Ext.MessageBox.alert('error', 'could not connect to the database. retry later');
        }
    });
}

// this creates a new president
function createTheTrip() {
    if (isTripFormValid()) {
        Ext.Ajax.request({
            waitMsg: 'Please wait...',
            url: 'http://localhost:8080/TripReportSPT/trip/saveJSON',
            params: {
                task: "CREATETRIP",
                shortDescription:      shortDescriptionField.getValue(),
                purpose:       purposeField.getValue(),
                startDate: startDateField.getValue().format('m/d/Y'),
                endDate:  endDateField.getValue().format('m/d/Y')
            },
            success: function(response) {
                var result = eval(response.responseText);
                alert(response);
                switch (result) {
                    case 1:
                        Ext.MessageBox.alert('Creation OK', 'The trip was created successfully.');
                        tripds.reload();
                        TripCreateWindow.hide();
                        break;
                    default:
                        Ext.MessageBox.alert('Warning', 'Could not create the trip.');
                        break;
                }
            },
            failure: function(response) {
                var result = response.responseText;
                Ext.MessageBox.alert('error', 'could not connect to the database. retry later');
            }
        });
    } else {
        Ext.MessageBox.alert('Warning', 'Your Form is not valid!');
    }
}

// reset the Form before opening it
function resetTripForm() {
    shortDescriptionField.setValue('');
    purposeField.setValue('');
    startDateField.setValue('');
    endDateField.setValue('');
}

// check if the form is valid
function isTripFormValid() {
    return(shortDescriptionField.isValid() && purposeField.isValid() && startDateField.isValid() && endDateField.isValid());
}

// display or bring forth the form
function displayFormWindow() {
    if (!TripCreateWindow.isVisible()) {
        resetTripForm();
        TripCreateWindow.show();
    } else {
        TripCreateWindow.toFront();
    }
}

// This was added in Tutorial 6
function confirmDeleteTrips() {
    if (tripGrid.selModel.getCount() == 1) // only one president is selected here
    {
        Ext.MessageBox.confirm('Confirmation', 'You are about to delete a trip. Continue?', deleteTrips);
    } else if (tripGrid.selModel.getCount() > 1) {
        Ext.MessageBox.confirm('Confirmation', 'Delete those trips?', deleteTrips);
    } else {
        Ext.MessageBox.alert('Uh oh...', 'You can\'t really delete something you haven\'t selected huh?');
    }
}
// This was added in Tutorial 6
function deleteTrips(btn) {
    if (btn == 'yes') {
        var selections = tripGrid.selModel.getSelections();
        var trip = [];
        for (i = 0; i < tripGrid.selModel.getCount(); i++) {
            trip.push(selections[i].id);
        }
        var encoded_array = Ext.encode(trip);
        Ext.Ajax.request({
            waitMsg: 'Please Wait',
            url: 'http://localhost:8080/TripReportSPT/trip/deleteJSON',
            params: {
                id:  selections[0].id
            },
            success: function(response) {
                var result = eval(response.responseText);
                switch (result) {
                    case 1:  // Success : simply reload
                        tripds.reload();
                        break;
                    default:
                        Ext.MessageBox.alert(response.responseText);
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

function onTripListingEditorGridContextMenu(grid, rowIndex, e) {
    e.stopEvent();
    var coords = e.getXY();
    TripListingContextMenu.rowRecord = grid.store.getAt(rowIndex);
    grid.selModel.selectRow(rowIndex);
    TripListingSelectedRow = rowIndex;
    TripListingContextMenu.showAt([coords[0], coords[1]]);
}

function modifyTripContextMenu() {
    tripGrid.startEditing(TripListingSelectedRow, 1);
}

function deleteTripContextMenu() {
    confirmDeleteTrips();
}

tripGrid.addListener('rowcontextmenu', onTripListingEditorGridContextMenu);

TripListingContextMenu = new Ext.menu.Menu({
    id: 'TripListingEditorGridContextMenu',
    items: [
        { text: 'Modify this Trip', handler: modifyTripContextMenu },
        { text: 'Delete this Trip', handler: deleteTripContextMenu }
    ]
});

tripds.load({params: {start: 0, limit: 15}});
tripGrid.on('afteredit', saveTheTrip);

TripCreateForm = new Ext.FormPanel({
    labelAlign: 'top',
    bodyStyle:'padding:5px',
    width: 600,
    items: [
        {
            layout:'column',
            border:false,
            items:[
                {
                    columnWidth:0.5,
                    layout: 'form',
                    border:false,
                    items: [shortDescriptionField, purposeField, eventField]
                },
                {
                    columnWidth:0.5,
                    layout: 'form',
                    border:false,
                    items: [startDateField, endDateField]
                }
            ]
        }
    ],
    buttons: [
        {
            text: 'Save and Close',
            handler: createTheTrip
        },
        {
            text: 'Cancel',
            handler: function() {
                // because of the global vars, we can only instantiate one window... so let's just hide it.
                TripCreateWindow.hide();
            }
        }
    ]
});

TripCreateWindow = new Ext.Window({
    id: 'TripCreateWindow',
    title: 'Submitting a New Trip',
    closable:true,
    width: 610,
    height: 250,
    plain:true,
    layout: 'fit',
    items: TripCreateForm
});

/*TripViewForm = new Ext.Panel({
    labelAlign: 'top',
    bodyStyle:'padding:5px',
    width: 600,
    items: [
        {
            layout:'column',
            border:false,
            items:[
                {
                    columnWidth:0.5,
                    layout: 'form',
                    border:false,
                    items: [shortDescriptionField, purposeField, eventField]
                },
                {
                    columnWidth:0.5,
                    layout: 'form',
                    border:false,
                    items: [startDateField, endDateField]
                }
            ]
        }
    ],
    buttons: [
        {
            text: 'Save and Close',
            handler: createTheTrip
        },
        {
            text: 'Cancel',
            handler: function() {
                // because of the global vars, we can only instantiate one window... so let's just hide it.
                TripCreateWindow.hide();
            }
        }
    ]
});

TripViewWindow = new Ext.Window({
    id: 'TripViewWindow',
    title: 'Trip',
    closable:true,
    width: 610,
    height: 250,
    plain:true,
    layout: 'fit',
    items: TripViewForm
});  */
