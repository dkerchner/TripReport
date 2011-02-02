/*
 * Ext JS Library 2.0 Beta 1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://extjs.com/license
 */
var contactMode;
var ContactViewWindow;
var ContactViewForm;
var ContactEditWindow;
var ContactEditForm;


var contactcm = new Ext.grid.ColumnModel([
    {header: 'version', readOnly: true, dataIndex: 'version', width: 40, renderer: function(value, cell) {
        cell.css = "readonlycell";
        return value;
    }, hidden: true},
    {header: '#', readOnly: true, dataIndex: 'id', width: 40, renderer: function(value, cell) {
        cell.css = "readonlycell";
        return value;
    }, hidden: true},
    {header: "First Name", width: 100, dataIndex: 'firstName', sortable: true},
    {header: "Last Name", width: 100, dataIndex: 'lastName', sortable: true},
    {header: "Email", width: 200, dataIndex: 'email'},
    {header: "Phone Number", width: 200, dataIndex: 'phoneNumber'},
    {header: "Organization", width: 100, dataIndex: 'organization', sortable: true, renderer: function(value, cell) {
        return getValueFromObject(value, 'name');
    }},
]);

contactcm.defaultSortable = true;

// create the grid
var contactGrid = new Ext.grid.GridPanel({
    //title: 'Contacts',
    id: 'contact-grid',
    ds: contactListDS,
    cm: contactcm,
    //renderTo: 'center-div',
    //width:700,
    //height:350,
    enableColLock:false,
    //clicksToEdit:1,
    selModel: new Ext.grid.RowSelectionModel({singleSelect:true}),
    bbar: new Ext.PagingToolbar({
        pageSize: 15,
        store: contactListDS,
        displayInfo: true
    }),
    tbar: [
        {
            text: 'View',
            tooltip: 'View a contact',
            iconCls:'search',                      // reference to our css
            handler: displayContactViewWindow
        },
        '-',
        {
            text: 'Submit',
            tooltip: 'Submit a contact',
            iconCls:'add',                      // reference to our css
            handler: displayContactCreateWindow
        },
        '-',
        {
            text: 'Edit',
            tooltip: 'Edit a contact',
            iconCls:'edit',                      // reference to our css
            handler: displayContactEditWindow
        },
        '-',
        {
            text: 'Delete',
            tooltip: 'Delete the selected contact.',
            handler: confirmDeleteContacts,   // Confirm before deleting
            iconCls:'remove'
        }
    ]
});

// display or bring forth the form
function displayContactCreateWindow() {
    contactMode = "Create";
    if (!ContactEditWindow.isVisible()) {
        ContactEditWindow.show();
        var form = ContactEditForm.getForm();
        resetContactForm();
        form.findField('reportIdContact').setValue(ReportEditForm.getForm().findField('idFieldReport').getValue());
    } else {
        ContactEditWindow.toFront();
    }
}

// display or bring forth the form
function displayContactViewWindow() {
    if (contactGrid.selModel.getCount()) {
        if (!ContactViewWindow.isVisible()) {
            var selections = contactGrid.selModel.getSelections();
            contactDS.on('load', contactDSOnLoad);
            contactDS.load({params: {'id': selections[0].json.id}});
            ContactViewWindow.show();
        } else {
            ContactViewWindow.toFront();
        }
    }
}

// display or bring forth the form
function displayContactEditWindow() {
    if (contactGrid.selModel.getCount()) {
        contactMode = "Edit";
        var selections = contactGrid.selModel.getSelections();
        contactDS.on('load', contactDSEditOnLoad);
        contactDS.load({params: {'id': selections[0].json.id}});

        if (!ContactEditWindow.isVisible()) {
            ContactEditWindow.show();
            //resetContactForm();
        } else {
            ContactEditWindow.toFront();
        }

    }
}

function modifyContactContextMenu() {
    displayContactEditWindow();
}

function deleteContactContextMenu() {
    confirmDeleteContacts();
}

contactGrid.addListener('rowcontextmenu', onContactListingEditorGridContextMenu);
contactGrid.addListener('rowdblclick', onContactListingEditorGridDoubleClick);


ContactListingContextMenu = new Ext.menu.Menu({
    id: 'ContactListingEditorGridContextMenu',
    items: [
        { text: 'Modify this Contact', handler: modifyContactContextMenu },
        { text: 'Attend this Contact', handler: confirmAttendContacts },
        { text: 'Delete this Contact', handler: deleteContactContextMenu }
    ]
});

// This was added in Tutorial 6
function confirmDeleteContacts() {
    if (contactGrid.selModel.getCount() == 1) // only one president is selected here
    {
        Ext.MessageBox.confirm('Confirmation', 'You are about to delete a contact. Continue?', deleteContacts);
    } else if (contactGrid.selModel.getCount() > 1) {
        Ext.MessageBox.confirm('Confirmation', 'Delete those contacts?', deleteContacts);
    } else {
        Ext.MessageBox.alert('Uh oh...', 'You can\'t really delete something you haven\'t selected huh?');
    }
}

// This was added in Tutorial 6
function confirmAttendContacts() {
    if (contactGrid.selModel.getCount() == 1) // only one president is selected here
    {
        Ext.MessageBox.confirm('Confirmation', 'You are about to request your attendance on a contact. Continue?', attendContacts);
    } else if (contactGrid.selModel.getCount() > 1) {
        Ext.MessageBox.confirm('Confirmation', 'Attend those contacts?', attendContacts);
    } else {
        Ext.MessageBox.alert('Uh oh...', 'You can\'t really attend something you haven\'t selected huh?');
    }
}

