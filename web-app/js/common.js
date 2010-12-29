/**
 * Created by IntelliJ IDEA.
 * User: dpkerch
 * Date: 12/22/10
 * Time: 1:09 PM
 * To change this template use File | Settings | File Templates.
 */


// ExtJS common form elements
shortDescriptionField = new Ext.form.TextField({
    id: 'shortDescriptionField',
    fieldLabel: 'Short Description',
    maxLength: 20,
    allowBlank: false,
    anchor : '95%',
    maskRe: /([a-zA-Z0-9\s]+)$/
});

purposeField = new Ext.form.TextField({
    id: 'purposeField',
    fieldLabel: 'Purpose',
    maxLength: 20,
    allowBlank: false,
    anchor : '95%',
    maskRe: /([a-zA-Z0-9\s]+)$/
});

startDateField = new Ext.form.DateField({
    id:'startDateField',
    fieldLabel: 'Start Date',
    format : 'm/d/Y',
    allowBlank: false,
    anchor:'95%'
});

endDateField = new Ext.form.DateField({
    id:'EndDateField',
    fieldLabel: 'End Date',
    format : 'm/d/Y',
    allowBlank: false,
    anchor:'95%'
});

shortDescriptionDisplayField = new Ext.form.DisplayField({
    id: 'shortDescriptionDisplayField',
    fieldLabel: '<b>Short Description</b>',
    anchor:'95%'
});

purposeDisplayField = new Ext.form.DisplayField({
    id: 'purposeField',
    fieldLabel: '<b>Purpose</b>',
    anchor:'95%'
});

startDateDisplayField = new Ext.form.DisplayField({
    id:'startDateDisplayField',
    fieldLabel: '<b>Start Date</b>',
    anchor:'95%'
});

endDateDisplayField = new Ext.form.DisplayField({
    id:'EndDateDisplayField',
    fieldLabel: '<b>End Date</b>',
    anchor:'95%'
});

eventsDisplayField = new Ext.form.DisplayField({
    id: 'eventsDisplayField',
    fieldLabel: '<b>Events</b>',
    anchor:'95%'
});

locationsDisplayField = new Ext.form.DisplayField({
    id: 'locationsDisplayField',
    fieldLabel: '<b>Locations</b>',
    anchor:'95%'
});

contractsDisplayField = new Ext.form.DisplayField({
    id: 'contractsDisplayField',
    fieldLabel: '<b>Contracts</b>',
    anchor:'95%'
});

idField = new Ext.form.Hidden({
    id: 'idField',
    anchor:'95%'
});


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
}); */


var eventsField = {
    xtype: 'multiselect',
    fieldLabel: 'Events<br />(Required)',
    name: 'eventsField',
    displayField: 'name',
    allowBlank: false,
    valueField: 'id',
    anchor:'95%',
    store: eventDS,
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
    store: contractDS,
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
    store: locationDS,
    /*tbar:[{
        text: 'clear',
        handler: function(){

        }
    }], */
    ddReorder: true
};

var replace = function(id, t) {
  var tabPanel = Ext.getCmp('center-tab-panel')
  var tab = tabPanel.items.find(function(i){return i.title === t;});
  if(!tab) {
      var item = Ext.getCmp(id)
      tab = tabPanel.add({
           title:t
          ,layout:'fit',
          items: [item]
      });
  }
  tabPanel.setActiveTab(tab);
}
