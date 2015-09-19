/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /**
     * `ChatController.send()`
     */
    send : function (req, res) {
        return res.json({
            msg : req.param.msg,
            todo : 'send() is not implemented yet!'
        });
    },

    /**
     * `ChatController.join()`
     */
    join : function (req, res) {
        return res.json({
            todo : 'join() is not implemented yet!'
        });
    }
};

