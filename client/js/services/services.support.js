/**
 * @Description
 * Factory for viewing the support page
 *
 * @author Gargi Chakraborty <gargi.chakraborty@netzrezepte.de>
 * 
 */
PecunioApp
.factory('supportFactory',['$http','$q','SupportDataModel','LoopBackAuth','PecunioUser',function($http,$q,SupportDataModel,LoopBackAuth,PecunioUser){
		
		/* Get support contact data */

		function getSupport(){
			return $http.get('/data/supportContacts.json');
		}

		/**
		 * Get all tickets
		 * posted by current user (if admin)
		 * or by account owner (if other than admin)
		 *
		 * @return $promise
		 */
		function getTickets(){
			var def = $q.defer();
			var response = {};
			
			var userData = {'id':LoopBackAuth.currentUserId};
	    	PecunioUser.getPersonalData(userData)
			        .$promise
			        .then(function(data){
			            var res = data.user;
			            if(res.affiliate.accountOwnerId == 0){  ///accountowner
			            	acctOwneremail = res.user.email;
			            }else{
			            	acctOwneremail = res.accountOwner.email;
			            }
			            var userobj = {'acctownermail':acctOwneremail }; //'username': currentUsername,
			            SupportDataModel.getTickets({'userdata':userobj})
				        .$promise
				        .then(function(data){
				        	var dataLen = data.tickets.length;
				        	if(dataLen > 0){
				        		response['isTickets'] = true;
				        		response['tickets'] = data.tickets;
				        	}else{
				        		response['isTickets'] = false;
				        	}
				            def.resolve(response);
				        });
			            		
			});
			return def.promise;  
			
		}
		
		/**
		 * Get all replies posted 
		 * against  a ticket
		 * 
		 * @param  {integer}  {ticketId}      [ticket's display id]
		 * 
		 * @return $promise
		 */
		function getTicketReply(ticketId){
			if(ticketId){
				var def = $q.defer();
				var ret = {};
				var cls = '';
				SupportDataModel.getTicketNote({'ticketId':ticketId})
					.$promise
					.then(function(data){
						var ticketInfo = data.ticketData.helpdesk_ticket;
						if(ticketInfo.notes.length > 0 ){
							ret['isReply'] = true;
							//ticketInfo.notes.shift();  ///to remove first element which is blank
							ret['replies'] =  ticketInfo;  
							
						}else{ 
							ret['isReply'] = false;
						}
						
						def.resolve(ret);
					});
			}
			return def.promise;
		}
		
		
		/**
		 * Post tickets to freshdesk
		 *
		 * @param { object} {obj} [object containing ticket data]
		 * @return $promise
		 * 
		 */
		function postTickets(obj){
			if(obj){
				var def = $q.defer();
				
				var currentUsername ="";
				var acctOwneremail = "";
				var userData = {'id':LoopBackAuth.currentUserId};
		    	PecunioUser.getPersonalData(userData)
				        .$promise
				        .then(function(data){
				            var res = data.user;
				            if(res.affiliate.accountOwnerId == 0){  ///accountowner
				            	acctOwneremail = res.user.email;
				            }else{
				            	acctOwneremail = res.accountOwner.email;
				            }
				            currentUsername = res.affiliate.fullName;
				            var userobj = {'username': currentUsername,'acctownermail':acctOwneremail };
				            
				            SupportDataModel.postTickets({"ticketinfo":obj,"userinfo":userobj })
							.$promise
							.then(function(data){
								def.resolve(data);
							});
						    
				        });
		    	return def.promise;				
			}
			
		}
	    
		
		/**
		 * Post reply to a ticket
		 * 
		 * @param {object} {obj} [object containing reply data]
		 * @return $promise
		 */
		function postTicketReply(obj){
			if(obj){
				var def = $q.defer();
				SupportDataModel.postTicketReply({"replydata":obj})
					.$promise
					.then(function(data){
						def.resolve(data);
					});
				return def.promise;
			}
			
		}
		
		/**
		 * Get all folders/categories
		 * 
		 */
		function getCategoryFolders(){
			var def = $q.defer();
			var response = {};
			
			SupportDataModel.getFolders()
				.$promise
				.then(function(data){
					if(data.folders.category.folders.length > 0 ){
						response['hasFolders'] = true;
						response['folders'] = data.folders.category.folders;
						
					}else{
						response['hasFolders'] = false;
					}
					
					def.resolve(response);
					
				});
			return def.promise;
			
		}
		/**
		 * Get all articles posted 
		 * under specific category / folder
		 * 
		 * @param  {integer} {folderId} [ Id of respective category/folder ]
		 * @return $promise
		 */
		function getTips(folderId){
			if(folderId){
			var def = $q.defer();
			var response = {};
			SupportDataModel.getTips({"folderId":folderId})
				.$promise
				.then(function(data){
					if(data.tips.folder.articles.length > 0 ){
						response['hasTips'] = true;
						response['articles'] = data.tips.folder.articles;
						
					}else{
						response['hasTips'] = false;
					}
					def.resolve(response);
					
				});
			return def.promise;
			}	
		}
		
		return {
			getTickets : getTickets,
			getTicketReply : getTicketReply,
			postTicketReply : postTicketReply,
			getTips : getTips,
			getCategoryFolders : getCategoryFolders,
			postTickets : postTickets,
			getSupport : getSupport
		};


	}]);
