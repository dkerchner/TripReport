package com.sptinc

class Role {

	String authority

	static hasMany = [userRoles: UserRole]
	
	static mapping = {
		cache true
	}

	static constraints = {
		authority blank: false, unique: true
	}
}
