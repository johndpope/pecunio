PecunioApp

/**
 *  Directive to render Ad Customizer Toolbar
 */
.directive('adCustomizer', ['ProductType','VarianteDataModel', 'ZoneType','$timeout', 
                           function(ProductType,VarianteDataModel, ZoneType,$timeout) {
    return {
    	restrict: 'E',
        templateUrl: 'views/common/ad-customizer.html',
         link : function (scope){
        	
        }
    };
}])


/**
 *  Directive to render Form tool with all information
 */

.directive('adformTool', ['$timeout', 'PartnerForms',
                           function($timeout, PartnerForms) {


    return {
      restrict: 'E',
      scope: {
        changeAttr: '=ngModel'
      },
      templateUrl: 'views/common/form-tool.html',

         link : function (scope){

          var type = sessionStorage.getItem('type');
          var ftypeStr = JSON.parse(type);

          if(ftypeStr == 'update'){

            var selectedAdDetails = sessionStorage.getItem('selectedAdDetails');
            var tmpSelectedAdDetailsArr = JSON.parse(selectedAdDetails);

            var idArr = [];

            idArr.push(tmpSelectedAdDetailsArr.adDetails.uid);
            var filterData = {"filterData": { "uIds" :  idArr }};

            PartnerForms.getUserAdList(filterData).$promise.then(function(finalresponse){
              var selectedAdDetailsArr = finalresponse.response[0];
              scope.changeAttr.adMainColor = selectedAdDetailsArr.adDetails.mainColor;
              scope.changeAttr.adTextColor = selectedAdDetailsArr.adDetails.textColor;
              scope.changeAttr.adBgColor = selectedAdDetailsArr.adDetails.backgroundColor;
              scope.changeAttr.adBorderColor = selectedAdDetailsArr.adDetails.borderColor;
              scope.changeAttr.adButtonColor = selectedAdDetailsArr.adDetails.buttonColor;
              scope.changeAttr.adButtonbgColor = selectedAdDetailsArr.adDetails.buttonBg;
              scope.changeAttr.selectedSchemaType = selectedAdDetailsArr.adDetails.schemaType; 

              scope.changeAttr.ad_name = selectedAdDetailsArr.adDetails.branch; 
            });
          }
          else{
            scope.changeAttr.adMainColor = '#218cc4';
            scope.changeAttr.adTextColor = '#707070';
            scope.changeAttr.adBgColor = '#f8f8f8';
            scope.changeAttr.adBorderColor = "#cccccc";
            scope.changeAttr.adButtonColor = '#ffffff';
            scope.changeAttr.adButtonbgColor = '#e76043';
            scope.changeAttr.selectedSchemaType = 'gradient'; 
          }
        }
    };
}])


/**
 *  Directive to render preview window i.e. Iframe for the "form" type of Ad
 */

.directive('previewer', ['$timeout', 
                           function($timeout) {
    return {
        restrict: 'A',
        scope: {
          changeAttr: '=ngModel'
        },
        require: 'ngModel',
         link : function (scope, element, attrs, controller){

          // resize iframe
          function resizeIframe(){
            var iframeHeight = $(element).contents().find("html").height();
            var iframeWidth = $(element).contents().find("html").width();
            $(element).height(iframeHeight);
            $(element).width(iframeWidth);
            $('.thumbnail').attr('style', 'height:'+iframeHeight+'px; width:'+parseInt(iframeWidth+10)+'px;');
          }
          //resize iframe

          $('#editor').on("load", function() {
            resizeIframe();
          });
            
           var button_url = 'http://localhost/Werbemittel-2014/production/form1a/img/button_bumpmap.png';
           var $targetelement;

           // change main color
           scope.$watch('changeAttr.adMainColor', function (newValue, oldValue) {
                $targetelement = $(element).contents().find('body .slider_full');
                $targetelement.attr('style', 'background-color:'+newValue);

                $targetelement = $(element).contents().find('body .sliderHandle1a');
                $targetelement.attr('style', 'background-color:'+newValue);
                
           });

           // change background color
           scope.$watch('changeAttr.adBgColor', function (newValue, oldValue) {
                $body = $(element).contents().find('body');
                $body.attr('style', 'background-color:'+newValue);
           });

           // change font color:
           scope.$watch('changeAttr.adTextColor', function (newValue, oldValue) {
                $targetelement = $(element).contents().find('body #1a_form_container input');
                $targetelement.attr('style', 'color:'+newValue);

                $targetelement = $(element).contents().find('body #1a_form_container select');
                $targetelement.attr('style', 'color:'+newValue);
           }); 

           // change border color:
           scope.$watch('changeAttr.adBorderColor', function (newValue, oldValue) {
                scope.text11 = newValue;
                $targetelement = $(element).contents().find('body #1a_form_container input');
                $targetelement.attr('style', 'border-color:'+newValue);

                $targetelement = $(element).contents().find('body #1a_form_container select');
                $targetelement.attr('style', 'border-color:'+newValue);

                $targetelement = $(element).contents().find('body #1a_form_container .panel-default');
                $targetelement.attr('style', 'border-color:'+newValue);

                $targetelement = $(element).contents().find('body #1a_form_container .panel-heading');
                $targetelement.attr('style', 'border-color:'+newValue);

                $targetelement = $(element).contents().find('body #1a_form_container .panel-footer');
                $targetelement.attr('style', 'border-color:'+newValue);

                $targetelement = $(element).contents().find('body #1a_form_container .form-control');
                $targetelement.attr('style', 'border-color:'+newValue);
               
                
           });

           // change button color:
           scope.$watch('changeAttr.adButtonColor', function (newValue, oldValue) {
                $targetelement = $(element).contents().find('body #1a_form_container button');
                var buttonCss =  'url("'+button_url+'") repeat-x scroll 0 -70px '+ scope.changeAttr.adButtonbgColor +' !important';
                $targetelement.attr('style', 'background:'+buttonCss+';color:'+newValue);
           });

           // change button background color:
           scope.$watch('changeAttr.adButtonbgColor', function (newValue, oldValue) {
                $targetelement = $(element).contents().find('body #1a_form_container button');
                var buttonCss =  'url("'+button_url+'") repeat-x scroll 0 -70px '+ newValue +' !important';
                $targetelement.attr('style', 'background:'+buttonCss);
           });

           // change button schema:
           scope.$watch('changeAttr.selectedSchemaType', function (newValue, oldValue) {
                
                var buttonTypeOffset;
                var buttonTypeOffsetSL;

                if(newValue == 'glossy'){
                    buttonTypeOffset = '0px -49px';
                    buttonTypeOffsetSL = '0px -35px !important;';

                    var buttonCompleteCss = "background : 'url('"+button_url+" ')' "+buttonTypeOffset+" repeat-x !important ; background-color: "+scope.changeAttr.adButtonbgColor +" !important; color: "+scope.changeAttr.adButtonColor+" !important; background-position: "+buttonTypeOffsetSL;

                    $targetelement = $(element).contents().find('body #1a_form_container button');
                    $targetelement.attr('style', buttonCompleteCss);
                }
                else if(newValue == 'gradient'){
                    buttonTypeOffset = '0px 9px';
                    buttonTypeOffsetSL = '0px 34px !important;';

                    var buttonCompleteCss = "background : 'url('"+button_url+" ')' "+buttonTypeOffset+" repeat-x !important ; background-color: "+scope.changeAttr.adButtonbgColor +" !important; color: "+scope.changeAttr.adButtonColor+" !important; background-position: "+buttonTypeOffsetSL;

                    $targetelement = $(element).contents().find('body #1a_form_container button');
                    $targetelement.attr('style', buttonCompleteCss);

                }
                else if(newValue == 'flat'){
                    buttonTypeOffset = '0px -70px';

                    var buttonCompleteCss = "background : 'url('"+button_url+" ')' "+buttonTypeOffset+" repeat-x !important ; background-color: "+scope.changeAttr.adButtonbgColor +" !important; color: "+scope.changeAttr.adButtonColor+" !important;";

                    $targetelement = $(element).contents().find('body #1a_form_container button');
                    $targetelement.attr('style', buttonCompleteCss);
                }
                else{
                    buttonTypeOffset = '0px -70px';

                    var buttonCompleteCss = "background : 'url('"+button_url+" ')' "+buttonTypeOffset+" repeat-x !important ; background-color: "+scope.changeAttr.adButtonbgColor +" !important; color: "+scope.changeAttr.adButtonColor+" !important;";

                    $targetelement = $(element).contents().find('body #1a_form_container button');
                    $targetelement.attr('style', buttonCompleteCss);
                } 
          });
        }
    };
}])


