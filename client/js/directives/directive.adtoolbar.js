PecunioApp


/**
 * Forms a filter tool bar with all attributes of an Ad
 *
 */

.directive('adToolbar', ['ProductType','VarianteDataModel','CategoryDataModel' , 'Device','$timeout', '$rootScope', '$q', 
                           function(ProductType,VarianteDataModel, CategoryDataModel, Device,$timeout, $rootScope, $q) {
    return {
    	restrict: 'E',
        templateUrl: 'views/common/ad-toolbar.html',
         link : function (scope){
        	
        	scope.selectedAdType ;
            scope.selectedAdcategory;

           
            scope.devices;
            
            $rootScope.selectedAdcategoryId; // kept in rootScope bcz scope was getting lost
            $rootScope.selectedDisplayType; // kept in rootScope bcz scope was getting lost
            $rootScope.adHeight; // kept in rootScope bcz scope was getting lost
            $rootScope.adWidth; // kept in rootScope bcz scope was getting lost
            

            

            // Autoselect Produkt dropdown with the value selected in popup 
            scope.init =  function(){
                
                if(sessionStorage.getItem('selectedAdtype') != 'undefined' && sessionStorage.getItem('selectedAdtype') != '' && sessionStorage.getItem('selectedAdtype') != null){
                  var selectedAdtype = sessionStorage.getItem('selectedAdtype');
                  scope.selectedAdType = JSON.parse(selectedAdtype);
                  sessionStorage.removeItem('selectedAdtype');
                }

                if(sessionStorage.getItem('selectedadcategory') != 'undefined' && sessionStorage.getItem('selectedadcategory') != '' && sessionStorage.getItem('selectedadcategory') != null){ 
                  var selectedAdcategory = sessionStorage.getItem('selectedadcategory');
                  scope.selectedAdcategory = JSON.parse(selectedAdcategory);
                  $rootScope.selectedAdcategoryId = scope.selectedAdcategory.id;
                  sessionStorage.removeItem('selectedadcategory');
                }

                // get all filter data
                scope.category = CategoryDataModel.find();
                scope.adtype = ProductType.find();
                scope.variante = VarianteDataModel.find();

                scope.devices = Device.find();
            }();
            // List the available sizes for selected produkt in Grosse dropdown 

        	scope.getSizeValue = function(){ 

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

