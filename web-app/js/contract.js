/*
 * Ext JS Library 2.0 Beta 1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://extjs.com/license
 */
var contractMode;
var ContractViewWindow;
var ContractViewForm;
var ContractEditWindow;
var ContractEditForm;


var contractcm = new Ext.grid.ColumnModel([
    {header: 'version', readOnly: true, dataIndex: 'version', width: 40, renderer: function(value, cell) {
        cell.css = "readonlycell";
        return value;
    }, hidden: true},
    {header: '#', readOnly: true, dataIndex: 'id', width: 40, renderer: function(value, cell) {
        cell.css = "readonlycell";
        return value;
    }, hidden: true},
    {header: "Contract #", width: 100, dataIndex: 'contractNumber', sortable: true},
    {header: "Organization", width: 100, dataIndex: 'organization'},
    {header: "Active", width: 115, dataIndex: 'active', sortable: true, renderer: function(value, cell) {
            if (value) {
                value = 'Yes'
            } else {
                cell.css = "readonlycell";
                value = 'No'
            }
            return value;
        }
    }
]);

contractcm.defaultSortable = true;

// create the grid
var contractGrid = new Ext.grid.GridPanel({
    //title: 'Contracts',
    id: 'contract-grid',
    ds: contractListDS,
    cm: contractcm,
    //renderTo: 'center-div',
    //width:700,
    //height:350,
    enableColLock:false,
    //clicksToEdit:1,
    selModel: new Ext.grid.RowSelectionModel({singleSelect:true}),
    bbar: new Ext.PagingToolbar({
        pageSize: 15,
        store: contractListDS,
        displayInfo: true
    }),
    tbar: [
        {
            text: 'View',
            tooltip: 'View a contract',
            iconCls:'search',                      // reference to our css
            handler: displayContractViewWindow
        },
        '-',
        {
            text: 'Submit',
            tooltip: 'Submit a contract',
            iconCls:'add',                      // reference to our css
            handler: displayContractCreateWindow
        },
        '-',
        {
            text: 'Edit',
            tooltip: 'Edit a contract',
            iconCls:'edit',                      // reference to our css
            handler: displayContractEditWindow
        },
        '-',
        {
            text: 'Delete',
            tooltip: 'Delete the selected contract.',
            handler: confirmDeleteContracts,   // Confirm before deleting
            iconCls:'remove'
        }
    ]
});

// display or bring forth the form
function displayContractCreateWindow() {
    contractMode = "Create";
    if (!ContractEditWindow.isVisible()) {
        ContractEditWindow.show();
        resetContractForm();
    } else {
        ContractEditWindow.toFront();
    }
}

// display or bring forth the form
function displayContractViewWindow() {
    if (contractGrid.selModel.getCount()) {
        if (!ContractViewWindow.isVisible()) {
            var selections = contractGrid.selModel.getSelections();
            contractDS.on('load', contractDSOnLoad);
            contractDS.load({params: {'id': selections[0].json.id}});
            ContractViewWindow.show();
        } else {
            ContractViewWindow.toFront();
        }
    }
}

// display or bring forth the form
function displayContractEditWindow() {
    if (contractGrid.selModel.getCount()) {
        contractMode = "Edit";
        var selections = contractGrid.selModel.getSelections();
        contractDS.on('load', contractDSEditOnLoad);
        contractDS.load({params: {'id': selections[0].json.id}});

        if (!ContractEditWindow.isVisible()) {
            ContractEditWindow.show();
            //resetContractForm();
        } else {
            ContractEditWindow.toFront();
        }

    }
}

function modifyContractContextMenu() {
    displayContractEditWindow();
}

function deleteContractContextMenu() {
    confirmDeleteContracts();
}

contractGrid.addListener('rowcontextmenu', onContractListingEditorGridContextMenu);
contractGrid.addListener('rowdblclick', onContractListingEditorGridDoubleClick);


ContractListingContextMenu = new Ext.menu.Menu({
    id: 'ContractListingEditorGridContextMenu',
    items: [
        { text: 'Modify this Contract', handler: modifyContractContextMenu },
        { text: 'Attend this Contract', handler: confirmAttendContracts },
        { text: 'Delete this Contract', handler: deleteContractContextMenu }
    ]
});

// This was added in Tutorial 6
function confirmDeleteContracts() {
    if (contractGrid.selModel.getCount() == 1) // only one president is selected here
    {
        Ext.MessageBox.confirm('Confirmation', 'You are about to delete a contract. Continue?', deleteContracts);
    } else if (contractGrid.selModel.getCount() > 1) {
        Ext.MessageBox.confirm('Confirmation', 'Delete those contracts?', deleteContracts);
    } else {
        Ext.MessageBox.alert('Uh oh...', 'You can\'t really delete something you haven\'t selected huh?');
    }
}

