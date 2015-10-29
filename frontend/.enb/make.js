/**
 * Enb make techs container
 *
 * @type {Object}
 */
var tech = {
        // essential
        levels : require('enb-bem-techs').levels,
        fileProvider : require('enb/techs/file-provider'),
        fileCopy : require('enb/techs/file-copy'),
        bemdeclFromBemjson : require('enb-bem/techs/bemdecl-from-bemjson'),

        deps : require('enb-bem/techs/deps-old'),
        depsProvider : require('enb/techs/deps-provider'),
        depsMerge : require('enb/techs/deps-merge'),

        files : require('enb-bem/techs/files'),
        bemdeclFromDepsByTech : require('enb-bem/techs/bemdecl-from-deps-by-tech'),
        fileMerge : require('enb/techs/file-merge'),

        // optimization
        borschik : require('enb-borschik/techs/borschik'),

        // css
        cssStylus : require('enb-stylus/techs/css-stylus'),
        cssAutoprefixer : require('enb-autoprefixer/techs/css-autoprefixer'),

        // js
        browserJs : require('enb-diverse-js/techs/browser-js'),
        prependYm : require('enb-modules/techs/prepend-modules'),

        // bemtree
        bemtree : require('enb-bemxjst/techs/bemtree'),

        // bemhtml
        bemhtml : require('enb-bemxjst/techs/bemhtml'),
        htmlFromBemjson : require('enb-bemxjst/techs/html-from-bemjson')
    },
    fs = require('fs'),
    devMode = process.env.YENV === 'development';

// TODO: add touch.pad & touch.phone bundles
if(!fs.existsSync('frontend/desktop.bundles/merged')) {
    fs.mkdirSync('frontend/desktop.bundles/merged');
}

module.exports = function (config) {

    config.includeConfig('enb-bem-specs');

    config.module('enb-bem-specs').createConfigurator('specs').configure({
        destPath : 'desktop.specs',
        levels : ['common.blocks', 'desktop.blocks'],
        sourceLevels : getSpecLevels(config),
        jsSuffixes : ['vanilla.js', 'browser.js', 'js']
    });

    config.nodes('*.bundles/*', function (nodeConfig) {

        var addTechs = [
                // essential (begin)
                // config levels
                [tech.levels, { levels : getLevels(config) }],
                // source file
                [tech.fileProvider, { target : '?.bemdecl.js' }],
                [tech.files],
                // essential (end)

                // css
                [tech.cssStylus, { target : '?.noprefix.css' }],
                [
                    tech.cssAutoprefixer, {
                    sourceTarget : '?.noprefix.css',
                    destTarget : '?.css',
                    browserSupport : getBrowsers()
                }
                ],

                // bemtree
                [tech.bemtree, { devMode : devMode }],

                // bemhtml
                [tech.bemhtml, { devMode : devMode }],

                // client bemhtml (begin)
                [
                    tech.bemdeclFromDepsByTech, {
                    target : '?.bemhtml.bemdecl.js',
                    sourceTech : 'js',
                    destTech : 'bemhtml'
                }
                ],
                [
                    tech.deps, {
                    target : '?.bemhtml.deps.js',
                    sourceDepsFile : '?.bemhtml.bemdecl.js'
                }
                ],
                [
                    tech.files, {
                    target : '?.bemhtml.deps.js',
                    filesTarget : '?.bemhtml.files',
                    dirsTarget : '?.bemhtml.dirs'
                }
                ],
                [
                    tech.bemhtml, {
                    target : '?.browser.bemhtml.js',
                    filesTarget : '?.bemhtml.files',
                    devMode : devMode
                }
                ],
                // client bemhtml (end)

                // js
                [tech.browserJs],
                [
                    tech.fileMerge, {
                    target : '?.pre.js',
                    sources : ['?.browser.bemhtml.js', '?.browser.js']
                }
                ],
                [tech.prependYm, { source : '?.pre.js' }]
            ];
        var addTargets = ['?.bemtree.js', '?.bemhtml.js', '_?.css', '_?.js'];

        // TODO: add touch.pad & touch.phone bundles
        if(nodeConfig.getPath() === 'desktop.bundles/merged') {
            // merged bundle (begin)
            var mergedDeps = [];

            fs.readdirSync('frontend/desktop.bundles').map(function (bundle) {
                if((
                        /\./).test(bundle)) {
                    return;
                }

                if(bundle !== 'merged') {

                    // Копируем депсы с каждой страницы внутрь merged
                    addTechs.push([
                        tech.depsProvider,
                        {
                            sourceNodePath : 'desktop.bundles/' + bundle,
                            depsTarget : bundle + '.deps.js'
                        }
                    ]);

                    mergedDeps.push(bundle + '.deps.js');
                }
            });

            // Мерджим все полученные депcы в один - merged.deps.js
            addTechs.push([
                tech.depsMerge,
                { depsSources : mergedDeps },
                { depsTarget : 'merged.deps.js' }
            ]);
            // merged bundle (end)

        } else {
            addTechs.push([tech.deps]);
        }

        nodeConfig.addTechs(addTechs);
        nodeConfig.addTargets(addTargets);

        // config make mode (dev/prod/etc...) (begin)
        nodeConfig.mode('development', function () {
            nodeConfig.addTechs([
                [tech.fileCopy, { sourceTarget : '?.js', destTarget : '_?.js' }],
                [tech.fileCopy, { sourceTarget : '?.css', destTarget : '_?.css' }]
            ]);
        });

        nodeConfig.mode('production', function () {
            nodeConfig.addTechs([
                [
                    tech.borschik,
                    { sourceTarget : '?.js', destTarget : '_?.js', freeze : true, minify : true }
                ],
                [
                    tech.borschik,
                    { sourceTarget : '?.css', destTarget : '_?.css', freeze : true, minify : false }
                ]
            ]);
        });
        // config make mode (end)
    });
};

/**
 * Get all requiered levels for specs target
 * @param {Object} config
 * @returns {Array} Levels
 */
function getSpecLevels(config) {
    return [].concat(
        { path : 'libs/bem-pr/spec.blocks', check : false },
        getLevels(config)
    );
}

/**
 * Get all requiered levels
 * @param {Object} config
 * @returns {Array} Levels
 */
function getLevels(config) {
    return [
        { path : 'libs/bem-core/common.blocks', check : false },
        { path : 'libs/bem-core/desktop.blocks', check : false },
        { path : 'libs/bem-components/common.blocks', check : false },
        { path : 'libs/bem-components/desktop.blocks', check : false },
        { path : 'libs/bem-components/design/common.blocks', check : false },
        { path : 'libs/bem-components/design/desktop.blocks', check : false },
        { path : 'libs.blocks', check : true },
        { path : 'common.blocks', check : true },
        { path : 'desktop.blocks', check : true }
    ];
}

/**
 * Get Browser list for CSS autoprefixer
 * @returns {string[]}
 */
function getBrowsers() {
    return [
        'last 2 versions',
        'ie 10',
        'opera 12.16'
    ];
}
