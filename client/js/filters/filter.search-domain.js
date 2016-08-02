PecunioApp

.filter('searchByDomainName', function() {
	  
	  return function (items, letter) {
		
		    var filtered = [];
		    var letterMatch = new RegExp(letter, 'i');
		    if(items.length > 0){
		    	if(letter && letter.length>=1){
					for (var i = 0; i < items.length; i++) {
					  var item = items[i];
					  if (letterMatch.test(item.domainName.substring(0,letter.length))) {
					  	
						filtered.push(item);
					  }
					}
					return filtered;
				}
		    }
			
	  };

});