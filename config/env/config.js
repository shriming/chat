var _ = require('lodash');

var config = {
    dev: 'development',
    prod: 'production'
};

process.env.PORT = process.env.PORT || 3000;
config.port = process.env.PORT;

process.env.BROWSER_SYNC_PORT = process.env.BROWSER_SYNC_PORT || 8090;
config.browserSyncPort = process.env.BROWSER_SYNC_PORT;

process.env.NODE_ENV = process.env.NODE_ENV || config.dev;
config.env = process.env.NODE_ENV;

console.log(process);

var envConfig;
// require could error out if
// the file doesn't exist so lets try this statement
// and fallback to an empty object if it does error out

try {
    envConfig = require('./' + config.env);
    // just making sure the require actually
    // got something back :)
    envConfig =  envConfig || {};
} catch(e) {
    envConfig = {};
}

// merge the two config files together
// the envConfig file will overwrite properties
// on the config object
module.exports = _.merge(config, envConfig);
