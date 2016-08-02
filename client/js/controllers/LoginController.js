//'use strict';

PecunioApp

/* Login controller start*/

.controller('LoginController',['$rootScope','$state','$scope','$http', '$timeout','PecunioUser','$translate', 'LoopBackAuth','settings','pecunioDateService','userProfileFactory','AppAuth','userDetailsFactory', 'Facebook', 'GooglePlus', 'AccountUsersFactory', 'alertService',
    function($rootScope,$state, $scope, $http, $timeout,PecunioUser,$translate, LoopBackAuth, settings, pecunioDateService, userProfileFactory, AppAuth,userDetailsFactory, Facebook, GooglePlus, AccountUsersFactory, alertService) {
		    
        $scope.setLog(false);
		    $scope.loginFrm = true;
		    $scope.credentials = {};
        
        if(LoopBackAuth.currentUserData != null){
          $state.go('dashboard');
        }
        if(localStorage.rememberMe == 'true' || LoopBackAuth.rememberMe == true){
          
          $scope.rememberMe = true;
          $scope.credentials.email = localStorage.email;
          $scope.credentials.password = localStorage.password;

        }else{

          $scope.rememberMe = false;
          $scope.credentials.email = '';
          $scope.credentials.password = '';
        }
        
        $scope.loginError = false;
        $scope.fotgotPassError = false;
        
        /**
         * Scope method to show login view
         */
        $scope.showLogin = function(){

            $scope.forgotPass = false;
            $scope.newRegistration = false;
            $scope.loginFrm = true;
            $scope.forgotPass1 = false;
            $scope.loginError = false;
            $scope.fotgotPassError = false;
            $scope.userData = {};
            $scope.user = {};

        }
        
        /**
         * Scope method for successfull login
         * After login data will be stored in localstorage if remember me is checked in
         */
    	$scope.login = function() {
    			
    		$scope.registration = {};

  		    $scope.loginResult = PecunioUser.login({include: 'user', rememberMe: true}, $scope.credentials,
  		      function() {
  		        
                  AppAuth.currentUser = $scope.loginResult.user;
                  if($scope.rememberMe == true || LoopBackAuth.rememberMe == true){
                    
                     

                      localStorage.rememberMe = true;
                      localStorage.email = AppAuth.currentUser.email;
                      localStorage.password = $scope.credentials.password;
                      
                  }else{
                      
                      localStorage.removeItem("rememberMe");
                      localStorage.removeItem("email");
                      localStorage.removeItem("password");

                      
                  }
                  ///////////////// 10-6-2015 starts ////////////////////
                  /**
                   * Get User details of currently logged in user
                   */
                  userDetailsFactory
                    .setUserDetails(LoopBackAuth.currentUserData.id)
                    .then(function(data){
                        
                    });
                  ///////////////// 10-6-2015 ends ////////////////////
                  $state.go('dashboard');
  		      },
  		      function(res, accessToken) {

  		        $scope.loginError = res.data.error;
                  
  		      }
  		    );
  		  }

    		$scope.showRegistration = function(){

    			$scope.newRegistration = true;
    			$scope.loginFrm = false;
          
          $scope.user = {};
          $scope.affiliate = {};
        
          $scope.salutations = [
            { id: 1, name: 'Herr' },
            { id: 2, name: 'Frau' },
            
          ];

    	}
    	
		/**
         * scope method to show reset password view I
         */	

        $scope.forgotPassword = function(){

            $scope.forgotPass = true;
            $scope.loginFrm = false;
            $scope.newRegistration = false;
            $scope.forgotPass1 = false;
            $scope.forgotPassError = false;
            $scope.ueserData = {};
            
        }
        
        /**
         * scope method to show reset password view II
         */
        $scope.forgotPassword1 = function(){
            $scope.forgotPass = false;
            $scope.forgotPass1 = true;
            $scope.loginFrm = false;
            $scope.newRegistration = false;
            
        }
        
        /**
         * Scope method of login controller to check email 
         * to get the user id
         * 
         * After successful execution the control will be passed to reset password view
         * Else an error message will be generated
         */
        $scope.resetPassword = function() {

            $scope.chkEmail = {
                             "email": $scope.userData.email                                     
                          }
            PecunioUser.checkEmailExists($scope.chkEmail,
              function(data) {
                // success
                if(data.userData != undefined){
                  $scope.userData.id = data.userData.id;
                  $scope.forgotPassword1(); 

                }else{

                  $scope.forgotPassError = true;
                }
                
              },
              function(res) {
                $scope.fotgotPassError = true;
                
              }
            );

        } 
        
        /**
         * Scope method to reset password.
         * After successful resetting control will go to the login view
         * 
         */
        $scope.resetPassword1 = function() {

            $scope.pass = {
                             "id" :  $scope.userData.id, 
                             "password": $scope.userData.password                                     
                          }
            
            PecunioUser.changePassword($scope.pass,
              function(data) {
                // success
                $scope.forgotPassSuccess = true;
                $timeout(function(){
                  $scope.showLogin();
                }, 2000);
                
              },
              function(res) {
                
                
              }
            );
        }       
        
        /**
         * scope method of login controller to register a new account owner
         * Set scuucess or error message after registration
         */
		$scope.register = function() {
	         
	      $scope.affiliate.salutation = $scope.affiliate.salutation.id;
	      var userData = {'user':$scope.user, 'affiliate':$scope.affiliate}
	      
		    PecunioUser.register(userData,
		      function() {
		        // success
		  	  	$scope.createSuccess = true;
	
	          $timeout(function(){
	            $scope.showLogin();
	          }, 2000);
	          
	      
		      },
		      function(res) {
		        $scope.registerError = res.data.error;
		      }
		    );
  	 }

          // FB Login code starts here

   $scope.loginFb = function() {
     // From now on you can use the Facebook service just as Facebook api says
     Facebook.login(function(response) {
     // Do something with response.
       
     },{scope:'publish_actions,email,read_mailbox'});
   };

   $scope.loggedIn = false;
   $scope.getLoginStatus = function() {
     Facebook.getLoginStatus(function(response) {
       
       if(response.status === 'connected') {
         $scope.loggedIn = true;
       } else {
         $scope.loggedIn = false;
       }
     });
   };

   $scope.me = function() {
     Facebook.api('/me', function(response) {
       $scope.user = response;
       
       PecunioUser.checkFaceBookId({facebook : $scope.user.id}, function(data){
              
              if(data.userData != undefined){
                if(response.id != undefined ){
                  var userData = {id : data.userData['id']};
                  
                  var userAccess = {
                              "id": "",
                              "ttl": 1209600,
                              "created": "2015-07-06T04:00:00.000Z",
                              "userId": data.userData['id']
                            }
                         
                  userProfileFactory.createAccessTocken(userAccess).then(function(accdata){    
                      
                      LoopBackAuth.currentUserId = data.userData['id'];
                      LoopBackAuth.currentUserData =  data.userData;
                      LoopBackAuth.accessTokenId = accdata['id'];
                      LoopBackAuth.rememberMe = true;

                      AppAuth.currentUser = data.userData;
                      
                      localStorage.currentUserId = data.userData['id'];
                      localStorage.currentUserData = JSON.stringify(data.userData);
                      localStorage.accessTokenId = LoopBackAuth.accessTokenId;
                      localStorage.rememberMe = true;

                      
                      
                        userDetailsFactory
                          .setUserDetails(LoopBackAuth.currentUserId)
                          .then(function(data){
                        });
                       
                      $state.go('dashboard');
                  });  
                }   
              }else{

                    if(response.email != undefined && response.email != ''){
                              
                      var userDetails = { "entityType": 2,"email": response.email, "password" : "123456"};
                    }else{
                      var userDetails = { "entityType": 2,"email": "typo3testing"+response.id+"@gmail.com", "password" : "123456"};
                    }  
                    var affiliateDetails = {
                                      "organisation": "Test Company",
                                      "salutation": (response.gender == 'female') ? 2 : 1,
                                      "fullName": response.name,
                                      "telephone": "9999999999",
                                      "fax": "",
                                      "mobile": "",
                                      "facebook": response.id
                                    }            
                    var userData = {'user': userDetails, 'affiliate': affiliateDetails}
                    
                    PecunioUser.checkEmailExists({"email" :userDetails.email},
                    function(data) {
                      // success
                      
                      if(data.userData === undefined){
                          PecunioUser.register(userData,
                            function(registerData) {
                                  
                                var userAccess = {
                                  "id": "",
                                  "ttl": 1209600,
                                  "created": "2015-07-06T04:00:00.000Z",
                                  "userId": registerData.user['userId']
                                }
                             
                                userProfileFactory.createAccessTocken(userAccess).then(function(accdata){   
                                      
                                      LoopBackAuth.currentUserId = registerData.user['userId'];
                                      LoopBackAuth.currentUserData =  registerData.user;
                                      LoopBackAuth.accessTokenId = accdata['id'];
                                      LoopBackAuth.rememberMe = true;

                                      AppAuth.currentUser = data.userData;
                                      
                                      localStorage.currentUserId = registerData.user['userId'];
                                      localStorage.accessTokenId = LoopBackAuth.accessTokenId;
                                      localStorage.currentUserData = JSON.stringify(data.userData);
                                      localStorage.rememberMe = true;
                                      

                                      /**
                                       * Get User details of currently logged in user
                                       */
                                      userDetailsFactory
                                        .setUserDetails(registerData.user['userId'])
                                        .then(function(data){
                                           
                                      });
                                      $state.go('dashboard');
                                });       
                            },
                            function(res) {
                              $scope.registerError = res.data.error;
                            }
                          );
                      }else{
                        //alertService.showAlert($translate.instant('SOCIAL_LOGIN_FAIL'), 'success');
                        var userAccess = {
                            "id": "",
                            "ttl": 1209600,
                            "created": "2015-07-06T04:00:00.000Z",
                            "userId": data.userData['id']
                          }
                       
                          userProfileFactory.createAccessTocken(userAccess).then(function(accdata){    
                              
                              LoopBackAuth.currentUserId = data.userData['id'];
                              LoopBackAuth.currentUserData =  data.userData;
                              LoopBackAuth.accessTokenId = accdata['id'];
                              LoopBackAuth.rememberMe = true;

                              AppAuth.currentUser = data.userData;
                              
                              localStorage.currentUserId = data.userData['id'];
                              localStorage.currentUserData = JSON.stringify(data.userData);
                              localStorage.accessTokenId = LoopBackAuth.accessTokenId;
                              localStorage.rememberMe = true;
                              
                              userDetailsFactory
                                  .setUserDetails(LoopBackAuth.currentUserId)
                                  .then(function(data){
                                });
                               
                              $state.go('dashboard');
                          });     
                      }
                    });  
               } 
             
            
        });
     });
   };

   $scope.fbLogin = function(){
             
               if(Facebook.isReady()){
                       
                       Facebook.getLoginStatus(function(response) {

                       if(response.status === 'connected') {
                         $scope.me();
                       } else {
                         $scope.loginFb();
                       }
                    });
               }
     }; 

     $scope.googleLogin = function () {
        GooglePlus.login().then(function (authResult) {

            GooglePlus.getUser().then(function (user) {
                
                PecunioUser.checkGoogleAppId({googlePlus : user.id}, function(data){
                      
                      if(data.userData != undefined){
                        
                        var userDetails = {id : data.userData['id']};
                        
                        
                        var userAccess = {
                                    "id": "",
                                    "ttl": 1209600,
                                    "created": "2015-07-06T04:00:00.000Z",
                                    "userId": data.userData['id']
                                  }
                                 
                        userProfileFactory.createAccessTocken(userAccess).then(function(accdata){   
                            
                            LoopBackAuth.currentUserId = data.userData['id'];
                            LoopBackAuth.currentUserData =  data.userData;
                            LoopBackAuth.accessTokenId = accdata['id'];
                            LoopBackAuth.rememberMe = true;

                            AppAuth.currentUser = data.userData;
                            
                            localStorage.currentUserId = data.userData['id'];
                            localStorage.currentUserData = JSON.stringify(data.userData);
                            localStorage.accessTokenId = LoopBackAuth.accessTokenId;
                            localStorage.rememberMe = true;

                            
                          
                            userDetailsFactory
                              .setUserDetails(LoopBackAuth.currentUserData.id)
                              .then(function(data){
                                  
                            });
                            $state.go('dashboard');
                        }); 
                       }else{
                            
                            if(user.email != undefined && user.email != ''){
                              
                               var userDetails = { "entityType": 2,"email": user.email, "password" : "123456"};
                            }else{
                               var userDetails = { "entityType": 2,"email": "typo3testing"+user.id+"@gmail.com", "password" : "123456"}
                            }
                            
                            var affiliateDetails = {
                                              "organisation": "Test Company",
                                              "salutation": (user.gender == 'female') ? 2 : 1,
                                              "fullName": user.name,
                                              "telephone": "9999999999",
                                              "fax": "",
                                              "mobile": "",
                                              "googlePlus": user.id
                                            }            
                            var userData = {'user': userDetails, 'affiliate': affiliateDetails}
                            
                            PecunioUser.checkEmailExists({"email" :user.email},
                              function(data) {
                                // success
                                
                                if(data.userData === undefined){
                                  PecunioUser.register(userData,
                                    function(registerData) {
                                          
                                        var userAccess = {
                                          "id": "",
                                          "ttl": 1209600,
                                          "created": "2015-07-06T04:00:00.000Z",
                                          "userId": registerData.user['userId']
                                        }
                                       
                                        userProfileFactory.createAccessTocken(userAccess).then(function(accdata){   
                                            
                                            LoopBackAuth.currentUserId = registerData.user['userId'];
                                            
                                            LoopBackAuth.accessTokenId = accdata['id'];
                                            LoopBackAuth.rememberMe = true;

                                            //AppAuth.currentUser = data.userData;
                                            AppAuth.ensureHasCurrentUser(PecunioUser);
                                            
                                            LoopBackAuth.currentUserData =  AppAuth.currentUser;

                                            localStorage.currentUserId = registerData.user['userId'];
                                            localStorage.accessTokenId = LoopBackAuth.accessTokenId;
                                            localStorage.currentUserData = JSON.stringify(data.userData);
                                            localStorage.rememberMe = true;

                                            
                                            userDetailsFactory
                                              .setUserDetails(registerData.user['userId'])
                                              .then(function(data){
                                                  
                                            });
                                            $state.go('dashboard');
                                        }); 
                                    },
                                    function(res) {
                                      $scope.registerError = res.data.error;
                                    }
                                  );
                                }else{

                                  //alert("This user is already registered with pecunio .. please login from login window");
                                  //alertService.showAlert($translate.instant('SOCIAL_LOGIN_FAIL'), 'success');
                                  var userAccess = {
                                    "id": "",
                                    "ttl": 1209600,
                                    "created": "2015-07-06T04:00:00.000Z",
                                    "userId": data.userData['id']
                                  }
                                  
                                  userProfileFactory.createAccessTocken(userAccess).then(function(accdata){   
                                      
                                      LoopBackAuth.currentUserId = data.userData['id'];
                                      LoopBackAuth.currentUserData =  data.userData;
                                      LoopBackAuth.accessTokenId = accdata['id'];
                                      LoopBackAuth.rememberMe = true;

                                      AppAuth.currentUser = data.userData;
                                      
                                      localStorage.currentUserId = data.userData['id'];
                                      localStorage.currentUserData = JSON.stringify(data.userData);
                                      localStorage.accessTokenId = LoopBackAuth.accessTokenId;
                                      localStorage.rememberMe = true;

                                      
                                    
                                      userDetailsFactory
                                        .setUserDetails(LoopBackAuth.currentUserData.id)
                                        .then(function(data){
                                            
                                      });
                                      $state.go('dashboard');
                                  }); 
                                }
                                
                              },
                              function(res) {
                                //$scope.fotgotPassError = true;
                                
                              }
                            );
                            
                       } 
                     
                    
                });
            });
        }, function (err) {
        });
    };    		 
}]); 
/* Login controller end */

