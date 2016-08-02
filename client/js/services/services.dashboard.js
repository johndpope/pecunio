
PecunioApp

.factory('DashboardService',[ '$http', '$q', 'Widget', function ($http, $q, Widget) {

    return {
    	/**
    	 * Method to page type
    	 */
		getDashboardTypes: function(pagename) {	
            
            switch(pagename){

		        case '/dashboard': 
		           return $http.get('/data/dashboardtypes.json');
		           break;
		        case '/werbemittel': 
		           return $http.get('/data/werbemittelpagehead.json');
		           break;
		        default:
		           return $http.get('/data/dashboardtypes.json');     
		    }
	    },
	    
	    /**
	     * Method to get widgets
	     */
	    getWidgets : function(){
			
			var def = $q.defer();
			return Widget.find().$promise.then(function(data){
				def.resolve(data);
				return def.promise;
			});
		}
	}
}]);