/**
 * Directive file for left toolbar on zonebuilder details page
 * with filter criteria to filter available zones
 */

PecunioApp
.directive('leftToolbar', ['ZoneBuilder','ProductType','ZoneType','Device','CategoryDataModel','AdTemplateDataModel', 'VarianteDataModel','$timeout', '$rootScope', 
                           function(ZoneBuilder,ProductType,ZoneType,Device,CategoryDataModel,AdTemplateDataModel, VarianteDataModel,$timeout, $rootScope) {
	
    return {
    	restrict: 'E',
        templateUrl: 'views/common/left-toolbar.html',
        link : function (scope){
        	
        	scope.orgDeviceArr = [];
        	scope.newZone = {};
        	scope.hasSize = false;
            $rootScope.selectedAdcategoryId; 
            $rootScope.selectedDisplayType; 
            $rootScope.adHeight; 
            $rootScope.adWidth; 
            /**
             * Function to fetch available product type.
             * @return {array} [List of product type]
             */
        	scope.getProductType = function(){
        		scope.ptype = ProductType.find();   
        		if(scope.ptype.length > 0){
        			scope.hasProductSize = true;
        		}
        		
        	}();
        	/**
             * Function to fetch available device type.
             * @return {array} [List of device type]
             */
        	scope.getDeviceType = function(){
        		scope.devicetype = scope.orgDeviceArr = Device.find();   
        		if(scope.devicetype.length > 0){
        			scope.hasDeviceSize = true;
        		}
        		
        	}();
        	/**
             * Function to fetch available category type.
             * @return {array} [List of category type]
             */
        	scope.getCategoryType = function(){
        		scope.categorytype = scope.orgCategoryArr = CategoryDataModel.find();   
        		if(scope.categorytype.length > 0){
        			scope.hasCategorySize = true;
        		}
        		
        	}();
        	/**
             * Function to fetch available sizes for selected product type.
             * @return {array} [List of zones]
             */
        	scope.getSize = function(){   
        		
        		var pid = scope.selectedType.id;
        		scope.zoneCategory.length = 0;
        		scope.sizes = [];
        		scope.newZone['proId'] = scope.selectedType.id;
        		
        		var filter = {'filter':{'where':{'productId':scope.selectedType.id}}};
        		function checkDevice(devId){
					var arr ;
					for(eachDev in scope.devicetype){
						if(scope.devicetype[eachDev].id == devId){
							arr = scope.devicetype[eachDev];
						}
					}
					return arr;
				}
        		
        		function checkCategory(devId){
					var arr ;
					for(eachCat in scope.categorytype){
						if(scope.categorytype[eachCat].id == devId){
							arr = scope.categorytype[eachCat];
						}
					}
					return arr;
				}
        		AdTemplateDataModel.getZnType(filter)
   		    	.$promise
   		    	.then(function(data){
   		    		if(data){
   		    			var str = JSON.stringify(data.zonetypes);
   		    			var arrZontypes = JSON.parse(str);
   		    			for(var i=0;i<arrZontypes.length;i++){
            				var obj = {};
            				var objCat = {};
            				obj['zoneTypeId'] = arrZontypes[i].id;    
            				obj['zoneName'] = arrZontypes[i].name;
            				obj['hw'] = arrZontypes[i].minWidth+"X"+arrZontypes[i].minHeight;
            				obj['category'] = arrZontypes[i].categoryId; 
            				obj['device'] = arrZontypes[i].devices; 
            				
            				var dvcArr = arrZontypes[i].devices.split(","); 
            				var catArr = arrZontypes[i].categoryId.split(","); 
            				var newDevice = [];
            				var newcategory = [];
            				scope.devicetype = scope.orgDeviceArr;
            				scope.categorytype = scope.orgCategoryArr;
            				for (var i=0;i< dvcArr.length; i++){
            					var devId = dvcArr[i];
            					newDevice.push(checkDevice(devId));
            					
            				}
            				scope.devicetype = newDevice;
            				
            				for (var i=0;i< catArr.length; i++){
            					var catId = catArr[i];
            					newcategory.push(checkCategory(catId));
            					
            				}
            				scope.categorytype = newcategory;
            				scope.sizes.push(obj);
            			}
   		    			
   		    			scope.znTypes = data.zonetypes; 
   		    		}
   		    		
   		    	});
        		
        	}
        	/**
             * Function to fetch size value of selected size
             * @return {array} [List of zones]
             */
        	scope.getSizeValue = function(){
        		var zid = scope.selectedSize.zoneTypeId;
        		var device = scope.selectedSize.device;
        		var devArr = device.split(',');
        		scope.deviceArr.length = 0;  
        		if(devArr[0] == 1){
        			var obj = {'device':'desktop','deviceTitle':'Desktop','width':1920 ,'height':1080};
        			scope.deviceArr.push(obj);
        		}
        		if(devArr[1] == 1){
        			var obj1 = {'device':'tablet','deviceTitle':'Tablet','width':1024 ,'height':768};
        			scope.deviceArr.push(obj1);
        		}
        		if(devArr[2] == 1){
        			var obj2 = {'device':'smartphone','deviceTitle':'Smartphone','width':420 ,'height':360};
        			scope.deviceArr.push(obj2);
        		}
        		var hwArr = scope.selectedSize.hw.split('X');
        		var obj = {};
        		var arr = [];
        		scope.hght = hwArr[1];
        		scope.width = hwArr[0];
        		obj['category'] = scope.selectedSize.category;
        		obj['categoryTitle'] = scope.selectedSize.categoryTitle;
        		scope.zoneCategory.length = 0;
        		scope.zoneCategory.push(obj);
        		arr.push(scope.zoneArr[zid]);
        		scope.znTypes = arr;
        		
        	}
            /*
            * Start Zone Filter 
            */

            // get all filter data
            scope.category = CategoryDataModel.find();
            scope.adtype = ProductType.find();
            scope.variante = VarianteDataModel.find();
            scope.devices = Device.find();
            // List the available sizes for selected produkt in Grosse dropdown 
            scope.getVariantes = function(){ 
                var selVarianteArr = [];
                selVarianteArr =  scope.selectedvariante.split('-');
                if(selVarianteArr[0] != ''){ 
                  VarianteDataModel.findById({ id: selVarianteArr[0] } ).$promise.then(function(data){
                      $rootScope.adHeight = data.height;
                      $rootScope.adWidth = data.width;
                  }); 
                }
                else{
                     $rootScope.adHeight = '';
                     $rootScope.adWidth = '';
                }
            }
        	
        }
        
    };
}]);
PecunioApp

