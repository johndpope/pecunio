PecunioApp

.factory('AccountUsersFactory',['PecunioUser','$q',function(PecunioUser,$q){
		
		return {
			/**
			 * Method to get all account user
			 * @param {object} userData
			 * @return promise
			 */
			getAccountUsers: function(userData) {	
				var def = $q.defer();	
		    	return  PecunioUser.getAccountUsers(userData)
				        .$promise
				        .then(function(data){
				            def.resolve(data.users[0]);
				            return def.promise;
				        });
		    },
		    
		    /**
		     * Method to delete account user
		     * @param {object} user
		     * @return promise
		     */
		    deleteAccountUser: function(user) {	
				var def = $q.defer();	
				
		    	return  PecunioUser.deleteUser(user)
				        .$promise
				        .then(function(data){
				            
				            def.resolve(data);
				            return def.promise;
				            
				        });
		    },
		    
		    /**
		     * Method to change status 
		     * @param {obejct} user
		     * @return promise
		     */
		    changeStatus: function(user) {	
				var def = $q.defer();	
				
		    	return  PecunioUser.changeStatus(user)
				        .$promise
				        .then(function(data){
				            
				            def.resolve(data);
				            return def.promise;
				            
				        });
		    },
		    
		    /**
		     * Method to change group
		     * @param {object} user
		     * @return promise
		     */
		    changeGroup: function(user) {	
				var def = $q.defer();	
				
		    	return  PecunioUser.changeGroup(user)
				        .$promise
				        .then(function(data){
				            
				            def.resolve(data);
				            return def.promise;
				            
				        });
		    },
		    
		    /**
		     * Method to change role
		     * @param {object} user
		     * @return promise
		     */
		    changeRole: function(user) {	
				var def = $q.defer();	
				
		    	return  PecunioUser.changeRole(user)
				        .$promise
				        .then(function(data){
				            
				            def.resolve(data);
				            return def.promise;
				            
				        });
		    },

		    /**
		     * Method to get an account user
		     * @param {object}userData
		     * @return promise
		     */
		    getAccountUser: function(userData) {	
				var def = $q.defer();	
		    	return  PecunioUser.getAccountUser(userData)
				        .$promise
				        .then(function(data){
				            var userArr = data;				            
				            def.resolve(userArr);
				            return def.promise;
				            
				        });
		    },
		    
		    /**
		     * Method to create account user
		     * @param {object} userData
		     * @return promise
		     */
		    createAccountUser: function(userData) {	
		    	
				var def = $q.defer();	
		    	return  PecunioUser.createAccountUser(userData)
				        .$promise
				        .then(function(data){
				            				            
				            def.resolve(data);
				            return def.promise;
				            
				        });
		    },

		    /**
		     * Method to create and send password link
		     * @param {object} emailData
		     * @return promise
		     */
		    sendCreatePasswordLink: function(emailData) {	
		    	
				var def = $q.defer();	
		    	return  PecunioUser.sendCreatePasswordLink(emailData)
				        .$promise
				        .then(function(data){
				            				            
				            def.resolve(data);
				            return def.promise;
				            
				        });
		    },
		    
		    /**
		     * Method to edit account user
		     * @param {object} userData
		     * @return promise
		     */
		    editAccountUser: function(userData) {	
				var def = $q.defer();	
		    	return  PecunioUser.editAccountUser(userData)
				        .$promise
				        .then(function(data){
				            				            
				            def.resolve(data);
				            return def.promise;
				            
				        });
		    }
		}
}]);