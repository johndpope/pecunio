PecunioApp

.directive('uniqueusername', ['Restangular', function(Restangular) {
	return {
		restrict: 'A',
		require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
        	
        	var validateFn = function(viewValue) {
        	
        		Restangular.all("UtilityModel")
        		.customPOST({"username" : viewValue}, "checkUniqueUserName", {}, {}).then(
        			function(res){
        				ctrl.$setValidity('uniqueusername', res.notExists);
        			});
        		return viewValue; 
		    };
	      	
	      	ctrl.$parsers.push(validateFn);  
      	}

	};

}])

.directive('retypepass', [function() {
	return {
		restrict: 'A',
		require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
        
        	var validateFn = function(viewValue) {
        		
        		if(viewValue != undefined || viewValue != null || viewValue != '') {
        		    var pass = attrs.param;

        		    if(pass != viewValue){
        		    	ctrl.$setValidity('retypepass', false);
        		    }else{
			      		ctrl.$setValidity('retypepass', true);
			      	}
        		}	
        		
        		return viewValue; 
		    };
	      	
	      	ctrl.$parsers.push(validateFn);  
      	}

	};

}])

.directive('passvalidation', [function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
        
            var validateFn = function(viewValue) {

                if(viewValue != undefined || viewValue != null || viewValue != '') {

                    var reg = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])/;

                    if (viewValue.length >= 8 && viewValue.length <= 20 && reg.test(viewValue.trim())) {
                        ctrl.$setValidity('passvalidation', true);
                    } else{
                        ctrl.$setValidity('passvalidation', false);
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
  						