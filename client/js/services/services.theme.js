
PecunioApp

.factory('themeFactory',[ 'Theme','$q', function (Theme, $q) {

    return {
   
	    /**
	     * Function for save data for theme
	     * @param  {[object]}
	     * @return {[type]}
	     */
	    saveThemeData: function(themeData){
	    	var def = $q.defer();
	    	return  Theme.saveThemeData(themeData)
			        .$promise
			        .then(function(data){
			            def.resolve(data);
			            return def.promise;
			    	});
	    },

	    /**
	     * Function for check exsiting domain
	     * @param  {[object]}
	     * @return {[type]}
	     */
	    checkDomainTheme: function(domainId){
			var def1 = $q.defer();
			return  Theme.checkDomainTheme(domainId)
					.$promise
	        		.then(function(resdata){
			            def1.resolve(resdata);
			            return def1.promise;
			        });
		}
	}
}]);