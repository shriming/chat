var Slack = require('slack-node');

var slackApi = {

    init : function(req){
        Passport.findOne({
            identifier : req.user.id
        }, function(err, passport){

            if(err) {
                console.log(err);
                return;
            }

            if(!passport) {
                console.warn('No passport exist for current user');
                return;
            }

            if (!passport.tokens || !passport.tokens.accessToken) {
                console.warn('No token or accessToken exist for current user');
                return;
            }

            sails.slackInstances[req.user.id] = new Slack(passport.tokens.accessToken);
            sails.sockets.emit(sails.sockets.id(req.socket), 'slackInited');
        });
    }

};

module.exports = slackApi;
