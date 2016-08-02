
module.exports = function(ZoneType) {
	
	ZoneType.getZnType = function(filter,cb){

		ZoneType.find(filter,function(err,zonetypes){
						
			if(zonetypes.length > 0){
				for (var eachZn in zonetypes){
					var nHeight = Math.ceil(parseInt(zonetypes[eachZn].height/10)*3);
					var nWidth = Math.ceil(parseInt(zonetypes[eachZn].width/10)*3);
					if(nHeight > 70) nHeight = 70;
					if(nWidth > 145) nWidth = 145;
					zonetypes[eachZn].znHght = nHeight;
					zonetypes[eachZn].znWdth = nWidth;
				}
				cb(null, zonetypes);
			}else{
				  cb({"zonetypes missing" : "There is no zonetype entered"});
			  }
			
		});
		
		 
	};

	ZoneType.remoteMethod(
			'getZnType',
	        {
	          http: {path: '/getZnType', verb: 'get'},
	          accepts: {arg:'filter',type: 'object'},
	          returns: {arg: 'zonetypes', type: 'object'}
	        }
	);

};