<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1"/>
  <title><g:layoutTitle default="SPT Trip Report Application"/></title>


  <link type="text/css" href="${resource(dir: 'css', file: 'main.css')}"/>

  <link rel="shortcut icon" href="${resource(dir: 'images', file: 'favicon.ico')}" type="image/x-icon"/>
  <link rel="stylesheet" type="text/css" href="${resource(dir: 'js/ext-3.3.1/resources/css', file: 'ext-all.css')}"/>
  <link rel="stylesheet" type="text/css" href="resources/css/calendar.css" />

  <style type="text/css">
  html, body {
    font: normal 12px verdana;
    margin: 0;
    padding: 0;
    border: 0 none;
    overflow: hidden;
    height: 100%;
  }

  p {
    margin: 5px;
  }

  .settings {
    background-image: url(${resource(dir: 'images', file: 'folder_wrench.png')});
  }

  .nav {
    background-image: url(${resource(dir: 'images', file: 'folder_go.png')});
  }

  /* icons used in the toolbar */
  .add {
    background-image:url(${resource(dir: 'images', file: 'add.gif')}) !important;
  }
  .add-user {
    background-image:url(${resource(dir: 'images', file: 'add-user.gif')}) !important;
  }
  .add-user16 {
    background-image:url(${resource(dir: 'images', file: 'add-user16.gif')}) !important;
  }

  .edit {
    background-image:url(${resource(dir: 'images', file: 'cog_edit.png')}) !important;
  }

  .remove {
      background-image:url(${resource(dir: 'images', file: 'delete.gif')}) !important;
  }
  .search {
      background-image:url(${resource(dir: 'images', file: 'search.png')}) !important;
  }
  .print{
      background-image:url(${resource(dir: 'images', file: 'print.png')}) !important;
  }
  .approve {
      background-image:url(${resource(dir: 'images', file: 'accept.png')}) !important;
  }

  /* styles used for the cells */
  .readonlycell {
    background-color:#CCCCCC !important;
  }
  .approved {
    background-color:green !important;  color:white;
  }
  .unapproved {
    background-color:red !important;  color:white;
  }
  .coolcell {
    background-image:url(${resource(dir: 'images', file: 'cellbck.jpg')}) !important;
  }
  </style>


  <g:javascript library="ext-3.3.1/adapter/ext/ext-base-debug"/>
  <g:javascript library="ext-3.3.1/ext-all-debug"/>
  <g:javascript library="MultiSelect"/>
  <g:javascript library="searchfield"/>

  <g:javascript library="datasources"/>
  <g:javascript library="common"/>

  <g:javascript library="main"/>
  <g:javascript library="trip"/>
  <g:javascript library="report"/>
  <g:javascript library="attendee"/>
  <g:javascript library="user"/>
  <g:javascript library="contract"/>
  <g:javascript library="contact"/>
  <g:javascript library="actionItem"/>
  <g:javascript library="event"/>
  
  

  <!--<g:javascript library="calendar/Ext.calendar"/>
  <g:javascript library="calendar/templates/DayHeaderTemplate"/>
  <g:javascript library="calendar/templates/DayBodyTemplate"/>
  <g:javascript library="calendar/templates/DayViewTemplate"/>
  <g:javascript library="calendar/templates/BoxLayoutTemplate"/>
  <g:javascript library="calendar/templates/MonthViewTemplate"/>
  <g:javascript library="calendar/dd/CalendarScrollManager"/>
  <g:javascript library="calendar/dd/StatusProxy"/>
  <g:javascript library="calendar/dd/CalendarDD"/>
  <g:javascript library="calendar/dd/DayViewDD"/>
  <g:javascript library="calendar/EventRecord"/>
  <g:javascript library="calendar/views/MonthDayDetailView"/>
  <g:javascript library="calendar/widgets/CalendarPicker"/>
  <g:javascript library="calendar/WeekEventRenderer"/>
  <g:javascript library="calendar/views/CalendarView"/>
  <g:javascript library="calendar/views/MonthView"/>
  <g:javascript library="calendar/views/DayHeaderView"/>
  <g:javascript library="calendar/views/DayBodyView"/>
  <g:javascript library="calendar/views/DayView"/>
  <g:javascript library="calendar/views/WeekView"/>
  <g:javascript library="calendar/widgets/DateRangeField"/>
  <g:javascript library="calendar/widgets/ReminderField"/>
  <g:javascript library="calendar/EventEditForm"/>
  <g:javascript library="calendar/EventEditWindow"/>
  <g:javascript library="calendar/CalendarPanel"/>

  <g:javascript library="calendar"/>-->


  <sec:ifAllGranted roles="ROLE_ADMIN"><script type="text/javascript">admin_user = true; </script></sec:ifAllGranted>

  <script type="text/javascript">
    Ext.onReady(function() {

      // NOTE: This is an example showing simple state management. During development,
      // it is generally best to disable state management as dynamically-generated ids
      // can change across page loads, leading to unpredictable results.  The developer
      // should ensure that stable state ids are set for stateful components in real apps.
      Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

      var currentName;

      var contentPanel = {
		id: 'content-panel',
		region: 'center', // this is what makes this panel into a region within the containing layout
		//layout: 'card',
		//margins: '2 5 5 0',
		activeItem: 0,
		border: true,
        layout: 'fit',
		items: [
			// from basic:
          new Ext.TabPanel({
              id: 'center-tab-panel',
              border: false, // already wrapped so don't add another border
              activeTab: 0, // second tab initially active
              tabPosition: 'top',
              autoDestroy: false,
              items: [
                      mainPanel
                  //tripGrid, reportGrid
                  ]
          })
        ]
	};

      var viewport = new Ext.Viewport({
        layout: 'border',
        items: [
          // create instance immediately
          new Ext.BoxComponent({
            region: 'north',
            height: 32, // give north and south regions a height
            autoEl: {
              tag: 'div',
              html:'<h1 align=\"left\"><a href=\"http://www.spt-inc.com\" target=\"_blank\"><img align=\"middle\" height=\"32\" width=\"32\" src=\"${resource(dir: 'images', file: 'SLogo.png')}\"></a>SPT Trip Report Application | <sec:username /> (<g:link controller="logout">sign out</g:link>)</h1>'
            }
          }), {
            // lazily created panel (xtype:'panel' is default)
            region: 'south',
            contentEl: 'south',
            split: true,
            height: 100,
            minSize: 100,
            maxSize: 200,
            collapsible: true,
            title: '',
            margins: '0 0 0 0'
          }, {
              region: 'east',
              title: 'Events',
              collapsible: true,
              split: true,
              width: 225, // give east and west regions a width
              minSize: 175,
              maxSize: 400,
              margins: '0 5 0 0',
              layout: 'fit', // specify layout manager for items
              items:            // this TabPanel is wrapped by another Panel so the title will be applied
              new Ext.Panel({
                  border: false, // already wrapped so don't add another border
                  items: [
                          eventListView
                  ]
              })
          }, {
            region: 'west',
            id: 'west-panel', // see Ext.getCmp() below
            title: '',
            split: true,
            width: 200,
            minSize: 175,
            maxSize: 400,
            collapsible: true,
            margins: '0 0 0 5',
            layout: {
              type: 'accordion',
              align:'stretch',
              animate: true
            },
            items: [
              {
                contentEl: 'west',
                title: 'Navigation',
                border: false,
                align:'stretch',
                layout: 'vbox',
                layoutConfig: {
                  padding: '5',
                  align: 'stretch'
                },
                iconCls: 'nav', // see the HEAD section for style used
                items: [{
                      xtype:'button',
                      text: 'Trips',
                      handler: function(){
                          replace('trip-grid'
                          , 'Trips');
                      }
                  } , {
                      xtype:'button',
                      text: 'Reports',
                      handler: function(){
                          replace('report-grid'
                          , 'Reports');
                      }
                  } , {
                      xtype:'button',
                      text: 'Trip Attendees',
                      handler: function(){
                          replace('attendee-grid'
                          , 'Attendees');
                      }
                  } , {
                      xtype:'button',
                      text: 'Events',
                      handler: function(){
                          replace('event-grid'
                          , 'Events');
                      }
                  } /*, {
                      xtype:'button',
                      text: 'Calendar',
                      handler: function(){
                          replace('calendar'
                          , 'Calendar');
                      }
                  }*/
                ]
              },
              {
                title: 'Settings',
                border: false,
                align:'stretch',
                layout: 'vbox',
                layoutConfig: {
                  padding: '5',
                  align: 'stretch'
                },
                iconCls: 'settings',
                items: [{
                      xtype:'button',
                      text: 'Users',
                      handler: function(){
                          replace('user-grid'
                          , 'Users');
                      }
                  } , {
                      xtype:'button',
                      text: 'Contracts',
                      handler: function(){
                          replace('contract-grid'
                          , 'Contracts');
                      }
                  }
                ]

              }
            ]
          },
            // in this instance the TabPanel is not wrapped by another panel
            // since no title is needed, this Panel is added directly
            // as a Container
          contentPanel
        ]
      });
      // get a reference to the HTML element with id "hideit" and add a click listener to it
      /*Ext.get("hideit").on('click', function() {
        // get a reference to the Panel that was created with id = 'west-panel'
        var w = Ext.getCmp('west-panel');
        // expand or collapse that Panel based on its collapsed property state
        w.collapsed ? w.expand() : w.collapse();
      });   */
    });
  </script>
  <!--<g:javascript library="application"/>-->
  <g:layoutHead/>
</head>
<body>
<!-- use class="x-hide-display" to prevent a brief flicker of the content -->
<div id="west" class="x-hide-display">
  <!--<a id="hideit" href="#">Toggle</a> -->
</div>
<div id="south" class="x-hide-display"></div>
</body>
</html>