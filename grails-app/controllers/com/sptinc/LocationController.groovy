package com.sptinc

import grails.converters.JSON
/*
* The controller for the Location domain. *JSON functions are used to interact with AJAX requests. All other methods were
* created by the grails create-controller script. A separate method was used for JSON requests rather than
* using the withFormat method because the functionality is so different.
*/
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
  
  /*
  * Returns a collection of Location objects in JSON based upon the given parameters.
  */
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
  
  /*
   * Takes a Location object in JSON and saves it. This method acts as both the create and update.
   */
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
		  def result = [success: true, data: locationInstance]
		  render result as JSON
      }
      else {
		  def result = [success: false, data: locationInstance.errors]
		  render result as JSON
      }
    }
    else {
		def errors = [errors: "${message(code: 'default.not.found.message', args: [message(code: 'location.label', default: 'Location'), params.id])}"]
		def result = [success: false, data: errors]
		render result as JSON
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
  
  /*
   * Takes an id and returns a Location object in JSON.
   */
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

          locationInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'location.label', default: 'Location')] as Object[], "Another location has updated this Location while you were editing")
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
  
  /*
  * Takes a Location id, deletes, and returns a JSON result.
  */
  def deleteJSON = {
		def instance = Location.get(params.id)
		if (instance) {
			try {	
				def values = [id: instance.id, name: instance.getName()]
				instance.delete(flush: true)
				def result = [success: true, data: values]
				render result as JSON
			}
			catch (org.springframework.dao.DataIntegrityViolationException e) {
				def errors = [errors: "${message(code: 'default.not.deleted.message', args: [message(code: 'location.label', default: 'Location'), params.id])}"]
				def result = [success: false, data: errors]
				render result as JSON
			}
		}
		else {
			def errors = [errors: "${message(code: 'default.not.found.message', args: [message(code: 'location.label', default: 'Location'), params.id])}"]
			def result = [success: false, data: errors]
			render result as JSON
		}
  }

}
