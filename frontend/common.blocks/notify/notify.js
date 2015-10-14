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
                return toastr['success'](message, title);
            },

            info : function(message, title){
                return toastr['info'](message, title);
            },

            warning : function(message, title){
                return toastr['warning'](message, title);
            },

            error : function(message, title){
                return toastr['error'](message, title);
            },

            native: toastr,

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
