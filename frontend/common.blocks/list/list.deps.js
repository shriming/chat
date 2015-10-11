({
    mustDeps : [
        { elems : ['title', 'container', 'item', 'spin', 'counter'] }
    ],
    shouldDeps : [
        { block : 'avatar' },
        { block : 'i-chat-api' },
        { block : 'list', elem : 'item', mods : { type : ['channels', 'users'] } },
        { block : 'user' },
        { block : 'spin', mods : { theme : 'shriming', size : 's' } },
        { block : 'notify' },
        { block : 'events', elems : 'channels' },
    ]
});
