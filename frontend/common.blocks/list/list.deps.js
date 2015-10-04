({
    mustDeps : [
        { elems : ['title', 'container', 'item', 'spin'] }
    ],
    shouldDeps : [
        { block : 'avatar' },
        { block : 'i-chat-api'},
        { block : 'list', elem : 'item', mods : { type : ['channels', 'users'] } },
        { block : 'user' }
    ]
});
