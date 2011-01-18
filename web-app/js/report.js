/*
 * Ext JS Library 2.0 Beta 1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://extjs.com/license
 */
var reportMode;


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

// create the grid
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

// display or bring forth the form
function displayFormWindow() {
    reportMode = "Create";
    if (!ReportEditWindow.isVisible()) {
        ReportEditWindow.show();
        resetForm(ReportEditForm.getForm());
    } else {
        ReportEditWindow.toFront();
    }
}

// display or bring forth the form
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

// display or bring forth the form
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

function modifyReportContextMenu() {
    displayReportEditWindow();
}

function deleteReportContextMenu() {
    confirmDeleteReports();
}

reportGrid.addListener('rowcontextmenu', onReportListingEditorGridContextMenu);
reportGrid.addListener('rowdblclick', onReportListingEditorGridDoubleClick);


ReportListingContextMenu = new Ext.menu.Menu({
    id: 'ReportListingEditorGridContextMenu',
    items: [
        { text: 'Modify this Report', handler: modifyReportContextMenu },
        { text: 'Attend this Report', handler: confirmAttendReports },
        { text: 'Delete this Report', handler: deleteReportContextMenu }
    ]
});

// This was added in Tutorial 6
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

// This was added in Tutorial 6
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

// This was added in Tutorial 6
function deleteReports(btn) {
    if (btn == 'yes') {
        var selections = reportGrid.selModel.getSelections();
        Ext.Ajax.request({
            waitMsg: 'Please Wait',
            url: 'report/deleteJSON',
            params: {
                id:  selections[0].json.id
            },
            success:
            function(response) {
                var result = eval(response.responseText);
                switch (result) {
                    case 1:  // Success : simply reload
                        reportListDS.reload();
                        break;
                    default:
                        Ext.MessageBox.alert('Fail', 'This report cannot be deleted.');
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

function onReportListingEditorGridContextMenu(grid, rowIndex, e) {
    e.stopEvent();
    var coords = e.getXY();
    ReportListingContextMenu.rowRecord = grid.store.getAt(rowIndex);
    grid.selModel.selectRow(rowIndex);
    ReportListingSelectedRow = rowIndex;
    ReportListingContextMenu.showAt([coords[0], coords[1]]);
}

function onReportListingEditorGridDoubleClick(grid, rowIndex, e) {
    e.stopEvent();
    var coords = e.getXY();
    //alert(grid.store.getAt(rowIndex).json.id);
    displayReportViewWindow();
}

function reportDSOnLoad() {
    var form = ReportViewForm.getForm();
    form.setValues(reportDS.getAt(0).data);

    form.findField('contactsDisplayField').setValue(buildStringFromArray(reportDS.getAt(0).data.contacts, "name", "<br/>"));
    form.findField('actionItemsDisplayField').setValue(buildStringFromArray(reportDS.getAt(0).data.actionItems, "name", "<br/>"));
}

function reportDSEditOnLoad() {
    var form = ReportEditForm.getForm();
    if (reportMode != "Create") {
        form.setValues(reportDS.getAt(0).data);
        contactListDS.load({params: {'report': reportDS.getAt(0).data.id}});
        actionItemListDS.load({params: {'report': reportDS.getAt(0).data.id}});
        form.findField('contactsField').setValue(buildStringFromArray(reportDS.getAt(0).data.contacts, "id", ','));
        form.findField('actionItemsField').setValue(buildStringFromArray(reportDS.getAt(0).data.actionItems, "id", ','));
    } else {
    	form.findField('contactsField').disable();
    	form.findField('actionItemsField').disable();
    }
}

reportListDS.load({params: {start: 0, limit: 15}});
reportGrid.on('afteredit', saveTheReport);

// This saves the president after a cell has been edited
function saveTheReport() {
    var form = ReportEditForm.getForm();
    var params = form.getValues();
    params['task'] = reportMode.toString();
    if (isReportFormValid(form)) {
        Ext.Ajax.request({
            waitMsg: 'Please wait...',
            url: 'report/saveJSON',
            params: params,
            success: function(response) {
                var result = eval(response.responseText);
                switch (result) {
                    case 1:
                        reportListDS.commitChanges();
                        reportListDS.reload();
                        ReportEditWindow.hide();
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
function isReportFormValid(form) {
    return(formIsValid(form));
}

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
