
PecunioApp

.factory('publisherDomainFactory',[ 'PublisherDomain','$q', 'UtilityModel', function (PublisherDomain, $q, UtilityModel) {

    return {
   
		
	    getDomainByPublisherId: function(id){
	    	var def = $q.defer();
	    	var pubData = {'publisherId':id};
	    	
	    	return  PublisherDomain.searchDomainByPublisherId(pubData)
				        .$promise
				        .then(function(data){
				            
				            def.resolve(data);
				            return def.promise;
				        });
	    },

	    getDomainsByPublisherId: function(id){
	    	var def = $q.defer();
	    	var pubData = {'publisherId':id};
	    	
	    	return  PublisherDomain.getDomainsByPublisherId(pubData)
				        .$promise
				        .then(function(data){
				            
				            def.resolve(data);
				            return def.promise;
				        });
	    },

	    getDomainByName: function(domainData){
	    	
	    	var def = $q.defer();
	    	
	    	return  PublisherDomain.searchDomainByName(domainData)
				        .$promise
				        .then(function(data){
				            
				            def.resolve(data);
				            return def.promise;
				        });
	    },

	    getHash: function(hashData){
	    	
	    	var def = $q.defer();
	    	
	    	return  PublisherDomain.getHash(hashData)
				        .$promise
				        .then(function(data){
				            
				            def.resolve(data);
				            return def.promise;
				        });
	    },

	    checkMetaForTV: function(metaData){
	    	
	    	var def = $q.defer();
	    	
	    	return  PublisherDomain.technicalApproval(metaData)
				        .$promise
				        .then(function(data){
				            
				            def.resolve(data);
				            return def.promise;
				        });
	    },

	    getDomain: function(domainData){
	    	var def = $q.defer();
	    	
	    	return  PublisherDomain.getDomain(domainData)
				        .$promise
				        .then(function(data){
				            
				            def.resolve(data);
				            return def.promise;
				        });
	    },

	    registerDomain: function(domainData){
	    	var def = $q.defer();
	    	
	    	return  PublisherDomain.createDomain(domainData)
				        .$promise
				        .then(function(data){
				            def.resolve(data);
				            return def.promise;
				        });
	    },

	    postSupportTicket : function(ticketData){

	    	var def = $q.defer();
	    	
	    	return  UtilityModel.postSupprtTicketForDomain(ticketData)
				        .$promise
				        .then(function(data){
				            
				            def.resolve(data);
				            return def.promise;
				        });
	    },

	    getSupportTickets : function(userInfo){

	    	var def = $q.defer();
	    	return  UtilityModel.getTickets(userInfo)
				        .$promise
				        .then(function(data){
				            
				            def.resolve(data);
				            return def.promise;
				        });
	    },

	    replyWithPrivateNote : function(replyData){

	    	var def = $q.defer();
	    	
	    	return  UtilityModel.replySupprtTicketForDomain(replyData)
				        .$promise
				        .then(function(data){
				            
				            def.resolve(data);
				            return def.promise;
				        });
	    }
	}
}]);