package com.sptinc

/* Records that can be thought of as To-Do list items for a report. 
 * There is no task management functionality in the application, yet. 
 */
class ActionItem {

    String name
    String description
    Date dueDate

	// Associated with a report
    static belongsTo = [report: Report]

	// Data constraints
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
