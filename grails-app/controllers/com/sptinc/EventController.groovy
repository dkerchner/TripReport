package com.sptinc

import grails.converters.JSON

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

  def listJSON = {
    def events = []
    for (e in Event.list(params)) {
      def loc = e.getLocation()
      def location = [id: loc.id, name: loc.toString()]
      def event = [id: e.id, name: e.toString(), startDate: e.startDate, endDate: e.endDate, location: location]
      events << event
    }

    def listResult = [total: events.count(), items: events]
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
        render 1
      }
      else {
        render "${message(code: 'Could not update. A necessary value is missing.', args: [message(code: 'event.label', default: 'Event'), params.id])}"
      }
    }
    else {
      render "${message(code: 'default.not.found.message', args: [message(code: 'event.label', default: 'Event'), params.id])}"
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

  def showJSON = {
    def eventInstance = Event.get(params.id)
    if (!eventInstance) {
      render "${message(code: 'default.not.found.message', args: [message(code: 'event.label', default: 'Event'), params.id])}"
    }
    else {

      def event = [id: eventInstance.id, name: eventInstance.authority]

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

          eventInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'event.label', default: 'Event')] as Object[], "Another user has updated this Event while you were editing")
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

  def deleteJSON = {
    def eventInstance = Event.get(params.id)
    if (eventInstance) {
      try {
        eventInstance.delete(flush: true)
        render 1
      }
      catch (org.springframework.dao.DataIntegrityViolationException e) {
        render "${message(code: 'default.not.deleted.message', args: [message(code: 'event.label', default: 'Event'), params.id])}"
      }
    }
    else {
      //flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
      render "${message(code: 'default.not.found.message', args: [message(code: 'event.label', default: 'Event'), params.id])}"
    }
  }

}
