var calendarList = {
    "calendars":[{
        "id":1,
        "title":"Home"
    },{
        "id":2,
        "title":"Work"
    },{
        "id":3,
        "title":"School"
    }]
};

var today = new Date().clearTime();
var eventList = {
    "evts": [{
        "id": 1001,
        "cid": 1,
        "title": "Vacation",
        "start": today.add(Date.DAY, -20).add(Date.HOUR, 10),
        "end": today.add(Date.DAY, -10).add(Date.HOUR, 15),
        "ad": false,
        "notes": "Have fun"
    },
    {
        "id": 1002,
        "cid": 2,
        "title": "Lunch with Matt",
        "start": today.add(Date.HOUR, 11).add(Date.MINUTE, 30),
        "end": today.add(Date.HOUR, 13),
        "ad": false,
        "loc": "Chuy's!",
        "url": "http://chuys.com",
        "notes": "Order the queso",
        "rem": "15"
    },
    {
        "id": 1003,
        "cid": 3,
        "title": "Project due",
        "start": today.add(Date.HOUR, 15),
        "end": today.add(Date.HOUR, 15),
        "ad": false
    },
    {
        "id": 1004,
        "cid": 1,
        "title": "Sarah's birthday",
        "start": today,
        "end": today,
        "notes": "Need to get a gift",
        "ad": true
    },
    {
        "id": 1005,
        "cid": 2,
        "title": "A long one...",
        "start": today.add(Date.DAY, -12),
        "end": today.add(Date.DAY, 10).add(Date.SECOND, -1),
        "ad": true
    },
    {
        "id": 1006,
        "cid": 3,
        "title": "School holiday",
        "start": today.add(Date.DAY, 5),
        "end": today.add(Date.DAY, 7).add(Date.SECOND, -1),
        "ad": true,
        "rem": "2880"
    },
    {
        "id": 1007,
        "cid": 1,
        "title": "Haircut",
        "start": today.add(Date.HOUR, 9),
        "end": today.add(Date.HOUR, 9).add(Date.MINUTE, 30),
        "ad": false,
        "notes": "Get cash on the way"
    },
    {
        "id": 1008,
        "cid": 3,
        "title": "An old event",
        "start": today.add(Date.DAY, -30),
        "end": today.add(Date.DAY, -28),
        "ad": true,
        "notes": "Get cash on the way"
    },
    {
        "id": 1009,
        "cid": 2,
        "title": "Board meeting",
        "start": today.add(Date.DAY, -2).add(Date.HOUR, 13),
        "end": today.add(Date.DAY, -2).add(Date.HOUR, 18),
        "ad": false,
        "loc": "ABC Inc.",
        "rem": "60"
    },
    {
        "id": 1010,
        "cid": 3,
        "title": "Jenny's final exams",
        "start": today.add(Date.DAY, -2),
        "end": today.add(Date.DAY, 3).add(Date.SECOND, -1),
        "ad": true
    },
    {
        "id": 10011,
        "cid": 1,
        "title": "Movie night",
        "start": today.add(Date.DAY, 2).add(Date.HOUR, 19),
        "end": today.add(Date.DAY, 2).add(Date.HOUR, 23),
        "ad": false,
        "notes": "Don't forget the tickets!",
        "rem": "60"
    }]
};


var calendarStore = new Ext.data.JsonStore({
                storeId: 'calendarStore',
                root: 'calendars',
                idProperty: 'id',
                data: calendarList, // defined in calendar-list.js
                proxy: new Ext.data.MemoryProxy(),
                autoLoad: true,
                fields: [
                    {name:'CalendarId', mapping: 'id', type: 'int'},
                    {name:'Title', mapping: 'title', type: 'string'}
                ],
                sortInfo: {
                    field: 'CalendarId',
                    direction: 'ASC'
                }
            });

            // A sample event store that loads static JSON from a local file. Obviously a real
            // implementation would likely be loading remote data via an HttpProxy, but the
            // underlying store functionality is the same.  Note that if you would like to
            // provide custom data mappings for events, see EventRecord.js.
		    var eventStore = new Ext.data.JsonStore({
		        id: 'eventStore',
		        root: 'evts',
		        data: eventList, // defined in event-list.js
				proxy: new Ext.data.MemoryProxy(),
		        fields: Ext.calendar.EventRecord.prototype.fields.getRange(),
		        sortInfo: {
		            field: 'StartDate',
		            direction: 'ASC'
		        }
		    });

var calendarPanel = Ext.calendar.CalendarPanel({
                        eventStore: eventStore,
                        calendarStore: calendarStore,
                        border: false,
                        id:'calendar',
                        //region: 'center',
                        activeItem: 2, // month view

                        // CalendarPanel supports view-specific configs that are passed through to the
                        // underlying views to make configuration possible without explicitly having to
                        // create those views at this level:
                        monthViewCfg: {
                            showHeader: false,
                            showWeekLinks: false,
                            showWeekNumbers: false
                        }

                        // Some optional CalendarPanel configs to experiment with:
                        //showDayView: false,
                        //showWeekView: false,
                        //showMonthView: false,
                        //showNavBar: false,
                        //showTodayText: false,
                        //showTime: false,
                        //title: 'My Calendar', // the header of the calendar, could be a subtitle for the app

});

