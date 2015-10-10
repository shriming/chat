modules.define(
    'jquery__textcomplete',
    ['loader_type_js', 'jquery'],
    function(provide, loader, $){
        window.jQuery = $;

        loader(
            'https://cdnjs.cloudflare.com/ajax/libs/jquery.textcomplete/0.2.2/jquery.textcomplete.js',
            function(){
                provide(jQuery.fn.textcomplete);
            });
    });

