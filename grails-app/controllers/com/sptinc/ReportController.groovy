package com.sptinc

import grails.converters.JSON

class ReportController {

  static scaffold = true;

  static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

  def index = {
    redirect(action: "list", params: params)
  }

  def list = {
    params.max = Math.min(params.max ? params.int('max') : 10, 100)
    [reportInstanceList: Report.list(params), reportInstanceTotal: Report.count()]
  }

  def listJSON = {
    def reports = []
    for (r in Report.list(params)) {
      def actionItems = r.getActionItems()
      def contacts = r.getContacts()
      def actionItemsList = []
      def contactsList = []

      for (a in actionItems) {
        def actionItem = [id: a.id, name: a.toString()]
        actionItemsList << actionItem
      }

      for (c in contacts) {
        def contact = [id: c.id, name: c.toString()]
        contactsList << contact
      }

      def trip = r.getTrip()
      def author = r.getAuthor()

      def report = [id: r.id, name: r.toString(), tripId: trip.id, trip: trip.toString(), authorId: author.id, author: author.toString(), usefulness: r.usefulness, topics: r.topics, issues: r.issues, actionItems: actionItemsList, contacts: contactsList]
      reports << report
    }

    def listResult = [total: reports.size(), items: reports]
    render listResult as JSON
  }

  def create = {
    def reportInstance = new Report()
    reportInstance.properties = params
    return [reportInstance: reportInstance]
  }

  def save = {
    def reportInstance = new Report(params)
    if (reportInstance.save(flush: true)) {
      flash.message = "${message(code: 'default.created.message', args: [message(code: 'report.label', default: 'Report'), reportInstance.id])}"
      redirect(action: "show", id: reportInstance.id)
    }
    else {
      render(view: "create", model: [reportInstance: reportInstance])
    }
  }

  def saveJSON = {
    def reportInstance
    if (params.task.equals("Create")) {
      reportInstance = new Report()
      params.remove('id')
    } else {
      reportInstance = Report.get(params.id)
    }

    if (reportInstance) {         println params
      if (params.version) {
        def version = params.version.toLong()
        if (reportInstance.version > version) {
          render "${message(code: 'default.optimistic.locking.failure', args: [message(code: 'report.label', default: 'Report'), reportInstance.id])}"
          return
        }
      }

      def actionItems = []
      if (!params.actionItems.equals("")) {actionItems = params.actionItems.split('[,]')}
      def contacts = []
      if (!params.contacts.equals("")) {contacts = params.contacts.split('[,]')}


      params.remove('actionItems')
      params.remove('contacts')
      params.trip = Trip.get(params.trip.asType(Integer))
      params.author = User.get(params.author.asType(Integer))

	  
      if(reportInstance.actionItems!=null){println 'allclear'
		  reportInstance.actionItems.clear() }
	  println reportInstance.actionItems 
      for (a in actionItems) {println a
        def actionItem = ActionItem.get(a.asType(Long))
        reportInstance.addToActionItems(actionItem)
      }

      if(reportInstance.contacts!=null){reportInstance.contacts.clear()}
      for (c in contacts) {
        def contact = Contact.get(c.asType(Long))
        reportInstance.addToContacts(contact);
      }

      reportInstance.properties = params

      if (!reportInstance.hasErrors() && reportInstance.save(flush: true)) {
        render 1
      }
      else {       println reportInstance.errors
        render "${message(code: 'Could not update. A necessary value is missing.', args: [message(code: 'report.label', default: 'Report'), params.id])}"
      }
    }
    else {
      render "${message(code: 'default.not.found.message', args: [message(code: 'report.label', default: 'Report'), params.id])}"
    }
  }


  def show = {
    def reportInstance = Report.get(params.id)
    if (!reportInstance) {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'report.label', default: 'Report'), params.id])}"
      redirect(action: "list")
    }
    else {
      [reportInstance: reportInstance]
    }
  }

  def showJSON = {
    def reportInstance = Report.get(params.id)
    if (!reportInstance) {
      render "${message(code: 'default.not.found.message', args: [message(code: 'report.label', default: 'Report'), params.id])}"
    }
    else {
      def actionItems = reportInstance.getActionItems()
      def contacts = reportInstance.getContacts()
      def actionItemsList = []
      def contactsList = []

      for (a in actionItems) {
        def actionItem = [id: a.id, name: a.toString()]
        actionItemsList << actionItem
      }

      for (c in contacts) {
        def contact = [id: c.id, name: c.toString()]
        contactsList << contact
      }

      def trip = reportInstance.getTrip()
      def author = reportInstance.getAuthor()
      def report = [id: reportInstance.id, name: reportInstance.toString(), tripId: trip.id, trip: trip.toString(), authorId: author.id, author: author.toString(), usefulness: reportInstance.usefulness, topics: reportInstance.topics, issues: reportInstance.issues, actionItems: actionItemsList, contacts: contactsList]

      render report as JSON
    }
  }

  def edit = {
    def reportInstance = Report.get(params.id)
    if (!reportInstance) {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'report.label', default: 'Report'), params.id])}"
      redirect(action: "list")
    }
    else {
      return [reportInstance: reportInstance]
    }
  }

  def update = {
    def reportInstance = Report.get(params.id)
    if (reportInstance) {
      if (params.version) {
        def version = params.version.toLong()
        if (reportInstance.version > version) {

          reportInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'report.label', default: 'Report')] as Object[], "Another user has updated this Report while you were editing")
          render(view: "edit", model: [reportInstance: reportInstance])
          return
        }
      }
      reportInstance.properties = params
      if (!reportInstance.hasErrors() && reportInstance.save(flush: true)) {
        flash.message = "${message(code: 'default.updated.message', args: [message(code: 'report.label', default: 'Report'), reportInstance.id])}"
        redirect(action: "show", id: reportInstance.id)
      }
      else {
        render(view: "edit", model: [reportInstance: reportInstance])
      }
    }
    else {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'report.label', default: 'Report'), params.id])}"
      redirect(action: "list")
    }
  }

  def delete = {
    def reportInstance = Report.get(params.id)
    if (reportInstance) {
      try {
        reportInstance.delete(flush: true)
        flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'report.label', default: 'Report'), params.id])}"
        redirect(action: "list")
      }
      catch (org.springframework.dao.DataIntegrityViolationException e) {
        flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'report.label', default: 'Report'), params.id])}"
        redirect(action: "show", id: params.id)
      }
    }
    else {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'report.label', default: 'Report'), params.id])}"
      redirect(action: "list")
    }
  }

  def deleteJSON = {
    def reportInstance = Report.get(params.id)
    if (reportInstance) {
      try {
        reportInstance.delete(flush: true)
        render 1
      }
      catch (org.springframework.dao.DataIntegrityViolationException e) {
        render "${message(code: 'default.not.deleted.message', args: [message(code: 'report.label', default: 'Report'), params.id])}"
      }
    }
    else {
      render "${message(code: 'default.not.found.message', args: [message(code: 'report.label', default: 'Report'), params.id])}"
    }
  }

}
