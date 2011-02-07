/*
 * Ext JS Library 2.0 Beta 1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://extjs.com/license
 */
var aiMode;


/* All components related to the management of Action Item information. */

// The column model for the DataGrid
var actionItemcm = new Ext.grid.ColumnModel([
    {header: 'version', readOnly: true, dataIndex: 'version', width: 40, renderer: function(value, cell) {
        cell.css = "readonlycell";
        return value;
    }, hidden: true},
    {header: '#', readOnly: true, dataIndex: 'id', width: 40, renderer: function(value, cell) {
        cell.css = "readonlycell";
        return value;
    }, hidden: true},
    {header: "Name", width: 100, dataIndex: 'name', sortable: true},
    {header: "Report", width: 100, dataIndex: 'reportName', sortable: true},
    {header: "Description", width: 100, dataIndex: 'description', sortable: true},
    {header: "Due Date", width: 115, dataIndex: 'dueDate', renderer: Ext.util.Format.dateRenderer('m/d/Y'), sortable: true,
        editor: new Ext.form.DateField({
            format: 'm/d/Y'
        })}
]);
actionItemcm.defaultSortable = true;

//The data grid
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
        } 
    ]
});


//This saves the action item using an Ajax request
function saveTheActionItem() {
    var form = ActionItemEditForm.getForm();
    var params = form.getValues();
    params['task'] = aiMode.toString();
    if (isActionItemFormValid(form)) {
        Ext.Ajax.request({
            waitMsg: 'Please wait...',
            url: 'actionItem/saveJSON',
            params: params,
            success: function ( result, request ) {
                var jsonData = Ext.util.JSON.decode(result.responseText);
                var resultMessage = jsonData.data;                
                switch (jsonData.success) {
                case true:
                	actionItemListDS.commitChanges();
                	actionItemListDS.reload();
                	ActionItemEditWindow.hide();
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
function isActionItemFormValid(form) {
    return(formIsValid(form));
}

//Display the creation form
function displayActionItemCreateWindow() {
    aiMode = "Create";
    if (!ActionItemEditWindow.isVisible()) {
        ActionItemEditWindow.show();
        var form = ActionItemEditForm.getForm();
        resetForm(form);
        form.findField('reportIdAI').setValue(ReportEditForm.getForm().findField('idFieldReport').getValue());
    } else {
        ActionItemEditWindow.toFront();
    }
}

//Display the view form
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

//Display the edit form
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

//Confirm deletion, then call delete
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

//Creates an Ajax request to delete the action item
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

//Creates an Ajax request to delete the action item from a specific report (called from report edit screen). 
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

//Called by the context menu right click event
function onActionItemListingEditorGridContextMenu(grid, rowIndex, e) {
    e.stopEvent();
    var coords = e.getXY();
    ActionItemListingContextMenu.rowRecord = grid.store.getAt(rowIndex);
    grid.selModel.selectRow(rowIndex);
    ActionItemListingSelectedRow = rowIndex;
    ActionItemListingContextMenu.showAt([coords[0], coords[1]]);
}

//Called by the DataGrid double click event
function onActionItemListingEditorGridDoubleClick(grid, rowIndex, e) {
    e.stopEvent();
    var coords = e.getXY();
    //alert(grid.store.getAt(rowIndex).json.id);
    displayActionItemViewWindow();
}

//Called when the actionItemDS is loaded for the view form
function actionItemDSOnLoad() {
    var form = ActionItemViewForm.getForm();
    form.setValues(actionItemDS.getAt(0).data);
}

//Called when the actionItemDS is loaded for the edit form
function actionItemDSEditOnLoad() {
    var form = ActionItemEditForm.getForm();
    form.setValues(actionItemDS.getAt(0).data);
    form.findField('reportIdAI').setValue(reportEditForm.getForm().findField('idFieldReport').getValue());

    if (aiMode != "Create") {
    }
}

//The function called by the modify context menu
function modifyActionItemContextMenu() {
    displayActionItemEditWindow();
}

//The function called by the delete context menu
function deleteActionItemContextMenu() {
    confirmDeleteActionItems();
}

//DataGrid event listeners
actionItemGrid.addListener('rowcontextmenu', onActionItemListingEditorGridContextMenu);
actionItemGrid.addListener('rowdblclick', onActionItemListingEditorGridDoubleClick);

//The context menu construct
ActionItemListingContextMenu = new Ext.menu.Menu({
    id: 'ActionItemListingEditorGridContextMenu',
    items: [
        { text: 'Modify this ActionItem', handler: modifyActionItemContextMenu },
        { text: 'Delete this ActionItem', handler: deleteActionItemContextMenu }
    ]
});

//Initial load of actionItemListDS *Important*
actionItemListDS.load({params: {start: 0, limit: 15}});
//actionItemGrid.on('afteredit', saveTheActionItem);

//The ActionItem view form construct
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
        {
            text: 'Close',
            handler: function() {
                // because of the global vars, we can only instantiate one window... so let's just hide it.
                ActionItemViewWindow.hide();
            }
        }
    ]
});

//The window in which to display the ActionItem view form
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

//The ActionItem edit form construct
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

//The window in which to display the ActionItem edit form
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
