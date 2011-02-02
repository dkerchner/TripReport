package com.sptinc

/* A generic class for Organizations (companies and agencies) associated with Contract and Contact. */
class Organization {

    String name
    String url
	
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
