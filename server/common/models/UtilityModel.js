var app = require('../../server/server.js');
var express = require('express');
var http    = require('http');
var path    = require('path');
var fs      = require('fs');
var q =require('q');
var loopback = require('loopback');
var config = require('../../server/config');
var cheerio = require('cheerio');


module.exports = function(UtilityModel) {

	/**
	  * Typical remote method validator for Unique Email!!
	  * @param {object} userData   [User Info with email id]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return boolean...
	  *
	  */
	UtilityModel.checkUniqueEmail = function(userData, cb) {
		
		var User = app.models.PecunioUser;
		var query;
		//if(userData.id == undefined || userData.id == null) {
			query = {email : userData.email};
		/*} else {
			query = {email : userData.email, id: {neq : userData.id}};
		}*/
		// id : should be customer/employee appUser id
		User.count(query, function(err, count) {
			if(err) {
				cb(err);
			} else {
				if(count > 0) {
					cb(null, false);
		        } else {
		        	cb(null, true);
			    } 
				
			}
		});
	};
     
  	UtilityModel.remoteMethod(
        'checkUniqueEmail', 
        {
          accepts: [{arg: 'userData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'notExists', type: 'boolean'},
          http: {verb: 'post'}
        }
  	);

  	/**
	  * Typical remote method validator for Unique Domain for all users!!
	  * @param {object} domainData [Domain data with only domain name]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  *   
	  * @return boolean...
	  *
	  */
	UtilityModel.checkUniqueDomain = function(domainData, cb) {
		
		var Domain = app.models.PublisherDomain;
		var ctx = loopback.getCurrentContext();
    	var currentUser = ctx && ctx.get('currentUser');
		//var query = {domainName : domainData.domainName, publisherId : currentUser.id}
		var query = {domainName : domainData.domainName};
		
		Domain.count(query, function(err, count) {
			if(err) {
				cb(err);
			} else {
				if(count > 0) {
					cb(null, false);
		        } else {
		        	cb(null, true);
			    } 
				
			}
		});
	};
     
  	UtilityModel.remoteMethod(
        'checkUniqueDomain', 
        {
          accepts: [{arg: 'userData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'notExists', type: 'boolean'},
          http: {verb: 'post'}
        }
  	);

  	/**
	  * Typical remote method validator for Unique Domain for logged in user!!
	  * @param {object} domainData [Domain data with domain name and publisher id]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return boolean...
	  *
	  */
	UtilityModel.checkUniqueDomainUser = function(domainData, cb) {
		
		var Domain = app.models.PublisherDomain;
		var ctx = loopback.getCurrentContext();
    	var currentUser = ctx && ctx.get('currentUser');
		var query = {domainName : domainData.domainName, publisherId : currentUser.id};
		//var query = {domainName : domainData.domainName}
		
		Domain.count(query, function(err, count) {
			if(err) {
				cb(err);
			} else {
				if(count > 0) {
					cb(null, false);
		        } else {
		        	cb(null, true);
			    } 
				
			}
		});
	};
     
  	UtilityModel.remoteMethod(
        'checkUniqueDomainUser', 
        {
          accepts: [{arg: 'userData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'notExists', type: 'boolean'},
          http: {verb: 'post'}
        }
  	);
	
  	/**
	  * Typical remote method validator for Unique UserName!!
	  * @param {object} userData   [User name]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return boolean...
	  *
	  */
	UtilityModel.checkUniqueUserName = function(userData, cb) {
	  
		var User = app.models.PecunioUser;
		// id : should be customer/employee appUser id
		var query;
		//if(userData.id == undefined || userData.id == null) {
			query = {username : userData.username};
		/*} else {
			query = {abbreviation : userData.abbreviation, id: {neq : userData.id}};
		}*/
		User.count(query, function(err, count) {
			if(err) {
				cb(err);
			} else {
				if(count > 0) {
					cb(null, false);
		        } else {
		        	cb(null, true);
			    } 
				
			}
		});
	};

	UtilityModel.remoteMethod(
	    'checkUniqueUserName', 
	    {
	      accepts: [{arg: 'userData', type: 'object' , http: { source: 'body'}}],
	      returns: {arg: 'notExists', type: 'boolean'},
	      http: {verb: 'post'}
	    }
	);


	/**
	  * Typical remote method for logo image file upload!!
	  * @param {object} logo       [logo file]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return boolean...
	  *
	  */
	UtilityModel.uploadFile = function(logo, cb) {

		var fileUpload = function(logo, newImageLocation){
		    fs.readFile(image.path, function(err, data) {
		        fs.writeFile(newImageLocation, data, function(err,res) {
		            res.json(200, { 
		                src: 'images/' + logo.name,
		                size: image.size
		            });
		        });
		    });
		} 	
		var newImageLocation = path.join(__dirname, 'uploads/logo', logo.name);
		fileUpload(logo, newImageLocation).then(function(data){			
			cb(null, data);
		});
	};

	UtilityModel.remoteMethod(
	    'uploadFile', 
	    {
	      accepts: [{arg: 'logo', type: 'object' , http: { source: 'body'}}],
	      returns: {arg: 'uploaded', type: 'boolean'},
	      http: {verb: 'post'}
	    }
	);

	/**
	  * Typical remote method for creating temporary files for ad builder!!
	  * @param {string} url        [Url of the web page]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return boolean...
	  *
	  */
	UtilityModel.createTmpAdFile = function(urlObj, cb) {

		var getTmpFile = function(url, baseUrl){
			var def = q.defer();
			var ctx = loopback.getCurrentContext();
			var currentUser = ctx && ctx.get('currentUser');


			// create unique filename
			var tmpFilename = 'pecunio-'+currentUser.id+'@'+Math.random().toString(36).slice(2)+ '.html';
			var fileLocation = '';
			var filepath = "client/tmp/tmp_ads/";

			fileLocation = filepath+tmpFilename;
			var tmp = {};
		    var file = fs.createWriteStream(fileLocation);

			var request = http.get(url, function(response) {
  				var data = response.pipe(file);
  				
  				tmp["writable"]= data.writable;
  				tmp["tmpFileName"] = tmpFilename;

  				response.on('end', function(){
  					fs.readFile( fileLocation, 'utf8', function (err,data) {
						if (err) {
							//return console.log(err);
						} else {
							//console.log('data');
							// console.log(data);
							var $ = cheerio.load(data);
							
							var images = [];
							var finalUrl = [];
							var j = 0;

							$('html').find('img').each(function(i, elem) {
							  images[i] = $(this).attr('src');
							});

							var httpPattern = /^(http|https):\/\//; // <img> src remains unchanged if absolute path is given

							images.forEach(function(imgSrc){
							  	if(imgSrc != undefined && imgSrc != "" && !httpPattern.test(imgSrc)){

									var tempImgSrc = imgSrc.split('./').pop(); console.log(tempImgSrc);

							  		var tmp1 = (baseUrl == "")? url.split('//') : baseUrl.split('//');
									var index1 = tmp1.indexOf('http:');
				                    if (index1 > -1) {
				                        tmp1.splice(index1, 1);
				                    }

				                    var a = tmp1.toString();
				                    var tmpUrl = a.split('/').pop();
				                    var tmp2 = a.split('/');

							  		var index = tmp2.indexOf(tmpUrl);
				                    if (index > -1) {
				                        tmp2.splice(index, 1);
				                    }
									var b = tmp2.join('/');
									finalUrl[j] = 'http://' + b + '/' + tempImgSrc;
								}
								else{
									finalUrl[j] = imgSrc;
								}
								j++;
							});
							
							$('html').find('img').each(function(i, elem) {
							  $(this).attr('src', finalUrl[i]);
							});

							fs.writeFile(fileLocation, $.html(), function (err) {
							  if (err) return console.log(err);
							});

						  	def.resolve(tmp);
						}
					});
  				})
			 	//def.resolve(tmp);
			}).end();

			
			return def.promise;
		} 
			
			
		getTmpFile(urlObj.url, urlObj.baseUrl).then(function(data){
			 cb(null, data);
		});

	};

	UtilityModel.remoteMethod(
	    'createTmpAdFile', 
	    {
	      accepts: {arg: 'urlObj', type: 'object'},
	      returns: {arg: 'uploaded', type: 'boolean'},
	      http: {verb: 'post'}
	    }
	);

	/**
	  * Typical remote method for creating temporary web page files for ad builder!!
	  * @param {string} url        [Url of the webpage]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return boolean...
	  *
	  */
	UtilityModel.createTmpWebpageFile = function(url, cb) {

		var getTmpFile = function(url){
			var def = q.defer();
			var ctx = loopback.getCurrentContext();
			var currentUser = ctx && ctx.get('currentUser');

			//console.log('pecunio-'+currentUser.id+'#' );

			// create unique filename
			var tmpFilename = 'pecunio-'+currentUser.id+'@'+Math.random().toString(36).slice(2)+ '.html';
			var fileLocation = '';
			var filepath = "client/tmp/tmp_webpage/";

			fileLocation = filepath+tmpFilename;
			var tmp = {};
		    var file = fs.createWriteStream(fileLocation);

			var request = http.get(url, function(response) {
			  				var data = response.pipe(file);
			  				tmp["writable"]= data.writable;
			  				tmp["tmpFileName"] = tmpFilename;
		    			 	def.resolve(tmp);
						});
			return def.promise;
		} 
			
			
		getTmpFile(url).then(function(data){
			 cb(null, data);
		});

	};

	UtilityModel.remoteMethod(
	    'createTmpWebpageFile', 
	    {
	      accepts: {arg: 'url', type: 'string'},
	      returns: {arg: 'uploaded', type: 'boolean'},
	      http: {verb: 'post'}
	    }
	);

	/**
	  * Typical remote method for delete temporary files!!
	  * @param {integer} userid    [Logged in user id]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return boolean...
	  *
	  */
	UtilityModel.deleteFile = function(userid, cb) {

		var deleteTmpFile = function(args){
			var def = q.defer();
			var filepath = "client/tmp/tmp_ads/";
			var userFileList = [];
			var filesList = fs.readdirSync('client/tmp/tmp_ads/');

			// filter out user specific files
			for (var i in filesList) {
			  var tmpFilenameArr = filesList[i].split('@');
			  var tmpFilename = tmpFilenameArr[0].split('-');

			  if(tmpFilename[1] == args){
			  	userFileList.push(filesList[i]);
			  }
			}

			var resolveArr = [];

			if(userFileList.length > 0 ){
				var j = userFileList.length;
				userFileList.forEach(function(name){

					var fileLocation = filepath+name;
					
					fs.exists(fileLocation, function(){
						fs.unlink(fileLocation, function (err) {
							j--;
						    if (err) {
					        	resolveArr.push('fails');
					        	return;
					      	} else if (j <= 0) {
					        	resolveArr.push('success');
					      	}
						});
					})
					
				});
				def.resolve(resolveArr);
			}
			else{
				resolveArr[0] = "No Files";
				def.resolve(resolveArr);
			}

			return def.promise;
		} 
			

			
		deleteTmpFile(userid).then(function(data){
			 cb(null, data);
		});

	};

	UtilityModel.remoteMethod(
	    'deleteFile', 
	    {
	      accepts: {arg: 'userid', type: 'number'},
	      returns: {arg: 'status', type: 'boolean'},
	      http: {verb: 'post'}
	    }
	);
	
	/**
	  * Typical remote method to post support ticket for domian registration!!
	  * @param {object} ticketinfo [Ticket Info]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return {object} ticket
	  *
	  */
	UtilityModel.postSupprtTicketForDomain = function(ticketinfo,cb){

		var API_KEY = config.helpdesksetting.apikey;
	    var FD_ENDPOINT = config.helpdesksetting.hostname;
	    
		var ticketBody = {
			"helpdesk_ticket":{
				"subject":ticketinfo.title,
				"description_html":ticketinfo.content,
				"email":ticketinfo.usermail, //requester email (ticketinfo.usermail), 
				"name" : ticketinfo.username,   //requester name
				"priority":1,
				"status":2,
				"spam":false,
				"group_id":245231,
				"source":1,
				"custom_field" : {
				      "thema_3977" : ticketinfo.topic
			    }
			}
		};
		//console.log(ticketBody);
		var dataBody = JSON.stringify(ticketBody);
		var params = {
			hostname : FD_ENDPOINT ,
			path : "/helpdesk/tickets.json",
			method: "POST",
			headers: {"Content-type": "application/json",
			"Content-length":dataBody.length},
			auth : API_KEY + ":X"
		}
		var def = q.defer();
		var respn = {};
		var temp = [];
		var req = http.request(params,function(res) {
			    /*if(res.statusCode == 200){
			    	respn["isCreated"] = true;
			    }else{
			    	respn["isCreated"] = false;
			    }
			    def.resolve(respn);*/

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
		           respn["isCreated"] = true;
		           respn["ticktdata"] = arrRes;
		           def.resolve(respn);
				});

		});
		
		req.on('error', function(e) {
			  //console.log("common err");
			  //console.log('problem with request: ' + e.message);
		});
		var resp = req.write(dataBody);
		var res = req.end();
		def.promise.then(function(result){
	          cb(null, result);
	    },function(err){
	          cb(err);
	    });
		
	};
	
	UtilityModel.remoteMethod(
        'postSupprtTicketForDomain', 
        {
          accepts: {arg: 'ticketinfo', type: 'object', http: { source: 'body'}},
          returns: {arg: 'ticket', type: 'object'},
          http: {verb: 'post'}
        }
	);
  	
  	/* **** get list of all tickets **** */
	
	/**
	  * Typical remote method to get all tickets from support systems filter by accountowner email!!
	  * @param {object} userdata   [User Info]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return {object} tickets
	  *
	  */
  	UtilityModel.getTickets = function(userdata,cb) {
        var params = {
                hostname : config.helpdesksetting.hostname ,
                path : "/helpdesk/tickets.json?email="+userdata.acctownermail+"&filter_name=all_tickets",        //////helpdesk/tickets/filter/all_tickets?format=json //"+userdata.acctownermail+"&filter_name=all_tickets
                method: "GET",
                headers: {"Content-type": "application/json"},
                auth : config.helpdesksetting.apikey +':X'
        }
        
		var common = app.models.CommonModel;
		common.getDataFromApi(params,function(err,res){
			if(res){
			  cb(null, res);
			}else if(err){
			  //console.log('ERR : '+err);
			  cb(err);
			}	
  		 });

    };

    UtilityModel.remoteMethod(
		'getTickets',
		{
		  accepts: {arg: 'userdata', type: 'object', http: { source: 'body'}},
		  returns: {arg: 'tickets', type: 'object'},
		  http: {verb: 'post'}
		}
    );

    /**
	  * Typical remote method for reply domain registration ticket with private note having the pecunio admin link!!
	  * @param {object} replyInfo  [reply information of support ticket containing pecunio admin link]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return {object} replyTicket
	  *
	  */
	UtilityModel.replySupprtTicketForDomain = function(replyInfo,cb){
		if(replyInfo){
			var replyMsg = config.url+"#"+replyInfo.replymsg;
			var replyBody = {
				"helpdesk_note": {
					    "body":replyMsg,
					    "user_id":replyInfo.requesterId,
					    "private":true
				}
			}
			var dataBody = JSON.stringify(replyBody);
			var params = {
			      hostname : config.helpdesksetting.hostname,
			      path : "/helpdesk/tickets/"+replyInfo.ticketId+"/conversations/note.json",  //helpdesk/tickets/141/conversations/note.json      
			      method: "POST",
			      headers: {"Content-type": "application/json","Content-length":dataBody.length},
			      auth : config.helpdesksetting.apikey +':X'
			}
			
			var respn = {};
			var common = app.models.CommonModel;
			common.postDataToApi(params,dataBody,function(err,res){
				  if(res){
					  if(res.isCreated == true){
					    	respn["isReplied"] = true;
					   }else{
					    	respn["isReplied"] = false;
					   }
				  }else if(err){
					  respn["isReplied"] = false;
				  }
				  
				  cb(null, respn);
			 });
			          
	    }
	};
	
	UtilityModel.remoteMethod(
        'replySupprtTicketForDomain', 
        {
          accepts: {arg: 'replyInfo', type: 'object', http: { source: 'body'}},
          returns: {arg: 'replyTicket', type: 'object'},
          http: {verb: 'post'}
        }
	);

	
	/**
	  * Typical remote method for upload image flag!!
	  * @param {object} _file	   [filename]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return boolean...
	  *
	  */

	UtilityModel.uploadImage = function(_file, cb) {
	 	
		//console.log(_file);
 	};

	UtilityModel.remoteMethod(
        'uploadImage', 
        {
          accepts: [{arg: '_file', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'uploaded', type: 'boolean'},
          http: {verb: 'post'}
        }
	);

}