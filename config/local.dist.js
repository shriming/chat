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
                clientID: 'YOUR_CLIENT_ID',
                clientSecret: 'YOUR_CLIENT_SECRET',
                callbackURL: 'YOUR_CALLBACK_URL',
                team: 'YOUR_TEAM',
                scope: 'identify,client'
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
            url: 'YOUR_MONGODB_URL' // Example: mongodb://127.0.0.1:27017/chatik
        }
    },

    session: {
        adapter: 'mongo',
        url: 'YOUR_MONGODB_URL', // Example: mongodb://127.0.0.1:27017/chatik
        collection: 'sessions'
    }
};
