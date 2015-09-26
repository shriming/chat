({
    mustDeps : [
        { block : 'libs' },
        { block : 'variables' }
    ],
    shouldDeps : [
        { block : 'controller' },
        { block : 'clearfix' },
        { block : 'header' },
        { block : 'main' },
        { block : 'list', elems : ['title', 'container', 'item'] },
        { block : 'dialog', elems : ['header', 'history', 'console'] },
        { block : 'link' }
    ],
});
