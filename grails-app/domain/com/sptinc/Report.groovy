package com.sptinc

/* A Report is submitted by the User after they go on a Trip. It contains all of the information the User learned on the Trip
 * as well information needed to assess the success of the Trip. 
 */
class Report {

  Trip trip // The Trip that this report is about
  User author 
  Integer usefulness
  String issues
  String topics

  Date dateCreated
  Date lastUpdated

  static searchable = true

  // Each Report can be have many ActionItems
  // Each Trip can be assigned many Contracts
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
