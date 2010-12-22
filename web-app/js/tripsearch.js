function startAdvancedSearch() {

    function listSearch() {
        // render according to a SQL date format.
        var startDate = "";
        var endDate = "";
        if (startDateItem.getValue() !== "") {
            startDate = startDateItem.getValue().format('Y-m-d');
        }
        if (endDateItem.getValue() !== "") {
            endDate = endDateItem.getValue().format('Y-m-d');
        }

        // change the store parameters
        tripds.baseParams = {
            task: 'SEARCH',
            shortDescription: shortDescriptionItem.getValue(),
            purpose : purposeItem.getValue(),
            startDate : startDate,
            endDate : endDate
        };
        // Cause the datastore to do another query :
        tripds.reload({params: {start: 0, limit: 15}});
    }

    function resetSearch() {
        // reset the store parameters
        tripds.baseParams = {
            task: 'LISTING'
        };
        // Cause the datastore to do another query :
        tripds.reload({params: {start: 0, limit: 15}});
        TripSearchWindow.close();
    }

    shortDescriptionItem = new Ext.form.TextField({
        fieldLabel: 'Description',
        maxLength: 20,
        anchor : '95%',
        maskRe: /([a-zA-Z0-9\s]+)$/
    });

    purposeItem = new Ext.form.TextField({
        fieldLabel: 'Purpose',
        maxLength: 20,
        anchor : '95%',
        maskRe: /([a-zA-Z0-9\s]+)$/
    });

    startDateItem = new Ext.form.DateField({
        fieldLabel: 'Starts after',
        format : 'm/d/Y',
        anchor:'95%'
    });

    endDateItem = new Ext.form.DateField({
        fieldLabel: 'Ends before',
        format : 'm/d/Y',
        anchor:'95%'
    });

    TripSearchForm = new Ext.FormPanel({
        labelAlign: 'top',
        bodyStyle: 'padding: 5px',
        width: 300,
        items: [
            {
                layout: 'form',
                border: false,
                items: [ shortDescriptionItem,purposeItem,startDateItem,endDateItem],
                buttons: [
                    {
                        text: 'Search',
                        handler: listSearch
                    },
                    {
                        text: 'Close',
                        handler: resetSearch
                    }
                ]
            }
        ]
    });


    TripSearchWindow = new Ext.Window({
        title: 'Trip Search',
        closable:true,
        width: 200,
        height: 400,
        plain:true,
        layout: 'fit',
        items: TripSearchForm
    });


    // once all is done, show the search window
    TripSearchWindow.show();
}/**
 * Created by IntelliJ IDEA.
 * User: dpkerch
 * Date: 12/22/10
 * Time: 1:53 PM
 * To change this template use File | Settings | File Templates.
 */
