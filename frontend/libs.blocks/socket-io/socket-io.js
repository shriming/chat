/**
 * @module socket-io
 * @description Provide io (load if it does not exist).
 */

modules.define(
    'socket-io',
    ['loader_type_js', 'socket-io__config'],
    function(provide, loader, cfg){

        /* global io */

        console.log('socket-io block this: ', this);
        function doProvide(preserveGlobal){
            /**
             * @exports
             * @type Function
             */
            console.log('should connect!');
            io.socket.on('connect', function(){
                io.socket.get('/csrfToken', function(data){
                    io.socket.get('/webrtc/connected', { _csrf : data._csrf }, function(){
                        console.log('/webrtc/connected args: ', arguments);
                    });
                });
            });
            provide(preserveGlobal? io : io);
        }

        typeof io !== 'undefined'? doProvide(true) : loader(cfg.url, doProvide);
    });