.directive('getCategory', function($rootScope){
    return{
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attr, ngModelCtrl){ 
         
            element.on('click', function(){
                $rootScope.selectedAdcategoryId = parseInt($(element).attr('category-value'));
                $('.category-cls').removeClass('active');
                $(element).addClass('active');
            });
      }
    }
});

PecunioApp
.directive('getDisplaytype', function($rootScope){
    return{
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attr, ngModelCtrl){ 
         
            element.on('click', function(){
                $rootScope.selectedDisplayType = $(element).attr('display-type-value');
                $('.display-typ-cls').removeClass('fa-item');
                $(element).addClass('fa-item');
            });
      }
    }
});



PecunioApp.directive('ionsliderHeight', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ngModel) {
            
            var maxval = $(element).attr('maxrange');
            var minval = $(element).attr('minrange');  
            $(element).ionRangeSlider({
                min: minval,
                max: maxval,
                type: 'single',
                from: maxval,
                step: 1,
                postfix: "px",
                prettify: true,
                hasGrid: false,
                onFinish: function (data) {
                    $rootScope.adHeight = data.fromNumber;
                    $('#variantedd').val(''); 
                    $('#variantedd').blur();
                    $(element).trigger('click');
                }
            });
        }
    };
});


PecunioApp.directive('ionsliderWidth', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ngModel) {
            
            var maxval = $(element).attr('maxrange');
            var minval = $(element).attr('minrange');
            
            $(element).ionRangeSlider({
                min: minval,
                max: maxval,
                type: 'single',
                from: maxval,
                step: 1,
                postfix: "px",
                prettify: true,
                hasGrid: false,
                onFinish: function (data) {
                     $rootScope.adWidth = data.fromNumber;
                     $('#variantedd').val('');
                     $('#variantedd').blur();
                     $(element).trigger('click');
                }
            });
        }
    };
});

