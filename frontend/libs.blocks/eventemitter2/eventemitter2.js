/**
 * @module eventemitter2
 * @description Provide EventEmitter2 library
 * @tutorial https://github.com/asyncly/EventEmitter2
 */

modules.define(
    'eventemitter2',
    [ 'loader_type_js' ],
    function(provide, loader){
        loader(
            '/static/js/eventemitter2.js',
            function(){
                provide(EventEmitter2);
            });
    });
