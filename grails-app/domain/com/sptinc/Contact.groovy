package com.sptinc

class Contact {

  String firstName
  String lastName
  Organization organization
  String email
  String phoneNumber
  String notes
  //Report report

  //List reports

  static belongsTo = [report: Report]
  static transients = ['name']

  static constraints = {
      firstName(blank: false)
      lastName(blank: false)
      email(email: true, blank: true)
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
  
  String getName() {
	  return this.toString()
  }

}
