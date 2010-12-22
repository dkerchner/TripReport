package com.sptinc

class ActionItem {

    String name
    String description
    Date dueDate
    Report tripReport

    static belongsTo = [tripReport: Report]

    static constraints = {
        name(blank: false, unique: true, maxSize: 100)
        description(nullable: true, maxSize: 2500)
        dueDate(nullable: true)
    }

    int compareTo(obj) {
        name.compareTo(obj.name)
    }

    String toString() {
	    return name
	}
}
