package com.sptinc

class User {

	String username
	String password
	String fullName
	String email
	Company company
	boolean enabled
	boolean accountExpired
	boolean accountLocked
	boolean passwordExpired

	Date dateCreated
	Date lastUpdated

	SortedSet contracts

	static hasMany = [contracts: Contract]

	static constraints = {
		username(blank: false, unique: true, maxSize: 10)
		password(blank: false)
		email(email: true, blank: false)
		company(blank: false)
	}

	static mapping = {
		password column: '`password`'
	}

	Set<Role> getAuthorities() {
		UserRole.findAllByUser(this).collect { it.role } as Set
	}

	String toString() {
	    return fullName + " @ " + company
	}

	def beforeInsert() {
	    dateCreated = new Date()
    }
    def beforeUpdate() {
        lastUpdated = new Date()
    }
}
