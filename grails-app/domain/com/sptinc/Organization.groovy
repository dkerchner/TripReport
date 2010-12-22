package com.sptinc

class Organization {

    String name
    String url
    SortedSet contacts
    SortedSet contracts

    static hasMany = [contacts: Contact, contracts: Contract]

    static constraints = {
        name(blank: false, unique: true)
        url(url: true)
    }

    int compareTo(obj) {
        name.compareTo(obj.name)
    }

    String toString() {
	    name
	}
}
