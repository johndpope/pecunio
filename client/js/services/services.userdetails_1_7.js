PecunioApp
.factory('userDetailsFactory',['$rootScope','$q','PecunioUser','Affiliates',function($rootScope,$q,PecunioUser,Affiliates){
		function getUserDetails(uId){
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
	    	            resp['acctOwneremail'] = acctOwneremail;
	    	            resp['acctOwnername'] = acctOwnername;
	    	            resp['acctownerId'] = acctownerId;
	    	            resp['roleId'] = res.role.roleId;
	    	            
	    	            def.resolve(resp);
	    	            
	            });
	        	
	        	return def.promise;	
			}
		}
		
		/* get user role */
		function getUserRole(uId){
			//console.log("SERVICE : "+uId);
			var def = $q.defer();
			PecunioUser.getRole({"id":uId})
     	   		.$promise
     	   		.then(function(data){
            	     def.resolve(data.role.roleId);
          	     
     	   		});
			return def.promise;	
		}
		
		return {
			getUserDetails : getUserDetails,
			getUserRole : getUserRole
		};
}]);