/**
 * Model file to communicate with database and also to make API calls to revive. 
 * Purpose: Get List of users Ad.
 *			Managing Ad on revive as well as in pecunio db (Save, Update, delete ad).
 * Author Aradhana <aradhana.rani@netzrezepte.de>


/**
 * List of node modules required
 */
var app = require('../../server/server.js');
var express = require('express');
var https = require("http"); 
var path    = require('path');
var fs      = require('fs');
var q =require('q');
var momentTz = require('moment-timezone');
var config = require('../../server/config');
var bcrypt = require('bcrypt');
var _ = require('underscore');
var loopback = require('loopback');

module.exports = function(AdvModel) {

	var partner_forms = app.models.PartnerForms;
	var AdmappingDataModel = app.models.AdMappingDataModel;
	var CustomAd = app.models.CustomAd;

  	/* 
  	* 
  	* Save Advertisement according to category to different
  	*
  	* tables partner_forms, custom Ad and revive
  	* @params  {object}	 addata
  	* @param  {Function} cb
  	* @return {object}   status
  	*
  	*/

	AdvModel.saveAdv = function(addata,cb){

		var partner_forms = app.models.PartnerForms;
	    var AdmappingDataModel = app.models.AdMappingDataModel;
	    var PublisherCampaign = app.models.PublisherCampaign;
	    var CustomAd = app.models.CustomAd;

		if(addata){
			//var def = q.defer();
			var templateID = addata.templateId;
			var categoryID = addata.categoryId;
			//var campaignId = 1;
			var FD_ENDPOINT = config.reviveSetting.hostname;  ///revive.opendingo.com
			var baseUrl = addata.baseUrl;
			
			
		
			////insert Ad data 
			var insertAd = function(addata){ 

				var ad = {};
				var adInfo = {};
				var def1 = q.defer();
				var currentDt = AdvModel.getCurrentDate();
				
				var randomId   = (Math.floor(Math.random()*90000) + 10000).toString();

				var slotId = bcrypt.hashSync(randomId, 2);

				if(addata.tablename == 'partner_forms'){ //saving to partner form

					ad['crdate'] = currentDt;
					ad['tstamp'] = currentDt;
					ad['branch'] = addata.branch;
					ad['slotId'] = slotId;
					ad['affiliatePartnerUid'] = addata.affiliate_partner_uid;
					ad['affiliateTypeUid'] = addata.affiliate_type_uid;
					ad['mainColor'] = addata.adMainColor;
					ad['textColor'] = addata.adTextColor;
					ad['backgroundColor'] = addata.adBgColor;
					ad['borderColor'] = addata.adBorderColor;
					ad['buttonColor'] = addata.adButtonColor;
					ad['schemaType'] = addata.selectedSchemaType;
					ad['buttonBg'] = addata.adButtonbgColor;
					ad['buttonBgRadial'] = '';
					ad['buttonTextNoshadow'] = 0;
					ad['checkBg'] = '#73c08f';
					ad['xsellingBu'] = 0;
					ad['xsellingPflege'] = 0;
					ad['domain'] = 'www.test.com';
					ad['sparteUid'] = addata.productId;
					ad['privacy'] = 'http://www.pecunio.de/ueber-uns/impressum#datenschutz';
					ad['campaignId'] = '';
					ad['showBonus'] = 0;
					ad['footerColor'] = '';
					
					
					partner_forms.create(ad, function(err,data){
						
			           if(err){  
				           
				           	def1.reject(err); 
				           	return false; 
			           } 
			           else{ 
			           		adInfo['ad_Details'] = data;
			           		def1.resolve(adInfo);
			           }

			        });
			        
					return def1.promise;
				}
				else{
					// saving to customAd

					ad['name'] = addata.name;
					ad['slotid'] = slotId;
					ad['userid'] = addata.userId;
					ad['adjsoncontent'] = addata.adJsonContent;
					ad['basetemplateid'] = addata.baseTemplateId;
					ad['url'] = config.adSetting.baseurl+'?slot_id='+slotId;
					ad['categoryid'] = addata.categoryId;
					ad['productid'] = addata.productId;
					ad['created'] = currentDt;
					ad['updated'] = currentDt;
					
					
					CustomAd.create(ad, function(err,data){ 
						
			           if(err){ 
				           	def1.reject(err); 
				           	return false; 
			           } 
			           else{ 
			           		adInfo['ad_Details'] = data;
			           		def1.resolve(adInfo);
			           }

			        });
			        
					return def1.promise;
				}
				
			};
		    
			var getCampaignId = function(adInfo){
	            var ctx = loopback.getCurrentContext();
	            var currentUser = ctx && ctx.get('currentUser');
	            var d_id = parseInt(adInfo.domainId);
	            var pubId = currentUser.id;	

	            var d = q.defer();
	            

	            PublisherCampaign.find({where: {and: [ {publisherId: pubId}, {domainId: d_id}, {productId: addata.productId} ]}}, function(err, data) {
	            	
	              if(err) {
	                cb(err);
	              } else {
	              	

	              	var adId = (addata.tablename == 'partner_forms')? adInfo.ad_Details.uid : adInfo.ad_Details.id;
	              	
	              	var datalist = [];

					var reviveCampaignId = data[0].reviveCampaignId;
					

					var newslotId = (addata.tablename == 'partner_forms')? adInfo.ad_Details.slotId : adInfo.ad_Details.slotid;

					var customAdUrl =  (addata.tablename != 'partner_forms')? adInfo.ad_Details.url : '';
					
           			insertAdOnRevive(adId, reviveCampaignId, data[0].domainId, newslotId, customAdUrl).then(function(res){
	           			adInfo['revive_adDetails'] = res;

	           			adInfo['reviveAdId'] = res.bannerId;
	           			adInfo['domainId'] = data[0].domainId;
	           			
	           			saveAdMappingInfo(adInfo).then(function(result){
	           				
		           			datalist.push(adInfo);
							d.resolve(datalist);
						});
						 
			    	});
					
	              }
	            });
	            return d.promise;

	        }

		    var insertAdOnRevive = function(insertedAdId, campaignId, domainId, newslotId, customAdUrl){
		    	var def1 = q.defer();
		    	var postString;
		    	var postBody = {};
		    	var htmltemplate = "";
		    	if(customAdUrl != ""){
		    		htmltemplate = "<iframe frameborder='0' src='"+customAdUrl+"'></iframe>";
		    	}
		    	else{
		    		htmltemplate = "<iframe frameborder='0' src='"+baseUrl+"?slot_id="+newslotId+"'></iframe>";
		    	}
		    	
		    	
		    	var bannerName = "banner-"+addata.categoryId+"-"+domainId+"-"+insertedAdId;
				postBody =   {
						  "campaignId":campaignId,
						  "bannerName":bannerName,
						  "storageType":"html",
						  "htmlTemplate": htmltemplate
				}
				
				postString = JSON.stringify(postBody);

				var params = {
						hostname : FD_ENDPOINT ,
						path : config.reviveSetting.restApi+"/bnn/new", 
						method: "POST",
						headers: {"Content-type": "application/json","Content-Length": postString.length},
						auth : config.reviveSetting.authentication    ////'admin:aDw!nLtT[0#Se'
				} 

				var response = {};
				var err = {};
				var req = https.request(params, function(res){
					
					res.on('data', function (chunk) { 

						if(res.statusCode == 200 ){
							response['isSuccess'] = true;
							
						}else {
							response['isSuccess'] = res.statusMessage;
						}

						// start get the last inserted ID
						getReviveAdList(campaignId).then(function(list){ 
			           			 // filter out last inserted row
			           			 var filterTerm = "banner-"+addata.categoryId+"-"+domainId+"-"+insertedAdId;
			           			 var filterRow = {};
			           			 filterRow = _.findWhere(list, {bannerName: filterTerm});

			           			 // filter out last inserted row

								 def1.resolve(filterRow); 
					    });
						// end get the last inserted ID

					});
					res.on('end', function() {
						
					});
				});
				var e = req.write(postString);
				req.end(); 
				return def1.promise;
			}



			var getReviveAdList = function(campaignId){
				
				var def1 = q.defer();
				var cnt1 = 0;
				var temp1 = [];
				var response1 = {};
				var err1 = {};

				var listparams = {
						hostname : FD_ENDPOINT ,
						path : config.reviveSetting.restApi+"/bnn/cam/"+campaignId, 
						method: "GET",
						headers: {"Content-type": "application/json"},
						auth : config.reviveSetting.authentication    ////'admin:aDw!nLtT[0#Se'
				} 

				
			    var req1 = https.request(listparams, function(res){
			        res.on('data', function (chunk) {
			         	var newdata = chunk.toString("ascii");
			           	temp1.push(newdata);
			         });
			        
			        res.on('end', function() {
			        	var dataLen = temp1.length;
			            var dataChildren = '';
			            
			            if(dataLen > 1){
							for(var i=0;i<dataLen;i++){
								dataChildren += temp1[i];
							}
						}else{
							dataChildren = temp1[0];
						}
			            var arrRes = JSON.parse(dataChildren);
			        	def1.resolve(arrRes);
			        	//def1.resolve(temp1);
					});
			        
			        res.on('error', function(exception) { 
			        	//Console.log("error here : "+exception); 
			        });
			    }).end();

			    return def1.promise;
				
			}


			var saveAdMappingInfo = function(resp){
				var adMappingDetails = {};
				var def1 = q.defer();


				//saving to AdZoneMapping table
				if(addata.tablename == 'partner_forms'){
					adMappingDetails['userId'] = resp.ad_Details.affiliatePartnerUid;
					adMappingDetails['adId'] = resp.ad_Details.uid;
					adMappingDetails['templateId'] = templateID;
					adMappingDetails['categoryId'] = categoryID;
					adMappingDetails['domainId'] = resp.domainId;
					adMappingDetails['isDeleted'] = 0;
					adMappingDetails['reviveAdid'] = resp.reviveAdId;
					adMappingDetails['status'] = 0;
				}
				else{
					adMappingDetails['userId'] = resp.ad_Details.userid;
					adMappingDetails['adId'] = resp.ad_Details.id;
					adMappingDetails['templateId'] = resp.ad_Details.basetemplateid;
					adMappingDetails['categoryId'] = categoryID;
					adMappingDetails['domainId'] = resp.domainId;
					adMappingDetails['isDeleted'] = 0;
					adMappingDetails['reviveAdid'] = resp.reviveAdId;
					adMappingDetails['status'] = 0;
				}
				
				AdmappingDataModel.create(adMappingDetails, function(err,data){
		           if(err){  
			           	def1.reject(err); 
			           	return false; 
		           } 
		           else{ 

		           		def1.resolve(data); 
		           }
		        });
				return def1.promise;
			}

			var tmp = []; 
			var retrunObj = {};
			insertAd(addata).then(function(result){ 
				var tempArr = [];


				// save ad info to admapping for each domain

				addata.domainArr.forEach(function(eachDomain){ 
           			var def2 = q.defer();
					tempArr.push(def2.promise);

					result['domainId'] = eachDomain

	           		getCampaignId(result).then(function(response){ 

	           			if(addata.tablename == 'partner_forms'){
							retrunObj['adId'] = result.ad_Details.uid;
						}
						else{
							retrunObj['adId'] = result.ad_Details.id;
						}
						retrunObj['categoryId'] = addata.categoryId;
	           			retrunObj['isInserted'] = true;
	           			def2.resolve(retrunObj);
	           		});
	           	});

	           	q.all(tempArr).then(function(results) {
					  cb(null, results);
				});
				
			});
			
			
		}
	};
	AdvModel.remoteMethod(
			'saveAdv',
	        {
	          http: {path: '/saveAdv', verb: 'post'},
	          accepts:[{arg: 'addata', type: 'object' , required: true, http: { source: 'body' }}],
	          returns: {arg: 'status', type: 'object'}
	        }
	);


	/**
    * Delete ad revive and updates isDeleted = 1 in db 
    *
    * @params  {object}	 addata
  	* @param  {Function} cb
    * @return {object}   status
    */
    AdvModel.deleteAd = function(addata, cb) {
      
      var partner_forms = app.models.PartnerForms;
      var CustomAd = app.models.CustomAd;
	  var AdmappingDataModel = app.models.AdMappingDataModel;

     	var deleteAdFromRevive = function(reviveAdId){
     		var def = q.defer();
     		var FD_ENDPOINT = config.reviveSetting.hostname;  ///revive.opendingo.com
			var params = {
					hostname : FD_ENDPOINT ,
					path : config.reviveSetting.restApi+"/bnn/"+reviveAdId, 
					method: "DELETE",
					headers: {"Content-type": "application/json"},
					auth : config.reviveSetting.authentication  
			} 

			var response = {};
			var err = {};
			var req = https.request(params, function(res){
				
				res.on('data', function (chunk) {
					
					if(res.statusCode == 200 ){
						response['isSuccess'] = true;
						
					}else {
						response['isSuccess'] = res.statusMessage;
					}
		            def.resolve(response);
				});
				res.on('end', function() {
					
				});
			});
			//var e = req.write(postString);
			req.end(); 
			return def.promise;
     	}

     	var deleteAdMappingInfo = function(eachdata){
     		var def = q.defer();

			deleteAdFromRevive(eachdata.reviveAdid).then(function(err,response){
				if(err){
        			cb(err);
				}
				else{
					AdmappingDataModel.destroyById(eachdata.id, function(err,data){
						def.resolve(true);
					});
				}
		    });
     		return def.promise;
     	}


     	
     	var dataList = [];

     	function resolveDelete(def2,eachData){
			AdmappingDataModel.destroyById(eachData.id, function(err,data){
				if(err){
        			def2.resolve(false); 
				}
				else{
					deleteAdFromRevive(eachData.reviveAdid).then(function(){
						def2.resolve(true); 
					});
				}
			});
		}

     	if(addata.tablename == 'partner_forms'){
     		
     		partner_forms.update({"uid" : addata.adId}, {"isDeleted": 1}, function(err,data){

				if(err) {
					cb(err);
				} 
				else {
					AdmappingDataModel.find({where: {adId : addata.adId, categoryId : addata.categoryId}}, function(err,data){
						if(err) {
							cb(err);
						}
						else {
							var tmp = [];

							data.forEach(function(eachData){ 
								var def2 = q.defer();
				    			tmp.push(def2.promise);
				    			resolveDelete(def2,eachData);
								
							});
							

							q.all(tmp).then(function(results) {
								cb(null, results);
							});
						}
					});
				}
	        });
     	}
     	else{

     		CustomAd.update({"id" : addata.adId}, {"isDeleted": 1}, function(err,data){
     			if(err) {
					cb(err);
				} 
				else {
					AdmappingDataModel.find({where: {adId : addata.adId, categoryId : addata.categoryId}}, function(err,data){
						if(err) {
							cb(err);
						}
						else {
							var tmp = [];

							

							data.forEach(function(eachData){ 
								var def2 = q.defer();
				    			tmp.push(def2.promise);
				    			resolveDelete(def2,eachData);
								
							});
							

							q.all(tmp).then(function(results) {
								cb(null, results);
							});
						}
					});
				}
	        });
     	} 
           
    };
     
    AdvModel.remoteMethod(
        'deleteAd', 
        {
          accepts: [{arg: 'addata', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'status', type: 'object'},
          http: {verb: 'post'}
        }
    ); 


	/*
	* Get current date
	* @return {string}   currentDt
	*
	*/
	AdvModel.getCurrentDate = function(){
      var t = momentTz().tz("America/New_York");
      t.set('hour', 0);
      t.set('minute', 0);
      t.set('second', 0);
      t.set('millisecond', 0);
      var currentDt = t.utc().valueOf();
      return currentDt;
    }


   

	/*
	* Get List of partner forms
	*
	* @params  {object}	 filterData
  	* @param  {Function} cb
  	* @return {object}   response
	*/
	AdvModel.getList = function(filterData, cb) {
		

		partner_forms.find({}, function(err, templateSet) {
				var curtplSet;
				if(err) {
					cb(err);
				} else {
					templateSet.forEach(function(response) {	
						curtplSet = response;
					});
					cb(null, templateSet);
				}
			});
		}

	AdvModel.remoteMethod(
	    'getList', 
	    {
	      http: {path: '/getList', verb: 'get'},
	      accepts: [{arg: 'arg', type: 'string'}],
	      returns: {arg: 'response', type: 'object'}
	    }
	);

	/* 
  	* 
  	* update Adv according to category to different
  	*
  	* tables partner_forms, customAd
  	* @params  {object}	 addata
  	* @param  {Function} cb
  	* @return {object}   status
  	*/

	AdvModel.updateAdv = function(addata,cb){

		var partner_forms = app.models.PartnerForms;
	    var AdmappingDataModel = app.models.AdMappingDataModel;
	    var PublisherCampaign = app.models.PublisherCampaign;
	    var CustomAd = app.models.CustomAd;

		if(addata){
			//var def = q.defer();
			var templateID = addata.templateId;
			var categoryID = addata.categoryId;
			//var campaignId = 1;
			var FD_ENDPOINT = config.reviveSetting.hostname;  ///revive.opendingo.com
			var baseUrl = addata.baseUrl;
			
			
		
			////insert Ad data 
			var updateAd = function(addata){ 

				var ad = {};
				var adInfo = {};
				var def1 = q.defer();
				var currentDt = AdvModel.getCurrentDate();
				
				var randomId   = (Math.floor(Math.random()*90000) + 10000).toString();

				//var slotId = bcrypt.hashSync(randomId, 2);

				if(addata.tablename == 'partner_forms'){ //saving to partner form

					ad['branch'] = addata.branch;
					ad['mainColor'] = addata.adMainColor;
					ad['textColor'] = addata.adTextColor;
					ad['backgroundColor'] = addata.adBgColor;
					ad['borderColor'] = addata.adBorderColor;
					ad['buttonColor'] = addata.adButtonColor;
					ad['schemaType'] = addata.selectedSchemaType;
					ad['buttonBg'] = addata.adButtonbgColor;
					
					
					partner_forms.update({"uid" : addata.id}, ad, function(err,data){
						
			           if(err){  
				           
				           	def1.reject(err); 
				           	return false; 
			           } 
			           else{ 

			           		adInfo['ad_Details'] = data;
			           		def1.resolve(adInfo);
			           		
			           }

			        });
			        
					return def1.promise;
				}
				else{
					// saving to customAd

					ad['name'] = addata.name;
					ad['adjsoncontent'] = addata.adJsonContent;
					ad['updated'] = currentDt;
					
					
					CustomAd.update({"id" : addata.id}, ad, function(err,data){
						
			           if(err){ 
				           	def1.reject(err); 
				           	return false; 
			           } 
			           else{ 

			           		adInfo['ad_Details'] = data;
			           		def1.resolve(adInfo);
			           }

			        });
			        
					return def1.promise;
				}
				
			};
		    

		    var deleteReviveAd =  function(reviveAdId){ 
	     		var def = q.defer();
	     		var FD_ENDPOINT = config.reviveSetting.hostname;  ///revive.opendingo.com
				var params = {
						hostname : FD_ENDPOINT ,
						path : config.reviveSetting.restApi+"/bnn/"+reviveAdId, 
						method: "DELETE",
						headers: {"Content-type": "application/json"},
						auth : config.reviveSetting.authentication  
				} 

				var response = {};
				var err = {};
				var req = https.request(params, function(res){
					
					res.on('data', function (chunk) {
						if(res.statusCode == 200 ){
							response['isSuccess'] = true;
							
						}else {
							response['isSuccess'] = res.statusMessage;
						}
			            def.resolve(response);
					});
					res.on('end', function() {
						
					});
				});
				req.end(); 
				return def.promise;
		    }


		    var processUpdateAdData = function(){ 

		    	var d = q.defer();
		    	
		    	var delArr =[];
		    	var newDomainArr = [];

		    	AdmappingDataModel.find({where: {and: [ {adId: addata.id}, {categoryId: categoryID}, {isDeleted: 0} ]}}, function(err, data) {
		    		
					data.forEach(function(eachData){

						if(!(_.contains(addata.domainArr, eachData.domainId.toString()))){
							var deletedMappingIdObj = {};
							deletedMappingIdObj["id"] = eachData.id;
							deletedMappingIdObj["reviveAdid"]  = eachData.reviveAdid;
							deletedMappingIdObj["domainId"]  = eachData.domainId;
							delArr.push(deletedMappingIdObj);
						}
						
					});
					
					function resolveDelete(deldef,mapdata){

						AdmappingDataModel.destroyById(mapdata.id, function(err,data){
							if(err){
								//console.log('inside err of delete ::  '+err);
		            			deldef.resolve(false); 
							}
							else{
								deleteReviveAd(mapdata.reviveAdid).then(function(){
									deldef.resolve(true); 
								});
							}
						});
					}

					// delete from admapping and revive
					var delPromise = [];
					if(delArr.length>0){

						

						delArr.forEach(function(mapdata){
							var deldef = q.defer();
							delPromise.push(deldef.promise);
							resolveDelete(deldef,mapdata);
						});

						

						q.all(delPromise).then(function(res){
							d.resolve(true); 
						});
					}
					else{
						d.resolve(true); 
					}
					
		        });
				return d.promise;
		    }

		    var saveAdForNewDomain = function(adInfo, domainId){
		    	var ctx = loopback.getCurrentContext();
	            var currentUser = ctx && ctx.get('currentUser');
	            var pubId = currentUser.id;	
	            var d = q.defer();

    			// insert one
        		PublisherCampaign.find({where: {and: [ {publisherId: pubId}, {domainId: parseInt(domainId)}, {productId: adInfo.productId} ]}}, function(err, data) {

		            if(err) {
		                cb(err);
		            } 
		            else { 
		              	var adId = adInfo.id;
		              	var datalist = [];
						var reviveCampaignId = data[0].reviveCampaignId;
						var url = adInfo.url;
						
	           			insertAdOnRevive(adId, reviveCampaignId, parseInt(domainId), url).then(function(res){

		           			adInfo['revive_adDetails'] = res;
		           			adInfo['reviveAdId'] = res.bannerId;
							
		           			saveAdMapping(adInfo,domainId).then(function(result){
			           			datalist.push(adInfo);
								d.resolve(datalist);
							});
				    	});
		            }
	            });
				return d.promise;
		    }

		    var insertAdOnRevive = function(insertedAdId, campaignId, domainId, url){
		    	var def1 = q.defer();
		    	var postString;
		    	var postBody = {};
		    	var htmltemplate = "<iframe frameborder='0' src='"+url+"'></iframe>";
		    	
		    	//var bannerName = "banner-"+insertedAdId;
		    	var bannerName = "banner-"+addata.categoryId+"-"+domainId+"-"+insertedAdId;
				postBody =   {
						  "campaignId":campaignId,
						  "bannerName":bannerName,
						  "storageType":"html",
						  "htmlTemplate": htmltemplate
				}
				
				postString = JSON.stringify(postBody);

				var params = {
						hostname : FD_ENDPOINT ,
						path : config.reviveSetting.restApi+"/bnn/new", 
						method: "POST",
						headers: {"Content-type": "application/json","Content-Length": postString.length},
						auth : config.reviveSetting.authentication    ////'admin:aDw!nLtT[0#Se'
				} 

				var response = {};
				var err = {};
				var req = https.request(params, function(res){
					
					res.on('data', function (chunk) { 

						if(res.statusCode == 200 ){
							response['isSuccess'] = true;
							
						}else {
							response['isSuccess'] = res.statusMessage;
						}

						// start get the last inserted ID
						getReviveAdList(campaignId).then(function(list){ 
			           			 // filter out last inserted row
			           			 var filterTerm = "banner-"+addata.categoryId+"-"+domainId+"-"+insertedAdId;
			           			 var filterRow = {};
			           			 filterRow = _.findWhere(list, {bannerName: filterTerm});
			           			 // filter out last inserted row
								 def1.resolve(filterRow); 
					    });
						// end get the last inserted ID

					});
					res.on('end', function() {
						
					});
				});
				var e = req.write(postString);
				req.end(); 
				return def1.promise;
			}



			var getReviveAdList = function(campaignId){
				
				var def1 = q.defer();
				var cnt1 = 0;
				var temp1 = [];
				var response1 = {};
				var err1 = {};

				var listparams = {
						hostname : FD_ENDPOINT ,
						path : config.reviveSetting.restApi+"/bnn/cam/"+campaignId, 
						method: "GET",
						headers: {"Content-type": "application/json"},
						auth : config.reviveSetting.authentication    ////'admin:aDw!nLtT[0#Se'
				} 

				
			    var req1 = https.request(listparams, function(res){
			        res.on('data', function (chunk) {
			         	var newdata = chunk.toString("ascii");
			           	temp1.push(newdata);
			         });
			        
			        res.on('end', function() {
			        	var dataLen = temp1.length;
			            var dataChildren = '';
			            
			            if(dataLen > 1){
							for(var i=0;i<dataLen;i++){
								dataChildren += temp1[i];
							}
						}else{
							dataChildren = temp1[0];
						}
			            var arrRes = JSON.parse(dataChildren);
			        	def1.resolve(arrRes);
					});
			        
			        res.on('error', function(exception) { 
			        	//Console.log("error here : "+exception); 
			        });
			    }).end();

			    return def1.promise;
				
			}


			var saveAdMapping = function(resp,domainId){ 
				var adMappingDetails = {};
				var def1 = q.defer();
				var ctx = loopback.getCurrentContext();
	            var currentUser = ctx && ctx.get('currentUser');
				var pubId = currentUser.id;	

				//saving to AdZoneMapping table
				if(addata.tablename == 'partner_forms'){
					adMappingDetails['userId'] = pubId;
					adMappingDetails['adId'] = resp.id;
					adMappingDetails['templateId'] = templateID;
					adMappingDetails['categoryId'] = categoryID;
					adMappingDetails['domainId'] = domainId;
					adMappingDetails['isDeleted'] = 0;
					adMappingDetails['reviveAdid'] = resp.reviveAdId;
					adMappingDetails['status'] = 0;
				}
				else{
					adMappingDetails['userId'] = pubId;
					adMappingDetails['adId'] = resp.id;
					adMappingDetails['templateId'] = templateID;
					adMappingDetails['categoryId'] = categoryID;
					adMappingDetails['domainId'] = domainId;
					adMappingDetails['isDeleted'] = 0;
					adMappingDetails['reviveAdid'] = resp.reviveAdId;
					adMappingDetails['status'] = 0;
				}
				
				AdmappingDataModel.create(adMappingDetails, function(err,data){
		           if(err){  
			           	def1.reject(err);
			           	return false; 
		           } 
		           else{ 

		           		def1.resolve(data); 
		           }
		        });
				return def1.promise;
			}


			var tmp = []; 
			var retrunObj = {};
			updateAd(addata).then(function(result){ 
				var tempArr = [];
				var tmpAdPromise = [];

				processUpdateAdData().then(function(response){ 
					var processDef = q.defer();
					tmpAdPromise.push(processDef.promise);
						

						addata.domainArr.forEach(function(eachDomain){ // inserting ad in campaign for the corresponding domain on Revive if new domain is added.
							var domainDef = q.defer();
							addata['domainId'] = eachDomain;
							tmpAdPromise.push(domainDef.promise);
							resolveAdd(domainDef,eachDomain);

						});

						function resolveAdd(domainDef,eachDomain){
							var adInfo = addata;
				            var ctx = loopback.getCurrentContext();
				            var currentUser = ctx && ctx.get('currentUser');
				            var pubId = currentUser.id;	

							AdmappingDataModel.find({where: {and: [ {adId: addata.id}, {domainId: parseInt(eachDomain)}, {categoryId: addata.categoryId} ]}}, function(err, data) {
		           				if(err){
			            			domainDef.resolve(false); 
			            		}
			            		else{

			            			if(data.length == 0){
				            			saveAdForNewDomain(adInfo, eachDomain).then(function(response){  


										 	retrunObj = {};
											retrunObj['adId'] = addata.id;
											retrunObj['categoryId'] = addata.categoryId;
											retrunObj['domain'] = eachDomain;
						           			retrunObj['isInserted'] = true;
											domainDef.resolve(retrunObj); 
										});
				            		}
				            		else{
				            			retrunObj = {};
				            			retrunObj['adId'] = addata.id;
										retrunObj['categoryId'] = addata.categoryId;
										retrunObj['domain'] = eachDomain;
					           			retrunObj['isInserted'] = true;
				            			domainDef.resolve(retrunObj);
				            		}

			            		}
		           			});
						}

						
				});
				
				q.all(tmpAdPromise).then(function(res){
					cb(null,true);
				});
				
			});
			
			
		}
	};
	AdvModel.remoteMethod(
			'updateAdv',
	        {
	          http: {path: '/updateAdv', verb: 'post'},
	          accepts:[{arg: 'addata', type: 'object' , required: true, http: { source: 'body' }}],
	          returns: {arg: 'status', type: 'object'}
	        }
	);

}