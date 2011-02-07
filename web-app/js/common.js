// ExtJS common form elements

// Data entry form fields for the create and edit forms
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
    allowBlank: true,
    anchor : '95%'
};

var phoneNumberField = {
    xtype: 'textfield',
    id: 'phoneNumberField',
    name: 'phoneNumber',
    fieldLabel: 'Phone Number',
    maxLength: 100,
    allowBlank: true,
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

var descriptionField = {
    xtype: 'textarea',
    id: 'descriptionField',
    name: 'description',
    fieldLabel: 'Description',
    maxLength: 255,
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

var dueDateField = {
    xtype: 'datefield',
    id:'dueDateField',
    name: 'dueDate',
    fieldLabel: 'Due Date',
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
    //id: 'contractsField',
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
    anchor : '95%',
    store: tripListDS,
    fieldLabel: 'Trip',
    displayField:'name',
    valueField: 'id',
    hiddenName: 'trip',
    allowBlank: false,
    pageSize: 5,
    minChars: 2,
    submitValue: false,
    mode: 'remote',
    triggerAction: 'all',
    emptyText: 'Select a trip...',
    selectOnFocus: false
};

var companyField = {
    xtype: 'combo',
    id: 'companyField',
    anchor : '95%',
    store: companyListDS,
    fieldLabel: 'Company',
    displayField:'name',
    valueField: 'id',
    hiddenName: 'company',
    allowBlank: false,
    pageSize: 5,
    minChars: 2,
    submitValue: false,
    mode: 'remote',
    triggerAction: 'all',
    emptyText: 'Select a company...',
    selectOnFocus: false
};

var authorField = {
    xtype: 'combo',
    id: 'authorField',
    anchor : '95%',
    store: userListDS,
    fieldLabel: 'Author',
    displayField:'name',
    valueField: 'id',
    hiddenName: 'author',
    allowBlank: false,
    pageSize: 5,
    minChars: 2,
    submitValue: false,
    mode: 'remote',
    triggerAction: 'all',
    emptyText: 'Select an author...',
    selectOnFocus: false
};

var organizationField = {
    xtype: 'combo',
    id: 'organizationField',
    anchor : '95%',
    store: organizationListDS,
    fieldLabel: 'Organization',
    displayField:'name',
    valueField: 'id',
    hiddenName: 'organization',
    allowBlank: false,
    pageSize: 5,
    minChars: 2,
    submitValue: false,
    mode: 'remote',
    triggerAction: 'all',
    emptyText: 'Select an organization...',
    selectOnFocus: false
};

var locationField = {
    xtype: 'combo',
    id: 'locationField',
    anchor : '95%',
    store: locationListDS,
    fieldLabel: 'Location',
    displayField:'name',
    valueField: 'id',
    hiddenName: 'location',
    allowBlank: false,
    pageSize: 5,
    minChars: 2,
    submitValue: false,
    mode: 'remote',
    triggerAction: 'all',
    emptyText: 'Select a location...',
    selectOnFocus: false
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
    fieldLabel: 'Contacts',
    id: 'contactsField',
    name: 'contacts',
    displayField: 'name',
    allowBlank: true,
    valueField: 'id',
    anchor:'95%',
    store: contactListDS,
    tbar:[{
        text: '',
        iconCls:'add',                      // reference to our css
        handler: function(){
        	displayContactCreateWindow() // Calls create in contact.js
        }
    	}, {
        	text: '',
            iconCls:'remove',                      // reference to our css
        	handler: function(){
        		deleteContactsFromReport() // Calls delete in contact.js
        	}
        }
        
    ], 
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
    fieldLabel: 'Action Items',
    id: 'actionItemsField',
    name: 'actionItems',
    displayField: 'name',
    allowBlank: true,
    valueField: 'id',
    anchor:'95%',
    store: actionItemListDS,
    tbar:[{
        text: '',
        iconCls:'add',                      // reference to our css
        handler: function(){
        	displayActionItemCreateWindow() // Calls create in actionItem.js
        }
    	}, {
        	text: '',
            iconCls:'remove',                      // reference to our css
        	handler: function(){
        		deleteActionItemsFromReport() // Calls delete in actionItem.js
        	}
        }
        
    ], 
    ddReorder: true
};

// Display form fields for the view forms
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
    name: 'organizationName',
    fieldLabel: '<b>Organization</b>',
    anchor:'95%'
};

var locationDisplayField = {
    xtype: 'displayfield',
    id: 'locationDisplayField',
    name: 'location',
    fieldLabel: '<b>Location</b>',
    anchor:'95%'
};


var emailDisplayField = {
    xtype: 'displayfield',
    name: 'email',
    id: 'emailDisplayField',
    fieldLabel: '<b>Email</b>',
    anchor:'95%'
};

var phoneNumberDisplayField = {
    xtype: 'displayfield',
    name: 'phoneNumber',
    id: 'phoneNumberDisplayField',
    fieldLabel: '<b>Phone Number</b>',
    anchor:'95%'
};

var companyDisplayField = {
    xtype: 'displayfield',
    name: 'companyName',
    id: 'companyDisplayField',
    fieldLabel: '<b>Company</b>',
    anchor:'95%'
};

var attendeeDisplayField = {
    xtype: 'displayfield',
    name: 'attendee',
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

var descriptionDisplayField = {
    xtype: 'displayfield',
    id: 'descriptionDisplayField',
    name: 'description',
    fieldLabel: '<b>Description</b>',
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
    format : 'm/d/Y',
    fieldLabel: '<b>Start Date</b>',
    anchor:'95%'
};

var endDateDisplayField = {
    xtype: 'displayfield',
    id:'endDateDisplayField',
    name: 'endDate',
    format : 'm/d/Y',
    fieldLabel: '<b>End Date</b>',
    anchor:'95%'
};

var dueDateDisplayField = {
    xtype: 'displayfield',
    id:'dueDateDisplayField',
    name: 'dueDate',
    format : 'm/d/Y',
    fieldLabel: '<b>Due Date</b>',
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
    //id: 'contractsDisplayField',
    fieldLabel: '<b>Contracts</b>',
    anchor:'95%'
};

var tripDisplayField = {
    xtype: 'displayfield',
    id: 'tripDisplayField',
    ref: 'tripDisplayField',
    name: 'tripName',
    fieldLabel: '<b>Trip</b>',
    anchor:'95%'
};

var authorDisplayField = {
    xtype: 'displayfield',
    id: 'authorDisplayField',
    name: 'authorName',
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

var tripsDisplayField = {
    xtype: 'displayfield',
    id: 'tripsDisplayField',
    name: 'trips',
    ref: 'tripsDisplayField',
    fieldLabel: '<b>Trips</b>',
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


/* Common functions used throughout the application */

// Switches out Tab Panels in the center panel
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

// Takes an array object and builds a string with the provided separator
function buildStringFromArray(array, column, separator) {
    arrayString = "";
    for(var arr = array, len = arr.length, i = 0; i < len; i++){
        arrayString += array[i][column] + separator;
    }

    return arrayString.substr(0,arrayString.lastIndexOf(separator));
}

// Used to get the given value from a JSON object
function getValueFromObject(object, column) {
    return object[column];
}

// Programatically resets all form fields of the given form
function resetForm(form) {
    form.items.each(function(field){
        field.setValue('');
    });
}

// Programatically validates each form field of the given form
function formIsValid(form) {
    form.items.each(function(field){
        if (!field.isValid()) {
            return false;
        }
    });
    return true;
}

// Boolean to check if user has admin privileges. Set in main.gsp
var admin_user = false;

/*Ext.override(Ext.form.ComboBox, {
setValue : function(v){
//begin patch
    // Store not loaded yet? Set value when it *is* loaded.
    // Defer the setValue call until after the next load.
    if (this.store.getCount() == 0) {
        this.store.on('load',
            this.setValue.createDelegate(this, [v]), null, {single: true});
        return;
    }
//end patch
    var text = v;
    if(this.valueField){   alert(v);
        var r = this.findRecord(this.valueField, v);
        if(r){
            text = r.data[this.displayField];
        }else if(this.valueNotFoundText !== undefined){
            text = this.valueNotFoundText;
        }
    }
    this.lastSelectionText = text;
    if(this.hiddenField){//alert (v);
        this.hiddenField.value = v;
    }
    Ext.form.ComboBox.superclass.setValue.call(this, text);
    this.value = v;
}
});*/