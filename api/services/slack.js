var Slack = require('slack-node');

var slackApi = {

    init : function(req){
        var _this = this;

        Passport.findOne({
            identifier : req.session.User.id
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

            var slack = new Slack(passport.tokens.accessToken);
            _.extend(_this, slack);

        });
    }

};

module.exports = slackApi;
