module.exports = {

    port: process.env.PORT || 1337,

    environment: process.env.NODE_ENV || 'development',

    passport: {
        local: {
            strategy: require('passport-local').Strategy
        },

        slack: {
            name: 'Slack',
            protocol: 'oauth2',
            strategy: require('passport-slack').Strategy,
            options: {
                clientID : '10604590981.10617859857',
                clientSecret : 'a21b9ff557d37e73154ae5f36bb30291',
                callbackURL : 'http://localhost:1337/auth/slack/callback',
                team : 'shriming',
                scope : 'identify,client'
            }
        }
    },

    models: {
        connection: 'mongo',
        migrate: 'alter'
    },

    connections: {
        mongo: {
            adapter: 'sails-mongo',
            url: 'mongodb://127.0.0.1:27017' // Example: mongodb://127.0.0.1:27017/chatik
        }
    },

    session: {
        adapter: 'mongo',
        url: 'mongodb://127.0.0.1:27017', // Example: mongodb://127.0.0.1:27017/chatik
        collection: 'sessions'
    }
};
