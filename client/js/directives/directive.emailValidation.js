PecunioApp

.directive('email', function() {
	  return {
	  	restrict: 'A',
		require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
        	
        	var validateFn = function(viewValue) {
	      		    
		      		if(viewValue != undefined || viewValue != null || viewValue != '') {

			      		var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

			      		if (reg.test(viewValue.trim())) {
			      			ctrl.$setValidity('email', true);
			      		} else{
			      			ctrl.$setValidity('email', false);
			      		}

			      		return viewValue;

		      		} else{
		      	        return undefined;
		      		}
	      		};
	      	ctrl.$parsers.push(validateFn);   
      	}
	}
})

.directive('uniqueemail', ['Restangular', function(Restangular) {
	return {
		restrict: 'A',
		require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
        	
        	var validateFn = function(viewValue) {

        		Restangular.all("UtilityModel")
        		.customPOST({"email" : viewValue}, "checkUniqueEmail", {}, {}).then(
        			function(res){
        				ctrl.$setValidity('uniqueemail', res.notExists);
        			});
        		return viewValue; 
		    };
	      	
	      	ctrl.$parsers.push(validateFn);  
      	}

	};

}]);

  						