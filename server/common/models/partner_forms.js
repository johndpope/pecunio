/**
 * Model file to communicate with database ia_rechner_dev. 
 * Purpose: Get List of FORM Ads of logged user.
 * Author Aradhana <aradhana.rani@netzrezepte.de>
 */


var q = require("q");
var app = require('../../server/server.js');


module.exports = function(partner_forms) {

	/**
	 * Function to get Ad list of logged user maintaining some relations.
	 * 
	 * @param  {object}   filterData
	 * @param  {Function} cb   
	 * @return {object}   response   
	 */
	partner_forms.getList = function(filterData, cb) {
		if(filterData != undefined){
		
			partner_forms.find({where: {"affiliatePartnerUid" : filterData.affiliatePartnerUid}}, function(err, templateSet) {
				var curtplSet;
				if(err) {
					cb(err);
				} else {
					templateSet.forEach(function(response) {	
						curtplSet = response;
						//console.log(curtplSet);

					});
					cb(null, templateSet);
				}
			});
		}
		else{
			partner_forms.find({ include: {
							     relation: 'AdZoneMapping', // include the owner object
							     scope: { // further filter the owner object
							      fields: [], // only show two fields
							      //include: { // include orders for the owner
							        //relation: 'AdZoneMapping', 
							       // scope: {
							          where: {affiliatePartnerUid: 1} // only select order with id 5
							        //}
							     // }
							    }
							  }}, function(err, templateSet) {
				var curtplSet;
				if(err) {
					cb(err);
				} else {
					templateSet.forEach(function(response) {	
						curtplSet = response;
						//console.log(curtplSet);

					});
					cb(null, templateSet);
				}
			});
		}

	}

	partner_forms.remoteMethod(
	    'getList', 
	    {
	      http: {path: '/getList', verb: 'get'},
	      accepts: [{arg: 'filterData', type: 'object'}],
	      returns: {arg: 'response', type: 'object'}
	    }
	);

	/**
	 * Function to get Ad list of logged user (FORM).
	 * 
	 * @param  {object}   filterData
	 * @param  {Function} cb   
	 * @return {object}   response   
	 */

	partner_forms.getUserAdList = function(filterData, cb) {
		
		var AdMappingDataModel = app.models.AdMappingDataModel;
		var AdTemplateDataModel = app.models.AdTemplateDataModel;
		var getAppUrl = function(templateId) {
			  var d = q.defer();

			  AdTemplateDataModel.findById(templateId ,  {}, function(err,data){
				 if(err){ 
					 d.reject(err); return false; 
				 } else{
					 d.resolve(data);
				 }
			  });
			  return d.promise;
		};

		var getAppID = function(eachAd) {
			  var d = q.defer();
			  var mappingDataList = {};

			  AdMappingDataModel.find({ where: { adId: eachAd.uid}}, function(err,data){
				 if(err){ 
					 d.reject(err); return false; 
				 } else{
				 	 mappingDataList["adDetails"] = eachAd;
				 	 mappingDataList["appId"] = data[0].templateId;
				 	 var domainArr = [];
				 	 data.forEach(function(eachData){ 
				 	 	domainArr.push(eachData.domainId);
				 	 });
				 	 mappingDataList['domainId'] = domainArr.join(",");
				 	 
				 	 getAppUrl(data[0].templateId).then(function(res){
				    	
				    	 mappingDataList['appUrl'] = res.url+'?slot_id='+eachAd.slotId;
				    	 mappingDataList['minHeight'] = res.minHeight;
				    	 mappingDataList['minWidth']  = res.minWidth;
				    	 mappingDataList['categoryId'] = res.categoryId;
				    	 mappingDataList['varianteId'] = res.varianteId;
				    	 mappingDataList['productId'] = res.productId;
				    	 mappingDataList['displayIds'] = res.devices;
				    	 mappingDataList['createdAt'] = eachAd.crdate;
						 d.resolve(mappingDataList);
				    	 
				     });	
				 	 
				 }
			  });
			  return d.promise;
		};

		partner_forms.find({ where: { uid: {inq: filterData.uIds}, isDeleted: 0 }, order: 'uid DESC'} , function(err, templateSet) {
			if(err) {
				cb(err);
			} 
			else {

				var tmp = [];

				templateSet.forEach(function(response) {
						var def2 = q.defer();
						tmp.push(def2.promise);

						getAppID(response).then(function(val){
							 val['adName'] = response.branch;
							 def2.resolve(val);
						});
				});

				q.all(tmp).then(function(results) {
					  //console.log(results);
					  cb(null, results);
				});
			}
		});

	}

	partner_forms.remoteMethod(
	    'getUserAdList', 
	    {
	      http: {path: '/getUserAdList', verb: 'post'},
	      accepts: [{arg: 'filterData', type: 'object'}],
	      returns: {arg: 'response', type: 'object'}
	    }
	);
};