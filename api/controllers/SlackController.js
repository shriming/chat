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
    api : function(req, res){
        var options = req.method === 'POST'? req.body : req.query;
        var data = {};

        if(slack.api) {
            slack.api(req.params.method, options, function(error, response){
                data = { error : error, data : response };
            });
        } else {
            data.error = 'Slack service was\'t properly inited. Can\'t perform request.';
            console.log('Slack controller error: ', data.error);
        }

        sails.sockets.blast(req.params.method, data);
        res.json(data);
    }
};
