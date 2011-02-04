/*
 * Ext JS Library 2.0 Beta 1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://extjs.com/license
 */
var tripMode;

/* All components related to the management of User information. */

//The column model for the DataGrid
var tripcm = new Ext.grid.ColumnModel([
    {header: 'version', readOnly: true, dataIndex: 'version', width: 40, renderer: function(value, cell) {
        cell.css = "readonlycell";
        return value;
    }, hidden: true},
    {header: '#', readOnly: true, dataIndex: 'id', width: 40, renderer: function(value, cell) {
        cell.css = "readonlycell";
        return value;
    }, hidden: true},
    {header: "Name", width: 100, dataIndex: 'name', sortable: true,
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
    {header: "Estimated Cost", width: 100, dataIndex: 'estimatedCost', renderer: Ext.util.Format.usMoney(), sortable: true},
    {header: "Contracts", width: 115, dataIndex: 'contracts', sortable: true, renderer: function(value, cell) {
        return buildStringFromArray(value, 'name', ', ');
    }},
    {header: "Attendees", width: 115, dataIndex: 'attendees', sortable: true, renderer: function(value, cell) {
        return buildStringFromArray(value, 'name', ', ');
    }}
]);
tripcm.defaultSortable = true;

//The data grid
var tripGrid = new Ext.grid.GridPanel({
    //title: 'Trips',
    id: 'trip-grid',
    ds: tripListDS,
    cm: tripcm,
    //renderTo: 'center-div',
    //width:700,
    //height:350,
    enableColLock:false,
    //clicksToEdit:1,
    selModel: new Ext.grid.RowSelectionModel({singleSelect:true}),
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
            text: 'Submit',
            tooltip: 'Submit a trip',
            iconCls:'add',                      // reference to our css
            handler: displayTripCreateWindow
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
        } , {
            xtype: 'combo',
            id: 'eventFilter',
            anchor : '95%',
            store: eventListDS,
            fieldLabel: 'Event',
            displayField:'name',
            valueField: 'id',
            hiddenName: 'event',
            allowBlank: false,
            pageSize: 5,
            minChars: 2,
            submitValue: false,
            tripMode: 'remote',
            triggerAction: 'all',
            emptyText: 'Select an event...',
            selectOnFocus: false, 
            listeners: {
                select: function(combo, record, index){
                	
                	filterTripsByEvent(this.getValue()); 
                }
                
            }
        }
    ]
});

//Display the creation form
function displayTripCreateWindow() {
    tripMode = "Create";
    if (!TripEditWindow.isVisible()) {
        TripEditWindow.show();
        resetForm(TripEditForm.getForm());
    } else {
        TripEditWindow.toFront();
    }
}

//Display the view form
function displayTripViewWindow() {
    if (tripGrid.selModel.getCount()) {
        var selections = tripGrid.selModel.getSelections();
        tripDS.on('load', tripDSOnLoad);
        tripDS.load({params: {'id': selections[0].json.id}});
        if (!TripViewWindow.isVisible()) {
            TripViewWindow.show();
        } else {
            TripViewWindow.toFront();
        }
    }
}

//Display the edit form
function displayTripEditWindow() {
    if (tripGrid.selModel.getCount()) {
        tripMode = "Edit";
        var selections = tripGrid.selModel.getSelections();
        tripDS.on('load', tripDSEditOnLoad);
        tripDS.load({params: {'id': selections[0].json.id}});

        if (!TripEditWindow.isVisible()) {
            TripEditWindow.show();
        } else {
            TripEditWindow.toFront();
        }

    }
}

//Confirm deletion, then call delete
function confirmDeleteTrips() {
    if (tripGrid.selModel.getCount() == 1)
    {
        Ext.MessageBox.confirm('Confirmation', 'You are about to delete a trip. Continue?', deleteTrips);
    } else if (tripGrid.selModel.getCount() > 1) {
        Ext.MessageBox.confirm('Confirmation', 'Delete those trips?', deleteTrips);
    } else {
        Ext.MessageBox.alert('Uh oh...', 'You can\'t really delete something you haven\'t selected huh?');
    }
}

//Confirm attend, then call attend
function confirmAttendTrips() {
    if (tripGrid.selModel.getCount() == 1)
    {
        Ext.MessageBox.confirm('Confirmation', 'You are about to request your attendance on a trip. Continue?', attendTrips);
    } else if (tripGrid.selModel.getCount() > 1) {
        Ext.MessageBox.confirm('Confirmation', 'Attend those trips?', attendTrips);
    } else {
        Ext.MessageBox.alert('Uh oh...', 'You can\'t really attend something you haven\'t selected huh?');
    }
}

//Creates an Ajax request to delete the trip
function deleteTrips(btn) {
    if (btn == 'yes') {
        var selections = tripGrid.selModel.getSelections();
        Ext.Ajax.request({
            waitMsg: 'Please Wait',
            url: 'trip/deleteJSON',
            params: {
                id:  selections[0].json.id
            },
            success: function ( result, request ) {
                var jsonData = Ext.util.JSON.decode(result.responseText);
                var resultMessage = jsonData.data;                
                switch (jsonData.success) {
                case true:
                	tripListDS.commitChanges();
                	tripListDS.reload();
                    Ext.MessageBox.alert('Success', 'Successfully deleted ' + resultMessage.name);
                    break;
                default:
                    Ext.MessageBox.alert('Error', buildStringFromArray(resultMessage.errors, "message", ","));
                	break;
                }
            },
            failure: function(result, request) {
                var result = response.responseText;
                Ext.MessageBox.alert('error', 'could not connect to the database. retry later');
            }        
        });
    }
}

