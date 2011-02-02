package com.sptinc

import grails.converters.JSON

/*
* The controller for the Report domain. *JSON functions are used to interact with AJAX requests. All other methods were
* created by the grails create-controller script. A separate method was used for JSON requests rather than
* using the withFormat method because the functionality is so different.
*/
class ReportController {

	static scaffold = true;

	static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

	def index = {
		redirect(action: "list", params: params)
	}

	def list = {
		params.max = Math.min(params.max ? params.int('max') : 10, 100)
		[reportInstanceList: Report.list(params), reportInstanceTotal: Report.count()]
	}
	
	/*
	* Returns a collection of Report objects in JSON based upon the given parameters.
	*/
	def listJSON = {
		def reports = []
		for (r in Report.list(params)) {
			def actionItems = r.getActionItems()
			def contacts = r.getContacts()
			def actionItemsList = []
			def contactsList = []

			for (a in actionItems) {
				def actionItem = [id: a.id, name: a.toString()]
				actionItemsList << actionItem
			}

			for (c in contacts) {
				def contact = [id: c.id, name: c.toString()]
				contactsList << contact
			}

			def trip = r.getTrip()
			def author = r.getAuthor()

			def report = [id: r.id, name: r.toString(), tripId: trip.id, trip: trip.toString(), authorId: author.id, author: author.toString(), usefulness: r.usefulness, topics: r.topics, issues: r.issues, actionItems: actionItemsList, contacts: contactsList]
			reports << report
		}

		def listResult = [total: reports.size(), items: reports]
		render listResult as JSON
	}

	def create = {
		def reportInstance = new Report()
		reportInstance.properties = params
		return [reportInstance: reportInstance]
	}

	def save = {
		def reportInstance = new Report(params)
		if (reportInstance.save(flush: true)) {
			flash.message = "${message(code: 'default.created.message', args: [message(code: 'report.label', default: 'Report'), reportInstance.id])}"
			redirect(action: "show", id: reportInstance.id)
		}
		else {
			render(view: "create", model: [reportInstance: reportInstance])
		}
	}
	
	/*
	 * Takes a Report object in JSON and saves it. This method acts as both the create and update.
	 */
	def saveJSON = {
		def reportInstance
		if (params.task.equals("Create")) {
			reportInstance = new Report()
			params.remove('id')
		} else {
			reportInstance = Report.get(params.id)
		}

		if (reportInstance) {
			println params
			if (params.version) {
				def version = params.version.toLong()
				if (reportInstance.version > version) {
					render "${message(code: 'default.optimistic.locking.failure', args: [message(code: 'report.label', default: 'Report'), reportInstance.id])}"
					return
				}
			}

			def actionItems = []
			if (!params.actionItems.equals("")) {
				actionItems = params.actionItems.split('[,]')
			}
			def contacts = []
			if (!params.contacts.equals("")) {
				contacts = params.contacts.split('[,]')
			}


			params.remove('actionItems')
			params.remove('contacts')
			params.trip = Trip.get(params.trip.asType(Integer))
			params.author = User.get(params.author.asType(Integer))


			if(reportInstance.actionItems!=null){
				reportInstance.actionItems.clear()
			}

			for (a in actionItems) {
				def actionItem = ActionItem.get(a.asType(Long))
				reportInstance.addToActionItems(actionItem)
			}

			if(reportInstance.contacts!=null){
				reportInstance.contacts.clear()
			}
			for (c in contacts) {
				def contact = Contact.get(c.asType(Long))
				reportInstance.addToContacts(contact);
			}

			reportInstance.properties = params

			if (!reportInstance.hasErrors() && reportInstance.save(flush: true)) {
				def result = [success: true, data: reportInstance]
				render result as JSON
			}
			else {
				def result = [success: false, data: reportInstance.errors]
				render result as JSON
			}
		}
		else {
			def errors = [errors: "${message(code: 'default.not.found.message', args: [message(code: 'report.label', default: 'Report'), params.id])}"]
			def result = [success: false, data: errors]
			render result as JSON
		}
	}


