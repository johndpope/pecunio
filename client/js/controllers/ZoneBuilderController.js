/**
 * Controller file to view/manage zone builder
 * over view and zone builder details page
 * 
 */

'use strict';
PecunioApp

.controller('ZoneBuilderController',['$rootScope', '$scope','$q','$timeout','$state','$window','$resource','$modal','$log','ZoneBuilder','ZoneType','LoopBackAuth','PecunioUser','AdTemplateDataModel','PublisherDomain','Affiliates','userDetailsFactory','publisherDomainFactory','$translate','zonebuilderFactory',
	 function($rootScope,$scope,$q,$timeout,$state,$window,$resource,$modal,$log,ZoneBuilder,ZoneType,LoopBackAuth,PecunioUser,AdTemplateDataModel,PublisherDomain,Affiliates,userDetailsFactory,publisherDomainFactory,$translate,zonebuilderFactory){
		
		/**
		 * Initialize all variables and objects
		 * 
		 */
		$scope.screenPath = '';
		$scope.canvas1 = undefined;
		$scope.userInfo = {};
		$scope.allWebpages = {};
		$scope.webListAll = [];
		$scope.allAvailableZones = [];
		$scope.znTypes = [];
		$scope.stat = false;
		$scope.iscr;
		$scope.msg;
		$scope.webPageList = {};
		$scope.productId = 0;
		$scope.height = 0;
		$scope.width = 0;
		$scope.positionX = 0;
		$scope.positionY = 0;
		$scope.zoneName = "";
		$scope.deviceid = 1;
		$rootScope.webPageModal;
		$scope.currentDomainName;
		$scope.currentDomainId;
		$scope.currentWebsiteId;
		$scope.zoneCanvas = [];
		$scope.isView = false;
		$scope.zonelist;
		/* Domain registration */
		$scope.showZoneModal = true;
		$scope.domains = [];
		
		//var getUserdata = sessionStorage.getItem('userData'); 
		//var jsonUserArr = JSON.parse(getUserdata);
		
		var jsonUserArr = userDetailsFactory.getUserDetails();  //changed for session storage conflict
		$scope.userRole = jsonUserArr.roleId;
		/**
		 * Function to get all webpages posted by
		 * currently logged in user, if user is admin, or 
		 * by account owner if user is other than admin
		 *
		 * @return {array} [webpage list]
		 */
	    
		   $scope.getWebsite = function(){
			    if(jsonUserArr.acctownerId != undefined && jsonUserArr.acctOwneremail != undefined){
				    var userdata = {'acctownermail':jsonUserArr.acctOwneremail,'acctownerid':jsonUserArr.acctownerId};
			  		if(!_.isEmpty(userdata)){
				  		ZoneBuilder.getCurrentWebsiteList({"userInfo":userdata})
							.$promise
							.then(function (data){
								var resultN = [];
								if(data.webData.webpages.length > 0){
									$scope.webListAll = data.webData.webpages;
								    
									for( var i= 0;i < $scope.webListAll.length; i++) {
								        var el = $scope.webListAll[i];
								        $scope.allWebpages[el.publisherId] = el;
							        	if(el.website.indexOf($scope.currentDomainName) > -1){
							        		resultN.push(el);
							        	}
								        
								    }
								    
								    $scope.webList = data.webData.webpages;
								    $scope.webPageList = resultN;
								    
								    $rootScope.webPageModal = $scope.webPageList;
								    $rootScope.webpageCount = $scope.webPageList.length;
								}else{
									$scope.webList = [];
								}
							});
					}


		   		}
		  	};
		   
		/**
		 * Initialize zone builder overview 
		 * and zone builder details page.
		 *
		 */
	 	$scope._initialize = function(){
	 		
			$scope.allZones;
			$scope.currentAcctOwnerMail;
		    //var getdata = sessionStorage.getItem('sendData');
		    //var jsonArr = JSON.parse(getdata);
		    var jsonArr = zonebuilderFactory.getWebData(); //changed for session storage conflict
		    if(!_.isEmpty(jsonArr)){
		    	$scope.isView = jsonArr.isView;
	  		 	$scope.webUrl = jsonArr.webUrl;
	  		 	$scope.currentWebsiteId = jsonArr.currentWebsite.publisherId;
	  		 	$scope.currentAcctOwnerMail = jsonArr.acctOwneremail;
	  		 	$rootScope.webName = jsonArr.currentWebsite.publisherName;
  		 		
	  		 	if(jsonArr.domainData){
	  		 		$scope.currentDomainId = jsonArr.domainData.domainid;
		  		 	$scope.currentDomainName = jsonArr.domainData.domainName;
	  		 	}else{
	  		 		$scope.currentDomain = $rootScope.webName.split("www.");
		  		 	$scope.currentDomainName = $scope.currentDomain[1];
		  		 			  		 	
	  		 	}
	  		 	
	  		 	$scope.allWebpages = {};
			    $scope.znTypes = []; 
			    $scope.zoneCategory = [];
			    $scope.deviceArr = [];
			    $scope.zoneArr = {};
			    var obj = {};
			    var filter = '';
			    AdTemplateDataModel.getZnType(filter)
	   		    	.$promise
	   		    	.then(function(data){
	   		    		if(data){
	   		    			for(var eachZn in data.zonetypes){
	   		    				$scope.zoneArr[data.zonetypes[eachZn].id] = data.zonetypes[eachZn];
	   		    			}

	   		    			var groupedList = (_.groupBy(data.zonetypes, 'dimension'));
	   		    			for(var key in groupedList){
	   		    				$scope.znTypes.push(groupedList[key][0]);
	   		    			}
	   		    		}
	   		    		
	   		    	})
			     }
		    	
		    	////////To fetch all zones added to the webpage on footer /////
		    
		    	ZoneBuilder.find({'filter':{'where':{'webpageId':$scope.currentWebsiteId,'isDel':0}}})
		    				.$promise
		    				.then(function(data){
		    					if(data){
		    						$scope.allZones = data;
		    						if($scope.allZones.length > 0){
		    							$scope.getZoneData($scope.currentWebsiteId);
		    						}
		    					}
		    					
		    	});
		    	
		    	
		    	$scope.getWebsite();
		    	$rootScope.allDomainNew = {};
				PublisherDomain.find({'filter':{'where':{'publisherId':jsonUserArr.acctownerId}}})
					.$promise
					.then(function(res){
						for(var i=0;i< res.length;i++){
							var el = res[i];
							$rootScope.allDomainNew[el.domainName] = el;
						}
				});
		    	
		    	/////// To initialize zone edit/delete function starts ////

				if($state.current.name == 'zonebuilder') { 
				/* Edit zone starts here */
		    	jQuery(document).on('click',"#editZone",function(){
	    			var zid = parseInt($('#zoneId').val());
	    			if(zid != null || zid != undefined){
		    				if($scope.canvas1.getActiveObject()){
		    					var ev = $scope.canvas1.getActiveObject();
				        		if(ev.type=='rect') {
					        		if($scope.zoneModifyObj){
					        			var obj = {"zoneinfo":$scope.zoneModifyObj,"zoneId":zid}
					        			var ret = $scope.editZone(obj);
					        			ret.then(function(response){
					        				if(response.status.isCreated == true && response.status.isUpdated == true){
					        					$scope.stat = true;
						    					$scope.iscr = 1;
						    					$scope.msg = "Zone geändert successfuly"; ///Zone modified successfuly
					        				}else{
						        				$scope.stat = true;
						    					$scope.iscr = 0;
						    					$scope.msg = "Fehler im Änderungszone";   ////Error in modifying zone
						        			}
					        			});
					        		}
				        		}
		    				}
			    			
	    			}else{
	    					$scope.stat = true;
	    					$scope.iscr = 0;
	    					$scope.msg = $translate.instant('SELECT_ZONE_FIRST');
	    			}
				   
		        })
			/* Edit zone ends here */
			/* Delete zone starts here */
			jQuery(document).on('click',"#delZone",function(){ 
	    			var zid = parseInt($('#zoneId').val());
	    			if(zid != null || zid != undefined){
		    				if($scope.canvas1.getActiveObject()){	
		    					var ev = $scope.canvas1.getActiveObject();
					        	if(ev.type=='rect') {
					        		 $scope.deleteZone(zid);
					        	} 
					        }
	    			}else{
	    					$scope.stat = true;
	    					$scope.iscr = 0;
	    					$scope.msg = $translate.instant('SELECT_ZONE_FIRST');
	    			}
				   
		        })
				/* Delete zone ends here */
				}
		    	/////// To initialize zone edit/delete function ends ////
		        
		        /* 1-admin, 2-webmaster, 3-accounts, 4-marketing */
		        ///access information for different user roles
		        $scope.addCanSee = [1,4];  
		    	$scope.notifyCanSee = [1,4];
		    	$scope.icCanSee = [1,2];
		    	$scope.delCanSee = [1,4];
		         
		   }();
		   
		   /* Add webpage starts*/
		   	$rootScope.noturl = false;
			$rootScope.notreg = "";
			$rootScope.msg = "" ;
			/**
			 * Function to open modal to add webpage
			 * 
			 */
			$rootScope.adZoneModal = function(size){
		  		var modalInstance = $modal.open({
				      templateUrl: 'views/zoneBuilder/adzone.html',
				      controller: 'ZoneBuilderController',
				      size: size
				     });
			}

		  	/**
		  	 * Function to open post webpage to revive
		  	 * Before posting the webpage to revive,
		  	 * it is checked if the webpage URL belongs
		  	 * to a registered website. On positive response
		  	 * the post method is being called. On negative response
		  	 * modal to register domain is opened.
		  	 * 
		  	 */
		  	$scope.AddWebsite = function(){
		  		var url = $scope.websiteurl;
		  		if(url){
			  		var message;
			    	if(url.indexOf("http://") > -1 ){
			    		var weburl = url;
			    	}else{
			    		var weburl = "http://"+url;
			    	}
			    	
			    	var myRegExp =/^(ht|f)tp(s?)\:\/\/(([a-zA-Z0-9\-\._]+(\.[a-zA-Z0-9\-\._]+)+)|localhost)(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?([\d\w\.\/\%\+\-\=\&amp;\?\:\\\&quot;\'\,\|\~\;]*)$/;
			    	if (!myRegExp.test(weburl)){
			    		$rootScope.noturl = true;
			    		jQuery(".page-spinner-bar").removeClass("show");
						jQuery(".page-spinner-bar").addClass("hide");
			    	}else{
			    		$rootScope.noturl =  false;
			    		jQuery(".page-spinner-bar").addClass("show");
			    		var UrlArr = weburl.split("://");
			    		var baseUrlArr = UrlArr[1].split("/");
			    		var baseUrl = baseUrlArr[0];
			    		var searhData = {"domain":baseUrl,"publisherId":jsonUserArr.acctownerId};
			    		PublisherDomain.searchDomainByName(searhData)  ////to check if the web site is registered
			    			.$promise
			    			.then(function(data){
			    				if(data.domain ){
			    					var domainData = {'domainid':data.domain.id,'domainName':data.domain.domainName};
			    					if(data.domain.status == 2){ ///manually approved
			    					$rootScope.notreg = "";
			    					var domain = data.domain.domainName;
		    			            var userdata = {'acctownermail':jsonUserArr.acctOwneremail,'acctownerid':jsonUserArr.acctownerId};    			            
		    			            $rootScope.acctOwneremail = jsonUserArr.acctOwneremail;
		    			            $rootScope.domainData = domainData;
		    			            ZoneBuilder.postWebsite({'website':{"weburl":weburl,"email":jsonUserArr.acctOwneremail,"name":jsonUserArr.acctOwnername,"domain":domain}})
			    	      			.$promise
			    	      			.then(function (data){
			    	      				$scope.webList = [];
			    	      				if(data.status.isSuccess == true){
		        		    					ZoneBuilder.getWebsiteList({"userInfo":userdata})
		        									.$promise
		        									.then(function (data){
		        										var webs = data.webData.allpages;
		        										if(webs.length > 0){
		        											$scope.webList = webs;
		        											var result = {};
		        											var resultN = [];
		        										    for( var i= 0;i < $scope.webList.length; i++) {
		        										        var el = $scope.webList[i];
		        										        if( el.website === weburl && el.emailAddress == jsonUserArr.acctOwneremail) {
		        										            result = el;
		        										        }
		        										    }
		        										    var sendData = {'webUrl':weburl,'currentWebsite':result,'domainData':domainData,'acctOwneremail':jsonUserArr.acctOwneremail,'isView':false};
		        										    //sessionStorage.setItem('sendData', JSON.stringify(sendData));
		        										    var resSess = zonebuilderFactory.setWebData(sendData); //changed for session storage conflict
		        										    jQuery(".modal-content").fadeOut();
		        										   	jQuery(".modal-backdrop").fadeOut();
		        						  					jQuery(".page-spinner-bar").removeClass("show");
		        						 				 	jQuery(".page-spinner-bar").addClass("hide");
		        						 				 	
		        						 					if($state.current.name == 'werbeflachen'){
		        						 						$state.go('zonebuilder');
		        						 					}else if($state.current.name == 'zonebuilder'){
		        						 						$state.reload();
		        						 					}
		        										}
		        									});
			    	      				}else{
			    	      					//console.log('Error in creating webpage');
			    	      				}
			    					
			    	      			});
			    					}
			    				}else{
			    					$rootScope.notreg = '<span class="error error-msg">Dies ist nicht ein registriertes Website</span>';
			    					$scope.showZoneModal = false;
			    					$scope.showRegistrationForm = true;
			    					$scope.showApproval = false;
			    					$scope.showTechnicalApproval = false;
			    					$scope.domain = baseUrl;
			    					jQuery(".page-spinner-bar").removeClass("show");
				 				 	jQuery(".page-spinner-bar").addClass("hide");
			    				}
			    			});
			    	}
		  		}else{
		  			$scope.noturl = true;
		  			jQuery(".page-spinner-bar").removeClass("show");
					jQuery(".page-spinner-bar").addClass("hide");
		  		}
		  	};

			/* Methods to register a new domain 
			*	by Debjani sengupta
			*/

			/**
			 * Function to register a new domain
			 * 
			 */
		   $scope.registerDomain = function(){
				if($scope.domains.length == 0){
	              $scope.domains.push($scope.domain);
	            }
				var domainData = {'domains' : $scope.domains, 'publisherId' : LoopBackAuth.currentUserId, 'email' : LoopBackAuth.currentUserData.email};
	            publisherDomainFactory
	            .registerDomain(domainData)
	            .then(function(data){
	                $scope.successMsg = $translate.instant('DOMAIN_REG');
	                $scope.technicalMsg = data.domain[0].metaTag;
	                $scope.publiserDomainId = data.domain[0].id;
	                $scope.showDomainForm = false;	
	                $scope.showRegistrationForm = false;
	                $scope.showApproval = true;

	            });
	        }
	        /**
	         *  Function to open domain approval modal
	         * 
	         */
	       $scope.OpenDomainApprovalModal = function () {		     
	          publisherDomainFactory
	          .checkMetaForTV({'userId' : LoopBackAuth.currentUserId, 'domainId' : $scope.publiserDomainId})
	          .then(function(data){
		          if(data.meta == true){
		            //var getUserdata = sessionStorage.getItem('userData');
					//var jsonUserArr = JSON.parse(getUserdata);
					var jsonUserArr = userDetailsFactory.getUserDetails(); //changed for session storage conflict
		            var content = "DomainId:"+$scope.publiserDomainId;
	                var obj = {"title":"Manual Approval for new domain from assistant","content":content,"topic":"Partner Support","usermail":jsonUserArr.acctOwneremail, "username": jsonUserArr.acctOwnername};
	                publisherDomainFactory
	                  .postSupportTicket(obj)
	                  .then(function(resp){
	                    if(resp.ticket.isCreated == true){
	                    	var reqs_id = resp.ticket.ticktdata.helpdesk_ticket.requester_id;
	                    	var tickDisId = resp.ticket.ticktdata.helpdesk_ticket.display_id;
	                    	var replyInfo = {
	                    		"replymsg":"/admin/domainListing.html",
	                    		"requesterId":reqs_id, 
	                    		"ticketId":tickDisId, 
	                    	};
	                    	publisherDomainFactory
	                            .replyWithPrivateNote(replyInfo)
	                            .then(function(resdata){
	                            	
	                            }); 

	                        $scope.technicalApprovalMsg = $translate.instant('DOMAIN_TECH_APPROVE_WAITING_MANUAL');
	                        $scope.showTechnicalApproval = true;
	                    }else{
	                       $scope.technicalApprovalMsg = "Error.....";
	                       $scope.showTechnicalApproval = true;
	                    }
	                });
		           
					$scope.showDomainForm = false;	
				    $scope.showRegistrationForm = false;
				    $scope.showApproval = false;
		          }else{
		            $scope.technicalApprovalMsg = $translate.instant('DOMAIN_TECH_FAILD');
					$scope.showDomainForm = false;	
	          		$scope.showRegistrationForm = false;
	          		$scope.showApproval = false;
	         		$scope.showTechnicalApproval = true;
		          }  
	          }); 
		   }; 
		   /**
	         *  Function to close domain approval modal
	         * 
	         */
		   $scope.closeDomainRegistration = function () {		     
	  		  $scope.showDomainForm = false;	
	          $scope.showRegistrationForm = false;
	          $scope.showApproval = false;
	          $scope.showTechnicalApproval = false;
	          jQuery(".modal-content").fadeOut();
			  jQuery(".modal-backdrop").fadeOut();
		   };
		   $scope.cancelModal = function () {
			   	jQuery(".modal-content").fadeOut();
			   	jQuery(".modal-backdrop").fadeOut();
			   	
		   };

		   /**
		    * Function to set zone area active on canvas 
		    * on clicking the zone thumb on footer
		    * 
		    * @param {number} zoneId [id of respective zone]
		    */
		   $scope.setZoneActive = function(zoneId){
			   var zoneObjects = $scope.zoneCanvas[0].canvas._objects;
			   for(var i=0; i< $scope.canvas1.getObjects().length; i++){
				   $scope.canvas1.getObjects()[i].active = false;
				   if($scope.canvas1.getObjects()[i].type == 'rect'){
					   $scope.canvas1.getObjects()[i].fill = '#d6e9c6';
				   }
			 	}
			   for(var eachZone in zoneObjects){
				   var curZone = zoneObjects[eachZone];
				   if(curZone.stroke != 'undefined' && curZone.stroke !=null && curZone.stroke == zoneId ){
					   $scope.canvas1.setActiveObject(zoneObjects[eachZone]);
					   zoneObjects[eachZone].fill = '#77f';
					   
				   }
			   }
		   }
		  
		    /**
		     * Function to edit zone area on revive
		     * 
		     * @param  {object} obj [Contains modified data for zone]
		     * @return {$promise}     [Contains status ]
		     */
		    $scope.editZone = function(obj){
		    	if(!_.isEmpty(obj)){
		    		var deferred = $q.defer();
		    		ZoneBuilder.modifyZone({"zoneData":obj})
		    			.$promise
		    			.then(function(res){
		    				deferred.resolve(res);
		    			});	
		    		return deferred.promise;
		    	}
		    } 
		   /**
		    * Function to get all available zones
		    * as thumb on top panel. Clicking on each
		    * draws respective zone on canvas
		    * 
		    * @param  {Boolean} setScope [description]
		    * @return {array}          [All available zone list]
		    */
		   function getAllZones(setScope){
		   		//var getdata = sessionStorage.getItem('sendData');
		   		//var jsonArr = JSON.parse(getdata);
		   		var jsonArr = zonebuilderFactory.getWebData();  //changed for session storage conflict
			    if(!_.isEmpty(jsonArr)){
			    	
		  		 	$scope.webUrl = jsonArr.webUrl;
		  		 	$scope.currentWebsiteId = jsonArr.currentWebsite.publisherId;
	       		 	$scope.webName = jsonArr.currentWebsite.publisherName;
		  		 	$scope.allWebpages = {};
				    $scope.znTypes = [];
				    $scope.zoneCategory = [];
				    $scope.deviceArr = [];
				    $scope.zoneArr = {};
				    $scope.allAvailableZones = [];
				    var obj = {};
				    var filter = '';
				     
				    if(setScope == false){
						return	AdTemplateDataModel.getZnType(filter)
					   		    	.$promise
					   		    	.then(function(data){
					   		    		if(data){
					   		    			for(var eachZn in data.zonetypes){
					   		    				$scope.zoneArr[data.zonetypes[eachZn].id] = data.zonetypes[eachZn];
					   		    			}
					   		    			var groupedList = (_.groupBy(data.zonetypes, 'dimension')); 
					   		    			for(var key in groupedList){
					   		    				$scope.allAvailableZones.push(groupedList[key][0]);
					   		    			}
					   		    			return $scope.allAvailableZones;
					   		    		}	
					   		    });
				    }
				    else{
				    	return AdTemplateDataModel.getZnType(filter)
			   		    	.$promise
			   		    	.then(function(data){
			   		    		if(data){
			   		    			for(var eachZn in data.zonetypes){
			   		    				$scope.zoneArr[data.zonetypes[eachZn].id] = data.zonetypes[eachZn];
			   		    			}
			   		    			var groupedList = (_.groupBy(data.zonetypes, 'dimension')); 
			   		    			for(var key in groupedList){
			   		    				$scope.znTypes.push(groupedList[key][0]);
			   		    			}
			   		    			return $scope.znTypes;
			   		    		}	
			   		    });
				    }
			    }
		   }
		    /**
		     * Get screen image of current webpage based on the device. If the webpage 
		     * is responsive, clicking the device will generate responsive screen image 
		     * of webpage for selected device 
		     * 
		     * @param  {number} wd  [Width of screen]
		     * @param  {number} hg  [Height of screen]
		     * @param  {number} dId [Device id]
		     * @return {[type]}     [description]
		     */
		    $scope.getScreen = function(wd,hg,dId){
				   $scope.msg = '';
				   $scope.width = wd;
				   $scope.height = hg;
				   $scope.deviceid = dId;
				   if($scope.webUrl != null){
					   jQuery(".page-spinner-bar").addClass("show");
					   ZoneBuilder.screenCapture({'website':{"weburl":$scope.webUrl,"height":hg,"width":wd}})
					   .$promise
			  			.then(function (data){
			  				if(data){
			  					if(data.screen.isPageOpen == true){
			  						if(data.screen.isPageRendered == true){
			  							$scope.screenPath = data.screen.screenPath;
			  							$scope.$broadcast("imageL");
			  						}else{
			  							$scope.msg = $translate.instant('PAGE_NOT_RENDERED');
			  						}
			  					}else{
			  						
			  						$scope.msg = $translate.instant('PAGE_NOT_OPENED');
			  					}
			  					
			  				}
			  			});
				   }
			} 
		    $scope.$on("imageL", function(){
		    	
		    		jQuery(".page-spinner-bar").removeClass("show");
 				 	jQuery(".page-spinner-bar").addClass("hide");
 				 	//$timeout(alert("dadasdsa"),0);
 				 	if($scope.canvas1 === null || $scope.canvas1 === undefined)
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
	 				 				left: 0,    
	 				 				top: 0,     
	 				 				width: $scope.width,
	 				 				height: $scope.height
	 				 			});
	 				 		$scope.canvas1.setBackgroundImage(image); 
	 				 		$scope.canvas1.renderAll();
 				 		}
		    	
		    });
		    /**
		     * Function to fetch all zones added to a webpage
		     * 
		     * @param  {number} wId [Webpage id]
		     * @return {array}     [List of zone area added]
		     */
		    
		    $scope.getZoneData = function(wId){
		    	if(wId != null || wId != undefined ){
		    		ZoneBuilder.getZoneList({'webId':wId})
       		    	.$promise
       		    	.then(function(data){
       		    		if(data){
       						$scope.zonelist = data.zonelist;
       		    		}
       		    	});
		    	}
		    }
		    
		  	/**
		  	 * Function to draw the zone on canvas
		  	 * 
		  	 * @param  {number} w   [Width of zone]
		  	 * @param  {number} h   [Height of zone]
		  	 * @param  {number} pId [Product id associated with the zone]
		  	 * 
		  	 */
		  	$scope.zoneObj;
		    $scope.getRect = function(w,h,pId){
		    	if($scope.height != 0 && $scope.width != 0 && $scope.positionX != 0 && $scope.positionY != 0 && $scope.zoneName!= null && $scope.productId !=0 ){
		    		var obj = {"zoneheight":$scope.height,"zonewidth":$scope.width,"zoneleft":$scope.positionX,"zonetop":$scope.positionY,"currentWebId":$scope.currentWebsiteId,"imgpath":$scope.screenPath,"zonename":$scope.zoneName,"productid":$scope.productId};
		    		$scope.saveZone(obj);
		    	}
				var srcImg = $scope.screenPath; 
				var inptText = $('#zonetitle').val();
				$scope.zoneName = inptText;
				var fabRect = new fabric.Rect({ width: w, height: h, fill: '#77f', top: 100, left: 100,opacity: 0.85 });
				$scope.canvas1.add(fabRect);
				var text = new fabric.IText(inptText, { left: 100, top: 100,fontSize: 20 });
				////changing the text zone name
				$scope.canvas1.on('text:changed', function(e) {
				    $scope.zoneName = e.target.__text;
				    $scope.zoneObj = {"zoneheight":h,"zonewidth":w,"zoneleft":$scope.positionX,"zonetop":$scope.positionY,"currentWebId":$scope.currentWebsiteId,"imgpath":$scope.screenPath,"zonename":$scope.zoneName,"productid":$scope.productId};
				});
				$scope.canvas1.add(text);
				$scope.canvas1.renderAll();
				for(var i=0; i< $scope.canvas1.getObjects().length; i++){
				 	var objType = $scope.canvas1.getObjects()[i].type;
				 	if(objType == "rect"){
				 		$scope.canvas1.getObjects()[i].hasControls = false;
				 	}
					
				 }
				$scope.productId = pId;
				$scope.height = h;
				$scope.width = w;
				$scope.positionX = fabRect.getLeft();
				$scope.positionY = fabRect.getTop();
				////changing the position of zone
				$scope.canvas1.on('object:moving', getMouse);
				
				function getMouse(e){ 
						var top;
			 			var left;
			 			var thisObjIndex;
						var otherObj;
						if(e.target.type=='rect') {
							thisObjIndex = e.target.canvas.getObjects().indexOf(e.target);
							
							if(thisObjIndex > -1) {
								top = e.target.top + 1;
								left = e.target.left + 1;
								otherObj =  e.target.canvas.getObjects()[thisObjIndex+1];
								otherObj.set({ left: left, top: top });
								
							}
						} else if(e.target.type=='i-text') {
							thisObjIndex =  e.target.canvas.getObjects().indexOf(e.target);
							if(thisObjIndex > -1) {
								top = e.target.top - 1;
								left = e.target.left - 1;
								otherObj =  e.target.canvas.getObjects()[thisObjIndex-1];
								otherObj.set({ left: left, top: top });
							}
						}
						//// To lock object item within canvas
						var obj = e.target; 
				        var halfw = obj.currentWidth/2;  
				        var halfh = obj.currentHeight/2 ; 
				        var bounds = {tl: {x: halfw, y:halfh},
				            br: {x: halfw , y: halfh }
				        };
			          
					  $scope.positionX = fabRect.getLeft();
					  $scope.positionY = fabRect.getTop();
					  $scope.zoneObj = {"zoneheight":h,"zonewidth":w,"zoneleft":$scope.positionX,"zonetop":$scope.positionY,"currentWebId":$scope.currentWebsiteId,"imgpath":$scope.screenPath,"zonename":$scope.zoneName,"productid":$scope.productId};
					  
				}
			 	$scope.zoneObj = {"zoneheight":h,"zonewidth":w,"zoneleft":$scope.positionX,"zonetop":$scope.positionY,"currentWebId":$scope.currentWebsiteId,"imgpath":$scope.screenPath,"zonename":$scope.zoneName,"productid":$scope.productId};    
  
		    }
		    /**
		     * Function to save a zone to revive and local data base
		     * 
		     * @param  {object} obj [Contains data of zone to be created]
		     * @return {Boolean}     [Status if zone is created]
		     */
		    $scope.saveZone = function(obj){
		    	if(!_.isEmpty(obj)){
			    	var srcImg = $scope.screenPath; 
			    	$scope.stat = false;
			    	$scope.iscr = 0;
			    	$scope.msg = "";
			    	obj['deviceid'] = $scope.deviceid;
			    	obj['domainid'] = $scope.currentDomainId;
			    	obj['userid'] = LoopBackAuth.currentUserId;
			    	ZoneBuilder.addZone({'zonedata':obj})
			    		.$promise
			    		.then(function(res){
			    			if(res.status.isInserted == true){
			    				var nHeight = Math.ceil(parseInt($scope.height/10)*3);
								var nWidth = Math.ceil(parseInt($scope.width/10)*3);
			    				$scope.addedZone = '<li><div class="screensquare" style="width:'+nWidth+'px;height:'+nHeight+'px;" ng-click="getRect('+$scope.width+','+$scope.height+')"></div><label>'+$scope.width+'X'+$scope.height+'</label></li>';
			    				$scope.stat = true;
			    				$scope.iscr = 1;
			    				$scope.msg = $translate.instant('ZONE_CREATE_SUCC');   
			    				$scope.height = 0;
			    				$scope.width = 0;
			    				$scope.positionX = 0;
			    				$scope.positionY = 0;
			    				$scope.zoneName = "";
			    				$scope.getZoneData($scope.currentWebsiteId);
			    			}else{
			    				$scope.stat = true;
			    				$scope.iscr = 0;
			    				$scope.msg = $translate.instant('ZONE_CREATE_FAILED');   
			    			}
			    		});

		    	}else{
		    		$scope.stat = false;
		    	}
		    }
		    
		    /**
		     * Function delete zone from revive and local database
		     * 
		     * @param  {number} zid [Id of zone to be deleted]
		     */
		    $scope.deleteZone = function(zid){
		    	if(zid != null || zid != undefined){
		    		bootbox.confirm("Sind Sie sicher?", function(result) {
		    			if(result == true){
				    		ZoneBuilder.deleteZone({"zoneId":zid})
				    			.$promise
				    			.then(function(response){
				    				if(response.status.isDeleted == true && response.status.isDeletedFromtable == true){
				    					if($scope.canvas1.getActiveObject()){
				    						var ev = $scope.canvas1.getActiveObject();
						    				var thisObjIndex;
								            var otherObj;
					        				thisObjIndex = ev.canvas.getObjects().indexOf(ev);
											if(thisObjIndex > -1) {
												otherObj =  ev.canvas.getObjects()[thisObjIndex+1];
												$scope.canvas1.remove(ev);
												$scope.canvas1.remove(otherObj);
												jQuery(this).remove();
												jQuery(".modIcon").remove();
											}
				    					}
				    					$scope.stat = true;
				    					$scope.iscr = 1;
				    					$scope.msg = $translate.instant('ZONE_DELETE_SUCC');   
				    					$scope.getZoneData($scope.currentWebsiteId);
				        			}else{
				        				$scope.stat = true;
				    					$scope.iscr = 0;
				    					$scope.msg = $translate.instant('ZONE_DELETE_FAILED'); 
				        			}
				    			});
		    			}	
		    		});
		    	}
		    }
		    /**
		     * Function to generate the view of a webpage with zones already created.
		     * Function is called from overview page by clicking the edit icon beside
		     * each webpage listed.
		     * 
		     * @param  {object} web [contains data of webpage]
		     * 
		     */
		    $scope.viewWebDetails = function(web){
		    	if(!_.isEmpty(web)){
			    	var dom = $scope.allDomainNew[web.publisherName];
			    	var domainData = {'domainid':dom.id,'domainName':dom.domainName};
			    	var sendData = {'webUrl':web.website,'currentWebsite':web,'domainData':domainData,'acctOwneremail':jsonUserArr.acctOwneremail,'isView':true};
				    //sessionStorage.setItem('sendData', JSON.stringify(sendData));
				    var resSess = zonebuilderFactory.setWebData(sendData); //changed for session storage conflict
				    $state.go('zonebuilder');
		    	}else{
		    		//console.log("no web found");
		    	}
		    	
		    }
		    /* get invocation code starts */
		    /**
		     * Function to open modal for invocation code
		     *
		     */
		    $rootScope.openInvocationModal = function (size) {
  	            var modalInstance = $modal.open({
  	                templateUrl: 'views/zoneBuilder/invocationModal.html',
  	                controller: 'ZoneBuilderController',
  	                size: size
  	            });
  	        };
  	        /**
  	         * Function to generate invocation code for selected zone.
  	         * Selecting a zone on canvas by clicking on it and then clicking
  	         * the Generate Code button opens a modal with the invocation
  	         * code of selected zone. Code can be copied by clicking on
  	         * respective button on modal.
  	         * 
  	         * 
  	         */
		    $scope.getInvocationCode = function(){
		    	var zid = parseInt($('#zoneId').val());
		    	if(zid){
		    		jQuery(".page-spinner-bar").addClass("show");
		    		ZoneBuilder.getInvoCode({'zoneId':zid})
		    		.$promise
		    		.then(function(res){
		    			if(res){
		    				jQuery(".page-spinner-bar").removeClass("show");
 		 				 	jQuery(".page-spinner-bar").addClass("hide");
		    			
			    			if(res.invcode.isCode == true){
			    				var ivCode = res.invcode.invocation_code;
			    				$rootScope.invcode = ivCode;
			    				$scope.openInvocationModal();
			    				
			    			}else{
			    				$scope.stat = true;
					    		$scope.iscr = 0;
							   	$scope.msg = $translate.instant('CODE_GEN_ERROR');   /////Error in generating code
			    			}
		    			}
		    		});
		    		
		    	}else{
		    		$scope.stat = true;
		    		$scope.iscr = 0;
				   	$scope.msg = $translate.instant('SELECT_ZONE_FIRST');   /////Select a zone first
		    	}
		    	
		    	
		    }
		    /**
		     * Function to open modal to send notification to users
		     * through mail about the webpages created
		     * 
		     * @return      [Opens the modal with list of webpages and users]
		     */
		     $scope.notifyUser = function(size){
		    	 $scope.showMsg = false;
		    	 var modalInstance = $modal.open({
	  	                templateUrl: 'views/zoneBuilder/notifyuserModal.html',
	  	                controller: 'ZoneBuilderController',
	  	                size: size,
	  	                resolve: {
	  	                	subUsers: function () {
	                        	 Affiliates.find({'filter':{'where':{'accountOwnerId':jsonUserArr.acctownerId}}})
	              				.$promise
	              				.then(function(res){
	              					$rootScope.subUsers = res;
	              					return $rootScope.subUsers;
	              				});
	                        	 
                          }
                        }
	  	          });
		     }
		    
		    /**
		     * Function to notify users through mail
		     * about the webpages created. Mail will go 
		     * users selected from the dropdown in modal.
		     * 
		     */
		     $scope.sendNotification = function(){
		    	 if(!_.isEmpty($scope.selectedwebPageModal) && !_.isEmpty($scope.selectedsubUsers)){
		    	 	 var webpPges = []; var subUsers = [];
			    	 for(var eachPage in $scope.selectedwebPageModal){
			    		 var p = JSON.parse($scope.selectedwebPageModal[eachPage]);
			    		 webpPges.push(p);
			    	 }
			    	 for(var eachUser in $scope.selectedsubUsers){
			    		 var u = JSON.parse($scope.selectedsubUsers[eachUser]);
			    		 subUsers.push(u);
			    	 }
		    		 var obj = {"webpage":webpPges,"users":subUsers,"domain":$scope.currentDomainName}
		    		 ZoneBuilder.sendNotification({'notifyData':obj})
		    		 			.$promise
		    		 			.then(function(response){
		    		 				var isSent = response.status[0].isSent;
		    		 				if(isSent == true){
		    		 					if(response.status.length > 0){
			    		 					var sentTo = response.status;
			    		 					var sent = "Mail gesendet ";
			    		 					for(var eachStat in sentTo){
			    		 						sent += sentTo[eachStat].data.mailsentto+" ,";
			    		 					}
			    		 					$scope.showMsg = true;
								    		$scope.isSent = 0;
								    		sent.trim();
										   	$scope.msg = sent.slice(0, - 1); ///to remove last " , "
		    		 					}
		    		 				}else{
		    		 					$scope.showMsg = true;
							    		$scope.isSent = 1;
									   	$scope.msg = $translate.instant('SENDING_FAILED');  ///Error in sending mail
		    		 				}
		    		 			});
		    	 }else{
		    		 	$scope.showMsg = true;
			    		$scope.isSent = 1;
					   	$scope.msg = $translate.instant('SELECT_HOMEPAGE_USER');  ///Select webpage and user to send email
		    	 }
		     }
		    /**
		     * Function to delete wepage from revive.
		     * Function is called on clicking delete
		     * icon from webpage listing on overview page.
		     * 
		     * @param  {Number} webPid [webpage Id]
		     * @return {[type]}        [description]
		     */
		    $scope.delWebpage = function(webPid){
		    	if(webPid != null || webPid != undefined){
		    		jQuery(".page-spinner-bar").addClass("show");
 		 			jQuery(".page-spinner-bar").removeClass("hide");
		    		var wpId = parseInt(webPid);
		    		bootbox.confirm("Sind Sie sicher?", function(result) {
		    			if(result == true){
		    				ZoneBuilder.deleteWebpage({'pageId':wpId})
		    							.$promise
		    							.then(function(response){
		    								jQuery(".page-spinner-bar").removeClass("show");
 		 				 					jQuery(".page-spinner-bar").addClass("hide");
		    								if(response.status.isDeleted == true && response.status.isDeletedFromtable == true){
		    									$scope.stat = true;
				    							$scope.iscr = 1;
				    							$scope.msg = $translate.instant('ZONE_SPACE_DELETED_SUCC');   ///webpage deleted successfuly
		    									$scope.getWebsite();
		    								}else{
		    									$scope.stat = true;
				    							$scope.iscr = 0;
				    							$scope.msg = $translate.instant('ZONE_SPACE_DELETED_FAILED');   ///Error in deleting webpage
		    								}
		    							});
		    			}
		    		});

		    	}
		    }
		    /**
		     * Function to get all webpages added under a domain
		     * Function is called from zone builder details page
		     * on changing the domain from first drop down on footer.
		     * Canvas will rendered with the screen image and zones
		     * of first webpage of all the pages added. List of all
		     * webpages under the selected domain will be listed in 
		     * second dropdown.
		     * 
		     * @param  {string} domain [name of domain]
		     * @return {[type]}        [List of subpages under selected domain]
		     */
		    $scope.getSubpages = function(domain){
		    	if(domain != null || domain != undefined){
		    		var resultN = [];
					for( var i= 0;i < $scope.webList.length; i++) {
				        var el = $scope.webList[i];
			        	if(el.website.indexOf(domain) > -1){
			        		resultN.push(el);
			        	}
				    }
					$scope.webPageList = resultN;
					$scope.currentWebsiteId = $scope.webPageList[0].publisherId;
					$scope.currentDomainName = domain;
					$scope.currentDomainId = $rootScope.allDomainNew[domain].id;
					$scope.webUrl = $scope.webPageList[0].website;
					var domainData = {'domainid':$scope.currentDomainId,'domainName':$scope.currentDomainName};
					var sendData = {'webUrl':$scope.webPageList[0].website,'currentWebsite':$scope.webPageList[0],'domainData':domainData,'acctOwneremail':$rootScope.acctOwneremail,'isView':true};
				    //sessionStorage.setItem('sendData', JSON.stringify(sendData));
				    var resSess = zonebuilderFactory.setWebData(sendData); //changed for session storage conflict

					$scope.init();
					$scope.getZoneData($scope.currentWebsiteId);

		    	}
		    }
		    /**
		     * Function to fetch and draw screen image and added zone
		     * for selected webpage from the dropdown on footer.
		     * Canvas will be rendered with the screen image and zones
		     * of selected webpage.
		     * 
		     * @param  {number} webpage [webpage id]
		     * 
		     */
		    $scope.getPageData = function(webpage){
		    	if(webpage != null || webpage != undefined){
		    		var currPage = $scope.allWebpages[webpage];
		    		if(currPage != null || currPage != undefined){
						$scope.currentWebsiteId = webpage;
						$scope.currentDomainName = currPage.publisherName;
						$scope.currentDomainId = $rootScope.allDomainNew[currPage.publisherName].id;
						$scope.webUrl = currPage.website;
						var domainData = {'domainid':$scope.currentDomainId,'domainName':$scope.currentDomainName};
						var sendData = {'webUrl':currPage.website,'currentWebsite':currPage,'domainData':domainData,'acctOwneremail':$rootScope.acctOwneremail,'isView':true};
					    //sessionStorage.setItem('sendData', JSON.stringify(sendData));
					    var resSess = zonebuilderFactory.setWebData(sendData); //changed for session storage conflict
						$scope.init();
						$scope.getZoneData($scope.currentWebsiteId);
					}
		    	}
		    }
		    /**
		     * Function to filter available zones based 
		     * on the filter criteria from left toolbar
		     * 
		     * @param  {object} query [Query with filter criteria]
		     * @return {array}       [available zone list]
		     */
			$scope.filterList = function(query) { 
				
				if((query.ptype != undefined && query.ptype != null) || 
						(query.variante != undefined && query.variante != null && query.variante != "") || 
						(query.categoryid != undefined && query.categoryid != null && query.categoryid != "")
						|| (query.displaytype)!= undefined && query.displaytype != null && query.displaytype != ""
						|| (query.widthval)!= undefined && query.widthval != null && query.widthval != ""
						|| (query.heightval)!= undefined && query.heightval != null && query.heightval != "") {
		    				
						getAllZones(false).then(function(data) {
			                // START For Default Ads
							    
			                  	var allAvailableZones = $scope.allAvailableZones;
			                  	var filteredList = [];
			                  	var isInitialized = 0;
			                  	
			                  	// Start category filter
			                  	if(query.categoryid != undefined && query.categoryid != ""){
			                  		
			                  	 	filteredList = _.filter(allAvailableZones, function(data){ 
		                  	 			return data.categoryId == query.categoryid;
			                  	 	});
			                  	 	isInitialized++;
			                  	} 
			                  	// End category filter

			                  	// Start sparte filter
			                  	if(query.ptype != undefined){

			                  		if(filteredList.length == 0 && isInitialized == 0){
		    		    				filteredList = allAvailableZones;
		    		    			}

			                  	 	filteredList = _.filter(filteredList, function(data){ 
		                  	 			return data.productId == query.ptype;
			                  	 	});
			                  	 	isInitialized++;
			                  	}
			                  	// End sparte filter

			                  	// Start variante filter
			                  	if(query.variante != undefined && query.variante != ""){

			                  		var varianteArr = [];
			                  		varianteArr = query.variante.split('-');

			                  		if(filteredList.length == 0 && isInitialized == 0){
		    		    				filteredList = allAvailableZones;
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
		    		    				filteredList = allAvailableZones;
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
			                  	if(query.widthval != undefined && query.widthval != "" && query.widthval > 0){ 

			                  		if(filteredList.length == 0 && isInitialized == 0){
		    		    				filteredList = allAvailableZones;
		    		    			}

			                  	 	filteredList = _.filter(filteredList, function(data){ 
			                  	 		return (data.minWidth <= query.widthval);
			                  	 	});
			                  	 	isInitialized++;
			                  	}
			                  	// End widthval filter


			                  	// Start heightval filter
			                  	if(query.heightval != undefined && query.heightval != "" && query.heightval > 0){ 

			                  		if(filteredList.length == 0 && isInitialized == 0){
		    		    				filteredList = allAvailableZones;
		    		    			}

			                  	 	filteredList = _.filter(filteredList, function(data){ 
			                  	 		return (data.minHeight <= query.heightval);
			                  	 	});
			                  	 	isInitialized++;
			                  	}
			                  	// End heightval filter


			                  	if(filteredList.length == 0) {
		    		    			$scope.znTypes = [];
		    		    		}
		    	    			else{
		    	    				$scope.znTypes = filteredList;
		    	    			}
			    		    //}); 
							//END For filter Zones
						});
	    		  } else {
	    			  getAllZones(true);
	    		  }
			}
			// End Filter 
		    
		    
	   $scope.$on('$viewContentLoaded', function() {
	        Metronic.initAjax();
	   });
	$rootScope.settings.layout.pageSidebarClosed = true;
}]);
