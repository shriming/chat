modules.define(
    'toastr',
    ['loader_type_js', 'jquery'],
    function(provide, loader, jQuery){
        window.jQuery = jQuery;

        loader(
            'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.2/toastr.min.js',
            function(){
                provide(toastr);
            });
    }
);
