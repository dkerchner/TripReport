package com.sptinc

import grails.converters.JSON

class UserController {

  static scaffold = true;

  static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

  def springSecurityService

  def index = {
    redirect(action: "list", params: params)
  }

  def list = {
    params.max = Math.min(params.max ? params.int('max') : 10, 100)
    [userInstanceList: User.list(params), userInstanceTotal: User.count()]
  }

  def listJSON = {
    def users = []
    for (u in User.list(params)) {
      def contractList = []

      def contracts = u.getContracts()
      for (c in contracts) {
        def contract = [id: c.id, name: c.toString()]
        contractList << contract
      }

      def user = [id: u.id, name: u.toString(), userName: u.username, email: u.email, company: u.company.toString(), fullName: u.fullName, contracts: contractList]
      users << user
    }

    def listResult = [total: users.size(), items: users]
    render listResult as JSON
  }

  def create = {
    def userInstance = new User()
    userInstance.properties = params
    return [userInstance: userInstance]
  }

  def save = {
    def userInstance = new User(params)
    if (userInstance.save(flush: true)) {
      flash.message = "${message(code: 'default.created.message', args: [message(code: 'user.label', default: 'User'), userInstance.id])}"
      redirect(action: "show", id: userInstance.id)
    }
    else {
      render(view: "create", model: [userInstance: userInstance])
    }
  }

  def saveJSON = {
    def userInstance
    if (params.task.equals("Create")) {
      userInstance = new User()
      params.remove('id')
    } else {
      userInstance = User.get(params.id)
    }

    if (userInstance) {   println params
      if (params.version) {
        def version = params.version.toLong()
        if (userInstance.version > version) {
          render "${message(code: 'default.optimistic.locking.failure', args: [message(code: 'user.label', default: 'User'), userInstance.id])}"
          return
        }
      }
      def contracts = params.contracts.split('[,]')

      params.remove('contracts')

      userInstance.contracts.clear();
      for (c in contracts) {
        def contract = Contract.get(c.asType(Long))
        userInstance.addToContracts(contract);
      }

      // The front end handles the comparison of password1 and password2
      if (params.password1 != null && !params.password1.equals('')) {
         def password = springSecurityService.encodePassword(params.password1);
         userInstance.password = password
      }

      userInstance.properties = params

      if (!userInstance.hasErrors() && userInstance.save(flush: true)) {
        render 1
      }
      else {
        println userInstance.errors
        render "${message(code: 'Could not update. A necessary value is missing.', args: [message(code: 'user.label', default: 'User'), params.id])}"
      }
    }
    else {
      render "${message(code: 'default.not.found.message', args: [message(code: 'user.label', default: 'User'), params.id])}"
    }
  }

  def show = {
    def userInstance = User.get(params.id)
    if (!userInstance) {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'user.label', default: 'User'), params.id])}"
      redirect(action: "list")
    }
    else {
      [userInstance: userInstance]
    }
  }

  def showJSON = {
    def userInstance = User.get(params.id)
    if (!userInstance) {
      render "${message(code: 'default.not.found.message', args: [message(code: 'user.label', default: 'User'), params.id])}"
    }
    else {
      def contractList = []
      def roleList =[]

      def contracts = userInstance.getContracts()
      for (c in contracts) {
        def contract = [id: c.id, name: c.toString()]
        contractList << contract
      }

      def roles = userInstance.getAuthorities()
      for (r in roles) {
        def role = [id: r.id, name: r.authority]
        roleList << role
      }


      def user = [id: userInstance.id, fullName: userInstance.fullName, name: userInstance.toString(), userName: userInstance.username, email: userInstance.email, company: userInstance.company.toString(), companyId: userInstance.company.id, contracts: contractList, roles: roleList]
      def result = [success: true, data: user]

      render result as JSON
    }
  }


  def edit = {
    def userInstance = User.get(params.id)
    if (!userInstance) {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'user.label', default: 'User'), params.id])}"
      redirect(action: "list")
    }
    else {
      return [userInstance: userInstance]
    }
  }

  def update = {
    def userInstance = User.get(params.id)
    if (userInstance) {
      if (params.version) {
        def version = params.version.toLong()
        if (userInstance.version > version) {

          userInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'user.label', default: 'User')] as Object[], "Another user has updated this User while you were editing")
          render(view: "edit", model: [userInstance: userInstance])
          return
        }
      }
      userInstance.properties = params
      if (!userInstance.hasErrors() && userInstance.save(flush: true)) {
        flash.message = "${message(code: 'default.updated.message', args: [message(code: 'user.label', default: 'User'), userInstance.id])}"
        redirect(action: "show", id: userInstance.id)
      }
      else {
        render(view: "edit", model: [userInstance: userInstance])
      }
    }
    else {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'user.label', default: 'User'), params.id])}"
      redirect(action: "list")
    }
  }

  def delete = {
    def userInstance = User.get(params.id)
    if (userInstance) {
      try {
        userInstance.delete(flush: true)
        flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'user.label', default: 'User'), params.id])}"
        redirect(action: "list")
      }
      catch (org.springframework.dao.DataIntegrityViolationException e) {
        flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'user.label', default: 'User'), params.id])}"
        redirect(action: "show", id: params.id)
      }
    }
    else {
      flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'user.label', default: 'User'), params.id])}"
      redirect(action: "list")
    }
  }

  def deleteJSON = {
    def userInstance = User.get(params.id)
    if (userInstance) {
      try {
        userInstance.delete(flush: true)
        render 1
      }
      catch (org.springframework.dao.DataIntegrityViolationException e) {
        render "${message(code: 'default.not.deleted.message', args: [message(code: 'user.label', default: 'User'), params.id])}"
      }
    }
    else {
      //flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
      render "${message(code: 'default.not.found.message', args: [message(code: 'user.label', default: 'User'), params.id])}"
    }
  }

}
