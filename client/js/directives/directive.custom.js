PecunioApp

.directive('configWidget', [ 'Widget', '$q', 'alertService', '$window', '$timeout', '$translate', function(Widget, $q, alertService, $window, $timeout, $translate) {
    return {
    	restrict: 'E',
    	scope: {
    		custAttr: '=ngModel',
    		widget: '=param'
        },
    	templateUrl: 'views/common/widget.html',
    	link:    function(scope, elements, attr){
    		
    		scope.custAttr.widgetType = attr.widgettype;
    		scope.custAttr.score = '54.25';
    		scope.custAttr.percentChange = '70%';
    		scope.moveWidget = function(widget) {
    			
    			var locations = widget.location.split(',');
    			var new_location = '';
				if(locations.length > 0 && locations.indexOf("dashboard") == -1){
					new_location = widget.location + ',dashboard';
				}else if(locations.length == 0){
					new_location = 'dashboard';
				}else{
					alertService
					.showAlert($translate.instant('WIDGET_EXISTS'),'danger');
					return;
				}
    			var def = $q.defer();
    			
    			//{"where":{"id":widget.id}, "data": {"location" : "dashboard"}}
    			return Widget.update({"where":{"id": widget.id}}, {"location": new_location}).$promise.then(function(data) {
    				def.resolve(data);
    				alertService
					.showAlert($translate.instant('WIDGET_MOVED'),'success');
    				$timeout(function() {
    		            $window.location.reload();
    		          }, 2000);
    				return def.promise;
    			});

    		};
    		scope.removeWidget = function(widget){
    			var locations = widget.location.split(',');
    			var index = locations.indexOf('dashboard');
    			var new_location = '';
    			if (index > -1) {
    				locations.splice(index, 1);
    				new_location = locations.join(',');
    			}else{
					alertService
					.showAlert(
							"Cheating! Uh!",
							'danger');
					return;
				}
    			
    			var def = $q.defer();
    			
    			//{"where":{"id":widget.id}, "data": {"location" : "dashboard"}}
    			return Widget.update({"where":{"id": widget.id}}, {"location": new_location}).$promise.then(function(data) {
    				def.resolve(data);
    				alertService
					.showAlert(
							$translate.instant('WIDGET_REMOVED'),
							'success');
    				$timeout(function() {
    		            $window.location.reload();
    		          }, 2000);
    				return def.promise;
    			});
    			
    		};
    	}
    };

}])

.directive('datePicker',function($compile){
    return {
        restrict: 'E',
        
        template: '<select id="dt" ng-model="day"><option ng-repeat="dy in days track by dy">{{dy}}</option></select>'+
                  '<select id="mn" ng-model="month"><option ng-repeat="mn in months track by mn">{{mn}}</option></select>'+
                  '<select id="yr" ng-model="year"><option ng-repeat="yr in years track by yr">{{yr}}</option></select>',
        
        compile: function(element, attr){

            return {
                pre: function preLink( scope, element, attributes ) {
                    scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
                    scope.months = [1,2,3,4,5,6,7,8,9,10,11,12];
                    tmpyears = [];
                    for(i=1970; i<2020; i++){
                        tmpyears.push(i);
                    }
                    scope.years = tmpyears;
                }
                
            };

        }
        
    };
})
.directive('fileread', function (userProfileFactory) {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {

            element.bind("change", function (changeEvent) {

                var tmppath = URL.createObjectURL(changeEvent.target.files[0]);
                scope.$apply(function () {
                    scope.fileread = changeEvent.target.files[0];
                });
                
                userProfileFactory
                .uploadFile({"logo" : element[0].files[0]})
                .then(function(data){
                });
                

            });
        }
    }
})

.directive('showdiv', function(){
    return{
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attr, ctrl){
              
          element.on('click', function(){
 
             $("#dtable tr.details").remove();
             var backgroundPos = $(element).css('backgroundPosition').split(" ");
           
             var xPos = backgroundPos[0],
                 yPos = backgroundPos[1];

              if(yPos == '-23px'){
                $("#dtable span.row-details").css('background-position', '0 0');
                $(this).css('background-position', '0 0');
                element.closest('tr details').remove();
              }else{
                $("#dtable span.row-details").css('background-position', '0 0');
                $(this).css('background-position', '0 -23px');
                element.closest('tr').after('<tr class="details"><td colspan="11"><table><tr><td>'+scope.data.id+'</td><td>'+scope.data.name+'</td></tr></table></td></tr>');
              }
                              
          });
        }
    };
})
.directive('copyText', [ 'alertService', function(alertService){
	return{
		restrict: 'E',
		template: '<button type="button"  class="btn green" >Code Kopieren</button>',
		link: function(scope, element, attr, ctrl){
			var clip = new ZeroClipboard(element);
			element.on('click', function(){
				alertService
				.showAlert(
						$translate.instant('TEXT_COPIED'),
						'success');
			});		

		}
	};
}])

