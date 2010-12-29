package com.sptinc

class Event {

    String name
    String description
    Date startDate
    Date endDate
    Location location

    static hasMany = [trips: Trip]

    static belongsTo = com.sptinc.Trip

    static constraints = {
        name(blank: false, unique: true, maxSize: 100)
        description(nullable: true, maxSize: 2500)
        startDate(blank: false)
        endDate(blank: false)
        location(blank: false)
    }

    int compareTo(obj) {
        startDate.compareTo(obj.startDate)
    }

    String toString() {
	    return name
	}
}