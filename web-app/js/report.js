/*
 * Ext JS Library 2.0 Beta 1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://extjs.com/license
 */
var reportMode;

/* All components related to the management of User information. */

// The column model for the DataGrid
var reportcm = new Ext.grid.ColumnModel([
    {header: 'version', readOnly: true, dataIndex: 'version', width: 40, renderer: function(value, cell) {
        cell.css = "readonlycell";
        return value;
    }, hidden: true},
    {header: '#', readOnly: true, dataIndex: 'id', width: 40, renderer: function(value, cell) {
        cell.css = "readonlycell";
        return value;
    }, hidden: true},
    {header: "Name", width: 100, dataIndex: 'name', sortable: true},
    {header: "Trip", width: 120, dataIndex: 'trip'},
    {header: "Author", width: 180, dataIndex: 'author'},
    {header: "Usefulness", width: 40, dataIndex: 'usefulness'},
    {header: "Topics", width: 100, dataIndex: 'topics'},
    {header: "Issues", width: 100, dataIndex: 'issues'},
    {header: "Contacts", width: 115, dataIndex: 'contacts', sortable: true, renderer: function(value, cell) {
        return buildStringFromArray(value, 'name', ', ');
    }},
    {header: "ActionItems", width: 115, dataIndex: 'actionItems', sortable: true, renderer: function(value, cell) {
        return buildStringFromArray(value, 'name', ', ');
    }}
]);
reportcm.defaultSortable = true;

//The data grid
var reportGrid = new Ext.grid.GridPanel({
    //title: 'Reports',
    id: 'report-grid',
    ds: reportListDS,
    cm: reportcm,
    //renderTo: 'center-div',
    //width:700,
    //height:350,
    enableColLock:false,
    //clicksToEdit:1,
    selModel: new Ext.grid.RowSelectionModel({singleSelect:true}),
    bbar: new Ext.PagingToolbar({
        pageSize: 15,
        store: reportListDS,
        displayInfo: true
    }),
    tbar: [
        {
            text: 'View',
            tooltip: 'View a report',
            iconCls:'search',                      // reference to our css
            handler: displayReportViewWindow
        },
        '-',
        {
            text: 'Submit',
            tooltip: 'Submit a report',
            iconCls:'add',                      // reference to our css
            handler: displayFormWindow
        },
        '-',
        {
            text: 'Edit',
            tooltip: 'Edit a report',
            iconCls:'edit',                      // reference to our css
            handler: displayReportEditWindow
        },
        '-',
        {
            text: 'Delete',
            tooltip: 'Delete the selected report.',
            handler: confirmDeleteReports,   // Confirm before deleting
            iconCls:'remove'
        }
    ]
});

//Display the creation form
function displayFormWindow() {
    reportMode = "Create";
    if (!ReportEditWindow.isVisible()) {
        ReportEditWindow.show();
        resetForm(ReportEditForm.getForm());
    } else {
        ReportEditWindow.toFront();
    }
}

//Display the view form
function displayReportViewWindow() {
    if (reportGrid.selModel.getCount()) {
        var selections = reportGrid.selModel.getSelections();
        reportDS.on('load', reportDSOnLoad);
        reportDS.load({params: {'id': selections[0].json.id}});
        if (!ReportViewWindow.isVisible()) {
            ReportViewWindow.show();
        } else {
            ReportViewWindow.toFront();
        }
    }
}

//Display the edit form
function displayReportEditWindow() {
    if (reportGrid.selModel.getCount()) {
        reportMode = "Edit";
        var selections = reportGrid.selModel.getSelections();
        reportDS.on('load', reportDSEditOnLoad);
        reportDS.load({params: {'id': selections[0].json.id}});

        if (!ReportEditWindow.isVisible()) {
            ReportEditWindow.show();
            //resetReportForm();
        } else {
            ReportEditWindow.toFront();
        }

    }
}

//The function called by the modify context menu
function modifyReportContextMenu() {
    displayReportEditWindow();
}

//The function called by the delete context menu
function deleteReportContextMenu() {
    confirmDeleteReports();
}

//DataGrid event listeners
reportGrid.addListener('rowcontextmenu', onReportListingEditorGridContextMenu);
reportGrid.addListener('rowdblclick', onReportListingEditorGridDoubleClick);

// The context menu construct
ReportListingContextMenu = new Ext.menu.Menu({
    id: 'ReportListingEditorGridContextMenu',
    items: [
        { text: 'Modify this Report', handler: modifyReportContextMenu },
        { text: 'Attend this Report', handler: confirmAttendReports },
        { text: 'Delete this Report', handler: deleteReportContextMenu }
    ]
});

//Confirm deletion, then call delete
function confirmDeleteReports() {
    if (reportGrid.selModel.getCount() == 1) // only one president is selected here
    {
        Ext.MessageBox.confirm('Confirmation', 'You are about to delete a report. Continue?', deleteReports);
    } else if (reportGrid.selModel.getCount() > 1) {
        Ext.MessageBox.confirm('Confirmation', 'Delete those reports?', deleteReports);
    } else {
        Ext.MessageBox.alert('Uh oh...', 'You can\'t really delete something you haven\'t selected huh?');
    }
}

//Confirm attend, then call attend
function confirmAttendReports() {
    if (reportGrid.selModel.getCount() == 1) // only one president is selected here
    {
        Ext.MessageBox.confirm('Confirmation', 'You are about to request your attendance on a report. Continue?', attendReports);
    } else if (reportGrid.selModel.getCount() > 1) {
        Ext.MessageBox.confirm('Confirmation', 'Attend those reports?', attendReports);
    } else {
        Ext.MessageBox.alert('Uh oh...', 'You can\'t really attend something you haven\'t selected huh?');
    }
}

