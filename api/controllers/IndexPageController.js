/*global sails */

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
    index : function(req, res){

        res.render({
            data : {
                title : 'Shriming чат',
                user : req.session.User || null
            }
        });

        sails.sockets.blast('newUserConnected',
            (
                req.session.User? req.session.User.name : 'New anonymous user'
            ) + ' connected to application.'
        );
    }
};
