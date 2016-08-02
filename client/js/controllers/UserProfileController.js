'use strict';

PecunioApp

.controller('UserProfileController',
    ['$rootScope',
    '$scope',
    '$http', 
    '$timeout',
    'userProfileFactory',
    'supportFactory',
    '$modal',
    'LoopBackAuth', 
    'pecunioACLService', 
    'pecunioDateService', 
    'alertService',
    '$translate',
    'FileUploader', 
    'Upload',
    '$window',
    '$state',
    function(
        $rootScope, 
        $scope, 
        $http, 
        $timeout, 
        userProfileFactory, 
        supportFactory,
        $modal, 
        LoopBackAuth, 
        pecunioACLService, 
        pecunioDateService, 
        alertService,
        $translate,
        FileUploader, 
        Upload,
        $window,
        $state
        ) {
	
            $scope.supportData = '';
            $scope.user = '';
            $scope.affiliate = '';
            $scope.isProfile = true;
            $rootScope.showSupportControll = false;
            $rootScope.showProfileControll = true;
            $scope.finance = {};
            $scope.dob = [];
            $scope.successMsg = '';
            $scope.logoFileName = [];
            sessionStorage.roleId = '';
            var i = 0;

            /**
             * If currently logged in user data is null then 
             * control will move to the login page
             */
            if(LoopBackAuth.currentUserData === null){
                $state.go('login')
            }
            
            /**
             * Scope method to check logged in user's role
             * A flag is set true if role is admin
             * If flag is true then finacce and company tab will be shown
             */
            pecunioACLService.checkLoggedInUserkRole(LoopBackAuth.currentUserId).then(function(roleId){

                //$scope.currentUserRole = data.roleId;
                $scope.showFinance = function(){
                  var flag = (roleId==1) ? true : false;
                  return flag;
                }

                $scope.showFirma = function(){
                  var flag = (roleId==1) ? true : false;
                  return flag;
                }
            });
            
            /**
             * Scope method to get personal data of logged in user
             */
            userProfileFactory.getPersonalData().then(function(response){  
                $scope.user = response.user.user; 
                $scope.affiliate = response.user.affiliate; 
                
                if($scope.affiliate.dob != null){

                    var dobDate = moment.tz($scope.affiliate.dob,"America/Los_Angeles");
                    var $dob = dobDate.startOf("day").format();
                    var $dobDate = $dob.split('T');

                    $dobDate = $dobDate[0].split('-');
                    $scope.day = parseInt($dobDate[2]); 
                    $scope.month = parseInt($dobDate[1]);
                    $scope.year = parseInt($dobDate[0]);

                }else{

                    $scope.day = 1;
                    $scope.month = 1;
                    $scope.year = 1970;

                }

                $scope.profileImage = ($scope.affiliate.image === null) ? "../uploads/profile/profile.jpg" : "../uploads/avatars/"+$scope.affiliate.image;
                var data = {"roleId":response.user.role.roleId};
                sessionStorage.roleId = response.user.role.roleId;
                /*userProfileFactory.getRoleName(data).then(function(res){  
                    $scope.role = res.description;
                });*/                   
            });  
            
            /**
             * Get support data for left section of profile
             */
            supportFactory
                .getSupport()
                .then(function(res){
                $scope.supportData = res.data[0];
            });
             
            //if(sessionStorage.roleId != ''){

                userProfileFactory.getGroups().then(function(data){
                    $rootScope.groups = data;
                });

                userProfileFactory.getDomains().then(function(data){
                    $rootScope.domains = data;

                });
            //}

            /**
             * Function for file(s) Uploading for change Logo
             * 
             * @return {[type]}
             */
            $scope.initUploadAdImage = function(){ 
                // create a uploader with options
                var testuploader = $scope.uploader = new FileUploader({
                  $scope: $scope,                          
                  url: '/api/container/logo/upload',
                  formData: [
                    { key: 'value' }
                  ]
                });

                // FILTERS
                testuploader.filters.push({
                    name: 'customFilter',
                    fn: function(item /*{File|FileLikeObject}*/ , options) {
                        return this.queue.length < 10;
                    }
                });
                testuploader.filters.push({
                    name: 'imageFilter',
                    fn: function(item /*{File|FileLikeObject}*/, options) {
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                    }
                });
                
                // CALLBACKS
                testuploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
                    $scope.showMsg = true;
                    $scope.mode = 1;
                    $scope.msg = $translate.instant('FILE_TYPE_MSG');
                };
                
                testuploader.onAfterAddingFile = function(fileItem) {
                    // renaming file to unique filename
                    var d = new Date();
                    var n = d.getTime();
                    var fileExtension = '.' + fileItem.file.name.split('.').pop();
                    var fileName = fileItem.file.name.split('.').shift();
                    fileItem.file.name = fileName + "-" + n + fileExtension;
                    $scope.logoFileName[i] = fileItem.file.name;
                    i++;
                };
                testuploader.onAfterAddingAll = function(addedFileItems) {
                    $scope.showMsg = true;
                    $scope.mode = 0;
                    $scope.msg = $translate.instant('READY_TO_UPLOAD_LOGOS');
                };
                testuploader.onBeforeUploadItem = function(item) {
                };
                testuploader.onProgressItem = function(fileItem, progress) {
                };
                testuploader.onProgressAll = function(progress) {
                };
                testuploader.onSuccessItem = function(fileItem, response, status, headers) {
                };
                testuploader.onErrorItem = function(fileItem, response, status, headers) {
                };
                testuploader.onCancelItem = function(fileItem, response, status, headers) {
                };
                testuploader.onCompleteItem = function(fileItem, response, status, headers) {
                };
                testuploader.onCompleteAll = function() {
                    $scope.showMsg = true;
                    $scope.mode = 0;
                    $scope.msg = $translate.instant('READY_TO_SAVE_LOGOS');
                };
            }();

        	$scope.$on('$viewContentLoaded', function() { 
            	
        		/**
        		 * Scope method to update personal data of logged in user
        		 */
                $scope.updatePersonalData = function(){
                	$scope.affiliate.dob = pecunioDateService.setDate([$scope.year, $scope.month, $scope.day]); 
                    var userData = {'user':$scope.user, 'affiliate':$scope.affiliate};
                    userProfileFactory.editPersonalData(userData).then(function(response){
                    alertService.showAlert($translate.instant('PROFILE_UPDATED'), 'success');
                    });
                }
                
                /**
                 * Scope method to modify profile image
                 */
                $scope.changeAvatar = function(){
                    var modalInstance = $modal.open({
                        templateUrl: 'views/profile/avatarUploadModal.html',
                        controller: 'AvatarChangeController',
                        backdrop: 'static',
                        size: 700
                    });
                }
                
                /**
                 * Scope method to change passord
                 */
                $scope.changePassword = function(){
                    userProfileFactory.changePassword($scope.user).then(
                        function(data){
                        	alertService.showAlert($translate.instant('PWD_CHANGED'), 'success');
                            $scope.user = {};
                            $scope.resetPass = '';
                        },
                        function(res) {
                        
                        }
                    );
                }   
                
                /**
                 * Scope method to cancel change passord request
                 */
                $scope.cancel = function(){
                    $scope.user = {};
                    $scope.resetPass = '';
                }
                
                /**
                 * Scope method to delete group
                 */
                $scope.deleteGroup = function(gid){
                    
                    if (confirm("Are you sure to delete this row ?") == true) {
                        userProfileFactory.deleteGroup(gid).then(
                            function(data){
                                alertService.showAlert($translate.instant('GROUP_DELETED'), 'success');
                                //$scope.msgSuccess = "Group has been deleted successfully";     
                            }, 
                            function(err){

                            }
                        );
                    }  

                    userProfileFactory.getGroups().then(function(data){
                      $scope.groups = data;
                    });   

                }
                
                /**
                 * Scope method to edit a group
                 */
                $scope.editGroup = function(id){
                    
                    var modalInstance = $modal.open({
                        templateUrl: 'views/group/add-group.html',
                        controller: 'GroupCtrl',
                        backdrop: 'static',
                        size: 400,
                        resolve: {
                            group: function () {
                               return userProfileFactory.getGroup({'id' : id}).then(function(data){
                                    
                                    return data[0];
                               });
                            },
                        }
                    });
                }
                
                /**
                 * Scope method to add group
                 */
                $scope.addGroup = function(gid){
                    var modalInstance = $modal.open({
                        templateUrl: 'views/group/add-group.html',
                        controller: 'GroupCtrl',
                        backdrop: 'static',
                        size: 400,
                        resolve: {
                            group: function(){
                                var group = {};
                                return group;
                            }
                        }
                    });
                }
                
                /**
                 * Scope method to get company details of an account owner
                 */
                $scope.getCompanyDetails = function(){
                    $scope.successMsg = '';
                    userProfileFactory.getCompanyDetails().then(function(data){

                        $scope.company = data[0];

                        userProfileFactory.getLogos(LoopBackAuth.currentUserId).then(function(res){  
                            if (res.logoData[0].logo != null) {
                                $scope.logosListView = true;
                                $scope.logos = res.logoData[0].logo.split(",");
                            } else {
                                $scope.logosListView = false;
                            }
                            
                            $scope.company.currentLogo = res.logoData[0].currentLogo;
                            $scope.logoImage = (res.logoData[0].currentLogo === null) ? "../uploads/logo/pecunio-site-default-logo.jpg" : "../uploads/logo/"+res.logoData[0].currentLogo;
                            
                        }); 
                    }); 
                    $http.get('data/country.json').success(function (data) {
                      $scope.countries = data.countries;
                    });

                }
                
                /**
                 * Scope method to change logo preview
                 */
                $scope.changeLogoPreview = function(){
                    $scope.logoImage = "../uploads/logo/"+$scope.company.currentLogo;
                }
                
                /**
                 * Scope method to save company details of logged in account owner
                 */
                $scope.saveCompany = function(){
                    userProfileFactory
                    .saveCompany($scope.company)
                    .then(function(data){
                        alertService.showAlert($translate.instant('COMPANY_UPDATED'), 'success');
                    });
                }
                
                /**
                 * Scope method to get finance details of logged in account owner
                 */
                $scope.getFinanceDetails = function(){
                    $scope.successMsg = '';
                    userProfileFactory.getFinanceDetails().then(function(data){
                      
                      $scope.finance = data[0];
                      if($scope.finance === undefined){
                        $scope.finance = {};
                        $scope.finance.userId = LoopBackAuth.currentUserId;
                      }
                      
                    }); 
                    
                }
                
                /**
                 * Scope method to save finance data of logged in account owner
                 */
                $scope.saveFinance = function(){
                    userProfileFactory
                    .saveFinance($scope.finance)
                    .then(function(data){
                        
                        if($scope.finance.id === undefined){
                            
                            $scope.finance.id = data.id;
                        }   
                        //$scope.successMsg = "Finace data has been updated successfully";
                        alertService.showAlert($translate.instant('FINANCE_UPDATED'), 'success');
                    });
                }

                /**
                 * Function for save logo(s)
                 * 
                 * @return {[type]}
                 */
                $scope.saveAllLogo = function(){
                    var currentLogoName = '';
                    userProfileFactory.getLogos(LoopBackAuth.currentUserId).then(function(res){  
                        if (res.logoData[0].currentLogo === null) {
                            currentLogoName = $scope.logoFileName[0];
                        } else {
                            currentLogoName = res.logoData[0].currentLogo;
                        }
                        if (res.logoData[0].logo != null) {
                            $scope.allLogoFileName = res.logoData[0].logo + "," + $scope.logoFileName.toString();
                            
                        } else {
                            $scope.allLogoFileName = $scope.logoFileName.toString();
                        }
                        var companyData = {
                            "fileName": $scope.allLogoFileName,
                            "currentLogo": currentLogoName,
                            "id": LoopBackAuth.currentUserId
                        };
                        userProfileFactory.saveAllLogo(companyData).then(function(res){
                            $window.location.reload();
                        });
                    });
                    
                }

                /**
                 * Function for delete file
                 * @param  {[object]}
                 * @return {[type]}
                 */
                $scope.deleteLogoFile = function(item){
                    var filename = item.file.name;
                    item.remove();
                    
                    var index = $scope.logoFileName.indexOf(item.file.name);

                    if (index > -1) {
                        $scope.logoFileName.splice(index, 1);
                    }
                    userProfileFactory.deleteLogoFile(filename).then(function(res){
                    });
                }
                
                /**
                 * Scope method to add domain from domain management
                 */
                $scope.addDomain = function(){

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
                
                /**
                 * Scope method show domain approval modal with message from domain management
                 */
                $scope.addDomainApproval = function(id){

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
                                return userProfileFactory.getDomain({"id":id}).then(function(data){
                                    
                                    return data;
                                    
                                });
                                
                            },
                            showModal : function(){

                                return false;
                            },
                            showResgistrationModal : function(){
                                 return false;
                            },
                            showApprovalModal : function(){
                                 return true;
                            }

                        }
                    });
                }

    	Metronic.initAjax(); // initialize core components
        Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile')); // set profile link active in sidebar menu

        $rootScope.settings.layout.pageSidebarClosed = false; 
               
    });
    //$rootScope.settings.layout.pageSidebarClosed = true;
}])
.controller('UserAddCtrl',function($scope, $modalInstance, salutations, groups, roles, AccountUsersFactory, LoopBackAuth, $window, isAdd, userProfileFactory, alertService, $timeout, $translate){
  $scope.groups = groups;
  $scope.roles = roles;
  $scope.salutations = salutations;
  $scope.title = "Add Account User";
  $scope.isAdd = isAdd;
  
  /**
   * Scope method to save account user data
   */
  $scope.saveAccountUser = function(){
    
    userProfileFactory.getPersonalData().then(function(response){ 
     
        $scope.affiliate.organisation = response.user.affiliate.organisation; 
        $scope.affiliate.accountOwnerId = LoopBackAuth.currentUserId;
        $scope.affiliate.salutation = $scope.affiliate.salutation;
        $scope.user.realm = $scope.user.realm;
        $scope.user.entityType = LoopBackAuth.currentUserData.entityType;

        var userData = {'user' : $scope.user, 'affiliate' : $scope.affiliate, 'role' : $scope.role};
        
        if(userData){
          AccountUsersFactory.createAccountUser(userData).then(function(data){
              $modalInstance.close("");
              alertService.showAlert($translate.instant('USER_CREATED'), 'success');
              
              var emailData = {
                "uId" : data.user.userId,
                "changePasswordlink" : "http://pecunioug.opendingo.com:3000/#/create-password?id="+data.user.userId
              } 

              AccountUsersFactory.sendCreatePasswordLink(emailData).then(function(statusData){
                
                if (statusData.isSent) {
                  alertService.showAlert($translate.instant('USER_CREATED_SEND_SET_PWD_LINK'), 'success');
                }
              });
              $timeout(function() {
                $window.location.reload();
                //$modalInstance.close("");
              }, 1000);
          }, function(err){

          });
        }
    
    });  
    
  }
  
  /**
   * Scope method to create password
   */
  $scope.createPassword = function() {

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
   * 
   */
  $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
  };

})

