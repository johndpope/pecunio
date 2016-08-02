PecunioApp

.factory('validationElementModifier', [
    function () {

                var  reset = function (el) {
                    
                    var ele = el.find('span');
                    
                    angular.forEach(ele, function (spanEl) {
                        spanEl = angular.element(spanEl);
                       
                        if (spanEl.hasClass('error-msg')) {
                            spanEl.remove();
                        }
                    });
                    
                },

                findWithClassElementAsc = function (el, klass) {
                    var parent = el;
                    for (var i = 0; i <= 3; i += 1) {
                        if (parent !== undefined && parent.hasClass(klass)) {
                            break;
                        } else if (parent !== undefined) {
                            parent = parent.parent();
                        }
                    }
                    
                    return parent;
                },

                findFormGroupElement = function (el) {
                    //console.log(el);
                    return findWithClassElementAsc(el, 'form-group');
                },
            
                makeValid = function (el) {
                    //el.removeClass('bg-red');
                    var frmGroupEl = findFormGroupElement(el);
                    reset(frmGroupEl);
                },
            
                makeInvalid = function (el, errorMsg) {
                    //el.addClass('bg-red');
                    //alert(errorMsg);

                    var frmGroupEl = findFormGroupElement(el);
                    
                    
                    if(el.prop("type") == 'text' || el.prop("type") == 'password' || el.prop("type") == 'textarea' || el.prop("type") == 'select-one'){

                       var helpTextEl = angular.element('<span class="error error-msg">' + errorMsg + '</span>');  
                       
                    }
                    reset(frmGroupEl);
                    el.after(helpTextEl);
                    
                },
               
                makeDefault = function (el) {
                    //el.removeClass('error');
                    var frmGroupEl = findFormGroupElement(el);
                    reset(frmGroupEl);
                };

        return {
            makeValid: makeValid,
            makeInvalid: makeInvalid,
            makeDefault: makeDefault,
            key: 'validationElementModifierKey'
        };
    }
])

.factory('validationErrorMessageResolver', [
    '$q', 
    '$translate',
    function (
        $q, 
        $translate
        ) {

        /**
        * 
        * @description
        * Resolves a validate error type into a user validation error message
        *
        * @param {String} errorType - The type of validation error that has occurred.
        * @param {Element} el - The input element that is the source of the validation error.
        * @returns {Promise} A promise that is resolved when the validation message has been produced.
        */
        var resolve = function (errorType, el) {
            var defer = $q.defer();
            // do something to get the error message
            // then resolve the promise defer.resolve('some error message');
            defer.resolve($translate.instant('VALIDATION_'+errorType.toUpperCase()));
            return defer.promise;
        };

        return {
            resolve: resolve
        };
    }
]);

