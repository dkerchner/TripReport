package com.sptinc

import java.util.Set;

import org.apache.commons.lang.builder.HashCodeBuilder

/* This class is an implementation  of the Join Table between Users and Roles. This is usually 
 * auto-managed by Grails in a Has, however more functionality was needed. 
 * This class was automatically generated by the Spring Security Grails plugin, with some additional modifications.
 */
class UserRole implements Serializable {

	User user
	Role role

	boolean equals(other) {
		if (!(other instanceof UserRole)) {
			return false
		}

		other.user?.id == user?.id &&
			other.role?.id == role?.id
	}

	int hashCode() {
		def builder = new HashCodeBuilder()
		if (user) builder.append(user.id)
		if (role) builder.append(role.id)
		builder.toHashCode()
	}

	// Get helper function for User and Role
	static UserRole get(long userId, long roleId) {
		find 'from UserRole where user.id=:userId and role.id=:roleId',
			[userId: userId, roleId: roleId]
	}
	
	// Create function that can flush or not
	static UserRole create(User user, com.sptinc.Role role, boolean flush = false) {
		new UserRole(user: user, role: role).save(flush: flush, insert: true)
	}

	// Delete function that can flush or not
	static boolean remove(User user, com.sptinc.Role role, boolean flush = false) {
		UserRole instance = UserRole.findByUserAndRole(user, role)
		instance ? instance.delete(flush: flush) : false
	}
	
	// Clears all roles for a User, this is needed in rollback instances instead of removeAll
	static boolean clearAll(User user, boolean flush = false) {
		UserRole instances = UserRole.findByUser(user)
		for (ur in instances) {
			ur.delete(flush: flush)
		}
	}

	// Deletes all UserRoles for a User
	static void removeAll(User user) {
		executeUpdate 'DELETE FROM UserRole WHERE user=:user', [user: user]
	}

	// Deletes all UserRoles for a Role
	static void removeAll(Role role) {
		executeUpdate 'DELETE FROM UserRole WHERE role=:role', [role: role]
	}

	// Composite id mapping
	static mapping = {
		id composite: ['role', 'user']
		version false
	}
}
