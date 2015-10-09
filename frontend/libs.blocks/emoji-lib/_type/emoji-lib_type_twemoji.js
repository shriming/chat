modules.define('emoji-lib_type_twemoji', ['loader_type_js'], function(provide, loader){

    loader(
        'http://twemoji.maxcdn.com/twemoji.min.js',
        function(){
            provide(twemoji);
        });

});
