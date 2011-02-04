/*
 * Ext JS Library 2.0 Beta 1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://extjs.com/license
 */
var userMode;
var UserViewWindow;
var UserViewForm;
var UserEditWindow;
var UserEditForm;

/* All components related to the management of User information. */

// The column model for the DataGrid
var usercm = new Ext.grid.ColumnModel([
    {header: 'version', readOnly: true, dataIndex: 'version', width: 40, renderer: function(value, cell) {
        cell.css = "readonlycell";
        return value;
    }, hidden: true},
    {header: '#', readOnly: true, dataIndex: 'id', width: 40, renderer: function(value, cell) {
        cell.css = "readonlycell";
        return value;
    }, hidden: true},
    {header: "Name", width: 100, dataIndex: 'fullName', sortable: true},
    {header: "Email", width: 200, dataIndex: 'email'},
    {header: "Company", width: 100, dataIndex: 'company', sortable: true, renderer: function(value, cell) {
        return getValueFromObject(value, 'name');
    }},
    {header: "Contracts", width: 115, dataIndex: 'contracts', sortable: true, renderer: function(value, cell) {
        return buildStringFromArray(value, 'name', ', ');
    }},
    {header: "Roles", width: 115, dataIndex: 'roles', sortable: true, renderer: function(value, cell) {
        return buildStringFromArray(value, 'name', ', ');
    }}
]);
usercm.defaultSortable = true;

// The data grid
var userGrid = new Ext.grid.GridPanel({
    //title: 'Users',
    id: 'user-grid',
    ds: userListDS,
    cm: usercm,
    //renderTo: 'center-div',
    //width:700,
    //height:350,
    enableColLock:false,
    //clicksToEdit:1,
    selModel: new Ext.grid.RowSelectionModel({singleSelect:true}),
    bbar: new Ext.PagingToolbar({
        pageSize: 15,
        store: userListDS,
        displayInfo: true
    }),
    tbar: [
        {
            text: 'View',
            tooltip: 'View a user',
            iconCls:'search',                      // reference to our css
            handler: displayUserViewWindow
        },
        '-',
        {
            text: 'Add',
            tooltip: 'Add a user',
            iconCls:'add-user16',                      // reference to our css
            handler: displayUserCreateWindow
        },
        '-',
        {
            text: 'Edit',
            tooltip: 'Edit a user',
            iconCls:'edit',                      // reference to our css
            handler: displayUserEditWindow
        },
        '-',
        {
            text: 'Delete',
            tooltip: 'Delete the selected user.',
            handler: confirmDeleteUsers,   // Confirm before deleting
            iconCls:'remove'
        }
    ]
});

// Display the creation form
function displayUserCreateWindow() {
    userMode = "Create";
    if (!UserEditWindow.isVisible()) {
        UserEditWindow.show();
        resetUserForm();
    } else {
        UserEditWindow.toFront();
    }
}

// Display the view form
function displayUserViewWindow() {
    if (userGrid.selModel.getCount()) {
        if (!UserViewWindow.isVisible()) {
        	// Get the selected rows
            var selections = userGrid.selModel.getSelections();
            // Then filter the data source with the selected ids
            userDS.on('load', userDSOnLoad);
            userDS.load({params: {'id': selections[0].json.id}});
            UserViewWindow.show();
        } else {
            UserViewWindow.toFront();
        }
    }
}

// Display the edit form
function displayUserEditWindow() {
    if (userGrid.selModel.getCount()) {
        userMode = "Edit";
        var selections = userGrid.selModel.getSelections();
        userDS.on('load', userDSEditOnLoad);
        userDS.load({params: {'id': selections[0].json.id}});

        if (!UserEditWindow.isVisible()) {
            UserEditWindow.show();
            //resetUserForm();
        } else {
            UserEditWindow.toFront();
        }

    }
}

// The function called by the modify context menu
function modifyUserContextMenu() {
    displayUserEditWindow();
}

// The function called by the delete context menu
function deleteUserContextMenu() {
    confirmDeleteUsers();
}

// DataGrid event listeners
userGrid.addListener('rowcontextmenu', onUserListingEditorGridContextMenu);
userGrid.addListener('rowdblclick', onUserListingEditorGridDoubleClick);

// The context menu construct
UserListingContextMenu = new Ext.menu.Menu({
    id: 'UserListingEditorGridContextMenu',
    items: [
        { text: 'Modify this User', handler: modifyUserContextMenu },
        { text: 'Delete this User', handler: deleteUserContextMenu }
    ]
});

// Confirm deletion, then call delete
function confirmDeleteUsers() {
    if (userGrid.selModel.getCount() == 1)
    {
        Ext.MessageBox.confirm('Confirmation', 'You are about to delete a user. Continue?', deleteUsers);
    } else if (userGrid.selModel.getCount() > 1) {
        Ext.MessageBox.confirm('Confirmation', 'Delete those users?', deleteUsers);
    } else {
        Ext.MessageBox.alert('Uh oh...', 'You can\'t really delete something you haven\'t selected huh?');
    }
}

