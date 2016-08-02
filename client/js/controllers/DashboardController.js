/**
 * Controller : DashboardController
 * Purpose : Shows dashboard with different widgets
 */
'use strict';


PecunioApp

.controller('DashboardController', 
	['$rootScope',
	 '$scope', 
	 '$http',
	 'LoopBackAuth',
	 '$state',
	 'settings',
	 '$modal',
	 'DashboardService',
	 'publisherDomainFactory',
	 'ROLES',
	 'pecunioACLService',
	 'userProfileFactory',
	 function(
	 	$rootScope,
	 	$scope,
	 	$http,
	 	LoopBackAuth,
	 	$state,
	 	settings,
	 	$modal,
	 	DashboardService,
	 	publisherDomainFactory,
	 	ROLES,
	 	pecunioACLService,
	 	userProfileFactory
	 	){
		
		/**
		 * If current user data is null then redirect to login page
		 */
        if(LoopBackAuth.currentUserData === null){
        	$state.go('login')
        }
        
        /**
         * If current user data is not null then page title will get ready from here
         */
        if(LoopBackAuth.currentUserData != null){

        	if($rootScope.fullName != undefined){
		 		$state.current.data.pageTitle = "Herzlich Wilkommen "+$rootScope.fullName;
		 	}else{
		 		//$state.current.data.pageTitle = "Herzlich Wilkommen ";
		 		userProfileFactory.getImage(LoopBackAuth.currentUserId).then(function(res){  

                  $state.current.data.pageTitle = "Herzlich Wilkommen "+res.userData.fullName;;
                  
              });
		 	}	
		}

        $scope.$on('$viewContentLoaded', function() {  

	        $scope.dashboardtypes = {};
		 	/**
		 	 * Dashboard Widget Listing
		 	 */
		 	DashboardService.getWidgets().then(function(data) {
				var dashboardData = _.filter(data, function(widgts){
					var locations = widgts.location.split(',');
					return locations.indexOf("dashboard") != -1;
				});
				$scope.dashboardWidgets = dashboardData;
			});
			
		 	/**
		 	 * Show domain registration modal if the logged in user has admin role
		 	 * 
		 	 */
			$scope.custAttr = {};
	        pecunioACLService.checkLoggedInUserkRole(LoopBackAuth.currentUserId).then(function(roleId){
	        	
	            if( roleId == ROLES.ADMIN ){
	            	publisherDomainFactory
			        .getDomainByPublisherId(LoopBackAuth.currentUserId)
			        .then(function(data){
			        	
			        	if(data.domains.length > 0){
			          			//$modalInstance.close('');
			          	}else{
					        var modalInstance = $modal.open({
				                templateUrl: 'views/publisherDomain/domainRegistration.html',
				                controller: 'PublisherDomainController',
				                //backdrop: 'static',
				                size: 400,
				                resolve: {
					                domains : function(){
					                    var domains = [];
					                    var domain = {};
					                    domain.domainName = '';
					                    domains.push(domain);
					                    return domains;
					                },
		                            domainData : function(){
		                                return false;
		                                
		                            },
		                            showModal : function(){

		                                return true;
		                            },
		                            showResgistrationModal : function(){
		                            	 return false;
		                            },
		                            showApprovalModal : function(){
		                            	return false;
		                            }
				                }
				            });
				    	}
			        })
	            }
	        });
        
       		// $rootScope.settings.layout.pageSidebarClosed = false;
        	$scope.isLog = true;	        
	        Metronic.initAjax();

	   });
	

}]);
