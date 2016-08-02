PecunioApp

.factory('sidebarFactory',['$http',function($http){
	/**
	 * Method to get support data showing in sidebar
	 * 
	 */
	function getSupport(){
		return $http.get('/data/sidebarSupport.json');
	}
	return {
		getSupport : getSupport
	};
}]);