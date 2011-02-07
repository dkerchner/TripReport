package com.sptinc

/* These are a list of contacts with contact information that are collected by the report author. */
class Contact {

  String firstName
  String lastName
  Organization organization // A Contact is associated with a company or agency 
  String email
  String phoneNumber
  String notes

  // Associated with a report
  static belongsTo = [report: Report] 
  // These values are not persisted
  static transients = ['name']

  static constraints = {
      firstName(blank: false)
      lastName(blank: false)
      email(email: true, blank: true, nullable: true) // validates as email
      phoneNumber(nullable: true)
      organization(blank: false)
	  notes(nullable: true)
  }

  int compareTo(obj) {
      lastName.compareTo(obj.lastName)
  }

  String toString() {
      return firstName + " " + lastName + " @ " + organization
  }
  
  // A non-persisted name property for consistency
  String getName() {
	  return this.toString()
  }

}
