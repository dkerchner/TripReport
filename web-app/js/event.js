/*
 * Ext JS Library 2.0 Beta 1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://extjs.com/license
 */
var eventMode;

/* All components related to the management of User information. */

//The column model for the DataGrid
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

//The event list that appears on the 'east' side of the layout
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

//The data grid
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

//Display the creation form
function saveTheEvent() {
    var form = EventEditForm.getForm();
    var params = form.getValues();
    params['task'] = eventMode.toString();
    if (formIsValid(form)) {
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

//Display the view form
function displayEventCreateWindow() {
    eventMode = "Create";
    if (!EventEditWindow.isVisible()) {
        EventEditWindow.show();
        resetForm(EventEditForm.getForm());
    } else {
        EventEditWindow.toFront();
    }
}

//Display the edit form
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

// The panel displayed when double clicking on an item in the event list on the 'east' side of the layout
function displayEventViewPanel(rowIndex) {
    //var selections = eventListView.getSelectedRecords();
    eventDS.on('load', eventDSViewOnLoad());
    eventDS.load({params: {'id': eventListView.store.getAt(rowIndex).json.id}});
    replace('eventViewPanel', 'Event');
}

//Display the edit form
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

//Confirm deletion, then call delete
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

//Creates an Ajax request to delete the event
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

//Called by the context menu right click event
function onEventListingEditorGridContextMenu(grid, rowIndex, e) {
    e.stopEvent();
    var coords = e.getXY();
    EventListingContextMenu.rowRecord = grid.store.getAt(rowIndex);
    grid.selModel.selectRow(rowIndex);
    EventListingSelectedRow = rowIndex;
    EventListingContextMenu.showAt([coords[0], coords[1]]);
}

//Called by the DataGrid double click event
function onEventListingEditorGridDoubleClick(grid, rowIndex, e) {
    e.stopEvent();
    var coords = e.getXY();
    //alert(grid.store.getAt(rowIndex).json.id);
    displayEventViewWindow();
}

//Called by the ListView double click event
function onEventListViewGridDoubleClick(grid, rowIndex, e) {alert('hi');
    //e.stopEvent();
    //var coords = e.getXY();
    alert(grid.store.getAt(rowIndex).json.id);
    displayEventViewPanel(rowIndex);
}

//Called when the eventDS is loaded for the view form
function eventDSOnLoad() {
    var form = EventViewForm.getForm();
    form.setValues(eventDS.getAt(0).data);
    form.findField('tripsDisplayFieldEvent').setValue(buildStringFromArray(eventDS.getAt(0).data.trips, "name", "<br/>"));
}

//Called when the eventDS is loaded for the event view panel
function eventDSViewOnLoad() {
    var form = EventViewPanel.getForm();
    form.setValues(eventDS.getAt(0).data);
    form.findField('tripsDisplayFieldEvent').setValue(buildStringFromArray(eventDS.getAt(0).data.trips, "name", "<br/>"));
}

//Called when the eventDS is loaded for the edit form
function eventDSEditOnLoad() {
    var form = EventEditForm.getForm();
    form.setValues(eventDS.getAt(0).data);
}

//The function called by the modify context menu
function modifyEventContextMenu() {
    displayEventEditWindow();
}

//The function called by the delete context menu
function deleteEventContextMenu() {
    confirmDeleteEvents();
}

//DataGrid event listeners
eventGrid.addListener('rowcontextmenu', onEventListingEditorGridContextMenu);
eventGrid.addListener('rowdblclick', onEventListingEditorGridDoubleClick);
//ListView event listener
eventListView.addListener('dblclick', onEventListViewGridDoubleClick);

//The context menu construct
EventListingContextMenu = new Ext.menu.Menu({
    id: 'EventListingEditorGridContextMenu',
    items: [
        { text: 'Modify this Event', handler: modifyEventContextMenu },
        { text: 'Attend this Event', handler: confirmAttendEvents },
        { text: 'Delete this Event', handler: deleteEventContextMenu }
    ]
});

//Initial load of eventListDS *Important*
eventListDS.load({params: {start: 0, limit: 15}});
//eventGrid.on('afteredit', saveTheEvent);

//The Event view form construct
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

//The window in which to display the Event view form
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

//The Event edit form construct
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

//The window in which to display the Event edit form
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

//The panel in which to display the Event
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
    ]
});

