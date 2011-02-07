package com.sptinc

/* A generic class for Organizations (companies and agencies) associated with Contract and Contact. */
class Organization {

    String name
    String url // Organization's website
	
	// Organizations have many Contacts and Contracts
    static hasMany = [contacts: Contact, contracts: Contract]

    static constraints = {
        name(blank: false, unique: true)
        url(url: true) // Validate as a url
    }

    int compareTo(obj) {
        name.compareTo(obj.name)
    }

    String toString() {
	    name
	}
}
