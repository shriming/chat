({
    mustDeps : [
        { elems : ['title', 'container', 'item', 'spin', 'counter', 'add-channel-input'] }
    ],
    shouldDeps : [
        { block : 'avatar' },
        { block : 'i-chat-api' },
        { block : 'list', elem : 'item', mods : { type : ['channels', 'users'] } },
        { block : 'user' },
        { block : 'spin', mods : { theme : 'shriming', size : 's' } },
        { block : 'notify' },
        { block : 'events', elems : 'channels' },
        { block : 'button' },
        { elem : 'addition', mods : { 'open' : true } },
        {
            block : 'input',
            mods : { theme : 'islands', size : 's', 'has-clear' : true }
        },
        {
            block: 'keyboard',
            elem: 'codes'
        }
    ]
});
