package com.sptinc

import grails.converters.JSON

class ContactController {

  static scaffold = true;

  static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

  def index = {
    redirect(action: "list", params: params)
  }

  def list = {
    params.max = Math.min(params.max ? params.int('max') : 10, 100)
    [contactInstanceList: Contact.list(params), contactInstanceTotal: Contact.count()]
  }

  def listJSON = {
    def contacts = []
    for (c in Contact.list(params)) {
      def contact = [id: c.id, name: c.toString(), organization: c.organization.toString(), email: c.email, phoneNumber: c.phoneNumber]
      contacts << contact
    }

    def listResult = [total: contacts.size(), items: contacts]
    render listResult as JSON
  }

  def create = {
    def contactInstance = new Contact()
    contactInstance.properties = params
    return [contactInstance: contactInstance]
  }

  def save = {
    def contactInstance = new Contact(params)
    if (contactInstance.save(flush: true)) {
      flash.message = "${message(code: 'default.created.message', args: [message(code: 'contact.label', default: 'Contact'), contactInstance.id])}"
      redirect(action: "show", id: contactInstance.id)
    }
    else {
      render(view: "create", model: [contactInstance: contactInstance])
    }
  }

  def saveJSON = {
    def contactInstance
    if (params.task.equals("Create")) {
      contactInstance = new Contact()
      params.remove('id')
    } else {
      contactInstance = Contact.get(params.id)
    }

    if (contactInstance) {
      if (params.version) {
        def version = params.version.toLong()
        if (contactInstance.version > version) {
          render "${message(code: 'default.optimistic.locking.failure', args: [message(code: 'contact.label', default: 'Contact'), contactInstance.id])}"
          return
        }
      }

      contactInstance.properties = params

      if (!contactInstance.hasErrors() && contactInstance.save(flush: true)) {
        render 1
      }
      else {
        render "${message(code: 'Could not update. A necessary value is missing.', args: [message(code: 'contact.label', default: 'Contact'), params.id])}"
      }
    }
    else {
      render "${message(code: 'default.not.found.message', args: [message(code: 'contact.label', default: 'Contact'), params.id])}"
    }
  }

  def show = {
    def contactInstance = Contact.get(params.id)
    if (!contactInstance) {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'contact.label', default: 'Contact'), params.id])}"
      redirect(action: "list")
    }
    else {
      [contactInstance: contactInstance]
    }
  }

  def showJSON = {
    def contactInstance = Contact.get(params.id)
    if (!contactInstance) {
      render "${message(code: 'default.not.found.message', args: [message(code: 'contact.label', default: 'Contact'), params.id])}"
    }
    else {

      def contact = [id: contactInstance.id, name: contactInstance.toString(), organization: contactInstance.organization.toString(), email: contactInstance.email, phoneNumber: contactInstance.phoneNumber]

      render contact as JSON
    }
  }

  def edit = {
    def contactInstance = Contact.get(params.id)
    if (!contactInstance) {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'contact.label', default: 'Contact'), params.id])}"
      redirect(action: "list")
    }
    else {
      return [contactInstance: contactInstance]
    }
  }

  def update = {
    def contactInstance = Contact.get(params.id)
    if (contactInstance) {
      if (params.version) {
        def version = params.version.toLong()
        if (contactInstance.version > version) {

          contactInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'contact.label', default: 'Contact')] as Object[], "Another user has updated this Contact while you were editing")
          render(view: "edit", model: [contactInstance: contactInstance])
          return
        }
      }
      contactInstance.properties = params
      if (!contactInstance.hasErrors() && contactInstance.save(flush: true)) {
        flash.message = "${message(code: 'default.updated.message', args: [message(code: 'contact.label', default: 'Contact'), contactInstance.id])}"
        redirect(action: "show", id: contactInstance.id)
      }
      else {
        render(view: "edit", model: [contactInstance: contactInstance])
      }
    }
    else {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'contact.label', default: 'Contact'), params.id])}"
      redirect(action: "list")
    }
  }

  def delete = {
    def contactInstance = Contact.get(params.id)
    if (contactInstance) {
      try {
        contactInstance.delete(flush: true)
        flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'contact.label', default: 'Contact'), params.id])}"
        redirect(action: "list")
      }
      catch (org.springframework.dao.DataIntegrityViolationException e) {
        flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'contact.label', default: 'Contact'), params.id])}"
        redirect(action: "show", id: params.id)
      }
    }
    else {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'contact.label', default: 'Contact'), params.id])}"
      redirect(action: "list")
    }
  }

  def deleteJSON = {
    def contactInstance = Contact.get(params.id)
    if (contactInstance) {
      try {
        contactInstance.delete(flush: true)
        render 1
      }
      catch (org.springframework.dao.DataIntegrityViolationException e) {
        render "${message(code: 'default.not.deleted.message', args: [message(code: 'contact.label', default: 'Contact'), params.id])}"
      }
    }
    else {
      //flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
      render "${message(code: 'default.not.found.message', args: [message(code: 'contact.label', default: 'Contact'), params.id])}"
    }
  }
}
