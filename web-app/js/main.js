/**
 * Created by IntelliJ IDEA.
 * User: dpkerch
 * Date: 12/28/10
 * Time: 3:32 PM
 * To change this template use File | Settings | File Templates.
 */

/* The initial tab that is displayed in the Tab Panel. It has buttons that link to common functions. */
var mainPanel = new Ext.Panel({
    id: 'main-panel',
    //layout: 'card',
    /*layoutConfig: {
      type: 'vbox',
      padding: '5',
      align: 'stretch'
    },   */
    closable: false,
    title: 'Home',
    tabPosition: 'top',
    items: [
        // from basic.js:
        new Ext.Panel({
            title: 'Trips and Reports',
            id: 'nav-panel',
            border: false, // already wrapped so don't add another border
            layout: 'hbox',
            align: 'stretch',
            padding: '5',
            /*layoutConfig: {
              type: 'vbox',
              padding: '5',
              align: 'stretch'
            },*/
            defaults:{margins:'0 0 5 0'},
            items: [
                {
                    xtype:'button',
                    text: 'Submit a Trip',
                    scale: 'large',
                    flex: 1,
                    handler: function() {
                        displayFormWindow();
                    }
                } ,
                {
                    xtype:'button',
                    text: 'Submit a Report',
                    scale: 'large',
                    flex: 1,
                    handler: function() {
                        displayFormWindow();
                    }
                } ,
                {
                    xtype:'button',
                    text: 'View Trips',
                    scale: 'large',
                    flex: 1,
                    handler: function() {
                        replace('trip-grid'
                                , 'Attendees');
                    }
                } ,
                {
                    xtype:'button',
                    text: 'View Trip Attendees',
                    scale: 'large',
                    flex: 1,
                    handler: function() {
                        replace('attendee-grid'
                                , 'Attendees');
                    }

                }
            ]
        })/*,
        new Ext.Panel({
            title: 'Administration',
            id: 'admin-panel',
            border: false, // already wrapped so don't add another border
            tabPosition: 'top',
            layout: 'hbox',
            align: 'stretch',
            padding: '5',
            defaults:{margins:'0 0 5 0'},
            items: [
                {
                    xtype:'button',
                    text: 'Add a User',
                    flex: 1,
                    iconCls:'add-user16',                      // reference to our css
                    handler: function() {
                        displayUserCreateWindow();
                    }
                } ,
                {
                    xtype:'button',
                    text: 'Contracts',
                    flex: 1,
                    handler: function() {
                        replace('contract-grid'
                                , 'Contracts');
                    }
                }/* ,
                {
                    xtype:'button',
                    text: 'View Trips',
                    flex: 1,
                    handler: function() {
                        replace('attendee-grid'
                                , 'Attendees');
                    }
                } ,
                {
                    xtype:'button',
                    text: 'View Trip Attendees',
                    flex: 1,
                    handler: function() {
                        replace('attendee-grid'
                                , 'Attendees');
                    }

                }
            ]
        })*/

    ]
});
