(function() {
  'use strict';

/* Pecunio Services */

angular.module('pecunio.services', [])

.factory('AppAuth', function() {
    return {
      currentUser: null,

      // Note: we can't make the User a dependency of AppAuth
      // because that would create a circular dependency
      // AppAuth <- $http <- $resource <- LoopBackResource <- User <- AppAuth
      ensureHasCurrentUser: function(PecunioUser) {
        if (this.currentUser) {
          //console.log('Using cached current user.');
        } else {
          //console.log('Fetching current user from the server.');
          this.currentUser = PecunioUser.getCurrent(function(data) {
            // success
            
          }, function(response) {
            //console.log('PecunioUser.getCurrent() err', arguments);
          });
        }
      }
    }
})

.factory('pecunioACLService', function(PecunioUser, $q){
	return {
		checkLoggedInUserkRole: function(userId){
	
			var def = $q.defer();
			return  PecunioUser.getRole({"id":userId})
				        	   .$promise
				               .then(function(data){
				               		 if(data.role != undefined){
				               		 	def.resolve(data.role.roleId);
				               		 }
				             	     return def.promise;
				                });
		}
	}
	
})
.factory('pecunioDateService', function() {
	  return {
		  setDate: function(dateString) {
			    var t = moment.tz(dateString, "America/Los_Angeles");
			  	t.set('hour', 0);
				t.set('minute', 0);
				t.set('second', 0);
				t.set('millisecond', 0);
	 	    	return t.utc().valueOf();
	 	    }
	  } 
})
.factory('pecunioFonts', function() {
	  
			    var options = [
			    {name: 'Sans-Serif', value: 'Arial,Helvetica,sans-serif'},
				{name: 'Serif', value: "'times new roman',serif"},
				{name: 'Wide', value: "'arial black',sans-serif"},
				{name: 'Narrow', value: "'arial narrow',sans-serif"},
				{name: 'Comic Sans MS', value: "'comic sans ms',sans-serif"},
				{name: 'Courier New', value: "'courier new',monospace"},
				{name: 'Garamond', value: 'garamond,serif'},
				{name: 'Georgia', value: 'georgia,serif'},
				{name: 'Tahoma', value: 'tahoma,sans-serif'},
				{name: 'Trebuchet MS', value: "'trebuchet ms',sans-serif"},
				{name: "Helvetica", value: "'Helvetica Neue',Helvetica,Arial,sans-serif"},
				{name: 'Verdana', value: 'verdana,sans-serif'},
				{name: 'Proxima Nova', value: 'proxima_nova_rgregular'}];
				
	 	    	return options;
	
})

.factory('publisherDomainList', function(PublisherDomain, $q) {
	  
	return {
		  getDropDownList: function(userId) {
						   
				 	    	var def = $q.defer();
							return  PublisherDomain.find({ filter: { where:{"publisherId":userId, "status": 2}}}).$promise.then(function(list){
								                def.resolve(list);
								                return def.promise;
								     });
		   }
	} 
	
})

.factory('AbstractRepository', [function () {
	  	function AbstractRepository(restangular, route) {
			  this.restangular = restangular;
			  this.route = route;
		}
	  	
		AbstractRepository.prototype = {
			getList: function (params) {
				return this.restangular.all(this.route).getList(params).$object;
			},
			get: function (id) {
				return this.restangular.one(this.route, id).get();
			},
			find: function (id) {
				return this.restangular.one(this.route, id).findOne({"employee": 216});
			},
			getView: function (id) {
				return this.restangular.one(this.route, id).one(this.route + 'view').get();
			},
			update: function (updatedResource) {
				return updatedResource.put().$object;
			},
			create: function (newResource) {
				return this.restangular.all(this.route).post(newResource);
			},
			remove: function (object) {
				return this.restangular.one(this.route, object.id).remove();
			}
		};
		
		AbstractRepository.extend = function (repository) {
			repository.prototype = Object.create(AbstractRepository.prototype);
			repository.prototype.constructor = repository;
		};
		return AbstractRepository;
	}])
	
	//Alert services to show alert messages to the user
	
	.factory('alertService', ['$modal', function ($modal) {

		var alert = {

			showAlert: function (message, type) {
							
					return $modal.open({
		                templateUrl: 'views/alerts/show-alert.html',
		                controller: 'AlertController',
		                size: 400,
		                windowClass: 'alert-model',
		                resolve: {
		                	msgType : function(){
		                		return type;
		                	},
		                	msgText : function(){
		                		return message;
		                	}
		                }
		                
		            });

			},

		};
	return alert;
	}])

	.factory('multiMsgAlertService', ['$modal', function ($modal) {

		var alert = {

			showAlert: function (message, type) {
							
					return $modal.open({
		                templateUrl: 'views/alerts/multi-message.html',
		                controller: 'AlertController',
		                size: 400,
		                windowClass: 'alert-model',
		                resolve: {
		                	msgType : function(){
		                		return type;
		                	},
		                	msgText : function(){
		                		return message;
		                	}
		                }
		                
		            });

			},

		};
	return alert;
	}]);

})();
