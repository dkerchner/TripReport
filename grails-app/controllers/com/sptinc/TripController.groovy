package com.sptinc

import grails.converters.JSON

class TripController {

  def df = new java.text.SimpleDateFormat("MM/dd/yy")

  static scaffold = true;

  static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

  def springSecurityService


  def index = {
    redirect(action: "list", params: params)
  }

  def list = {
    params.max = Math.min(params.max ? params.int('max') : 10, 100)
    [tripInstanceList: Trip.list(params), tripInstanceTotal: Trip.count()]
  }

  def listJSON = {
    def trips = []
    for (t in Trip.list(params)) {
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
        def attendee = [id: a.id, name: a.toString()]
        attendeeList << attendee
      }

      def trip = [id: t.id, name: t.toString(), purpose: t.purpose, startDate: t.startDate, endDate: t.endDate, estimatedCost: t.estimatedCost, events: eventList, attendees: attendeeList, locations: locationList, contracts: contractList]
      trips << trip
    }

    def listResult = [total: trips.size(), items: trips]
    render listResult as JSON
  }


  def create = {
    def tripInstance = new Trip()
    tripInstance.properties = params
    return [tripInstance: tripInstance]
  }

  def save = {
    def tripInstance = new Trip(params)
    if (tripInstance.save(flush: true)) {
      flash.message = "${message(code: 'default.created.message', args: [message(code: 'trip.label', default: 'Trip'), tripInstance.id])}"
      redirect(action: "show", id: tripInstance.id)
    }
    else {
      render(view: "create", model: [tripInstance: tripInstance])
    }
  }

  def saveJSON = {
    def tripInstance
    if (params.task.equals("Create")) {
      tripInstance = new Trip()
      params.remove('id')
    } else {
      tripInstance = Trip.get(params.id)
    }

    if (tripInstance) {
      if (params.version) {
        def version = params.version.toLong()
        if (tripInstance.version > version) {
          render "${message(code: 'default.optimistic.locking.failure', args: [message(code: 'trip.label', default: 'Trip'), tripInstance.id])}"
          return
        }
      }
      println params

      tripInstance.setProperty('startDate', df.parse(params.startDate))
      tripInstance.setProperty('endDate', df.parse(params.endDate))

      def events = params.events.split('[,]')
      def contracts = params.contracts.split('[,]')
      def locations = params.locations.split('[,]')

      params.remove('startDate')
      params.remove('endDate')
      params.remove('events')
      params.remove('contracts')
      params.remove('locations')

      tripInstance.events.clear();
      for (e in events) {
        def event = Event.get(e.asType(Long))
        tripInstance.addToEvents(event);
      }

      tripInstance.contracts.clear();
      for (c in contracts) {
        def contract = Contract.get(c.asType(Long))
        tripInstance.addToContracts(contract);
      }

      tripInstance.locations.clear();
      for (l in locations) {
        def location = Location.get(l.asType(Long))
        tripInstance.addToLocations(location);
      }

      tripInstance.properties = params

      if (!tripInstance.hasErrors() && tripInstance.save(flush: true)) {
        render 1
      }
      else {
        render "${message(code: 'Could not update. A necessary value is missing.', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
      }
    }
    else {
      render "${message(code: 'default.not.found.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
    }
  }


  def show = {
    def tripInstance = Trip.get(params.id)
    if (!tripInstance) {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
      redirect(action: "list")
    }
    else {
      [tripInstance: tripInstance]
    }
  }

  def showJSON = {
    def tripInstance = Trip.get(params.id)
    if (!tripInstance) {
      render "${message(code: 'default.not.found.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
    }
    else {
      def eventList = []
      def contractList = []
      def locationList = []
      def attendeeList = []

      def events = tripInstance.getEvents()
      for (e in events) {
        def event = [id: e.id, name: e.toString()]
        eventList << event
      }

      def contracts = tripInstance.getContracts()
      for (c in contracts) {
        def contract = [id: c.id, name: c.toString()]
        contractList << contract
      }

      def locations = tripInstance.getLocations()

      for (l in locations) {
        def location = [id: l.id, name: l.toString()]
        locationList << location
      }

      def attendees = tripInstance.getAttendees()
      for (a in attendees) {
        def attendee = [id: a.id, name: a.toString()]
        attendeeList << attendee
      }

      //println events as JSON;
      def trip = [id: tripInstance.id, name: tripInstance.toString(), purpose: tripInstance.purpose, startDate: tripInstance.startDate, endDate: tripInstance.endDate, events: eventList.toArray(), contracts: contractList, locations: locationList, attendees: attendeeList]

      render trip as JSON
    }
  }

  def edit = {
    def tripInstance = Trip.get(params.id)
    if (!tripInstance) {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
      redirect(action: "list")
    }
    else {
      return [tripInstance: tripInstance]
    }
  }

  def update = {
    def tripInstance = Trip.get(params.id)
    if (tripInstance) {
      if (params.version) {
        def version = params.version.toLong()
        if (tripInstance.version > version) {

          tripInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'trip.label', default: 'Trip')] as Object[], "Another user has updated this Trip while you were editing")
          render(view: "edit", model: [tripInstance: tripInstance])
          return
        }
      }
      tripInstance.properties = params
      if (!tripInstance.hasErrors() && tripInstance.save(flush: true)) {
        flash.message = "${message(code: 'default.updated.message', args: [message(code: 'trip.label', default: 'Trip'), tripInstance.id])}"
        redirect(action: "show", id: tripInstance.id)
      }
      else {
        render(view: "edit", model: [tripInstance: tripInstance])
      }
    }
    else {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
      redirect(action: "list")
    }
  }

  def delete = {
    def tripInstance = Trip.get(params.id)
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

  def deleteJSON = {
    def tripInstance = Trip.get(params.id)
    if (tripInstance) {
      try {
        tripInstance.delete(flush: true)
        render 1
      }
      catch (org.springframework.dao.DataIntegrityViolationException e) {
        render "${message(code: 'default.not.deleted.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
      }
    }
    else {
      //flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
      render "${message(code: 'default.not.found.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
    }
  }

}
