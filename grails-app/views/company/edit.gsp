

<%@ page import="com.sptinc.Company" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'company.label', default: 'Company')}" />
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
            <g:hasErrors bean="${companyInstance}">
            <div class="errors">
                <g:renderErrors bean="${companyInstance}" as="list" />
            </div>
            </g:hasErrors>
            <g:form method="post" >
                <g:hiddenField name="id" value="${companyInstance?.id}" />
                <g:hiddenField name="version" value="${companyInstance?.version}" />
                <div class="dialog">
                    <table>
                        <tbody>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="name"><g:message code="company.name.label" default="Name" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: companyInstance, field: 'name', 'errors')}">
                                    <g:textField name="name" value="${companyInstance?.name}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="url"><g:message code="company.url.label" default="Url" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: companyInstance, field: 'url', 'errors')}">
                                    <g:textField name="url" value="${companyInstance?.url}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="contacts"><g:message code="company.contacts.label" default="Contacts" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: companyInstance, field: 'contacts', 'errors')}">
                                    
<ul>
<g:each in="${companyInstance?.contacts?}" var="c">
    <li><g:link controller="contact" action="show" id="${c.id}">${c?.encodeAsHTML()}</g:link></li>
</g:each>
</ul>
<g:link controller="contact" action="create" params="['company.id': companyInstance?.id]">${message(code: 'default.add.label', args: [message(code: 'contact.label', default: 'Contact')])}</g:link>

                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="contracts"><g:message code="company.contracts.label" default="Contracts" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: companyInstance, field: 'contracts', 'errors')}">
                                    
<ul>
<g:each in="${companyInstance?.contracts?}" var="c">
    <li><g:link controller="contract" action="show" id="${c.id}">${c?.encodeAsHTML()}</g:link></li>
</g:each>
</ul>
<g:link controller="contract" action="create" params="['company.id': companyInstance?.id]">${message(code: 'default.add.label', args: [message(code: 'contract.label', default: 'Contract')])}</g:link>

                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="users"><g:message code="company.users.label" default="Users" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: companyInstance, field: 'users', 'errors')}">
                                    
<ul>
<g:each in="${companyInstance?.users?}" var="u">
    <li><g:link controller="user" action="show" id="${u.id}">${u?.encodeAsHTML()}</g:link></li>
</g:each>
</ul>
<g:link controller="user" action="create" params="['company.id': companyInstance?.id]">${message(code: 'default.add.label', args: [message(code: 'user.label', default: 'User')])}</g:link>

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
