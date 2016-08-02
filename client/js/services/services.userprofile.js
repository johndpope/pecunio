PecunioApp

.factory('userProfileFactory',['LoopBackAuth','PecunioUser','$q','AccessToken',function(LoopBackAuth,PecunioUser,$q, AccessToken){
		
		return {
		
			getPersonalData: function() {	
				var def = $q.defer();	
				
				var userData = {'id':LoopBackAuth.currentUserId};

		    	return  PecunioUser.getPersonalData(userData)
				        .$promise
				        .then(function(data){
				            
				            def.resolve(data);
				            return def.promise;
				        });
		    },
		    changePassword: function(userData) {	
				var def = $q.defer();	
				userData.id = LoopBackAuth.currentUserId;
				
		    	return  PecunioUser.changePassword(userData)
				        .$promise
				        .then(function(data){
				            def.resolve(userData);
				            return def.promise;
				        });
		    },
		    editPersonalData: function(userData) {	
				var def = $q.defer();	
		    	return  PecunioUser.editPersonalData(userData)
				        .$promise
				        .then(function(data){
				            def.resolve(data);
				            return def.promise;
				        });
		    },
		    getRoles: function(userData) {	
				var def = $q.defer();	
		    	return  PecunioUser.getRoles(userData)
				        .$promise
				        .then(function(data){
				            
				            var roles = data.roles;
				            var finalRoles = [];
				            var j=0;
							for(var i=0; i<roles.length; i++){
							    
						      if(roles[i].name != '​account_owner'){
						        
						        finalRoles[j] = roles[i];
						        j++;
						      }  
							}
							
				            def.resolve(finalRoles);
				            return def.promise;
				            
				        });
		    },

		    getRoleName: function(userData) {	
				var def = $q.defer();	
		    	return  PecunioUser.getRoleName(userData)
				        .$promise
				        .then(function(data){
				           
				            def.resolve(data.role);
				            return def.promise;
				            
				        });
		    },

		    deleteGroup: function(gId){
		    	var def = $q.defer();	
		    	var gData = {'id':gId,'status':2};
		    	
		    	return  PecunioUser.deleteGroup(gData)
				        .$promise
				        .then(function(data){
				           
				            def.resolve(data.group);
				            return def.promise;
				            
				   		});

		    },

		    getGroups: function() {	
				var def = $q.defer();
				var userData = {'accountOwnerId' : LoopBackAuth.currentUserId};	
				
		    	return  PecunioUser.getGroups(userData)
				        .$promise
				        .then(function(data){
				            
				            var groups = data.groups;
				            def.resolve(groups);
				            return def.promise;
				            
				        });
		    },

		    getDomains: function() {	
				var def = $q.defer();
				var userData = {'publisherId' : LoopBackAuth.currentUserId};	
				
		    	return  PecunioUser.getDomains(userData)
				        .$promise
				        .then(function(data){
				            
				            var domains = data.domains;
				            def.resolve(domains);
				            return def.promise;
				            
				        });
		    },

		    getDomain: function(data) {	
				var def = $q.defer();	
				
		    	return  PecunioUser.getDomain(data)
				        .$promise
				        .then(function(data){
				            
				            var domain = data.domain;
				            def.resolve(domain);
				            return def.promise;
				            
				        });
		    },

		    saveGroup: function(gData){
		    	var def = $q.defer();	
		    	return  PecunioUser.saveGroup(gData)
				        .$promise
				        .then(function(data){
				           
				            def.resolve(data.group);
				            return def.promise;
				   		});

		    },

		    getGroup: function(data) {	
				var def = $q.defer();
			
		    	return  PecunioUser.getGroup(data)
				        .$promise
				        .then(function(data){
				            def.resolve(data.group);
				            return def.promise;
				        });
		    },

		    getCompanyDetails: function() {	
				var def = $q.defer();
				var userData = {'userId' : LoopBackAuth.currentUserId};	
				
		    	return  PecunioUser.getCompany(userData)
				        .$promise
				        .then(function(data){
				            def.resolve(data.comapny);
				            return def.promise;
				        });
		    },

		    saveCompany: function(cData){
		    	
		    	var def = $q.defer();	
		    	return  PecunioUser.saveCompany(cData)
				        .$promise
				        .then(function(data){
				            def.resolve(data.company);
				            return def.promise;
				   		});

		    },

		    getFinanceDetails: function() {	
				var def = $q.defer();
				var userData = {'userId' : LoopBackAuth.currentUserId};	
		    	return  PecunioUser.getFinance(userData)
				        .$promise
				        .then(function(data){
				            def.resolve(data.finance);
				            return def.promise;
				        });
		    },

		    saveFinance: function(fData){
		    	var def = $q.defer();	
		    	return  PecunioUser.saveFinance(fData)
				        .$promise
				        .then(function(data){
				            def.resolve(data.finance);
				            return def.promise;
				   		});

		    },
		    
		    /**
		     * Function for save Avatar image
		     * @param  {[object]}
		     * @return {[type]}
		     */
		    saveAvatar: function(affiliateData) {
		    	var def = $q.defer();	
		    	return  PecunioUser.saveAvatar(affiliateData)
				        .$promise
				        .then(function(data){
				        	def.resolve(data);
				            return def.promise;
				   		});
				
			},

			/**
			 * Function for getting avatar file name from database
			 * @param  {[number]}
			 * @return {[type]}
			 */
			getImage: function(userId) {
		    	var def = $q.defer();	
		    	return  PecunioUser.getImage(userId)
				        .$promise
				        .then(function(data){
				        	def.resolve(data);
				            return def.promise;
				   		});
				
			},

			/**
			 * Function for getting logo(s) file name from database
			 * @param  {[number]}
			 * @return {[type]}
			 */
			getLogos: function(userId) {
		    	var def = $q.defer();	
		    	return  PecunioUser.getLogos(userId)
				        .$promise
				        .then(function(data){
				        	def.resolve(data);
				            return def.promise;
				   		});
				
			},

		    /**
		     * Function for save logo(s)
		     * @param  {[type]}
		     * @return {[type]}
		     */
		    saveAllLogo: function(companyData) {
		    	var def = $q.defer();	
		    	return  PecunioUser.saveAllLogo(companyData)
				        .$promise
				        .then(function(data){
				        	def.resolve(data);
				            return def.promise;
				   		});
				
			},

			/**
		     * Function for delete logo
		     * @param  {[type]}
		     * @return {[type]}
		     */
			deleteLogoFile: function(file1) {
		    	var file2 = {'filename':file1};
		    	var def = $q.defer();	
		    	return  PecunioUser.deleteLogoFile(file2)
				        .$promise
				        .then(function(data){
				        	def.resolve(data);
				            return def.promise;
				   		});
				
			},

			createAccessTocken : function(user) {

		    	var def = $q.defer();	
		    	return  AccessToken.create(user)
				        .$promise
				        .then(function(data){
				        	def.resolve(data);
				            return def.promise;
				   		});

			}

		}
		
}]);