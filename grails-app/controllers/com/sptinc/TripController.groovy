package com.sptinc

import grails.converters.*

class TripController {

    def df = new java.text.SimpleDateFormat("yy/MM/dd")

    static scaffold = true;

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def springSecurityService


    def index = {
        redirect(action: "list", params: params)
    }

    def list = {
        params.max = Math.min(params.max ? params.int('max') : 10, 100)
        [tripInstanceList: Trip.list(params), tripInstanceTotal: Trip.count()]
    }

    def listJSON = {
      def trips = []
      for (t in Trip.list(params)) {
        def events = t.getEvents()
        def contracts = t.getContracts()
        def locations = t.getLocations()
        def attendees = t.getAttendees()

        def eventString = ""
        for (e in events) {
            eventString += e.toString()
        }
        def contractString = ""
        for (c in contracts) {
            contractString += c.toString() + " "
        }
        contractString.trim()
        def locationsString = ""
        for (l in locations) {
            locationsString += l.toString()
        }
        def attendeesString = ""
        for (a in attendees) {
            attendeesString += a.toString()
        }


        def trip = [id:t.id, name:t.toString(), purpose:t.purpose, startDate:t.startDate, endDate:t.endDate, events:eventString, attendees: attendeesString, locations: locationsString, contracts: contractString]
        trips << trip
      }

      def listResult = [ total: trips.count(), items: trips]
      render listResult as JSON
    }

    def listByAttendeeJSON = {
      def trips = []
      for (t in Trip.list()) {
        def events = t.getEvents()
        def contracts = t.getContracts()
        def locations = t.getLocations()
        def attendees = t.getAttendees()

        def eventString = ""
        for (e in events) {
            eventString += e.toString()
        }
        def contractString = ""
        for (c in contracts) {
            contractString += c.toString() + " "
        }
        def locationsString = ""
        for (l in locations) {
            locationsString += l.toString()
        }
        for (a in attendees) {
          println a.toString()
          def attendeeTrip = UserTrip.get(a.id, t.id)
          def trip = [id:t.id, name:t.toString(), purpose:t.purpose, startDate:t.startDate, endDate:t.endDate, events:eventString, attendee: a.toString(), attendeeId: a.id, approved: attendeeTrip.approved, approvedBy: attendeeTrip.approvedBy.toString(), locations: locationsString, contracts: contractString]
          trips << trip
        }
      }

      def listResult = [ total: trips.count(), items: trips]
      render listResult as JSON
    }



    def create = {
        def tripInstance = new Trip()
        tripInstance.properties = params
        return [tripInstance: tripInstance]
    }

    def save = {
        def tripInstance = new Trip(params)
        if (tripInstance.save(flush: true)) {
            flash.message = "${message(code: 'default.created.message', args: [message(code: 'trip.label', default: 'Trip'), tripInstance.id])}"
            redirect(action: "show", id: tripInstance.id)
        }
        else {
            render(view: "create", model: [tripInstance: tripInstance])
        }
    }

    def saveJSON = {
        def startDate = df.parse(params.startDate)
        def endDate = df.parse(params.endDate)
        params.remove('startDate')
        params.remove('endDate')

        def tripInstance = new Trip(params)
        tripInstance.setProperty('startDate', startDate)
        tripInstance.setProperty('endDate', endDate)

        if (tripInstance.save(flush: true, failOnError: true)) {
            render "1"
        }
        else {
            render "0"
        }
    }

  def attendJSON = {
      def user = User.get(springSecurityService.principal.id)

      UserTrip userTrip = UserTrip.get(user.id, params.int('id'))
      if (!userTrip) {
        Trip trip = Trip.get(params.id)
        if (UserTrip.create(user, trip)) {
          render "1"
        } else {
          render "${message(code: 'Could not update. A necessary value is missing.', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
        }
      } else {
        render "${message(code: 'You have already requested to attend this trip.', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
      }
  }

    def show = {
        def tripInstance = Trip.get(params.id)
        if (!tripInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
            redirect(action: "list")
        }
        else {
            [tripInstance: tripInstance]
        }
    }

    def edit = {
        def tripInstance = Trip.get(params.id)
        if (!tripInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
            redirect(action: "list")
        }
        else {
            return [tripInstance: tripInstance]
        }
    }

    def update = {
        def tripInstance = Trip.get(params.id)
        if (tripInstance) {
            if (params.version) {
                def version = params.version.toLong()
                if (tripInstance.version > version) {
                    
                    tripInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'trip.label', default: 'Trip')] as Object[], "Another user has updated this Trip while you were editing")
                    render(view: "edit", model: [tripInstance: tripInstance])
                    return
                }
            }
            tripInstance.properties = params
            if (!tripInstance.hasErrors() && tripInstance.save(flush: true)) {
                flash.message = "${message(code: 'default.updated.message', args: [message(code: 'trip.label', default: 'Trip'), tripInstance.id])}"
                redirect(action: "show", id: tripInstance.id)
            }
            else {
                render(view: "edit", model: [tripInstance: tripInstance])
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
            redirect(action: "list")
        }
    }

  def updateJSON = {
      def tripInstance = Trip.get(params.id)

      if (tripInstance) {
          if (params.version) {
              def version = params.version.toLong()
              if (tripInstance.version > version) {
                  render "${message(code: 'default.optimistic.locking.failure', args: [message(code: 'trip.label', default: 'Trip'), tripInstance.id])}"
                  return
              }
          }

          tripInstance.setProperty('startDate', df.parse(params.startDate))
          tripInstance.setProperty('endDate', df.parse(params.endDate))
          params.remove('startDate')
          params.remove('endDate')
          tripInstance.properties = params

          if (!tripInstance.hasErrors() && tripInstance.save(flush: true)) {
              render 1
          }
          else {
              render "${message(code: 'Could not update. A necessary value is missing.', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
          }
      }
      else {
          render "${message(code: 'default.not.found.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
      }
  }


    def delete = {
        def tripInstance = Trip.get(params.id)
        if (tripInstance) {
            try {
                tripInstance.delete(flush: true)
                flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
                redirect(action: "list")
            }
            catch (org.springframework.dao.DataIntegrityViolationException e) {
                flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
                redirect(action: "show", id: params.id)
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
            redirect(action: "list")
        }
    }

  def deleteJSON = {
      def tripInstance = Trip.get(params.id)
      if (tripInstance) {
          try {
              tripInstance.delete(flush: true)
              render 1
          }
          catch (org.springframework.dao.DataIntegrityViolationException e) {
            render "${message(code: 'default.not.deleted.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
          }
      }
      else {
          //flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
          render "${message(code: 'default.not.found.message', args: [message(code: 'trip.label', default: 'Trip'), params.id])}"
      }
  }

}
