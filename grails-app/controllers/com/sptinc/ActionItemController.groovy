package com.sptinc

import grails.converters.JSON

class ActionItemController {

  static scaffold = ActionItem;

  static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

  /*def index = {
     redirect(action: "list", params: params)
 } */

  def list = {
    params.max = Math.min(params.max ? params.int('max') : 10, 100)
    [actionItemInstanceList: ActionItem.list(params), actionItemInstanceTotal: ActionItem.count()]
  }

  def listJSON = {
    def actionItems = []
    for (ai in ActionItem.list(params)) {
      def actionItem = [id: ai.id, name: ai.toString(), description: ai.description, report: ai.tripReport.toString(), dueDate: ai.dueDate]
      actionItems << actionItem
    }

    def listResult = [total: actionItems.size(), items: actionItems]
    render listResult as JSON
  }


  def create = {
    def actionItemInstance = new ActionItem()
    actionItemInstance.properties = params
    return [actionItemInstance: actionItemInstance]
  }

  def save = {
    def actionItemInstance = new ActionItem(params)
    if (actionItemInstance.save(flush: true)) {
      flash.message = "${message(code: 'default.created.message', args: [message(code: 'actionItem.label', default: 'ActionItem'), actionItemInstance.id])}"
      redirect(action: "show", id: actionItemInstance.id)
    }
    else {
      render(view: "create", model: [actionItemInstance: actionItemInstance])
    }
  }

  def saveJSON = {
    def actionItemInstance
    if (params.task.equals("Create")) {
      actionItemInstance = new ActionItem()
      params.remove('id')
    } else {
      actionItemInstance = ActionItem.get(params.id)
    }

    if (actionItemInstance) {
      if (params.version) {
        def version = params.version.toLong()
        if (actionItemInstance.version > version) {
          render "${message(code: 'default.optimistic.locking.failure', args: [message(code: 'actionItem.label', default: 'ActionItem'), actionItemInstance.id])}"
          return
        }
      }

      actionItemInstance.properties = params

      if (!actionItemInstance.hasErrors() && actionItemInstance.save(flush: true)) {
        render 1
      }
      else {
        render "${message(code: 'Could not update. A necessary value is missing.', args: [message(code: 'actionItem.label', default: 'ActionItem'), params.id])}"
      }
    }
    else {
      render "${message(code: 'default.not.found.message', args: [message(code: 'actionItem.label', default: 'ActionItem'), params.id])}"
    }
  }


  def show = {
    def actionItemInstance = ActionItem.get(params.id)
    if (!actionItemInstance) {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'actionItem.label', default: 'ActionItem'), params.id])}"
      redirect(action: "list")
    }
    else {
      [actionItemInstance: actionItemInstance]
    }
  }

  def showJSON = {
    def actionItemInstance = ActionItem.get(params.id)
    if (!actionItemInstance) {
      render "${message(code: 'default.not.found.message', args: [message(code: 'actionItem.label', default: 'ActionItem'), params.id])}"
    }
    else {

      def actionItem = [id: actionItemInstance.id, name: actionItemInstance.toString(), description: actionItemInstance.description, report: actionItemInstance.tripReport.toString(), dueDate: actionItemInstance.dueDate]

      render actionItem as JSON
    }
  }

  def edit = {
    def actionItemInstance = ActionItem.get(params.id)
    if (!actionItemInstance) {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'actionItem.label', default: 'ActionItem'), params.id])}"
      redirect(action: "list")
    }
    else {
      return [actionItemInstance: actionItemInstance]
    }
  }

  def update = {
    def actionItemInstance = ActionItem.get(params.id)
    if (actionItemInstance) {
      if (params.version) {
        def version = params.version.toLong()
        if (actionItemInstance.version > version) {

          actionItemInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'actionItem.label', default: 'ActionItem')] as Object[], "Another user has updated this ActionItem while you were editing")
          render(view: "edit", model: [actionItemInstance: actionItemInstance])
          return
        }
      }
      actionItemInstance.properties = params
      if (!actionItemInstance.hasErrors() && actionItemInstance.save(flush: true)) {
        flash.message = "${message(code: 'default.updated.message', args: [message(code: 'actionItem.label', default: 'ActionItem'), actionItemInstance.id])}"
        redirect(action: "show", id: actionItemInstance.id)
      }
      else {
        render(view: "edit", model: [actionItemInstance: actionItemInstance])
      }
    }
    else {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'actionItem.label', default: 'ActionItem'), params.id])}"
      redirect(action: "list")
    }
  }

  def delete = {
    def actionItemInstance = ActionItem.get(params.id)
    if (actionItemInstance) {
      try {
        actionItemInstance.delete(flush: true)
        flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'actionItem.label', default: 'ActionItem'), params.id])}"
        redirect(action: "list")
      }
      catch (org.springframework.dao.DataIntegrityViolationException e) {
        flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'actionItem.label', default: 'ActionItem'), params.id])}"
        redirect(action: "show", id: params.id)
      }
    }
    else {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'actionItem.label', default: 'ActionItem'), params.id])}"
      redirect(action: "list")
    }
  }

  def deleteJSON = {
    def actionItemInstance = ActionItem.get(params.id)
    if (actionItemInstance) {
      try {
        actionItemInstance.delete(flush: true)
        render 1
      }
      catch (org.springframework.dao.DataIntegrityViolationException e) {
        render "${message(code: 'default.not.deleted.message', args: [message(code: 'role.label', default: 'ActionItem'), params.id])}"
      }
    }
    else {
      //flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
      render "${message(code: 'default.not.found.message', args: [message(code: 'role.label', default: 'ActionItem'), params.id])}"
    }
  }

}
