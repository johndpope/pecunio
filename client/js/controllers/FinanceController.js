'use strict';

PecunioApp

.controller('FinanceController', 
	['$scope', 
	 'FinanceService',
	 'LoopBackAuth',

	 function(
	 	$scope, 
	 	FinanceService,
	 	LoopBackAuth
	 ) {
	 		if(LoopBackAuth.currentUserData === null){
		        $state.go('login')
		    }

			FinanceService.getWidgets().then(function(data) {
				var financeData = _.filter(data, function(widgts){
					var locations = widgts.location.split(',');
					return locations.indexOf("finance") != -1;
				});
				$scope.financeWidgets = financeData;
			});
			$scope.custAttr = {};

			$scope.$on('$viewContentLoaded', function() {
				// initialize core components
				Metronic.initAjax();
			});
		} 
	]);