package com.sptinc

class Company extends Organization {
    static hasMany = [users: User]


    static constraints = {
    }

    String toString() {
	    return super.toString()
	}
}
