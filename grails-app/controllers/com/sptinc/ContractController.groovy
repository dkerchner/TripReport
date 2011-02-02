package com.sptinc

import grails.converters.JSON


/*
* The controller for the Contract domain. *JSON functions are used to interact with AJAX requests. All other methods were
* created by the grails create-controller script. A separate method was used for JSON requests rather than
* using the withFormat method because the functionality is so different.
*/
class ContractController {
	static scaffold = true;

	static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

	def index = {
		redirect(action: "list", params: params)
	}

	def list = {
		params.max = Math.min(params.max ? params.int('max') : 10, 100)
		[contractInstanceList: Contract.list(params), contractInstanceTotal: Contract.count()]
	}
	
	/*
	* Returns a collection of Contract objects in JSON based upon the given parameters.
	*/
	def listJSON = {
		def contracts = []
		for (c in Contract.list(params)) {
			def contract = [id: c.id, name: c.toString(), contractNumber: c.contractNumber, organization: c.organization.toString(), organizationId: c.organization.id, active: c.active]
			contracts << contract
		}

		def listResult = [total: contracts.size(), items: contracts]
		render listResult as JSON
	}


	def create = {
		def contractInstance = new Contract()
		contractInstance.properties = params
		return [contractInstance: contractInstance]
	}

	def save = {
		def contractInstance = new Contract(params)
		if (contractInstance.save(flush: true)) {
			flash.message = "${message(code: 'default.created.message', args: [message(code: 'contract.label', default: 'Contract'), contractInstance.id])}"
			redirect(action: "show", id: contractInstance.id)
		}
		else {
			render(view: "create", model: [contractInstance: contractInstance])
		}
	}
	
	/*
	 * Takes a Contract object in JSON and saves it. This method acts as both the create and update.
	 */
	def saveJSON = {
		def contractInstance
		println params
		if (params.task.equals("Create")) {
			contractInstance = new Contract()
			params.remove('id')
		} else {
			contractInstance = Contract.get(params.id)
		}

		if (contractInstance) {
			if (params.version) {
				def version = params.version.toLong()
				if (contractInstance.version > version) {
					render "${message(code: 'default.optimistic.locking.failure', args: [message(code: 'contract.label', default: 'Contract'), contractInstance.id])}"
					return
				}
			}

			params.organization = Organization.get(params.organization.asType(Integer))

			contractInstance.properties = params

			if (!contractInstance.hasErrors() && contractInstance.save(flush: true)) {
				def result = [success: true, data: contractInstance]
				render result as JSON
			}
			else {
				def result = [success: false, data: contractInstance.errors]
				render result as JSON
			}
		}
		else {
			def errors = [errors: "${message(code: 'default.not.found.message', args: [message(code: 'contract.label', default: 'Contract'), params.id])}"]
			def result = [success: false, data: errors]
			render result as JSON
		}
	}

	def show = {
		def contractInstance = Contract.get(params.id)
		if (!contractInstance) {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'contract.label', default: 'Contract'), params.id])}"
			redirect(action: "list")
		}
		else {
			[contractInstance: contractInstance]
		}
	}
	
	/*
	 * Takes an id and returns a Contract object in JSON.
	 */
	def showJSON = {
		def contractInstance = Contract.get(params.id)
		if (!contractInstance) {
			render "${message(code: 'default.not.found.message', args: [message(code: 'contract.label', default: 'Contract'), params.id])}"
		}
		else {

			def contract = [id: contractInstance.id, name: contractInstance.toString(), contractNumber: contractInstance.contractNumber, organization: contractInstance.organization.toString(), organizationId: contractInstance.organization.id, active: contractInstance.active]

			render contract as JSON
		}
	}


	def edit = {
		def contractInstance = Contract.get(params.id)
		if (!contractInstance) {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'contract.label', default: 'Contract'), params.id])}"
			redirect(action: "list")
		}
		else {
			return [contractInstance: contractInstance]
		}
	}

	def update = {
		def contractInstance = Contract.get(params.id)
		if (contractInstance) {
			if (params.version) {
				def version = params.version.toLong()
				if (contractInstance.version > version) {

					contractInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [
						message(code: 'contract.label', default: 'Contract')]
					as Object[], "Another contract has updated this Contract while you were editing")
					render(view: "edit", model: [contractInstance: contractInstance])
					return
				}
			}
			contractInstance.properties = params
			if (!contractInstance.hasErrors() && contractInstance.save(flush: true)) {
				flash.message = "${message(code: 'default.updated.message', args: [message(code: 'contract.label', default: 'Contract'), contractInstance.id])}"
				redirect(action: "show", id: contractInstance.id)
			}
			else {
				render(view: "edit", model: [contractInstance: contractInstance])
			}
		}
		else {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'contract.label', default: 'Contract'), params.id])}"
			redirect(action: "list")
		}
	}

	def delete = {
		def contractInstance = Contract.get(params.id)
		if (contractInstance) {
			try {
				contractInstance.delete(flush: true)
				flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'contract.label', default: 'Contract'), params.id])}"
				redirect(action: "list")
			}
			catch (org.springframework.dao.DataIntegrityViolationException e) {
				flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'contract.label', default: 'Contract'), params.id])}"
				redirect(action: "show", id: params.id)
			}
		}
		else {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'contract.label', default: 'Contract'), params.id])}"
			redirect(action: "list")
		}
	}
	
	/*
	* Takes a Contract id, deletes, and returns a JSON result.
	*/
	def deleteJSON = {
		def instance = Contract.get(params.id)
		if (instance) {
			try {	
				def values = [id: instance.id, name: instance.getName()]
				instance.delete(flush: true)
				def result = [success: true, data: values]
				render result as JSON
			}
			catch (org.springframework.dao.DataIntegrityViolationException e) {
				def errors = [errors: "${message(code: 'default.not.deleted.message', args: [message(code: 'contract.label', default: 'Contract'), params.id])}"]
				def result = [success: false, data: errors]
				render result as JSON
			}
		}
		else {
			def errors = [errors: "${message(code: 'default.not.found.message', args: [message(code: 'contract.label', default: 'Contract'), params.id])}"]
			def result = [success: false, data: errors]
			render result as JSON
		}
	}
}
