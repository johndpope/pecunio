'use strict';

PecunioApp
.controller('AssistantBuilderController', 
	['$rootScope',
	 '$scope', 
	 '$http', 
	 '$timeout',
	 'pecunioFonts',
	 'publisherDomainFactory',
	 'LoopBackAuth',
	 '$state',
	 '$translate',
     'ZoneBuilder',
	 function(
	 	$rootScope,
	 	$scope,
	 	$http,
	 	$timeout,
		pecunioFonts,
		publisherDomainFactory,
		LoopBackAuth,
		$state,
		$translate,
		ZoneBuilder
	 	){
	 	
	 	if(LoopBackAuth.currentUserData === null){
	        $state.go('login');
	    }
	 	$scope.$on('$viewContentLoaded', function() {
		    $scope.getAttr = {};
		    $scope.getAttr.fonts = pecunioFonts;
		    $scope.screenPath = '';
    		$scope.msg = '';

			$scope.init = function(){
				var getdata = sessionStorage.getItem('sendBaseUrl');
	    		var jsonArr = JSON.parse(getdata);
	    		var baseUrl = jsonArr.baseUrl;
	 			if(baseUrl != null){
	 				var webUrl = '';
	 				if(baseUrl.indexOf("http://") > -1){
						webUrl = baseUrl;
					}else{
						webUrl = 'http://'+baseUrl;
					}
	 				
	 				$scope.getAttr.showurl = baseUrl;
	 				/**
	 				 * Function for screen capture from the web URL and fectch screen on the canvas
	 				 */
					ZoneBuilder.screenCapture({'website':{"weburl":webUrl,"height":768,"width":1024}})
				   	.$promise
		  			.then(function (data){
		  				if(data){
		  					if(data.screen.isPageOpen == true){
		  						if(data.screen.isPageRendered == true){
		  							//alert("wait");
		  							$scope.screenPath = data.screen.screenPath;
		  							jQuery(".page-spinner-bar").removeClass("show");
				 				 	jQuery(".page-spinner-bar").addClass("hide");
				 				 	$scope.canvas1 = new fabric.Canvas('screenCanvas');
				 				 	
			 				 		var img = new Image();
			 				 		img.src = $scope.screenPath;
			 				 		img.onload = function() { 
			 				 			$scope.width = img.naturalWidth;
				 			  			$scope.height = img.naturalHeight;
			 				 			$scope.canvas1.setWidth(img.naturalWidth);
			 				 			$scope.canvas1.setHeight(img.naturalHeight);
			 				 			$scope.canvas1.calcOffset();
			 				 			var image = new fabric.Image(img,{
			 				 				left: 0,    //513,
			 				 				top: 0,     ///2811,
			 				 				width: $scope.width,
			 				 				height: $scope.height
			 				 			});
			 				 			$scope.canvas1.add(image);
			 				 			$scope.canvas1.renderAll()
	 				 				};
		  						}else{
		  							$scope.msg = $translate.instant('PAGE_NOT_RENDERED');
		  						}
		  					}else{
		  						$scope.msg = $translate.instant('PAGE_NOT_OPENED');
		  					}
		  				}
		  			});
		  		}else{			
					$scope.msg = $translate.instant('PAGE_NOT_OPENED');
				}
			}();
	        // initialize core components
	        Metronic.initAjax();
	    });
		$rootScope.settings.layout.pageSidebarClosed = true;
}]);