// This was added in Tutorial 6
function deleteContacts(btn) {
    if (btn == 'yes') {
        var selections = contactGrid.selModel.getSelections();
        Ext.Ajax.request({
            waitMsg: 'Please Wait',
            url: 'contact/deleteJSON',
            params: {
                id:  selections[0].json.id
            },
            success:
            function(response) {
                var result = eval(response.responseText);
                switch (result) {
                    case 1:  // Success : simply reload
                        contactListDS.reload();
                        break;
                    default:
                        Ext.MessageBox.alert('Fail', 'This contact cannot be deleted.');
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


function onContactListingEditorGridContextMenu(grid, rowIndex, e) {
    e.stopEvent();
    var coords = e.getXY();
    ContactListingContextMenu.rowRecord = grid.store.getAt(rowIndex);
    grid.selModel.selectRow(rowIndex);
    ContactListingSelectedRow = rowIndex;
    ContactListingContextMenu.showAt([coords[0], coords[1]]);
}

function onContactListingEditorGridDoubleClick(grid, rowIndex, e) {
    e.stopEvent();
    var coords = e.getXY();
    //alert(grid.store.getAt(rowIndex).json.id);
    displayContactViewWindow();
}

function contactDSOnLoad() {
    var form = ContactViewForm.getForm();

    form.setValues(contactDS.getAt(0).data);
}

function contactDSEditOnLoad() {
    var form = ContactEditForm.getForm();

    form.setValues(contactDS.getAt(0).data);
    if (contactMode != "Create") {
    }
}

contactListDS.load({params: {start: 0, limit: 15}});
contactGrid.on('afteredit', saveTheContact);

// This saves the president after a cell has been edited
function saveTheContact() {
    var form = ContactEditForm.getForm();
    var params = form.getValues();
    params['task'] = contactMode.toString();
    if (isReportFormValid(form)) {
        Ext.Ajax.request({
            waitMsg: 'Please wait...',
            url: 'contact/saveJSON',
            params: params,
            success: function ( result, request ) {
                var jsonData = Ext.util.JSON.decode(result.responseText);
                var resultMessage = jsonData.data;                
                switch (jsonData.success) {
                case true:
                	contactListDS.commitChanges();
                	contactListDS.reload();
                	ContactEditWindow.hide();
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

// reset the Form before opening it
function resetContactForm() {
    var form = ContactEditForm.getForm();
    resetForm(form);
}

// check if the form is valid
function isReportFormValid(form) {
    return(formIsValid(form));
}

ContactViewForm = new Ext.FormPanel({
    labelAlign: 'top',
    bodyStyle:'padding:5px',
    width: 600,
    store: contactDS,
    items: [
        {
            layout:'column',
            border:false,
            items:[
                {
                    columnWidth:0.5,
                    layout: 'form',
                    border:false,
                    items: [Ext.applyIf({id:'firstNameDisplayFieldContact', name: 'firstName'}, nameDisplayField), Ext.applyIf({id:'lastNameDisplayFieldContact', name:'lastName'}, nameDisplayField), Ext.applyIf({id:'emailDisplayFieldContact'}, emailDisplayField), Ext.applyIf({id:'phoneNumberDisplayFieldContact'}, phoneNumberDisplayField)]
                },
                {
                    columnWidth:0.5,
                    layout: 'form',
                    border:false,
                    items: [Ext.applyIf({id:'organizationDisplayFieldContact'}, organizationDisplayField), Ext.applyIf({id:'notesDisplayFieldContact', name: 'notes'}, descriptionDisplayField)]
                }
            ]
        }
    ],
    buttons: [
        /*{
         text: 'Save and Close',
         handler: createTheContact
         },*/
        {
            text: 'Close',
            handler: function() {
                ContactViewWindow.hide();
            }
        }
    ]
});

ContactViewWindow = new Ext.Window({
    id: 'ContactViewWindow',
    title: 'Contact Details',
    closable:true,
    width: 610,
    height: 450,
    plain:false,
    layout: 'fit',
    items: ContactViewForm
});

ContactEditForm = new Ext.FormPanel({
    labelAlign: 'top',
    bodyStyle:'padding:5px',
    width: 600,
    //store: contactDS,
    items: [
        {
            layout:'column',
            border:false,
            items:[
                {
                    columnWidth:0.5,
                    layout: 'form',
                    border:false,
                    items: [Ext.applyIf({id:'firstNameFieldContact', name:'firstName'}, nameField), Ext.applyIf({id:'lastNameFieldContact', name:'lastName'}, nameField), Ext.applyIf({id:'emailFieldContact'}, emailField), Ext.applyIf({id:'phoneNumberFieldContact'}, phoneNumberField)]
                },
                {
                    columnWidth:0.5,
                    layout: 'form',
                    border:false,
                    items: [Ext.applyIf({id:'organizationFieldContact'}, organizationField), Ext.applyIf({id:'notesFieldContact', name: 'notes'}, descriptionField), Ext.applyIf({id:'reportIdContact', name:'report'}, idField), Ext.applyIf({id:'idContact', name:'id'}, idField2)]
                }
            ]
        }
    ],
    buttons: [
        {
            text: 'Save and Close',
            handler: saveTheContact
        },
        {
            text: 'Cancel',
            // because of the global vars, we can only instantiate one window... so let's just hide it.

            handler: function() {
                ContactEditWindow.hide();
            }
        }
    ]
});

ContactEditWindow = new Ext.Window({
    id: 'ContactEditWindow',
    title: 'Edit a Contact',
    closable:false,
    width: 610,
    height: 450,
    plain:false,
    layout: 'fit',
    items: ContactEditForm
});

