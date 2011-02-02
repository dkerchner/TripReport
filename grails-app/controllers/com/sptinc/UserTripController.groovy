package com.sptinc

import grails.converters.JSON
/*
 * The controller for the UserTrip domain. *JSON functions are used to interact with AJAX requests. All other methods were
 * created by the grails create-controller script. A separate method was used for JSON requests rather than
 * using the withFormat method because the functionality is so different.
 */
import grails.plugins.springsecurity.Secured

class UserTripController {
	def df = new java.text.SimpleDateFormat("MM/dd/yy")

	static scaffold = true;

	static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

	def springSecurityService


	def index = {
		redirect(action: "list", params: params)
	}

	def list = {
		params.max = Math.min(params.max ? params.int('max') : 10, 100)
		[tripInstanceList: UserTrip.list(params), tripInstanceTotal: UserTrip.count()]
	}

	/*
	 * Returns a collection of UserTrip objects in JSON based upon the given parameters.
	 */
	def listJSON = {
		def trips = []
		for (t in Trip.list()) {
			def eventList = []
			def contractList = []
			def locationList = []
			def attendeeList = []

			def events = t.getEvents()
			for (e in events) {
				def event = [id: e.id, name: e.toString()]
				eventList << event
			}

			def contracts = t.getContracts()
			for (c in contracts) {
				def contract = [id: c.id, name: c.toString()]
				contractList << contract
			}

			def locations = t.getLocations()

			for (l in locations) {
				def location = [id: l.id, name: l.toString()]
				locationList << location
			}

			def attendees = t.getAttendees()

			for (a in attendees) {
				def attendeeTrip = UserTrip.get(a.id, t.id)
				def trip = [id: attendeeTrip.id, name: t.toString(), purpose: t.purpose, startDate: t.startDate, endDate: t.endDate, estimatedCost: t.estimatedCost, events: eventList, attendee: a.toString(), attendeeId: a.id, tripId: t.id, approved: attendeeTrip.approved, approvedBy: attendeeTrip.approvedBy == null ? "" : attendeeTrip.approvedBy.toString(), locations: locationList, contracts: contractList]
				trips << trip
			}
		}

		def listResult = [total: trips.size(), items: trips]
		render listResult as JSON
	}

	/*
	 * Takes a trip id, assigns the current user to the trip, and returns a JSON result.
	 */
	def attendJSON = {
		def user = User.get(springSecurityService.principal.id)

		UserTrip userTrip = UserTrip.get(user.id, params.int('id'))
		if (!userTrip) {
			Trip trip = Trip.get(params.id)
			if (UserTrip.create(user, trip)) {
				render "1"
			} else {
				render "${message(code: 'Could not update. A necessary value is missing.', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
			}
		} else {
			render "${message(code: 'You have already requested to attend this trip.', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
		}
	}

	/*
	 * Takes a trip id, sets the current trip approved with the current credentials, and returns a JSON result.
	 */
	@Secured(['ROLE_ADMIN'])
	def approveJSON = {
		def mgr = User.get(springSecurityService.principal.id)

		UserTrip userTrip = UserTrip.get(params.int('attendeeId'), params.int('tripId'))
		if (userTrip && !userTrip.approved) {
			userTrip.approved = true
			userTrip.approvedBy = mgr
			if (userTrip.save(flush: true)) {
				render "1"
			} else {
				render "${message(code: 'Could not update. A necessary value is missing.', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
			}
		} else {
			render "${message(code: 'You have already approved this trip.', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
		}
	}

	/*
	 * Takes an id and returns a UserTrip object in JSON.
	 */
	def showJSON = {
		UserTrip attendeeTrip = UserTrip.get(params.int('attendeeId'), params.int('tripId'))
		if (!attendeeTrip) {
			render "${message(code: 'default.not.found.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
		}
		else {
			def t = attendeeTrip.trip
			def a = attendeeTrip.attendee

			def eventList = []
			def contractList = []
			def locationList = []

			def events = t.getEvents()
			for (e in events) {
				def event = [id: e.id, name: e.toString()]
				eventList << event
			}

			def contracts = t.getContracts()
			for (c in contracts) {
				def contract = [id: c.id, name: c.toString()]
				contractList << contract
			}

			def locations = t.getLocations()

			for (l in locations) {
				def location = [id: l.id, name: l.toString()]
				locationList << location
			}

			def trip = [id: t.id, name: t.toString(), purpose: t.purpose, startDate: t.startDate, endDate: t.endDate, estimatedCost: t.estimatedCost, events: eventList, attendee: a.toString(), attendeeId: a.id, tripId: t.id, approved: attendeeTrip.approved, approvedBy: attendeeTrip.approvedBy == null ? "" : attendeeTrip.approvedBy.toString(), locations: locationList, contracts: contractList]

			render trip as JSON
		}
	}


	def delete = {
		UserTrip tripInstance = UserTrip.get(params.int('attendeeId'), params.int('tripId'))
		if (tripInstance) {
			try {
				tripInstance.delete(flush: true)
				flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
				redirect(action: "list")
			}
			catch (org.springframework.dao.DataIntegrityViolationException e) {
				flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
				redirect(action: "show", id: params.id)
			}
		}
		else {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
			redirect(action: "list")
		}
	}

	/*
	 * Takes a User id, deletes, and returns a JSON result.
	 */
	def deleteJSON = {
		def instance = UserTrip.get(params.int('attendeeId'), params.int('tripId'))
		if (instance) {
			try {	
				def values = [id: instance.id, name: instance.getName()]
				instance.delete(flush: true)
				def result = [success: true, data: values]
				render result as JSON
			}
			catch (org.springframework.dao.DataIntegrityViolationException e) {
				def errors = [errors: "${message(code: 'default.not.deleted.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"]
				def result = [success: false, data: errors]
				render result as JSON
			}
		}
		else {
			def errors = [errors: "${message(code: 'default.not.found.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"]
			def result = [success: false, data: errors]
			render result as JSON
		}
	}
}
