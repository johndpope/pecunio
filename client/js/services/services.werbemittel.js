
PecunioApp
.factory('WerbemittelService',[ '$http', function ($http) {

    return {
   
		getList: function() {	
           		return $http.get('/data/werbemittleList.json');
        }
	}
}]);