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
    getUsers : function(req, res){
        return res.json(sails.users);
    },
    connected : function(req, res){
        if (!req.session.auth) {
            return res.end();
        }

        sails.users = sails.users || {};
        sails.slackInstances = sails.slackInstances || {};

        if (!req.isSocket) {
            return res.json({ users : sails.users });
        }

        var socketId = sails.sockets.id(req.socket);

        if (sails.slackInstances[req.user.id]) {
            sails.sockets.emit(socketId, 'slackInited');
        } else {
            slack.init(req);
        }

        sails.users[req.user.id] = sails.sockets.id(req.socket);
        sails.sockets.blast('activeUsersUpdated', sails.users);

        return res.json({ users : sails.users });
    }
};

