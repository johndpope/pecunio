'use strict';

/* Setup App Main Controller */
PecunioApp

.controller('AppController',  function($scope, $rootScope, PecunioUser, $state, LoopBackAuth, AppAuth, UtilityModel,PublisherDomain,Affiliates,$cookies) {

    if(LoopBackAuth.currentUserId != null){
       
       AppAuth.ensureHasCurrentUser(PecunioUser);
       
    }else{
    
        LoopBackAuth.accessTokenId = localStorage.accessTokenId;
        LoopBackAuth.currentUserId = localStorage.currentUserId;
        LoopBackAuth.currentUserData = localStorage.currentUserData;
        LoopBackAuth.rememberMe = true;
    }
   
    if(AppAuth.currentUser != null){
      LoopBackAuth.currentUserData = AppAuth.currentUser;
    }
    
    $rootScope.fullName = localStorage.fullName;
    
    $scope.currentUser = AppAuth.currentUser;
    $scope.$on('$viewContentLoaded',function() {
       
        Metronic.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });

    $scope.options = [
      {text: 'Logout', action: function() {

        UtilityModel.deleteFile({"userid": LoopBackAuth.currentUserId }).$promise.then(function(res){

            // putting logout in the callback of deleting tmp files.
            PecunioUser.logout(function() {
              
              AppAuth.currentUser = null;
              LoopBackAuth.currentUserData = null;
              LoopBackAuth.currentUserId = null;

              localStorage.removeItem('fullName');
              localStorage.removeItem('roleId');
              localStorage.removeItem('currentUserData');
              localStorage.removeItem('accessTokenId');
              localStorage.removeItem('currentUserId');
              localStorage.removeItem('rememberMe');

              $state.go('login');
            }); 
        });

        
      }}
    ];
    
    $rootScope.isLog = true;
    $scope.setLog = function(value) {
        $rootScope.isLog = value;
        $rootScope.isAdmin = value;
    }

    $rootScope.isAdmin = true;
    $scope.setAdmin = function(value) {
        $rootScope.isAdmin = value;
        $rootScope.isLog = value;
    }
  
})

/* Setup Layout Part - Header */
.controller('HeaderController', ['$scope','$location','$rootScope', 'LoopBackAuth', 'userProfileFactory', function($scope,$location,$rootScope,LoopBackAuth,userProfileFactory) { 
	   
     
		 $scope.$on('$includeContentLoaded', function() {
           
          $scope.currentUser = LoopBackAuth.currentUserData;

          if (LoopBackAuth.currentUserId != null && LoopBackAuth.currentUserId != "") {

              userProfileFactory.getImage(LoopBackAuth.currentUserId).then(function(res){  

                  $scope.profileImage = (res.userData.image === null) ? "../uploads/profile/profile.jpg" : "../uploads/avatars/"+res.userData.image;
                  $rootScope.fullName = res.userData.fullName;
                  localStorage.fullName = res.userData.fullName;
                  
              });
          }
          
	    		Layout.initHeader(); // init header
	    });
		
}])

/* Setup Layout Part - Sidebar */
.controller('SidebarController', [
        '$scope',
        'supportFactory',
        'pecunioACLService',
        'LoopBackAuth', 'ROLES', 
        function(

          $scope,
          supportFactory,
          pecunioACLService,
          LoopBackAuth,ROLES) {

        	     $scope.supportData = '';
        	     $scope.$on('$includeContentLoaded', function() {
                   $scope.isProfile = false;
                   supportFactory
                    	.getSupport()
                    	.then(function(res){
                    		$scope.supportData = res.data[0];
                        
                    	});
                      
                    if(LoopBackAuth.currentUserId){
                      /*
                      * 1 - account_owner, 2- admin, 3- accounts, 4- Webmaster, 5-marketing
                      *
                      */
                      pecunioACLService.checkLoggedInUserkRole(LoopBackAuth.currentUserId).then(function(roleId){

                        
                        $scope.showAccountUser = function(){
                          var flag = (roleId==ROLES.ADMIN) ? true : false;
                          return flag;
                        }

                        $scope.showAccountGroup = function(){
                          var flag = (roleId==ROLES.ADMIN) ? true : false;
                          return flag;
                        }

                        $scope.showAccountDomain = function(){
                          var flag = (roleId==ROLES.ADMIN) ? true : false;
                          return flag;
                        }
                      });
                    }

                    Layout.initSidebar(); // init sidebar
            });
                
        }
])

