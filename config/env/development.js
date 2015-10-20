/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {
    /***************************************************************************
     * Set the bin path for executing plugins                                  *
     ***************************************************************************/
    bin: './node_modules/.bin/',

    /***************************************************************************
     * Set the directory for db files                                          *
     ***************************************************************************/
    directoryForDb: './db',

    /***************************************************************************
     * Set the logging in production environment to 'debug'                    *
     ***************************************************************************/
    logLevel: 'debug',

    /***************************************************************************
     * Set the entry point to app                                              *
     ***************************************************************************/
    appScript: 'app.js',

    /***************************************************************************
     * Set the src paths to files                                              *
     ***************************************************************************/
    src: {
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
        images: 'frontend/static/images'
    }
};
