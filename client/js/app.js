/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var PecunioApp = angular.module("PecunioApp", [
    "ui.router", 
    "ui.bootstrap", 
    "oc.lazyLoad",  
    "ngSanitize",
    "ngCkeditor",
    "datatables",
    "ngResource",
    "lbServices",
    "restangular",
    "pecunio.services",
    "pascalprecht.translate", 
    "jcs-autoValidate",
    "pecunio.config",
    //"ui",
    "angularFileUpload",
    "ngFileUpload",
    "ngCookies",
    "facebook",
    "googleplus"
]); 

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
PecunioApp


.config(function($ocLazyLoadProvider, RestangularProvider, $controllerProvider, FacebookProvider, GooglePlusProvider, FBSETTINGS){

  $ocLazyLoadProvider.config({
        cssFilesInsertBefore: 'ng_load_plugins_before' // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
  });

  $controllerProvider.allowGlobals();

  RestangularProvider.setBaseUrl('/api'); 

  FacebookProvider.init({
    appId:'795595153854114',
    secret: '82360a7e7b65e841db7f05bf531686e8',
    //cookie: true,
    //xfbml: true,
    //oauth: true
  });

  GooglePlusProvider.init({
        clientId: '668555236568-k4n0rb0g9osllcj0b0qedurc8tsjmctl.apps.googleusercontent.com',
        apiKey: 'AIzaSyBZ9Dx8b4nHzFR9uQdIggsLuflFCbPisV0'
  });
})


/********************************************
 BEGIN: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/
/**
`$controller` will no longer look for controllers on `window`.
The old behavior of looking on `window` for controllers was originally intended
for use in examples, demos, and toy apps. We found that allowing global controller
functions encouraged poor practices, so we resolved to disable this behavior by
default.

To migrate, register your controllers with modules rather than exposing them
as globals:

Before:

```javascript
function MyController() {
  // ...
}
```

After:

```javascript
angular.module('myApp', []).controller('MyController', [function() {
  // ...
}]);

Although it's not recommended, you can re-enable the old behavior like this:

```javascript
angular.module('myModule').config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);
**/

//AngularJS v1.3.x workaround for old style controller declarition in HTML
/*.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}])*/

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar state
            showSupportControll: true,
            showProfileControll: false,
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: Metronic.getAssetsPath() + 'admin/layout/img/',
        layoutCssPath: Metronic.getAssetsPath() + 'admin/layout/css/'
    };

    $rootScope.settings = settings;

    return settings;
}])


.config(['$httpProvider', 

  function($httpProvider) {
  
  // Intercept 401 responses and redirect to login screen
  $httpProvider.interceptors.push(function($q, $location, LoopBackAuth) {
    return {
      responseError: function(rejection) {
        //console.log('intercepted rejection of ', rejection.config.url, rejection.status);
        if (rejection.status == 401) {
          LoopBackAuth.currentUserData = null;
          
          // save the current location so that login can redirect back
          $location.nextAfterLogin = $location.path();
          $location.path('/login');
        }
        return $q.reject(rejection);
      }
    };
  });
}])

//* Init global settings and run the app */
.run(["$rootScope", "settings", "$state", "validator", "validationElementModifier", "validationErrorMessageResolver","$translate", "LoopBackAuth","PecunioUser","userDetailsFactory", "AppAuth",

  function($rootScope, settings, $state, validator, validationElementModifier, validationErrorMessageResolver,$translate, LoopBackAuth, PecunioUser,userDetailsFactory, AppAuth) {
    $rootScope.$state = $state; // state to be accessed from view
    
    $rootScope.$on('$locationChangeStart',function(evt, absNewUrl, absOldUrl) {  
       
       if(LoopBackAuth.currentUserData === null){
            $state.go('login');
       }

       //var getUserdata = sessionStorage.getItem('userData');
       $rootScope.fullName = localStorage.fullName;
       
    });


    $rootScope.$on('$stateChangeStart', function(ev, to, toParams, from, fromParams){
        
        $rootScope.isLog = true;
        $rootScope.isAdmin = true;
        $rootScope.showSupportControll = true;
        
        $rootScope.settings.layout.pageSidebarClosed = false;
        $rootScope.isAccountUser = true;

        //$rootScope.fullName = localStorage.fullName;
        
        ///////
        
        var jsonUserArr = userDetailsFactory.getUserDetails(); //changed for session storage conflict
        if(jsonUserArr){
          $rootScope.userRole = jsonUserArr.roleId;
          $rootScope.addCanSee = [1,4];  
        }
        ///////

        //$translate.use('de');
        
        /**
        * Auto-validate...
        */
        validator.registerDomModifier(
          validationElementModifier.key, 
          validationElementModifier
        );
        validator.setDefaultElementModifier(validationElementModifier.key);

        validator.setErrorMessageResolver(validationErrorMessageResolver.resolve);


    });

   


    
}]);