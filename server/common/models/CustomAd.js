/**
 * Model file to communicate with database. 
 * Purpose: Get List of Ads of logged user.
 * Author Aradhana <aradhana.rani@netzrezepte.de>
 */


var https = require("http");
var q = require("q");
var app = require('../../server/server.js');


module.exports = function(CustomAd) {

	
	/**
	 * Function to get Ad list of logged user.
	 * 
	 * @param  {object}   filterData
	 * @param  {Function} cb   
	 * @return {object}   response   
	 */
	CustomAd.getUserAdList = function(filterData, cb) {
		
		var AdMappingDataModel = app.models.AdMappingDataModel;
		var AdTemplateDataModel = app.models.AdTemplateDataModel;


		var getAppUrl = function(templateId) {
			  var d = q.defer();
			  var appUrl = '';

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

			  AdMappingDataModel.find({ where: { adId: eachAd.id}}, function(err,data){
				 if(err){ 
					 d.reject(err); return false; 
				 } else{
				 	 mappingDataList["adDetails"] = eachAd;

				 	 var domainArr = [];
				 	 data.forEach(function(eachData){ 
				 	 	domainArr.push(eachData.domainId);
				 	 });
				 	 mappingDataList['domainId'] = domainArr.join(",");
				 	 
				 	 getAppUrl(eachAd.basetemplateid).then(function(res){
				    	
				    	 
				    	 mappingDataList['minHeight'] = res.minHeight;
				    	 mappingDataList['minWidth']  = res.minWidth;
				    	 mappingDataList['categoryId'] = res.categoryId;
				    	 mappingDataList['varianteId'] = res.varianteId;
				    	 mappingDataList['productId'] = res.productId;
				    	 mappingDataList['displayIds'] = res.devices;
				    	 mappingDataList['baseUrl'] = res.url;
						 d.resolve(mappingDataList);
				    	 
				     });	
				 	 
				 }
			  });
			  return d.promise;
		};

		CustomAd.find({ where: { id: {inq: filterData.Ids}, isDeleted: 0 }, order: 'id DESC'} , function(err, templateSet) {
			if(err) {
				cb(err);
			} 
			else {

				var tmp = [];
				//var returnArr = [];

				templateSet.forEach(function(response) {
						var def2 = q.defer();
						tmp.push(def2.promise);

						getAppID(response).then(function(val){
							
							 val["appId"] = response.basetemplateid;
							 val['appUrl'] = response.url;
							 val['createdAt'] = response.created;
							 val['adName'] = response.name;
							 def2.resolve(val);
						});
				});

				q.all(tmp).then(function(results) {
					  cb(null, results);
				});
			}
		});

	}

	CustomAd.remoteMethod(
	    'getUserAdList', 
	    {
	      http: {path: '/getUserAdList', verb: 'post'},
	      accepts: [{arg: 'filterData', type: 'object'}],
	      returns: {arg: 'response', type: 'object'}
	    }
	);
};