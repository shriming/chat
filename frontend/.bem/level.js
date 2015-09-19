exports.baseLevelPath = require.resolve('bem/lib/levels/project');

exports.getTechs = function() {

    return {
        blocks : require.resolve('../libs/bem-core/.bem/levels/blocks'),
        bundles : require.resolve('../libs/bem-core/.bem/levels/bundles')
    };

};
