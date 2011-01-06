package com.sptinc

class Location {

    String city
    String state
    String country

    //SortedSet events

    static hasMany = [events: Event]

    static constraints = {
        city(blank: false, maxSize: 100)
        state(maxSize: 2)
        country(blank: false, maxSize: 100)
    }

    int compareTo(obj) {
        city.compareTo(obj.city)
    }

    String toString() {
        return city + ", " + country
    }
}
