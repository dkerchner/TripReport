/*
 * Ext JS Library 2.0 Beta 1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://extjs.com/license
 */
var TripViewWindow;


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
    /*{header: "Approved", width: 115, dataIndex: 'approved', sortable: true, renderer: function(value, cell) {
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
     {header: "Approved By", width: 115, dataIndex: 'approvedBy', sortable: true},   */
    {header: "Contracts", width: 115, dataIndex: 'contracts', sortable: true},
    {header: "Attendees", width: 115, dataIndex: 'attendees', sortable: true}
]);

tripcm.defaultSortable = true;

// create the grid
var tripGrid = new Ext.grid.GridPanel({
    title: 'Trips',
    id: 'trip-grid',
    ds: tripListDS,
    cm: tripcm,
    //renderTo: 'center-div',
    //width:700,
    //height:350,
    enableColLock:false,
    //clicksToEdit:1,
    selModel: new Ext.grid.RowSelectionModel({singleSelect:true}),
    closable: true,
    bbar: new Ext.PagingToolbar({
        pageSize: 15,
        store: tripListDS,
        displayInfo: true
    }),
    tbar: [
        {
            text: 'View',
            tooltip: 'View a trip',
            iconCls:'search',                      // reference to our css
            handler: displayTripViewWindow
        },
        '-',
        {
            text: 'Add',
            tooltip: 'Submit a trip',
            iconCls:'add',                      // reference to our css
            handler: displayFormWindow
        },
        '-',
        {
            text: 'Edit',
            tooltip: 'Edit a trip',
            iconCls:'edit',                      // reference to our css
            handler: displayTripEditWindow
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
         store: tripListDS,
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
            id: idField.getValue(),
            shortDescription:      shortDescriptionField.getValue(),
            purpose:       purposeField.getValue(),
            startDate: startDateField.getValue().format('m/d/Y'),
            endDate:  endDateField.getValue().format('m/d/Y'),
            events: TripEditForm.getForm().findField('eventsField').getValue()
                    //TripEditForm.getForm().findField('eventsField')
        },
        success: function(response) {
            var result = eval(response.responseText);
            switch (result) {
                case 1:
                    tripListDS.commitChanges();
                    tripListDS.reload();
                    TripEditWindow.hide();
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
                        tripListDS.reload();
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

// display or bring forth the form
function displayTripViewWindow() {
    if (tripGrid.selModel.getCount()) {
        if (!TripViewWindow.isVisible()) {
            resetTripForm();
            TripViewWindow.show();
        } else {
            TripViewWindow.toFront();
        }
    }
}

// display or bring forth the form
function displayTripEditWindow() {
    if (tripGrid.selModel.getCount()) {

        var selections = tripGrid.selModel.getSelections();
        tripDS.on('load', tripDSEditOnLoad);
        tripDS.load({params: {'id': selections[0].json.id}});

        if (!TripEditWindow.isVisible()) {
            resetTripForm();
            TripEditWindow.show();
        } else {
            TripEditWindow.toFront();
        }
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
function confirmAttendTrips() {
    if (tripGrid.selModel.getCount() == 1) // only one president is selected here
    {
        Ext.MessageBox.confirm('Confirmation', 'You are about to request your attendance on a trip. Continue?', attendTrips);
    } else if (tripGrid.selModel.getCount() > 1) {
        Ext.MessageBox.confirm('Confirmation', 'Attend those trips?', attendTrips);
    } else {
        Ext.MessageBox.alert('Uh oh...', 'You can\'t really attend something you haven\'t selected huh?');
    }
}

// This was added in Tutorial 6
function deleteTrips(btn) {
    if (btn == 'yes') {
        var selections = tripGrid.selModel.getSelections();
        Ext.Ajax.request({
            waitMsg: 'Please Wait',
            url: 'http://localhost:8080/TripReportSPT/trip/deleteJSON',
            params: {
                id:  selections[0].json.id
            },
            success:
            function(response) {
                var result = eval(response.responseText);
                switch (result) {
                    case 1:  // Success : simply reload
                        tripListDS.reload();
                        break;
                    default:
                        Ext.MessageBox.alert('Fail', 'This trip cannot be deleted.');
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

// This was added in Tutorial 6
function attendTrips(btn) {
    if (btn == 'yes') {
        var selections = tripGrid.selModel.getSelections();
        Ext.Ajax.request({
            waitMsg: 'Please Wait',
            url: 'http://localhost:8080/TripReportSPT/trip/attendJSON',
            params: {
                id:selections[0].json.id
            },
            success:
            function(response) {
                var result = eval(response.responseText);
                switch (result) {
                    case 1:  // Success : simply reload
                        Ext.MessageBox.alert('Success', 'You have successfully requested approval to attend this trip!');
                        tripListDS.reload();
                        break;
                    default:
                        Ext.MessageBox.alert('Fail', 'You have already requested to attend this trip.');
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

function onTripListingEditorGridDoubleClick(grid, rowIndex, e) {
    e.stopEvent();
    var coords = e.getXY();
    //alert(grid.store.getAt(rowIndex).json.id);
    tripDS.on('load', tripDSOnLoad);
    tripDS.load({params: {'id': grid.store.getAt(rowIndex).json.id}});
    displayTripViewWindow();
}

function tripDSOnLoad() {
    shortDescriptionDisplayField.setValue(tripDS.getAt(0).data.name);
    purposeDisplayField.setValue(tripDS.getAt(0).data.purpose);
    startDateDisplayField.setValue(tripDS.getAt(0).data.startDate.format('m/d/Y'));
    endDateDisplayField.setValue(tripDS.getAt(0).data.endDate.format('m/d/Y'));
    var events = tripDS.getAt(0).data.events;
    var contracts = tripDS.getAt(0).data.contracts;
    var locations = tripDS.getAt(0).data.locations;
    eventsDisplayField.setValue(buildStringFromArray(events, "name"));
    contractsDisplayField.setValue(buildStringFromArray(contracts, "name"));
    locationsDisplayField.setValue(buildStringFromArray(locations, "name"));

}

function tripDSEditOnLoad() {
    shortDescriptionField.setValue(tripDS.getAt(0).data.name);
    purposeField.setValue(tripDS.getAt(0).data.purpose);
    startDateField.setValue(tripDS.getAt(0).data.startDate.format('m/d/Y'));
    endDateField.setValue(tripDS.getAt(0).data.endDate.format('m/d/Y'));
    idField.setValue(tripDS.getAt(0).data.id);
    var events = tripDS.getAt(0).data.events;
    var contracts = tripDS.getAt(0).data.contracts;
    var locations = tripDS.getAt(0).data.locations;
    TripEditForm.getForm().findField('eventsField').setValue(buildStringFromArray(events, "id"));
    TripEditForm.getForm().findField('contractsField').setValue(buildStringFromArray(contracts, "id"));
    TripEditForm.getForm().findField('locationsField').setValue(buildStringFromArray(locations, "id"));
}


function modifyTripContextMenu() {
    displayTripEditWindow();
}

function deleteTripContextMenu() {
    confirmDeleteTrips();
}

tripGrid.addListener('rowcontextmenu', onTripListingEditorGridContextMenu);
tripGrid.addListener('rowdblclick', onTripListingEditorGridDoubleClick);


TripListingContextMenu = new Ext.menu.Menu({
    id: 'TripListingEditorGridContextMenu',
    items: [
        { text: 'Modify this Trip', handler: modifyTripContextMenu },
        { text: 'Attend this Trip', handler: confirmAttendTrips },
        { text: 'Delete this Trip', handler: deleteTripContextMenu }
    ]
});

tripListDS.load({params: {start: 0, limit: 15}});
tripGrid.on('afteredit', saveTheTrip);

TripViewForm = new Ext.FormPanel({
    labelAlign: 'top',
    bodyStyle:'padding:5px',
    width: 600,
    store: tripDS,
    items: [
        {
            layout:'column',
            border:false,
            items:[
                {
                    columnWidth:0.5,
                    layout: 'form',
                    border:false,
                    items: [shortDescriptionDisplayField, purposeDisplayField, eventsDisplayField, locationsDisplayField]
                },
                {
                    columnWidth:0.5,
                    layout: 'form',
                    border:false,
                    items: [startDateDisplayField, endDateDisplayField, contractsDisplayField]
                }
            ]
        }
    ],
    buttons: [
        /*{
         text: 'Save and Close',
         handler: createTheTrip
         },*/
        {
            text: 'Close',
            handler: function() {
                // because of the global vars, we can only instantiate one window... so let's just hide it.
                TripViewWindow.hide();
            }
        }
    ]
});

TripViewWindow = new Ext.Window({
    id: 'TripViewWindow',
    title: 'Trip Details',
    closable:true,
    width: 610,
    height: 450,
    plain:false,
    layout: 'fit',
    items: TripViewForm
});

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
                    items: [shortDescriptionField, purposeField, eventsField, locationsField]
                },
                {
                    columnWidth:0.5,
                    layout: 'form',
                    border:false,
                    items: [startDateField, endDateField, contractsField]
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
    height: 450,
    plain:false,
    layout: 'fit',
    items: TripCreateForm
});

TripEditForm = new Ext.FormPanel({
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
                    items: [shortDescriptionField, purposeField, eventsField, locationsField]
                },
                {
                    columnWidth:0.5,
                    layout: 'form',
                    border:false,
                    items: [startDateField, endDateField, contractsField, idField]
                }
            ]
        }
    ],
    buttons: [
        {
            text: 'Save and Close',
            handler: saveTheTrip
        },
        {
            text: 'Cancel',
            handler: function() {
                // because of the global vars, we can only instantiate one window... so let's just hide it.
                TripEditWindow.hide();
            }
        }
    ]
});

TripEditWindow = new Ext.Window({
    id: 'TripEditWindow',
    title: 'Edit a Trip',
    closable:true,
    width: 610,
    height: 450,
    plain:false,
    layout: 'fit',
    items: TripEditForm
});

function buildStringFromArray(array, column) {
    arrayString = "";
    for(var arr = array, len = arr.length, i = 0; i < len; i++){
        switch (column) {
            case "id":
                arrayString += array[i]['id'] + ",";
                break;
            default:
                arrayString += array[i][column] + "<br/>";
                break;
        }

    }
    return arrayString;
}