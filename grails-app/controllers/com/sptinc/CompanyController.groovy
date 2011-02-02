package com.sptinc

import grails.converters.JSON


/*
 * The controller for the Company domain. *JSON functions are used to interact with AJAX requests. All other methods were
 * created by the grails create-controller script. A separate method was used for JSON requests rather than
 * using the withFormat method because the functionality is so different.
 */
class CompanyController {

	static scaffold = true;

	static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

	def index = {
		redirect(action: "list", params: params)
	}

	def list = {
		params.max = Math.min(params.max ? params.int('max') : 10, 100)
		[companyInstanceList: Company.list(params), companyInstanceTotal: Company.count()]
	}

	/*
	 * Returns a collection of Company objects in JSON based upon the given parameters.
	 */
	def listJSON = {
		def companies = []
		for (c in Company.list(params)) {
			def company = [id: c.id, name: c.toString(), url: c.url]
			companies << company
		}

		def listResult = [total: companies.size(), items: companies]
		render listResult as JSON
	}


	def create = {
		def companyInstance = new Company()
		companyInstance.properties = params
		return [companyInstance: companyInstance]
	}

	def save = {
		def companyInstance = new Company(params)
		if (companyInstance.save(flush: true)) {
			flash.message = "${message(code: 'default.created.message', args: [message(code: 'company.label', default: 'Company'), companyInstance.id])}"
			redirect(action: "show", id: companyInstance.id)
		}
		else {
			render(view: "create", model: [companyInstance: companyInstance])
		}
	}

	/*
	 * Takes a Company object in JSON and saves it. This method acts as both the create and update.
	 */
	def saveJSON = {
		def companyInstance
		if (params.task.equals("Create")) {
			companyInstance = new Company()
			params.remove('id')
		} else {
			companyInstance = Company.get(params.id)
		}

		if (companyInstance) {
			if (params.version) {
				def version = params.version.toLong()
				if (companyInstance.version > version) {
					render "${message(code: 'default.optimistic.locking.failure', args: [message(code: 'company.label', default: 'Company'), companyInstance.id])}"
					return
				}
			}

			companyInstance.properties = params

			if (!companyInstance.hasErrors() && companyInstance.save(flush: true)) {
				def result = [success: true, data: companyInstance]
				render result as JSON
			}
			else {
				def result = [success: false, data: companyInstance.errors]
				render result as JSON
			}
		}
		else {
			def errors = [errors: "${message(code: 'default.not.found.message', args: [message(code: 'company.label', default: 'Company'), params.id])}"]
			def result = [success: false, data: errors]
			render result as JSON
		}
	}


	def show = {
		def companyInstance = Company.get(params.id)
		if (!companyInstance) {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'company.label', default: 'Company'), params.id])}"
			redirect(action: "list")
		}
		else {
			[companyInstance: companyInstance]
		}
	}

	/*
	 * Takes an id and returns a Company object in JSON.
	 */
	def showJSON = {
		def companyInstance = Company.get(params.id)
		if (!companyInstance) {
			render "${message(code: 'default.not.found.message', args: [message(code: 'company.label', default: 'Company'), params.id])}"
		}
		else {

			def company = [id: companyInstance.id, name: companyInstance.toString()]//, url: companyInstance.url]

			render company as JSON
		}
	}

	def edit = {
		def companyInstance = Company.get(params.id)
		if (!companyInstance) {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'company.label', default: 'Company'), params.id])}"
			redirect(action: "list")
		}
		else {
			return [companyInstance: companyInstance]
		}
	}

	def update = {
		def companyInstance = Company.get(params.id)
		if (companyInstance) {
			if (params.version) {
				def version = params.version.toLong()
				if (companyInstance.version > version) {

					companyInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [
						message(code: 'company.label', default: 'Company')]
					as Object[], "Another company has updated this Company while you were editing")
					render(view: "edit", model: [companyInstance: companyInstance])
					return
				}
			}
			companyInstance.properties = params
			if (!companyInstance.hasErrors() && companyInstance.save(flush: true)) {
				flash.message = "${message(code: 'default.updated.message', args: [message(code: 'company.label', default: 'Company'), companyInstance.id])}"
				redirect(action: "show", id: companyInstance.id)
			}
			else {
				render(view: "edit", model: [companyInstance: companyInstance])
			}
		}
		else {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'company.label', default: 'Company'), params.id])}"
			redirect(action: "list")
		}
	}

	def delete = {
		def companyInstance = Company.get(params.id)
		if (companyInstance) {
			try {
				companyInstance.delete(flush: true)
				flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'company.label', default: 'Company'), params.id])}"
				redirect(action: "list")
			}
			catch (org.springframework.dao.DataIntegrityViolationException e) {
				flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'company.label', default: 'Company'), params.id])}"
				redirect(action: "show", id: params.id)
			}
		}
		else {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'company.label', default: 'Company'), params.id])}"
			redirect(action: "list")
		}
	}

	/*
	 * Takes a Company id, deletes, and returns a JSON result.
	 */
	def deleteJSON = {
		def instance = Company.get(params.id)
		if (instance) {
			try {	
				def values = [id: instance.id, name: instance.getName()]
				instance.delete(flush: true)
				def result = [success: true, data: values]
				render result as JSON
			}
			catch (org.springframework.dao.DataIntegrityViolationException e) {
				def errors = [errors: "${message(code: 'default.not.deleted.message', args: [message(code: 'company.label', default: 'Company'), params.id])}"]
				def result = [success: false, data: errors]
				render result as JSON
			}
		}
		else {
			def errors = [errors: "${message(code: 'default.not.found.message', args: [message(code: 'company.label', default: 'Company'), params.id])}"]
			def result = [success: false, data: errors]
			render result as JSON
		}
	}
}
