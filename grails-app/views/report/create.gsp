

<%@ page import="com.sptinc.Report" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'report.label', default: 'Report')}" />
        <title><g:message code="default.create.label" args="[entityName]" /></title>
    </head>
    <body>
        <div class="nav">
            <span class="menuButton"><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></span>
            <span class="menuButton"><g:link class="list" action="list"><g:message code="default.list.label" args="[entityName]" /></g:link></span>
        </div>
        <div class="body">
            <h1><g:message code="default.create.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
            <div class="message">${flash.message}</div>
            </g:if>
            <g:hasErrors bean="${reportInstance}">
            <div class="errors">
                <g:renderErrors bean="${reportInstance}" as="list" />
            </div>
            </g:hasErrors>
            <g:form action="save" >
                <div class="dialog">
                    <table>
                        <tbody>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="trip"><g:message code="report.trip.label" default="Trip" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: reportInstance, field: 'trip', 'errors')}">
                                    <g:select name="trip.id" from="${com.sptinc.Trip.list()}" optionKey="id" value="${reportInstance?.trip?.id}"  />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="usefulness"><g:message code="report.usefulness.label" default="Usefulness" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: reportInstance, field: 'usefulness', 'errors')}">
                                    <g:textField name="usefulness" value="${fieldValue(bean: reportInstance, field: 'usefulness')}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="issues"><g:message code="report.issues.label" default="Issues" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: reportInstance, field: 'issues', 'errors')}">
                                    <g:textArea name="issues" cols="40" rows="5" value="${reportInstance?.issues}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="topics"><g:message code="report.topics.label" default="Topics" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: reportInstance, field: 'topics', 'errors')}">
                                    <g:textArea name="topics" cols="40" rows="5" value="${reportInstance?.topics}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="author"><g:message code="report.author.label" default="Author" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: reportInstance, field: 'author', 'errors')}">
                                    <g:select name="author.id" from="${com.sptinc.User.list()}" optionKey="id" value="${reportInstance?.author?.id}"  />
                                </td>
                            </tr>
                        
                        </tbody>
                    </table>
                </div>
                <div class="buttons">
                    <span class="button"><g:submitButton name="create" class="save" value="${message(code: 'default.button.create.label', default: 'Create')}" /></span>
                </div>
            </g:form>
        </div>
    </body>
</html>
