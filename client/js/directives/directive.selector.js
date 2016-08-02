PecunioApp
.directive('getSelection', function ($timeout) {
        var text = '';
    
        function getSelectedText(ele) {
            var text = "";
            

            if (typeof window.getSelection != "undefined") {
                text = window.getSelection().toString();
            } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
                text = document.selection.createRange().text;
            }
            return text;
        }
    
        return {
            restrict: 'A',
            scope: {
                ngGetSelection: '='
            },
            link: function (scope, element) {

                var targetElement = element;
                $timeout(function getSelection() {
                    var newText = getSelectedText(targetElement);
                    if (text != newText) {
                        text = newText;
                        element.val(newText);
                        scope.GetSelection = newText;
                    }
    
                    $timeout(getSelection, 50);
                }, 50);
    
            }
        };
    });