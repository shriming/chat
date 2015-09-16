/**
 * @module socket-io__config
 * @description Configuration for socket.io
 */

modules.define('socket-io__config', function (provide) {

    provide(/** @exports */{
        /**
         * URL for loading socket.io if it does not exist.
         * URL from @see(http://cdnjs.com/libraries/socket.io)
         * @type {String}
         */
        connectUrl : '/',
        connectOptions : {},
        url : '/static/js/sails.io.js'
    });

});
