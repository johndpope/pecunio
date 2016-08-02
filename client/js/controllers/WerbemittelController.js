/**
 * Controller : WerbemittelController
 * Purpose : Show overview page of Ad builder.
 *           Show widgets, statistics, Ad List.
 *			 Show  two button to go to Assitent Module and Ad Builder Module. 
 */
'use strict';


PecunioApp

.controller('WerbemittelController', 
	['$rootScope',
	 '$scope',
	 'LoopBackAuth',
	 '$state',
	 function(
	 	$rootScope,
	 	$scope,
	 	LoopBackAuth,
	 	$state
	 	){

		   $scope.werbemittelList;
		 
		   if(LoopBackAuth.currentUserData === null){
	        	$state.go('login')
	       }
		   $scope.$on('$viewContentLoaded', function() {   
		        Metronic.initAjax();
		   });
}]);
