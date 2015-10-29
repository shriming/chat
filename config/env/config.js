var _ = require('lodash');

var config = {
    dev: 'development',
    prod: 'production',

    /***************************************************************************
     * Set the bin path for executing plugins                                  *
     ***************************************************************************/
    bin: './node_modules/.bin/',

    /***************************************************************************
     * Set the directory for db files                                          *
     ***************************************************************************/
    directoryForDb: './db',

    /***************************************************************************
     * Set the entry point to app                                              *
     ***************************************************************************/
    appScript: 'app.js',

    /***************************************************************************
     * Set the src paths to files                                              *
     ***************************************************************************/
    src: {
        libs: [
            'frontend/libs/sails.io.js/dist/sails.io.js',
            'frontend/libs/eventemitter2/lib/eventemitter2.js'
        ],
        server: ['./config', './api'],
        css: ['frontend/**/*.styl',
              '!frontend/static/**/*',
              '!frontend/*.bundles/**/*',
              '!frontend/libs/**/*',
              '!frontend/static/**/*'
        ],
        js: ['frontend/**/*.js',
             '!frontend/static/**/*',
             '!frontend/*.bundles/**/*'
        ],
        images: ['frontend/**/*.{png,jpg,gif,svg,ico}',
                 '!frontend/static/*',
                 '!frontend/*.bundles/*'
        ],
        bemhtmlTemplates: ['frontend/**/*.bemhtml',
                           '!frontend/static/**/*',
                           '!frontend/*.bundles/**/*'
        ],
        bemtreeTemplates: ['frontend/**/*.bemtree',
                           '!frontend/static/**/*',
                           '!frontend/*.bundles/**/*'
        ],
    },

    /***************************************************************************
     * Set the dest paths to files                                              *
     ***************************************************************************/
    dest: {
        mergedCss: 'frontend/desktop.bundles/merged/_merged.css',
        finalCss: 'frontend/static/css',
        mergedJs: 'frontend/desktop.bundles/merged/_merged.js',
        finalJs: 'frontend/static/js',
        images: 'frontend/static/images',
        libs: 'frontend/static/js'
    }
};

process.env.PORT = process.env.PORT || 1337;
config.port = process.env.PORT;

process.env.BROWSER_SYNC_PORT = process.env.BROWSER_SYNC_PORT || 8090;
config.browserSyncPort = process.env.BROWSER_SYNC_PORT;

process.env.YENV = process.env.YENV || config.dev;
config.env = process.env.YENV;

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
