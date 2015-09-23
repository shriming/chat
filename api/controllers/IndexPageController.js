/*global Passport,sails,slack */

/**
 * IndexPageController
 *
 * @description :: Server-side logic for managing indexpages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    /**
     * `IndexPageController.index()`
     */
    index : function(req, res) {
        if(req.session.User) {
            slack.init(req);

            Passport.findOne({
                identifier : req.session.User.id
            }, function(err) {
                if(err) {
                    res.send(err);
                }

                res.render({
                    data : {
                        title : 'Shriming Chat',
                        user : req.session.User
                    }
                });
            });
        } else {
            sails.sockets.blast('newUserConnected', 'New anonymous user connected to application.');

            res.render({
                data : {
                    title : 'Shriming Chat',
                    user : {}
                }
            });
        }
    }
};
