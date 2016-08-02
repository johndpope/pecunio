/**
 * Controller : AdBuilderController
 * Purpose : List all Default Ads and User created custom Ads (with Edit Button) and a filter in left toolbar.
 *           User can Edit default Ad to create a new Ad and can Update ad from user's Ad List. 
 * Author : Aradhana <aradhana.rani@netzrezepte.de> 
 */

'use strict';

PecunioApp

.controller('AdBuilderController', 
	['$rootScope',
	 '$scope', 
	 '$http', 
	 '$timeout',
	 '$q',
	 'ProductType', 
	 'CategoryDataModel',
	 'VarianteDataModel',
	 'AdTemplateDataModel',
	 'AdMappingDataModel',
	 'PartnerForms',
	 'UtilityModel',
	 'Device',
	 '$sce',
	 '$state',
	 'LoopBackAuth',
	 '$modal',
	 'CustomAd',
	 function(
	 	$rootScope,
	 	$scope,
	 	$http,
	 	$timeout,
	 	$q,
	 	ProductType, 
		CategoryDataModel,
		VarianteDataModel,
		AdTemplateDataModel,
		AdMappingDataModel,
		PartnerForms,
		UtilityModel,
		Device,
		$sce,
		$state,
		LoopBackAuth,
		$modal,
		CustomAd
	 	){
        
        if(LoopBackAuth.currentUserData === null){
	        	$state.go('login')
	    }

	 	$scope.$on('$viewContentLoaded', function() {  

	 		$scope.matchedAdList = [];
		    $scope.completeMatchedAdList = [];
		    $scope.totalMatchedAdList;
		    $scope.adIdArr = []
		    $scope.userAdList = [];
		    $scope.completeUserAdList = [];
		    $scope.userTotalAd;
		    

		    $scope.selectedAdcategory;
  

		    

		    /**
		     *  Form safe url
		     *  @param  string src
			 *  @return string  
		     */
            $scope.trustSrc = function(src) {
			    return $sce.trustAsResourceUrl(src);
			}
			

			/**
			 * Get pecunio and user ad list  with selected filter if any
			 * @param  boolean withFilter
			 */ 
            function loadAllAdList(withFilter) {

            	var filterData = {"filterData":{}};
		    	var ownFilterData = {};
		    	var loggedUserId = LoopBackAuth.currentUserId;
                $scope.adIdArr = []; // making it blank
                $scope.customAdIdArr = []; //making it blank
                $scope.userAdList = []; //making it blank
		    	

                if(withFilter){
	                if(sessionStorage.getItem('selectedAdtype') != 'undefined' && sessionStorage.getItem('selectedAdtype') != '' && sessionStorage.getItem('selectedAdtype') != null){ 
	                    var selectedAdtype = sessionStorage.getItem('selectedAdtype');
	                	var selectedAdArr = JSON.parse(selectedAdtype);
	                	filterData = {'filterData':{"adId": selectedAdArr.id}};
	                }

	                if(sessionStorage.getItem('selectedadcategory') != 'undefined' && sessionStorage.getItem('selectedadcategory') != '' && sessionStorage.getItem('selectedadcategory') != null){ 
	                    var selectedadcategory = sessionStorage.getItem('selectedadcategory');
	                	var selectedadcategoryArr = JSON.parse(selectedadcategory);
	                	filterData['filterData']["categoryId"] =  selectedadcategoryArr.id;
	                }
	            }

				AdTemplateDataModel.getTemplateList(filterData).$promise.then(function(data) {
	                   		$scope.matchedAdList = data.response;
	                   		$scope.totalMatchedAdList = $scope.matchedAdList.length;
	            		}, function(err) {  
	            });

	            //get custom ads of users

	            AdMappingDataModel.find({ filter: { where: { user_id:  LoopBackAuth.currentUserId, isDeleted : 0 }}}).$promise.then(function(res){
                        res.forEach(function(response) {

                               		if(response.categoryId == 2){
                                   		$scope.adIdArr.push(response.adId);
                            		}
                                   	else{
                                   		$scope.customAdIdArr.push(response.adId);
                                   	}
                        });

                        // making unique array
                        $scope.adIdArr = _.uniq($scope.adIdArr, function(val) { return val; });
                        $scope.customAdIdArr = _.uniq($scope.customAdIdArr, function(val) { return val; });

                        /// preparing filterdata
    				    ownFilterData = {"filterData": { "uIds" :  $scope.adIdArr }};

    				    PartnerForms.getUserAdList(ownFilterData).$promise.then(function(finalresponse){

				    		var tmpUserAdList = finalresponse.response;

				    		// Start filter list with  initial productId and category_id
				    		if( (filterData['filterData']["categoryId"] != undefined && filterData['filterData']["categoryId"] != null)
				    			|| (filterData['filterData']["adId"] != undefined && filterData['filterData']["adId"] != null)){
					    		
					    		
			                  	var filteredList = [];
			                  	var isInitialized = 0;

			                  	// Start category filter
			                  	if(filterData['filterData']["categoryId"] != undefined){

			                  	 	filteredList = _.filter(tmpUserAdList, function(data){ 
		                  	 			return data.categoryId == filterData['filterData']["categoryId"];
			                  	 	});
			                  	 	isInitialized++;
			                  	}
			                  	// End category filter

			                  	// Start sparte filter
			                  	if(filterData['filterData']["adId"] != undefined){

			                  		if(filteredList.length == 0 && isInitialized == 0){
		    		    				filteredList = tmpUserAdList;
		    		    			}

			                  	 	filteredList = _.filter(filteredList, function(data){ 
		                  	 			return data.productId == filterData['filterData']["adId"];
			                  	 	});
			                  	 	isInitialized++;
			                  	}

			                  	if(filteredList.length == 0) {
		    		    			$scope.userAdList = [];
		    		    			$scope.userTotalAd = 0;
		    		    		}
		    	    			else{
		    	    				$scope.userAdList = [];// making blank
		    	    				$scope.userTotalAd = 0;
		    	    				filteredList.forEach(function(eachData){ 
						    			$scope.userAdList.push(eachData);
						    		}); 
		    	    				$scope.userTotalAd = filteredList.length;
		    	    			}

			                }
			                else{ // load complete list

			                	finalresponse.response.forEach(function(eachData){ 
					    			$scope.userAdList.push(eachData); 
					    		});

				    			$scope.userTotalAd = parseInt($scope.userAdList.length);
			                }

				    		// End filter list with  initial productId and category_id
				    		

				    	}, function(err) {  
				    			
				    	});

						/// preparing filterdata
    				    ownFilterData = {"filterData": { "Ids" :  $scope.customAdIdArr }};

    				    CustomAd.getUserAdList(ownFilterData).$promise.then(function(finalresponse){

    				    	var tmpUserAdList = finalresponse.response;

				    		// Start filter list with  initial productId and category_id
				    		if( (filterData['filterData']["categoryId"] != undefined && filterData['filterData']["categoryId"] != null)
				    			|| (filterData['filterData']["adId"] != undefined && filterData['filterData']["adId"] != null)){
					    		
					    		
			                  	var filteredList = [];
			                  	var isInitialized = 0;

			                  	// Start category filter
			                  	if(filterData['filterData']["categoryId"] != undefined){

			                  	 	filteredList = _.filter(tmpUserAdList, function(data){ 
		                  	 			return data.categoryId == filterData['filterData']["categoryId"];
			                  	 	});
			                  	 	isInitialized++;
			                  	}
			                  	// End category filter

			                  	// Start sparte filter
			                  	if(filterData['filterData']["adId"] != undefined){

			                  		if(filteredList.length == 0 && isInitialized == 0){
		    		    				filteredList = tmpUserAdList;
		    		    			}

			                  	 	filteredList = _.filter(filteredList, function(data){ 
		                  	 			return data.productId == filterData['filterData']["adId"];
			                  	 	});
			                  	 	isInitialized++;
			                  	}

			                  	if(filteredList.length == 0) {
		    		    			$scope.userAdList = [];
		    		    			$scope.userTotalAd = 0;
		    		    		}
		    	    			else{
		    	    				$scope.userAdList = [];// making blank
		    	    				$scope.userTotalAd = 0;
		    	    				filteredList.forEach(function(eachData){ 
						    			$scope.userAdList.push(eachData);
						    		}); 
		    	    				$scope.userTotalAd = filteredList.length;
		    	    			}

			                }
			                else{ // load complete list

			                	finalresponse.response.forEach(function(eachData){ 
					    			$scope.userAdList.push(eachData); 
					    		});

				    			$scope.userTotalAd = parseInt($scope.userAdList.length);
			                }

				    		// End filter list with  initial productId and category_id
				    	}, function(err) {  
				    			
				    	});
                }); 	
            }

            /**
			 * Get unmodified pecunio Default ad list without any filter
			 * @return object 
			 */ 
            function getUnmodifiedDefaultAdList() {
            	
            	var filterData = {"filterData":{}};
		    	var ownFilterData = {};
		    	var loggedUserId = LoopBackAuth.currentUserId;
                $scope.adIdArr = []; // making it blank


				return AdTemplateDataModel.getTemplateList(filterData).$promise.then(function(data) {
	                   		// added to preserve the list for filter.
			                   		$scope.completeMatchedAdList  = data.response;
            					    return $scope.completeMatchedAdList;
			            });
            }

            /**
			 * Get unmodified user ad list without any filter
			 * @return object 
			 */ 
            function getUnmodifiedUserAdList() {
            	
            	var filterData = {"filterData":{}};
		    	var ownFilterData = {};
		    	var loggedUserId = LoopBackAuth.currentUserId;
                $scope.adIdArr = []; // making it blank
                $scope.customAdIdArr = []; //making it blank
               	$scope.completeUserAdList = [];

	            //get custom ads of users

	            return $q(function(resolve, reject) {
    						setTimeout(function() {
					            AdMappingDataModel.find({ filter: { where: { user_id:  LoopBackAuth.currentUserId, isDeleted : 0 }}}).$promise.then(function(res){
						                        res.forEach(function(response) {
				                               		if(response.categoryId == 2){
				                                   		$scope.adIdArr.push(response.adId);
				                            		}
				                                   	else{
				                                   		$scope.customAdIdArr.push(response.adId);
				                                   	}
						                        });
						                        // making unique array
						                        $scope.adIdArr = _.uniq($scope.adIdArr, function(val) { return val; });
						                        $scope.customAdIdArr = _.uniq($scope.customAdIdArr, function(val) { return val; });

						                        getPartnerFormsUserAdList($scope.adIdArr, $scope.customAdIdArr).then(function(result){
						                        	result.forEach(function(eachData){ 
										    			$scope.completeUserAdList.push(eachData); 
										    		});
										    		resolve($scope.completeUserAdList);

						                        })
						                       
										    	
						        }); 
						    }, 1000);
  						});	
            }

            /**
			 * Get Ad List from partner_forms 
			 * @param  array adIdArr
			 * @param array customAdIdArr
			 * @return object 
			 */ 
            function getPartnerFormsUserAdList(adIdArr, customAdIdArr){
            	
            	return $q(function(resolve, reject) {
    						setTimeout(function() {	/// preparing filterdata
							    var ownFilterData = {"filterData": { "uIds" :  adIdArr }};
							    var datalist = [];
							    PartnerForms.getUserAdList(ownFilterData).$promise.then(function(finalresponse){

							    		finalresponse.response.forEach(function(eachData){ 
									    	datalist.push(eachData);
									    });

								    	getCustomUserAdList(customAdIdArr).then(function(result){
								    		result.forEach(function(eachData){ 
											    	datalist.push(eachData);
											});
											resolve(datalist);
								    	});
				    					
						    	});
						    }, 1000);
  						});	

            }


            /**
			 * Get Ad List from custom_ad 
			 * @param array customAdIdArr
			 * @return object 
			 */ 
            function getCustomUserAdList(customAdIdArr){
            	
            	return $q(function(resolve, reject) {
    						setTimeout(function() {	/// preparing filterdata
							    /// preparing filterdata
							    var ownFilterData = {"filterData": { "Ids" :  customAdIdArr }};
							    var customDatalist = [];
						    	CustomAd.getUserAdList(ownFilterData).$promise.then(function(response){

								    	customDatalist = response.response;
								    	resolve(customDatalist);
						    	});
						    }, 1000);
  						});	

            }
            



			/**
			 * Get filtered Ad List
			 * @param  object query
			 * @return object 
			 */  
			$scope.filterList = function(query) { 

				jQuery(".page-spinner-bar").removeClass("hide");
				jQuery(".page-spinner-bar").addClass("show");

				if((query.adtype != undefined && query.adtype != null) || 
						(query.variante != undefined && query.variante != null && query.variante != "") || 
						(query.categoryid != undefined && query.categoryid != null && query.categoryid != "")
						|| (query.displaytype)!= undefined && query.displaytype != null && query.displaytype != ""
						|| (query.widthval)!= undefined && query.widthval != null && query.widthval != ""
						|| (query.heightval)!= undefined && query.heightval != null && query.heightval != "") {
		    				
						getUnmodifiedDefaultAdList().then(function(data) {
			                // START For Default Ads
							    
			                  	var completePecunioAdList = $scope.completeMatchedAdList;
			                  	var filteredList = [];
			                  	var isInitialized = 0;
			                  	
			                  	
			                  	// Start category filter
			                  	if(query.categoryid != undefined && query.categoryid != ""){
			                  		
			                  	 	filteredList = _.filter(completePecunioAdList, function(data){ 
			                  	 		
		                  	 			return data.categoryId == query.categoryid;
			                  	 	});
			                  	 	isInitialized++;
			                  	} 
			                  	// End category filter

			                  	// Start sparte filter
			                  	if(query.adtype != undefined){

			                  		if(filteredList.length == 0 && isInitialized == 0){
		    		    				filteredList = completePecunioAdList;
		    		    			}

			                  	 	filteredList = _.filter(filteredList, function(data){ 
		                  	 			return data.productId == query.adtype;
			                  	 	});
			                  	 	isInitialized++;
			                  	}
			                  	// End sparte filter

			                  	// Start variante filter
			                  	if(query.variante != undefined && query.variante != ""){

			                  		var varianteArr = [];
			                  		varianteArr = query.variante.split('-');

			                  		if(filteredList.length == 0 && isInitialized == 0){
		    		    				filteredList = completePecunioAdList;
		    		    			}


			                  	 	filteredList = _.filter(filteredList, function(data){ 
		                  	 			return (data.minWidth <= varianteArr[1] && data.minHeight  <= varianteArr[2]);
			                  	 	});
			                  	 	isInitialized++;
			                  	}
			                  	// End variante filter


			                  	// Start displaytype filter
			                  	if(query.displaytype != undefined && query.displaytype != ""){ 

			                  		if(filteredList.length == 0 && isInitialized == 0){
		    		    				filteredList = completePecunioAdList;
		    		    			}

			                  	 	filteredList = _.filter(filteredList, function(data){ 
			                  	 		var tmpDisplayIdArr = data.devices.split(',');

			                  	 			for(var key in tmpDisplayIdArr) {
										      if (tmpDisplayIdArr[key] == query.displaytype) {
										        return true;
										      }
										    }
			                  	 	});
			                  	 	isInitialized++;
			                  	}
			                  	// End displaytype filter

			                  	// Start widthval filter
			                  	if(query.widthval != undefined && query.widthval > 0 && query.widthval != ""){ 

			                  		if(filteredList.length == 0 && isInitialized == 0){
		    		    				filteredList = completePecunioAdList;
		    		    			}

			                  	 	filteredList = _.filter(filteredList, function(data){ 
			                  	 		return (data.minWidth <= query.widthval);
			                  	 	});
			                  	 	isInitialized++;
			                  	}
			                  	// End widthval filter


			                  	// Start heightval filter
			                  	if(query.heightval != undefined && query.heightval > 0 && query.heightval != ""){ 

			                  		if(filteredList.length == 0 && isInitialized == 0){
		    		    				filteredList = completePecunioAdList;
		    		    			}

			                  	 	filteredList = _.filter(filteredList, function(data){ 
			                  	 		return (data.minHeight <= query.heightval);
			                  	 	});
			                  	 	isInitialized++;
			                  	}
			                  	// End heightval filter


			                  	if(filteredList.length == 0) {
		    		    			$scope.matchedAdList = [];
		    		    			$scope.totalMatchedAdList = 0;
		    		    		}
		    	    			else{
		    	    				$scope.matchedAdList = [];
		    		    			$scope.totalMatchedAdList = 0;
		    		    			filteredList.forEach(function(eachData){ 
						    			$scope.matchedAdList.push(eachData);
						    		});	
		    	    				$scope.totalMatchedAdList = filteredList.length;
		    	    			}
							//END For Default Ads
						});


						getUnmodifiedUserAdList().then(function(data) {

		                  	var completeUserAdList = $scope.completeUserAdList;
		                  	var userfilteredAdList = [];
		                  	var isInitialized = 0;
		                  	
		                  	// Start category filter
		                  	if(query.categoryid != undefined && query.categoryid != ""){  

		                  	 	userfilteredAdList = _.filter(completeUserAdList, function(data){ 
	                  	 			return data.categoryId == query.categoryid;
		                  	 	});
		                  	 	isInitialized++;
		                  	} 
		                  	// End category filter

		                  	// Start sparte filter
		                  	if(query.adtype != undefined){

		                  		if(userfilteredAdList.length == 0 && isInitialized == 0){ 
	    		    				userfilteredAdList = completeUserAdList;
	    		    			}

		                  	 	userfilteredAdList = _.filter(userfilteredAdList, function(data){ 
	                  	 			return data.productId == query.adtype;
		                  	 	});
		                  	 	isInitialized++;
		                  	}
		                  	// End sparte filter

		                  	// Start variante filter
		                  	if(query.variante != undefined && query.variante != ""){

		                  		var varianteArr = [];
		                  		varianteArr = query.variante.split('-');

		                  		if(userfilteredAdList.length == 0 && isInitialized == 0){
	    		    				userfilteredAdList = completeUserAdList;
	    		    			}

		                  	 	userfilteredAdList = _.filter(userfilteredAdList, function(data){ 
	                  	 			return (data.minWidth <= varianteArr[1] && data.minHeight  <= varianteArr[2]);
		                  	 	});
		                  	 	isInitialized++;
		                  	}

		                  	// Start displaytype filter
		                  	if(query.displaytype != undefined && query.displaytype != ""){ 

		                  		if(userfilteredAdList.length == 0 && isInitialized == 0){
	    		    				userfilteredAdList = completeUserAdList;
	    		    			}

		                  	 	userfilteredAdList = _.filter(userfilteredAdList, function(data){ 
		                  	 		var tmpDisplayIdArr = data.displayIds.split(',');

		                  	 			var count = 0;
		                  	 			for(var key in tmpDisplayIdArr) {
									      if (tmpDisplayIdArr[key] == query.displaytype) {
									        count++;
									      }
									    }
									    if(count)
									    	return true;
		                  	 	});
		                  	 	isInitialized++;
		                  	}
			                // End displaytype filter

			                // Start widthval filter
		                  	if(query.widthval != undefined && query.widthval != ""){ 

		                  		if(userfilteredAdList.length == 0 && isInitialized == 0){
	    		    				userfilteredAdList = completeUserAdList;
	    		    			}

		                  	 	userfilteredAdList = _.filter(userfilteredAdList, function(data){ 
		                  	 		return (data.minWidth <= query.widthval);
		                  	 	});
		                  	 	isInitialized++;
		                  	}
		                  	// End widthval filter


		                  	// Start heightval filter
		                  	if(query.heightval != undefined && query.heightval != ""){ 

		                  		if(userfilteredAdList.length == 0 && isInitialized == 0){
	    		    				userfilteredAdList = completeUserAdList;
	    		    			}

		                  	 	userfilteredAdList = _.filter(userfilteredAdList, function(data){ 
		                  	 		return (data.minHeight <= query.heightval);
		                  	 	});
		                  	 	isInitialized++;
		                  	}
		                  	// End heightval filter

		                  	if(userfilteredAdList.length == 0) {
	    		    			$scope.userAdList = [];
	    		    			$scope.userTotalAd = 0;
	    		    		}
	    	    			else{
	    	    				$scope.userAdList = [];
	    	    				$scope.userTotalAd = 0;
	    	    				userfilteredAdList.forEach(function(eachData){ 
						    		$scope.userAdList.push(eachData);
						    	});	
	    	    				$scope.userTotalAd = userfilteredAdList.length;
	    	    			}
		    		    }); 

    		 	} else {
    			  loadAllAdList(false);
    		 	}

    		 	jQuery(".page-spinner-bar").removeClass("show");
            	jQuery(".page-spinner-bar").addClass("hide");

				
			}
			// End Filter 
		    
			/**
			 * Get List of ads
			 */ 
		    $scope.init =  function(){
		    	jQuery(".page-spinner-bar").addClass("show");
		    	jQuery(".page-spinner-bar").removeClass("hide");
		    	
		    	loadAllAdList(true);
		    	jQuery(".page-spinner-bar").removeClass("show");
            	jQuery(".page-spinner-bar").addClass("hide");
            }();

            
            /**
			 * Go to Ad customization page.
			 * @param  object arg
			 * @param  object ftype
			 * @return object 
			 */
	 		$scope.OpenAdCustomizer = function (arg, ftype) {
	 			var baseUrl = '';
	 			if(ftype == 'update'){
	 		  		var url = arg.appUrl;
	 		  		baseUrl = arg.baseUrl;
	 			}
	 			else{
	 				var url = arg.url;
	 			}
	 		    sessionStorage.setItem('selectedAdDetails', JSON.stringify(arg));
	 		    sessionStorage.setItem('type', JSON.stringify(ftype));
	 		  	
       			UtilityModel.createTmpAdFile({'urlObj' : {'url':url, 'baseUrl' :baseUrl}}).$promise.then(function(data) {
	                   		sessionStorage.setItem('adTmpFilename', JSON.stringify(data.uploaded.tmpFileName));
	                   		$state.go('adcustomizer');  
	            		}, function(err) {  
	        	}); 
		        
		    };

	        // initialize core components
	        Metronic.initAjax();
	    });
		$rootScope.settings.layout.pageSidebarClosed = true;
}]);