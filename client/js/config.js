'use strict';

// Declare app level module which depends on filters, and services
angular.module('pecunio.config', [])

  // version of this app
  .constant('version', '0.1')

  // where to redirect users if they need to authenticate (see module.routeSecurity)
  .constant('loginRedirectPath', '/login')

  .constant('timezone', 'America/New_York')  
  //.constant('timezone', 'Europe/Lisbon')

  .constant('pecunioDateFormat', 'yyyy-MM-dd')

  .constant('momentDateFormat', 'YYYY-MM-DD')

  .constant('ROLES', {'ADMIN': 1,'WEBMASTER': 2,'ACCOUNTS': 3,'MARKETING':4})

  .constant("adImagePath" , "http://pecunioug.opendingo.com:3000/uploads/adimages/")

  .constant('FBSETTINGS', {'APPID': '795595153854114','SECRECT': '82360a7e7b65e841db7f05bf531686e8'})

  .constant('GOOGLEPLUSSETTINGS', {'CLIENTID': '668555236568-k4n0rb0g9osllcj0b0qedurc8tsjmctl.apps.googleusercontent.com','APIKEY': 'AIzaSyBZ9Dx8b4nHzFR9uQdIggsLuflFCbPisV0'})
  
;


