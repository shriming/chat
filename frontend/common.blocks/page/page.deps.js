({
    mustDeps : [
        { block : 'libs' },
        { block : 'variables' },
        { block : 'i-bem', elem : 'dom' }
    ],
    shouldDeps : [
        { block : 'landing' },
        { block : 'controller' },
        { block : 'clearfix' },
        { block : 'header', mods : { 'logged': true } },
        { block : 'main' },
        { block : 'list' },
        { block : 'dialog' },
        { block : 'link' }
    ]
});
