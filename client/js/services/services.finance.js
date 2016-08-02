PecunioApp.factory('FinanceService', [ '$http', '$q', 'Widget', function($http, $q, Widget) {

	return {

		getList : function() {
			return $http.get('/data/finance.json');
		},
		getWidgets : function(){
			
			var def = $q.defer();
			//{"filter":{"where": {"location": "finance"}}}
			return Widget.find().$promise.then(function(data){
				def.resolve(data);
				return def.promise;
			});
		},
	};
} ]);