/*
 * Ext JS Library 2.0 Beta 1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://extjs.com/license
 */
var eventMode;


var eventcm = new Ext.grid.ColumnModel([
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
    {header: "Description", width: 255, dataIndex: 'description', sortable: true},
    {header: "Location", width: 100, dataIndex: 'location', sortable: true, renderer: function(value, cell) {
        return getValueFromObject(value, 'name');
    }},
    {header: "Start Date", width: 115, dataIndex: 'startDate', renderer: Ext.util.Format.dateRenderer('m/d/Y'), sortable: true,
        editor: new Ext.form.DateField({
            format: 'm/d/Y'
        })},
    {header: "End Date", width: 115, dataIndex: 'endDate', renderer: Ext.util.Format.dateRenderer('m/d/Y'), sortable: true,
        editor: new Ext.form.DateField({
            format: 'm/d/Y'
        })},
    {header: "Trips", width: 115, dataIndex: 'trips', sortable: true, renderer: function(value, cell) {
        return buildStringFromArray(value, 'name', ', ');
    }}
]);

eventcm.defaultSortable = true;

var eventListView = new Ext.list.ListView({
    store: eventListDS,
    multiSelect: false,
    emptyText: 'No events to display',
    reserveScrollOffset: true,
    columns: [{
        header: 'Event',
        width: .5,
        dataIndex: 'name'
    },{
        header: 'Start Date',
        xtype: 'datecolumn',
        format: 'm/d/Y',
        width: .35, 
        dataIndex: 'startDate'
    }]
});

// create the grid
var eventGrid = new Ext.grid.GridPanel({
    //title: 'Events',
    id: 'event-grid',
    ds: eventListDS,
    cm: eventcm,
    //renderTo: 'center-div',
    //width:700,
    //height:350,
    enableColLock:false,
    //clicksToEdit:1,
    selModel: new Ext.grid.RowSelectionModel({singleSelect:true}),
    bbar: new Ext.PagingToolbar({
        pageSize: 15,
        store: eventListDS,
        displayInfo: true
    }),
    tbar: [
        {
            text: 'View',
            tooltip: 'View a event',
            iconCls:'search',                      // reference to our css
            handler: displayEventViewWindow
        },
        '-',
        {
            text: 'Submit',
            tooltip: 'Submit a event',
            iconCls:'add',                      // reference to our css
            handler: displayEventCreateWindow
        },
        '-',
        {
            text: 'Edit',
            tooltip: 'Edit a event',
            iconCls:'edit',                      // reference to our css
            handler: displayEventEditWindow
        },
        '-',
        {
            text: 'Delete',
            tooltip: 'Delete the selected event.',
            handler: confirmDeleteEvents,   // Confirm before deleting
            iconCls:'remove'
        } 
    ]
});

