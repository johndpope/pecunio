'use strict';

PecunioApp

.controller('AssistantController', 
	['$rootScope',
	 '$scope', 
	 '$http', 
	 '$timeout',
	 'ProductType', 
	 'CategoryDataModel',
	 'VarianteDataModel',
	 'AdTemplateDataModel',
	 '$modalInstance',
	 'publisherDomainFactory',
	 'LoopBackAuth',
	 '$state',
     'domains',
     '$filter',
     'themeFactory',
     '$translate',
     'userDetailsFactory',
	 function(
	 	$rootScope,
	 	$scope,
	 	$http,
	 	$timeout,
	 	ProductType, 
		CategoryDataModel,
		VarianteDataModel,
		AdTemplateDataModel,
		$modalInstance,
		publisherDomainFactory,
		LoopBackAuth,
		$state,
		domains,
		$filter,
		themeFactory,
		$translate,
		userDetailsFactory
	 	){
		
		$scope.showDomainForm = true;

		
		$scope.domainList = domains;

		$scope.domains = [];	
    	$scope.domain = '';
    	
    	/**
         * If current user data is null then controll 
         * will move to the login page
         */
    	if(LoopBackAuth.currentUserData === null){
        	$state.go('login')
        }
    	
		$scope.setDomain = function(eachdomain){
			$scope.domain = eachdomain.domainName;
			$scope.domainList = {};
		}
		
		$scope.getDomains = function(){
			
			$scope.domainList = domains;
		}
		
		/**
		 * Scope method to open assistent modal 
		 * User enter a domain first
		 * If domain is registered and manually approved then 
		 * controll will move to theme generation process
		 * 
		 * If not then it will follow the full cycle 
		 * of new domain registration 
		 */
        $scope.OpenAssistent = function () {
		     
		      var domainData = {'domain' : $scope.domain, 'publisherId' : LoopBackAuth.currentUserId};
		      jQuery(".page-spinner-bar").addClass("show");
		      publisherDomainFactory
		      .getDomainByName(domainData)
	          .then(function(data){
	          	    var domainCount = data.domain;
					
	          		if(data.domain){
	          			
	          			if(data.domain.status == 2){
	          				
	          				themeFactory
							.checkDomainTheme(data.domain.id)
							.then(function(resdata){
								
								jQuery(".page-spinner-bar").removeClass("show");
								jQuery(".page-spinner-bar").addClass("hide");
								if(resdata.notExists){
	          						var sendBaseUrl = {'baseUrl':data.domain.domainName, 'domain_id':data.domain.id};
	    							sessionStorage.setItem('sendBaseUrl', JSON.stringify(sendBaseUrl));

	    							$modalInstance.close('');
					      			$state.go('assistentbuilder');
					      			$scope.showDomainForm = true;
					      			$scope.showRegistrationForm = false;
	          					}else {
	          						$scope.alertMessage = $translate.instant('THEME_EXIST_MSG');
	          					}

							});
          					

		      			}else{
		      				jQuery(".page-spinner-bar").removeClass("show");
							jQuery(".page-spinner-bar").addClass("hide");
		      				if(data.domain.status == 1){
		      					$scope.alertMessage = $translate.instant('DOMAIN_WAITING_MANUAL_APPROVE');
							}else if(data.domain.status == 3){
								$scope.alertMessage = $translate.instant('DOMAIN_TECH_FAILD');
							}else if(data.domain.status == 4){
								$scope.alertMessage = $translate.instant('DOMAIN_MANUAL_FAILD');
							}else if(data.domain.status == 0){
								$scope.alertMessage = $translate.instant('DOMAIN_WAITING_TECH_APPROVE');
							}
							$scope.showDomainForm = false;
			      			$scope.showRegistrationForm = false;
			      			$scope.showStatusModal = true;
		      			}

	          		}else{
	          			jQuery(".page-spinner-bar").removeClass("show");
						jQuery(".page-spinner-bar").addClass("hide");
	          			$scope.registrationMessage = $translate.instant('DOMAIN_NOT_REG');
	          			$scope.showDomainForm = false;
	          			$scope.showRegistrationForm = true;
	          		}
		      		
		      });		
		};
		
		
		/**
		 * Scope method to register a domain and 
		 * show message for meta check
		 */
		$scope.registerDomain = function(){

            
			if($scope.domains.length == 0){
              $scope.domains.push($scope.domain);
            }
			var domainData = {'domains' : $scope.domains, 'publisherId' : LoopBackAuth.currentUserId, 'email' : LoopBackAuth.currentUserData.email};
            publisherDomainFactory
            .registerDomain(domainData)
            .then(function(data){
                
                $scope.successMsg = $translate.instant('DOMAIN_REG');
                $scope.technicalMsg = data.domain[0].metaTag;
                
                $scope.publiserDomainId = data.domain[0].id;
                $scope.showDomainForm = false;	
                $scope.showRegistrationForm = false;
                $scope.showApproval = true;

            });
        }

        $scope.OpenDomainRegistrationModal = function () {		     
  			
  		  $scope.showDomainForm = false;	
          $scope.showRegistrationForm = true;
          $scope.showApproval = false;
          $scope.showTechnicalApproval = false;
		};

		
		/**
		 * Scope method to open domain approval modal
		 * for meta check
		 * On successfull checking a support ticket will generate 
		 * with private note
		 */
		$scope.OpenDomainApprovalModal = function () {		     
  	          
	          publisherDomainFactory
	          .checkMetaForTV({'userId' : LoopBackAuth.currentUserId, 'domainId' : $scope.publiserDomainId})
	          .then(function(data){
	             
		        if(data.meta == true){	           
		            //var getUserdata = sessionStorage.getItem('userData');
					//var jsonUserArr = JSON.parse(getUserdata);
					var jsonUserArr = userDetailsFactory.getUserDetails();  //changed for session storage conflict
		            var content = "DomainId:"+$scope.publiserDomainId;
	                var obj = {"title":"Manual Approval for new domain","content":content,"topic":"Partner Support","usermail":jsonUserArr.acctOwneremail, "username": jsonUserArr.acctOwnername};
	                    
	                publisherDomainFactory
	                  .postSupportTicket(obj)
	                  .then(function(resp){

	                    if(resp.ticket.isCreated == true){
	                    	var reqs_id = resp.ticket.ticktdata.helpdesk_ticket.requester_id;
	                    	var tickDisId = resp.ticket.ticktdata.helpdesk_ticket.display_id;
	                    	var replyInfo = {
	                    		"replymsg":"/admin/domainListing.html",
	                    		"requesterId":reqs_id, 
	                    		"ticketId":tickDisId, 
	                    	};

	                    	publisherDomainFactory
                            .replyWithPrivateNote(replyInfo)
                            .then(function(resdata){
                            	
                            }); 

	                        $scope.technicalApprovalMsg = $translate.instant('DOMAIN_TECH_APPROVE_WAITING_MANUAL');
	                        $scope.showTechnicalApproval = true;

	                    }else{
	                       $scope.technicalApprovalMsg = "Error.....";
	                       $scope.showTechnicalApproval = true;
	                    }
	                   
	                });
	                
	                
					$scope.showDomainForm = false;	
				    $scope.showRegistrationForm = false;
				    $scope.showApproval = false;
				   
		        }else{
		            $scope.technicalApprovalMsg = $translate.instant('DOMAIN_TECH_FAILD');
					$scope.showDomainForm = false;	
	          		$scope.showRegistrationForm = false;
	          		$scope.showApproval = false;
	         		$scope.showTechnicalApproval = true;
		        }
	                  
	          }); 
		};
		
		/**
		 * Close domain registration modal
		 */
		$scope.closeDomainRegistration = function () {		     
  		  $scope.showDomainForm = false;	
          $scope.showRegistrationForm = false;
          $scope.showApproval = false;
          $scope.showTechnicalApproval = false;
          $modalInstance.dismiss('cancel');
		};
		
		/**
		 * Cose modal
		 */
		$scope.cancel = function () {
    		$modalInstance.dismiss('cancel');
  		};
	 	
	 	$scope.$on('$viewContentLoaded', function() {    

		    $scope.adtypedd =  ProductType.find();
		    $scope.adcategorydd = CategoryDataModel.find();
		    $scope.advariantedd = VarianteDataModel.find();

		    $scope.adTemplateList = AdTemplateDataModel.find();

	        // initialize core components
	        Metronic.initAjax();
	    });
		$rootScope.settings.layout.pageSidebarClosed = true;
}]);