// This was added in Tutorial 6
function confirmAttendContracts() {
    if (contractGrid.selModel.getCount() == 1) // only one president is selected here
    {
        Ext.MessageBox.confirm('Confirmation', 'You are about to request your attendance on a contract. Continue?', attendContracts);
    } else if (contractGrid.selModel.getCount() > 1) {
        Ext.MessageBox.confirm('Confirmation', 'Attend those contracts?', attendContracts);
    } else {
        Ext.MessageBox.alert('Uh oh...', 'You can\'t really attend something you haven\'t selected huh?');
    }
}

// This was added in Tutorial 6
function deleteContracts(btn) {
    if (btn == 'yes') {
        var selections = contractGrid.selModel.getSelections();
        Ext.Ajax.request({
            waitMsg: 'Please Wait',
            url: 'http://localhost:8080/ContractContractSPT/contract/deleteJSON',
            params: {
                id:  selections[0].json.id
            },
            success:
            function(response) {
                var result = eval(response.responseText);
                switch (result) {
                    case 1:  // Success : simply reload
                        contractListDS.reload();
                        break;
                    default:
                        Ext.MessageBox.alert('Fail', 'This contract cannot be deleted.');
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


function onContractListingEditorGridContextMenu(grid, rowIndex, e) {
    e.stopEvent();
    var coords = e.getXY();
    ContractListingContextMenu.rowRecord = grid.store.getAt(rowIndex);
    grid.selModel.selectRow(rowIndex);
    ContractListingSelectedRow = rowIndex;
    ContractListingContextMenu.showAt([coords[0], coords[1]]);
}

function onContractListingEditorGridDoubleClick(grid, rowIndex, e) {
    e.stopEvent();
    var coords = e.getXY();
    //alert(grid.store.getAt(rowIndex).json.id);
    displayContractViewWindow();
}

function contractDSOnLoad() {
    var form = ContractViewForm.getForm();

    form.setValues(contractDS.getAt(0).data);
}

function contractDSEditOnLoad() {
    var form = ContractEditForm.getForm();

    form.setValues(contractDS.getAt(0).data);
    if (contractMode != "Create") {
    }
}

contractListDS.load({params: {start: 0, limit: 15}});
contractGrid.on('afteredit', saveTheContract);

// This saves the president after a cell has been edited
function saveTheContract() {
    var form = ContractEditForm.getForm();
    var params = form.getValues();
    params['task'] = contractMode.toString();
    if (isReportFormValid(form)) {
        Ext.Ajax.request({
            waitMsg: 'Please wait...',
            url: 'contract/saveJSON',
            params: params,
            success: function(response) {
                var result = eval(response.responseText);
                switch (result) {
                    case 1:
                        contractListDS.commitChanges();
                        contractListDS.reload();
                        ContractEditWindow.hide();
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

// reset the Form before opening it
function resetContractForm() {
    var form = ContractEditForm.getForm();
    resetForm(form);
}

// check if the form is valid
function isReportFormValid(form) {
    return(formIsValid(form));
}

ContractViewForm = new Ext.FormPanel({
    labelAlign: 'top',
    bodyStyle:'padding:5px',
    width: 600,
    store: contractDS,
    items: [
        {
            layout:'column',
            border:false,
            items:[
                {
                    columnWidth:0.5,
                    layout: 'form',
                    border:false,
                    items: [Ext.applyIf({id:'nameDisplayFieldContract', name:'contractNumber'}, nameDisplayField)]
                },
                {
                    columnWidth:0.5,
                    layout: 'form',
                    border:false,
                    items: [Ext.applyIf({id:'organizationDisplayFieldContract'}, organizationDisplayField)]
                }
            ]
        }
    ],
    buttons: [
        /*{
         text: 'Save and Close',
         handler: createTheContract
         },*/
        {
            text: 'Close',
            handler: function() {
                ContractViewWindow.hide();
            }
        }
    ]
});

ContractViewWindow = new Ext.Window({
    id: 'ContractViewWindow',
    title: 'Contract Details',
    closable:true,
    width: 610,
    height: 450,
    plain:false,
    layout: 'fit',
    items: ContractViewForm
});

ContractEditForm = new Ext.FormPanel({
    labelAlign: 'top',
    bodyStyle:'padding:5px',
    width: 600,
    //store: contractDS,
    items: [
        {
            layout:'column',
            border:false,
            items:[
                {
                    columnWidth:0.5,
                    layout: 'form',
                    border:false,
                    items: [Ext.applyIf({id:'nameFieldContract', name:'contractNumber'}, nameField)]
                },
                {
                    columnWidth:0.5,
                    layout: 'form',
                    border:false,
                    items: [Ext.applyIf({id:'organizationFieldContract'}, organizationField), Ext.applyIf({id:'idFieldContract'}, idField)]
                }
            ]
        }
    ],
    buttons: [
        {
            text: 'Save and Close',
            handler: saveTheContract
        },
        {
            text: 'Cancel',
            // because of the global vars, we can only instantiate one window... so let's just hide it.

            handler: function() {
                ContractEditWindow.hide();
            }
        }
    ]
});

ContractEditWindow = new Ext.Window({
    id: 'ContractEditWindow',
    title: 'Edit a Contract',
    closable:false,
    width: 610,
    height: 450,
    plain:false,
    layout: 'fit',
    items: ContractEditForm
});

