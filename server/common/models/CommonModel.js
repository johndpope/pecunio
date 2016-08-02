/**
 * Server side common model for making http request
 * to post data, get data and delete data.
 *
 * @author Gargi Chakraborty <gargi0209.chakraborty@gmail.com>
 */

var https = require("http");
var q = require('q');
var config = require('../../server/config');
module.exports = function(CommonModel) {
	 /**
	  * Function to post data through http request
	  * 
	  * @param  {object}   params   [Parameters for authentication]
	  * @param  {object}   dataBody [Data to post]
	  * @param  {Function} cb       [Callback function to send the response back to client side]
	  * @return {object}            [Status of the api call]
	  */
	CommonModel.postDataToApi = function(params,dataBody,cb){
		var def = q.defer();
		var respn = {};
		var req = https.request(params,function(response) {
			    if(response.statusCode == 200){
			    	respn["isCreated"] = true;
			    }else{
			    	respn["isCreated"] = false;
			    }
			    def.resolve(respn);
		});
		
		req.on('error', function(e) {
			  
			  //console.log('problem with request: ' + e.message);
			  
			  respn["isCreated"] = false;
			  def.resolve(respn);
		});
		var resp = req.write(dataBody);
		var res = req.end();
		def.promise.then(function(result){
	          cb(null, result);
	    },function(err){
	          cb(err);
	    });
		
	};
	
	CommonModel.remoteMethod('postDataToApi',{
		http : {path:'/postDataToApi',verb:'post'},
		accepts: [{arg: 'params', type: 'object'},{arg: 'dataBody', type: 'object'}],
		returns : {arg : 'response',type : 'object'}
	});
	/**
	 * Function to get data from http request
	 * 
	 * @param  {object}   params [Parameters for authentication]
	 * @param  {Function} cb     [Callback function to send the response back to client side]
	 * @return {object}          [Data fetched from the request]
	 */
	CommonModel.getDataFromApi = function(params,cb){
		if(params){
			var def = q.defer();
			var temp = [];
			var req = https.request(params, function(res){
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
		        	//Console.log("error here : "+exception); 
		        });
		    }).end();
			
			def.promise.then(function(result){
				cb(null,result);
			},function(err){
				cb(err);
			});
			
		}
	};
	
	CommonModel.remoteMethod('getDataFromApi',{
		http : {path:'/getDataFromApi',verb:'get'},
		accepts : {arg:'params',type:'object'},
		returns : {arg: 'response',type: 'object'}
	});
	/**
	 * Delete data through http request
	 * @param  {object}   params [Parameters for authentication]
	 * @param  {Function} cb     [Callback function to send the response back to client side]
	 * @return {object}          [Status of the call]
	 */
	CommonModel.deleteDataFromApi = function(params,cb){
		var def = q.defer();
		var respn = {};
		
		var req = https.request(params,function(response) {
				
			    if(response.statusCode == 200){
			    	respn["isDeleted"] = true;
			    }else{
			    	respn["isDeleted"] = false;
			    }
			    def.resolve(respn);
		});
		
		req.on('error', function(e) {
			  respn["isDeleted"] = false;
			  //console.log('problem with request: ' + e.message);
			  def.resolve(respn);
		});
		
		var res = req.end();
		def.promise.then(function(result){
	          cb(null, result);
	    },function(err){
	          cb(err);
	    });
	};
	CommonModel.remoteMethod('deleteDataFromApi',{
		http : {path:'/deleteDataFromApi',verb:'get'},
		accepts : {arg:'params',type:'object'},
		returns : {arg: 'response',type: 'object'}
	});
	
	
};