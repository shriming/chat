modules.define(
    'notify',
    ['toastr'],
    function(provide, toastr){

        /**
         *
         *
         * @constructor
         */
        var Notify = function(){
        };

        Notify.prototype = {
            success : function(message, title){
                toastr['success'](message, title);
            },

            info : function(message, title){
                toastr['info'](message, title);
            },

            warning : function(message, title){
                toastr['warning'](message, title);
            },

            error : function(message, title){
                toastr['error'](message, title);
            },

            init : function(){
                toastr.options = {
                    'closeButton' : false,
                    'debug' : false,
                    'newestOnTop' : false,
                    'progressBar' : true,
                    'positionClass' : 'toast-top-right',
                    'preventDuplicates' : false,
                    'onclick' : null,
                    'showDuration' : '300',
                    'hideDuration' : '1000',
                    'timeOut' : '5000',
                    'extendedTimeOut' : '1000',
                    'showEasing' : 'swing',
                    'hideEasing' : 'linear',
                    'showMethod' : 'fadeIn',
                    'hideMethod' : 'fadeOut'
                };
            }
        };

        var notify = new Notify();

        provide(notify);
    }
);