//Creates an Ajax request to delete the report
function deleteReports(btn) {
    if (btn == 'yes') {
        var selections = reportGrid.selModel.getSelections();
        Ext.Ajax.request({
            waitMsg: 'Please Wait',
            url: 'report/deleteJSON',
            params: {
                id:  selections[0].json.id
            },
            success: function ( result, request ) {
                var jsonData = Ext.util.JSON.decode(result.responseText);
                var resultMessage = jsonData.data;                
                switch (jsonData.success) {
                case true:
                	reportListDS.commitChanges();
                	reportListDS.reload();
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

//Called by the context menu right click event
function onReportListingEditorGridContextMenu(grid, rowIndex, e) {
    e.stopEvent();
    var coords = e.getXY();
    ReportListingContextMenu.rowRecord = grid.store.getAt(rowIndex);
    grid.selModel.selectRow(rowIndex);
    ReportListingSelectedRow = rowIndex;
    ReportListingContextMenu.showAt([coords[0], coords[1]]);
}

//Called by the DataGrid double click event
function onReportListingEditorGridDoubleClick(grid, rowIndex, e) {
    e.stopEvent();
    var coords = e.getXY();
    //alert(grid.store.getAt(rowIndex).json.id);
    displayReportViewWindow();
}

//Called when the reportDS is loaded for the view form
function reportDSOnLoad() {
    var form = ReportViewForm.getForm();
    form.setValues(reportDS.getAt(0).data);

    form.findField('contactsDisplayField').setValue(buildStringFromArray(reportDS.getAt(0).data.contacts, "name", "<br/>"));
    form.findField('actionItemsDisplayField').setValue(buildStringFromArray(reportDS.getAt(0).data.actionItems, "name", "<br/>"));
}

//Called when the reportDS is loaded for the edit form
function reportDSEditOnLoad() {
    var form = ReportEditForm.getForm();
    if (reportMode != "Create") {
        form.setValues(reportDS.getAt(0).data);
        contactListDS.load({params: {'report': reportDS.getAt(0).data.id}});
        actionItemListDS.load({params: {'report': reportDS.getAt(0).data.id}});
        form.findField('contactsField').setValue(buildStringFromArray(reportDS.getAt(0).data.contacts, "id", ','));
        form.findField('actionItemsField').setValue(buildStringFromArray(reportDS.getAt(0).data.actionItems, "id", ','));
    } else { // Since there is no report record, we cannot create associated records
    	form.findField('contactsField').disable();
    	form.findField('actionItemsField').disable();
    }
}

//Initial load of reportListDS *Important*
reportListDS.load({params: {start: 0, limit: 15}});

//This saves the user using an Ajax request
function saveTheReport() {
    var form = ReportEditForm.getForm();
    var params = form.getValues();
    params['task'] = reportMode.toString();
    if (isReportFormValid(form)) {
        Ext.Ajax.request({
            waitMsg: 'Please wait...',
            url: 'report/saveJSON',
            params: params,
            success: function ( result, request ) {
                var jsonData = Ext.util.JSON.decode(result.responseText);
                var resultMessage = jsonData.data;                
                switch (jsonData.success) {
                case true:
                    reportListDS.commitChanges();
                    reportListDS.reload();
                    ReportEditWindow.hide();
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

//Check if the form is valid
function isReportFormValid(form) {
    return(formIsValid(form));
}

//The Report view form construct
var ReportViewForm = new Ext.FormPanel({
    labelAlign: 'top',
    bodyStyle:'padding:5px',
    width: 600,
    store: reportDS,
    items: [
        {
            layout:'column',
            border:false,
            items:[
                {
                    columnWidth:0.5,
                    layout: 'form',
                    border:false,
                    items: [tripDisplayField, topicsDisplayField, contactsDisplayField, actionItemsDisplayField]
                },
                {
                    columnWidth:0.5,
                    layout: 'form',
                    border:false,
                    items: [authorDisplayField, usefulnessDisplayField, issuesDisplayField]
                }
            ]
        }
    ],
    buttons: [
        /*{
         text: 'Save and Close',
         handler: createTheReport
         },*/
        {
            text: 'Close',
            handler: function() {
                // because of the global vars, we can only instantiate one window... so let's just hide it.
                ReportViewWindow.hide();
            }
        }
    ]
});

//The window in which to display the Report view form
var ReportViewWindow = new Ext.Window({
    id: 'ReportViewWindow',
    title: 'Report Details',
    closable:true,
    width: 610,
    height: 450,
    plain:false,
    layout: 'fit',
    items: ReportViewForm
});

//The Report edit form construct
var ReportEditForm = new Ext.FormPanel({
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
                    items: [tripField, topicsField, contactsField, actionItemsField]
                },
                {
                    columnWidth:0.5,
                    layout: 'form',
                    border:false,
                    items: [authorField, usefulnessField, issuesField, Ext.applyIf({id:'idFieldReport', name: 'id'}, idField)]
                }
            ]
        }
    ],
    buttons: [
        {
            text: 'Save and Close',
            handler: saveTheReport
        },
        {
            text: 'Cancel',
            handler: function() {
                // because of the global vars, we can only instantiate one window... so let's just hide it.
                ReportEditWindow.hide();
            }
        }
    ]
});

//The window in which to display the Report edit form
var ReportEditWindow = new Ext.Window({
    id: 'ReportEditWindow',
    title: 'Edit a Report',
    closable:false,
    width: 610,
    height: 515,
    plain:false,
    layout: 'fit',
    items: ReportEditForm
});
