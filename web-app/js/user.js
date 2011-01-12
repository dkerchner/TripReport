/*
 * Ext JS Library 2.0 Beta 1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://extjs.com/license
 */
var mode;
var UserViewWindow;
var UserViewForm;
var UserEditWindow;
var UserEditForm;


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
    {header: "Email", width: 120, dataIndex: 'email'},
    {header: "Company", width: 100, dataIndex: 'company'},
    {header: "Contracts", width: 115, dataIndex: 'contracts', sortable: true, renderer: function(value, cell) {
        return buildStringFromArray(value, 'name', ', ');
    }}
]);

usercm.defaultSortable = true;

// create the grid
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
            text: 'Submit',
            tooltip: 'Submit a user',
            iconCls:'add',                      // reference to our css
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

// display or bring forth the form
function displayUserCreateWindow() {
    mode = "Create";
    if (!UserEditWindow.isVisible()) {
        UserEditWindow.show();
        resetUserForm();
    } else {
        UserEditWindow.toFront();
    }
}

// display or bring forth the form
function displayUserViewWindow() {
    if (userGrid.selModel.getCount()) {
        if (!UserViewWindow.isVisible()) {
            var selections = userGrid.selModel.getSelections();
            userDS.on('load', userDSOnLoad);
            userDS.load({params: {'id': selections[0].json.id}});
            UserViewWindow.show();
        } else {
            UserViewWindow.toFront();
        }
    }
}

