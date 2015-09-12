/**
 * Passport configuration
 *
 * This if the configuration for your Passport.js setup and it where you'd
 * define the authentication strategies you want your application to employ.
 *
 * I have tested the service with all of the providers listed below - if you
 * come across a provider that for some reason doesn't work, feel free to open
 * an issue on GitHub.
 *
 * Also, authentication scopes can be set through the `scope` property.
 *
 * For more information on the available providers, check out:
 * http://passportjs.org/guide/providers/
 */

module.exports.passport = {
    /*local : {
        strategy : require('passport-local').Strategy
    },*/

    /*  twitter : {
         name : 'Twitter',
         protocol : 'oauth',
         strategy : require('passport-twitter').Strategy,
         options  : {
             consumerKey  : 'your-consumer-key',
             consumerSecr : 'your-consumer-secret'
         }
     },*/

    /*  github : {
         name : 'GitHub',
         protocol : 'oauth2',
         strategy : require('passport-github').Strategy,
         options  : {
             clientID : 'your-client-id',
             clientSecret : 'your-client-secret'
         }
     },*/

 /*   vkontakte : {
        name : 'Вконтакте',
        protocol : 'oauth2',
        strategy : require('passport-vkontakte').Strategy,
        options : {
            clientID : 'in-dev-use-local.js',
            clientSecret : 'in-dev-use-local.js'
        }
    },

    facebook : {
        name : 'Facebook',
        protocol : 'oauth2',
        strategy : require('passport-facebook').Strategy,
        options : {
            clientID : 'in-dev-use-local.js',
            clientSecret : 'in-dev-use-local.js'
        }
    },*/

    slack : {
        name : 'Slack',
        protocol : 'oauth2',
        strategy : require('passport-slack').Strategy,
        options : {
            clientID : '10604590981.10604605940',
            clientSecret : '9ef1641f8d0916773ed900a1bba17b04',
            callbackURL : 'http://localhost:8080/auth/slack/callback',
            scope : 'identify,client,admin'
        }
    },

    /*  google : {
         name : 'Google',
         protocol : 'oauth2',
         strategy : require('passport-google-oauth').OAuth2Strategy,
         options : {
            clientID : 'your-client-id',
            clientSecret : 'your-client-secret'
         }
     }*/
};
