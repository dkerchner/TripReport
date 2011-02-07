package com.sptinc

/* Contracts linked to Trips or Users. For informational purposes only at the moment. */
class Contract {

    String contractNumber
    Organization organization // A Contract is associated with a company or agency 
    boolean active = true

    static hasMany = [trips: Trip]

	// Contracts are associated with Trips and Users
    static belongsTo = [Trip, User]

    static constraints = {
        contractNumber(blank: false, unique: true, maxSize: 100)
        organization(blank: false)
        active()
    }

    int compareTo(obj) {
        contractNumber.compareTo(obj.contractNumber)
    }

    String toString() {
	    return contractNumber + " for " + organization
	}
}
