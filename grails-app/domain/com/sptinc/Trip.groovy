package com.sptinc

/* A Trip is created by a User to show that they would like to attend Events. */ 
class Trip {

	Date startDate
	Date endDate
	String shortDescription
	String purpose
	Float estimatedCost

	Date dateCreated
	Date lastUpdated

	static searchable = true

	static belongsTo = [
		com.sptinc.User,
		com.sptinc.Report
	]

	// Each Trip can be assigned to many Events
	// Each Trip can be assigned many Contracts
	// Each User can be assigned many Locations (is this necessary?)
	static hasMany = [contracts: Contract, events: Event, locations: Location]
	// These values are not persisted
	static transients = ['name']
	
	static constraints = {
		startDate(blank: false)
		endDate(blank: false)
		shortDescription(blank: false, maxSize: 100)
		purpose(blank: false, maxSize: 255)
		estimatedCost(nullable:true)
		//approvedBy(nullable: true)
	}

	// Cascade mappings
	static mapping = {
		contracts cascade: 'save-update'
		events cascade: 'save-update'
		locations cascade: 'save-update'
	}

	def compareTo = {obj ->
		startDate.compareTo(obj.startDate)
	}

	// Get all of the Users attending this trip
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
	
	String getName() {
		return this.toString()
	}
}