/* Setup Layout Part - Sidebar */
.controller('PageHeadController', [

						'$scope' ,
						'$location', 
						'$log',
						'$modal',
						'$rootScope',
						'$state',
						'DashboardService',
						'ProductType', 
						'CategoryDataModel',
						'AdBuilderDataModel',
			      'AppAuth',
			      'LoopBackAuth',
			      'publisherDomainFactory',
			      'alertService',
			      '$q',
			      '$timeout',
            '$translate',
            'userDetailsFactory',
                    
						function(

							$scope, 
							$location, 
							$log,  
							$modal,
							$rootScope,
							$state,
							DashboardService, 
							ProductType,
							CategoryDataModel,
							AdBuilderDataModel,
              AppAuth,
              LoopBackAuth,
              publisherDomainFactory,
              alertService,
              $q,
              $timeout,
              $translate,
              userDetailsFactory
              ) {

    $scope.$on('$includeContentLoaded', function() {
    	
        // get pagename and load page head accordingly
        $scope.lastRoute  = $rootScope.lastRoute;

        var pagename = $location.path();
        
        $scope.werbemitteldd;
        $scope.portaldd;
        $scope.zeitraumdd;
        $scope.dashboardtypes;
        $scope.selecteddashboard;
        $scope.adtypedd;
        $scope.adcategorydd;
        $scope.selectedadtype;
        $scope.selectedadcategory;

        
        var jsonUserArr = userDetailsFactory.getUserDetails(); //changed for session storage conflict
        if(jsonUserArr){
          $rootScope.userRole = jsonUserArr.roleId;
          $rootScope.addCanSee = [1,4];  
        }
        
        ///15-6-2015 ends
        // get dashboards dropdown
        DashboardService.getDashboardTypes(pagename.split('.')[0]).then(function (response) {
            

            $scope.dashboardtypes = response.data;
            $scope.selecteddashboard = response.data.name;
  
            // Begin Page head Dropdowns data
            $scope.werbemitteldd = response.data[0].drpdwn1;
            $scope.portaldd = response.data[1].drpdwn2;

            // End Page head Dropdowns data

            // Begin Create ad-popup
            $scope.items = ['item1', 'item2', 'item3'];
            $rootScope.hasDomains = false;
            $rootScope.hasManualVerifiedDomains = false;

            /**
              * check if any registered domain exists else show assitant popup  with a warning message
              */
            function getDomainStatus() {
              
              jQuery(".page-spinner-bar").addClass("show");
              var domainData = {};
               return $q(function(resolve, reject) {
                  setTimeout(function() {
                        publisherDomainFactory.getDomainByPublisherId(LoopBackAuth.currentUserId).then(function(data){
                          if(data.domains.length > 0){

                               domainData['hasDomains'] = true;
                               for(var key in data.domains){
                                  if(data.domains[key].status == '2'){
                                    domainData['hasManualVerifiedDomains'] = true;
                                    break;
                                  }
                                  else{
                                    domainData['hasManualVerifiedDomains'] = false;
                                  }
                               }
                               resolve(domainData);
                          }
                          else{
                             domainData['hasDomains'] = false;
                             domainData['hasManualVerifiedDomains'] = false;
                             resolve(domainData);
                          }
                      });
                    }, 1000);
                }); 
            }


            /**
              * Open specific modal as per the domain status
              */

  			  	$rootScope.openAdModal = function (size) {
                getDomainStatus().then(function(data) {
                    jQuery(".page-spinner-bar").removeClass("show");
                    jQuery(".page-spinner-bar").addClass("hide");
                    $rootScope.hasDomains = data.hasDomains;
                    $rootScope.hasManualVerifiedDomains = data.hasManualVerifiedDomains;
                    var modalInstance;
                    if($rootScope.hasDomains ==  true && $rootScope.hasManualVerifiedDomains == true){
                          modalInstance = $modal.open({
                          templateUrl: 'views/adBuilder/admodal.html',
                          controller: 'ModalInstanceCtrl',
                          //backdrop: 'static',
                          size: size,
                          resolve: {
                            adtypedd: function () {
                               $scope.adtypedd =  ProductType.find();
                               return $scope.adtypedd;
                            },
                            adcategorydd: function () {
                              $scope.adcategorydd = CategoryDataModel.find();
                                return $scope.adcategorydd;
                            },
                            showModal : function(){

                                return false;
                            },
                            showResgistrationModal : function(){
                                 return true;
                            },
                            domainData : function(){
                                return false;
                                
                            },
                            showApprovalModal : function(){
                                return false;
                            }
                          }
                        });
                        modalInstance.result.then(function (selectedItem) {
                          $scope.selected = selectedItem;
                        }, function () {
                          $log.info('Modal dismissed at: ' + new Date());
                        });
                    }
                    else if($rootScope.hasDomains ==  true && $rootScope.hasManualVerifiedDomains == false) {
                        alertService.showAlert($translate.instant('DOMAIN_NOT_CHECKED_WAIT'), 'info');
                    }
                    else{ // show register-domain popup with a message
                        modalInstance = $modal.open({
                          templateUrl: 'views/publisherDomain/domainRegistration.html',
                          controller: 'PublisherDomainController',
                          size: 400,
                          resolve: {
                            domains : function(){
                                var domains = [];
                                var domain = {};
                                domain.domainName = '';
                                domains.push(domain);
                                return domains;
                            },
                            showModal : function(){

                                return false;
                            },
                            showResgistrationModal : function(){
                                 return true;
                            },
                            domainData : function(){
                                return false;
                                
                            },
                            showApprovalModal : function(){
                                return false;
                            }
                          }
                      });
                    }
                });
    			  };
  			  	// End Create ad-popup

            // Begin Assistent Model
            $rootScope.openAssistentModal = function (size) {
              var modalInstance = $modal.open({
                  templateUrl: 'views/adBuilder/assistentModal.html',
                  controller: 'AssistentController',
                  //backdrop: 'static',
                  size: size,
                  resolve : {
                    domains: function (publisherDomainFactory, LoopBackAuth) {
                       return publisherDomainFactory.getDomainsByPublisherId(LoopBackAuth.currentUserId)
                       .then(function(data){
                        
                        return data.domain;
                        
                      });
                    },
                    showModal : function(){

                        return false;
                    },
                    showResgistrationModal : function(){
                         return true;
                    },
                    domainData : function(){
                        return false;
                        
                    },
                    showApprovalModal : function(){
                        return false;
                    }
                  }
              });
            };

            //End Assistent Model
            
            //           }
          
            $rootScope.goBackToAdbuilder = function(){
              sessionStorage.setItem('selectedAdtype', '');
                sessionStorage.setItem('selectedadcategory', '');
              $state.go('adbuilder');
            }

            $rootScope.goBackToWerbemittel = function(){
              $state.go('werbemittel');
            }
        });
        Demo.init(); // init theme panel

    });
}])


