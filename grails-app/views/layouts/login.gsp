<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1"/>
  <title><g:layoutTitle default="SPT Trip Report Application"/></title>


  <link type="text/css" href="${resource(dir: 'css', file: 'main.css')}"/>

  <link rel="shortcut icon" href="${resource(dir: 'images', file: 'favicon.ico')}" type="image/x-icon"/>
  <g:layoutHead />
  <g:javascript library="application" />
</head>
<body>
    <div id="spinner" class="spinner" style="display:none;">
        <img src="${resource(dir:'images',file:'spinner.gif')}" alt="${message(code:'spinner.alt',default:'Loading...')}" />
    </div>
    <div id="sptLogo"><a href="http://www.spt-inc.com"><img src="${resource(dir:'images',file:'SPT.png')}" alt="SPT" border="0" /></a></div>
    <g:layoutBody />
</body>
</html>