// Creates an Ajax request to delete the user
function deleteUsers(btn) {
    if (btn == 'yes') {
        var selections = userGrid.selModel.getSelections();
        Ext.Ajax.request({
            waitMsg: 'Please Wait',
            url: 'user/deleteJSON',
            params: {
                id:  selections[0].json.id
            },
            success: function ( result, request ) {
                var jsonData = Ext.util.JSON.decode(result.responseText);
                var resultMessage = jsonData.data;                
                switch (jsonData.success) {
                case true:
                    userListDS.commitChanges();
                    userListDS.reload();
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

// Called by the context menu right click event
function onUserListingEditorGridContextMenu(grid, rowIndex, e) {
    e.stopEvent();
    var coords = e.getXY();
    UserListingContextMenu.rowRecord = grid.store.getAt(rowIndex);
    grid.selModel.selectRow(rowIndex);
    UserListingSelectedRow = rowIndex;
    UserListingContextMenu.showAt([coords[0], coords[1]]);
}

// Called by the DataGrid double click event
function onUserListingEditorGridDoubleClick(grid, rowIndex, e) {
    e.stopEvent();
    var coords = e.getXY();
    displayUserViewWindow();
}

// Called when the userDS is loaded for the view form
function userDSOnLoad() {
    var form = UserViewForm.getForm();
    var values = userDS.getAt(0).data;
    form.setValues(values);
    form.findField('rolesDisplayField').setValue(buildStringFromArray(values.roles, "name", "<br/>"));
    form.findField('contractsDisplayFieldUser').setValue(buildStringFromArray(values.contracts, "name", "<br/>"));
}

// Called when the userDS is loaded for the edit form
function userDSEditOnLoad() {
    var form = UserEditForm.getForm();
    var values = userDS.getAt(0).data;
    form.setValues(values);
    if (userMode != "Create") {
        form.findField('rolesField').setValue(buildStringFromArray(values.roles, "id", ","));
        form.findField('contractsFieldUser').setValue(buildStringFromArray(values.contracts, "id", ","));
    }
}

// Initial load of userListDS *Important*
userListDS.load({params: {start: 0, limit: 15}});
//userGrid.on('afteredit', saveTheUser);

// This saves the user using an Ajax request
function saveTheUser() {
    var form = UserEditForm.getForm();
    var params = form.getValues();
    params['task'] = userMode.toString();
    if (isReportFormValid(form)) {
        Ext.Ajax.request({
            waitMsg: 'Please wait...',
            url: 'user/saveJSON',
            params: params,
            success: function ( result, request ) {
                var jsonData = Ext.util.JSON.decode(result.responseText);
                var resultMessage = jsonData.data;                
                switch (jsonData.success) {
                case true:
                    userListDS.commitChanges();
                    userListDS.reload();
                    UserEditWindow.hide();
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

// Reset the Form before opening it
function resetUserForm() {
    var form = UserEditForm.getForm();
    resetForm(form);
}

// Check if the form is valid
function isReportFormValid(form) {
    return(formIsValid(form) && (form.findField('passwordField1').getValue()==form.findField('passwordField2').getValue()));
}

// The User view form construct
UserViewForm = new Ext.FormPanel({
    labelAlign: 'top',
    bodyStyle:'padding:5px',
    width: 600,
    store: userDS,
    items: [
        {
            layout:'column',
            border:false,
            items:[
                {
                    columnWidth:0.5,
                    layout: 'form',
                    border:false,
                    items: [nameDisplayField, userNameDisplayField, rolesDisplayField]
                },
                {
                    columnWidth:0.5,
                    layout: 'form',
                    border:false,
                    items: [companyDisplayField, emailDisplayField, Ext.applyIf({id:'contractsDisplayFieldUser'}, contractsDisplayField)]
                }
            ]
        }
    ],
    buttons: [
        /*{
         text: 'Save and Close',
         handler: createTheUser
         },*/
        {
            text: 'Close',
            handler: function() {
                UserViewWindow.hide();
            }
        }
    ]
});

// The window in which to display the User view form
UserViewWindow = new Ext.Window({
    id: 'UserViewWindow',
    title: 'User Details',
    closable:true,
    width: 610,
    height: 450,
    plain:false,
    layout: 'fit',
    items: UserViewForm
});

// The User edit form construct
UserEditForm = new Ext.FormPanel({
    labelAlign: 'top',
    bodyStyle:'padding:5px',
    width: 600,
    store: userDS,
    items: [
        {
            layout:'column',
            border:false,
            items:[
                {
                    columnWidth:0.5,
                    layout: 'form',
                    border:false,
                    items: [nameField, userNameField, passwordField1, passwordField2, rolesField]
                },
                {
                    columnWidth:0.5,
                    layout: 'form',
                    border:false,
                    items: [Ext.applyIf({id:'companyFieldUser', name: 'company'}, companyField), emailField, Ext.applyIf({id:'contractsFieldUser'}, contractsField), Ext.applyIf({id:'idFieldContract'}, idField)]
                }
            ]
        }
    ],
    buttons: [
        {
            text: 'Save and Close',
            handler: saveTheUser
        },
        {
            text: 'Cancel',
            // because of the global vars, we can only instantiate one window... so let's just hide it.

            handler: function() {
                UserEditWindow.hide();
            }
        }
    ]
});

// The window in which to display the User edit form
UserEditWindow = new Ext.Window({
    id: 'UserEditWindow',
    title: 'Edit a User',
    closable:false,
    width: 610,
    height: 450,
    plain:false,
    layout: 'fit',
    items: UserEditForm
});

