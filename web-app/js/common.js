/**
 * Created by IntelliJ IDEA.
 * User: dpkerch
 * Date: 12/22/10
 * Time: 1:09 PM
 * To change this template use File | Settings | File Templates.
 */


// ExtJS common form elements
var shortDescriptionField = {
    xtype: 'textfield',
    id: 'shortDescriptionField',
    fieldLabel: 'Short Description',
    maxLength: 100,
    allowBlank: false,
    anchor : '95%',
    maskRe: /([a-zA-Z0-9\s]+)$/
};

var purposeField = {
    xtype: 'textfield',
    id: 'purposeField',
    fieldLabel: 'Purpose',
    maxLength: 255,
    allowBlank: false,
    anchor : '95%',
    maskRe: /([a-zA-Z0-9\s]+)$/
};

var startDateField = {
    xtype: 'datefield',
    id:'startDateField',
    fieldLabel: 'Start Date',
    format : 'm/d/Y',
    allowBlank: false,
    anchor:'95%'
};

var endDateField = {
    xtype: 'datefield',
    id:'endDateField',
    fieldLabel: 'End Date',
    format : 'm/d/Y',
    allowBlank: false,
    anchor:'95%'
};

var eventsField = {
    xtype: 'multiselect',
    fieldLabel: 'Events<br />(Required)',
    name: 'eventsField',
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
    name: 'contractsField',
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
    name: 'locationsField',
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
    fieldLabel: 'Trip',
    allowBlank: false,
    store: tripDS,
    anchor : '95%'
};

var authorField = {
    xtype: 'combo',
    id: 'authorField',
    fieldLabel: 'Author',
    allowBlank: false,
    store: userListDS,
    anchor : '95%'
};

var topicsField = {
    xtype: 'textarea',
    id: 'topicsField',
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
    fieldLabel: 'Issues <br />',
    maxLength: 2500,
    autoScroll: true,
    allowBlank: false,
    anchor : '95%',
    maskRe: /([a-zA-Z0-9\s]+)$/
};

var contactsField = {
    xtype: 'multiselect',
    fieldLabel: 'Contacts<br />(Required)',
    name: 'contactsField',
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

var actionItemsField = {
    xtype: 'multiselect',
    fieldLabel: 'Action Items<br />(Required)',
    name: 'actionItemsField',
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

var attendeeDisplayField = {
    id: 'attendeeDisplayField',
    fieldLabel: '<b>Attendee</b>',
    anchor:'95%'
};

var shortDescriptionDisplayField = {
    xtype: 'displayfield',
    id: 'shortDescriptionDisplayField',
    fieldLabel: '<b>Short Description</b>',
    anchor:'95%'
};

var purposeDisplayField = {
    xtype: 'displayfield',
    id: 'purposeDisplayField',
    fieldLabel: '<b>Purpose</b>',
    anchor:'95%'
};

var startDateDisplayField = {
    xtype: 'displayfield',
    id:'startDateDisplayField',
    fieldLabel: '<b>Start Date</b>',
    anchor:'95%'
};

var endDateDisplayField = {
    xtype: 'displayfield',
    id:'endDateDisplayField',
    fieldLabel: '<b>End Date</b>',
    anchor:'95%'
};

var eventsDisplayField = {
    xtype: 'displayfield',
    id: 'eventsDisplayField',
    fieldLabel: '<b>Events</b>',
    anchor:'95%'
};

var locationsDisplayField = {
    xtype: 'displayfield',
    id: 'locationsDisplayField',
    fieldLabel: '<b>Locations</b>',
    anchor:'95%'
};

var contractsDisplayField = {
    xtype: 'displayfield',
    id: 'contractsDisplayField',
    fieldLabel: '<b>Contracts</b>',
    anchor:'95%'
};

var tripDisplayField = {
    xtype: 'displayfield',
    id: 'tripDisplayField',
    fieldLabel: '<b>Trip</b>',
    anchor:'95%'
};

var authorDisplayField = {
    xtype: 'displayfield',
    id: 'authorDisplayField',
    fieldLabel: '<b>Author</b>',
    anchor:'95%'
};

var usefulnessDisplayField = {
    xtype: 'displayfield',
    id: 'usefulnessDisplayField',
    fieldLabel: '<b>Usefulness</b>',
    anchor:'95%'
};

var issuesDisplayField = {
    xtype: 'displayfield',
    id: 'issuesDisplayField',
    fieldLabel: '<b>Issues</b>',
    anchor:'95%'
};

var topicsDisplayField = {
    xtype: 'displayfield',
    id: 'topicsDisplayField',
    fieldLabel: '<b>Topics</b>',
    anchor:'95%'
};

var contactsDisplayField = {
    xtype: 'displayfield',
    id: 'contactsDisplayField',
    fieldLabel: '<b>Contacts</b>',
    anchor:'95%'
};

var actionItemsDisplayField = {
    xtype: 'displayfield',
    id: 'actionItemsDisplayField',
    fieldLabel: '<b>Action Items</b>',
    anchor:'95%'
};

var idField = {
    xtype: "hidden",
    id: 'idField',
    anchor:'95%'
};

var idField2 = {
    xtype: "hidden",
    id: 'idField2',
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

var admin_user = false;