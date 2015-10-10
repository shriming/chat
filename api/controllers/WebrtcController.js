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
        var message = req.body;
        sails.sockets.emit(message.to, message.type, { content : message.content, from : sails.users[req.user.id] });
        return res.end();
    },
    getSocketID : function(req, res){
        if(!req.isSocket) {
            return res.badRequest();
        }

        var socketId = sails.sockets.id(req.socket);
        // => "BetX2G-2889Bg22xi-jy"

        return res.json({ id : socketId });
    },
    getUsers : function(req, res){
        return res.json(sails.users);
    },
    connected : function(req, res){
        if(req.session.auth) {
            sails.users = sails.users || {};
            if(sails.sockets.id(req.socket)) {
                sails.users[req.user.id] = sails.sockets.id(req.socket);
                sails.sockets.blast('activeUsersUpdated', sails.users);
            }
        }
        return res.json({ users : sails.users });
    }
};

