package com.sptinc

class Contract {

    String contractNumber
    Organization organization
    User manager
    boolean active

    static hasMany = [trips: Report, users: User]

    static belongsTo = [com.sptinc.Trip, com.sptinc.User]

    static constraints = {
        contractNumber(blank: false, unique: true, maxSize: 100)
        organization(blank: false)
    }

    int compareTo(obj) {
        contractNumber.compareTo(obj.contractNumber)
    }

    String toString() {
	    return contractNumber + " for " + organization
	}
}
