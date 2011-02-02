package com.sptinc

import grails.converters.JSON
/*
* The controller for the Event domain. *JSON functions are used to interact with AJAX requests. All other methods were
* created by the grails create-controller script. A separate method was used for JSON requests rather than
* using the withFormat method because the functionality is so different.
*/
class EventController {

	def df = new java.text.SimpleDateFormat("yy/MM/dd")

	static scaffold = true;

	static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

	def index = {
		redirect(action: "list", params: params)
	}

	def list = {
		params.max = Math.min(params.max ? params.int('max') : 10, 100)
		[eventInstanceList: Event.list(params), eventInstanceTotal: Event.count()]
	}
	
	/*
	* Returns a collection of Event objects in JSON based upon the given parameters.
	*/
	def listJSON = {
		def events = []
		for (e in Event.list(params)) {
			def tripList = []

			def trips = e.getTrips()
			for (t in trips) {
				def trip = [id: t.id, name: t.toString()]
				tripList << trip
			}


			def loc = e.getLocation()
			def location = [id: loc.id, name: loc.toString()]
			def event = [id: e.id, name: e.toString(), startDate: e.startDate, endDate: e.endDate, url: e.url, location: location, trips: tripList]
			events << event
		}

		def listResult = [total: events.size(), items: events]
		render listResult as JSON
	}

	def create = {
		def eventInstance = new Event()
		eventInstance.properties = params
		return [eventInstance: eventInstance]
	}

	def save = {
		def eventInstance = new Event(params)
		if (eventInstance.save(flush: true)) {
			flash.message = "${message(code: 'default.created.message', args: [message(code: 'event.label', default: 'Event'), eventInstance.id])}"
			redirect(action: "show", id: eventInstance.id)
		}
		else {
			render(view: "create", model: [eventInstance: eventInstance])
		}
	}
	
	/*
	 * Takes a Event object in JSON and saves it. This method acts as both the create and update.
	 */
	def saveJSON = {
		def eventInstance
		if (params.task.equals("Create")) {
			eventInstance = new Event()
			params.remove('id')
		} else {
			eventInstance = Event.get(params.id)
		}

		if (eventInstance) {
			if (params.version) {
				def version = params.version.toLong()
				if (eventInstance.version > version) {
					render "${message(code: 'default.optimistic.locking.failure', args: [message(code: 'event.label', default: 'Event'), eventInstance.id])}"
					return
				}
			}

			eventInstance.properties = params

			if (!eventInstance.hasErrors() && eventInstance.save(flush: true)) {
				def result = [success: true, data: eventInstance]
				render result as JSON
			}
			else {
				def result = [success: false, data: eventInstance.errors]
				render result as JSON
			}
		}
		else {
			def errors = [errors: "${message(code: 'default.not.found.message', args: [message(code: 'event.label', default: 'Event'), params.id])}"]
			def result = [success: false, data: errors]
			render result as JSON
		}
	}


	def show = {
		def eventInstance = Event.get(params.id)
		if (!eventInstance) {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'event.label', default: 'Event'), params.id])}"
			redirect(action: "list")
		}
		else {
			[eventInstance: eventInstance]
		}
	}
	
	/*
	 * Takes an id and returns a Event object in JSON.
	 */
	def showJSON = {
		def eventInstance = Event.get(params.id)
		if (!eventInstance) {
			render "${message(code: 'default.not.found.message', args: [message(code: 'event.label', default: 'Event'), params.id])}"
		}
		else {
			def tripList = []

			def trips = eventInstance.getTrips()
			for (t in trips) {
				def trip = [id: t.id, name: t.toString()]
				tripList << trip
			}


			def loc = eventInstance.getLocation()
			def location = [id: loc.id, name: loc.toString()]

			def event = [id: eventInstance.id, name: eventInstance.toString(), startDate: eventInstance.startDate, endDate: eventInstance.endDate, location: location, trips: tripList]

			render event as JSON
		}
	}

	def edit = {
		def eventInstance = Event.get(params.id)
		if (!eventInstance) {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'event.label', default: 'Event'), params.id])}"
			redirect(action: "list")
		}
		else {
			return [eventInstance: eventInstance]
		}
	}

	def update = {
		def eventInstance = Event.get(params.id)
		if (eventInstance) {
			if (params.version) {
				def version = params.version.toLong()
				if (eventInstance.version > version) {

					eventInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [
						message(code: 'event.label', default: 'Event')]
					as Object[], "Another event has updated this Event while you were editing")
					render(view: "edit", model: [eventInstance: eventInstance])
					return
				}
			}
			eventInstance.properties = params
			if (!eventInstance.hasErrors() && eventInstance.save(flush: true)) {
				flash.message = "${message(code: 'default.updated.message', args: [message(code: 'event.label', default: 'Event'), eventInstance.id])}"
				redirect(action: "show", id: eventInstance.id)
			}
			else {
				render(view: "edit", model: [eventInstance: eventInstance])
			}
		}
		else {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'event.label', default: 'Event'), params.id])}"
			redirect(action: "list")
		}
	}

	def delete = {
		def eventInstance = Event.get(params.id)
		if (eventInstance) {
			try {
				eventInstance.delete(flush: true)
				flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'event.label', default: 'Event'), params.id])}"
				redirect(action: "list")
			}
			catch (org.springframework.dao.DataIntegrityViolationException e) {
				flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'event.label', default: 'Event'), params.id])}"
				redirect(action: "show", id: params.id)
			}
		}
		else {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'event.label', default: 'Event'), params.id])}"
			redirect(action: "list")
		}
	}
	
	/*
	* Takes a Event id, deletes, and returns a JSON result.
	*/
	def deleteJSON = {
		def instance = Event.get(params.id)
		if (instance) {
			try {	
				def values = [id: instance.id, name: instance.getName()]
				instance.delete(flush: true)
				def result = [success: true, data: values]
				render result as JSON
			}
			catch (org.springframework.dao.DataIntegrityViolationException e) {
				def errors = [errors: "${message(code: 'default.not.deleted.message', args: [message(code: 'event.label', default: 'Event'), params.id])}"]
				def result = [success: false, data: errors]
				render result as JSON
			}
		}
		else {
			def errors = [errors: "${message(code: 'default.not.found.message', args: [message(code: 'event.label', default: 'Event'), params.id])}"]
			def result = [success: false, data: errors]
			render result as JSON
		}
	}
}