/**
 *  Directive to render design tool for other types of Ads apart from "forms"
 */

.directive('adcustomTool', ['$rootScope', '$timeout', '$sce', '$modal', 'FileUploader','UtilityModel', '$q', 'Upload', 'pecunioFonts', 'CustomAd', 'adImagePath',
                           function($rootScope, $timeout, $sce, $modal, FileUploader, UtilityModel, $q, Upload, pecunioFonts, CustomAd, adImagePath) {
    return {
      restrict: 'E',
      scope: {
        customAttr: '=ngModel'
      },
      templateUrl: 'views/common/adcustom-tool.html',

         link : function (scope){

            scope.customAttr.showBlockdd  = false;
            scope.customAttr.showCommonColor  = false;
            
            scope.customAttr.dynamicElement.selectedBlockCount = 1;
            scope.customAttr.dynamicElement.adBorderColor = '';
            scope.customAttr.dynamicElement.selectedBorderSize;
            scope.customAttr.dynamicElement.countImages = [];

            function create2DArray(arrayName){
              for (i=0; i <50; i++){
                  arrayName[i]=new Array();
              }
            }



            scope.customAttr.dynamicElement.ad_img  = new Array([]);
            create2DArray(scope.customAttr.dynamicElement.ad_img);

            

            var type = sessionStorage.getItem('type');
            var ftypeStr = JSON.parse(type);

            var selectedAdDetails = sessionStorage.getItem('selectedAdDetails');
            var tmpSelectedAdDetailsArr = JSON.parse(selectedAdDetails);


            // Start show blockdd for text Ads only 
            if(tmpSelectedAdDetailsArr.categoryId ==  7 ){ 
              scope.customAttr.showBlockdd  = true;
            }
            // End show blockdd for text Ads only 

            if(ftypeStr == 'update'){

              var idArr = [];

              idArr.push(tmpSelectedAdDetailsArr.adDetails.id);
              var filterData = {"filterData": { "Ids" :  idArr }};
              CustomAd.getUserAdList(filterData).$promise.then(function(finalresponse){
                var selectedAdDetailsArr = finalresponse.response[0];
                scope.customAttr.dynamicElement.ad_name = selectedAdDetailsArr.adDetails.name; 
              });
              
            }

         
           // Start of file upload
           function initUploadAdImage(arg){ 

                if(arg != ""){
                    // create a uploader with options
                    var countArr = arg.split('###');
                    var testval = 'uploader';
                    var count = countArr[0];
                    var key = countArr[1];

                    var uploader = scope.customAttr.dynamicElement.uploader[count][key] = new FileUploader({
                      scope: scope,                          
                      url: '/api/container/adimages/upload',
                      formData: [
                        { key: 'value' }
                      ]
                    });
        

                    // FILTERS

                    uploader.filters.push({
                        name: 'imageFilter',
                        fn: function(item /*{File|FileLikeObject}*/, options) {
                            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                        }
                    });

                    uploader.filters.push({
                        name: 'queueLimit',
                        fn: function(item /*{File|FileLikeObject}*/, options) {
                            return this.queue.length < 2;
                        }
                    });



                    // CALLBACKS

                    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
                    };
                    uploader.onAfterAddingFile = function(fileItem) {
                        // renaming file to unique filename
                        var fileExtension = '.' + fileItem.file.name.split('.').pop();
                        fileItem.file.name = Math.random().toString(36).substring(7) + new Date().getTime() + fileExtension;
                    };
                    uploader.onAfterAddingAll = function(addedFileItems) {
                    };
                    uploader.onBeforeUploadItem = function(item) {
                    };
                    uploader.onProgressItem = function(fileItem, progress) {
                    };
                    uploader.onProgressAll = function(progress) {
                    };
                    uploader.onSuccessItem = function(fileItem, response, status, headers) {
                    };
                    uploader.onErrorItem = function(fileItem, response, status, headers) {
                    };
                    uploader.onCancelItem = function(fileItem, response, status, headers) {
                    };
                    uploader.onCompleteItem = function(fileItem, response, status, headers) {
                       scope.customAttr.dynamicElement.ad_img[count][key] = adImagePath+fileItem.file.name;
                    };
                    uploader.onCompleteAll = function() {
                    };
                }
           };


            scope.$watchCollection('customAttr.dynamicElement.countImages', function (newValue, oldValue) { 
             
                if(newValue.length > 0){
                    newValue.forEach(function(value){
                      initUploadAdImage(value);
                    });
                } 
            });
        }
    };
}])


