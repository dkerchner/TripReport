package com.sptinc

import grails.converters.JSON

class RoleController {

  static scaffold = true;

  static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

  def index = {
    redirect(action: "list", params: params)
  }

  def list = {
    params.max = Math.min(params.max ? params.int('max') : 10, 100)
    [roleInstanceList: Role.list(params), roleInstanceTotal: Role.count()]
  }

  def listJSON = {
    def roles = []
    for (r in Role.list(params)) {
      def role = [id: r.id, name: r.authority]
      roles << role
    }

    def listResult = [total: roles.count(), items: roles]
    render listResult as JSON
  }

  def create = {
    def roleInstance = new Role()
    roleInstance.properties = params
    return [roleInstance: roleInstance]
  }

  def save = {
    def roleInstance = new Role(params)
    if (roleInstance.save(flush: true)) {
      flash.message = "${message(code: 'default.created.message', args: [message(code: 'role.label', default: 'Role'), roleInstance.id])}"
      redirect(action: "show", id: roleInstance.id)
    }
    else {
      render(view: "create", model: [roleInstance: roleInstance])
    }
  }

  def saveJSON = {
    def roleInstance
    if (params.task.equals("Create")) {
      roleInstance = new Role()
      params.remove('id')
    } else {
      roleInstance = Role.get(params.id)
    }

    if (roleInstance) {
      if (params.version) {
        def version = params.version.toLong()
        if (roleInstance.version > version) {
          render "${message(code: 'default.optimistic.locking.failure', args: [message(code: 'role.label', default: 'Role'), roleInstance.id])}"
          return
        }
      }

      roleInstance.properties = params

      if (!roleInstance.hasErrors() && roleInstance.save(flush: true)) {
        render 1
      }
      else {
        render "${message(code: 'Could not update. A necessary value is missing.', args: [message(code: 'role.label', default: 'Role'), params.id])}"
      }
    }
    else {
      render "${message(code: 'default.not.found.message', args: [message(code: 'role.label', default: 'Role'), params.id])}"
    }
  }


  def show = {
    def roleInstance = Role.get(params.id)
    if (!roleInstance) {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'role.label', default: 'Role'), params.id])}"
      redirect(action: "list")
    }
    else {
      [roleInstance: roleInstance]
    }
  }

  def showJSON = {
    def roleInstance = Role.get(params.id)
    if (!roleInstance) {
      render "${message(code: 'default.not.found.message', args: [message(code: 'role.label', default: 'Role'), params.id])}"
    }
    else {

      def role = [id: roleInstance.id, name: roleInstance.authority]

      render role as JSON
    }
  }

  def edit = {
    def roleInstance = Role.get(params.id)
    if (!roleInstance) {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'role.label', default: 'Role'), params.id])}"
      redirect(action: "list")
    }
    else {
      return [roleInstance: roleInstance]
    }
  }

  def update = {
    def roleInstance = Role.get(params.id)
    if (roleInstance) {
      if (params.version) {
        def version = params.version.toLong()
        if (roleInstance.version > version) {

          roleInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'role.label', default: 'Role')] as Object[], "Another user has updated this Role while you were editing")
          render(view: "edit", model: [roleInstance: roleInstance])
          return
        }
      }
      roleInstance.properties = params
      if (!roleInstance.hasErrors() && roleInstance.save(flush: true)) {
        flash.message = "${message(code: 'default.updated.message', args: [message(code: 'role.label', default: 'Role'), roleInstance.id])}"
        redirect(action: "show", id: roleInstance.id)
      }
      else {
        render(view: "edit", model: [roleInstance: roleInstance])
      }
    }
    else {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'role.label', default: 'Role'), params.id])}"
      redirect(action: "list")
    }
  }

  def delete = {
    def roleInstance = Role.get(params.id)
    if (roleInstance) {
      try {
        roleInstance.delete(flush: true)
        flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'role.label', default: 'Role'), params.id])}"
        redirect(action: "list")
      }
      catch (org.springframework.dao.DataIntegrityViolationException e) {
        flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'role.label', default: 'Role'), params.id])}"
        redirect(action: "show", id: params.id)
      }
    }
    else {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'role.label', default: 'Role'), params.id])}"
      redirect(action: "list")
    }
  }

  def deleteJSON = {
    def roleInstance = Role.get(params.id)
    if (roleInstance) {
      try {
        roleInstance.delete(flush: true)
        render 1
      }
      catch (org.springframework.dao.DataIntegrityViolationException e) {
        render "${message(code: 'default.not.deleted.message', args: [message(code: 'role.label', default: 'Role'), params.id])}"
      }
    }
    else {
      //flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
      render "${message(code: 'default.not.found.message', args: [message(code: 'role.label', default: 'Role'), params.id])}"
    }
  }

}
