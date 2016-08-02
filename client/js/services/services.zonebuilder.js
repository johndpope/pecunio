PecunioApp
.factory('zonebuilderFactory',['$http','$q','ZoneType','ZoneBuilder',function($http,$q,ZoneType,ZoneBuilder){
		
		function setWebData(data){
			if(!_.isEmpty(data)){
				localStorage.removeItem('sendData');
				localStorage.setItem('sendData', JSON.stringify(data));
			}
			return true;
		}

		function getWebData(){
			var getWebData = localStorage.getItem('sendData'); 
			if(!_.isEmpty(getWebData)){
				var jsonArr = JSON.parse(getWebData);
				return jsonArr;
			}
		}
		return {
			setWebData : setWebData,
			getWebData : getWebData
			
		};
}]);