package com.sptinc

class Report {

  Trip trip
  User author
  Integer usefulness
  String issues
  String topics

  //List actionItems
  //SortedSet contacts

  Date dateCreated
  Date lastUpdated

  static searchable = true

  static hasMany = [actionItems: ActionItem, contacts: Contact]

  static constraints = {
      trip(nullable: true)
      usefulness(maxSize: 10)
      issues(maxSize: 2500)
      topics(maxSize: 2500)
  }

  static mapping = {
      author lazy: false
      trip cascade: 'save-update'
  }

 def beforeInsert() {
     dateCreated = new Date()
 }

 def beforeUpdate() {
     lastUpdated = new Date()
 }

 def list = {
     [ "reports" : Report.list() ]
 }

 String toString() {
     return trip.toString() + " by " + author
 }
}
