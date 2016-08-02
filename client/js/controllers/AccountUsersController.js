'use strict';

PecunioApp

.controller('AccountUsersController',
    ['$rootScope',
     '$scope',
     '$http', 
     '$timeout',
     'AccountUsersFactory',
     'LoopBackAuth', 
     '$state',
     '$modal',
     'userProfileFactory',
     '$translate',
     'alertService',
     '$window',

     function(
        $rootScope, 
        $scope, 
        $http, 
        $timeout, 
        AccountUsersFactory, 
        LoopBackAuth, 
        $state, 
        $modal, 
        userProfileFactory,
        $translate,
        alertService,
        $window) {
            $scope.userDeatils = '';
            $rootScope.showProfileControll = false;
            $rootScope.showSupportControll = true;
            
            /**
             * If current user data is null then controll 
             * will move to the login page
             */
            if(LoopBackAuth.currentUserData === null){
                $state.go('login')
            }

            /**
             * Get account users of logged in accont owner
             * Used to show account users listing
             */
            AccountUsersFactory
                .getAccountUsers({'id' : LoopBackAuth.currentUserId})
                .then(function(users){
                     
                    $scope.users = users;
                    
            });
            
            /**
             * Get all groups of logged in account owner
             */
            userProfileFactory.getGroups().then(function(data){
                    
                    $scope.groups = data
            }); 
            
            /**
             * Get all registered domains of logged in account owner
             */
            userProfileFactory.getDomains().then(function(data){
                    
                    $scope.domains = data
            }); 
            
            /**
             * Get all roles
             */
            userProfileFactory.getRoles({'entityType' : LoopBackAuth.currentUserData.entityType}).then(function(data){
                $scope.roles = data
            }); 
            
            $scope.$on('$viewContentLoaded', function() { 
                
                $rootScope.settings.layout.pageSidebarClosed = false;
                $scope.currentUser = LoopBackAuth.currentUserData;
                $rootScope.settings.layout.pageSidebarClosed = true;
                
                /**
                 * Scope method to change status
                 * @param {integer} id		[usrr id]
                 * @param {integer} status	[status]
                 */
                $scope.changeStatus = function(id, status){

                    AccountUsersFactory
                    .changeStatus({'id' : id, 'status':status})
                    .then(function(data){
                    });
                }
                
                /**
                 * Scope method to change Group
                 * @param {integer} id  	[user id]
                 * @param {integer} realm   [group id]
                 */
                $scope.changeGroup = function(id, realm){

                    AccountUsersFactory
                    .changeGroup({'id' : id, 'realm':realm})
                    .then(function(data){
                        //$scope.msgSuccess = "Group has been changed successfully";
                    });
                }
                
                /**
                 * Scope method to change Role
                 * @param {integer} id 		[user id]
                 * @param {integer} role	[role id]
                 */
                $scope.changeRole = function(id, role){

                    AccountUsersFactory
                    .changeRole({'id' : id, 'role':role})
                    .then(function(data){
                       // $scope.msgSuccess = "Role has been changed successfully";
                    });
                }
                
                /**
                 * Scope method to update account user
                 * @param {integer} id [user id]
                 */
                $scope.editAccountUser = function(id){
                   
                    var modalInstance = $modal.open({
                    
                        templateUrl: 'views/profile/addUser.html',
                        controller: 'UserEditCtrl',
                        backdrop: 'static',
                        size: 300,
                        resolve: {
                            groups: function () {
                               return userProfileFactory.getGroups({'accountOwnerId' : LoopBackAuth.currentUserId}).then(function(data){
                                    return data;
                               });
                            },
                            roles: function () {
                                return userProfileFactory.getRoles({'entityType' : LoopBackAuth.currentUserData.entityType}).then(function(data){
                                    return data;
                                });
                            },
                            salutations: function(){
                                return $scope.salutations = [
                                            { id: 1, name: 'Herr' },
                                            { id: 2, name: 'Frau' },        
                                        ];
                            },
                            user: function(){
                                return AccountUsersFactory.getAccountUser({"id":id}).then(function(data){
                                    return data.user;
                                });
                            },
                            isAdd: function(){

                                return false;
                            }
                        }
                     });
                }
                
                /**
                 * Scope method to delete account user
                 * @param {integer} id [user id]
                 */
                $scope.deleteAccountUser = function(id){
                    var delConfirm = $window.confirm($translate.instant('WANT_TO_DELETE'));
                    if(delConfirm){

                        AccountUsersFactory
                        .deleteAccountUser({'id' : id})
                        .then(function(data){
                            //$scope.msgSuccess = "Account user has been deleted successfully";

                            AccountUsersFactory
                            .getAccountUsers({'id' : LoopBackAuth.currentUserId})
                            .then(function(users){
                                $scope.users = users;
                                alertService.showAlert($translate.instant('ACCOUNT_USER_DELETED_SUCC'), 'success');
                            });
                            
                        });
                    }
                }
                
                /**
                 * Scope method to show add user modal
                 * @param {integer} size [Modal size]
                 */
                $scope.addUserModal = function(size){
                      
                      if($scope.groups.length == 0 ){
                          alertService.showAlert($translate.instant('ADD_GROUP_THEN_ADD_ACCOUNT_USER'), 'info');  
                      }else{

                          var modalInstance = $modal.open({
                        
                            templateUrl: 'views/profile/addUser.html',
                            controller: 'UserAddCtrl',
                            backdrop: 'static',
                            size: size,
                            resolve: {
                                groups: function () {
                                   return userProfileFactory.getGroups({'accountOwnerId' : LoopBackAuth.currentUserId}).then(function(data){
                                        return data;
                                   });
                                },
                                roles: function () {
                                    return userProfileFactory.getRoles({'entityType' : LoopBackAuth.currentUserData.entityType}).then(function(data){
                                        return data;
                                    });
                                },
                                salutations: function(){
                                    return $scope.salutations = [
                                                { id: 1, name: 'Herr' },
                                                { id: 2, name: 'Frau' },        
                                            ];
                                },
                                isAdd: function(){

                                    return true;
                                }
                            }
                         });
                    }
                     
                }
                //$rootScope.settings.layout.pageSidebarClosed = true; 
                Metronic.initAjax(); // initialize core components
                Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile')); // set profile link active in sidebar menu

            });
    //$rootScope.settings.layout.pageSidebarClosed = true; 
}]); 