// This saves the president after a cell has been edited
function saveTheEvent() {
    var form = EventEditForm.getForm();
    var params = form.getValues();
    params['task'] = eventMode.toString();
    if (isEventFormValid(form)) {
        Ext.Ajax.request({
            waitMsg: 'Please wait...',
            url: 'event/saveJSON',
            params: params,
            success: function ( result, request ) {
                var jsonData = Ext.util.JSON.decode(result.responseText);
                var resultMessage = jsonData.data;                
                switch (jsonData.success) {
                case true:
                    eventListDS.commitChanges();
                    eventListDS.reload();
                    EventEditWindow.hide();
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

// check if the form is valid
function isEventFormValid(form) {
    return(formIsValid(form));
}

function filterEventsByEvent(eventId) {
	console.log(eventId);
	eventListDS.reload({params: {events: eventId}});
}

// display or bring forth the form
function displayEventCreateWindow() {
    eventMode = "Create";
    if (!EventEditWindow.isVisible()) {
        EventEditWindow.show();
        resetForm(EventEditForm.getForm());
    } else {
        EventEditWindow.toFront();
    }
}

// display or bring forth the form
function displayEventViewWindow() {
    if (eventGrid.selModel.getCount()) {
        var selections = eventGrid.selModel.getSelections();
        eventDS.on('load', eventDSOnLoad());
        eventDS.load({params: {'id': selections[0].json.id}});
        if (!EventViewWindow.isVisible()) {
            EventViewWindow.show();
        } else {
            EventViewWindow.toFront();
        }
    }
}

//display or bring forth the form
function displayEventViewPanel(rowIndex) {
    //var selections = eventListView.getSelectedRecords();
    eventDS.on('load', eventDSViewOnLoad());
    eventDS.load({params: {'id': eventListView.store.getAt(rowIndex).json.id}});
    replace('eventViewPanel', 'Event');
}

// display or bring forth the form
function displayEventEditWindow() {
    if (eventGrid.selModel.getCount()) {
        eventMode = "Edit";
        var selections = eventGrid.selModel.getSelections();
        eventDS.on('load', eventDSEditOnLoad);
        eventDS.load({params: {'id': selections[0].json.id}});

        if (!EventEditWindow.isVisible()) {
            EventEditWindow.show();
        } else {
            EventEditWindow.toFront();
        }

    }
}


// This was added in Tutorial 6
function confirmDeleteEvents() {
    if (eventGrid.selModel.getCount() == 1) // only one president is selected here
    {
        Ext.MessageBox.confirm('Confirmation', 'You are about to delete a event. Continue?', deleteEvents);
    } else if (eventGrid.selModel.getCount() > 1) {
        Ext.MessageBox.confirm('Confirmation', 'Delete those events?', deleteEvents);
    } else {
        Ext.MessageBox.alert('Uh oh...', 'You can\'t really delete something you haven\'t selected huh?');
    }
}

// This was added in Tutorial 6
function confirmAttendEvents() {
    if (eventGrid.selModel.getCount() == 1) // only one president is selected here
    {
        Ext.MessageBox.confirm('Confirmation', 'You are about to request your attendance on a event. Continue?', attendEvents);
    } else if (eventGrid.selModel.getCount() > 1) {
        Ext.MessageBox.confirm('Confirmation', 'Attend those events?', attendEvents);
    } else {
        Ext.MessageBox.alert('Uh oh...', 'You can\'t really attend something you haven\'t selected huh?');
    }
}

// This was added in Tutorial 6
function deleteEvents(btn) {
    if (btn == 'yes') {
        var selections = eventGrid.selModel.getSelections();
        Ext.Ajax.request({
            waitMsg: 'Please Wait',
            url: 'event/deleteJSON',
            params: {
                id:  selections[0].json.id
            },
            success:
            function(response) {
                var result = eval(response.responseText);
                switch (result) {
                    case 1:  // Success : simply reload
                        eventListDS.reload();
                        break;
                    default:
                        Ext.MessageBox.alert('Fail', 'This event cannot be deleted.');
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

function attendEvents(btn) {
    if (btn == 'yes') {
        var selections = eventGrid.selModel.getSelections();
        Ext.Ajax.request({
            waitMsg: 'Please Wait',
            url: 'userEvent/attendJSON',
            params: {
                id:selections[0].json.id
            },
            success:
            function(response) {
                var result = eval(response.responseText);
                switch (result) {
                    case 1:  // Success : simply reload
                        Ext.MessageBox.alert('Success', 'You have successfully requested approval to attend this event!');
                        eventListDS.reload();
                        break;
                    default:
                        Ext.MessageBox.alert('Fail', 'You have already requested to attend this event.');
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

function onEventListingEditorGridContextMenu(grid, rowIndex, e) {
    e.stopEvent();
    var coords = e.getXY();
    EventListingContextMenu.rowRecord = grid.store.getAt(rowIndex);
    grid.selModel.selectRow(rowIndex);
    EventListingSelectedRow = rowIndex;
    EventListingContextMenu.showAt([coords[0], coords[1]]);
}

function onEventListingEditorGridDoubleClick(grid, rowIndex, e) {
    e.stopEvent();
    var coords = e.getXY();
    //alert(grid.store.getAt(rowIndex).json.id);
    displayEventViewWindow();
}

function onEventListViewGridDoubleClick(grid, rowIndex, e) {alert('hi');
    //e.stopEvent();
    //var coords = e.getXY();
    alert(grid.store.getAt(rowIndex).json.id);
    displayEventViewPanel(rowIndex);
}


function eventDSOnLoad() {
    var form = EventViewForm.getForm();
    form.setValues(eventDS.getAt(0).data);
    form.findField('tripsDisplayFieldEvent').setValue(buildStringFromArray(eventDS.getAt(0).data.trips, "name", "<br/>"));
}

function eventDSViewOnLoad() {
    var form = EventViewPanel.getForm();
    form.setValues(eventDS.getAt(0).data);
    form.findField('tripsDisplayFieldEvent').setValue(buildStringFromArray(eventDS.getAt(0).data.trips, "name", "<br/>"));
}

function eventDSEditOnLoad() {
    var form = EventEditForm.getForm();
    form.setValues(eventDS.getAt(0).data);
}


function modifyEventContextMenu() {
    displayEventEditWindow();
}

function deleteEventContextMenu() {
    confirmDeleteEvents();
}

eventGrid.addListener('rowcontextmenu', onEventListingEditorGridContextMenu);
eventGrid.addListener('rowdblclick', onEventListingEditorGridDoubleClick);
eventListView.addListener('dblclick', onEventListViewGridDoubleClick);


EventListingContextMenu = new Ext.menu.Menu({
    id: 'EventListingEditorGridContextMenu',
    items: [
        { text: 'Modify this Event', handler: modifyEventContextMenu },
        { text: 'Attend this Event', handler: confirmAttendEvents },
        { text: 'Delete this Event', handler: deleteEventContextMenu }
    ]
});

eventListDS.load({params: {start: 0, limit: 15}});
//eventGrid.on('afteredit', saveTheEvent);

var EventViewForm = new Ext.FormPanel({
    labelAlign: 'top',
    bodyStyle:'padding:5px',
    width: 600,
    //store: eventDS,
    items: [
        {
            layout:'column',
            border:false,
            items:[
                {
                    columnWidth:0.5,
                    layout: 'form',
                    border:false,
                    items: [Ext.applyIf({id:'nameDisplayFieldEvent'}, nameDisplayField), Ext.applyIf({id:'descriptionDisplayFieldEvent'}, descriptionDisplayField), Ext.applyIf({id:'locationDisplayFieldEvent'}, locationDisplayField)]
                },
                {
                    columnWidth:0.5,
                    layout: 'form',
                    border:false,
                    items: [Ext.applyIf({id:'startDateDisplayFieldEvent'}, startDateDisplayField), Ext.applyIf({id:'endDateDisplayFieldEvent'}, endDateDisplayField), Ext.applyIf({id:'tripsDisplayFieldEvent'}, tripsDisplayField), Ext.applyIf({id:'idFieldEvent'}, idField)]
                }
            ]
        }
    ],
    buttons: [
        {
            text: 'Close',
            handler: function() {
                // because of the global vars, we can only instantiate one window... so let's just hide it.
                EventViewWindow.hide();
            }
        }
    ]
});

var EventViewWindow = new Ext.Window({
    id: 'EventViewWindow',
    title: 'Event Details',
    closable:true,
    width: 610,
    height: 400,
    plain:false,
    layout: 'fit',
    items: EventViewForm
});

var EventEditForm = new Ext.FormPanel({
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
                    items: [Ext.applyIf({id:'nameFieldEvent'}, nameField), Ext.applyIf({id:'descriptionFieldEvent'}, descriptionField)]
                },
                {
                    columnWidth:0.5,
                    layout: 'form',
                    border:false,
                    items: [Ext.applyIf({id:'startDateFieldEvent'}, startDateField), Ext.applyIf({id:'endDateFieldEvent'}, endDateField), Ext.applyIf({id:'idFieldContract'}, idField)]
                }
            ]
        }
    ],
    buttons: [
        {
            text: 'Save and Close',
            handler: saveTheEvent
        },
        {
            text: 'Cancel',
            handler: function() {
                // because of the global vars, we can only instantiate one window... so let's just hide it.
                EventEditWindow.hide();
            }
        }
    ]
});

var EventEditWindow = new Ext.Window({
    id: 'EventEditWindow',
    title: 'Edit a Event',
    closable:false,
    width: 610,
    height: 515,
    plain:false,
    layout: 'fit',
    items: EventEditForm
});

var EventViewPanel = new Ext.FormPanel({
	id: 'eventViewPanel',
    labelAlign: 'top',
    bodyStyle:'padding:5px',
    //width: 600,
    //store: eventDS,
    items: [
        {
            layout:'form',
            border:false,
            items: [
                    Ext.applyIf({id:'nameDisplayFieldEvent'}, nameDisplayField), 
                    Ext.applyIf({id:'descriptionDisplayFieldEvent'}, descriptionDisplayField), 
                    Ext.applyIf({id:'locationDisplayFieldEvent'}, locationDisplayField),
                    Ext.applyIf({id:'startDateDisplayFieldEvent'}, startDateDisplayField), 
                    Ext.applyIf({id:'endDateDisplayFieldEvent'}, endDateDisplayField), 
                    Ext.applyIf({id:'tripsDisplayFieldEvent'}, tripsDisplayField), 
                    Ext.applyIf({id:'idFieldEvent'}, idField)
                    ]
        }
    ],
    buttons: [
        {
            text: 'Close',
            handler: function() {
                // because of the global vars, we can only instantiate one window... so let's just hide it.
                EventViewWindow.hide();
            }
        }
    ]
});