// display or bring forth the form
function displayUserEditWindow() {
    if (userGrid.selModel.getCount()) {
        mode = "Edit";
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

function modifyUserContextMenu() {
    displayUserEditWindow();
}

function deleteUserContextMenu() {
    confirmDeleteUsers();
}

userGrid.addListener('rowcontextmenu', onUserListingEditorGridContextMenu);
userGrid.addListener('rowdblclick', onUserListingEditorGridDoubleClick);


UserListingContextMenu = new Ext.menu.Menu({
    id: 'UserListingEditorGridContextMenu',
    items: [
        { text: 'Modify this User', handler: modifyUserContextMenu },
        { text: 'Attend this User', handler: confirmAttendUsers },
        { text: 'Delete this User', handler: deleteUserContextMenu }
    ]
});

// This was added in Tutorial 6
function confirmDeleteUsers() {
    if (userGrid.selModel.getCount() == 1) // only one president is selected here
    {
        Ext.MessageBox.confirm('Confirmation', 'You are about to delete a user. Continue?', deleteUsers);
    } else if (userGrid.selModel.getCount() > 1) {
        Ext.MessageBox.confirm('Confirmation', 'Delete those users?', deleteUsers);
    } else {
        Ext.MessageBox.alert('Uh oh...', 'You can\'t really delete something you haven\'t selected huh?');
    }
}

// This was added in Tutorial 6
function confirmAttendUsers() {
    if (userGrid.selModel.getCount() == 1) // only one president is selected here
    {
        Ext.MessageBox.confirm('Confirmation', 'You are about to request your attendance on a user. Continue?', attendUsers);
    } else if (userGrid.selModel.getCount() > 1) {
        Ext.MessageBox.confirm('Confirmation', 'Attend those users?', attendUsers);
    } else {
        Ext.MessageBox.alert('Uh oh...', 'You can\'t really attend something you haven\'t selected huh?');
    }
}

// This was added in Tutorial 6
function deleteUsers(btn) {
    if (btn == 'yes') {
        var selections = userGrid.selModel.getSelections();
        Ext.Ajax.request({
            waitMsg: 'Please Wait',
            url: 'http://localhost:8080/UserUserSPT/user/deleteJSON',
            params: {
                id:  selections[0].json.id
            },
            success:
            function(response) {
                var result = eval(response.responseText);
                switch (result) {
                    case 1:  // Success : simply reload
                        userListDS.reload();
                        break;
                    default:
                        Ext.MessageBox.alert('Fail', 'This user cannot be deleted.');
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


function onUserListingEditorGridContextMenu(grid, rowIndex, e) {
    e.stopEvent();
    var coords = e.getXY();
    UserListingContextMenu.rowRecord = grid.store.getAt(rowIndex);
    grid.selModel.selectRow(rowIndex);
    UserListingSelectedRow = rowIndex;
    UserListingContextMenu.showAt([coords[0], coords[1]]);
}

function onUserListingEditorGridDoubleClick(grid, rowIndex, e) {
    e.stopEvent();
    var coords = e.getXY();
    //alert(grid.store.getAt(rowIndex).json.id);
    displayUserViewWindow();
}

function userDSOnLoad() {
    var form = UserViewForm.getForm();

    form.setValues(userDS.getAt(0).data);
    form.findField('rolesDisplayField').setValue(buildStringFromArray(userDS.getAt(0).data.roles, "name", "<br/>"));
    form.findField('contractsDisplayFieldUser').setValue(buildStringFromArray(userDS.getAt(0).data.contracts, "name", "<br/>"));
}

function userDSEditOnLoad() {
    var form = UserEditForm.getForm();

    form.setValues(userDS.getAt(0).data);
    if (mode != "Create") {
        form.findField('rolesField').setValue(buildStringFromArray(userDS.getAt(0).data.roles, "id", ","));
        form.findField('contractsFieldUser').setValue(buildStringFromArray(userDS.getAt(0).data.contracts, "id", ","));
    }
}

userListDS.load({params: {start: 0, limit: 15}});
userGrid.on('afteredit', saveTheUser);

// This saves the president after a cell has been edited
function saveTheUser() {
    var form = UserEditForm.getForm();
    var params = form.getValues();
    params['task'] = mode.toString();
    if (isReportFormValid(form)) {
        Ext.Ajax.request({
            waitMsg: 'Please wait...',
            url: 'user/saveJSON',
            params: params/*{
                //version: oGrid_event.record.data.version,
                //form.getValues(),
                task: mode.toString(),
                id: form.findField('idField').getValue(),
                trip:      form.findField('tripField').getValue(),
                author:       form.findField('authorField').getValue(),
                issues: form.findField('issuesField').getValue(),
                topics:  form.findField('topicsField').getValue(),
                usefulness:  form.findField('usefulnessField').getValue(),
                actionItems: form.findField('actionItemsField').getValue(),
                contacts: form.findField('contactsField').getValue()
            }*/,
            success: function(response) {
                var result = eval(response.responseText);
                switch (result) {
                    case 1:
                        userListDS.commitChanges();
                        userListDS.reload();
                        handler: closeForm(UserEditWindow.hide(), UserEditForm.getForm())
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
function resetUserForm() {
    var form = UserEditForm.getForm();
    resetForm(form);
    /*form.findField('nameField').setValue('');
    form.findField('userNameField').setValue('');
    form.findField('passwordField1').setValue('');
    form.findField('passwordField2').setValue('');
    form.findField('companyField').setValue('');
    form.findField('emailField').setValue('');
    form.findField('contractsField').setValue('');
    form.findField('idField').setValue('');*/
}

// check if the form is valid
function isReportFormValid(form) {
    return(formIsValid(form) && (form.findField('passwordField1').getValue()==form.findField('passwordField2').getValue()));
}

function closeForm(window, form) {
    if (window) {
        window.hide();
        destroyFormFields(form.getForm());
    }
}

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
                    closeForm(UserViewWindow, UserViewForm);
            }
        }
    ]
});

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

UserEditForm = new Ext.FormPanel({
    labelAlign: 'top',
    bodyStyle:'padding:5px',
    width: 600,
    //store: userDS,
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
                    items: [companyField, emailField, Ext.applyIf({id:'contractsFieldUser'}, contractsField), idField]
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
                closeForm(UserEditWindow, UserEditForm);
            }
        }
    ]
});

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

