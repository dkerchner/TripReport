/*
 * Ext JS Library 2.0 Beta 1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://extjs.com/license
 */
var aiMode;


var actionItemcm = new Ext.grid.ColumnModel([
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
    {header: "Contracts", width: 115, dataIndex: 'contracts', sortable: true, renderer: function(value, cell) {
        return buildStringFromArray(value, 'name', ', ');
    }},
    {header: "Attendees", width: 115, dataIndex: 'attendees', sortable: true, renderer: function(value, cell) {
        return buildStringFromArray(value, 'name', ', ');
    }}
]);

actionItemcm.defaultSortable = true;

// create the grid
var actionItemGrid = new Ext.grid.GridPanel({
    //title: 'ActionItems',
    id: 'actionItem-grid',
    ds: actionItemListDS,
    cm: actionItemcm,
    //renderTo: 'center-div',
    //width:700,
    //height:350,
    enableColLock:false,
    //clicksToEdit:1,
    selModel: new Ext.grid.RowSelectionModel({singleSelect:true}),
    bbar: new Ext.PagingToolbar({
        pageSize: 15,
        store: actionItemListDS,
        displayInfo: true
    }),
    tbar: [
        {
            text: 'View',
            tooltip: 'View a actionItem',
            iconCls:'search',                      // reference to our css
            handler: displayActionItemViewWindow
        },
        '-',
        {
            text: 'Submit',
            tooltip: 'Submit a actionItem',
            iconCls:'add',                      // reference to our css
            handler: displayActionItemCreateWindow
        },
        '-',
        {
            text: 'Edit',
            tooltip: 'Edit a actionItem',
            iconCls:'edit',                      // reference to our css
            handler: displayActionItemEditWindow
        },
        '-',
        {
            text: 'Delete',
            tooltip: 'Delete the selected actionItem.',
            handler: confirmDeleteActionItems,   // Confirm before deleting
            iconCls:'remove'
        } /*,
         '-',
         { // Added in Tutorial 8
         text: 'Search',
         tooltip: 'Advanced Search',
         handler: startAdvancedSearch,
         iconCls:'search'
         },
         '-',
         new Ext.app.SearchField({
         store: actionItemListDS,
         params: {start: 0, limit: 15},
         width: 120
         }) */
    ]
});