.controller('UserEditCtrl',function($scope, $modalInstance, salutations, groups, roles, user, AccountUsersFactory, $window, isAdd, alertService, $timeout, $translate){
  $scope.groups = groups;
  $scope.roles = roles;
  $scope.salutations = salutations;
  $scope.title = "Edit Account User";
  $scope.user = user.user;
  $scope.affiliate = user.affiliate;
  $scope.role = user.role.roleId;
  $scope.isAdd = isAdd;
  
  /**
   * Scope method to save account user data
   */
  $scope.saveAccountUser = function(){

    $scope.user.realm = $scope.user.realm;
    
    var userData = {'user' : $scope.user, 'affiliate' : $scope.affiliate, 'role' : $scope.role};
    
    if(userData){
      AccountUsersFactory.editAccountUser(userData).then(function(data){
        
          alertService.showAlert($translate.instant('USER_UPDATED'), 'success');
          $modalInstance.close("");
          $timeout(function() {
            $window.location.reload();
            
          }, 1000);
      }, function(err){

      });
    }
  }
  /**
   * Scope method to close edit user modal
   */
  $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
  };

})

.controller('GroupCtrl',function($scope, group, $modalInstance, $window, LoopBackAuth, userProfileFactory, alertService, $timeout, $translate){

  $scope.group = group;

  $scope.group.accountOwnerId = LoopBackAuth.currentUserId;
  $scope.group.status = 1;
  
  /**
   * Set Scope title for Add/Edit group modal
   */
  if($scope.group.id>0){
    
    $scope.title = "Edit Group";
  }else{
    $scope.title = "Add Group";
  }
  
  /**
   * Scope method to save group
   */
  $scope.saveGroup = function(){
    
    if($scope.group){

      if(!$scope.group.id){$scope.group.id="";}
      userProfileFactory.saveGroup($scope.group).then(function(data){

         alertService.showAlert($translate.instant('GROUP_SAVED'), 'success');  
         $modalInstance.close("");
          
          $timeout(function() {
              $window.location.reload();
              
          }, 1000);
          //$state.go('profile.groups');

      }, function(err){

      });

    }

  }
  
  /**
   * Scope method to close group add/edit modal instance
   */
  $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
  };

}); 
