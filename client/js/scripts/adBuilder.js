var ComponentsIonSliders = function () {

    return {
        //main function to initiate the module
        init: function () {

            $("#adHeightSlider").ionRangeSlider({
                min: 100,
                max: 1080,
                type: 'single',
                step: 1,
                postfix: "px",
                prettify: true,
                hasGrid: false,
                onChange: function (data) {
                   
                   $('#adHeightInput').val($("#adHeightSlider").val());
                   $('#adHeightInput').attr('ng-model');
                }
            });

            $("#adWidthSlider").ionRangeSlider({
                min: 100,
                max: 1920,
                type: 'single',
                step: 1,
                postfix: "px",
                prettify: true,
                hasGrid: false,
                onChange: function (data) {
                   
                   $('#adWidthInput').val($("#adWidthSlider").val());
                    $('#adWidthInput').attr('ng-model', $("#adWidthSlider").val());
                }
            });
        }

    };

}();

/**
Todo Module
**/
var Todo = function () {

    // private functions & variables

    var _initComponents = function() {
        
        // init datepicker
        $('.todo-taskbody-due').datepicker({
            rtl: Metronic.isRTL(),
            orientation: "left",
            autoclose: true
        });

        // init tags        
        $(".todo-taskbody-tags").select2({
            tags: ["Testing", "Important", "Info", "Pending", "Completed", "Requested", "Approved"]
        });
    }

    var _handleProjectListMenu = function() {
        if (Metronic.getViewPort().width <= 992) {
            $('.todo-project-list-content').addClass("collapse");
        } else {
            $('.todo-project-list-content').removeClass("collapse").css("height", "auto");
        }
    }

    // public functions
    return {

        //main function
        init: function () {
            _initComponents();     
            _handleProjectListMenu();

            Metronic.addResizeHandler(function(){
                _handleProjectListMenu();    
            });       
        }

    };

}();