package com.sptinc

import grails.converters.JSON

class AgencyController {

  static scaffold = true

  static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

  def index = {
    redirect(action: "list", params: params)
  }

  def list = {
    params.max = Math.min(params.max ? params.int('max') : 10, 100)
    [agencyInstanceList: Agency.list(params), agencyInstanceTotal: Agency.count()]
  }

  def listJSON = {
    def agencies = []
    for (a in Agency.list(params)) {
      def agency = [id: a.id, name: a.toString(), url: a.url]
      agencies << agency
    }

    def listResult = [total: agencies.count(), items: agencies]
    render listResult as JSON
  }

  def create = {
    def agencyInstance = new Agency()
    agencyInstance.properties = params
    return [agencyInstance: agencyInstance]
  }

  def save = {
    def agencyInstance = new Agency(params)
    if (agencyInstance.save(flush: true)) {
      flash.message = "${message(code: 'default.created.message', args: [message(code: 'agency.label', default: 'Agency'), agencyInstance.id])}"
      redirect(action: "show", id: agencyInstance.id)
    }
    else {
      render(view: "create", model: [agencyInstance: agencyInstance])
    }
  }

  def saveJSON = {
    def agencyInstance
    if (params.task.equals("Create")) {
      agencyInstance = new Agency()
      params.remove('id')
    } else {
      agencyInstance = Agency.get(params.id)
    }

    if (agencyInstance) {
      if (params.version) {
        def version = params.version.toLong()
        if (agencyInstance.version > version) {
          render "${message(code: 'default.optimistic.locking.failure', args: [message(code: 'agency.label', default: 'Agency'), agencyInstance.id])}"
          return
        }
      }

      agencyInstance.properties = params

      if (!agencyInstance.hasErrors() && agencyInstance.save(flush: true)) {
        render 1
      }
      else {
        render "${message(code: 'Could not update. A necessary value is missing.', args: [message(code: 'agency.label', default: 'Agency'), params.id])}"
      }
    }
    else {
      render "${message(code: 'default.not.found.message', args: [message(code: 'agency.label', default: 'Agency'), params.id])}"
    }
  }


  def show = {
    def agencyInstance = Agency.get(params.id)
    if (!agencyInstance) {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'agency.label', default: 'Agency'), params.id])}"
      redirect(action: "list")
    }
    else {
      [agencyInstance: agencyInstance]
    }
  }

  def showJSON = {
    def agencyInstance = Agency.get(params.id)
    if (!agencyInstance) {
      render "${message(code: 'default.not.found.message', args: [message(code: 'agency.label', default: 'Agency'), params.id])}"
    }
    else {

      def agency = [id: agencyInstance.id, name: agencyInstance.toString(), url: agencyInstance.url]

      render agency as JSON
    }
  }

  def edit = {
    def agencyInstance = Agency.get(params.id)
    if (!agencyInstance) {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'agency.label', default: 'Agency'), params.id])}"
      redirect(action: "list")
    }
    else {
      return [agencyInstance: agencyInstance]
    }
  }

  def update = {
    def agencyInstance = Agency.get(params.id)
    if (agencyInstance) {
      if (params.version) {
        def version = params.version.toLong()
        if (agencyInstance.version > version) {

          agencyInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'agency.label', default: 'Agency')] as Object[], "Another user has updated this Agency while you were editing")
          render(view: "edit", model: [agencyInstance: agencyInstance])
          return
        }
      }
      agencyInstance.properties = params
      if (!agencyInstance.hasErrors() && agencyInstance.save(flush: true)) {
        flash.message = "${message(code: 'default.updated.message', args: [message(code: 'agency.label', default: 'Agency'), agencyInstance.id])}"
        redirect(action: "show", id: agencyInstance.id)
      }
      else {
        render(view: "edit", model: [agencyInstance: agencyInstance])
      }
    }
    else {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'agency.label', default: 'Agency'), params.id])}"
      redirect(action: "list")
    }
  }

  def delete = {
    def agencyInstance = Agency.get(params.id)
    if (agencyInstance) {
      try {
        agencyInstance.delete(flush: true)
        flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'agency.label', default: 'Agency'), params.id])}"
        redirect(action: "list")
      }
      catch (org.springframework.dao.DataIntegrityViolationException e) {
        flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'agency.label', default: 'Agency'), params.id])}"
        redirect(action: "show", id: params.id)
      }
    }
    else {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'agency.label', default: 'Agency'), params.id])}"
      redirect(action: "list")
    }
  }

  def deleteJSON = {
    def agencyInstance = Agency.get(params.id)
    if (agencyInstance) {
      try {
        agencyInstance.delete(flush: true)
        render 1
      }
      catch (org.springframework.dao.DataIntegrityViolationException e) {
        render "${message(code: 'default.not.deleted.message', args: [message(code: 'agency.label', default: 'Agency'), params.id])}"
      }
    }
    else {
      //flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
      render "${message(code: 'default.not.found.message', args: [message(code: 'agency.label', default: 'Agency'), params.id])}"
    }
  }

}
