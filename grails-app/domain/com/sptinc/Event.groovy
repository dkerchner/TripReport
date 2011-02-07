package com.sptinc

/* The actual event (conference, training, etc) that the users request to attend. */
class Event {

    String name
    String description
    Date startDate
    Date endDate
    Location location // The location of the Event
	String url

	// Events have many trips
    static hasMany = [trips: Trip]

    static belongsTo = Trip

    static constraints = {
        name(blank: false, unique: true, maxSize: 100)
        description(nullable: true, maxSize: 2500)
        startDate(blank: false)
        endDate(blank: false)
        location(blank: false)
		url(nullable: true, url: true)
    }

    int compareTo(obj) {
        startDate.compareTo(obj.startDate)
    }

    String toString() {
	    return name
	}
}
