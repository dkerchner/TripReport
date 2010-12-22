package com.sptinc

class Contact {

  String firstName
  String lastName
  Organization organization
  String email
  String phoneNumber

  List tripReports

  static belongsTo = [com.sptinc.Report]

  static hasMany = [tripReports: Report]

  static constraints = {
      firstName(blank: false)
      lastName(blank: false)
      email(email: true, blank: true)
      phoneNumber(nullable: true)
      organization(blank: false)
  }

  int compareTo(obj) {
      lastName.compareTo(obj.lastName)
  }

  String toString() {
      return firstName + " " + lastName + " @ " + organization
  }

}
