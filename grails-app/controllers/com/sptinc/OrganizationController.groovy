package com.sptinc

import grails.converters.JSON

class OrganizationController {

  static scaffold = true;

  static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

  def index = {
    redirect(action: "list", params: params)
  }

  def list = {
    params.max = Math.min(params.max ? params.int('max') : 10, 100)
    [organizationInstanceList: Organization.list(params), organizationInstanceTotal: Organization.count()]
  }

  def listJSON = {
    def orgs = []
    for (o in Organization.list(params)) {
      def org = [id: o.id, name: o.toString(), url: o.url]
      orgs << org
    }

    def listResult = [total: orgs.count(), items: orgs]
    render listResult as JSON
  }


  def create = {
    def organizationInstance = new Organization()
    organizationInstance.properties = params
    return [organizationInstance: organizationInstance]
  }

  def save = {
    def organizationInstance = new Organization(params)
    if (organizationInstance.save(flush: true)) {
      flash.message = "${message(code: 'default.created.message', args: [message(code: 'organization.label', default: 'Organization'), organizationInstance.id])}"
      redirect(action: "show", id: organizationInstance.id)
    }
    else {
      render(view: "create", model: [organizationInstance: organizationInstance])
    }
  }

  def saveJSON = {
    def organizationInstance
    if (params.task.equals("Create")) {
      organizationInstance = new Organization()
      params.remove('id')
    } else {
      organizationInstance = Organization.get(params.id)
    }

    if (organizationInstance) {
      if (params.version) {
        def version = params.version.toLong()
        if (organizationInstance.version > version) {
          render "${message(code: 'default.optimistic.locking.failure', args: [message(code: 'organization.label', default: 'Organization'), organizationInstance.id])}"
          return
        }
      }

      organizationInstance.properties = params

      if (!organizationInstance.hasErrors() && organizationInstance.save(flush: true)) {
        render 1
      }
      else {
        render "${message(code: 'Could not update. A necessary value is missing.', args: [message(code: 'organization.label', default: 'Organization'), params.id])}"
      }
    }
    else {
      render "${message(code: 'default.not.found.message', args: [message(code: 'organization.label', default: 'Organization'), params.id])}"
    }
  }


  def show = {
    def organizationInstance = Organization.get(params.id)
    if (!organizationInstance) {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'organization.label', default: 'Organization'), params.id])}"
      redirect(action: "list")
    }
    else {
      [organizationInstance: organizationInstance]
    }
  }

  def showJSON = {
    def orgInstance = Organization.get(params.id)
    if (!orgInstance) {
      render "${message(code: 'default.not.found.message', args: [message(code: 'organization.label', default: 'Organization'), params.id])}"
    }
    else {

      def org = [id: orgInstance.id, name: orgInstance.toString(), url: orgInstance.url, type: (orgInstance instanceof Agency)?"Agency":"Company"]

      render org as JSON
    }
  }


  def edit = {
    def organizationInstance = Organization.get(params.id)
    if (!organizationInstance) {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'organization.label', default: 'Organization'), params.id])}"
      redirect(action: "list")
    }
    else {
      return [organizationInstance: organizationInstance]
    }
  }

  def update = {
    def organizationInstance = Organization.get(params.id)
    if (organizationInstance) {
      if (params.version) {
        def version = params.version.toLong()
        if (organizationInstance.version > version) {

          organizationInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'organization.label', default: 'Organization')] as Object[], "Another user has updated this Organization while you were editing")
          render(view: "edit", model: [organizationInstance: organizationInstance])
          return
        }
      }
      organizationInstance.properties = params
      if (!organizationInstance.hasErrors() && organizationInstance.save(flush: true)) {
        flash.message = "${message(code: 'default.updated.message', args: [message(code: 'organization.label', default: 'Organization'), organizationInstance.id])}"
        redirect(action: "show", id: organizationInstance.id)
      }
      else {
        render(view: "edit", model: [organizationInstance: organizationInstance])
      }
    }
    else {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'organization.label', default: 'Organization'), params.id])}"
      redirect(action: "list")
    }
  }

  def delete = {
    def organizationInstance = Organization.get(params.id)
    if (organizationInstance) {
      try {
        organizationInstance.delete(flush: true)
        flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'organization.label', default: 'Organization'), params.id])}"
        redirect(action: "list")
      }
      catch (org.springframework.dao.DataIntegrityViolationException e) {
        flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'organization.label', default: 'Organization'), params.id])}"
        redirect(action: "show", id: params.id)
      }
    }
    else {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'organization.label', default: 'Organization'), params.id])}"
      redirect(action: "list")
    }
  }

  def deleteJSON = {
    def orgInstance = Organization.get(params.id)
    if (orgInstance) {
      try {
        orgInstance.delete(flush: true)
        render 1
      }
      catch (org.springframework.dao.DataIntegrityViolationException e) {
        render "${message(code: 'default.not.deleted.message', args: [message(code: 'organization.label', default: 'Organization'), params.id])}"
      }
    }
    else {
      render "${message(code: 'default.not.found.message', args: [message(code: 'organization.label', default: 'Organization'), params.id])}"
    }
  }

}
