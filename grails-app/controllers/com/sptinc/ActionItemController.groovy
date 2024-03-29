package com.sptinc

import grails.converters.JSON
/*
* The controller for the ActionItem domain. *JSON functions are used to interact with AJAX requests. All other methods were
* created by the grails create-controller script. A separate method was used for JSON requests rather than
* using the withFormat method because the functionality is so different.
*/
class ActionItemController {

	def df = new java.text.SimpleDateFormat("MM/dd/yy")

	static scaffold = ActionItem;

	static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

	def index = {
	 redirect(action: "list", params: params)
	 } 

	def list = {
		params.max = Math.min(params.max ? params.int('max') : 10, 100)
		[actionItemInstanceList: ActionItem.list(params), actionItemInstanceTotal: ActionItem.count()]
	}

	/*
	* Returns a collection of ActionItem objects in JSON based upon the given parameters.
	*/
	def listJSON = {
		def actionItems = []
		def actionItemList

		if (params.report){
			actionItemList = ActionItem.findAllByReport(Report.get(params.report.asType(Integer)), params)
		} else {
			actionItemList = ActionItem.list(params)
		}

		for (ai in actionItemList) {
			def actionItem = [id: ai.id, name: ai.toString(), description: ai.description, report: ai.report.toString(), reportId: ai.report.id, dueDate: ai.dueDate]
			actionItems << actionItem
		}

		def listResult = [total: actionItems.size(), items: actionItems]
		render listResult as JSON
	}


	def create = {
		def actionItemInstance = new ActionItem()
		actionItemInstance.properties = params
		return [actionItemInstance: actionItemInstance]
	}

	def save = {
		def actionItemInstance = new ActionItem(params)
		if (actionItemInstance.save(flush: true)) {
			flash.message = "${message(code: 'default.created.message', args: [message(code: 'actionItem.label', default: 'ActionItem'), actionItemInstance.id])}"
			redirect(action: "show", id: actionItemInstance.id)
		}
		else {
			render(view: "create", model: [actionItemInstance: actionItemInstance])
		}
	}
	
	/*
	 * Takes a ActionItem object in JSON and saves it. This method acts as both the create and update.
	 */
	def saveJSON = {
		def actionItemInstance
		if (params.task.equals("Create")) {
			actionItemInstance = new ActionItem()
			params.remove('id')
		} else {
			actionItemInstance = ActionItem.get(params.id)
		}

		if (actionItemInstance) {
			if (params.version) {
				def version = params.version.toLong()
				if (actionItemInstance.version > version) {
					render "${message(code: 'default.optimistic.locking.failure', args: [message(code: 'actionItem.label', default: 'ActionItem'), actionItemInstance.id])}"
					return
				}
			}
			actionItemInstance.setProperty('dueDate', df.parse(params.dueDate))
			params.remove('dueDate')

			params.report = Report.get(params.report.asType(Integer))
			actionItemInstance.properties = params

			if (!actionItemInstance.hasErrors() && actionItemInstance.save(flush: true)) {
				def result = [success: true, data: actionItemInstance]
				render result as JSON
			}
			else {
				def result = [success: false, data: actionItemInstance.errors]
				render result as JSON
			}
		}
		else {
			def errors = [errors: "${message(code: 'default.not.found.message', args: [message(code: 'actionItem.label', default: 'ActionItem'), params.id])}"]
			def result = [success: false, data: errors]
			render result as JSON
		}
	}


	def show = {
		def actionItemInstance = ActionItem.get(params.id)
		if (!actionItemInstance) {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'actionItem.label', default: 'ActionItem'), params.id])}"
			redirect(action: "list")
		}
		else {
			[actionItemInstance: actionItemInstance]
		}
	}
	
	/*
	 * Takes an id and returns a ActionItem object in JSON.
	 */
	def showJSON = {
		def actionItemInstance = ActionItem.get(params.id)
		if (!actionItemInstance) {
			render "${message(code: 'default.not.found.message', args: [message(code: 'actionItem.label', default: 'ActionItem'), params.id])}"
		}
		else {

			def actionItem = [id: actionItemInstance.id, name: actionItemInstance.toString(), description: actionItemInstance.description, report: actionItemInstance.report.toString(), reportId: actionItemInstance.report.id, dueDate: actionItemInstance.dueDate]

			render actionItem as JSON
		}
	}

	def edit = {
		def actionItemInstance = ActionItem.get(params.id)
		if (!actionItemInstance) {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'actionItem.label', default: 'ActionItem'), params.id])}"
			redirect(action: "list")
		}
		else {
			return [actionItemInstance: actionItemInstance]
		}
	}

	def update = {
		def actionItemInstance = ActionItem.get(params.id)
		if (actionItemInstance) {
			if (params.version) {
				def version = params.version.toLong()
				if (actionItemInstance.version > version) {

					actionItemInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [
						message(code: 'actionItem.label', default: 'ActionItem')]
					as Object[], "Another actionItem has updated this ActionItem while you were editing")
					render(view: "edit", model: [actionItemInstance: actionItemInstance])
					return
				}
			}
			actionItemInstance.properties = params
			if (!actionItemInstance.hasErrors() && actionItemInstance.save(flush: true)) {
				flash.message = "${message(code: 'default.updated.message', args: [message(code: 'actionItem.label', default: 'ActionItem'), actionItemInstance.id])}"
				redirect(action: "show", id: actionItemInstance.id)
			}
			else {
				render(view: "edit", model: [actionItemInstance: actionItemInstance])
			}
		}
		else {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'actionItem.label', default: 'ActionItem'), params.id])}"
			redirect(action: "list")
		}
	}

	def delete = {
		def actionItemInstance = ActionItem.get(params.id)
		if (actionItemInstance) {
			try {
				actionItemInstance.delete(flush: true)
				flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'actionItem.label', default: 'ActionItem'), params.id])}"
				redirect(action: "list")
			}
			catch (org.springframework.dao.DataIntegrityViolationException e) {
				flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'actionItem.label', default: 'ActionItem'), params.id])}"
				redirect(action: "show", id: params.id)
			}
		}
		else {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'actionItem.label', default: 'ActionItem'), params.id])}"
			redirect(action: "list")
		}
	}
	
	/*
	* Takes a ActionItem id, deletes, and returns a JSON result.
	*/
	def deleteJSON = {
		def instance = ActionItem.get(params.id)
		if (instance) {
			try {	
				def values = [id: instance.id, name: instance.getName()]
				instance.delete(flush: true)
				def result = [success: true, data: values]
				render result as JSON
			}
			catch (org.springframework.dao.DataIntegrityViolationException e) {
				def errors = [errors: "${message(code: 'default.not.deleted.message', args: [message(code: 'actionItem.label', default: 'ActionItem'), params.id])}"]
				def result = [success: false, data: errors]
				render result as JSON
			}
		}
		else {
			def errors = [errors: "${message(code: 'default.not.found.message', args: [message(code: 'actionItem.label', default: 'ActionItem'), params.id])}"]
			def result = [success: false, data: errors]
			render result as JSON
		}
	}
}
