/**
 * Server side model file to make API calls to revive
 * and database. For viewing/managing zone builder
 * over view and details page.
 *
 * @author Gargi Chakraborty <gargi0209.chakraborty@gmail.com>
 */
/**
 * List of node modules required
 * 
 */
var app = require('../../server/server.js');
var http = require("http");   ////http
var q = require("q");
var phantom = require('phantom');
var nodemailer = require('nodemailer');
var fs = require('fs');
var loopback = require('loopback'); 
var _ = require('underscore');
var config = require('../../server/config');

module.exports = function(ZoneBuilder) {
	/**
	 * Function to post a webpage to revive
	 * 
	 * @param  {Object}   website [Contains webpage data]
	 * @param  {Function} cb      [callback function to send the response back to client side]
	 * @return {object}           [Status object]
	 */
	ZoneBuilder.postWebsite = function (website,cb){
		if(website){
			var web = website.weburl.split("://");
			var webNm = web[1].split("/");
			var postWeb = function(){
					var postBody =   {
					        agencyId:1,
					        publisherName: website.domain, 
					        contactName:website.name,
					        emailAddress:website.email,
					        website : website.weburl
					}
					var dataBody = JSON.stringify(postBody);
					var params = {
							hostname : config.reviveSetting.hostname ,
							path : config.reviveSetting.restApi+"/pub/new", 
							method: "POST",
							headers: {"Content-type": "application/json","Content-Length": dataBody.length},
							auth : config.reviveSetting.authentication    
					}
					var respn = {};
					var err = {};
					
					var common = app.models.CommonModel;
					common.postDataToApi(params,dataBody,function(err,res){
						  if(res){
							  if(res.isCreated == true){
							    	respn["isSuccess"] = true;
							   }else{
							    	respn["isSuccess"] = false;
							   }
						  }else if(err){
							  //console.log(err);
							  respn["isSuccess"] = false;
						  }
						  
						  cb(null, respn);
					 });
				
			}();
			
		}
	};
	
	ZoneBuilder.remoteMethod(
			'postWebsite',
	        {
	          http: {path: '/postWebsite', verb: 'get'},
	          accepts:{arg: 'website', type: 'object'},
	          returns: {arg: 'status', type: 'object'}
	        }
	);
	/**
	 * Function to get all webpage from revive
	 * 
	 * @param  {object}   userInfo [user info]
	 * @param  {Function} cb       [callback function to send the response back to client side]
	 * @return {object}            [Webpage list]
	 */
	ZoneBuilder.getWebsiteList = function(userInfo,cb){
		var params = {
				hostname : config.reviveSetting.hostname ,
				path : config.reviveSetting.restApi+"/pub/agc/1",   
				method: "GET",
				headers: {"Content-type": "application/json"},
				auth : config.reviveSetting.authentication  
		}
		var response = {};
		var returnValue = [];
		var common = app.models.CommonModel;
		common.getDataFromApi(params,function(err,res){
			if(res){
				var agencyData = res.agencies.data;
				response["allpages"] = agencyData; 
				for(var eachData in agencyData){  
					if(agencyData[eachData].emailAddress === userInfo.acctownermail){
						returnValue.push(agencyData[eachData]);
					}	
				}
				response["webpages"] = returnValue;
				cb(null, response); 
				
				
			  }else if(err){
				  //console.log('ERR : '+err);
				  cb(err);
			  }
		 });
	}
	
	ZoneBuilder.remoteMethod(
			'getWebsiteList',
	        {
	          http: {path: '/getWebsiteList', verb: 'get'},
	          accepts:{arg: 'userInfo', type: 'object'},
	          returns: {arg: 'webData', type: 'object'}
	        }
	);

	/**
	 * Function to Get websites list for current user
	 * 
	 * @param  {object}   userInfo [Logged in user info]
	 * @param  {Function} cb       [callback function to send the response back to client side]
	 * @return {object}            [webpage list]
	 */
	ZoneBuilder.getCurrentWebsiteList = function(userInfo,cb){
		function resolveData(defObj,eachPageId){
			if(eachPageId){
				var pId = eachPageId;
				var params = {
						hostname : config.reviveSetting.hostname ,
						path : config.reviveSetting.restApi+"/pub/"+pId,   
						method: "GET",
						headers: {"Content-type": "application/json"},
						auth : config.reviveSetting.authentication  
				}
				var common = app.models.CommonModel;
				common.getDataFromApi(params,function(err,res){
					if(res){
						if(!res.error){
							
							defObj.resolve(res);
						}
						
					  }else if(err){
						  //console.log('ERR : '+err);
						  defObj.resolve(err);
						  
					  }
				 });
			}
		    				
		}
		if(userInfo){
			var response = {};
			var pageIds = [];
			var resp = [];
			var filter = {'where':{'userId':userInfo.acctownerid,'isdel':0}};
			ZoneBuilder.find(filter,function(err,resp){
				if(!err){
					if(resp.length > 0){
					var groupedList = (_.groupBy(resp, 'webpageid'));
					for(var key in groupedList){
						var eachGrp = groupedList[key][0];
						pageIds.push(eachGrp.webpageid);
		    		}
		    		if(pageIds.length > 0){
		    			var promises = [];
		    			
		    			for(var eachPage in pageIds){
		    				var def = q.defer();
		    				promises.push(def.promise);
		    				var ret = resolveData(def,pageIds[eachPage]);
		    				
		    			}
		    			
		    			
		    			q.all(promises).then(function(resData){
		    				response['webpages'] = resData;
		    				cb(null,response);
		    				
		    			});
		    		}
		    	}else{
		    		response['webpages'] = '';
		    		cb(null,response);
		    	}	
				}
				
			});			
		}
	      
	}
	
	ZoneBuilder.remoteMethod(
			'getCurrentWebsiteList',
	        {
	          http: {path: '/getCurrentWebsiteList', verb: 'get'},
	          accepts:{arg: 'userInfo', type: 'object'},
	          returns: {arg: 'webData', type: 'object'}
	        }
	);
	/**
	 * Function to create screen shot image of the webpage
	 * 
	 * @param  {object}   website [Contains webpage data]
	 * @param  {Function} cb      [callback function to send the response back to client side]
	 * @return {object}           [Contains rendered image info]
	 */
	ZoneBuilder.screenCapture = function(website,cb){
		if(website){
			var def = q.defer();
			var promises = [];
			var pageUrl = website.weburl;    
			var response = {};
			var err = {};
			var hg = 0, wd = 0;
			var web;
			if(pageUrl.indexOf("www") > -1){
				web = pageUrl.split("://www.");
			}else{
				web = pageUrl.split("://");
			}
			var webNm = web[1].split("/"); 
			var height = website.height ? website.height :768;
			var width =  website.width ? website.width :1024; 
			phantom.create("--ignore-ssl-errors=yes", "--ssl-protocol=any", function (ph) {
				ph.createPage(function (page) {
					page.set('viewportSize', {width:width,height:height}, function(){
							page.open(pageUrl, function(status) {
								if(status != 'success'){
									//console.log("ERROR");
									response['isPageOpen'] = false;
									def.resolve(response);
									cb(err,response);
								}else{
									var d = new Date();
									var n = d.getTime();
									page.evaluate(function() {
										  document.body.bgColor = 'white';
									});
									page.render('screencaptures/'+webNm[0]+'_'+n+'.jpeg');
									response['isPageOpen'] = true;
									response['isPageRendered'] = true;
									response['screenPath'] = 'screencaptures/'+webNm[0]+'_'+n+'.jpeg';
									def.resolve(response);
									cb(null, response);
								}

								page.close();
								ph.exit();
								
							});
					});
				});				
			});
			
			
		}
		
	};

	ZoneBuilder.remoteMethod(
			'screenCapture',
	        {
	          http: {path: '/screenCapture', verb: 'get'},
	          accepts:{arg: 'website', type: 'object'},
	          returns: {arg: 'screen', type: 'object'}
	        }
	);
	/**
	 * Function to add zone to revive and local database
	 * 
	 * @param {object}   zonedata [Contains zone info]
	 * @param {Function} cb       [callback function to send the response back to client side]
	 */
	ZoneBuilder.addZone = function(zonedata,cb){
		if(zonedata){
			var common = app.models.CommonModel;
			var webid = parseInt(zonedata.currentWebId);
			var curZoneId;
			var def = q.defer();
			var comments = zonedata.zonename+"_"+Math.random().toString(36).slice(2);
			var postBody =   {
					publisherId:webid,
					zoneName : zonedata.zonename, 
					comments : comments,
					type : 0,
					width : zonedata.zonewidth,
					height : zonedata.zoneheight
			}
			var postString = JSON.stringify(postBody);
			var params = {
					hostname : config.reviveSetting.hostname,                       
					path : config.reviveSetting.restApi+"/zon/new",      
					method: "POST",
					headers: {"Content-type": "application/json","Content-Length": postString.length},
					auth : config.reviveSetting.authentication    
			}
			var response = {};
			var err = {};
			var req = http.request(params, function(res){
				res.on('data', function (chunk) {
					
				});
				res.on('end', function() {
					if(res.statusCode == 200 ){
						response['isSuccess'] = true;
						
					}else {
						response['isSuccess'] = res.statusMessage;
					}
		            def.resolve(response);
				});
				res.on('error', function(exception) { 
			    	//Console.log("error here in creating zone: "+exception); 
			    });
			});
			var e = req.write(postString);
			req.on('error', function(e) {
			    //console.log('problem with request post zone: ' + e.message);
			});
			req.end();
			
			////fetch inserted zone id from revive starts
			var fetchInsertedZoneId = function(){
				var params = {
						hostname : config.reviveSetting.hostname ,
						path : config.reviveSetting.restApi+"/zon/pub/"+webid,   
						method: "GET",
						headers: {"Content-type": "application/json"},
						auth : config.reviveSetting.authentication  
				}
		  	    var defer = q.defer();
				common.getDataFromApi(params,function(err,res){
					var resp = {};
					if(res){
						var zonedata = res.publishers.data;
						var currZone = {};
						for(var eachZone in zonedata){
							if(zonedata[eachZone].comments == comments){
								currZone = zonedata[eachZone];
							}
						}
						if(currZone.zoneId){
							resp["isZone"] = true;
							resp["reviveZoneId"] = parseInt(currZone.zoneId);
						}
						
						defer.resolve(resp);
					}else if(err){
						  //console.log('ERR : '+err);
						  resp["isZone"] = false;
						  defer.resolve(resp);
					  }
				 });
				return defer.promise;
				
			};
			////fetch inserted zone id from revive ends

			///Link zone with campaign starts here 
			/* **** Not to be deleted 
				function to link a zone with campaign. has been commented as we were getting an "Internal Server error"
				with this api. Error was "Unknown banner id". 
				Reference link for the API call :http://www.reviveadserverrestapi.com/api-documentation/management-functions/zone-management/
			***** */
			/*linkZone = function(obj){
				if(obj){
					console.log("inside linkzone 1");
					console.log(obj);
					var linkDef = q.defer();
					var respn = {};
					var pubCampaign = app.models.PublisherCampaign;
					var filter = {"where":{"publisherId":obj.userid,'domainId':obj.domainid,'productId':obj.productid}};
					pubCampaign.find(filter,function(err,res){
						if(res.length > 0){
							console.log("inside linkzone");
							console.log(res);
							var campId = res[0].reviveCampaignId;
							var databody = "test";
							var params = {
								hostname : config.reviveSetting.hostname ,
								path : config.reviveSetting.restApi+"/zon/"+parseInt(obj.zoneid)+"/cam/"+parseInt(campId),   
								method: "POST",
								headers: {"Content-type": "application/json","Content-Length": databody.length},
								auth : config.reviveSetting.authentication  
							}
							
							console.log(params);
							common.postDataToApi(params,databody,function(err,res){
								  if(res){
								  		console.log("common res");
									  	console.log(res);
									  if(res.isCreated == true){
									    	respn["isSuccess"] = true;
									   }else{
									    	respn["isSuccess"] = false;
									   }
								  }else if(err){
								  		console.log("++++error++++");
									  	console.log(err);
									  	respn["isSuccess"] = false;
								  }
								  
								  linkDef.resolve(respn);
							});

						}
					});
			  	    
			  	    return linkDef.promise;
				}
				

			}*/
			///Link zone with campaign ends here
		   ////insert zone data to DB starts
			var insertZone = function(zonedata){
				var zone = {};
				var d = new Date();
				var n = d.getTime();
				var def1 = q.defer();
				
				fetchInsertedZoneId().then(function(res){
					if(res.isZone == true){
						///link zone with campaign starts
						//var linkObj = {"domainid" : zonedata.domainid,"productid":zonedata.productid,"userid":zonedata.userid,"zoneid":res.reviveZoneId};
						/* commented because of error in the api for linking zone with campaign */
						/*linkZone(linkObj).then(function(resp){
							console.log("inside linkzone then");
							console.log(resp);
						});*/
						///link zone with campaign ends

						
						zone['id'] = "";
						zone['webpageid'] = zonedata.currentWebId;
						zone['domainid'] = zonedata.domainid;
						zone['userid'] = zonedata.userid;
						zone['deviceid'] = zonedata.deviceid;
						zone['zoneheight'] = zonedata.zoneheight;
						zone['zonewidth'] = zonedata.zonewidth;
						zone['zonepositionx'] = zonedata.zoneleft;
						zone['zonepositiony'] = zonedata.zonetop;
						zone['zonename'] = zonedata.zonename;
						zone['zoneid'] = res.reviveZoneId;
						zone['screenimage'] = zonedata.imgpath;
						zone['createdat'] = n;
						zone['updatedat'] = n;
						zone['isdel'] = 0;
						ZoneBuilder.create(zone, function(err,data){
							
				           if(err){  
				           	 //console.log(err);
				           	 def1.reject(err); 
				           	 return false; 
				           }
				           else{ 
				           	def1.resolve(data); 
				           }
				        });
					}
				});
				
		        return def1.promise;
				
			};
		    ////insert zone data to DB ends
			
			
			def.promise.then(function(result){
				/// insert zone data in local table 
				insertZone(zonedata).then(function(resp){
					/* TODO : insert zone campaign mapping */
					result['isInserted'] = true;
					cb(null, result);
				});
				
			},function(err){
				cb(err);
			});
			
			
			
		}
	};
	ZoneBuilder.remoteMethod(
			'addZone',
	        {
	          http: {path: '/addZone', verb: 'get'},
	          accepts:{arg: 'zonedata', type: 'object'},
	          returns: {arg: 'status', type: 'object'}
	        }
	);
	/**
	 * Function to modify zone on revive
	 * 
	 * @param  {object}   zoneData [Conatins modified zone info]
	 * @param  {Function} cb       [callback function to send the response back to client side]
	 * @return {object}            [Response status]
	 */
	ZoneBuilder.modifyZone = function(zoneData,cb){
		if(zoneData){
			var common = app.models.CommonModel;
			var webid = parseInt(zoneData.zoneinfo.currentWebId);
			var zid = parseInt(zoneData.zoneId);
			var def = q.defer();
			var zName = zoneData.zoneinfo.zonename.split("( I");
			var zonName = zName[0].trim();
			var postBody = {
					publisherId : webid,
					zoneName : zonName,
					type : 0,
					width : zoneData.zoneinfo.zonewidth,
					height : zoneData.zoneinfo.zoneheight
			}
			var dataBody = JSON.stringify(postBody);
			var params = {
					hostname : config.reviveSetting.hostname,                       
					path : config.reviveSetting.restApi+"/zon/"+zid,    
					method: "POST",
					headers: {"Content-type": "application/json","Content-Length": dataBody.length},
					auth : config.reviveSetting.authentication    
			}
			/*function to update zone data on local table starts */
			var updateZoneData = function(zid,zoneData){
				if(zid){
					var def1 = q.defer();
					var top = zoneData.zoneinfo.zonetop;
					var left = zoneData.zoneinfo.zoneleft;
					var zonename = zonName;
					var d = new Date();
					var n = d.getTime();
					ZoneBuilder.update({"zoneid":zid},{"zonepositionx":left,"zonepositiony":top,"zonename":zonename,"updatedat":n},function(err,res){
						if(err){
							//console.log(err);
							cb(err);}
						else{
							def1.resolve(res);
						}
					});
					
					 return def1.promise;
				}
			};
			/*function to update zone data on local table ends */
			common.postDataToApi(params,dataBody,function(err,res){
				  if(res){
					  if(res.isCreated == true){
						  updateZoneData(zid,zoneData).then(function(resp){
								res["isUpdated"] = true;
								cb(null, res); 
							});
					   }else{
						   res["isUpdated"] = false;
					   }
				  }else if(err){
					  //console.log(err);
					  res["isUpdated"] = false;
				  }
				  
				  //cb(null, respn);
			 });
			
		}
	};
	ZoneBuilder.remoteMethod(
			'modifyZone',
	        {
	          http: {path: '/modifyZone', verb: 'get'},
	          accepts:{arg: 'zoneData', type: 'object'},
	          returns: {arg: 'status', type: 'object'}
	        }
	);
	
	/**
	 * Function to delete zone from revive
	 * 
	 * @param  {string}   zoneId [Id of zone to be deleted]
	 * @param  {Function} cb     [callback function to send the response back to client side]
	 * @return {object}          [Response status]
	 */
	ZoneBuilder.deleteZone = function(zoneId,cb){
		if(zoneId){
			var zid = parseInt(zoneId);
			var updateZoneData = function(zid){
				if(zid){
					var def1 = q.defer();
					ZoneBuilder.update({"zoneid":zid},{"isdel":1},function(err,res){
						if(err){
							//console.log(err);
							cb(err);}
						else{
							def1.resolve(res);
						}
					});
					 return def1.promise;
				}
			};
			var params = {
					hostname : config.reviveSetting.hostname ,
					path : config.reviveSetting.restApi+"/zon/"+zid,   
					method: "DELETE",
					headers: {"Content-type": "application/json"},
					auth : config.reviveSetting.authentication  
			}
			var common = app.models.CommonModel;
			common.deleteDataFromApi(params,function(err,res){
				if(res){
					if(res.isDeleted == true){
						
						updateZoneData(zid).then(function(resp){
							res["isDeletedFromtable"] = true;
							cb(null, res); 
						});
					}else{
						res["isDeletedFromtable"] = false;
						cb(null, res); 
					}
				}else if(err){
					  //console.log('ERR : '+err);
					  cb(err);
				 }
			});
			
			
		}
	};
	ZoneBuilder.remoteMethod('deleteZone',{
				http: {path: '/deleteZone', verb: 'get'},
		        accepts:{arg: 'zoneId', type: 'string'},
		        returns: {arg: 'status', type: 'object'}
	});
	/**
	 * Function to delete webpage from revive
	 * 
	 * @param  {number}   pageId [Webpage id]
	 * @param  {Function} cb     [callback function to send the response back to client side]
	 * @return {object}          [Response status]
	 */
	ZoneBuilder.deleteWebpage = function(pageId,cb){
		if(pageId != null || pageId != undefined ){
			var updateZoneData = function(pid){
				if(pid){
					var def1 = q.defer();
					ZoneBuilder.update({"webpageid":pid},{"isdel":1},function(err,res){
						if(err){
							console.log(err);
							cb(err);}
						else{
							def1.resolve(res);
						}
					});
					return def1.promise;
				}
			};

			var params = {
					hostname : config.reviveSetting.hostname ,
					path : config.reviveSetting.restApi+"/pub/"+pageId,   
					method: "DELETE",
					headers: {"Content-type": "application/json"},
					auth : config.reviveSetting.authentication  
			}
			var common = app.models.CommonModel;
			
			common.deleteDataFromApi(params,function(err,res){
				if(res){
					if(res.isDeleted == true){
						updateZoneData(pageId).then(function(resp){
							res["isDeletedFromtable"] = true;
							cb(null, res); 
						});
					}else{
						res["isDeletedFromtable"] = false;
						cb(null, res); 
					}
				}else if(err){
					  //console.log('ERR : '+err);
					  cb(err);
				 }
			});

		}

	};
	ZoneBuilder.remoteMethod('deleteWebpage',{
				http: {path: '/deleteWebpage', verb: 'get'},
		        accepts:{arg: 'pageId', type: 'number'},
		        returns: {arg: 'status', type: 'object'}
	});
	
	/**
	 * Function to get added zone list for each webpage
	 * 
	 * @param  {string}   webId [id of webpage]
	 * @param  {Function} cb    [callback function to send the response back to client side]
	 * @return {object}         [List of zones]
	 */
	ZoneBuilder.getZoneList = function(webId,cb){
		if(webId){
			var filter = {"where":{"webpageId":parseInt(webId),'isDel':0},"order":"id ASC"};
			ZoneBuilder.find(filter,function(err,zones){
				if(zones){
					if(zones.length > 0){
						for (var eachZn in zones){
							var nHeight = Math.ceil(parseInt(zones[eachZn].zoneheight/10)*3);
							var nWidth = Math.ceil(parseInt(zones[eachZn].zonewidth/10)*3);
							if(nHeight > 70) nHeight = 70;
							if(nWidth > 145) nWidth = 145;
							zones[eachZn].znHght = nHeight;
							zones[eachZn].znWdth = nWidth;
						}
						cb(null, zones);
					}else{
						cb({"zones missing" : "There is no zone entered"});
					}
				}else if(err){
					cb(null, err);
				}
			});
		}
		
	};
	ZoneBuilder.remoteMethod(
			'getZoneList',
			{
				http: {path: '/getZoneList', verb: 'get'},
		        accepts:{arg: 'webId', type: 'string'},
		        returns: {arg: 'zonelist', type: 'object'}
			}
	
	);
	/**
	 * Function to generate invocation code for each zone
	 * 
	 * @param  {String}   zoneId [Zone id]
	 * @param  {Function} cb     [callback function to send the response back to client side]
	 * @return {object}          [Invocation code]
	 */
	ZoneBuilder.getInvoCode = function(zoneId,cb){
		var zid = parseInt(zoneId);
		var def = q.defer();
		var cnt = 0;
		var temp = [];
		var postBody =   {
				"code_type": "adjs"
		}
		var dataBody = JSON.stringify(postBody);
		var params = {
				hostname : config.reviveSetting.hostname ,
				path : config.reviveSetting.restApi+"/zon/"+zid+"/ic/",
				method: "POST",
				headers: {"Content-type": "application/json","Content-Length":dataBody.length}, 
				auth : config.reviveSetting.authentication   
		}
		var req = http.request(params,function(res){
		      
			 res.on('data', function (chunk) {
		     	var newdata = chunk.toString("ascii");
		       	temp.push(newdata);
		     });
			 res.on('end', function() {
		     	var dataLen = temp.length;
		         var dataChildren = '';
		         if(dataLen > 1){
						for(var i=0;i<dataLen;i++){
							dataChildren += temp[i];
						}
					}else{
						dataChildren = temp[0];
					}
		           var arrRes = JSON.parse(dataChildren);
		           def.resolve(arrRes);
				});
		     res.on('error', function(exception) { 
		     	//Console.log("error here in invocation code: "+exception); 
		     }); 
				
		});
		var e = req.write(dataBody);
		req.end();
	      def.promise.then(function(result){
	    	  result['isCode'] = true;
	          cb(null, result);
	      },function(err){
	          cb(err);
	      });
		
	};
	ZoneBuilder.remoteMethod(
			'getInvoCode',{
				http: {path: '/getInvoCode', verb: 'get'},
				accepts:{arg: 'zoneId', type: 'string'},
				returns: {arg: 'invcode', type: 'object'}
			}
	);
	/**
	 * Function to send notification mail to user
	 * 
	 * @param  {object}   notifyData [Contains data to be send]
	 * @param  {Function} cb         [callback function to send the response back to client side]
	 * @return {object}              [Response status]
	 */
	ZoneBuilder.sendNotification = function(notifyData,cb){
		function resolveData(defObj,uId){
			pecuUsers.findById(uId, function(error, subusers){
				if(subusers){
					var toMail = subusers.email;
					var resp = {};
					emailBody = emailBody.replace("###USERNAME###", subusers.username);
					var mailOptions = {
			    			from: fromEmail, // sender address
			    			to: toMail, 
			    			subject: "Neue Zonen erstellt", // Subject line
			    			html: emailBody // html body
						};
					
					transporter.sendMail(mailOptions, function(error, info){
			      		if(error){
			      			//console.log("inside error");
			          		//console.log(error);
			          		resp["isSent"] = false;
			          		resp["data"] = error;
			          		defObj.resolve(resp);
			      		}else{
			      			var obj = {"mailsentto": toMail};
			      			resp["isSent"] = true;
			          		resp["data"] = obj;
			      			defObj.resolve(resp);
			      		}
			       });
				}
			});
		}
		if(notifyData){
			var ctx = loopback.getCurrentContext();
			var currentUser = ctx && ctx.get('currentUser');
			var pecuUsers = app.models.PecunioUser;
			var transporter = nodemailer.createTransport(config.smtpmailsetting);
			var emailBody = fs.readFileSync('server/emailtemplate/notifyUsersForZone.html',"utf8");
			emailBody = emailBody.replace("###PORTAL###", notifyData.domain);
			var webPages = notifyData.webpage;
			var users = notifyData.users;
			var message = "";
			for(var eachWeb in webPages ){
				var webP = webPages[eachWeb];
				message += '<tr><td class="panel" style="background: #ECF8FF;border: 0;padding: 10px !important;">';
				message += webP.website;
				message += '</td><td class="expander"></td>';
			}
			emailBody = emailBody.replace("###WEB_PAGES###", message);
			var fromEmail = currentUser.email;
			var promises = [];

			for(var eachUser in users){
				var uId = users[eachUser];
				var def = q.defer();
				promises.push(def.promise);
				resolveData(def,uId);
			}
			
			q.all(promises).then(function(resData){
				cb(null,resData);
			});
			
		}
	};
	ZoneBuilder.remoteMethod(
			'sendNotification',{
				http: {path: '/sendNotification', verb: 'get'},
				accepts:{arg: 'notifyData', type: 'object'},
				returns: {arg: 'status', type: 'object'}
			}
	);
	
};
