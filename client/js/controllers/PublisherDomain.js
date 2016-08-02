
'use strict';

PecunioApp

.controller('PublisherDomainController',
  ['$scope',
   '$rootScope',
   'publisherDomainFactory',
   '$modalInstance', 
   'LoopBackAuth', 
   '$state', 
   'supportFactory',
   'domains',
   'showModal',
   'showResgistrationModal',
   'userProfileFactory',
   '$window',
   'showApprovalModal',
   'domainData',
   '$translate',
   'userDetailsFactory',


function(
    $scope, 
    $rootScope,
    publisherDomainFactory, 
    $modalInstance, 
    LoopBackAuth, 
    $state, 
    supportFactory, 
    domains,
    showModal,
    showResgistrationModal,
    userProfileFactory,
    $window,
    showApprovalModal,
    domainData,
    $translate,
    userDetailsFactory
    ) {
		
	//$scope.$on('$viewContentLoaded', function() { 
    $scope.showDomainForm = showModal; 
    $scope.showRegistrationForm = showResgistrationModal;
    $scope.showApproval = showApprovalModal;
    
    /**
     * Set technical message from database table
     * This message is used in Domain management add domain section
     * 
     */
    if(showApprovalModal == true){
        $scope.technicalMsg = domainData[0].metaTag;
    }
   
    $scope.domains = domains;	
    $scope.domainArr = [];
    
    /**
     * If current user data is null then controll 
     * will move to the login page
     */
    if(LoopBackAuth.currentUserData === null){
        $state.go('login')
    }
    
    /**
     * Scope method to show domain registration modal
     */
    $scope.OpenDomainRegistrationModal = function () {		     
        $scope.showDomainForm = false;
  		$scope.showRegistrationForm = true;
	};
	
	/**
	 * Set a domain array for multiple domain registration
	 */
    $scope.addDomain = function(){       
        $scope.domain = {};
        $scope.domains.push($scope.domain);        
    }
    
    /**
     * Scope method to show register domain modal
     * A domain will be registered from here
     * A new record will be inserted in PublisherDomain table
     */
	$scope.registerDomain = function(){
            
        var insertedDomains = [];
        _.each($scope.domains, function(data){
            insertedDomains.push(data.domainName);
          }
        );
        
        var domainData = {'domains' : insertedDomains, 'publisherId' : LoopBackAuth.currentUserId, 'email' : LoopBackAuth.currentUserData.email};
        
        publisherDomainFactory
        .registerDomain(domainData)
        .then(function(data){

            $scope.domainArr = data.domain; 
            $scope.successMsg = $translate.instant('DOMAIN_REG');
            $scope.technicalMsg = data.domain[0].metaTag;
            $scope.showDomainForm = false;  
            $scope.showRegistrationForm = false;
            $scope.showApproval = true;
        });
    };
    
    /**
     * Scope method to open domain approval modal
     * Check for meta tag in domain index page
     * if found then support ticket will be generated
     * if not then technical approval will fail
     */
	$scope.OpenDomainApprovalModal = function () {		     
			
      $scope.showDomainForm = false;	
      $scope.showRegistrationForm = false;
      $scope.showApproval = false;
      if(showApprovalModal == true){
        $scope.domainArr = domainData;
      }
          $scope.technicalApprovalMsg = "";
          $scope.domainArr.forEach(function(eachDomain){
            
            publisherDomainFactory
            .checkMetaForTV({'userId' : LoopBackAuth.currentUserId, 'domainId' : eachDomain.id})
            .then(function(data){
              
                  if(data.meta == true){

                    //var getUserdata = sessionStorage.getItem('userData');
                    //var jsonUserArr = JSON.parse(getUserdata);
                    var jsonUserArr = userDetailsFactory.getUserDetails();  //changed for session storage conflict
                    
                    var content = "DomainId:"+eachDomain.id;
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

                              $scope.technicalApprovalMsg+=eachDomain.domainName + " - " + $translate.instant('DOMAIN_WAITING_MANUAL_APPROVE') + "<br>";
                              $scope.showTechnicalApproval = true;

                          }else{
                             $scope.technicalApprovalMsg = "Error.....";
                             $scope.showTechnicalApproval = true;
                          }
                         
                      });
              }else {
                $scope.technicalApprovalMsg+=eachDomain.domainName + " - " + $translate.instant('DOMAIN_TECH_FAILD') + "<br>";
                $scope.showTechnicalApproval = true;
              }
                
        });
      }); 
      
	}

	$scope.closeDomainRegistration = function () {		     
	  $scope.showDomainForm = false;	
      $scope.showRegistrationForm = false;
      $scope.showApproval = false;
      $scope.showTechnicalApproval = false;
      $modalInstance.dismiss('cancel');
      $window.location.reload();
	};

	$scope.cancel = function () {
		  $modalInstance.dismiss('cancel');
	};
		
   //});
}]); 
