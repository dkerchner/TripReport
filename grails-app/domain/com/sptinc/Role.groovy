package com.sptinc

/* This class composes the authority level (user or admin) of the User. 
 * This class was automatically generated by the Spring Security Grails plugin. 
 */
class Role {

	String authority

	// Each Role can be assigned to many Users through the UserRole join table
	static hasMany = [userRoles: UserRole]
	
	static mapping = {
		cache true
	}

	static constraints = {
		authority blank: false, unique: true
	}
}
