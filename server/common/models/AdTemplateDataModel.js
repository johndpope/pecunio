/**
 * Model file to communicate with database. 
 * Purpose: Get List of default Ads.
 			Get List of Zones.
 * Author Aradhana <aradhana.rani@netzrezepte.de>
 */
var app = require('../../server/server.js'),
	q = require("q");

module.exports = function(AdTemplateDataModel) {
	

	/**
	 * Function to get list of zones available.
	 * 
	 * @param  {object}   filter
	 * @param  {Function} cb   
	 * @return {object}   zonetypes   
	 */
	AdTemplateDataModel.getZnType = function(filter,cb){
		AdTemplateDataModel.find(filter,function(err,zonetypes){
			if(zonetypes.length > 0){
				for (var eachZn in zonetypes){
					var nHeight = Math.ceil(parseInt(zonetypes[eachZn].minHeight/10)*3);
					var nWidth = Math.ceil(parseInt(zonetypes[eachZn].minWidth/10)*3);
					if(nHeight > 70) nHeight = 70;
					if(nWidth > 145) nWidth = 145;
					zonetypes[eachZn].znHght = nHeight;
					zonetypes[eachZn].znWdth = nWidth;
					zonetypes[eachZn].dimension = zonetypes[eachZn].minWidth+'X'+zonetypes[eachZn].minHeight;
					
				}
				cb(null, zonetypes);
			}else{
				  cb({"zonetypes missing" : "There is no zonetype entered"});
			  }
			
		});
		
		 
	};

	AdTemplateDataModel.remoteMethod(
			'getZnType',
	        {
	          http: {path: '/getZnType', verb: 'get'},
	          accepts: {arg:'filter',type: 'object'},
	          returns: {arg: 'zonetypes', type: 'object'}
	        }
	);



	/**
	 * Function to get list of ad available.
	 * 
	 * @param  {object}   filterData
	 * @param  {Function} cb 
	 * @return {object}   response
	 */
	
	AdTemplateDataModel.getTemplateList = function(filterData, cb) {
		
		if(filterData != undefined){

			var query = {};

			if(filterData.adId != undefined && filterData.adId != '')
				query["productId"] = filterData.adId;

			if(filterData.categoryId != undefined && filterData.categoryId != '')
				query["category_id"] = filterData.categoryId;



			AdTemplateDataModel.find({where: query}, function(err, templateSet) {
				var curtplSet;
				if(err) {
					cb(err);
				} else {
					
					cb(null, templateSet);
				}
			});
		}
		else{
			
			AdTemplateDataModel.find({}, function(err, templateSet) {
				var curtplSet;
				if(err) {
					cb(err);
				} else {
					cb(null, templateSet);
				}
			});
		}	

	}

	AdTemplateDataModel.remoteMethod(
        'getTemplateList', 
        {
          http: {path: '/getTemplateList', verb: 'get'},
	      accepts: [{arg: 'filterData', type: 'object'}],
	      returns: {arg: 'response', type: 'object'}
        }
    );

};