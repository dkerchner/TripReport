// Global vars
var PresidentsDataStore;
var PresidentsColumnModel;
var PresidentListingEditorGrid;
var PresidentListingWindow;
var PresidentCreateForm;
var PresidentCreateWindow;
var FirstNameField;
var LastNameField;
var EnteringOfficeField;
var LeavingOfficeField;
var IncomeField;
var PartyField;
var PresidentListingSelectedRow;
var PresidentListingContextMenu;

Ext.onReady(function(){

  Ext.QuickTips.init();
  
  // This saves the president after a cell has been edited
  function saveThePresident(oGrid_event){
   Ext.Ajax.request({   
      waitMsg: 'Please wait...',
      url: 'database.php',
      params: {
         task: "UPDATEPRES",
         IDpresident: oGrid_event.record.data.IDpresident,
         FirstName: oGrid_event.record.data.FirstName,
         LastName: oGrid_event.record.data.LastName,
         PartyName: oGrid_event.record.data.PartyName,
         TookOffice: oGrid_event.record.data.TookOffice.format('Y-m-d'),
         LeftOffice: oGrid_event.record.data.LeftOffice.format('Y-m-d'),
         Income: oGrid_event.record.data.Income
      }, 
      success: function(response){              
         var result=eval(response.responseText);
         switch(result){
         case 1:
            PresidentsDataStore.commitChanges();
            PresidentsDataStore.reload();
            break;          
         default:
            Ext.MessageBox.alert('Uh uh...','We couldn\'t save him...');
            break;
         }
      },
      failure: function(response){
         var result=response.responseText;
         Ext.MessageBox.alert('error','could not connect to the database. retry later');    
      }                      
   });   
  }

  // this creates a new president
  function createThePresident(){
     if(isPresidentFormValid()){
      Ext.Ajax.request({   
        waitMsg: 'Please wait...',
        url: 'database.php',
        params: {
          task: "CREATEPRES",
          firstname:      FirstNameField.getValue(),
          lastname:       LastNameField.getValue(),
          enteringoffice: EnteringOfficeField.getValue().format('Y-m-d'),
          leavingoffice:  LeavingOfficeField.getValue().format('Y-m-d'),
          income:          IncomeField.getValue(),
          party:          PartyField.getValue()
        }, 
        success: function(response){              
          var result=eval(response.responseText);
          switch(result){
          case 1:
            Ext.MessageBox.alert('Creation OK','The president was created successfully.');
            PresidentsDataStore.reload();
            PresidentCreateWindow.hide();
            break;
          default:
            Ext.MessageBox.alert('Warning','Could not create the president.');
            break;
          }        
        },
        failure: function(response){
          var result=response.responseText;
          Ext.MessageBox.alert('error','could not connect to the database. retry later');         
        }                      
      });
    } else {
      Ext.MessageBox.alert('Warning', 'Your Form is not valid!');
    }
  }
  
  // reset the Form before opening it
  function resetPresidentForm(){
    FirstNameField.setValue('');
    LastNameField.setValue('');
    EnteringOfficeField.setValue('');
    LeavingOfficeField.setValue('');
    IncomeField.setValue('');
    PartyField.setValue('');    
  }
  
  // check if the form is valid
  function isPresidentFormValid(){
      return(FirstNameField.isValid() && LastNameField.isValid() && EnteringOfficeField.isValid() && LeavingOfficeField.isValid() && IncomeField.isValid() && PartyField.isValid());
  }
  
  // display or bring forth the form
  function displayFormWindow(){
     if(!PresidentCreateWindow.isVisible()){
       resetPresidentForm();
       PresidentCreateWindow.show();
     } else {
       PresidentCreateWindow.toFront();
     }
  }
  
  // This was added in Tutorial 6
  function confirmDeletePresidents(){
    if(PresidentListingEditorGrid.selModel.getCount() == 1) // only one president is selected here
    {
      Ext.MessageBox.confirm('Confirmation','You are about to delete a president. Continue?', deletePresidents);
    } else if(PresidentListingEditorGrid.selModel.getCount() > 1){
      Ext.MessageBox.confirm('Confirmation','Delete those presidents?', deletePresidents);
    } else {
      Ext.MessageBox.alert('Uh oh...','You can\'t really delete something you haven\'t selected huh?');
    }
  }  
   // This was added in Tutorial 6
  function deletePresidents(btn){
    if(btn=='yes'){
         var selections = PresidentListingEditorGrid.selModel.getSelections();
         var prez = [];
         for(i = 0; i< PresidentListingEditorGrid.selModel.getCount(); i++){
          prez.push(selections[i].json.IDpresident);
         }
         var encoded_array = Ext.encode(prez);
         Ext.Ajax.request({  
            waitMsg: 'Please Wait',
            url: 'database.php', 
            params: { 
               task: "DELETEPRES", 
               ids:  encoded_array
              }, 
            success: function(response){
              var result=eval(response.responseText);
              switch(result){
              case 1:  // Success : simply reload
                PresidentsDataStore.reload();
                break;
              default:
                Ext.MessageBox.alert('Warning','Could not delete the entire selection.');
                break;
              }
            },
            failure: function(response){
              var result=response.responseText;
              Ext.MessageBox.alert('error','could not connect to the database. retry later');      
              }
         });
      }  
  }
  
 
  function startAdvancedSearch(){
      // local vars
      var PresidentSearchForm;
      var PresidentSearchWindow;
      var SearchFirstNameItem;
      var SearchLastNameItem;
      var SearchPartyItem;
      var SearchEnteringItem;
      var SearchLeavingItem;
      
     function listSearch(){
         // render according to a SQL date format.
         var startDate = "";
         var endDate = "";
         if(SearchEnteringItem.getValue() !== "") {
            startDate = SearchEnteringItem.getValue().format('Y-m-d');
         }
         if(SearchLeavingItem.getValue() !== "") {
            endDate = SearchLeavingItem.getValue().format('Y-m-d');
         }
         
         // change the store parameters
        PresidentsDataStore.baseParams = {
         task: 'SEARCH',
         firstname: SearchFirstNameItem.getValue(),
            lastname : SearchLastNameItem.getValue(),
            party : SearchPartyItem.getValue(),
            enteringoffice : startDate,
            leavingoffice : endDate
       };
         // Cause the datastore to do another query : 
       PresidentsDataStore.reload({params: {start: 0, limit: 15}});
     }
     
     function resetSearch(){
         // reset the store parameters
        PresidentsDataStore.baseParams = {
         task: 'LISTING'
       };
         // Cause the datastore to do another query : 
       PresidentsDataStore.reload({params: {start: 0, limit: 15}});
         PresidentSearchWindow.close();
     }
     
      SearchFirstNameItem = new Ext.form.TextField({
          fieldLabel: 'First Name',
          maxLength: 20,
          anchor : '95%',
          maskRe: /([a-zA-Z0-9\s]+)$/
            });

      SearchLastNameItem = new Ext.form.TextField({
          fieldLabel: 'Last Name',
          maxLength: 20,
          anchor : '95%',    
          maskRe: /([a-zA-Z0-9\s]+)$/  
            });
      
      SearchPartyItem = new Ext.form.ComboBox({
         fieldLabel: 'Party',
         store:new Ext.data.SimpleStore({
          fields:['partyValue', 'partyName'],
          data: [['1','No Party'],['2','Federalist'],['3','Democratic-Republican'],['4','Democratic'],['5','Whig'],['6','Republican']]
          }),
         mode: 'local',
         displayField: 'partyName',
         valueField: 'partyValue',
         anchor:'95%',
         triggerAction: 'all'
            });
            
      SearchEnteringItem = new Ext.form.DateField({
          fieldLabel: 'Entered Office after',
          format : 'm/d/Y',
          anchor:'95%'
          });
          
      SearchLeavingItem = new Ext.form.DateField({
          fieldLabel: 'Left Office before',
          format : 'm/d/Y',
          anchor:'95%'
          });
    
     PresidentSearchForm = new Ext.FormPanel({
       //labelAlign: 'top',
       bodyStyle: 'padding: 5px',
       width: 300,
       items: [{
         layout: 'form',
         border: false,
         items: [ SearchFirstNameItem,SearchLastNameItem,SearchPartyItem,SearchEnteringItem, SearchLeavingItem ],
         buttons: [{
               text: 'Search',
               handler: listSearch
             },{
               text: 'Close',
               handler: resetSearch
             }]
         }]
     });
 
     
     PresidentSearchWindow = new Ext.Window({
         title: 'President Search',
         closable:true,
         width: 200,
         height: 400,
         plain:true,
         layout: 'fit',
         items: PresidentSearchForm
     });
 
     
     // once all is done, show the search window
     PresidentSearchWindow.show();
  } 
  
    function printListing(){
      var searchquery = "";
      var searchfirstname = "";
      var searchlastname = "";
      var searchparty = "";
      var searchenteringoffice = "";
      var searchleavingoffice = "";
      var win;               // our popup window
      // check if we do have some search data...
      if(PresidentsDataStore.baseParams.query!==null){searchquery = PresidentsDataStore.baseParams.query;}
      if(PresidentsDataStore.baseParams.firstname!==null){searchfirstname = PresidentsDataStore.baseParams.firstname;}
      if(PresidentsDataStore.baseParams.lastname!==null){searchlastname = PresidentsDataStore.baseParams.lastname;}
      if(PresidentsDataStore.baseParams.party!==null){searchparty = PresidentsDataStore.baseParams.party;}
      if(PresidentsDataStore.baseParams.enteringoffice!==null){searchenteringoffice = PresidentsDataStore.baseParams.enteringoffice;}
      if(PresidentsDataStore.baseParams.leavingoffice!==null){searchleavingoffice = PresidentsDataStore.baseParams.leavingoffice;}
         
      Ext.Ajax.request({   
        waitMsg: 'Please Wait...',
        url: 'database.php',
        params: {
          task: "PRINT",
               // we have to send all of the search

          query: searchquery,                                 // if we are doing a quicksearch, use this
          firstname : searchfirstname,                        // if we are doing advanced search, use this
          lastname : searchlastname,
          party : searchparty,
          enteringoffice : searchenteringoffice,
          leavingoffice : searchleavingoffice,
          currentlisting: PresidentsDataStore.baseParams.task // this tells us if we are searching or not
        }, 
        success: function(response){              
          var result=eval(response.responseText);
          switch(result){
          case 1:
            win = window.open('./presidentslist.html','presidentslist','height=400,width=600,resizable=1,scrollbars=1, menubar=1');
            win.print();
            break;
          default:
            Ext.MessageBox.alert('Uh hu...','Unable to print the grid!');
            break;
          }  
        },
        failure: function(response){
          var result=response.responseText;
          Ext.MessageBox.alert('error','could not connect to the database. retry later');      
        }                      
      });
  }
 
  function onPresidentListingEditorGridContextMenu(grid, rowIndex, e) {
    e.stopEvent();
    var coords = e.getXY();
    PresidentListingContextMenu.rowRecord = grid.store.getAt(rowIndex);
    grid.selModel.selectRow(rowIndex);
    PresidentListingSelectedRow=rowIndex;
    PresidentListingContextMenu.showAt([coords[0], coords[1]]);
  }
 
  function modifyPresidentContextMenu(){
      PresidentListingEditorGrid.startEditing(PresidentListingSelectedRow,1);
  }

  function deletePresidentContextMenu(){
      confirmDeletePresidents();
  }

  function printListingContextMenu(){
      printListing();
  }

  
  // << CONFIG >>
  PresidentsDataStore = new Ext.data.Store({
      id: 'PresidentsDataStore',
      proxy: new Ext.data.HttpProxy({
                url: 'database.php', 
                method: 'POST'
            }),
            baseParams:{task: "LISTING"}, // this parameter is passed for any HTTP request
      reader: new Ext.data.JsonReader({
        root: 'results',
        totalProperty: 'total',
        id: 'id'
      },[ 
        {name: 'IDpresident', type: 'int', mapping: 'IDpresident'},
        {name: 'FirstName', type: 'string', mapping: 'firstname'},
        {name: 'LastName', type: 'string', mapping: 'lastname'},
        {name: 'IDparty', type: 'int', mapping: 'IDparty'},
        {name: 'PartyName', type: 'string', mapping: 'name'},
        {name: 'TookOffice', type: 'date', mapping: 'tookoffice'},
        {name: 'LeftOffice', type: 'date', mapping: 'leftoffice'},
        {name: 'Income', type: 'float', mapping: 'income'}
      ]),
      sortInfo:{field: 'IDpresident', direction: "ASC"}
    });
    
  PresidentsColumnModel = new Ext.grid.ColumnModel(
    [{
        header: '#',
        readOnly: true,
        dataIndex: 'IDpresident',
        width: 40,        
        renderer: function(value, cell){ 
         cell.css = "readonlycell";
         return value;
        },
        hidden: false
      },{
        header: 'First Name',
        dataIndex: 'FirstName',
        width: 60,
        editor: new Ext.form.TextField({
            allowBlank: false,
            maxLength: 20,
            maskRe: /([a-zA-Z0-9\s]+)$/
          }),
        renderer: function(value, cell){ 
         cell.css = "coolcell";
         return value;
        }
      },{
        header: 'Last Name',
        dataIndex: 'LastName',
        width: 80,
        editor: new Ext.form.TextField({
          allowBlank: false,
          maxLength: 20,
          maskRe: /([a-zA-Z0-9\s]+)$/
          }),
        renderer: function(value, cell){ 
         cell.css = "coolcell";
         return value;
        }
      },{
        header: 'ID party',
        readOnly: true,
        dataIndex: 'IDparty',
        width: 50,       
        renderer: function(value, cell){ 
         cell.css = "readonlycell";
         return value;
        },
        hidden: true
      },{
        header: 'Party',
        dataIndex: 'PartyName',
        width: 150,
        editor: new Ext.form.ComboBox({
               typeAhead: true,
               triggerAction: 'all',
               store:new Ext.data.SimpleStore({
                fields:['partyValue', 'partyName'],
                data: [['1','No Party'],['2','Federalist'],['3','Democratic-Republican'],['4','Democratic'],['5','Whig'],['6','Republican']]
                }),
               mode: 'local',
               displayField: 'partyName',
               valueField: 'partyValue',
               lazyRender:true,
               listClass: 'x-combo-list-small'
            })
      },{
        header: 'Took Office',
        dataIndex: 'TookOffice',
        width: 80,
        renderer: Ext.util.Format.dateRenderer('m/d/Y'),
        editor: new Ext.form.DateField({
          format: 'm/d/Y'
        }),
        hidden: false
    },{
        header: 'Left Office',
        dataIndex: 'LeftOffice',
        width: 80,
        renderer: Ext.util.Format.dateRenderer('m/d/Y'),
        editor: new Ext.form.DateField({
          format: 'm/d/Y'
        }),
        hidden: false
    },{
        header: "Income",
        dataIndex: 'Income',
        width: 100,
        renderer: function(value, cell){ 
         var str = '';
         if(value > 1000000){
            str = "<span style='color:#336600;'>$ " + value + "</span>";
         } else if (value > 100000 && value < 1000000){
            str = "<span style='color:#FF9900;'>$ " + value + "</span>";
         } else {
            str = "<span style='color:#CC0000;'>$ " + value + "</span>";
         }
         return str; 
        },
        editor: new Ext.form.NumberField({
          allowBlank: false,
          allowDecimals: true,
          allowNegative: false,
          blankText: '0',
          maxLength: 11
          })
      }]
    );
    PresidentsColumnModel.defaultSortable= true;
    
   PresidentListingEditorGrid =  new Ext.grid.EditorGridPanel({
      id: 'PresidentListingEditorGrid',
      store: PresidentsDataStore,
      cm: PresidentsColumnModel,
      enableColLock:false,
      clicksToEdit:2,
      selModel: new Ext.grid.RowSelectionModel({singleSelect:false}),
      bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: PresidentsDataStore,
                displayInfo: true
            }),
      tbar: [
          {
            text: 'Add a President',
            tooltip: 'Great tooltips...',
            iconCls:'add',                      // reference to our css
            handler: displayFormWindow
          }, '-', { 
            text: 'Delete selection',
            tooltip: 'Jose, can you seeeee??',
            handler: confirmDeletePresidents,   // Confirm before deleting
            iconCls:'remove'
          }, '-', { // Added in Tutorial 8
            text: 'Search',
            tooltip: 'Advanced Search',
            handler: startAdvancedSearch,   
            iconCls:'search'
          }, '-', new Ext.app.SearchField({
                    store: PresidentsDataStore,
            params: {start: 0, limit: 15},
                    width: 120
        }),'-', {
            text: 'Print',
        tooltip: 'Print me!',
            handler: printListing, 
            iconCls:'print'
          }
      ]
    });
  PresidentListingEditorGrid.addListener('rowcontextmenu', onPresidentListingEditorGridContextMenu);

  PresidentListingContextMenu = new Ext.menu.Menu({
      id: 'PresidentListingEditorGridContextMenu',
      items: [
      { text: 'Modify this President', handler: modifyPresidentContextMenu },
      { text: 'Delete this President', handler: deletePresidentContextMenu },
      '-',
      { text: 'Print this grid', handler: printListingContextMenu }
      ]
   });    
    
  PresidentListingWindow = new Ext.Window({
      id: 'PresidentListingWindow',
      title: 'The Presidents of the USA',
      closable:true,
      width:700,
      height:350,
      plain:true,
      layout: 'fit',
      items: PresidentListingEditorGrid
    });
    
  PresidentsDataStore.load({params: {start: 0, limit: 15}});
  PresidentListingWindow.show();
  PresidentListingEditorGrid.on('afteredit', saveThePresident);
  
  FirstNameField = new Ext.form.TextField({
    id: 'FirstNameField',
    fieldLabel: 'First Name',
    maxLength: 20,
    allowBlank: false,
    anchor : '95%',
    maskRe: /([a-zA-Z0-9\s]+)$/
      });
      
  LastNameField = new Ext.form.TextField({
    id: 'LastNameField',
    fieldLabel: 'Last Name',
    maxLength: 20,
    allowBlank: false,
    anchor : '95%',    
    maskRe: /([a-zA-Z0-9\s]+)$/  
      });
  
  EnteringOfficeField = new Ext.form.DateField({
    id:'EnteringOfficeField',
    fieldLabel: 'Entering Office',
    format : 'm/d/Y',
    allowBlank: false,
    anchor:'95%'
    });
    
  LeavingOfficeField = new Ext.form.DateField({
    id:'LeavingOfficeField',
    fieldLabel: 'Leaving Office',
    format : 'm/d/Y',
    allowBlank: false,
    anchor:'95%'
    });
  
  IncomeField = new Ext.form.NumberField({
    id:'IncomeField',
    fieldLabel: 'Income',
    allowNegative: false,
    allowBlank: false,
    anchor:'95%'
    });
  
  PartyField = new Ext.form.ComboBox({
     id:'PartyField',
     fieldLabel: 'Party',
     store:new Ext.data.SimpleStore({
       fields:['partyValue', 'partyName'],
       data: [['1','No Party'],['2','Federalist'],['3','Democratic-Republican'],['4','Democratic'],['5','Whig'],['6','Republican']]
       }),
     mode: 'local',
     displayField: 'partyName',
     allowBlank: false,
     valueField: 'partyValue',
     anchor:'95%',
     triggerAction: 'all'
      });
  
  PresidentCreateForm = new Ext.FormPanel({
        labelAlign: 'top',
        bodyStyle:'padding:5px',
        width: 600,        
        items: [{
            layout:'column',
            border:false,
            items:[{
                columnWidth:0.5,
                layout: 'form',
                border:false,
                items: [FirstNameField, LastNameField, PartyField]
            },{
                columnWidth:0.5,
                layout: 'form',
                border:false,
                items: [EnteringOfficeField, LeavingOfficeField, IncomeField]
            }]
        }],
    buttons: [{
      text: 'Save and Close',
      handler: createThePresident
    },{
      text: 'Cancel',
      handler: function(){
        // because of the global vars, we can only instantiate one window... so let's just hide it.
        PresidentCreateWindow.hide();
      }
    }]
    });
  
  PresidentCreateWindow= new Ext.Window({
      id: 'PresidentCreateWindow',
      title: 'Creating a New President',
      closable:true,
      width: 610,
      height: 250,
      plain:true,
      layout: 'fit',
      items: PresidentCreateForm
    });
  
  
});