/*
 * Ext JS Library 2.0 Beta 1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://extjs.com/license
 */

    var reportcm = new Ext.grid.ColumnModel([
	    {header: "Trip", width: 120, dataIndex: 'trip'},
		{header: "Author", width: 180, dataIndex: 'author'},
		{header: "Usefulness", width: 40, dataIndex: 'usefulness'},
        {header: "Topics", width: 100, dataIndex: 'topics'},
		{header: "Issues", width: 100, dataIndex: 'issues'}
	]);
    reportcm.defaultSortable = true;

    // create the grid
    var reportGrid = new Ext.grid.EditorGridPanel({
        id: 'report-grid',
        ds: reportds,
        cm: reportcm,
        //renderTo: 'center-div',
        //width:700,
        //height:350,
        enableColLock:false,
        clicksToEdit:1,
        selModel: new Ext.grid.RowSelectionModel({singleSelect:false})
    });
