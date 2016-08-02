var ComponentsFormTools = function () {


    var handleBootstrapSwitch = function() {

        $('.switch-radio1').on('switch-change', function () { alert(2);

            $('.switch-radio1').bootstrapSwitch('toggleRadioState');
        });

        // or

        
        $('.switch-radio1').on('switch-change', function () { alert(3);

            $('.switch-radio1').bootstrapSwitch('toggleRadioStateAllowUncheck');
        });

        // or

        $('.switch-radio1').on('switch-change', function () {alert(4);

            $('.switch-radio1').bootstrapSwitch('toggleRadioStateAllowUncheck', false);
        });

    }

    return {
        //main function to initiate the module

        init: function () {
            handleBootstrapSwitch();
        }
    };

}();