	def show = {
		def reportInstance = Report.get(params.id)
		if (!reportInstance) {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'report.label', default: 'Report'), params.id])}"
			redirect(action: "list")
		}
		else {
			[reportInstance: reportInstance]
		}
	}
	
	/*
	 * Takes an id and returns a Report object in JSON.
	 */
	def showJSON = {
		def reportInstance = Report.get(params.id)
		if (!reportInstance) {
			render "${message(code: 'default.not.found.message', args: [message(code: 'report.label', default: 'Report'), params.id])}"
		}
		else {
			def actionItems = reportInstance.getActionItems()
			def contacts = reportInstance.getContacts()
			def actionItemsList = []
			def contactsList = []

			for (a in actionItems) {
				def actionItem = [id: a.id, name: a.toString()]
				actionItemsList << actionItem
			}

			for (c in contacts) {
				def contact = [id: c.id, name: c.toString()]
				contactsList << contact
			}

			def trip = reportInstance.getTrip()
			def author = reportInstance.getAuthor()
			def report = [id: reportInstance.id, name: reportInstance.toString(), tripId: trip.id, trip: trip.toString(), authorId: author.id, author: author.toString(), usefulness: reportInstance.usefulness, topics: reportInstance.topics, issues: reportInstance.issues, actionItems: actionItemsList, contacts: contactsList]

			render report as JSON
		}
	}

	def edit = {
		def reportInstance = Report.get(params.id)
		if (!reportInstance) {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'report.label', default: 'Report'), params.id])}"
			redirect(action: "list")
		}
		else {
			return [reportInstance: reportInstance]
		}
	}

	def update = {
		def reportInstance = Report.get(params.id)
		if (reportInstance) {
			if (params.version) {
				def version = params.version.toLong()
				if (reportInstance.version > version) {

					reportInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [
						message(code: 'report.label', default: 'Report')]
					as Object[], "Another report has updated this Report while you were editing")
					render(view: "edit", model: [reportInstance: reportInstance])
					return
				}
			}
			reportInstance.properties = params
			if (!reportInstance.hasErrors() && reportInstance.save(flush: true)) {
				flash.message = "${message(code: 'default.updated.message', args: [message(code: 'report.label', default: 'Report'), reportInstance.id])}"
				redirect(action: "show", id: reportInstance.id)
			}
			else {
				render(view: "edit", model: [reportInstance: reportInstance])
			}
		}
		else {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'report.label', default: 'Report'), params.id])}"
			redirect(action: "list")
		}
	}

	def delete = {
		def reportInstance = Report.get(params.id)
		if (reportInstance) {
			try {
				reportInstance.delete(flush: true)
				flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'report.label', default: 'Report'), params.id])}"
				redirect(action: "list")
			}
			catch (org.springframework.dao.DataIntegrityViolationException e) {
				flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'report.label', default: 'Report'), params.id])}"
				redirect(action: "show", id: params.id)
			}
		}
		else {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'report.label', default: 'Report'), params.id])}"
			redirect(action: "list")
		}
	}
	
	/*
	* Takes a Report id, deletes, and returns a JSON result.
	*/
	def deleteJSON = {
		def instance = Report.get(params.id)
		if (instance) {
			try {	
				def values = [id: instance.id, name: instance.getName()]
				instance.delete(flush: true)
				def result = [success: true, data: values]
				render result as JSON
			}
			catch (org.springframework.dao.DataIntegrityViolationException e) {
				def errors = [errors: "${message(code: 'default.not.deleted.message', args: [message(code: 'report.label', default: 'Report'), params.id])}"]
				def result = [success: false, data: errors]
				render result as JSON
			}
		}
		else {
			def errors = [errors: "${message(code: 'default.not.found.message', args: [message(code: 'report.label', default: 'Report'), params.id])}"]
			def result = [success: false, data: errors]
			render result as JSON
		}
	}
}
