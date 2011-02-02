package com.sptinc

import grails.converters.JSON

/*
* The controller for the Agency domain. *JSON functions are used to interact with AJAX requests. All other methods were
* created by the grails create-controller script. A separate method was used for JSON requests rather than
* using the withFormat method because the functionality is so different.
*/
class AgencyController {

	static scaffold = true

	static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

	def index = {
		redirect(action: "list", params: params)
	}

	def list = {
		params.max = Math.min(params.max ? params.int('max') : 10, 100)
		[agencyInstanceList: Agency.list(params), agencyInstanceTotal: Agency.count()]
	}
	
	/*
	* Returns a collection of Agency objects in JSON based upon the given parameters.
	*/
	def listJSON = {
		def agencies = []
		for (a in Agency.list(params)) {
			def agency = [id: a.id, name: a.toString(), url: a.url]
			agencies << agency
		}

		def listResult = [total: agencies.size(), items: agencies]
		render listResult as JSON
	}

	def create = {
		def agencyInstance = new Agency()
		agencyInstance.properties = params
		return [agencyInstance: agencyInstance]
	}

	def save = {
		def agencyInstance = new Agency(params)
		if (agencyInstance.save(flush: true)) {
			flash.message = "${message(code: 'default.created.message', args: [message(code: 'agency.label', default: 'Agency'), agencyInstance.id])}"
			redirect(action: "show", id: agencyInstance.id)
		}
		else {
			render(view: "create", model: [agencyInstance: agencyInstance])
		}
	}
	
	/*
	 * Takes a Agency object in JSON and saves it. This method acts as both the create and update.
	 */
	def saveJSON = {
		def agencyInstance
		if (params.task.equals("Create")) {
			agencyInstance = new Agency()
			params.remove('id')
		} else {
			agencyInstance = Agency.get(params.id)
		}

		if (agencyInstance) {
			if (params.version) {
				def version = params.version.toLong()
				if (agencyInstance.version > version) {
					render "${message(code: 'default.optimistic.locking.failure', args: [message(code: 'agency.label', default: 'Agency'), agencyInstance.id])}"
					return
				}
			}

			agencyInstance.properties = params

			if (!agencyInstance.hasErrors() && agencyInstance.save(flush: true)) {
				def result = [success: true, data: agencyInstance]
				render result as JSON
			}
			else {
				def result = [success: false, data: agencyInstance.errors]
				render result as JSON
			}
		}
		else {
			def errors = [errors: "${message(code: 'default.not.found.message', args: [message(code: 'agency.label', default: 'Agency'), params.id])}"]
			def result = [success: false, data: errors]
			render result as JSON
		}
	}


	def show = {
		def agencyInstance = Agency.get(params.id)
		if (!agencyInstance) {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'agency.label', default: 'Agency'), params.id])}"
			redirect(action: "list")
		}
		else {
			[agencyInstance: agencyInstance]
		}
	}
	
	/*
	 * Takes an id and returns a Agency object in JSON.
	 */
	def showJSON = {
		def agencyInstance = Agency.get(params.id)
		if (!agencyInstance) {
			render "${message(code: 'default.not.found.message', args: [message(code: 'agency.label', default: 'Agency'), params.id])}"
		}
		else {

			def agency = [id: agencyInstance.id, name: agencyInstance.toString(), url: agencyInstance.url]

			render agency as JSON
		}
	}

	def edit = {
		def agencyInstance = Agency.get(params.id)
		if (!agencyInstance) {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'agency.label', default: 'Agency'), params.id])}"
			redirect(action: "list")
		}
		else {
			return [agencyInstance: agencyInstance]
		}
	}

	def update = {
		def agencyInstance = Agency.get(params.id)
		if (agencyInstance) {
			if (params.version) {
				def version = params.version.toLong()
				if (agencyInstance.version > version) {

					agencyInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [
						message(code: 'agency.label', default: 'Agency')]
					as Object[], "Another agency has updated this Agency while you were editing")
					render(view: "edit", model: [agencyInstance: agencyInstance])
					return
				}
			}
			agencyInstance.properties = params
			if (!agencyInstance.hasErrors() && agencyInstance.save(flush: true)) {
				flash.message = "${message(code: 'default.updated.message', args: [message(code: 'agency.label', default: 'Agency'), agencyInstance.id])}"
				redirect(action: "show", id: agencyInstance.id)
			}
			else {
				render(view: "edit", model: [agencyInstance: agencyInstance])
			}
		}
		else {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'agency.label', default: 'Agency'), params.id])}"
			redirect(action: "list")
		}
	}

	def delete = {
		def agencyInstance = Agency.get(params.id)
		if (agencyInstance) {
			try {
				agencyInstance.delete(flush: true)
				flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'agency.label', default: 'Agency'), params.id])}"
				redirect(action: "list")
			}
			catch (org.springframework.dao.DataIntegrityViolationException e) {
				flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'agency.label', default: 'Agency'), params.id])}"
				redirect(action: "show", id: params.id)
			}
		}
		else {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'agency.label', default: 'Agency'), params.id])}"
			redirect(action: "list")
		}
	}
	
	/*
	* Takes a Agency id, deletes, and returns a JSON result.
	*/
	def deleteJSON = {
		def instance = Agency.get(params.id)
		if (instance) {
			try {	
				def values = [id: instance.id, name: instance.getName()]
				instance.delete(flush: true)
				def result = [success: true, data: values]
				render result as JSON
			}
			catch (org.springframework.dao.DataIntegrityViolationException e) {
				def errors = [errors: "${message(code: 'default.not.deleted.message', args: [message(code: 'agency.label', default: 'Agency'), params.id])}"]
				def result = [success: false, data: errors]
				render result as JSON
			}
		}
		else {
			def errors = [errors: "${message(code: 'default.not.found.message', args: [message(code: 'agency.label', default: 'Agency'), params.id])}"]
			def result = [success: false, data: errors]
			render result as JSON
		}
	}
}
