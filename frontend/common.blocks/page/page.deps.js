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
        { block : 'main', mods : { 'logged': true } },
        { block : 'list' },
        { block : 'video' },
        { block : 'dialog' },
        { block : 'link' }
    ]
});