.controller('AssistentBuilderModalController',function($scope, adTempCount, $state, $modalInstance){

  $scope.adCount = adTempCount;

  $scope.closeAssistentModal = function () {
      $modalInstance.dismiss('cancel');
      $state.go('werbemittel');
  };
  $scope.goToAdBuilder = function () {
      $modalInstance.dismiss('cancel');
      $state.go('adbuilder');
  };
  $scope.goToZoneBuilder = function () {
      $modalInstance.dismiss('cancel');
      $state.go('werbeflachen');
  };

})


.controller('ModalInstanceCtrl', [ '$scope','$rootScope', '$modalInstance', 'adtypedd', 'adcategorydd', '$state','ZoneBuilder', 'LoopBackAuth','PublisherDomain','PecunioUser',
    function($scope,$rootScope, $modalInstance, adtypedd,adcategorydd, $state, ZoneBuilder,LoopBackAuth,PublisherDomain,PecunioUser) { 

	     $scope.adtypedd = adtypedd;
	     $scope.adcategorydd = adcategorydd;
   

      	$scope.selected = {
        	item: $scope.adtypedd[0]
      	};

      	$scope.ok = function () {
        	$modalInstance.close($scope.selected.item);
      	};


        /**
         * Go To adbuilder 
         */
      	$scope.OpenAdBuilder = function () {
        	$modalInstance.close($scope.selected.item);
          sessionStorage.setItem('selectedAdtype', JSON.stringify($scope.selectedadtype));
          sessionStorage.setItem('selectedadcategory', JSON.stringify($scope.selectedadcategory));
        	$state.go('adbuilder');
      	};

       /* $scope.OpenAssistent = function () {
          $modalInstance.close($scope.selected.item);
          $state.go('assistentbuilder');
        };*/

      	$scope.cancel = function () {
        	$modalInstance.dismiss('cancel');
      	};
}])

/* Setup Layout Part - Footer */
.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });

}])

/* Setup Alert controller */
.controller('AlertController', ['$scope', '$modalInstance', '$timeout',  'alertService', 'msgType' , 'msgText', function($scope, $modalInstance, $timeout, alertService, msgType, msgText){
	
	$scope.msgType = msgType; 
	$scope.msgText = msgText;
	
	$timeout(function() {
		$modalInstance.close("");
   }, 3000);
	
}])

/* Create password for account user using link send in mail */
.controller('ChangePasswordController', ['$scope', 'PecunioUser', '$window','$state', 'AppAuth', '$timeout', 'LoopBackAuth', '$stateParams', function($scope, PecunioUser, $window, $state, AppAuth, $timeout, LoopBackAuth, $stateParams) { 
   
   $scope.setLog(false);
   $scope.setAdmin(false);
   $scope.id = $stateParams.id;
   $scope.userData = {};
   
   if(LoopBackAuth.accessTokenId != null){
      PecunioUser.logout(function() {
        AppAuth.currentUser = null;
        LoopBackAuth.currentUserData = null;
        LoopBackAuth.currentUserId = null;
        localStorage.removeItem('fullName');
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("email");
        localStorage.removeItem("password");
        
     });
   }
   
   $scope.changePassword = function() {

        $scope.pass = {
                         "id" :  $scope.id, 
                         "password": $scope.userData.password                                     
                      }

        PecunioUser.changePassword($scope.pass,
          function(data) {
            // success
            $scope.forgotPassSuccess = true;
            $timeout(function(){
                $state.go("login");
            }, 2000);
                          
        });
   }         
   
}]);

