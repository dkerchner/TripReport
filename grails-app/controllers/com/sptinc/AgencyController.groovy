package com.sptinc

import grails.converters.*

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
        def agency = [id:a.id, name:a.toString(), url:a.url]
        agencies << agency
      }

      def listResult = [ total: agencies.count(), items: agencies]
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
}
