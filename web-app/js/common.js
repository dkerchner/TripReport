/**
 * Created by IntelliJ IDEA.
 * User: dpkerch
 * Date: 12/22/10
 * Time: 1:09 PM
 * To change this template use File | Settings | File Templates.
 */


// ExtJS common form elements
var nameField = {
    xtype: 'textfield',
    //ref: '../nameField',
    name: 'name',
    id: 'nameField',
    fieldLabel: 'Name',
    maxLength: 100,
    allowBlank: false,
    anchor : '95%',
    maskRe: /([a-zA-Z0-9\s]+)$/
};

var userNameField = {
    xtype: 'textfield',
    id: 'userNameField',
    name: 'userName',
    fieldLabel: 'User Name',
    maxLength: 10,
    allowBlank: false,
    anchor : '95%',
    maskRe: /([a-zA-Z0-9\s]+)$/
};

var passwordField1 = {
    xtype: 'textfield',
    id: 'passwordField1',
    name: 'password1',
    fieldLabel: 'Password',
    maxLength: 100,
    allowBlank: true,
    anchor : '95%',
    inputType: 'password'
};

var passwordField2 = {
    xtype: 'textfield',
    id: 'passwordField2',
    name: 'password2',
    fieldLabel: 'Confirm Password',
    maxLength: 100,
    allowBlank: true,
    anchor : '95%',
    inputType: 'password'
};

var emailField = {
    xtype: 'textfield',
    id: 'emailField',
    name: 'email',
    fieldLabel: 'Email',
    maxLength: 100,
    allowBlank: false,
    anchor : '95%'
};

var shortDescriptionField = {
    xtype: 'textfield',
    id: 'shortDescriptionField',
    name: 'shortDescription',
    fieldLabel: 'Short Description',
    maxLength: 100,
    allowBlank: false,
    anchor : '95%',
    maskRe: /([a-zA-Z0-9\s]+)$/
};

var purposeField = {
    xtype: 'textarea',
    id: 'purposeField',
    name: 'purpose',
    fieldLabel: 'Purpose',
    maxLength: 255,
    allowBlank: false,
    anchor : '95%',
    maskRe: /([a-zA-Z0-9\s]+)$/
};

var startDateField = {
    xtype: 'datefield',
    id:'startDateField',
    name: 'startDate',
    fieldLabel: 'Start Date',
    format : 'm/d/Y',
    allowBlank: false,
    anchor:'95%'
};

var endDateField = {
    xtype: 'datefield',
    id:'endDateField',
    name: 'endDate',
    fieldLabel: 'End Date',
    format : 'm/d/Y',
    allowBlank: false,
    anchor:'95%'
};

var eventsField = {
    xtype: 'multiselect',
    fieldLabel: 'Events<br />(Required)',
    id: 'eventsField',
    name: 'events',
    displayField: 'name',
    allowBlank: false,
    valueField: 'id',
    anchor:'95%',
    store: eventListDS,
    /*tbar:[{
        text: 'clear',
        handler: function(){

        }
    }], */
    ddReorder: true
};

var contractsField = {
    xtype: 'multiselect',
    fieldLabel: 'Contracts<br />(Required)',
    id: 'contractsField',
    name: 'contracts',
    displayField: 'name',
    allowBlank: false,
    valueField: 'id',
    anchor:'95%',
    store: contractListDS,
    /*tbar:[{
        text: 'clear',
        handler: function(){

        }
    }], */
    ddReorder: true
};

var locationsField = {
    xtype: 'multiselect',
    fieldLabel: 'Locations<br />(Required)',
    id: 'locationsField',
    name: 'locations',
    displayField: 'name',
    allowBlank: false,
    valueField: 'id',
    anchor:'95%',
    store: locationListDS,
    /*tbar:[{
        text: 'clear',
        handler: function(){

        }
    }], */
    ddReorder: true
};

var tripField = {
    xtype: 'combo',
    id: 'tripField',
    name: 'trip',
    fieldLabel: 'Trip',
    allowBlank: false,
    store: tripListDS,
    valueField: 'id',
    displayField: 'name',
    anchor : '95%'
};

var companyField = {
    xtype: 'combo',
    id: 'companyField',
    name: 'company',
    fieldLabel: 'Company',
    allowBlank: false,
    store: companyListDS,
    valueField: 'id',
    displayField: 'name',
    anchor : '95%'
};

