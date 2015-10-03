/**
 * WebrtcController
 *
 * @description :: Server-side logic for managing webrtcs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /**
     * `WebrtcController.message()`
     */
    message : function(req, res){
        return res.json({
            todo : 'message() is not implemented yet!'
        });
    },
    getSocketID : function(req, res){
        console.log('server on getSocketID');
        if(!req.isSocket) {
            return res.badRequest();
        }

        var socketId = sails.sockets.id(req.socket);
        // => "BetX2G-2889Bg22xi-jy"

        return res.json({id: socketId});
    }
};

