/**
 * Server side model file to make API calls to 
 * freshdesk for posting, fetching tickets and 
 * ticket replies, fetching ll categories/folders
 * under FAQ section and their respective articles
 *
 * @author Gargi Chakraborty <gargi.chakraborty@netzrezepte.de>
 * 
 */
/**
 * List of node modules required
 * 
 */
var app = require('../../server/server.js');
var https = require("https");
var q = require('q');
var config = require('../../server/config');
module.exports = function(SupportDataModel) {
	/**
	 * Post a new ticket to freshdesk
	 * If current logged in user is admin, his email is 
	 * being sent as ticket.email field. if current user
	 * is other than admin, the accountowner's email is 
	 * being sent.
	 * 
	 * @param  {object}   ticketinfo [contains ticket data to be posted]
	 * @param  {object}   userinfo   [contains user data who is posting the ticket]
	 * @param  {Function} cb         [callback function to send the response back to client side]
	 * @return {object}              [status of the ticket. (if posted successfully or not)]
	 */
	SupportDataModel.postTickets = function(ticketinfo,userinfo,cb){
		var ticketBody = {
			"helpdesk_ticket":{
				"subject":ticketinfo.title,
				"description_html":ticketinfo.content,
				"email":userinfo.acctownermail, //accountowner email, 
				"name" : userinfo.username,   //requester name
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
		var dataBody = JSON.stringify(ticketBody);
		var params = {
			hostname : config.helpdesksetting.hostname ,
			path : "/helpdesk/tickets.json",
			method: "POST",
			headers: {"Content-type": "application/json",
			"Content-length":dataBody.length},
			auth : config.helpdesksetting.apikey + ":X"
		}
		var respn = {};
		var common = app.models.CommonModel;
		common.postDataToApi(params,dataBody,function(err,res){
			  if(res){
				  if(res.isCreated == true){
				    	respn["isTickectCreated"] = true;
				   }else{
				    	respn["isTickectCreated"] = false;
				   }
			  }else if(err){
				  //console.log(err);
				  respn["isTickectCreated"] = false;
			  }
			  
			  cb(null, respn);
		 });
	};
	SupportDataModel.remoteMethod(
	        'postTickets',
	        {
	          http: {path: '/postTickets', verb: 'post'},
	          accepts:[{arg: 'ticketinfo', type: 'object'},{arg: 'userinfo', type: 'object'}],
	          returns: {arg: 'posttickets', type: 'string'}
	        }
	 );
  /**
   * Post reply to a ticket
   * 
   * @param  {object}   replydata [contains reply message and ticket info ]
   * @param  {Function} cb        [callback function to send the response back to client side]
   * @return {object}             [status of if the reply has been posted]
   */
  SupportDataModel.postTicketReply = function(replydata,cb){
	  if(replydata){
		  var replyBody = {
				"helpdesk_note": {
					    "body":replydata.replymsg,
					    "user_id":replydata.requesterId,
					    "private":false
				}
		  }
      
		  var dataBody = JSON.stringify(replyBody);
		  var params = {
	              hostname : config.helpdesksetting.hostname,
	              path : "/helpdesk/tickets/"+replydata.ticketId+"/conversations/note.json",  //helpdesk/tickets/141/conversations/note.json      
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
				  //console.log(err);
				  respn["isReplied"] = false;
			  }
			  
			  cb(null, respn);
		 });
		  
	  }
  }
  SupportDataModel.remoteMethod('postTicketReply',
		  {
			  http :{path:'/postTicketReply',verb:'post'},
			  accepts :{arg:'replydata',type:'object'},
			  returns :{arg:'status',type:'object'}
		  }
  );
  /**
   * Get list of all tickets posted by current user,
   * if current logged in user is admin, or posted 
   * by the accountowner, if current logged in user is
   * other than admin.
   * 
   * @param  {object}   userdata [contains information about current user]
   * @param  {Function} cb       [callback function to send the response back to client side]
   * @return {object}            [list of tickets]
   */
  SupportDataModel.getTickets = function(userdata,cb) {
        var params = {
                hostname : config.helpdesksetting.hostname ,
                path : "/helpdesk/tickets.json?email="+userdata.acctownermail+"&filter_name=all_tickets",        
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
    SupportDataModel.remoteMethod(
          'getTickets',
          {
            http: {path: '/getTickets', verb: 'get'},
            accepts : {arg: 'userdata',type: 'object'},
            returns: {arg: 'tickets', type: 'object'}
          }
    );
    /**
     * Get content of ticket and all conversation
     * messages posted against that ticket.
     * 
     * @param  {number}   ticketId [id of respective ticket]
     * @param  {Function} cb       [callback function to send the response back to client side]
     * @return {object}            [ ticket details]
     */
    SupportDataModel.getTicketNote = function(ticketId,cb){
      function getUserData(def, params){
              common.getDataFromApi(params,function(err,resp){
                  if(resp){
                    var users = resp.user;
                    //console.log(resp.user.avatar_attributes[content]); ///for user's avatar. undefined.
                     var userObj = {};
                     userObj[resp.user.id] = resp.user.name;
                     def.resolve(userObj);
                  } 
                });
              return def.promise;
        }
  	  if(ticketId){
  		  var params = {
  	              hostname : config.helpdesksetting.hostname,
  	              path : "/helpdesk/tickets/"+ticketId+".json",       
  	              method: "GET",
  	              headers: {"Content-type": "application/json"},
  	              auth : config.helpdesksetting.apikey +':X'
  	      }
  		  
  		  var common = app.models.CommonModel;
  		  common.getDataFromApi(params,function(err,res){
  		  	
  			  if(res.helpdesk_ticket.notes.length >0 ){
  				  var notes = res.helpdesk_ticket.notes;
  				  var newNotes = [];
  				  for (var eachNote in notes){
  					  var eNote = notes[eachNote].note;
  					  if(eNote["private"]==false){
  						newNotes.push(notes[eachNote]);
  					  }
  				  }
  				  res.helpdesk_ticket.notes = newNotes;

  				  ////get user data starts
  				  var userData = [];
  				  var tmp = [];
  				  


  				  for(var eachNewnote in newNotes){
  					var userId = newNotes[eachNewnote].note.user_id;
  					var def = q.defer();
  					tmp.push(def.promise);
  					var params = {
  		  	              hostname : config.helpdesksetting.hostname,
  		  	              path : "/contacts/"+userId+".json",       
  		  	              method: "GET",
  		  	              headers: {"Content-type": "application/json"},
  		  	              auth : config.helpdesksetting.apikey +':X'
  		  	      	}
  					var retUserData = getUserData(def,params);
  					
  				  }
				    

				  q.all(tmp).then(function(response){
					  if(response.length > 0){
						  var r = res.helpdesk_ticket.notes;
						  for(var eachR in r){  
						  	var uid = r[eachR].note.user_id;
						  	r[eachR].note.user_name = response[eachR][uid];
						  }

						  cb(null,res);
					  }
				  }).catch(function(err) {
					 //console.log("inside q all error");
					 //console.log(err);
				  });
  			      ////get user data ends

  				  //cb(null, res);
  			  }else if(err){
  				  //console.log('ERR : '+err);
  				  cb(err);
  			  }
  		 });
  		  
  	  }
    };
    
    SupportDataModel.remoteMethod('getTicketNote',
  		  {
  	  		http: {path: '/getTicketNote', verb: 'get'},
  	  		accepts : {arg: 'ticketId',type: 'number'},
  	  		returns : {arg : 'ticketData', type:'object'}
  		  }
    
   
    );
  /**
   * Get all folders/categories from freshdesk under
   * pecunio affiliates 
   * @param  {Function} cb [callback function to send the response back to client side]
   * @return {object}      [all folder/category data]
   */
    SupportDataModel.getFolders = function(cb){
	  	  var params = {
	  	  		hostname : config.helpdesksetting.hostname,
	  	  		path : "/solution/categories/160067.json", 
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
    
    
    SupportDataModel.remoteMethod(
    	    'getFolders',
    	    {
    	      http: {path: '/getFolders', verb: 'get'},
    	      returns: {arg: 'folders', type: 'object'}
    	    }
      );
    
  /**
   * Get all articles under respective folder/category
   * 
   * @param  {number}   folderId [Id of respective folder]
   * @param  {Function} cb       [callback function to send the response back to client side]
   * @return {object}            [description]
   */
  SupportDataModel.getTips = function(folderId,cb){
	  var params = {
	  		hostname : config.helpdesksetting.hostname ,
	  		path : "/solution/categories/160067/folders/"+folderId+".json",
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
  
  SupportDataModel.remoteMethod(
	    'getTips',
	    {
	      http: {path: '/getTips', verb: 'get'},
	      accepts : {arg: 'folderId',type: 'string'},
	      returns: {arg: 'tips', type: 'object'}
	    }
  );

 } 