var authorField = {
    xtype: 'combo',
    id: 'authorField',
    name: 'author',
    fieldLabel: 'Author',
    allowBlank: false,
    valueField: 'id',
    displayField: "name",
    store: userListDS,
    anchor : '95%'
};

var topicsField = {
    xtype: 'textarea',
    id: 'topicsField',
    name: 'topics',
    fieldLabel: 'Topics <br /> (comma separated)',
    maxLength: 2500,
    autoScroll: true,
    allowBlank: false,
    anchor : '95%',
    maskRe: /([a-zA-Z0-9\s]+)$/
};

var usefulnessField = {
    xtype: 'numberfield',
    id: 'usefulnessField',
    name: 'usefulness',
    fieldLabel: 'Usefulness <br /> (1 - 10)',
    minValue: 1,
    maxValue: 10,
    allowBlank: false,
    allowNegative: false,
    allowDecimals: false,
    anchor : '95%'
};

var issuesField = {
    xtype: 'textarea',
    id: 'issuesField',
    name: 'issues',
    fieldLabel: 'Issues',
    maxLength: 2500,
    autoScroll: true,
    allowBlank: false,
    anchor : '95%',
    maskRe: /([a-zA-Z0-9\s]+)$/
};

var contactsField = {
    xtype: 'multiselect',
    fieldLabel: 'Contacts<br />(Required)',
    id: 'contactsField',
    name: 'contacts',
    displayField: 'name',
    allowBlank: false,
    valueField: 'id',
    anchor:'95%',
    store: contactListDS,
    /*tbar:[{
        text: 'clear',
        handler: function(){

        }
    }], */
    ddReorder: true
};

var rolesField = {
    xtype: 'multiselect',
    fieldLabel: 'Roles<br />(Required)',
    id: 'rolesField',
    name: 'roles',
    displayField: 'name',
    allowBlank: false,
    valueField: 'id',
    anchor:'95%',
    store: roleListDS,
    /*tbar:[{
        text: 'clear',
        handler: function(){

        }
    }], */
    ddReorder: true
};


var actionItemsField = {
    xtype: 'multiselect',
    fieldLabel: 'Action Items<br />(Required)',
    id: 'actionItemsField',
    name: 'actionItems',
    displayField: 'name',
    allowBlank: false,
    valueField: 'id',
    anchor:'95%',
    store: actionItemListDS,
    /*tbar:[{
        text: 'clear',
        handler: function(){

        }
    }], */
    ddReorder: true
};

// Display fields

var nameDisplayField = {
    xtype: 'displayfield',
    name: 'name',
    id: 'nameDisplayField',
    ref: '../nameDisplayField',
    fieldLabel: '<b>Name</b>',
    anchor:'95%'
};

var userNameDisplayField = {
    xtype: 'displayfield',
    name: 'userName',
    id: 'userNameDisplayField',
    fieldLabel: '<b>User Name</b>',
    anchor:'95%'
};

var organizationDisplayField = {
    xtype: 'displayfield',
    id: 'organizationDisplayField',
    name: 'organization',
    fieldLabel: '<b>Organization</b>',
    anchor:'95%'
};

var emailDisplayField = {
    xtype: 'displayfield',
    name: 'email',
    id: 'emailDisplayField',
    fieldLabel: '<b>Email</b>',
    anchor:'95%'
};

var companyDisplayField = {
    xtype: 'displayfield',
    name: 'company',
    id: 'companyDisplayField',
    fieldLabel: '<b>Company</b>',
    anchor:'95%'
};

var attendeeDisplayField = {
    xtype: 'displayfield',
    id: 'attendeeDisplayField',
    fieldLabel: '<b>Attendee</b>',
    anchor:'95%'
};

var shortDescriptionDisplayField = {
    xtype: 'displayfield',
    id: 'shortDescriptionDisplayField',
    name: 'shortDescription',
    fieldLabel: '<b>Short Description</b>',
    anchor:'95%'
};

var purposeDisplayField = {
    xtype: 'displayfield',
    id: 'purposeDisplayField',
    name: 'purpose',
    fieldLabel: '<b>Purpose</b>',
    anchor:'95%'
};

var startDateDisplayField = {
    xtype: 'displayfield',
    id:'startDateDisplayField',
    name: 'startDate',
    fieldLabel: '<b>Start Date</b>',
    anchor:'95%'
};

