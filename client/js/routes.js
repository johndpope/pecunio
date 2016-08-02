/* Setup Rounting For All Pages */
PecunioApp

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    // Redirect any unmatched url
    //$urlRouterProvider.otherwise("/dashboard.html");
	//$urlRouterProvider.otherwise("/login");

    $urlRouterProvider.when('/login', '/');
    //$urlRouterProvider.when('/dashboard', '/dashboard');

    $stateProvider
        
        // Dashboard

        .state('dashboard', {
            url: "/dashboard.html",
            templateUrl: "views/dashboard.html", 
            data: {pageSubTitle: '', pagetype: "dashboard"},
            controller: "DashboardController",
            resolve: {
				
                deps: ['$ocLazyLoad', function($ocLazyLoad) { 
                   var returnval =  $ocLazyLoad.load({
                        name: 'PecunioApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                             '../lib/metronic_assets/global/plugins/morris/morris.css',
                             '../lib/metronic_assets/admin/pages/css/tasks.css',
                            
                             '../lib/metronic_assets/global/plugins/morris/morris.min.js',
                             '../lib/metronic_assets/global/plugins/morris/raphael-min.js',
                             '../lib/metronic_assets/global/plugins/jquery.sparkline.min.js',

                             '../lib/metronic_assets/admin/pages/scripts/index3.js',
                             '../lib/metronic_assets/admin/pages/scripts/tasks.js',
                             'js/controllers/DashboardController.js',
                             'js/controllers/PublisherDomain.js'
                        ] 
                    }); return returnval;
                }]
            }
        })
        

        ////werbeflachen zonebuilder overview
        .state('werbeflachen',{
        	url:"/werbeflachen.html",
        	templateUrl: 'views/zoneBuilder/werbeflachen.html',        
            data: {pageTitle: 'Übersicht Werbeflächen', pageSubTitle: '', pagetype: "werbeflachen"},
            controller: "ZoneBuilderController",
            resolve: {
                
                deps: ['$ocLazyLoad', function($ocLazyLoad) { 
                   var returnval =  $ocLazyLoad.load({
                        name: 'PecunioApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            
                              // required for datatables
                                '../lib/metronic_assets/global/plugins/select2/select2.min.js',
                                '../lib/metronic_assets/global/plugins/datatables/media/js/jquery.dataTables.min.js',
                                '../lib/angular-datatables-master/dist/angular-datatables.min.js',

                                '../lib/metronic_assets/global/plugins/bootbox/bootbox.min.js',
                                 '../lib/metronic_assets/global/plugins/flot/jquery.flot.js',
                                 'js/scripts/charts-flotcharts.js',
                                 'js/controllers/ZoneBuilderController.js'
                        ] 
                    });  return returnval;
                }]
            }        	
        })

        ///// zonebuilder
        .state('zonebuilder',{
        	url:"/zonebuilder.html",
        	templateUrl: 'views/zoneBuilder/zonebuilder.html',        
            data: {pageTitle: 'Werbeflächen Erstellen', pageSubTitle: '', pagetype: "zonebuilder"},
            controller: "ZoneBuilderController",
            resolve: {
                
                deps: ['$ocLazyLoad', function($ocLazyLoad) { 
                   var returnval =  $ocLazyLoad.load({
                        name: 'PecunioApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
								'../lib/metronic_assets/global/plugins/select2/select2.css',
                                '../lib/metronic_assets/global/plugins/bootstrap-select/bootstrap-select.min.css',
                                '../lib/metronic_assets/global/plugins/jquery-multi-select/css/multi-select.css',
                                '../lib/metronic_assets/admin/pages/css/todo.css',
                                
                                
                                '../lib/metronic_assets/global/plugins/select2/select2.min.js',
                                '../lib/metronic_assets/global/plugins/bootstrap-select/bootstrap-select.min.js',
                                '../lib/metronic_assets/global/plugins/jquery-multi-select/js/jquery.multi-select.js',
                                '../lib/metronic_assets/admin/pages/scripts/components-dropdowns.js',
                                
                                '../lib/metronic_assets/global/plugins/ion.rangeslider/js/ion-rangeSlider/ion.rangeSlider.min.js',
                                '../lib/metronic_assets/global/plugins/ion.rangeslider/css/ion.rangeSlider.css',
                                '../lib/metronic_assets/global/plugins/ion.rangeslider/css/ion.rangeSlider.Metronic.css',
                                '../lib/metronic_assets/global/plugins/bootbox/bootbox.min.js',
                                '../lib/metronic_assets/global/plugins/holder.js',
                                'js/controllers/ZoneBuilderController.js'
								
                        ] 
                    });  return returnval;
                }]
            }        	
        })

        
        
        // werbemittel overview
        .state('werbemittel', {
            url: "/werbemittel.html",
            templateUrl: 'views/werbemittel.html',        
            data: {pageTitle: 'Übersicht Werbemittel', pageSubTitle: '', pagetype: "werbemittel"},
            controller: "WerbemittelController",
            resolve: {
                
                deps: ['$ocLazyLoad', function($ocLazyLoad) { 
                   var returnval =  $ocLazyLoad.load({
                        name: 'PecunioApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                                 // required for datatables
                                '../lib/metronic_assets/global/plugins/select2/select2.min.js',
                                '../lib/metronic_assets/global/plugins/datatables/media/js/jquery.dataTables.min.js',
                                '../lib/angular-datatables-master/dist/angular-datatables.min.js',

                                // required for flotcharts
                                '../lib/metronic_assets/global/plugins/flot/jquery.flot.min.js',
                                'js/scripts/charts-flotcharts.js',
                                'js/controllers/WerbemittelController.js',
                                'js/controllers/AssistantController.js',
                                'js/controllers/PublisherDomain.js',
                                'js/services/services.theme.js'
                        ] 
                    });  return returnval;
                }]
            }
        })
        
        // Adbuilder
        .state('adbuilder', {
            url: "/adbuilder.html",
            templateUrl: "views/adBuilder/adbuilder.html", 
            data: {pageTitle: 'Werbemittel einstellen', pageSubTitle: '', pageRightColTitle: '24 Banner in allen Stilen', pagetype: "adbuilder"},
            controller: "AdBuilderController",
            resolve: {
                
                deps: ['$ocLazyLoad','ProductType', 'CategoryDataModel', function($ocLazyLoad, ProductType, CategoryDataModel) { 
                   var returnval =  $ocLazyLoad.load({
                        name: 'PecunioApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                                '../lib/metronic_assets/global/plugins/select2/select2.css',
                                '../lib/metronic_assets/global/plugins/bootstrap-select/bootstrap-select.min.css',
                                '../lib/metronic_assets/global/plugins/jquery-multi-select/css/multi-select.css',
                                '../lib/metronic_assets/admin/pages/css/todo.css',


                                '../lib/metronic_assets/global/plugins/select2/select2.min.js',
                                '../lib/metronic_assets/global/plugins/bootstrap-select/bootstrap-select.min.js',
                                '../lib/metronic_assets/global/plugins/jquery-multi-select/js/jquery.multi-select.js',
                                '../lib/metronic_assets/admin/pages/scripts/components-dropdowns.js',

                                '../lib/metronic_assets/global/plugins/ion.rangeslider/js/ion-rangeSlider/ion.rangeSlider.min.js',
                                '../lib/metronic_assets/global/plugins/ion.rangeslider/css/ion.rangeSlider.css',
                                '../lib/metronic_assets/global/plugins/ion.rangeslider/css/ion.rangeSlider.Metronic.css',
                                'js/controllers/AdBuilderController.js'
                        ]       
                    }); return returnval;


                }]

            }
        })
        
        //Adcustomizer
         .state('adcustomizer', {
            url: "/adcustomizer.html",
            templateUrl: "views/adBuilder/adcustomizer.html", 
            data: {pageTitle: 'Werbemittel einstellen', pageSubTitle: '', pageRightColTitle: 'Textanzeige', pagetype: "adcustomizer"},
            controller: "AdcustomizerController",
            resolve: {
                
                deps: ['$ocLazyLoad', function($ocLazyLoad) { 
                   var returnval =  $ocLazyLoad.load([{
                        name: 'PecunioApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [

                                '../lib/metronic_assets/global/plugins/select2/select2.css',
                                '../lib/metronic_assets/global/plugins/bootstrap-select/bootstrap-select.min.css',
                                '../lib/metronic_assets/global/plugins/jquery-multi-select/css/multi-select.css',
                                '../lib/metronic_assets/admin/pages/css/todo.css',


                                '../lib/metronic_assets/global/plugins/select2/select2.min.js',
                                '../lib/metronic_assets/global/plugins/bootstrap-select/bootstrap-select.min.js',
                                '../lib/metronic_assets/global/plugins/jquery-multi-select/js/jquery.multi-select.js',
                                '../lib/metronic_assets/admin/pages/scripts/components-dropdowns.js',

                                '../lib/metronic_assets/global/plugins/ion.rangeslider/js/ion-rangeSlider/ion.rangeSlider.min.js',
                                '../lib/metronic_assets/global/plugins/ion.rangeslider/css/ion.rangeSlider.css',
                                '../lib/metronic_assets/global/plugins/ion.rangeslider/css/ion.rangeSlider.Metronic.css',

                                '../lib/metronic_assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',

                                '../lib/metronic_assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                                'js/directives/directive.selector.js',
                                'js/controllers/AdcustomizerController.js'
                        ]     
                    },{
                        name: 'angularFileUpload',
                        files: [
                            '../lib/metronic_assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
                        ] 
                    }]); return returnval;


                }]

            }
        })

         // Assistent Builder
        .state('assistentbuilder', {
            url: "/assistentbuilder.html",
            templateUrl: "views/assistent/assistentbuilder.html", 
            data: {pageTitle: 'Assistent', pageSubTitle: '', pageRightColTitle: '', pagetype: "assistent"},
            controller: "AssistantBuilderController",
            resolve: {
                
                deps: ['$ocLazyLoad','ProductType', 'CategoryDataModel', function($ocLazyLoad, ProductType, CategoryDataModel) { 
                   var returnval =  $ocLazyLoad.load({
                        name: 'PecunioApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                                
                                '../lib/metronic_assets/global/plugins/select2/select2.css',
                                '../lib/metronic_assets/global/plugins/bootstrap-select/bootstrap-select.min.css',
                                '../lib/metronic_assets/global/plugins/jquery-multi-select/css/multi-select.css',
                                '../lib/metronic_assets/admin/pages/css/todo.css',


                                '../lib/metronic_assets/global/plugins/select2/select2.min.js',
                                '../lib/metronic_assets/global/plugins/bootstrap-select/bootstrap-select.min.js',
                                '../lib/metronic_assets/global/plugins/jquery-multi-select/js/jquery.multi-select.js',
                                '../lib/metronic_assets/admin/pages/scripts/components-dropdowns.js',

                                '../lib/metronic_assets/global/plugins/ion.rangeslider/js/ion-rangeSlider/ion.rangeSlider.min.js',
                                '../lib/metronic_assets/global/plugins/ion.rangeslider/css/ion.rangeSlider.css',
                                '../lib/metronic_assets/global/plugins/ion.rangeslider/css/ion.rangeSlider.Metronic.css',
                                    
                                'js/controllers/AssistantBuilderController.js',
                                'js/services/services.theme.js'
                        ]       
                    }); return returnval;


                }]

            }
        })

        // User Profile
        .state("profile", {
            url: "/profile",
            templateUrl: "views/profile/main.html",
            data: {pageTitle: 'My Pecunio', pageSubTitle: 'user profile sample'},
            controller: "UserProfileController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'PecunioApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../lib/metronic_assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../lib/metronic_assets/admin/pages/css/profile.css',
                            '../lib/metronic_assets/admin/pages/css/tasks.css',
                            
                            '../lib/metronic_assets/global/plugins/jquery.sparkline.min.js',
                            '../lib/metronic_assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            //'../lib/metronic_assets/admin/pages/css/profile.css',
                            'js/controllers/UserProfileController.js',
                            'js/controllers/PublisherDomain.js'
                        ]                    
                    });
                }]
            }
        })

        // User Profile Dashboard
        .state("profile.dashboard", {
            url: "/dashboard",
            templateUrl: "views/profile/dashboard.html",
            data: {pageTitle: 'User Profile', pageSubTitle: 'user profile dashboard sample'}
        })

        // User Profile Account
        .state("profile.account", {
            url: "/account",
            templateUrl: "views/profile/account.html",   
            controller: "UserProfileController", 
            data: {pageTitle: 'My Pecunio', pageSubTitle: ''},
            resolve: {
                
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'PecunioApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'js/controllers/UserProfileController.js'  
                        ]                    
                    });
                }]
            }
        })
        // User Profile Account
        .state("profile.change-password", {
            url: "/change-password",
            templateUrl: "views/profile/change-password.html",   
            controller: "UserProfileController", 
            data: {pageTitle: 'My Pecunio', pageSubTitle: ''},
            resolve: {
                
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'PecunioApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'js/controllers/UserProfileController.js'  
                        ]                    
                    });
                }]
            }
        })
        // Account User
        .state("profile.account-users", {
            url: "/account-users",
            templateUrl: "views/profile/account-users.html",  
            controller: "AccountUsersController", 
            data: {pageTitle: 'My account users', pageSubTitle: ''},
            resolve: {
                
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'PecunioApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'js/controllers/AccountUsersController.js' ,
                            'lib/metronic_assets/admin/pages/scripts/table-editable.js' 
                        ]                    
                    });
                }]
            }
        })

        // Account User
        .state("profile.groups", {
            url: "/groups",
            templateUrl: "views/profile/groups.html",  
            controller: "UserProfileController", 
            data: {pageTitle: 'My Pecunio', pageSubTitle: ''},
            resolve: {
                
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'PecunioApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'js/controllers/AccountUsersController.js' ,
                            'js/directives/table-editable_group.js',
                            'lib/metronic_assets/global/plugins/select2/select2.css',
                            'lib/metronic_assets/global/plugins/select2/select2.min.js',
                            'js/controllers/UserProfileController.js' 
                        ]                    
                    });
                }]
            }
        })

        // Account User Domains
        .state("profile.domains", {
            url: "/domains",
            templateUrl: "views/profile/domains.html",  
            controller: "UserProfileController", 
            data: {pageTitle: 'My Pecunio', pageSubTitle: ''},
            resolve: {
                
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'PecunioApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'js/controllers/AccountUsersController.js' ,
                            'js/directives/table-editable_group.js',
                            'lib/metronic_assets/global/plugins/select2/select2.css',
                            'lib/metronic_assets/global/plugins/select2/select2.min.js',
                            'js/controllers/UserProfileController.js',
                            'js/controllers/PublisherDomain.js'
                        ]                    
                    });
                }]
            }
        })

        // User Profile Help
        .state("profile.help", {
            url: "/help",
            templateUrl: "views/profile/help.html",            
            data: {pageTitle: 'My Pecunio', pageSubTitle: ''}      
        })

        //support NZ
        .state('support',{
        	url:"/support",
        	templateUrl: "views/support/support.html",
        	data: {pageTitle: 'Support', pageSubTitle: ''},
        	controller: "SupportController",
        	resolve: {
        		
        		deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'PecunioApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [ 
                            /*'http://maps.google.com/maps/api/js?sensor=true',
                            '../lib/metronic_assets/global/plugins/gmaps/gmaps.min.js',
                            '../lib/metronic_assets/admin/pages/scripts/contact-us.js',
                             
                            '../lib/metronic_assets/admin/pages/scripts/table-managed.js',
                            '../lib/metronic_assets/admin/pages/css/todo.css',*/
                            
                            '../lib/metronic_assets/global/plugins/bootstrap-wysihtml5/bootstrap-wysihtml5.css',

                            '../lib/metronic_assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            '../lib/metronic_assets/global/plugins/bootstrap-summernote/summernote.css',
                            
                            '../lib/metronic_assets/global/plugins/bootstrap-wysihtml5/wysihtml5-0.3.0.js',
                            '../lib/metronic_assets/global/plugins/bootstrap-wysihtml5/bootstrap-wysihtml5.js',
                            '../lib/metronic_assets/global/plugins/bootstrap-summernote/summernote.min.js',
                            '../lib/metronic_assets/global/plugins/bootstrap-markdown/lib/markdown.js',
                            '../lib/metronic_assets/global/plugins/bootstrap-markdown/js/bootstrap-markdown.js',
                            
                            
                            
                            '../lib/metronic_assets/admin/pages/scripts/components-editors.js',
                            
                            '../lib/metronic_assets/admin/pages/scripts/table-managed.js',
                            'js/controllers/SupportController.js'  
                        ]                    
                    });
                }]
        	}
        })
        //login NZ
        .state('login',{
        	url:'/',
        	templateUrl: "views/login.html",
        	data: {pageTitle: 'Log In', pageSubTitle: ''},
        	controller: "LoginController",
        	resolve: {
        		deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'PecunioApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../lib/metronic_assets/admin/pages/css/login2.css',
                            '../lib/metronic_assets/admin/pages/scripts/login.js',
                            'js/controllers/LoginController.js'  
                        ]                    
                    });
                }]
                /*,

                rememberMe:  function(){
                    return false;
                }*/    
        	}
        })
        //create password route
        .state('create-password',{
            url:'/:create-password?id',
            templateUrl: "views/create_password.html",
            data: {pageTitle: 'Create Password', pageSubTitle: ''},
            controller: "ChangePasswordController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'PecunioApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../lib/metronic_assets/admin/pages/css/login2.css',
                            '../lib/metronic_assets/admin/pages/scripts/login.js',
                            'js/controllers.js'  
                        ]                    
                    });
                }] 
            }
        })
        //Pec Admin
        .state('admin', {
            url: "/admin/domainListing.html",
            templateUrl: "admin/views/domainListing.html", 
            data: {pageTitle: 'Herzlich Wilkommen, Klaus', pageSubTitle: '', pagetype: "dashboard"},
            controller: "DomainListController",
            resolve: {
                
                deps: ['$ocLazyLoad', function($ocLazyLoad) { 
                   var returnval =  $ocLazyLoad.load({
                        name: 'PecunioApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                             'admin/js/AdminController.js',
                             'admin/js/AdminService.js'
                        ] 
                    }); return returnval;
                }]
            }
        })
        
        // Finance

        .state('performance', {
            url: "/performance.html",
            templateUrl: "views/finance/performance.html", 
            data: {pageSubTitle: '', pagetype: "finance"},
            controller: "FinanceController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) { 
                   var returnval =  $ocLazyLoad.load({
                        name: 'PecunioApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                             'js/controllers/FinanceController.js',
                             'js/services/services.finance.js',
                        ] 
                    }); return returnval;
                }]
            }
        });

}]);
