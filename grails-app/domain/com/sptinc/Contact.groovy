package com.sptinc

/* These are a list of contacts with contact information that are collected by the report author. */
class Contact {

  String firstName
  String lastName
  Organization organization
  String email
  String phoneNumber
  String notes

  static belongsTo = [report: Report]
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
