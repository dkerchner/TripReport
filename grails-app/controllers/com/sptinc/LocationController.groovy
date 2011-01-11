package com.sptinc

import grails.converters.JSON

class LocationController {

  static scaffold = true;

  static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

  def index = {
    redirect(action: "list", params: params)
  }

  def list = {
    params.max = Math.min(params.max ? params.int('max') : 10, 100)
    [locationInstanceList: Location.list(params), locationInstanceTotal: Location.count()]
  }

  def listJSON = {
    def locs = []
    for (l in Location.list(params)) {
      def loc = [id: l.id, name: l.toString(), city: l.city, state: l.state, country: l.country]
      locs << loc
    }

    def listResult = [total: locs.size(), items: locs]
    render listResult as JSON
  }

  def create = {
    def locationInstance = new Location()
    locationInstance.properties = params
    return [locationInstance: locationInstance]
  }

  def save = {
    def locationInstance = new Location(params)
    if (locationInstance.save(flush: true)) {
      flash.message = "${message(code: 'default.created.message', args: [message(code: 'location.label', default: 'Location'), locationInstance.id])}"
      redirect(action: "show", id: locationInstance.id)
    }
    else {
      render(view: "create", model: [locationInstance: locationInstance])
    }
  }

  def saveJSON = {
    def locationInstance
    if (params.task.equals("Create")) {
      locationInstance = new Location()
      params.remove('id')
    } else {
      locationInstance = Location.get(params.id)
    }

    if (locationInstance) {
      if (params.version) {
        def version = params.version.toLong()
        if (locationInstance.version > version) {
          render "${message(code: 'default.optimistic.locking.failure', args: [message(code: 'location.label', default: 'Location'), locationInstance.id])}"
          return
        }
      }

      locationInstance.properties = params

      if (!locationInstance.hasErrors() && locationInstance.save(flush: true)) {
        render 1
      }
      else {
        render "${message(code: 'Could not update. A necessary value is missing.', args: [message(code: 'location.label', default: 'Location'), params.id])}"
      }
    }
    else {
      render "${message(code: 'default.not.found.message', args: [message(code: 'location.label', default: 'Location'), params.id])}"
    }
  }

  def show = {
    def locationInstance = Location.get(params.id)
    if (!locationInstance) {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'location.label', default: 'Location'), params.id])}"
      redirect(action: "list")
    }
    else {
      [locationInstance: locationInstance]
    }
  }

  def showJSON = {
    def locationInstance = Location.get(params.id)
    if (!locationInstance) {
      render "${message(code: 'default.not.found.message', args: [message(code: 'location.label', default: 'Location'), params.id])}"
    }
    else {

      def loc = [id: locationInstance.id, name: locationInstance.toString(), city: locationInstance.city, state: locationInstance.state, country: locationInstance.country]

      render loc as JSON
    }
  }

  def edit = {
    def locationInstance = Location.get(params.id)
    if (!locationInstance) {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'location.label', default: 'Location'), params.id])}"
      redirect(action: "list")
    }
    else {
      return [locationInstance: locationInstance]
    }
  }

  def update = {
    def locationInstance = Location.get(params.id)
    if (locationInstance) {
      if (params.version) {
        def version = params.version.toLong()
        if (locationInstance.version > version) {

          locationInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'location.label', default: 'Location')] as Object[], "Another user has updated this Location while you were editing")
          render(view: "edit", model: [locationInstance: locationInstance])
          return
        }
      }
      locationInstance.properties = params
      if (!locationInstance.hasErrors() && locationInstance.save(flush: true)) {
        flash.message = "${message(code: 'default.updated.message', args: [message(code: 'location.label', default: 'Location'), locationInstance.id])}"
        redirect(action: "show", id: locationInstance.id)
      }
      else {
        render(view: "edit", model: [locationInstance: locationInstance])
      }
    }
    else {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'location.label', default: 'Location'), params.id])}"
      redirect(action: "list")
    }
  }

  def delete = {
    def locationInstance = Location.get(params.id)
    if (locationInstance) {
      try {
        locationInstance.delete(flush: true)
        flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'location.label', default: 'Location'), params.id])}"
        redirect(action: "list")
      }
      catch (org.springframework.dao.DataIntegrityViolationException e) {
        flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'location.label', default: 'Location'), params.id])}"
        redirect(action: "show", id: params.id)
      }
    }
    else {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'location.label', default: 'Location'), params.id])}"
      redirect(action: "list")
    }
  }

  def deleteJSON = {
    def locationInstance = Location.get(params.id)
    if (locationInstance) {
      try {
        locationInstance.delete(flush: true)
        render 1
      }
      catch (org.springframework.dao.DataIntegrityViolationException e) {
        render "${message(code: 'default.not.deleted.message', args: [message(code: 'location.label', default: 'Location'), params.id])}"
      }
    }
    else {
      //flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
      render "${message(code: 'default.not.found.message', args: [message(code: 'location.label', default: 'Location'), params.id])}"
    }
  }

}
