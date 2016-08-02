/**
 * Controller : AdcustomizerController
 * Purpose : Provide users a tool to customize and design Ad.
 *		 	 Save and update data to partner_forms if ad is of "form" type else to customAd table for multiple domains.
 *			 Shows a list of user Ads.
 * Author : Aradhana <aradhana.rani@netzrezepte.de> 
 */

'use strict';


PecunioApp

.controller('AdcustomizerController', 
	['$rootScope',
	 '$scope', 
	 '$http', 
	 '$timeout',
	 '$q',
	 'ProductType', 
	 'CategoryDataModel',
	 'VarianteDataModel',
	 'AdTemplateDataModel',
	 'PartnerForms',
	 '$sce',
	 'UtilityModel',
	 'AdvModel',
	 '$state',
	 'LoopBackAuth',
	 'AdMappingDataModel',
	 'pecunioDateService',
	 '$window',
	 'publisherDomainList',
	 '$translate',
	 'multiMsgAlertService',
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
		PartnerForms,
		$sce,
		UtilityModel,
		AdvModel,
		$state,
		LoopBackAuth,
		AdMappingDataModel,
		pecunioDateService,
		$window,
		publisherDomainList,
		$translate,
		multiMsgAlertService,
		CustomAd
	 	){

	 	if(LoopBackAuth.currentUserData === null){
	        $state.go('login')
	    }
	    
	 	$scope.demo = "text";
	 	$scope.$on('$viewContentLoaded', function() {    

		    $scope.selectedAdDetailsArr = {};
		    $scope.ftype;
		    var selectedAdDetails;
		    var selectedAdDetailsArr;
		    var url ;
		    var type;

		    $scope.adMainColor = '#218cc4';
            $scope.adTextColor = '#707070';
            $scope.adBgColor = '#f8f8f8';
            $scope.adBorderColor = "#cccccc";
            $scope.adButtonColor = '#ffffff';
            $scope.adButtonbgColor = '#e76043';
            $scope.selectedSchemaType = 'gradient'; 

            $scope.adtypedd =  ProductType.find();
            $scope.adcategorydd = CategoryDataModel.find();
            $scope.userAdList = [];
            $scope.completeUserAdList = [];
            $scope.userTotalAd = 0;
            $scope.tmpFileName;
            $scope.variante;

		    $scope.name;
		    $scope.changeAttr ={};
		    $scope.customAttr = {};

		    $scope.adIdArr = [];
		    $scope.customAdIdArr = []
		    $scope.showDeleteButton = false;
		    $scope.currentSavedAdInfo = {};
		    $scope.trustedUrl = '';

		    $scope.publisherDomaindd;
		    $scope.multiSelectedVal = {"selectedval":""};
		    $scope.disableButton = false;


		    /**
		     * Start added warning dialog to prevent preview loss on page refresh
		     */
		    if($state.current.data.pagetype == 'adcustomizer'){
		    	window.onbeforeunload = function (event) {
				  var message = 'Sure you want to leave?';
				  if (typeof event == 'undefined') {
				    event = window.event;
				  }
				  if (event) {
				    event.returnValue = message;
				  }
				  return message;
				}

		    }
			// End added warning dialog to prevent preview loss on page refresh

			/**
		     *  code to redirect to adBuilder page
		     */
		    $scope.goBackToAdbuilder = function(){
		    	sessionStorage.setItem('selectedAdtype', '');
      			sessionStorage.setItem('selectedadcategory', '');
		    	$state.go('adbuilder');
		    }

		   
		    /**
		     * Getting all ads created  by logged user : from partner_banner and customAd
		     */
		    function getUserAdList(){ 
		    	jQuery(".page-spinner-bar").addClass("show");
            	jQuery(".page-spinner-bar").removeClass("hide");


		    	// get logged user created AdList.
                var loggedUserId = LoopBackAuth.currentUserId;
                var filterData = {};
                $scope.adIdArr = []; // making it blank
                $scope.customAdIdArr = []; // making it blank
                $scope.userAdList = []; // making it blank
            	$scope.completeUserAdList = []; // making it blank

                // get all ad_ids of logged users. 
            	 return $q(function(resolve, reject) {
    						setTimeout(function() {
		            			AdMappingDataModel.find({ filter: { where: { user_id:  LoopBackAuth.currentUserId, isDeleted : 0 } }}).$promise.then(function(res){
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
		                				    filterData = {"filterData": { "uIds" :  $scope.adIdArr }};

		                				    PartnerForms.getUserAdList(filterData).$promise.then(function(finalresponse){

		                				    		finalresponse.response.forEach(function(eachData){ 
										    			$scope.userAdList.push(eachData); 
										    			$scope.completeUserAdList.push(eachData);
										    		});

									    			$scope.userTotalAd = parseInt($scope.userAdList.length);
									    			jQuery(".page-spinner-bar").removeClass("show");
            					    				jQuery(".page-spinner-bar").addClass("hide");

									    	}, function(err) {  
									    		
									    	});

									    	/// preparing filterdata
		                				    filterData = {"filterData": { "Ids" :  $scope.customAdIdArr }};

		                				    CustomAd.getUserAdList(filterData).$promise.then(function(finalresponse){
									    			
									    			finalresponse.response.forEach(function(eachData){ 
										    			$scope.userAdList.push(eachData); 
										    			$scope.completeUserAdList.push(eachData);
										    		});
									    			$scope.userTotalAd = parseInt($scope.userAdList.length);
									    			jQuery(".page-spinner-bar").removeClass("show");
            					    				jQuery(".page-spinner-bar").addClass("hide");

									    	}, function(err) {  
									    			
									    	}); 

				                },function(err) {  
						    				
						    	});
				     	 }, 2000);
  				});	
            }



            /**
		     * Get unmodified ad list
		     */
            function reloadUserAdList() {
            	jQuery(".page-spinner-bar").addClass("show");
            	jQuery(".page-spinner-bar").removeClass("hide");
            
	            var loggedUserId = LoopBackAuth.currentUserId;
                var filterData = {};
                var finalresponseArr = [];

	            // get all ad_ids of logged users. 
            	return AdMappingDataModel.find({ filter: { where: { user_id:  LoopBackAuth.currentUserId, isDeleted : 0 }}}).$promise.then(function(res){
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
							filterData = {"filterData": { "uIds" :  $scope.adIdArr }};

							PartnerForms.getUserAdList(filterData).$promise.then(function(finalresponse){
								jQuery(".page-spinner-bar").removeClass("show");
            					jQuery(".page-spinner-bar").addClass("hide");
								
								finalresponse.response.forEach(function(eachData){ 
					    			finalresponseArr.push(eachData);
					    		});	
							});

							/// preparing filterdata
        				    filterData = {"filterData": { "Ids" :  $scope.customAdIdArr }};

        				    CustomAd.getUserAdList(filterData).$promise.then(function(finalresponse){
					    		jQuery(".page-spinner-bar").removeClass("show");
            					jQuery(".page-spinner-bar").addClass("hide");
								finalresponse.response.forEach(function(eachData){ 
					    			finalresponseArr.push(eachData);
					    		});	
					    	});
        				    return 	finalresponseArr;
		                },function(err) {  
				    		
				    	}); 	
	        }


            /**
			 * Get filtered Ad List
			 * @param  object query
			 * @return object 
			 */  
		    $scope.filterMultipleAdList = function(query) {
	    		if((query.categoryid != undefined && query.categoryid != null) || 
	               ((query.variante != undefined && query.variante != null &&  query.variante != "")) || 
	               (query.productId != undefined && query.productId != null) || 
	               (query.daterange != undefined && query.daterange != null)) {
	    				
		                reloadUserAdList().then(function(data) {

		                  	 var completeAdList = $scope.completeUserAdList;
		                  	 var filteredList = [];
		                  	 var isInitialized = 0;

		                  	
		                  	// Start category filter
		                  	if(query.categoryid != undefined){

		                  	 	filteredList = _.filter(completeAdList, function(data){ 

	                  	 			return data.categoryId == query.categoryid.id;
		                  	 	});
		                  	 	isInitialized++;
		                  	}
		                  	// End category filter

		                  	// Start sparte filter
		                  	if(query.productId != undefined){

		                  		if(filteredList.length == 0 && isInitialized == 0){
	    		    				filteredList = completeAdList;
	    		    			}

		                  	 	filteredList = _.filter(filteredList, function(data){ 
	                  	 			return data.productId == query.productId.id;
		                  	 	});
		                  	 	isInitialized++;
		                  	}
		                  	// End sparte filter


		                  	// Start variante filter
		                  	if(query.variante != undefined && query.variante != ""){

		                  		var varianteArr = [];
		                  		varianteArr = query.variante.split('-');

		                  		if(filteredList.length == 0 && isInitialized == 0){
	    		    				filteredList = completeAdList;
	    		    			}


		                  	 	filteredList = _.filter(filteredList, function(data){ 
	                  	 			return (data.minWidth <= varianteArr[1] && data.minHeight  <= varianteArr[2]);
		                  	 	});
		                  	 	isInitialized++;
		                  	}
			                // End variante filter

		                  	// Start Date filter
		                  	if(query.daterange != undefined){

		                  		if(filteredList.length == 0 && isInitialized == 0){
	    		    				filteredList = completeAdList;
	    		    			}

		                  	 	filteredList = _.filter(filteredList, function(data){ 
		                  	 		var tmpDate = moment(data.createdAt).format('DD-MM-YYYY');
	                  	 			return tmpDate == query.daterange;
		                  	 	});
		                  	 	isInitialized++;
		                  	}
		                  	// End Date filter



		                  	if(filteredList.length == 0) {
	    		    			$scope.userAdList = [];
	    		    			$scope.userTotalAd = 0;
	    		    		}
	    	    			else{

	    	    				$scope.userAdList = []; // making blank
	    	    				$scope.userTotalAd = 0 ;
	    	    				filteredList.forEach(function(eachData){ 
					    			$scope.userAdList.push(eachData);
					    		});	
	    	    				$scope.userTotalAd = filteredList.length;
	    	    			}
		    		    }); 
	    		  } else {
	    		  	  $scope.userAdList = []; // making blank
	    			  getUserAdList();
	    		  }
	    	};



		    /**
		     *  Form safe url
		     *  @param  string src
			 *  @return string  
		     */
            $scope.trustSrc = function(src) {
            	$scope.trustedUrl = $sce.trustAsResourceUrl(src);
			    return $scope.trustedUrl;
			}


			/**
		     *  Load ad with data saved in Db for update purpose 
		     *  @param  array tmpSelectedAdDetailsArr
		     */
	 		function getEditAdData(tmpSelectedAdDetailsArr){

	 			if(tmpSelectedAdDetailsArr.categoryId == 2){
                	var idArr = [];

                	idArr.push(tmpSelectedAdDetailsArr.adDetails.uid);
                	var filterData = {"filterData": { "uIds" :  idArr }};
                	PartnerForms.getUserAdList(filterData).$promise.then(function(finalresponse){
                		$scope.selectedAdDetailsArr = finalresponse.response[0];
		                
		                if($scope.ftype == 'update'){
		                	publisherDomainList.getDropDownList(LoopBackAuth.currentUserId).then(function(data) {
		                		var domainArr = $scope.selectedAdDetailsArr.domainId.split(",");
		                		var domainList = '<select  class="form-control select2 select2-offscreen input-medium input-md" ng-model="multiSelectedVal.selectedval" multiple="multiple"  multiselect>';
		                		data.forEach(function(eachData){
		                			
		                			if((_.contains(domainArr, (eachData.id).toString()))){
					    				domainList += '<option value="'+eachData.id+'" selected="selected">'+eachData.domainName+'</option>';
					    			}
					    			else{
					    				domainList += '<option value="'+eachData.id+'" >'+eachData.domainName+'</option>';
					    			}
					    		});	
			                	$scope.publisherDomaindd = domainList+'</select>';

			                	var selectedDomainArr = [];
			                	domainArr.forEach(function(val){
			                		selectedDomainArr.push(val.toString()) ;
			                	});
			                	$scope.multiSelectedVal.selectedval = selectedDomainArr;
			                });	
		                }
		                // getting filename to render iframe.
                	});
                }
                else{
	            	var idArr = [];
	            	idArr.push(tmpSelectedAdDetailsArr.adDetails.id);

	            	var filterData = {"filterData": { "Ids" :  idArr }};
	            	CustomAd.getUserAdList(filterData).$promise.then(function(finalresponse){
	            	 	$scope.selectedAdDetailsArr = finalresponse.response[0];

		                type = sessionStorage.getItem('type');
		                $scope.ftype = JSON.parse(type);

		                if($scope.ftype == 'update'){
		                	publisherDomainList.getDropDownList(LoopBackAuth.currentUserId).then(function(data) {
		                		var domainArr = $scope.selectedAdDetailsArr.domainId.split(",");
		                		var domainList = '<select  class="form-control select2 select2-offscreen input-medium input-md" ng-model="multiSelectedVal.selectedval" multiple="multiple"  multiselect>';
		                		data.forEach(function(eachData){
		                			
		                			if((_.contains(domainArr, (eachData.id).toString()))){
					    				//domainList.push({'id':eachData.id,'domainName': eachData.domainName,'reviveAdvId':eachData.reviveAdvId, 'selected': true});
					    				domainList += '<option value="'+eachData.id+'" selected="selected">'+eachData.domainName+'</option>';
					    			}
					    			else{
					    				domainList += '<option value="'+eachData.id+'" >'+eachData.domainName+'</option>';
					    			}
					    		});	
			                	$scope.publisherDomaindd = domainList+'</select>';

			                	var selectedDomainArr = [];
			                	domainArr.forEach(function(val){
			                		selectedDomainArr.push(val.toString()) ;
			                	});
			                	$scope.multiSelectedVal.selectedval = selectedDomainArr;
			                	
			                });	
		                }
		                // getting filename to render iframe.
	            	});
                }
	 		}

	 		/**
			 * Get List of ads
			 * Load the specific Ad in preview window and load the design tool accordingly.
			 */ 
		    $scope.init =  function(){

		    		selectedAdDetails = sessionStorage.getItem('selectedAdDetails');
	                var tmpSelectedAdDetailsArr = JSON.parse(selectedAdDetails);
	                type = sessionStorage.getItem('type');
			        $scope.ftype = JSON.parse(type);

			        $scope.adCategoryID = tmpSelectedAdDetailsArr.categoryId;


			        if($scope.ftype == 'update'){ // update advertisement part
		               $scope.showDeleteButton = true;

			 			if(tmpSelectedAdDetailsArr.categoryId == 2){
		                	var idArr = [];

		                	idArr.push(tmpSelectedAdDetailsArr.adDetails.uid);
		                	var filterData = {"filterData": { "uIds" :  idArr }};
		                	PartnerForms.getUserAdList(filterData).$promise.then(function(finalresponse){
		                		$scope.selectedAdDetailsArr = finalresponse.response[0];
		                		$scope.currentSavedAdInfo = { "adId" : $scope.selectedAdDetailsArr.adDetails.uid, "categoryId" : $scope.selectedAdDetailsArr.categoryId, "tablename" : "partner_forms"} ;
				                
				                if($scope.ftype == 'update'){
				                	publisherDomainList.getDropDownList(LoopBackAuth.currentUserId).then(function(data) {
				                		var domainArr = $scope.selectedAdDetailsArr.domainId.split(",");
				                		var domainList = '<select  class="form-control select2 select2-offscreen input-medium input-md" ng-model="multiSelectedVal.selectedval" multiple="multiple"  multiselect>';
				                		data.forEach(function(eachData){
				                			
				                			if((_.contains(domainArr, (eachData.id).toString()))){
							    				domainList += '<option value="'+eachData.id+'" selected="selected">'+eachData.domainName+'</option>';
							    			}
							    			else{
							    				domainList += '<option value="'+eachData.id+'" >'+eachData.domainName+'</option>';
							    			}
							    		});	
					                	$scope.publisherDomaindd = domainList+'</select>';

					                	var selectedDomainArr = [];
					                	domainArr.forEach(function(val){
					                		selectedDomainArr.push(val.toString()) ;
					                	});
					                	$scope.multiSelectedVal.selectedval = selectedDomainArr;
					                	
					                });	
				                }
				                // getting filename to render iframe.
				                $scope.tmpFileName = "../../tmp/tmp_ads/" +JSON.parse(sessionStorage.getItem('adTmpFilename'));
				                $scope.variante = VarianteDataModel.find();

				                getUserAdList();
		                	});
		                }
		                else{
			            	var idArr = [];
			            	idArr.push(tmpSelectedAdDetailsArr.adDetails.id);

			            	var filterData = {"filterData": { "Ids" :  idArr }};
			            	CustomAd.getUserAdList(filterData).$promise.then(function(finalresponse){
			            	 	$scope.selectedAdDetailsArr = finalresponse.response[0];
			            	 	$scope.currentSavedAdInfo = { "adId" : $scope.selectedAdDetailsArr.adDetails.id, "categoryId" : $scope.selectedAdDetailsArr.categoryId, "tablename" : "CustomAd"};

				                type = sessionStorage.getItem('type');
				                $scope.ftype = JSON.parse(type);

				                if($scope.ftype == 'update'){
				                	publisherDomainList.getDropDownList(LoopBackAuth.currentUserId).then(function(data) {
				                		var domainArr = $scope.selectedAdDetailsArr.domainId.split(",");
				                		var domainList = '<select  class="form-control select2 select2-offscreen input-medium input-md" ng-model="multiSelectedVal.selectedval" multiple="multiple"  multiselect>';
				                		data.forEach(function(eachData){
				                			
				                			if((_.contains(domainArr, (eachData.id).toString()))){
							    				//domainList.push({'id':eachData.id,'domainName': eachData.domainName,'reviveAdvId':eachData.reviveAdvId, 'selected': true});
							    				domainList += '<option value="'+eachData.id+'" selected="selected">'+eachData.domainName+'</option>';
							    			}
							    			else{
							    				domainList += '<option value="'+eachData.id+'" >'+eachData.domainName+'</option>';
							    			}
							    		});	
					                	$scope.publisherDomaindd = domainList+'</select>';

					                	var selectedDomainArr = [];
					                	domainArr.forEach(function(val){
					                		selectedDomainArr.push(val.toString()) ;
					                	});
					                	$scope.multiSelectedVal.selectedval = selectedDomainArr;
					                	
					                });	
				                }
				                // getting filename to render iframe.
				                $scope.tmpFileName = "../../tmp/tmp_ads/" +JSON.parse(sessionStorage.getItem('adTmpFilename'));
				                $scope.variante = VarianteDataModel.find();

				                getUserAdList();
			            	});
		                }
		            }
	                else{ // add Advertisement part
	                	$scope.selectedAdDetailsArr = tmpSelectedAdDetailsArr;
	                	$scope.multiSelectedVal = {"selectedval":""};
	                	publisherDomainList.getDropDownList(LoopBackAuth.currentUserId).then(function(data) {
		                	$scope.publisherDomaindd = data;

	                		var domainList = '<select  class="form-control select2 select2-offscreen input-medium input-md" ng-model="multiSelectedVal.selectedval" multiple="multiple"  multiselect>';
	                		data.forEach(function(eachData){
				    			domainList += '<option value="'+eachData.id+'" >'+eachData.domainName+'</option>';
				    		});	
		                	$scope.publisherDomaindd = domainList+'</select>';

		                });
	                }

	                ////getting filename to render iframe.  
	                $scope.tmpFileName = "../../tmp/tmp_ads/" +JSON.parse(sessionStorage.getItem('adTmpFilename'));
	                $scope.variante = VarianteDataModel.find();
	                getUserAdList();
            }();


            /**
			 * Validate ad data if error shows the errors else calls save/update methods
			 */ 

            $scope.validateAdData = function(){
            	var errCount = 0;
            	var errorMessageArr = [];
            	$scope.disableButton = true;

            	if($scope.selectedAdDetailsArr.categoryId != 2){
	            	// check name, domain
	            	if($scope.customAttr.dynamicElement.ad_name == '' || $scope.customAttr.dynamicElement.ad_name === null){
	            		errorMessageArr.push($translate.instant('ERR_BLANK_NAME'));
	            		errCount++;
	            	}	

	            	if($scope.multiSelectedVal.selectedval == '' || $scope.multiSelectedVal.selectedval === null){
	            		errorMessageArr.push($translate.instant('ERR_BLANK_DOMAIN'));
	            		errCount++;
	            	}

	            	if(errCount >  0){
	            		var message = errorMessageArr.join("\n");
	            		multiMsgAlertService.showAlert(errorMessageArr, 'danger');
	            		$scope.disableButton = false;
	            	}
	            	else{
	            		if($scope.ftype == 'update')
	            			updateAdData();
	            		else
	            			saveAdData();
	            	}	
	            }
	           else{
	            	// check name, domain
	            	if($scope.changeAttr.ad_name == '' || $scope.changeAttr.ad_name === null){
	            		errorMessageArr.push($translate.instant('ERR_BLANK_NAME'));
	            		errCount++;
	            	}	

	            	if($scope.multiSelectedVal.selectedval == '' || $scope.multiSelectedVal.selectedval === null){
	            		errorMessageArr.push($translate.instant('ERR_BLANK_DOMAIN'));
	            		errCount++;
	            	}

	            	if(errCount >  0){
	            		var message = errorMessageArr.join("\n");
	            		multiMsgAlertService.showAlert(errorMessageArr, 'danger');
	            		$scope.disableButton = false;
	            	}
	            	else{

	            		if($scope.ftype == 'update'){
	            			updateAdData();
	            		}
	            		else
	            			saveAdData();
	            	}
	            }
            	
            }
		    
		    /**
			 *  Saving Ad  details to partner_forms if category == 2 else customAd
			 */ 
		    function saveAdData (){ 
		    	jQuery(".page-spinner-bar").addClass("show");

		    	if($scope.selectedAdDetailsArr.categoryId == 2){ // save in partner_forms

			    	var addata = { "affiliate_partner_uid": parseInt(LoopBackAuth.currentUserId),
				    				"affiliate_type_uid": 1,
				    				"branch": $scope.changeAttr.ad_name,
				    				"adMainColor": $scope.changeAttr.adMainColor,
				    				"adTextColor": $scope.changeAttr.adTextColor,
				    				"adBgColor": $scope.changeAttr.adBgColor,
				    				"adBorderColor": $scope.changeAttr.adBorderColor,
				    				"adButtonColor": $scope.changeAttr.adButtonColor,
				    				"adButtonbgColor": $scope.changeAttr.adButtonbgColor,
				    				"selectedSchemaType": $scope.changeAttr.selectedSchemaType,
				    				"tablename" : "partner_forms",
				    				"productId" : $scope.selectedAdDetailsArr.productId,
				    				"templateId" : $scope.selectedAdDetailsArr.id,
				    				"categoryId" : $scope.selectedAdDetailsArr.categoryId,
				    				"domainArr": $scope.multiSelectedVal.selectedval,
				    				"baseUrl": $scope.selectedAdDetailsArr.url
				    			  }

			    	AdvModel.saveAdv(addata).$promise.then(function(res){
			    		if(res.status[0].isInserted == true){
			    			$scope.showDeleteButton = true;
			    			$scope.ftype = 'update';

			    			//Enable update functionality after add 
			    			sessionStorage.setItem('type', JSON.stringify($scope.ftype));
			    			var idArr = [];
		                	idArr.push(res.status[0].adId);
		                	var filterData = {"filterData": { "uIds" :  idArr }};
		                	PartnerForms.getUserAdList(filterData).$promise.then(function(finalresponse){
		                		sessionStorage.setItem('selectedAdDetails', JSON.stringify(finalresponse.response[0]));


		                		selectedAdDetails = sessionStorage.getItem('selectedAdDetails');
				                var tmpSelectedAdDetailsArr = JSON.parse(selectedAdDetails);
				                tmpSelectedAdDetailsArr['adDetails']['uid'] = res.status[0].adId;
				    			getEditAdData(tmpSelectedAdDetailsArr);
		                	});
		                	//Enable update functionality after add 

			    			$scope.currentSavedAdInfo = { "adId" : res.status[0].adId, "categoryId" : res.status[0].categoryId, "tablename" : "partner_forms"} ;
			    		}

			    		getUserAdList();
			    		$scope.disableButton = false;
			    		jQuery(".page-spinner-bar").removeClass("show");
            		    jQuery(".page-spinner-bar").addClass("hide");		
			    	}); 
				}
				else{ // save in CustomAd table
					var adJsonContent = "";
					var adHtmlContent = "";

					var addata = {  "name": $scope.customAttr.dynamicElement.ad_name,
									"userId": parseInt(LoopBackAuth.currentUserId),
				    				"adJsonContent": $scope.customAttr.jsonAdContent,
				    				"baseTemplateId": $scope.selectedAdDetailsArr.id,
				    				"url": $scope.selectedAdDetailsArr.url,
				    				"categoryId": $scope.selectedAdDetailsArr.categoryId,
				    				"productId": $scope.selectedAdDetailsArr.productId,
				    				"tablename" : "CustomAd",
			    					"domainArr": $scope.multiSelectedVal.selectedval,
			    					"baseUrl": $scope.selectedAdDetailsArr.url
				    			}

				    AdvModel.saveAdv(addata).$promise.then(function(res){
			    		if(res.status[0].isInserted == true){
			    			$scope.showDeleteButton = true;
			    			
			    			$scope.ftype = 'update';

				    		//Enable update functionality after add 
			    			sessionStorage.setItem('type', JSON.stringify($scope.ftype));
			    			var idArr = [];
		                	idArr.push(res.status[0].adId);
		                	var filterData = {"filterData": { "Ids" :  idArr }};
			            	CustomAd.getUserAdList(filterData).$promise.then(function(finalresponse){
		                		sessionStorage.setItem('selectedAdDetails', JSON.stringify(finalresponse.response[0]));
		                		selectedAdDetails = sessionStorage.getItem('selectedAdDetails');
				                var tmpSelectedAdDetailsArr = JSON.parse(selectedAdDetails);
				                tmpSelectedAdDetailsArr['adDetails']['uid'] = res.status[0].adId;
				    			getEditAdData(tmpSelectedAdDetailsArr);
		                	});
		                	//Enable update functionality after add 

			    			$scope.currentSavedAdInfo = { "adId" : res.status[0].adId, "categoryId" : res.status[0].categoryId, "tablename" : "CustomAd"} ;
			    		}

			    		getUserAdList();
			    		$scope.disableButton = false;
			    		jQuery(".page-spinner-bar").removeClass("show");
            		    jQuery(".page-spinner-bar").addClass("hide");		
			    	}); 

					jQuery(".page-spinner-bar").removeClass("show");
            		jQuery(".page-spinner-bar").addClass("hide");	
				}		

            };

            /**
			 *  Update Ad  details to partner_forms if category == 2 else customAd
			 */ 
            function updateAdData (){ // saving Ad  details
		    	jQuery(".page-spinner-bar").addClass("show");

		    	if($scope.selectedAdDetailsArr.categoryId == 2){ // save in partner_forms

			    	var addata = {  "branch": $scope.changeAttr.ad_name,
				    				"adMainColor": $scope.changeAttr.adMainColor,
				    				"adTextColor": $scope.changeAttr.adTextColor,
				    				"adBgColor": $scope.changeAttr.adBgColor,
				    				"adBorderColor": $scope.changeAttr.adBorderColor,
				    				"adButtonColor": $scope.changeAttr.adButtonColor,
				    				"adButtonbgColor": $scope.changeAttr.adButtonbgColor,
				    				"selectedSchemaType": $scope.changeAttr.selectedSchemaType,
				    				"tablename" : "partner_forms",
				    				"productId" : $scope.selectedAdDetailsArr.productId,
				    				"id" : $scope.selectedAdDetailsArr.adDetails.uid,
				    				"templateId" : $scope.selectedAdDetailsArr.appId,
				    				"categoryId" : $scope.selectedAdDetailsArr.categoryId,
				    				"domainArr": $scope.multiSelectedVal.selectedval,
				    				"url": $scope.selectedAdDetailsArr.appUrl,
				    				"slotId": $scope.selectedAdDetailsArr.adDetails.slotId
				    			  }

			    	AdvModel.updateAdv(addata).$promise.then(function(res){
			    		getUserAdList();
			    		$scope.disableButton = false;
			    		jQuery(".page-spinner-bar").removeClass("show");
            		    jQuery(".page-spinner-bar").addClass("hide");		
			    	}); 
				}
				else{ // save in CustomAd table
					var adJsonContent = "";
					var adHtmlContent = "";

					var addata = {  "name": $scope.customAttr.dynamicElement.ad_name,
				    				"adJsonContent": $scope.customAttr.jsonAdContent,
				    				"templateId": $scope.selectedAdDetailsArr.appId,
				    				"url": $scope.selectedAdDetailsArr.appUrl,
				    				"categoryId": $scope.selectedAdDetailsArr.categoryId,
				    				"productId": $scope.selectedAdDetailsArr.productId,
				    				"tablename" : "CustomAd",
			    					"domainArr": $scope.multiSelectedVal.selectedval,
			    					"id" : $scope.selectedAdDetailsArr.adDetails.id,
				    				"slotId": $scope.selectedAdDetailsArr.adDetails.slotId
				    			}

				    AdvModel.updateAdv(addata).$promise.then(function(res){
			    		getUserAdList();
			    		$scope.disableButton = false;
			    		jQuery(".page-spinner-bar").removeClass("show");
            		    jQuery(".page-spinner-bar").addClass("hide");		
			    	}); 



					jQuery(".page-spinner-bar").removeClass("show");
            		jQuery(".page-spinner-bar").addClass("hide");	
				}		

            };

            $scope.deleteCurrentAd = function(){ // deleting Ad  from table and revive.
				var delConfirm = $window.confirm($translate.instant('CONFIRM_DELETE_AD'));
           		
           		if(delConfirm){
           			jQuery(".page-spinner-bar").addClass("show");
            		jQuery(".page-spinner-bar").removeClass("hide");
			    	AdvModel.deleteAd($scope.currentSavedAdInfo).$promise.then(function(res){
			    		$scope.showDeleteButton = false;
			    		getUserAdList();
			    		jQuery(".page-spinner-bar").removeClass("show");
            			jQuery(".page-spinner-bar").addClass("hide");
			    		//$window.location.reload();
			    		$state.go('adbuilder');		
			    	}); 
			    } 
            };

		    

		   
            
	        // initialize core components
	        Metronic.initAjax();
	    });
		$rootScope.settings.layout.pageSidebarClosed = true;
}]);