//Creates an Ajax request to attend the trip for the user
function attendTrips(btn) {
    if (btn == 'yes') {
        var selections = tripGrid.selModel.getSelections();
        Ext.Ajax.request({
            waitMsg: 'Please Wait',
            url: 'userTrip/attendJSON',
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

//Called by the context menu right click event
function onTripListingEditorGridContextMenu(grid, rowIndex, e) {
    e.stopEvent();
    var coords = e.getXY();
    TripListingContextMenu.rowRecord = grid.store.getAt(rowIndex);
    grid.selModel.selectRow(rowIndex);
    TripListingSelectedRow = rowIndex;
    TripListingContextMenu.showAt([coords[0], coords[1]]);
}

//Called by the DataGrid double click event
function onTripListingEditorGridDoubleClick(grid, rowIndex, e) {
    e.stopEvent();
    var coords = e.getXY();
    //alert(grid.store.getAt(rowIndex).json.id);
    displayTripViewWindow();
}

//Called when the tripDS is loaded for the view form
function tripDSOnLoad() {
    var form = TripViewForm.getForm();
    form.setValues(tripDS.getAt(0).data);
    form.findField('eventsDisplayField').setValue(buildStringFromArray(tripDS.getAt(0).data.events, "name", "<br/>"));
    form.findField('contractsDisplayFieldTrip').setValue(buildStringFromArray(tripDS.getAt(0).data.contracts, "name", "<br/>"));
    form.findField('locationsDisplayField').setValue(buildStringFromArray(tripDS.getAt(0).data.locations, "name", "<br/>"));

}

//Called when the tripDS is loaded for the edit form
function tripDSEditOnLoad() {
    var form = TripEditForm.getForm();
    form.setValues(tripDS.getAt(0).data);
    if (tripMode != "Create") {
        form.findField('eventsField').setValue(buildStringFromArray(tripDS.getAt(0).data.events, "id", ','));
        form.findField('contractsFieldTrip').setValue(buildStringFromArray(tripDS.getAt(0).data.contracts, "id", ','));
        form.findField('locationsField').setValue(buildStringFromArray(tripDS.getAt(0).data.locations, "id", ','));
    }
}

//This saves the trip using an Ajax request
function saveTheTrip() {
  var form = TripEditForm.getForm();
  var params = form.getValues();
  params['task'] = tripMode.toString();
  if (isTripFormValid(form)) {
      Ext.Ajax.request({
          waitMsg: 'Please wait...',
          url: 'trip/saveJSON',
          params: params,
          success: function ( result, request ) {
              var jsonData = Ext.util.JSON.decode(result.responseText);
              var resultMessage = jsonData.data;                
              switch (jsonData.success) {
              case true:
                  tripListDS.commitChanges();
                  tripListDS.reload();
                  TripEditWindow.hide();
                  Ext.MessageBox.alert('Success', 'Successfully saved ' + resultMessage.name);
                  break;
              default:
                  Ext.MessageBox.alert('Error', buildStringFromArray(resultMessage.errors, "message", ","));
              	break;
              }
          },
          failure: function(result, request) {
              var jsonData = Ext.util.JSON.decode(result.responseText);
              Ext.MessageBox.alert('error', 'could not connect to the database. retry later');
          }
      });
  } else {
      Ext.MessageBox.alert('Warning', 'Your Form is not valid!');
  }

}

// Check if the form is valid
function isTripFormValid(form) {
    return(formIsValid(form));
}

// Filters the data in the data grid by a specific Event
function filterTripsByEvent(eventId) {
	console.log(eventId);
	tripListDS.reload({params: {events: eventId}});
}

//The function called by the modify context menu
function modifyTripContextMenu() {
    displayTripEditWindow();
}

//The function called by the delete context menu
function deleteTripContextMenu() {
    confirmDeleteTrips();
}

//DataGrid event listeners
tripGrid.addListener('rowcontextmenu', onTripListingEditorGridContextMenu);
tripGrid.addListener('rowdblclick', onTripListingEditorGridDoubleClick);

//The context menu construct
TripListingContextMenu = new Ext.menu.Menu({
    id: 'TripListingEditorGridContextMenu',
    items: [
        { text: 'Modify this Trip', handler: modifyTripContextMenu },
        { text: 'Attend this Trip', handler: confirmAttendTrips },
        { text: 'Delete this Trip', handler: deleteTripContextMenu }
    ]
});

//Initial load of tripListDS *Important*
tripListDS.load({params: {start: 0, limit: 15}});
//tripGrid.on('afteredit', saveTheTrip);

//The Trip view form construct
var TripViewForm = new Ext.FormPanel({
    labelAlign: 'top',
    bodyStyle:'padding:5px',
    width: 600,
    //store: tripDS,
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
                    items: [startDateDisplayField, endDateDisplayField, Ext.applyIf({id:'contractsDisplayFieldTrip'}, contractsDisplayField), idField]
                }
            ]
        }
    ],
    buttons: [
        /*{
             id: 'approveButton',
             text: 'Approve',
             handler: confirmApproveTrips,
             class: 'approved',
             iconCls: 'approve'
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

//The window in which to display the Trip view form
var TripViewWindow = new Ext.Window({
    id: 'TripViewWindow',
    title: 'Trip Details',
    closable:true,
    width: 610,
    height: 400,
    plain:false,
    layout: 'fit',
    items: TripViewForm
});

//The User edit form construct
var TripEditForm = new Ext.FormPanel({
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
                    items: [startDateField, endDateField, Ext.applyIf({id:'contractsFieldTrip'}, contractsField), Ext.applyIf({id:'idFieldContract'}, idField)]
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

//The window in which to display the User edit form
var TripEditWindow = new Ext.Window({
    id: 'TripEditWindow',
    title: 'Edit a Trip',
    closable:false,
    width: 610,
    height: 515,
    plain:false,
    layout: 'fit',
    items: TripEditForm
});
