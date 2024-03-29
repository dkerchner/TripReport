package com.sptinc

import grails.converters.JSON


/*
* The controller for the Contact domain. *JSON functions are used to interact with AJAX requests. All other methods were
* created by the grails create-controller script. A separate method was used for JSON requests rather than
* using the withFormat method because the functionality is so different.
*/
class ContactController {

	static scaffold = true;

	static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

	def index = {
		redirect(action: "list", params: params)
	}

	def list = {
		params.max = Math.min(params.max ? params.int('max') : 10, 100)
		[contactInstanceList: Contact.list(params), contactInstanceTotal: Contact.count()]
	}
	
	/*
	* Returns a collection of Contact objects in JSON based upon the given parameters.
	*/
	def listJSON = {
		def contacts = []
		def contactList

		if (params.report){
			contactList = Contact.findAllByReport(Report.get(params.report.asType(Integer)), params)
			//params.report = Report.get(params.report.asType(Integer))
		} else {
			contactList = Contact.list(params)
		}

		for (c in contactList) {
			def contact = [id: c.id, name: c.toString(), organization: c.organization.toString(), email: c.email, phoneNumber: c.phoneNumber]
			contacts << contact
		}

		def listResult = [total: contacts.size(), items: contacts]
		render listResult as JSON
	}

	def create = {
		def contactInstance = new Contact()
		contactInstance.properties = params
		return [contactInstance: contactInstance]
	}

	def save = {
		def contactInstance = new Contact(params)
		if (contactInstance.save(flush: true)) {
			flash.message = "${message(code: 'default.created.message', args: [message(code: 'contact.label', default: 'Contact'), contactInstance.id])}"
			redirect(action: "show", id: contactInstance.id)
		}
		else {
			render(view: "create", model: [contactInstance: contactInstance])
		}
	}
	
	/*
	 * Takes a Contact object in JSON and saves it. This method acts as both the create and update.
	 */
	def saveJSON = {
		def contactInstance
		if (params.task.equals("Create")) {
			contactInstance = new Contact()
			params.remove('id')
		} else {
			contactInstance = Contact.get(params.id)
		}

		if (contactInstance) {
			if (params.version) {
				def version = params.version.toLong()
				if (contactInstance.version > version) {
					render "${message(code: 'default.optimistic.locking.failure', args: [message(code: 'contact.label', default: 'Contact'), contactInstance.id])}"
					return
				}
			}

			params.organization = Organization.get(params.organization.asType(Integer))
			params.report = Report.get(params.report.asType(Integer))
			
			contactInstance.properties = params

			if (!contactInstance.hasErrors() && contactInstance.save(flush: true)) {
				def result = [success: true, data: contactInstance]
				render result as JSON
			}
			else {
				def result = [success: false, data: contactInstance.errors]
				render result as JSON
			}
		}
		else {
			def errors = [errors: "${message(code: 'default.not.found.message', args: [message(code: 'contact.label', default: 'Contact'), params.id])}"]
			def result = [success: false, data: errors]
			render result as JSON
		}
	}

	def show = {
		def contactInstance = Contact.get(params.id)
		if (!contactInstance) {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'contact.label', default: 'Contact'), params.id])}"
			redirect(action: "list")
		}
		else {
			[contactInstance: contactInstance]
		}
	}
	
	/*
	 * Takes an id and returns a Contact object in JSON.
	 */
	def showJSON = {
		def contactInstance = Contact.get(params.id)
		if (!contactInstance) {
			render "${message(code: 'default.not.found.message', args: [message(code: 'contact.label', default: 'Contact'), params.id])}"
		}
		else {

			def contact = [id: contactInstance.id, name: contactInstance.toString(), organization: contactInstance.organization.toString(), email: contactInstance.email, phoneNumber: contactInstance.phoneNumber]

			render contact as JSON
		}
	}

	def edit = {
		def contactInstance = Contact.get(params.id)
		if (!contactInstance) {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'contact.label', default: 'Contact'), params.id])}"
			redirect(action: "list")
		}
		else {
			return [contactInstance: contactInstance]
		}
	}

	def update = {
		def contactInstance = Contact.get(params.id)
		if (contactInstance) {
			if (params.version) {
				def version = params.version.toLong()
				if (contactInstance.version > version) {

					contactInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [
						message(code: 'contact.label', default: 'Contact')]
					as Object[], "Another contact has updated this Contact while you were editing")
					render(view: "edit", model: [contactInstance: contactInstance])
					return
				}
			}
			contactInstance.properties = params
			if (!contactInstance.hasErrors() && contactInstance.save(flush: true)) {
				flash.message = "${message(code: 'default.updated.message', args: [message(code: 'contact.label', default: 'Contact'), contactInstance.id])}"
				redirect(action: "show", id: contactInstance.id)
			}
			else {
				render(view: "edit", model: [contactInstance: contactInstance])
			}
		}
		else {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'contact.label', default: 'Contact'), params.id])}"
			redirect(action: "list")
		}
	}

	def delete = {
		def contactInstance = Contact.get(params.id)
		if (contactInstance) {
			try {
				contactInstance.delete(flush: true)
				flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'contact.label', default: 'Contact'), params.id])}"
				redirect(action: "list")
			}
			catch (org.springframework.dao.DataIntegrityViolationException e) {
				flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'contact.label', default: 'Contact'), params.id])}"
				redirect(action: "show", id: params.id)
			}
		}
		else {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'contact.label', default: 'Contact'), params.id])}"
			redirect(action: "list")
		}
	}
	
	/*
	* Takes a Contact id, deletes, and returns a JSON result.
	*/
	def deleteJSON = {
		def instance = Contact.get(params.id)
		if (instance) {
			try {	
				def values = [id: instance.id, name: instance.getName()]
				instance.delete(flush: true)
				def result = [success: true, data: values]
				render result as JSON
			}
			catch (org.springframework.dao.DataIntegrityViolationException e) {
				def errors = [errors: "${message(code: 'default.not.deleted.message', args: [message(code: 'contact.label', default: 'Contact'), params.id])}"]
				def result = [success: false, data: errors]
				render result as JSON
			}
		}
		else {
			def errors = [errors: "${message(code: 'default.not.found.message', args: [message(code: 'contact.label', default: 'Contact'), params.id])}"]
			def result = [success: false, data: errors]
			render result as JSON
		}
	}
}