var endDateDisplayField = {
    xtype: 'displayfield',
    id:'endDateDisplayField',
    name: 'endDate',
    fieldLabel: '<b>End Date</b>',
    anchor:'95%'
};

var eventsDisplayField = {
    xtype: 'displayfield',
    id: 'eventsDisplayField',
    ref: 'eventsDisplayField',
    name: 'events',
    fieldLabel: '<b>Events</b>',
    anchor:'95%'
};

var rolesDisplayField = {
    xtype: 'displayfield',
    id: 'rolesDisplayField',
    ref: 'rolesDisplayField',
    name: 'roles',
    fieldLabel: '<b>Roles</b>',
    anchor:'95%'
};


var locationsDisplayField = {
    xtype: 'displayfield',
    id: 'locationsDisplayField',
    name: 'locations',
    ref: 'locationsDisplayField',
    fieldLabel: '<b>Locations</b>',
    anchor:'95%'
};

var contractsDisplayField = {
    xtype: 'displayfield',
    name: 'contracts',
    id: 'contractsDisplayField',
    ref: 'contractsDisplayField',
    fieldLabel: '<b>Contracts</b>',
    anchor:'95%'
};

var tripDisplayField = {
    xtype: 'displayfield',
    id: 'tripDisplayField',
    ref: 'tripDisplayField',
    name: 'trip',
    fieldLabel: '<b>Trip</b>',
    anchor:'95%'
};

var authorDisplayField = {
    xtype: 'displayfield',
    id: 'authorDisplayField',
    name: 'author',
    ref: 'authorDisplayField',
    fieldLabel: '<b>Author</b>',
    anchor:'95%'
};

var usefulnessDisplayField = {
    xtype: 'displayfield',
    id: 'usefulnessDisplayField',
    name: 'usefulness',
    fieldLabel: '<b>Usefulness</b>',
    anchor:'95%'
};

var issuesDisplayField = {
    xtype: 'displayfield',
    id: 'issuesDisplayField',
    name: 'issues',
    fieldLabel: '<b>Issues</b>',
    anchor:'95%'
};

var topicsDisplayField = {
    xtype: 'displayfield',
    id: 'topicsDisplayField',
    name: 'topics',
    fieldLabel: '<b>Topics</b>',
    anchor:'95%'
};

var contactsDisplayField = {
    xtype: 'displayfield',
    id: 'contactsDisplayField',
    name: 'contacts',
    ref: 'contactsDisplayField',
    fieldLabel: '<b>Contacts</b>',
    anchor:'95%'
};

var actionItemsDisplayField = {
    xtype: 'displayfield',
    id: 'actionItemsDisplayField',
    name: 'actionItems',
    ref: 'actionItemsDisplayField',
    fieldLabel: '<b>Action Items</b>',
    anchor:'95%'
};

var idField = {
    xtype: "hidden",
    id: 'idField',
    name: 'id',
    anchor:'95%'
};

var idField2 = {
    xtype: "hidden",
    id: 'idField2',
    name: 'id2',
    anchor:'95%'
};



/*eventField = new Ext.form.ComboBox({
 id:'EventField',
 fieldLabel: 'Event',
 store: eventds,
 mode: 'local',
 displayField: 'name',
 allowBlank: false,
 valueField: 'id',
 anchor:'95%',
 triggerAction: 'all'
}; */

var replace = function(id, t) {
  var tabPanel = Ext.getCmp('center-tab-panel')
  var tab = tabPanel.items.find(function(i){return i.title === t;});
  if(!tab) {
      var item = Ext.getCmp(id)
      tab = tabPanel.add({
           title:t
          ,layout:'fit',
          items: [item],
          closable: true
      });
  }
  tabPanel.setActiveTab(tab);
    //tab.dataStore.reload();
}

function buildStringFromArray(array, column, separator) {
    arrayString = "";
    for(var arr = array, len = arr.length, i = 0; i < len; i++){
        arrayString += array[i][column] + separator;
    }

    return arrayString.substr(0,arrayString.lastIndexOf(separator));
}

function resetForm(form) {
    form.items.each(function(field){
        field.setValue('');
    });
}

function formIsValid(form) {
    form.items.each(function(field){
        if (!field.isValid()) {
            return false;
        }
    });
    return true;
}



var admin_user = false;