

<%@ page import="com.sptinc.Trip" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'trip.label', default: 'Trip')}" />
        <title><g:message code="default.edit.label" args="[entityName]" /></title>
    </head>
    <body>
        <div class="nav">
            <span class="menuButton"><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></span>
            <span class="menuButton"><g:link class="list" action="list"><g:message code="default.list.label" args="[entityName]" /></g:link></span>
            <span class="menuButton"><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></span>
        </div>
        <div class="body">
            <h1><g:message code="default.edit.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
            <div class="message">${flash.message}</div>
            </g:if>
            <g:hasErrors bean="${tripInstance}">
            <div class="errors">
                <g:renderErrors bean="${tripInstance}" as="list" />
            </div>
            </g:hasErrors>
            <g:form method="post" >
                <g:hiddenField name="id" value="${tripInstance?.id}" />
                <g:hiddenField name="version" value="${tripInstance?.version}" />
                <div class="dialog">
                    <table>
                        <tbody>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="startDate"><g:message code="trip.startDate.label" default="Start Date" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: tripInstance, field: 'startDate', 'errors')}">
                                    <g:datePicker name="startDate" precision="day" value="${tripInstance?.startDate}"  />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="endDate"><g:message code="trip.endDate.label" default="End Date" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: tripInstance, field: 'endDate', 'errors')}">
                                    <g:datePicker name="endDate" precision="day" value="${tripInstance?.endDate}"  />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="shortDescription"><g:message code="trip.shortDescription.label" default="Short Description" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: tripInstance, field: 'shortDescription', 'errors')}">
                                    <g:textField name="shortDescription" maxlength="100" value="${tripInstance?.shortDescription}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="purpose"><g:message code="trip.purpose.label" default="Purpose" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: tripInstance, field: 'purpose', 'errors')}">
                                    <g:textArea name="purpose" cols="40" rows="5" value="${tripInstance?.purpose}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="attendies"><g:message code="trip.attendies.label" default="Attendies" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: tripInstance, field: 'attendies', 'errors')}">
                                    <g:select name="attendies" from="${com.sptinc.User.list()}" multiple="yes" optionKey="id" size="5" value="${tripInstance?.attendies*.id}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="contracts"><g:message code="trip.contracts.label" default="Contracts" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: tripInstance, field: 'contracts', 'errors')}">
                                    <g:select name="contracts" from="${com.sptinc.Contract.list()}" multiple="yes" optionKey="id" size="5" value="${tripInstance?.contracts*.id}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="events"><g:message code="trip.events.label" default="Events" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: tripInstance, field: 'events', 'errors')}">
                                    <g:select name="events" from="${com.sptinc.Event.list()}" multiple="yes" optionKey="id" size="5" value="${tripInstance?.events*.id}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="locations"><g:message code="trip.locations.label" default="Locations" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: tripInstance, field: 'locations', 'errors')}">
                                    <g:select name="locations" from="${com.sptinc.Location.list()}" multiple="yes" optionKey="id" size="5" value="${tripInstance?.locations*.id}" />
                                </td>
                            </tr>
                        
                        </tbody>
                    </table>
                </div>
                <div class="buttons">
                    <span class="button"><g:actionSubmit class="save" action="update" value="${message(code: 'default.button.update.label', default: 'Update')}" /></span>
                    <span class="button"><g:actionSubmit class="delete" action="delete" value="${message(code: 'default.button.delete.label', default: 'Delete')}" onclick="return confirm('${message(code: 'default.button.delete.confirm.message', default: 'Are you sure?')}');" /></span>
                </div>
            </g:form>
        </div>
    </body>
</html>
