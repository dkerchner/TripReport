package com.sptinc

import grails.converters.*

class ContractController {
    static scaffold = true;

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index = {
        redirect(action: "list", params: params)
    }

    def list = {
        params.max = Math.min(params.max ? params.int('max') : 10, 100)
        [contractInstanceList: Contract.list(params), contractInstanceTotal: Contract.count()]
    }

  def listJSON = {
    def contracts = []
    for (c in Contract.list(params)) {
      def contract = [id:c.id, name:c.toString(), organization:c.organization.toString(), manager:c.manager.toString(), active:c.active]
      contracts << contract
    }

    def listResult = [ total: contracts.count(), items: contracts]
    render listResult as JSON
  }


    def create = {
        def contractInstance = new Contract()
        contractInstance.properties = params
        return [contractInstance: contractInstance]
    }

    def save = {
        def contractInstance = new Contract(params)
        if (contractInstance.save(flush: true)) {
            flash.message = "${message(code: 'default.created.message', args: [message(code: 'contract.label', default: 'Contract'), contractInstance.id])}"
            redirect(action: "show", id: contractInstance.id)
        }
        else {
            render(view: "create", model: [contractInstance: contractInstance])
        }
    }

    def show = {
        def contractInstance = Contract.get(params.id)
        if (!contractInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'contract.label', default: 'Contract'), params.id])}"
            redirect(action: "list")
        }
        else {
            [contractInstance: contractInstance]
        }
    }

    def edit = {
        def contractInstance = Contract.get(params.id)
        if (!contractInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'contract.label', default: 'Contract'), params.id])}"
            redirect(action: "list")
        }
        else {
            return [contractInstance: contractInstance]
        }
    }

    def update = {
        def contractInstance = Contract.get(params.id)
        if (contractInstance) {
            if (params.version) {
                def version = params.version.toLong()
                if (contractInstance.version > version) {
                    
                    contractInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'contract.label', default: 'Contract')] as Object[], "Another user has updated this Contract while you were editing")
                    render(view: "edit", model: [contractInstance: contractInstance])
                    return
                }
            }
            contractInstance.properties = params
            if (!contractInstance.hasErrors() && contractInstance.save(flush: true)) {
                flash.message = "${message(code: 'default.updated.message', args: [message(code: 'contract.label', default: 'Contract'), contractInstance.id])}"
                redirect(action: "show", id: contractInstance.id)
            }
            else {
                render(view: "edit", model: [contractInstance: contractInstance])
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'contract.label', default: 'Contract'), params.id])}"
            redirect(action: "list")
        }
    }

    def delete = {
        def contractInstance = Contract.get(params.id)
        if (contractInstance) {
            try {
                contractInstance.delete(flush: true)
                flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'contract.label', default: 'Contract'), params.id])}"
                redirect(action: "list")
            }
            catch (org.springframework.dao.DataIntegrityViolationException e) {
                flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'contract.label', default: 'Contract'), params.id])}"
                redirect(action: "show", id: params.id)
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'contract.label', default: 'Contract'), params.id])}"
            redirect(action: "list")
        }
    }
}