.directive('multiselect', function($timeout){
    return{
        restrict: 'A',
        scope: {
          multiSelectedVal: '=ngModel'
        },
        link: function(scope, element, attr, ctrl){
            $(element).select2();
            $(element).on("change", function(e) {
                scope.$apply(function () {
                    scope.multiSelectedVal = e.val;
                });
            });                
        }
    };
})
.directive('filterdomain', function(){
    return{
        restrict: 'E',
        templateUrl:'views/assistent/domainsList.html'
    }
})
.directive('validdomain', [function() {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            
            var validateFn = function(viewValue) {
                    
                    if(viewValue != undefined || viewValue != null || viewValue != '') {

                        
                        var reg = /^(http:\/\/){0,1}(www.){0,1}[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,6})+$/;

                        if (reg.test(viewValue.trim())) {
                            ctrl.$setValidity('validdomain', true);
                        } else{
                            ctrl.$setValidity('validdomain', false);
                        }

                        return viewValue;

                    } else{
                        return undefined;
                    }
                };
            ctrl.$parsers.push(validateFn);   
        }
    }
}])

.directive('uniquedomain', ['Restangular', function(Restangular) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            
            var validateFn = function(viewValue) {
               
               Restangular.all("UtilityModel")
                .customPOST({"domainName" : viewValue}, "checkUniqueDomain", {}, {}).then(
                    function(res){
                        ctrl.$setValidity('uniquedomain', res.notExists);
                    });
                return viewValue; 
            };
            
            ctrl.$parsers.push(validateFn);  
        }

    };

}])

.directive('groups', function(){

    return{
        restrict : 'E',
        require: 'ngModel',
        templateUrl : 'views/profile/manage-groups.html',
        link: function(scope, ele, attrs, ctrl){
            scope.addRow = function(){
            }
        }
    }
})

.directive('domains', function(){

    return{
        restrict : 'E',
        require: 'ngModel',
        templateUrl : 'views/profile/manage-domains.html',
        link: function(scope, ele, attrs, ctrl){
            scope.addRow = function(){
            }
        }
    }
})

.directive('uniquedomain', ['Restangular', function(Restangular) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            
            var validateFn = function(viewValue) {
                
                Restangular.all("UtilityModel")
                .customPOST({"domainName" : viewValue}, "checkUniqueDomain", {}, {}).then(
                    function(res){
                        ctrl.$setValidity('uniquedomain', res.notExists);
                    });
                return viewValue; 
            };
            
            ctrl.$parsers.push(validateFn);  
        }

    };

}])

.directive('uniquedomainuser', ['Restangular', function(Restangular) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            
            var validateFn = function(viewValue) {
                
                Restangular.all("UtilityModel")
                .customPOST({"domainName" : viewValue}, "checkUniqueDomain", {}, {}).then(
                    function(res){
                        ctrl.$setValidity('uniquedomain', res.notExists);
                    });
                return viewValue; 
            };
            
            ctrl.$parsers.push(validateFn);  
        }

    };

}])
/*.directive('approvalStatus', function() {
    return {
        link: function(scope, element, attr, ctrl){
           var status = scope.$eval(attr.approvalStatus);
           var id = scope.$eval(attr.param);
           scope.edit = function() {
                alert("hhhhh");
              $scope.$parent.doIt();
           };
           var msg = '';
           if(status == 0){
                msg = "Pending";
           }else if(status == 1){
                msg = '<div ng-controller="DomainListController"><button ng-click="edit()">Edit</button></div>';
           }else if(status == 2){
                msg = "Approved";
           }else if(status == 3){
                msg = "<input type='radio' value='status' ng-click='technicalApprovalForAdmin("+id+",1)'> Approve";
           }else if(status == 4){
                msg = "Manual approval decliend";
           }

           element.html(msg);

        }
    }; 
})*/

.directive('manualApproval', function() {
    return {
        restrict: 'E',
        scope: {
            id: "=domaindata"
        },
        template : '<span>Waiting for Manual Approval : <button ng-click="changeManStatus(2)">Approve</button><button ng-click="changeManStatus(4)">Decline</button></span>',
        controller: function($scope) {  
            var domainId = $scope.id;
            $scope.changeManStatus = function(status) {
              $scope.$parent.manualApproval(domainId, status);
            };
      }
    }
})


.directive('technicalApproval', function() {
    return {
        restrict: 'E',
        scope: {
            id: "=domaindata"
        },
        template : '<span>Waiting for Technical Approval : <button ng-click="changeTechStatus(1)">Approve</button></span>',
        controller: function($scope) {  
            var domainId = $scope.id;
            $scope.changeTechStatus = function(status) {
              $scope.$parent.technicalApprovalForAdmin(domainId, status);
            };
      }
    }
});

