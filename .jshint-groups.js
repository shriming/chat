module.exports = {
    options : {
        boss : true,
        eqeqeq : true,
        evil : true,
        expr : true,
        forin : true,
        immed : true,
        loopfunc : true,
        maxdepth : 4,
        maxlen : 120,
        noarg : true,
        noempty : true,
        onecase : true,
        quotmark : 'single',
        sub : true,
        supernew : true,
        undef : true,
        unused : true,
        predef: ['Passport', 'passport', 'User' , 'sails', '_', 'slack', 'console']
    },

    groups : {
        browserjs : {
            options : {
                browser : true,
                predef : ['modules']
            },
            includes : ['*.blocks/**/*.js'],
            excludes : [
                'frontend/**/*.i18n/*.js',
                'frontend/**/*.bem/*.js',
                'frontend/**/_*.js',
                'frontend/**/*.bh.js',
                'frontend/**/*.spec.js',
                'frontend/**/*.deps.js',
                'frontend/**/*.bemjson.js'
            ]
        },

        specjs : {
            options : {
                browser : true,
                maxlen : 150,
                predef : [
                    'modules',
                    'describe',
                    'it',
                    'before',
                    'beforeEach',
                    'after',
                    'afterEach'
                ]
            },
            includes : ['frontend/*.blocks/**/*.spec.js']
        },

        bemhtml : {
            options : {
                predef : [
                    'apply',
                    'applyCtx',
                    'applyNext',
                    'attrs',
                    'bem',
                    'block',
                    'cls',
                    'content',
                    'def',
                    'elem',
                    'js',
                    'local',
                    'match',
                    'mix',
                    'mod',
                    'mode',
                    'tag',
                    'process'
                ]
            },
            includes : ['frontend/*.blocks/**/*.bemhtml']
        },

        bhjs : {
            options : {
                node : true
            },
            includes : [
                'frontend/*.blocks/**/*.bh.js',
                'frontend/design/*.blocks/**/*.bh.js'
            ]
        },

        bemjsonjs : {
            options : {
                asi : true
            },
            includes : ['*.pages/**/*.bemjson.js']
        },

        nodejs : {
            options : {
                node : true,
            },
            includes : [
                'api/**/*.js',
                'config/**/*.js'
            ],
            excludes : [
                'frontend/.bem/cache/**',
                'frontend/libs/**',
                'node_modules/**'
            ]
        }
    }
};
