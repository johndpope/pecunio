PecunioApp

.directive('mobile', ['Restangular', function(Restangular) {
	return {
		restrict: 'A',
		require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
        	var validateFn = function(viewValue) {
	      		
		      		if(viewValue != undefined || viewValue != null) {

			      		if (isNaN(viewValue.trim())) {
			      			ctrl.$setValidity('mobile', false);
			      		} else{
			      			ctrl.$setValidity('mobile', true);
			      		}

			      		return viewValue;

		      		} else{
		      	        return undefined;
		      		}
	      		};
	      	ctrl.$parsers.push(validateFn);   
      	}
	};
}]);

  						