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


eventsField = {
    xtype: 'multiselect',
    fieldLabel: 'Events<br />(Required)',
    name: 'multiselect',
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

contractsField = {
    xtype: 'multiselect',
    fieldLabel: 'Contracts<br />(Required)',
    name: 'multiselect',
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

locationsField = {
    xtype: 'multiselect',
    fieldLabel: 'Locations<br />(Required)',
    name: 'multiselect',
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