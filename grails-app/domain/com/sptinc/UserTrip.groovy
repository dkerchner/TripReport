package com.sptinc

import org.apache.commons.lang.builder.HashCodeBuilder


/* This class is an implementation  of the Join Table between Users and Trips. This is usually
* auto-managed by Grails in a Has Many, however more functionality was needed.
*/
class UserTrip implements Serializable {

	User attendee
	Trip trip
	boolean approved = false
	User approvedBy = null

	static constraints = {
		attendee(nullable: false)
		trip(nullable: false)
		approvedBy(nullable: true)
	}
	
	// These values are not persisted
	static transients = ['name']

	boolean equals(other) {
		if (!(other instanceof UserTrip)) {
			return false
		}

		other.attendee?.id == attendee?.id &&
				other.trip?.id == trip?.id
	}

	int hashCode() {
		def builder = new HashCodeBuilder()
		if (attendee) builder.append(attendee.id)
		if (trip) builder.append(trip.id)
		builder.toHashCode()
	}

	// Get helper function for User and Trip
	static UserTrip get(long attendeeId, long tripId) {
		find 'from UserTrip where attendee.id=:attendeeId and trip.id=:tripId',
				[attendeeId: attendeeId, tripId: tripId]
	}

	// Create function that can flush or not
	static UserTrip create(User attendee, Trip trip, boolean failOnError = false, boolean flush = false) {
		new UserTrip(attendee: attendee, trip: trip).save(failOnError: failOnError, flush: flush, insert: true)
	}

	// Delete function that can flush or not
	static boolean remove(User attendee, Trip trip, boolean flush = false) {
		UserTrip instance = UserTrip.findByAttendeeAndTrip(attendee, trip)
		instance ? instance.delete(flush: flush) : false
	}

	// Deletes all UserTrips for a User
	static void removeAll(User attendee) {
		executeUpdate 'DELETE FROM UserTrip WHERE attendee=:attendee', [attendee: attendee]
	}

	// Deletes all UserTrips for a Trip
	static void removeAll(Trip trip) {
		executeUpdate 'DELETE FROM UserTrip WHERE trip=:trip', [trip: trip]
	}

	// Composite id mapping
	static mapping = {
		id composite: ['trip', 'attendee']
		version false
	}

	String toString() {
		return trip.getName() + ' for ' + attendee.getName()
	}

	String getName() {
		return this.toString()
	}
}
