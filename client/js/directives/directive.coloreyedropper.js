PecunioApp

.directive('colorEyeDropper', function() {
    return {
        restrict: 'E',
        scope: {
          getAttr: '=ngModel'
        },
        replace: true,
        template: "<div class='sp-preview'><div class='sp-preview-inner'></div></div>",
        link: function(scope, element, attrs, ngModel) {
            var previewOnId = '';
            var pickcolor = false;
            var rgbaString = '';
           
            $('.sp-preview').on('click', function(){
              previewOnId = $(this).attr('id');
              $('.upper-canvas').css('display','none');
              $('body').css('cursor','pointer');
              pickcolor = true;
            });
    
            /**
             * Function for pick color from fetched screen and set color into the example template
             * @param  {[object]}
             * @return {[type]}
             */
            $('#screenCanvas').on('click', function(e){
              if(pickcolor == true) {
                var rgba = e.rgba();
                var children = $("#"+previewOnId).children();
                children.css('background-color',rgba);
                rgbaString = $(children).css('background-color');
                var hex = rgb2hex(rgbaString);

                if (previewOnId == 'primaryColor') {
                  $('#boxstyle').css('border','2px solid '+hex);
                  scope.getAttr.primaryColor = hex;
                }
                if (previewOnId == 'secondaryColor') {
                  $('#boxstyle').css('background','none repeat scroll 0 0 '+hex);
                  scope.getAttr.secondaryColor = hex;
                }
                if (previewOnId == 'tertiaryColor') {
                  $('.linkstyle').css('color',hex);
                  scope.getAttr.tertiaryColor = hex;
                }
                if (previewOnId == 'textColor') {
                  $('.textstyle').css('color',hex);
                  scope.getAttr.textColor = hex;
                }
                if (previewOnId == 'headlineColor') {
                  $('.headlinestyle').css('color',hex);
                  scope.getAttr.headlineColor = hex;
                }

                $('body').css('cursor','auto');

                pickcolor = false;
              }
            });

            /**
             * Function to convert hex format to a rgb color
             * @param  {[string]}
             * @return {[type]}
             */
            function rgb2hex(rgb){
             
             rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
             return (rgb && rgb.length === 4) ? "#" +
              ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
              ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
              ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
            }

        }
    };
  });