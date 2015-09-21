/* global sails, slack*/

/**
 * SlackController
 *
 * @description :: Server-side logic for managing slacks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /**
     * `SlackController.api()`
     */
    api : function(req, res) {
        var options = (req.method === 'POST')? req.body : req.query;

        if(slack.api) {
            slack.api(req.params.method, options, function(error, response) {
                var data = { error : error, data : response };

                sails.sockets.blast(req.params.method, data);
                res.json(data);
            });
        } else {
            console.log('error');
        }
    }
};

