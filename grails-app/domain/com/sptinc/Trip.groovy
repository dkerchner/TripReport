package com.sptinc

class Trip {

    Date startDate
    Date endDate
    String shortDescription
    String purpose
    Float estimatedCostPerPerson

    //SortedSet contracts
    //SortedSet events
    //SortedSet locations
    //SortedSet attendees

    Date dateCreated
    Date lastUpdated

    static searchable = true

    static belongsTo = [com.sptinc.User, com.sptinc.Report]

    static hasMany = [contracts: Contract, events: Event, locations: Location]

    static constraints = {
        startDate(blank: false)
        endDate(blank: false)
        shortDescription(blank: false, maxSize: 100)
        purpose(blank: false, maxSize: 255)
        estimatedCostPerPerson(nullable:true)
        //approvedBy(nullable: true)
    }

    static mapping = {
      contracts cascade: 'save-update'
      events cascade: 'save-update'
      locations cascade: 'save-update'
      //attendees cascade: 'save-update'
      //report cascade: 'save-update'
    }

  def compareTo = {obj ->
      startDate.compareTo(obj.startDate)
  }

  Set<User> getAttendees() {
      UserTrip.findAllByTrip(this).collect { it.attendee } as Set
  }


   def beforeInsert() {
       dateCreated = new Date()
   }

   def beforeUpdate() {
       lastUpdated = new Date()
   }

   def list = {
       [ "trips" : Trip.list() ]
   }

   String toString() {
       return shortDescription
   }
}
