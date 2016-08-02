PecunioApp
.factory('userDetailsFactory',['$rootScope','$q','PecunioUser','Affiliates',function($rootScope,$q,PecunioUser,Affiliates){
		/**
		 * Set user details to llocal/session storage
		 * @param {number} uId [user id]
		 */
		function setUserDetails(uId){
			
			if(uId){
				var def = $q.defer();
				var resp = {};
	        	var acctOwneremail;
	        	var acctOwnername;
	        	var acctownerId;
	        	
	        	PecunioUser.getPersonalData({'id':uId})
	            .$promise
	            .then(function(data){
	    	            var res = data.user;
	    	            if(res.affiliate.accountOwnerId == 0){  ///accountowner
	    	            	acctOwneremail = res.user.email;
	    	            	acctOwnername = res.affiliate.fullName;
	    	            	acctownerId = uId;
	    	            	
	    	            }else{
	    	            	acctOwneremail = res.accountOwner.email;
	    	            	acctOwnername =  res.accountOwner.email;
	    	            	acctownerId = res.affiliate.accountOwnerId;
	    	            }
	    	            
	    	            var userData = {"acctOwneremail":acctOwneremail,"acctOwnername":acctOwnername,"acctownerId":acctownerId,"roleId":res.role.roleId};
          	            if(!_.isEmpty(userData)){
          	            	localStorage.setItem('userData', JSON.stringify(userData));
          	            }
          	            

	    	            def.resolve(true);
	    	            
	            });
	        	
	        	return def.promise;	
			}
		}
		
		/**
		 * get user details from session/local storage
		 * @return {array} [array of user details]
		 */
		function getUserDetails(){

			var getUserdata = localStorage.getItem('userData'); 
			if(!_.isEmpty(getUserdata)){
				var jsonUserArr = JSON.parse(getUserdata);
				return jsonUserArr;
			}
		}
		/* get user role */
		function getUserRole(uId){
			var def = $q.defer();
			PecunioUser.getRole({"id":uId})
     	   		.$promise
     	   		.then(function(data){
            	     def.resolve(data.role.roleId);
          	     
     	   		});
			return def.promise;	
		}
		
		return {
			setUserDetails : setUserDetails,
			getUserDetails : getUserDetails,
			getUserRole : getUserRole
		};
}]);