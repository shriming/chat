modules.define(
    'toastr',
    ['loader_type_js'],
    function(provide, loader){

        loader(
            'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.2/toastr.min.js',
            function(){
                provide(toastr);
            });
    }
);
