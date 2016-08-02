PecunioApp

.directive('assistentToolbar', 
  [ '$timeout', 
    'themeFactory', 
    'alertService',
    '$translate',
    '$modal',
    function(
      $timeout, 
      themeFactory, 
      alertService,
      $translate,
      $modal) {
        return {
          restrict: 'E',
          scope: {
            getAttr: '=ngModel'
          },
          templateUrl: 'views/common/assistent-toolbar.html',

          link : function (scope, element, attrs, ngModel, Theme){
          
            scope.getAttr.primaryColor = '';
            scope.getAttr.secondaryColor = '';
            scope.getAttr.tertiaryColor = '';
            scope.getAttr.headlineColor = '';
            scope.getAttr.textColor = '';
            scope.getAttr.headlineFont = '';
            scope.getAttr.textFont = '';
            scope.getAttr.templateName = '';

            /**
             * Function for set Font Style of headlines and texts
             * @param {[string]}
             * @param {[string]}
             */
            scope.setFontStyle = function(fontValue, styleType) {
              if (styleType == 'headlineStyle') {
                $('.headlinestyle').css('font-family',fontValue);
              }
              if (styleType == 'textStyle') {
                $('.textstyle').css('font-family',fontValue);
              }
            }

            /**
             * Function for save data for theme
             * @return {[type]}
             */
            scope.submitData = function(){
              var validationFlage = false;
              if (scope.getAttr.primaryColor == '') {
                  alertService.showAlert($translate.instant('VALIDATION_FIRST_BOX'), 'danger');
              } else if (scope.getAttr.secondaryColor == '') {
                  alertService.showAlert($translate.instant('VALIDATION_SECOND_BOX'), 'danger');
              } else if (scope.getAttr.tertiaryColor == '') {
                  alertService.showAlert($translate.instant('VALIDATION_THIRD_BOX'), 'danger');
              } else if (scope.getAttr.headlineFont == '') {
                  alertService.showAlert($translate.instant('VALIDATION_HEADLINE_FONT'), 'danger');
              } else if (scope.getAttr.headlineColor == '') {
                  alertService.showAlert($translate.instant('VALIDATION_HEADLINE_BOX'), 'danger');
              } else if (scope.getAttr.textFont == '') {
                  alertService.showAlert($translate.instant('VALIDATION_TEXT_FONT'), 'danger');
              } else if (scope.getAttr.textColor == '') {
                  alertService.showAlert($translate.instant('VALIDATION_TEXT_BOX'), 'danger');
              } else if (scope.getAttr.templateName == '') {
                  alertService.showAlert($translate.instant('VALIDATION_THEME_NAME'), 'danger');
              } else {
                validationFlage = true;
              }

              if (validationFlage) {
                $('#submitAssistentTollbar').attr('disabled', 'disabled');
                  jQuery(".page-spinner-bar").addClass("show");
                  var getdata = sessionStorage.getItem('sendBaseUrl');
                  var jsonArr = JSON.parse(getdata);
                  var domain_id = jsonArr.domain_id;
                  var themeData = { 
                    "primaryColor": scope.getAttr.primaryColor,
                    "secondaryColor": scope.getAttr.secondaryColor,
                    "tertiaryColor": scope.getAttr.tertiaryColor,
                    "headlineColor": scope.getAttr.headlineColor,
                    "textColor": scope.getAttr.textColor,
                    "headlineFont": scope.getAttr.headlineFont,
                    "textFont": scope.getAttr.textFont,
                    "templateName": scope.getAttr.templateName,
                    "domainId": domain_id
                  };

                  themeFactory
                  .checkDomainTheme(domain_id)
                  .then(function(resdata){
                    if(resdata.notExists){
                        themeFactory
                        .saveThemeData(themeData)
                        .then(function(data){
                            jQuery(".page-spinner-bar").removeClass("show");
                            jQuery(".page-spinner-bar").addClass("hide");
                            scope.openModal(700, data);
                        });
                    }else {
                      $scope.alertMessage = $translate.instant('THEME_EXIST_MSG');
                    }
                  });
              }
            }

            /**
             * Function for open Success modal after successfully save data.
             * @param  {[number]}
             * @param  {[object]}
             * @return {[type]}
             */
            scope.openModal = function(size, data){
              var modalInstance = $modal.open({
                  templateUrl: 'views/assistent/assistentSuccessModal.html',
                  controller: 'AssistentBuilderModalController',
                  backdrop: 'static',
                  size: size,
                  resolve: {
                        adTempCount: function () {
                           return data.theme;
                        }
                  }
              });  
            }

        }
      };
}]);
