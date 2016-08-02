//'use strict';
/**
 * angular-select-text directive
 */
///angular.module('angular-select-text', []).
PecunioApp
  .directive('selectText', ['$window', function ($window) {
   var selectElement;

    if ($window.document.selection) {
      selectElement = function(element) {
        var range = $window.document.body.createTextRange();
        range.moveToElementText(element[0]);
        range.select();
      };
    } else if ($window.getSelection) {
      selectElement = function(element) {
    	  //alert(element[0].value);
        var range = $window.document.createRange();
        range.selectNode(element[0]);
        $window.getSelection().addRange(range);
      };
    }

    /*  var selectElement = "";
	    if($window.getSelection){
	    	selectElement = function(element){ return $window.getSelection();}
	    }else if($window.document.getSelection){
	    	selectElement = function(element){ return $window.document.getSelection();}
	    }else if($window.document.selection){
	    	selectElement = function(element){ return  $window.document.selection.createRange().text;}
	    }
	    
	    if(selectElement != ""){
	    	selectElement = selectElement.toString();
	    	element.focus();
	    	element.value = selectElement;
	    }else{
	        alert("Select a text in the page and then press this button!");
	    }
	    
	 */  
	    
	//////////    
    return {
      restrict: 'A',
      link: function(scope, element, attrs){
        element.bind('click', function(){
          selectElement(element);
        });
      }
    };
  }]);


/*function CopyText(el){
    var selectedText = "";
    if(window.getSelection){
        selectedText = window.getSelection();
    }else if(document.getSelection){
        selectedText = document.getSelection();
    }else if(document.selection){
        selectedText = document.selection.createRange().text;
    }
    if(selectedText != ""){
        selectedText = selectedText.toString();
        el.focus();
        el.value = selectedText;
    }else{
        alert("Select a text in the page and then press this button!");
    }
}*/