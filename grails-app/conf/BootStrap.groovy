import grails.util.GrailsUtil
import java.text.SimpleDateFormat
import grails.converters.*
import com.sptinc.*

class BootStrap {
    //This is a git test 2
    def springSecurityService
    def df = new SimpleDateFormat("MM/dd/yyyy")


    def init = { servletContext ->
        JSON.registerObjectMarshaller(Date) {
            return it?.format("MM/dd/yyyy")
        }
        switch(GrailsUtil.environment){
          case "development":
            def userRole = Role.findByAuthority('ROLE_USER') ?: new Role(authority: 'ROLE_USER').save(failOnError: true)
            def adminRole = Role.findByAuthority('ROLE_ADMIN') ?: new Role(authority: 'ROLE_ADMIN').save(failOnError: true)

            def sptCompany = new Company(name: "SPT", url:"http://www.inc.spt.com").save(failOnError: true)
            def abcAgency = new Agency(name: "ABC", url: "http://www.abc.gov").save(failOnError: true)

            def dkerchnerUser = new User(username:"dkerchner",
                fullName: "Dominic K.",
                password: springSecurityService.encodePassword('password'),
                email: "dominic.kerchner@spt-inc.com",
                enabled: true,
                company: sptCompany).save(failOnError: true)

            def edullUser = new User(username:"edull",
                fullName: "Eric Dull",
                password: springSecurityService.encodePassword('password'),
                email: "edull@spt-inc.com",
                enabled: true,
                company: sptCompany).save(failOnError: true)

            def mgrUser = new User(username:"mgr",
                fullName: "The Manager",
                password: springSecurityService.encodePassword('password'),
                email: "mgr@spt-inc.com",
                enabled: true,
                company: sptCompany).save(failOnError: true)

            def adminUser = User.findByUsername('admin') ?: new User(
                username: 'admin',
                fullName: "The Admin",
                password: springSecurityService.encodePassword('admin'),
                email: "admin@admin.com",
                enabled: true,
                company: sptCompany).save(failOnError: true)

            def laLoc = new Location(city: "Los Angeles", state:"CA", country:"USA").save(failOnError: true)
            def hanoverLoc = new Location(city: "Hanover", state:"MD", country:"USA").save(failOnError: true)
            def abcContract = new Contract(contractNumber: "123456", organization: abcAgency, manager: edullUser).save(failOnError: true)
            def xyzContract = new Contract(contractNumber: "8675309", organization: abcAgency, manager: edullUser).save(failOnError: true)
            def adobeMAXEvent = new Event(name: "AdobeMAX",
                location:laLoc,
                startDate: df.parse("10/25/2010"),
                endDate: df.parse("10/27/2010")).save(failOnError: true)
            def netezzaEvent = new Event(name: "Netezza Training",
                location:hanoverLoc,
                startDate: df.parse("11/01/2010"),
                endDate: df.parse("11/05/2010")).save(failOnError: true)

            def contact1 = new Contact(firstName: "John",
                lastName: "Doe",
                organization: abcAgency,
                email: "contact@contact.com").save(failOnError: true)
            def contact2 = new Contact(firstName: "Jane",
                lastName: "Doe",
                organization: abcAgency,
                email: "contact@contact.com").save(failOnError: true)
            def actionItem1 = new ActionItem(name: "Learn Flash")
            def actionItem2 = new ActionItem(name: "Buy a Netezza")

            def trip1 = new Trip (
                startDate: df.parse("10/24/2010"),
                endDate: df.parse("10/28/2010"),
                shortDescription: "Adobe MAX Conference",
                purpose: "Drink Adobe KoolAid")/*,
                approvedBy: mgrUser,
                approved: true)    */

            trip1.addToEvents(adobeMAXEvent)
            trip1.addToContracts(abcContract)
            trip1.addToContracts(xyzContract)
            trip1.addToLocations(laLoc)

            //trip1.addToAttendees(dkerchnerUser)
            //trip1.addToAttendees(edullUser)

            trip1.save(failOnError: true)

            def userTrip1 = UserTrip.create(dkerchnerUser, trip1, true)
            //def userTrip1 = UserTrip.get(dkerchnerUser.id, trip1.id)
            userTrip1.approved = true
            userTrip1.approvedBy = mgrUser
            userTrip1.save(failOnError: true)
            UserTrip.create(edullUser, trip1)


            def tripReport1 = new Report (trip: trip1,
                author: dkerchnerUser,
                usefulness: 10,
                issues: "Too much Photoshop. Not enough HTML5",
                topics: "Flash, Flex, AIR, Android, SQL" )

            tripReport1.addToActionItems(actionItem1)
            tripReport1.addToContacts(contact1)

            tripReport1.save(failOnError: true)

            def tripReport2 = new Report (trip: trip1,
                author: edullUser,
                usefulness: 5,
                issues: "Not enough math",
                topics: "Flash, Flex, AIR, Android, SQL" )

            tripReport2.addToActionItems(actionItem1)
            tripReport2.addToContacts(contact1)

            tripReport2.save(failOnError: true)

            def trip2 = new Trip (
                 startDate: df.parse("11/01/2010"),
                 endDate: df.parse("11/05/2010"),
                 shortDescription: "Netezza Training",
                 purpose: "Learn how to setup and maintain the Netezza system.")/*,
                 approvedBy: mgrUser,
                 approved: true)*/

             trip2.addToEvents(netezzaEvent)
             trip2.addToContracts(abcContract)
             trip2.addToLocations(hanoverLoc)
             //trip2.addToAttendees(dkerchnerUser)
            //trip2.addToAttendees(edullUser)

             trip2.save(failOnError: true)
            //trip2.addToEvents(adobeMAXEvent)
            //trip2.addToAttendees(edullUser)
            trip2.save(failOnError: true)


            def tripReport3 = new Report (trip: trip2,
                author: dkerchnerUser,
                usefulness: 10,
                issues: "Could have been compressed.",
                topics: "Netezza, databases, SQL" )

            tripReport3.addToActionItems(actionItem2)
            tripReport3.addToContacts(contact2)

            tripReport3.save(failOnError: true)

            def tripReport4 = new Report (trip: trip2,
                author: edullUser,
                usefulness: 10,
                issues: "Did not give free Netezza.",
                topics: "Netezza, databases, SQL" )

            tripReport4.addToActionItems(actionItem2)
            tripReport4.addToContacts(contact2)

            tripReport4.save(failOnError: true)


            if (!adminUser.authorities.contains(adminRole)) {
                UserRole.create adminUser, adminRole
                UserRole.create dkerchnerUser, userRole
            }

            break

          case "production":
          break
        }
    }
    def destroy = {
    }
}