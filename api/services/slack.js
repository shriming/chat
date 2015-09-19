/* global Passport,_ */

var Slack = require('slack-node');

var slackApi = {

    init : function (req) {
        var _this = this;

        Passport.findOne({
            identifier : req.session.User.id
        }, function (err, passport) {
            if(err) {
                console.log(err);
            }

            var slack = new Slack(passport.tokens.accessToken);

            _.extend(_this, slack);
        });
    }

};

module.exports = slackApi;
