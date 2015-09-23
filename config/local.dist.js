module.exports = {
    passport: {
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
