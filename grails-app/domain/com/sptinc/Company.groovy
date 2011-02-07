package com.sptinc

/* Company descends from Organization and is meant to to represent corporations. */
class Company extends Organization {
    
	// A Company can have many users
	static hasMany = [users: User]

    static constraints = {
    }

    String toString() {
	    return super.toString()
	}
}
