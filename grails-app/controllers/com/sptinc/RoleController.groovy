package com.sptinc

import grails.converters.JSON

/*
* The controller for the Role domain. *JSON functions are used to interact with AJAX requests. All other methods were
* created by the grails create-controller script. A separate method was used for JSON requests rather than
* using the withFormat method because the functionality is so different.
*/
class RoleController {

	static scaffold = true;

	static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

	def index = {
		redirect(action: "list", params: params)
	}

	def list = {
		params.max = Math.min(params.max ? params.int('max') : 10, 100)
		[roleInstanceList: Role.list(params), roleInstanceTotal: Role.count()]
	}
	
	/*
	* Returns a collection of Role objects in JSON based upon the given parameters.
	*/
	def listJSON = {
		def roles = []
		for (r in Role.list(params)) {
			def role = [id: r.id, name: r.authority]
			roles << role
		}

		def listResult = [total: roles.size(), items: roles]
		render listResult as JSON
	}

	def create = {
		def roleInstance = new Role()
		roleInstance.properties = params
		return [roleInstance: roleInstance]
	}

	def save = {
		def roleInstance = new Role(params)
		if (roleInstance.save(flush: true)) {
			flash.message = "${message(code: 'default.created.message', args: [message(code: 'role.label', default: 'Role'), roleInstance.id])}"
			redirect(action: "show", id: roleInstance.id)
		}
		else {
			render(view: "create", model: [roleInstance: roleInstance])
		}
	}
	
	/*
	 * Takes a Role object in JSON and saves it. This method acts as both the create and update.
	 */
	def saveJSON = {
		def roleInstance
		if (params.task.equals("Create")) {
			roleInstance = new Role()
			params.remove('id')
		} else {
			roleInstance = Role.get(params.id)
		}

		if (roleInstance) {
			if (params.version) {
				def version = params.version.toLong()
				if (roleInstance.version > version) {
					render "${message(code: 'default.optimistic.locking.failure', args: [message(code: 'role.label', default: 'Role'), roleInstance.id])}"
					return
				}
			}

			roleInstance.properties = params

			if (!roleInstance.hasErrors() && roleInstance.save(flush: true)) {
				def result = [success: true, data: roleInstance]
				render result as JSON
			}
			else {
				def result = [success: false, data: roleInstance.errors]
				render result as JSON
			}
		}
		else {
			def errors = [errors: "${message(code: 'default.not.found.message', args: [message(code: 'role.label', default: 'Role'), params.id])}"]
			def result = [success: false, data: errors]
			render result as JSON
		}
	}


	def show = {
		def roleInstance = Role.get(params.id)
		if (!roleInstance) {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'role.label', default: 'Role'), params.id])}"
			redirect(action: "list")
		}
		else {
			[roleInstance: roleInstance]
		}
	}
	
	/*
	 * Takes an id and returns a Role object in JSON.
	 */
	def showJSON = {
		def roleInstance = Role.get(params.id)
		if (!roleInstance) {
			render "${message(code: 'default.not.found.message', args: [message(code: 'role.label', default: 'Role'), params.id])}"
		}
		else {

			def role = [id: roleInstance.id, name: roleInstance.authority]

			render role as JSON
		}
	}

	def edit = {
		def roleInstance = Role.get(params.id)
		if (!roleInstance) {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'role.label', default: 'Role'), params.id])}"
			redirect(action: "list")
		}
		else {
			return [roleInstance: roleInstance]
		}
	}

	def update = {
		def roleInstance = Role.get(params.id)
		if (roleInstance) {
			if (params.version) {
				def version = params.version.toLong()
				if (roleInstance.version > version) {

					roleInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [
						message(code: 'role.label', default: 'Role')]
					as Object[], "Another role has updated this Role while you were editing")
					render(view: "edit", model: [roleInstance: roleInstance])
					return
				}
			}
			roleInstance.properties = params
			if (!roleInstance.hasErrors() && roleInstance.save(flush: true)) {
				flash.message = "${message(code: 'default.updated.message', args: [message(code: 'role.label', default: 'Role'), roleInstance.id])}"
				redirect(action: "show", id: roleInstance.id)
			}
			else {
				render(view: "edit", model: [roleInstance: roleInstance])
			}
		}
		else {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'role.label', default: 'Role'), params.id])}"
			redirect(action: "list")
		}
	}

	def delete = {
		def roleInstance = Role.get(params.id)
		if (roleInstance) {
			try {
				roleInstance.delete(flush: true)
				flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'role.label', default: 'Role'), params.id])}"
				redirect(action: "list")
			}
			catch (org.springframework.dao.DataIntegrityViolationException e) {
				flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'role.label', default: 'Role'), params.id])}"
				redirect(action: "show", id: params.id)
			}
		}
		else {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'role.label', default: 'Role'), params.id])}"
			redirect(action: "list")
		}
	}
	
	/*
	* Takes a Role id, deletes, and returns a JSON result.
	*/
	def deleteJSON = {
		def instance = Role.get(params.id)
		if (instance) {
			try {	
				def values = [id: instance.id, name: instance.getName()]
				instance.delete(flush: true)
				def result = [success: true, data: values]
				render result as JSON
			}
			catch (org.springframework.dao.DataIntegrityViolationException e) {
				def errors = [errors: "${message(code: 'default.not.deleted.message', args: [message(code: 'role.label', default: 'Role'), params.id])}"]
				def result = [success: false, data: errors]
				render result as JSON
			}
		}
		else {
			def errors = [errors: "${message(code: 'default.not.found.message', args: [message(code: 'role.label', default: 'Role'), params.id])}"]
			def result = [success: false, data: errors]
			render result as JSON
		}
	}
}