// This saves the president after a cell has been edited
function saveTheActionItem() {
    var form = ActionItemEditForm.getForm();
    var params = form.getValues();
    params['task'] = aiMode.toString();
    if (isActionItemFormValid(form)) {
        Ext.Ajax.request({
            waitMsg: 'Please wait...',
            url: 'actionItem/saveJSON',
            params: params,
            success: function(response) {
                var result = eval(response.responseText);
                switch (result) {
                    case 1:
                        actionItemListDS.commitChanges();
                        actionItemListDS.reload();
                        ActionItemEditWindow.hide();
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
    } else {
        Ext.MessageBox.alert('Warning', 'Your Form is not valid!');
    }

}

// check if the form is valid
function isActionItemFormValid(form) {
    return(formIsValid(form));
}

// display or bring forth the form
function displayActionItemCreateWindow() {
    aiMode = "Create";
    if (!ActionItemEditWindow.isVisible()) {
        ActionItemEditWindow.show();
        var form = ActionItemEditForm.getForm();
        resetForm(form);alert(ReportEditForm.getForm().findField('idFieldReport').getValue());
        form.findField('reportIdAI').setValue(ReportEditForm.getForm().findField('idFieldReport').getValue());
    } else {
        ActionItemEditWindow.toFront();
    }
}

// display or bring forth the form
function displayActionItemViewWindow() {
    if (actionItemGrid.selModel.getCount()) {
        var selections = actionItemGrid.selModel.getSelections();
        actionItemDS.on('load', actionItemDSOnLoad);
        actionItemDS.load({params: {'id': selections[0].json.id}});
        if (!ActionItemViewWindow.isVisible()) {
            ActionItemViewWindow.show();
        } else {
            ActionItemViewWindow.toFront();
        }
    }
}

// display or bring forth the form
function displayActionItemEditWindow() {
    if (actionItemGrid.selModel.getCount()) {
        aiMode = "Edit";
        var selections = actionItemGrid.selModel.getSelections();
        actionItemDS.on('load', actionItemDSEditOnLoad);
        actionItemDS.load({params: {'id': selections[0].json.id}});

        if (!ActionItemEditWindow.isVisible()) {
            ActionItemEditWindow.show();
        } else {
            ActionItemEditWindow.toFront();
        }

    }
}


// This was added in Tutorial 6
function confirmDeleteActionItems() {
    if (actionItemGrid.selModel.getCount() == 1) // only one president is selected here
    {
        Ext.MessageBox.confirm('Confirmation', 'You are about to delete a actionItem. Continue?', deleteActionItems);
    } else if (actionItemGrid.selModel.getCount() > 1) {
        Ext.MessageBox.confirm('Confirmation', 'Delete those actionItems?', deleteActionItems);
    } else {
        Ext.MessageBox.alert('Uh oh...', 'You can\'t really delete something you haven\'t selected huh?');
    }
}


// This was added in Tutorial 6
function confirmAttendActionItems() {
    if (actionItemGrid.selModel.getCount() == 1) // only one president is selected here
    {
        Ext.MessageBox.confirm('Confirmation', 'You are about to request your attendance on a actionItem. Continue?', attendActionItems);
    } else if (actionItemGrid.selModel.getCount() > 1) {
        Ext.MessageBox.confirm('Confirmation', 'Attend those actionItems?', attendActionItems);
    } else {
        Ext.MessageBox.alert('Uh oh...', 'You can\'t really attend something you haven\'t selected huh?');
    }
}

// This was added in Tutorial 6
function deleteActionItems(btn) {
    if (btn == 'yes') {
        var selections = actionItemGrid.selModel.getSelections();
        Ext.Ajax.request({
            waitMsg: 'Please Wait',
            url: 'actionItem/deleteJSON',
            params: {
                id:  selections[0].json.id
            },
            success:
            function(response) {
                var result = eval(response.responseText);
                switch (result) {
                    case 1:  // Success : simply reload
                        actionItemListDS.reload();
                        break;
                    default:
                        Ext.MessageBox.alert('Fail', 'This actionItem cannot be deleted.');
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

//This was added in Tutorial 6
function deleteActionItemsFromReport() {
	var actionItemId = ReportEditForm.getForm().findField('actionItemsField').getValue();
	alert(actionItemId);
    Ext.Ajax.request({
        waitMsg: 'Please Wait',
        url: 'actionItem/deleteJSON',
        params: {
            id:  actionItemId
        },
        success:
        function(response) {
            var result = eval(response.responseText);
            switch (result) {
                case 1:  // Success : simply reload
                    actionItemListDS.reload();
                    break;
                default:
                    Ext.MessageBox.alert('Fail', 'This actionItem cannot be deleted.');
                    break;
            }
        },
        failure: function(response) {
            var result = response.responseText;
            Ext.MessageBox.alert('error', 'could not connect to the database. retry later');
        }
    });
}



function onActionItemListingEditorGridContextMenu(grid, rowIndex, e) {
    e.stopEvent();
    var coords = e.getXY();
    ActionItemListingContextMenu.rowRecord = grid.store.getAt(rowIndex);
    grid.selModel.selectRow(rowIndex);
    ActionItemListingSelectedRow = rowIndex;
    ActionItemListingContextMenu.showAt([coords[0], coords[1]]);
}

function onActionItemListingEditorGridDoubleClick(grid, rowIndex, e) {
    e.stopEvent();
    var coords = e.getXY();
    //alert(grid.store.getAt(rowIndex).json.id);
    displayActionItemViewWindow();
}

function actionItemDSOnLoad() {
    var form = ActionItemViewForm.getForm();
    form.setValues(actionItemDS.getAt(0).data);
}

function actionItemDSEditOnLoad() {
    var form = ActionItemEditForm.getForm();
    form.setValues(actionItemDS.getAt(0).data);
    form.findField('reportIdAI').setValue(reportEditForm.getForm().findField('idFieldReport').getValue());

    if (aiMode != "Create") {
    }
}


function modifyActionItemContextMenu() {
    displayActionItemEditWindow();
}

function deleteActionItemContextMenu() {
    confirmDeleteActionItems();
}

actionItemGrid.addListener('rowcontextmenu', onActionItemListingEditorGridContextMenu);
actionItemGrid.addListener('rowdblclick', onActionItemListingEditorGridDoubleClick);


ActionItemListingContextMenu = new Ext.menu.Menu({
    id: 'ActionItemListingEditorGridContextMenu',
    items: [
        { text: 'Modify this ActionItem', handler: modifyActionItemContextMenu },
        { text: 'Attend this ActionItem', handler: confirmAttendActionItems },
        { text: 'Delete this ActionItem', handler: deleteActionItemContextMenu }
    ]
});

actionItemListDS.load({params: {start: 0, limit: 15}});
//actionItemGrid.on('afteredit', saveTheActionItem);

var ActionItemViewForm = new Ext.FormPanel({
    labelAlign: 'top',
    bodyStyle:'padding:5px',
    width: 600,
    //store: actionItemDS,
    items: [
        {
            layout:'form',
            border:false,
            items:[
                {
                    layout: 'form',
                    border:false,
                    items: [Ext.applyIf({id:'nameDisplayFieldAI', name: 'name'}, nameDisplayField), Ext.applyIf({id:'shortDescriptionDisplayFieldAI'}, shortDescriptionDisplayField), dueDateDisplayField]
                }
            ]
        }
    ],
    buttons: [
        /*{
             id: 'approveButton',
             text: 'Approve',
             handler: confirmApproveActionItems,
             class: 'approved',
             iconCls: 'approve'
         },*/
        {
            text: 'Close',
            handler: function() {
                // because of the global vars, we can only instantiate one window... so let's just hide it.
                ActionItemViewWindow.hide();
            }
        }
    ]
});

var ActionItemViewWindow = new Ext.Window({
    id: 'ActionItemViewWindow',
    title: 'ActionItem Details',
    closable:true,
    width: 610,
    height: 400,
    plain:false,
    layout: 'fit',
    items: ActionItemViewForm
});

var ActionItemEditForm = new Ext.FormPanel({
    labelAlign: 'top',
    bodyStyle:'padding:5px',
    width: 600,
    items: [
        {
            layout:'form',
            border:false,
            items:[
                {
                    layout: 'form',
                    border:false,
                    items: [Ext.applyIf({id:'nameFieldAI'}, nameField), Ext.applyIf({id:'descriptionFieldAI'}, descriptionField), dueDateField, Ext.applyIf({id:'reportIdAI', name:'report'}, idField), Ext.applyIf({id:'idAI', name:'id'}, idField2)]
                }
            ]
        }
    ],
    buttons: [
        {
            text: 'Save and Close',
            handler: saveTheActionItem
        },
        {
            text: 'Cancel',
            handler: function() {
                // because of the global vars, we can only instantiate one window... so let's just hide it.
                ActionItemEditWindow.hide();
            }
        }
    ]
});

var ActionItemEditWindow = new Ext.Window({
    id: 'ActionItemEditWindow',
    title: 'Edit an ActionItem',
    closable:false,
    width: 450,
    height: 400,
    plain:false,
    layout: 'fit',
    items: ActionItemEditForm
});
