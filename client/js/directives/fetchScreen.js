/**
 * Directive file to generate the canvas with screen image of webpage and
 * draw/render zones on the canvas. When webpage is added for first time,
 * screen image is rendered by phantom js. When entering details of 
 * already existing webpage, screen image is fetched from folder.
 * 
 */

PecunioApp
.directive('fetchScreen', ['ZoneBuilder','$timeout','$state','zonebuilderFactory', function(ZoneBuilder,$timeout,$state,zonebuilderFactory) {
    return {
    	restrict: 'E',
        templateUrl: 'views/common/fetch-screen.html',
        link : function (scope){
		   		
        	     jQuery(".page-spinner-bar").addClass("show");
        	     /**
        	      * Function to draw all zone area on canvas
        	      * @param  {object} webData [contains webpage data]
        	      * 
        	      */
        	     scope.drawAllZones = function(webData){
        	    	 if(webData){
        	    		 for(var eachZone in webData){
				 				var w = parseInt(webData[eachZone].zonewidth);
				 				var h = parseInt(webData[eachZone].zoneheight);
				 				var t = parseInt(webData[eachZone].zonepositiony);
				 				var l = parseInt(webData[eachZone].zonepositionx);
				 				var zonId = String(webData[eachZone].zoneid);
				 				var inptText = "";
				 				if(webData[eachZone].zonename != undefined) 
				 					 inptText = webData[eachZone].zonename+"( ID : "+zonId+")"; 
				 				else inptText = "Enter Zone Name Here"; 
				 				if(t != 'Nan' && l != 'Nan' && zonId != undefined){
	 				 				var fabRect = new fabric.Rect({ width: w, height: h, fill: '#d6e9c6', top: t, left: l,opacity: 0.85,stroke:zonId});
		 							scope.canvas1.add(fabRect);
		 							scope.zoneCanvas.push(fabRect);
		 							var text = new fabric.IText(inptText, { left: l, top: t,fontSize: 20 });
		 							scope.canvas1.add(text);
				 				}
				 				
				 		}
				 			
				 			scope.canvas1.renderAll();
		 				 	for(var i=0; i< scope.canvas1.getObjects().length; i++){
		 				 		scope.canvas1.getObjects()[i].hasControls = false;
		 				 	}
		 				 	
        	    	 }
        	     }
        	     /**
        	      * Function to initialize all zones
        	      * @param  {object} webData [contains webpage data]
        	      *
        	      */
        	     scope.initAllZones = function(webData){
        	    	 if(webData){
	 				 		scope.height;
	 				 		scope.width;
	 				 		scope.top;
	 				 		scope.left;
	 				 		scope.zoneName;
	 				 		scope.zoneModifyObj = {};
	 				 		scope.canvas1.on('object:selected', function(e){
	 				 			if(e.target.type=='rect') {
	 				 				var zoneId = parseInt(e.target.stroke);
	 				 				e.target.fill = "#77f";
	 				 				jQuery("#zoneId").val(zoneId);
	 				 				jQuery(".thumbnail").removeClass("active");
	 				 				jQuery("#zonethumb__"+zoneId).addClass("active");
	 				 				jQuery(".modIcon").remove(); 
		 				 	        var btnLeft = e.target.oCoords.mt.x;
		 				 	        var btnTop = e.target.oCoords.mt.y - 18;
		 				 	        var widthadjust=e.target.width/2;
		 				 	        btnLeft=widthadjust+btnLeft-10;
		 				 	        var btnLeftD = btnLeft - 20 ;  
		 				 	        var editCodeBtn = '<p class="modIcon" id="editZone" title="Edit" style="position:absolute;top:'+btnTop+'px;left:'+btnLeftD+'px;cursor:pointer;"><i class="fa fa-pencil"></i></p>';
		 				 	        jQuery(".canvas-container").append(editCodeBtn);
		 				 	        if(scope.delCanSee.indexOf(scope.userRole) > -1){
		 				 	        	var deleteCodeBtn = '<p class="modIcon" id="delZone" title="Delete" style="position:absolute;top:'+btnTop+'px;left:'+btnLeft+'px;cursor:pointer;"><i class="fa fa-trash"></i></p>';
		 				 	        	jQuery(".canvas-container").append(deleteCodeBtn);
		 				 	        }
		 				 	        ////initialize zone obj
		 				 	        var thisObjIndex = e.target.canvas.getObjects().indexOf(e.target);
		 							var otherObj = e.target.canvas.getObjects()[thisObjIndex+1];
		 							scope.height = e.target.height;
		 							scope.width = e.target.width; 
		 							scope.top = e.target.getTop();
		 							scope.left = e.target.getLeft();
		 							scope.zoneName = otherObj.__text;
		 							scope.zoneModifyObj = {
			 									"zoneheight":scope.height,
			 									"zonewidth":scope.width,
			 									"zoneleft":scope.left,
			 									"zonetop":scope.top,
			 									"currentWebId":scope.currentWebsiteId,
			 									"imgpath":scope.screenPath,
			 									"zonename":scope.zoneName
		 									  };
		 							
	 				 			}
	 				 		});
	 				 		
	 				 		scope.canvas1.on('object:moving', function(e){
	 				 			
	 				 			jQuery(".modIcon").remove(); 
	 				 			var top;
	 				 			var left;
	 				 			var thisObjIndex;
	 							var otherObj;
	 							if(e.target.type=='rect') {
	 								thisObjIndex = e.target.canvas.getObjects().indexOf(e.target);
	 								if(thisObjIndex > -1) {
	 									top = e.target.top + 1;
	 									left = e.target.left + 1;
		 								otherObj =  e.target.canvas.getObjects()[thisObjIndex+1];
		 								otherObj.set({ left: left, top: top });
	 								}
	 							} else if(e.target.type=='i-text') {
	 								thisObjIndex =  e.target.canvas.getObjects().indexOf(e.target);
	 								if(thisObjIndex > -1) {
	 									top = e.target.top - 1;
	 									left = e.target.left - 1;
		 								otherObj =  e.target.canvas.getObjects()[thisObjIndex-1];
		 								otherObj.set({ left: left, top: top });  
	 								}
	 								
	 							}
	 				 		});
	 				 		
	 				 		scope.canvas1.on('mouse:down',function(e){
	 				 			var el = scope.canvas1.getActiveObject();
	 				 		    if(el){
	 				 		    } else{jQuery(".modIcon").remove(); }
	 				 		});
	 				 		scope.canvas1.on('text:changed', function(e) {
	 						    scope.zoneName = e.target.__text;
	 						});
	 				 		scope.canvas1.on('object:modified', function(e){
	 				 			var thisObjIndex;
	 				 			var otherObj;
	 				 			if(e.target.type=='rect') {
	 				 				var zoneId = parseInt(e.target.stroke);
	 				 				e.target.fill = "#d6e9c6";
	 				 				jQuery("#zoneId").val(zoneId);
	 				 				jQuery(".modIcon").remove(); 
		 				 	        var btnLeft = e.target.oCoords.mt.x;
		 				 	        var btnTop = e.target.oCoords.mt.y - 18;
		 				 	        var widthadjust=e.target.width/2;
		 				 	        btnLeft=widthadjust+btnLeft-10;
		 				 	        var btnLeftD = btnLeft - 20;
		 				 	        var editCodeBtn = '<p class="modIcon" id="editZone" title="Edit" style="position:absolute;top:'+btnTop+'px;left:'+btnLeftD+'px;cursor:pointer;"><i class="fa fa-pencil"></i></p>';
		 				 	        jQuery(".canvas-container").append(editCodeBtn);
		 				 	        if(scope.delCanSee.indexOf(scope.userRole) > -1){
		 				 	        	var deleteCodeBtn = '<p class="modIcon" id="delZone" title="Delete" style="position:absolute;top:'+btnTop+'px;left:'+btnLeft+'px;cursor:pointer;"><i class="fa fa-trash"></i></p>';
		 				 	        	jQuery(".canvas-container").append(deleteCodeBtn);
		 				 	        }
		 				 	        ////modified zone obj
		 				 	        thisObjIndex = e.target.canvas.getObjects().indexOf(e.target);
		 							otherObj = e.target.canvas.getObjects()[thisObjIndex+1];
		 							scope.zoneName = otherObj.__text;
		 							scope.height = e.target.height;
		 							scope.width = e.target.width; 
		 							scope.top = e.target.getTop();
		 							scope.left = e.target.getLeft();
	 				 			}else if(e.target.type=='i-text'){
	 				 				////modified zone obj
	 				 				thisObjIndex = e.target.canvas.getObjects().indexOf(e.target);
		 							otherObj = e.target.canvas.getObjects()[thisObjIndex-1];
		 							scope.zoneName = e.target.__text;
		 							scope.height = otherObj.height;
		 							scope.width = otherObj.width; 
		 							scope.top = otherObj.getTop();
		 							scope.left = otherObj.getLeft();
	 				 			} 
	 							scope.zoneModifyObj = {
		 									"zoneheight":scope.height,
		 									"zonewidth":scope.width,
		 									"zoneleft":scope.left,
		 									"zonetop":scope.top,
		 									"currentWebId":scope.currentWebsiteId,
		 									"imgpath":scope.screenPath,
		 									"zonename":scope.zoneName
	 									  };
	 				 			
	 				 		});
   		 					
        	    	 }
        	     }
        	     
        	     scope.webData;
        	     /**
        	      * Function to initialize directive
        	      * 
        	      */
        		 scope.init = function(){
        		 //var getdata = sessionStorage.getItem('sendData');
        		 //var jsonArr = JSON.parse(getdata);  
        		 var jsonArr = zonebuilderFactory.getWebData(); //changed for session storage conflict 
        		 var webUrl = jsonArr.webUrl;
	 			  if(webUrl != null){  
	 				 scope.currentWebsiteId = jsonArr.currentWebsite.publisherId;
	  			   	 scope.msg = '';
	  			     ZoneBuilder.find({'filter':{'where':{'webpageId':scope.currentWebsiteId,'isDel':0}}})
		   	 					.$promise
		   	 					.then(function(data){
		   	  			   	 		scope.webData = data;
				   	  			   	if(scope.webData.length > 0){
				   		 					scope.screenPath = scope.webData[0].screenimage; 
					   		 				if(scope.canvas1 === undefined || scope.canvas1 === null){
					   		 					scope.canvas1 = new fabric.Canvas('screenCanvas');
				   		 					}else{
				   		 						scope.canvas1.clear();
				   		 					}
					 				 		var img = new Image();
					 				 		img.src = scope.screenPath;
					 				 		img.onload = function() { 
					 				 			scope.width = img.naturalWidth;
						 			  			scope.height = img.naturalHeight;
					 				 			scope.canvas1.setWidth(img.naturalWidth);
					 				 			scope.canvas1.setHeight(img.naturalHeight);
					 				 			scope.canvas1.calcOffset();
					 				 			var image = new fabric.Image(img,{
					 				 				left: 0,     //513,
					 				 				top: 0,     //1840,
					 				 				width: scope.width,
					 				 				height: scope.height
					 				 			});
					 				 			scope.canvas1.setBackgroundImage(image); 
					 				 			scope.drawAllZones(scope.webData);
					 				 			scope.initAllZones(scope.webData);

					 				 			
					 		 				 	jQuery(".page-spinner-bar").removeClass("show");
		 				 						jQuery(".page-spinner-bar").addClass("hide");
					 				 		};
				   		 					
					 				 		
					 				 		
				   		 			}else{ 
			   		 					  ZoneBuilder.screenCapture({'website':{"weburl":webUrl,"height":768,"width":1024}})
			   			 				   .$promise
			   			 		  			.then(function (data){
			   			 		  				if(data){
			   			 		  					if(data.screen.isPageOpen == true){
			   			 		  						if(data.screen.isPageRendered == true){
			   			 		  							scope.screenPath = data.screen.screenPath;
				   			 		  						jQuery(".page-spinner-bar").removeClass("show");
					   			 		 				 	jQuery(".page-spinner-bar").addClass("hide");
					   			 		 				 	//$timeout(alert("dadasdsa"),0);
					   			 		 				 	scope.canvas1 = new fabric.Canvas('screenCanvas');					   			 	 				 		
					   			 		 				 	var img = new Image();
					   			 	 				 		img.src = scope.screenPath;
					   			 	 				 		img.onload = function() { 
					   			 	 				 			scope.width = img.naturalWidth;
					   			 		 			  			scope.height = img.naturalHeight;					   			 	 				 			
					   			 		 			  			scope.canvas1.setWidth(img.naturalWidth);
					   			 	 				 			scope.canvas1.setHeight(img.naturalHeight);
					   			 	 				 			scope.canvas1.calcOffset();
					   			 	 				 			var image = new fabric.Image(img,{
					   			 	 				 				left: 0,    //513,
					   			 	 				 				top: 0,     ///2811,
					   			 	 				 				width: scope.width,
					   			 	 				 				height: scope.height
					   			 	 				 			});
					   			 	 				 			scope.canvas1.setBackgroundImage(image); 
					   			 	 				 			scope.canvas1.renderAll();
					   			 	 				 		}
				   			 		  						
			   			 		  						}else{
			   			 		  							scope.msg = 'Page could not be rendered';
			   			 		  						}
			   			 		  					}else{
			   			 		  						
			   			 		  						scope.msg = 'Page could not be opened';
			   			 		  					}
			   			 		  					
			   			 		  				}
			   			 		  			});
				   		 			}
		   	 					});
	 			   }
        		
        		 }
        		 scope.init();
        }
    };
}]);