/**
 *  Directive to render preview window i.e. Iframe for the other types of Ad apart from "forms"
 */

.directive('parseElement', ['$rootScope','$timeout', '$q', '$state', 'pecunioFonts','FileUploader',
                           function($rootScope, $timeout, $q, $state, pecunioFonts,FileUploader) {
    return {
        restrict: 'A',
        scope: {
          customAttr: '=ngModel'
        },
        require: 'ngModel',
        link : function (scope, element, attrs, controller){

        

          scope.customAttr.parsedElements = [];
          scope.customAttr.renderedElementsModel = []; 
          scope.customAttr.replica = [];          
          scope.customAttr.toolbarView = '<h4>BLOCK 1</h4>';

          scope.customAttr.toolbarViewArr = [];
          scope.customAttr.contentArr;
          scope.customAttr.adHelpTextArr;
          scope.customAttr.dynamicElement = {};
          scope.customAttr.adProperties = {};
          scope.customAttr.adProperties.labelVal = {};
          scope.customAttr.adProperties.contentType = {};

          function create2DArray(arrayName){
            for (i=0; i <50; i++){
                arrayName[i]=new Array();
            }
          }


          scope.customAttr.dynamicElement.uploader  = new Array([]);
          create2DArray(scope.customAttr.dynamicElement.uploader);


          scope.customAttr.dynamicElement.ad_heading  = new Array([]);
          create2DArray(scope.customAttr.dynamicElement.ad_heading);

          scope.customAttr.dynamicElement.ad_display_url  = new Array([]);
          create2DArray(scope.customAttr.dynamicElement.ad_display_url);

          scope.customAttr.dynamicElement.ad_line1  = new Array([]);
          create2DArray(scope.customAttr.dynamicElement.ad_line1);

          scope.customAttr.dynamicElement.ad_line2  = new Array([]);
          create2DArray(scope.customAttr.dynamicElement.ad_line2);

          scope.customAttr.dynamicElement.color_heading  = new Array([]);
          create2DArray(scope.customAttr.dynamicElement.color_heading);

          scope.customAttr.dynamicElement.color_display_url  = new Array([]);
          create2DArray(scope.customAttr.dynamicElement.color_display_url);

          scope.customAttr.dynamicElement.color_line1  = new Array([]);
          create2DArray(scope.customAttr.dynamicElement.color_line1);

          scope.customAttr.dynamicElement.color_line2  = new Array([]);
          create2DArray(scope.customAttr.dynamicElement.color_line2);

          scope.customAttr.dynamicElement.color_img  = new Array([]);
          create2DArray(scope.customAttr.dynamicElement.color_img);

          scope.customAttr.dynamicElement.ad_block  = new Array([]);
          create2DArray(scope.customAttr.dynamicElement.ad_block);

          scope.customAttr.dynamicElement.ad_modifiable_text  = new Array([]);
          create2DArray(scope.customAttr.dynamicElement.ad_modifiable_text);

          scope.customAttr.dynamicElement.color_modifiable_text  = new Array([]);
          create2DArray(scope.customAttr.dynamicElement.color_modifiable_text);

          scope.customAttr.dynamicElement.modifiable_fontI  = new Array([]);
          create2DArray(scope.customAttr.dynamicElement.modifiable_fontI);

          scope.customAttr.dynamicElement.modifiable_fontII  = new Array([]);
          create2DArray(scope.customAttr.dynamicElement.modifiable_fontII);

          scope.customAttr.dynamicElement.selectedBlockCount = 1;
          scope.customAttr.dynamicElement.adCommonColor = null;

          
          scope.totalOccurenceArr  = {};

          scope.customAttr.adlabelVal = {   "ad_heading" : "Headline",
                                            "ad_display_url" : "Display Url",         
                                            "ad_line1" : "Description Line",
                                            "ad_line2" : "Description Line",
                                            "ad_img" : "Image",
                                            "ad_block" : "",
                                            "ad_modifiable_text": "Text "
                                          };


          scope.customAttr.adcontentType = { "ad_heading" : "text",
                                              "ad_display_url" : "text",         
                                              "ad_line1" : "text",
                                              "ad_line2" : "text",
                                              "ad_img" : "Image",
                                              "ad_block" : "modal",
                                              "ad_modifiable_text": "text"
                                             };

          scope.customAttr.nonColorAtrributes = ["ad_block"]; 
          scope.customAttr.nonContentAtrributes = ["ad_block"]; 

          scope.customAttr.adCommonAttributes = ["data-modifiable-fontI", "data-modifiable-fontII", "data-common-color"];                                 
                                          
          scope.adHtmlContent = ''; 
          scope.customAttr.isExistsCommonFontI = false;
          scope.customAttr.isExistsCommonFontII = false;
          scope.customAttr.fontdd = pecunioFonts;         
          scope.customAttr.dynamicElement.adCommonFontI = '';
          scope.customAttr.dynamicElement.adCommonFontII = '';

          scope.customAttr.isPreviewChanged = 0;    

                               
          scope.customAttr.jsonAdContent;



          // parse complete ad Html
          function mapDOM(element, json) {
            var treeObject = {};
            
            // If string convert to document Node
            if (typeof element === "string") {
                if (window.DOMParser)
                {
                      parser = new DOMParser();
                      docNode = parser.parseFromString(element,"text/xml");
                }
                else // Microsoft strikes again
                {
                      docNode = new ActiveXObject("Microsoft.XMLDOM");
                      docNode.async = false;
                      docNode.loadXML(element); 
                } 
                element = docNode.firstChild;
            }
            
            //Recursively loop through DOM elements and assign properties to object
            function treeHTML(element, object) {
                object["type"] = element.nodeName;
                var nodeList = element.childNodes;
                if (nodeList != null) {
                    if (nodeList.length) {
                        object["content"] = [];
                        for (var i = 0; i < nodeList.length; i++) {
                            if (nodeList[i].nodeType == 3) {
                                object["content"].push(nodeList[i].nodeValue);
                            } else {
                                object["content"].push({});
                                treeHTML(nodeList[i], object["content"][object["content"].length -1]);
                            }
                        }
                    }
                }
                if (element.attributes != null) {
                    if (element.attributes.length) {
                        object["attributes"] = {};
                        for (var i = 0; i < element.attributes.length; i++) {
                            object["attributes"][element.attributes[i].nodeName] = element.attributes[i].nodeValue;
                        }
                    }
                }
            }
            treeHTML(element, treeObject);
            return (json) ? JSON.stringify(treeObject) : treeObject;
          }


          //rgb to hex color
          function rgb2hex(rgb){
            rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
            return (rgb && rgb.length === 4) ? "#" +
             ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
             ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
             ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
          }
          //rgb to hex color   


          // resize iframe
          function resizeIframe(){
            var iframeHeight = parseInt($(element).contents().find("html").height())//+200;
            var iframeWidth = parseInt($(element).contents().find("html").width())//+200;
            $(element).height(iframeHeight);
            $(element).width(iframeWidth);
          }
          //resize iframe

          function getPosition(arr, val, occ) {
              var indexes = [], i;
              for(i = 0; i < arr.length; i++)
                  if (arr[i] === val)
                      indexes.push(i);
              return indexes[occ-1];
          }

          /**
            * Get all the html elements from the preview window with the contents and no. of occurence
            */
          function getParsedElements(){
            selectedAdDetails = sessionStorage.getItem('selectedAdDetails');
            var selectedAdDetailsArr = JSON.parse(selectedAdDetails);
            var datalist = {};

            return $q(function(resolve, reject) {
                    setTimeout(function() { 
                      //if(selectedAdDetailsArr.categoryId){
                        // get all dynamic elements with attr ad-class
                          var classArray = [];
                          var adClassArr = [];
                          var adClassContentArr = {};
                          var adHelpTextArr = {};
                          var background_color = '#FFFFFF';
                          var commonColorArr = [];
                          var commonFontTypeIArr = [];
                          var commonFontTypeIIArr = [];

                          var type = sessionStorage.getItem('type');
                          var ftypeStr = JSON.parse(type);

                          if(ftypeStr == 'update'){
                            var targetElement = $(element).contents().find('body .pecunio-ad-container *').not('[data-block-type="added_blocks"] *').not('[data-block-type="added_blocks"]');
                          }
                          else{
                            var targetElement = $(element).contents().find('body .pecunio-ad-container *');
                          }
                          
                          // saving original content before customization
                          scope.adHtmlContent = $(element).contents().find('body .pecunio-ad-container [data-count-block ="ad_block_0"]').html(); 
                          var counter = 0;
                          $(targetElement).each(function(){  
                              var attr = $(this).attr('data-pecunio-ad-class'); 
                              
                              if(this.className!=""){
                                  classArray.push(this.className);
                              }
                              
                              if (typeof attr !== typeof undefined && attr !== false ) {
                                  var pecunioAdClassString = $(this).attr('data-pecunio-ad-class');
                                  var pecunioAdClass = pecunioAdClassString.split(' ');
                                  var elementContent = ($(this).text()).trim();
                                  
                                  pecunioAdClass.forEach(function(adClass){
                                    adClassArr.push(adClass.trim());
                                    adClassContentArr[adClass.trim()+'_'+counter]= elementContent; 
                                    counter++;
                                  });
                              }

                              // parse maxlength restrictions
                              var maxlength = $(this).attr('data-pecunio-max-length'); 
                              if (typeof maxlength !== typeof undefined && maxlength !== false) { // show help text 
                                var adProperty  = $(this).attr('data-pecunio-ad-class');
                                var components  = adProperty.split(/_(.+)?/)[1];
                                adHelpTextArr['ad_'+components]= 'Max character allowed '+maxlength;
                              }

                              // parse common color elements
                              var commonColor = $(this).attr('data-common-color');
                              if (typeof commonColor !== typeof undefined && commonColor !== false) { // get all common colored elements
                                commonColorArr.push($(this).attr('data-pecunio-ad-class'));
                              }

                              //parse common font elements : Font type I
                              var commonFont = $(this).attr('data-modifiable-fontI');
                              if (typeof commonFont !== typeof undefined && commonFont !== false) { // get all common Font type I elements
                                commonFontTypeIArr.push($(this).attr('data-modifiable-fontI'));
                              }

                              //parse common font elements : Font type II
                              var commonFont = $(this).attr('data-modifiable-fontII');
                              if (typeof commonFont !== typeof undefined && commonFont !== false) { // get all common Font type II elements
                                commonFontTypeIIArr.push($(this).attr('data-modifiable-fontII'));
                              }
                          });
                          
                          
                          // Finding total occurence of an element 
                          var uniqueAdClassArr = _.uniq(adClassArr);
                          var totalOccurenceArr = {};
                          
                          for( var i =0; i < uniqueAdClassArr.length ; i++){
                            var count = adClassArr.reduce(function(n, val) {
                                return n + (val === uniqueAdClassArr[i]);
                            }, 0);
                            totalOccurenceArr[uniqueAdClassArr[i]] = count;
                          } 


                          var background_color  = $(element).contents().find('body').css("background-color");
                          var common_color  = $(element).contents().find('body .pecunio-ad-container [data-common-color]').css("color"); 

                          var border_color  = $(element).contents().find('body').css("border-top-color"); 
                          var border_size   = $(element).contents().find('body').css("border-left-width");
                          var font1         = $(element).contents().find('body .pecunio-ad-container [data-modifiable-fonti]').css('font-family');
                          var font2         = $(element).contents().find('body .pecunio-ad-container [data-modifiable-fontii]').css('font-family');
                          
                          
                          if($(element).contents().find('body .pecunio-ad-container [data-common-color]').length > 0){
                             scope.customAttr.showCommonColor = true;
                          }


                          var selectedBlockCount = $(element).contents().find('body .pecunio-ad-container [data-count-block]').length;

                          datalist['contentArr'] = adClassContentArr;
                          datalist['adHelpTextArr'] = adHelpTextArr;
                          datalist['commonColorElements'] = commonColorArr; 
                          datalist['adClassArr'] = adClassArr;
                          datalist['totalOccurenceArr'] = totalOccurenceArr;
                          datalist['background_color'] = background_color;
                          datalist['common_color'] = common_color;
                          datalist['border_color'] = border_color;
                          datalist['border_size']  = border_size;
                          datalist['selectedBlockCount']  = selectedBlockCount;
                          
                          datalist['font1']  = font1;
                          datalist['font2']  = font2;
                          datalist['commonFontTypeIArr'] = commonFontTypeIArr;
                          datalist['commonFontTypeIIArr'] = commonFontTypeIIArr;
                          //}   
                          resolve(datalist);  
                     }, 1000);
            });            
          }

          
                                            
          $('#editor').on("load", function() {
              resizeIframe();
              getParsedElements().then(function(data) {
                 
                 scope.customAttr.contentArr = data.contentArr;
                 scope.customAttr.adHelpTextArr = data.adHelpTextArr;
                 scope.customAttr.commonColorElements = data.commonColorElements;
                 scope.customAttr.parsedElements = data.adClassArr;
                 scope.totalOccurenceArr =  data.totalOccurenceArr;
                 scope.customAttr.dynamicElement.adBgColor     = (typeof data.background_color == typeof undefined )? data.background_color : rgb2hex(data.background_color);
                 scope.customAttr.dynamicElement.adCommonColor = (typeof data.commonColor == typeof undefined )? data.common_color: rgb2hex(data.common_color);

                
                 scope.customAttr.isExistsCommonFontI = (data.commonFontTypeIArr.length > 0) ? true : false ;
                 scope.customAttr.isExistsCommonFontII = (data.commonFontTypeIIArr.length > 0) ? true : false ;
                 scope.customAttr.dynamicElement.adBorderColor = (typeof data.border_color == typeof undefined )? data.border_color: rgb2hex(data.border_color);
                 scope.customAttr.dynamicElement.selectedBorderSize = (data.border_size != "" )? data.border_size : '';
                 var type = sessionStorage.getItem('type');
                 var ftypeStr = JSON.parse(type);

                 if(ftypeStr == 'update'){
                   scope.customAttr.dynamicElement.adCommonFontI = data.font1;
                   scope.customAttr.dynamicElement.adCommonFontII = data.font2;
                 }
                 scope.customAttr.dynamicElement.selectedBlockCount = data.selectedBlockCount;
              });
          });

         
          

          // Begin prepare the tool-bar
          scope.$watchCollection('customAttr.parsedElements', function (newValue, oldValue, scope){ //alert(1) 
           
             var tmpArr = [];
             var tmpModelName = [];
             //var tmpColorModelName = [];
             tmpArr = newValue;

             /*
             * Forming the toolbar for the first block only on page load, 
             * i.e considering one only one block is active.
             *
             */
              if(tmpArr.length > 0){
                 
                  //for(var key in tmpArr){
                  var key = 0; 
                  tmpArr.forEach(function(value){
                      var indexval = value; 

                      //{ //if(indexval != 'ad_block'){
                        var count = 0;
                        var components  = indexval.split(/_(.+)?/)[1]; 
                        var colorElementVal = 'color_'+components; 

                       
                        
                        if(!(_.contains(scope.customAttr.nonColorAtrributes, indexval))){ 
                          scope.customAttr.dynamicElement[colorElementVal][count][key] = null;
                        }

                       
                        //update ng-model of toolbar with fetched values
                        if(!(_.contains(scope.customAttr.nonContentAtrributes, indexval))){
                          scope.customAttr.dynamicElement[indexval][count][key] = scope.customAttr.contentArr[indexval+'_'+key];
                        }
                        var tmpNgModel = indexval+'['+count+']';
                        tmpModelName.push(tmpNgModel);

                        if(indexval != 'ad_block'){
                          // Form view per Element wuth  scope.customAttr.adProperties.content_type and  scope.customAttr.adProperties.label.
                          // check type of element

                          var labelname = scope.customAttr.adlabelVal[indexval]; 
                          var contentType = scope.customAttr.adcontentType[indexval]; 
                          var helpText = '';
                          var tempcontent = '';

                            if(contentType == 'text'){
                              // check if restricted help text exist or not 
                              if(typeof scope.customAttr.adHelpTextArr[indexval] != typeof undefined && scope.customAttr.adHelpTextArr[indexval] != ''){ 
                                var components  = indexval.split(/_(.+)?/)[1]; 
                                var helpText = '<span class="help-block" id="help_'+components+'">'+scope.customAttr.adHelpTextArr[indexval]+'</span>';
                              } 
                              var tempcontent  = '<div class="form-group"><label>'+labelname+'</label><div class="input-group"><input type="text" ng-model="customAttr.dynamicElement.'+indexval+'['+count+']['+key+']" placeholder="'+labelname+'" class="form-control input-small input-sm " /><ui-colorpicker ng-model="customAttr.dynamicElement.'+colorElementVal+'['+count+']['+key+']" class="input-group-btn"></ui-colorpicker></div>'+helpText+'</div>';
                            }
                            else if(contentType == 'Image'){
                             
                              // check if restricted help text exist or not 
                              if(typeof scope.customAttr.adHelpTextArr[indexval] != typeof undefined && scope.customAttr.adHelpTextArr[indexval] != ''){ 
                                var components  = indexval.split(/_(.+)?/)[1]; 
                                var helpText = '<span class="help-block" id="help_'+components+'">'+scope.customAttr.adHelpTextArr[indexval]+'</span>';
                              } 
                              
                              var tempcontent = '<div class="form-group" nv-file-drop="" uploader="customAttr.dynamicElement.uploader'+'['+count+']['+key+']'+'" filters="imageFilter, queueLimit" ><label>Select <fieldset></fieldset></label><span ><input type="file" uploader="customAttr.dynamicElement.uploader'+'['+count+']['+key+']'+'" nv-file-select=""  ></span><span ng-repeat="item in customAttr.dynamicElement.uploader'+'['+count+']['+key+']'+'.queue"><span ng-show="customAttr.dynamicElement.uploader'+'['+count+']['+key+']'+'.isHTML5" ng-thumb="{ file: item._file, height: 50, width: 50  }" style="float:left;"></span><span class="pull-right"><button type="button" class="btn btn-success btn-xs"  ng-click="item.upload()" ng-disabled="item.isReady || item.isUploading || item.isSuccess"><span class="glyphicon glyphicon-upload"></span></button><button type="button" class="btn btn-danger btn-xs" ng-click="item.remove()"> <span class="glyphicon glyphicon-trash" ></span> </button></span></span><input type="hidden" ng-model="customAttr.dynamicElement.ad_img'+'['+count+']['+key+']'+'" /></div>';
                              scope.customAttr.dynamicElement.countImages.push(count+'###'+key);
                            }


                          //prepare content to render
                          scope.customAttr.toolbarView  += tempcontent;
                        }
                      //}
                      key++;
                  });
                  scope.customAttr.toolbarViewArr.push(scope.customAttr.toolbarView);
                  scope.customAttr.isPreviewChanged = scope.customAttr.isPreviewChanged +1;
              }


              // show no. of blocks reflect in preview window and save the a replica of all elements for add more block feature
              for (var i = 0; i < tmpModelName.length; i++) {
                  
                  scope.customAttr.replica.push(tmpModelName[i]);
                  scope.customAttr.renderedElementsModel.push(tmpModelName[i]); 
              } 
              
          }); 
          // End prepare the tool-bar 
         

          // Start track changes in tool bar and reflect in preview window 

          scope.$watchCollection('customAttr.renderedElementsModel', function (newValue, oldValue) { 
            
              var tmpArr = scope.customAttr.renderedElementsModel; 

              var totalBlocks = scope.customAttr.dynamicElement.selectedBlockCount; 

              var ngModelsArr = [];
              var blocksArr = [];


              for( i = 0; i < totalBlocks; i++){  
                blocksArr.push(i);
              }
              

              for( i = 0; i < totalBlocks; i++){  
                for( j = 0; j < scope.customAttr.parsedElements.length; j++){  
                  ngModelsArr.push('['+i+']['+j+']');
                }
              }
              


              var counter = 0;
              var usedTmpArr = [];
              tmpArr.forEach(function(ele){
               
                var attrName  = ele.split('[')[0];  
                var components  = attrName.split(/_(.+)?/)[1];
                var colorElement  =  'color_'+components;
                
                // find no. of occurence accordingly find element in preview window
                var totalOccurence = scope.totalOccurenceArr[attrName]; 
                var occurenceArr = [];
                for( i = 0; i < totalOccurence; i++){  
                  occurenceArr.push(i);
                }
                
                // check if attrname in usedTmpArr with 00
                blocksArr.forEach(function(i){
                    if(!(_.contains(usedTmpArr, attrName+'_'+i))){ 
                      // track changes in each element in tool bar and reflect in preview window
                      var addedTargetBlock = $(element).contents().find('body .pecunio-ad-container [data-count-block = "ad_block_'+i+'"]');
                      

                      if(totalOccurence > 1){
                        usedTmpArr.push(attrName+'_'+i);
                        occurenceArr.forEach(function(k){
                            
                            if(attrName != "ad_block"){
                              var addedTargetElement = $(addedTargetBlock).find('[data-pecunio-ad-class ~= "'+attrName+'"]:eq('+k+')');
                              var elementPosition = getPosition(scope.customAttr.parsedElements, attrName, (k+1)); 

                               // track changes in each element in tool bar and reflect in preview window
                              var loopEle = attrName+'['+i+']['+elementPosition+']';
                              var jsonStr = '';

                                
                                scope.$watch('customAttr.dynamicElement.'+loopEle, function (newValue, oldValue) { 
                                    if(typeof newValue !== typeof undefined){

                                      if(attrName == 'ad_img' && newValue != ""){
                                        $(addedTargetElement).attr('src',newValue);
                                        resizeIframe();
                                        scope.customAttr.isPreviewChanged = scope.customAttr.isPreviewChanged +1;
                                      }
                                      else{
                                        var maxlength = $(addedTargetElement).attr('data-pecunio-max-length');
                                        if (typeof maxlength !== typeof undefined && maxlength !== false) {
                                            
                                          if(newValue.length > maxlength){
                                            $(addedTargetElement).html(newValue.substring(0, maxlength)); 
                                            scope.customAttr.dynamicElement[attrName][i][elementPosition] = newValue.substring(0, maxlength);
                                          }
                                          else
                                            $(addedTargetElement).html(newValue);
                                        } 
                                        else{ 
                                          $(addedTargetElement).html(newValue);
                                        }
                                        resizeIframe();
                                        scope.customAttr.isPreviewChanged = scope.customAttr.isPreviewChanged +1;
                                      }
                                    }
                                }); 
                                
                                var loopColorEle = colorElement+'['+i+']['+elementPosition+']';

                                /*
                                * Reflect text-color change on toolbar
                                */
                                scope.customAttr.dynamicElement[colorElement][i][elementPosition] = (typeof $(addedTargetElement).css('color') == typeof undefined )? $(addedTargetElement).css('color'): rgb2hex($(addedTargetElement).css('color'));
                                 
 
                                // track changes in color of each element in tool bar and reflect in preview window
                                scope.$watch('customAttr.dynamicElement.'+loopColorEle, function (newValue, oldValue) {  
                                    if(attrName != 'ad_block' && newValue!= oldValue && newValue != null ){ // restrict any behaviour change if its a block identifier
                                     $(addedTargetElement).attr('style','color:'+newValue+';');
                                    }
                                    scope.customAttr.isPreviewChanged = scope.customAttr.isPreviewChanged +1;
                                });
                                  
                                // End update adJsonContent

                            }
                            //counter++;
                        });

                      }
                      else{
                        var addedTargetElement = $(addedTargetBlock).find('[data-pecunio-ad-class ~= "'+attrName+'"]'); 
                        var elementPosition = scope.customAttr.parsedElements.indexOf(attrName);
                        
                        // track changes in each element in tool bar and reflect in preview window
                        var loopEle = attrName+'['+i+']['+elementPosition+']';
                        if(attrName != "ad_block"){
                        
                            scope.$watch('customAttr.dynamicElement.'+loopEle, function (newValue, oldValue) { 
                              if(typeof newValue !== typeof undefined){
                                
                                if(attrName == 'ad_img' && newValue != ""){
                                  $(addedTargetElement).attr('src',newValue);
                                  resizeIframe();
                                  scope.customAttr.isPreviewChanged = scope.customAttr.isPreviewChanged +1;
                                }
                                else{
                                  var maxlength = $(addedTargetElement).attr('data-pecunio-max-length');
                                  if (typeof maxlength !== typeof undefined && maxlength !== false) {
                                      
                                    if(newValue.length > maxlength){
                                        $(addedTargetElement).html(newValue.substring(0, maxlength)); 
                                        scope.customAttr.dynamicElement[attrName][i][elementPosition] = newValue.substring(0, maxlength);
                                      }
                                      else
                                        $(addedTargetElement).html(newValue);
                                    } 
                                    else{ 
                                      $(addedTargetElement).html(newValue);
                                    }
                                    resizeIframe();
                                    scope.customAttr.isPreviewChanged = scope.customAttr.isPreviewChanged +1;
                                  }
                                }
                            }); 
                            
                            var loopColorEle = colorElement+'['+i+']['+elementPosition+']'; 
                            /*
                            * Reflect text-color change on toolbar
                            */
                            scope.customAttr.dynamicElement[colorElement][i][elementPosition] = (typeof $(addedTargetElement).css('color') == typeof undefined )? $(addedTargetElement).css('color'): rgb2hex($(addedTargetElement).css('color'));
                                 
                            // track changes in color of each element in tool bar and reflect in preview window
                            scope.$watch('customAttr.dynamicElement.'+loopColorEle, function (newValue, oldValue) {  
                                if(attrName != 'ad_block' && newValue!= oldValue && newValue != null ){ // restrict any behaviour change if its a block identifier
                                 $(addedTargetElement).attr('style','color:'+newValue+';');
                                }
                                scope.customAttr.isPreviewChanged = scope.customAttr.isPreviewChanged +1;
                            });
                        } 
                      }
                    }
                });
                
              });
          });
          // End track changes in tool bar and reflect in preview window
          
          // Background color change event
          scope.$watch('customAttr.dynamicElement.adBgColor', function (newValue, oldValue) { 
                 if(typeof newValue != typeof undefined && newValue != ''){
                  $(element).contents().find('body').attr('style','background-color:'+newValue+';border: '+scope.customAttr.dynamicElement.selectedBorderSize+' solid '+scope.customAttr.dynamicElement.adBorderColor+';');
                 }
                 scope.customAttr.isPreviewChanged = scope.customAttr.isPreviewChanged +1;
          });

          // common color change event
          scope.$watch('customAttr.dynamicElement.adCommonColor', function (newValue, oldValue) { 
            
            targetElements = $(element).contents().find('body .pecunio-ad-container *');
            $(targetElements).each(function(){  
                var commonColor = $(this).attr('data-common-color');
                if (typeof commonColor !== typeof undefined && commonColor !== false  && newValue != oldValue && newValue != null) { 
                  $(this).css('color',newValue);
                }
            });
            scope.customAttr.isPreviewChanged = scope.customAttr.isPreviewChanged +1;
          });

          // common primary font change
          scope.$watch('customAttr.dynamicElement.adCommonFontI', function (newValue, oldValue) { 
            
            targetElements = $(element).contents().find('body .pecunio-ad-container *');
            $(targetElements).each(function(){  
                var commonFont = $(this).attr('data-modifiable-fontI');
                if (typeof commonFont !== typeof undefined && commonFont !== false  && newValue != oldValue && newValue != null) { 
                  $(this).css('font-family',newValue);
                }
            });
            scope.customAttr.isPreviewChanged = scope.customAttr.isPreviewChanged +1;
          });

          // common secondary font change
          scope.$watch('customAttr.dynamicElement.adCommonFontII', function (newValue, oldValue) { 
            
            targetElements = $(element).contents().find('body .pecunio-ad-container *');
            $(targetElements).each(function(){  
                var commonFont = $(this).attr('data-modifiable-fontII');
                if (typeof commonFont !== typeof undefined && commonFont !== false  && newValue != oldValue && newValue != null) { 
                  $(this).css('font-family',newValue);
                }
            });
            scope.customAttr.isPreviewChanged = scope.customAttr.isPreviewChanged +1;
          });

          // border-size
          scope.$watch('customAttr.dynamicElement.selectedBorderSize', function (newValue, oldValue) { 
                 if(typeof newValue != typeof undefined && newValue != ''){
                  $(element).contents().find('body').attr('style','background-color:'+scope.customAttr.dynamicElement.adBgColor+';border: '+newValue+' solid '+scope.customAttr.dynamicElement.adBorderColor+';');
                 }
                 else if(newValue == ''){
                  $(element).contents().find('body').attr('style','background-color:'+scope.customAttr.dynamicElement.adBgColor+';');
                 }
                  resizeIframe();
                  scope.customAttr.isPreviewChanged = scope.customAttr.isPreviewChanged +1;
          }); 

          // border-color
          scope.$watch('customAttr.dynamicElement.adBorderColor', function (newValue, oldValue) { 
                 if(typeof newValue != typeof undefined && newValue != ''){
                  $(element).contents().find('body').attr('style', 'background-color:'+scope.customAttr.dynamicElement.adBgColor+';border: '+scope.customAttr.dynamicElement.selectedBorderSize+' solid '+newValue+';');
                 }
                 scope.customAttr.isPreviewChanged = scope.customAttr.isPreviewChanged +1;
          });

          
          // add blocks
          function addMoreBlocks(count){ 
            
              var blockTargetElement = $(element).contents().find('body .pecunio-ad-container');
              var total_blocks = $(element).contents().find('body .pecunio-ad-container [data-block-type = "added_blocks"]').size() + 1; 

              var type = sessionStorage.getItem('type');
              var ftypeStr = JSON.parse(type);

              if(ftypeStr == 'update' && scope.customAttr.dynamicElement.selectedBlockCount == total_blocks){
                // do nothing
              }
              else{
                for(i = 1; i <= count; i++){
                  var  tmpContent = '<div data-block-type="added_blocks" data-count-block="ad_block_'+(parseInt(total_blocks))+'">'+scope.adHtmlContent;+'</div>';
                  $(blockTargetElement).append(tmpContent);
                  total_blocks++;
                }
              }
              resizeIframe();
          }
          // add blocks

          // remove blocks
          function removeBlocks(count){ 
            
              var blockTargetElement = $(element).contents().find('body .pecunio-ad-container');
              var total_blocks = $(element).contents().find('body .pecunio-ad-container [data-block-type = "added_blocks"]').size(); 
              var noblocks = total_blocks+1;

              for(i = 0; i <= count; i++){
                $(blockTargetElement).find('[data-count-block="ad_block_'+(parseInt(noblocks))+'"]').remove();
                noblocks--;
              }
              resizeIframe();
          }
          // remove blocks

          //add more and remove blocks
          scope.$watch('customAttr.dynamicElement.selectedBlockCount', function (newValue, oldValue) { 

              // Start re-form the elements
              var tmpArr = [];
              var tmpModelName = [];
              tmpArr =  scope.customAttr.replica; //scope.customAttr.renderedElementsModel;
              

              if(tmpArr.length > 0 && (newValue > 1 || (newValue ==1 && oldValue == 2))){ // if block value is increased 
                var totalBlocks = 0;
                var startBlockNo = 0;

                if(newValue > oldValue){ // add more
                  totalBlocks = newValue - oldValue;
                  startBlockNo = oldValue;
                  
                  for(i = 1 ; i <= totalBlocks ; i++){

                      var tmpHtml  = '';
                      tmpHtml  = '<br/><h4>BLOCK '+(parseInt(startBlockNo)+1)+'</h4>';
                      for(var key in tmpArr){   

                          var indexval = tmpArr[key]; 
                          var count = (startBlockNo ==  1) ? 1 : startBlockNo;

                          var attrName    = indexval.split('[')[0];
                          var components  = attrName.split(/_(.+)?/)[1]; 
                          var colorElementVal = 'color_'+components; 

                          if(!(_.contains(scope.customAttr.nonColorAtrributes, attrName))){  
                            scope.customAttr.dynamicElement[colorElementVal][count][key] = null;
                          }

                          if(!(_.contains(scope.customAttr.nonContentAtrributes, attrName))){
                            scope.customAttr.dynamicElement[attrName][count][key] = scope.customAttr.contentArr[attrName+'_'+key];
                          }
                          var tmpNgModel = attrName+'['+count+']';
                          tmpModelName.push(tmpNgModel);


                          

                        if(attrName != 'ad_block'){ 
                          // Form view per Element wuth  scope.customAttr.adProperties.content_type and  scope.customAttr.adProperties.label.
                          // check type of element

                          var labelname = scope.customAttr.adlabelVal[attrName];
                          var contentType = scope.customAttr.adcontentType[attrName];
                          var helpText = '';

                          if(contentType == 'text'){

                            // check if restricted help text exist or not 
                            if(typeof scope.customAttr.adHelpTextArr[attrName] != typeof undefined && scope.customAttr.adHelpTextArr[attrName] != ''){ 
                              var components  = attrName.split(/_(.+)?/)[1]; 
                              var helpText = '<span class="help-block" id="help_'+components+'">'+scope.customAttr.adHelpTextArr[attrName]+'</span>';
                            } 
                             tmpHtml  += '<div class="form-group"><label>'+labelname+'</label><div class="input-group"><input type="text" ng-model="customAttr.dynamicElement.'+attrName+'['+count+']'+'['+key+']" placeholder="'+labelname+'" class="form-control input-small input-sm " /><ui-colorpicker ng-model="customAttr.dynamicElement.'+colorElementVal+'['+count+']'+'['+key+']" class="input-group-btn"></ui-colorpicker></div>'+helpText+'</div>';
                          }
                          else if(contentType == 'Image'){
                            // check if restricted help text exist or not 
                            if(typeof scope.customAttr.adHelpTextArr[indexval] != typeof undefined && scope.customAttr.adHelpTextArr[indexval] != ''){ 
                              var components  = indexval.split(/_(.+)?/)[1]; 
                              var helpText = '<span class="help-block" id="help_'+components+'">'+scope.customAttr.adHelpTextArr[indexval]+'</span>';
                            } 
                            var tempcontent = '<div class="form-group" nv-file-drop="" uploader="customAttr.dynamicElement.uploader'+'['+count+']['+key+']'+'" filters="imageFilter, queueLimit" ><label>Select <fieldset></fieldset></label><span ><input type="file" uploader="customAttr.dynamicElement.uploader'+'['+count+']['+key+']'+'" nv-file-select=""  ></span><span ng-repeat="item in customAttr.dynamicElement.uploader'+'['+count+']['+key+']'+'.queue"><span ng-show="customAttr.dynamicElement.uploader'+'['+count+']['+key+']'+'.isHTML5" ng-thumb="{ file: item._file, height: 50, width: 50  }" style="float:left;"></span><span class="pull-right"><button type="button" class="btn btn-success btn-xs"  ng-click="item.upload()" ng-disabled="item.isReady || item.isUploading || item.isSuccess"><span class="glyphicon glyphicon-upload"></span></button><button type="button" class="btn btn-danger btn-xs" ng-click="item.remove()"> <span class="glyphicon glyphicon-trash" ></span> </button></span></span><input type="hidden" ng-model="customAttr.dynamicElement.ad_img'+'['+count+']['+key+']'+'" /></div>';
                            scope.customAttr.dynamicElement.countImages.push(count+'###'+key);
                          }

                          //prepare content to render
                        }
                      }
                      scope.customAttr.toolbarView += tmpHtml;
                      scope.customAttr.toolbarViewArr.push(tmpHtml);
                      startBlockNo++;
                  }

                  // show no. of blocks reflect in preview window
                  for (var i = 0; i < tmpModelName.length; i++) {
                      scope.customAttr.renderedElementsModel.push(tmpModelName[i]); 
                  } 
                   

                  addMoreBlocks(totalBlocks);
                }
                else{ // remove
                  totalBlocks = oldValue - newValue;
                  countAllBlocks = oldValue;
                  for(i = 1; i <= totalBlocks; i++){
                    //countAllBlocks
                    maxlimit = scope.customAttr.toolbarViewArr.length;  
                    scope.customAttr.toolbarViewArr.splice((maxlimit-1), 1);
                  }
                  removeBlocks(totalBlocks);
                }
              } 
              // End re-form the elements
              scope.customAttr.isPreviewChanged = scope.customAttr.isPreviewChanged +1;
          });  

          // generate JSON on any change in preview window
          scope.$watch('customAttr.isPreviewChanged', function (newValue, oldValue) {
             var initElement = $(element).contents().find("html")[0];
             var completeHtml = mapDOM(initElement, true);
             scope.customAttr.jsonAdContent = completeHtml;
          });
          
      }
    };
}])



/**
  * Render dynamically formed HTML
  */

// directive to render dynamic toolbar
.directive('compile', ['$compile', function ($compile) {
    return function(scope, element, attrs) {

        scope.$watch(
            function(scope) {
                // watch the 'compile' expression for changes
                return scope.$eval(attrs.compile);
            },
            function(value) {
          
                // when the 'compile' expression changes
                // assign it into the current DOM
                element.html(value);
                
                // compile the new DOM and link it to the current
                // scope.
                // NOTE: we only compile .childNodes so that
                // we don't get into infinite loop compiling ourselves
                $compile(element.contents())(scope);
            }
        );
    };
}])
