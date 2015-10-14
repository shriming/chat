({
    mustDeps : [
        { block : 'spin', mods : { theme : 'shriming', size : 'xl', visible : true } }
    ],
    shouldDeps : [
        { elems : ['message', 'container', 'spin', 'name', 'title', 'info', 'blank'] },
        { block : 'keyboard', elems : ['codes'] },
        { block : 'textarea', mods : { theme : 'islands', size : 'm', focused : true, name : 'msg' } },
        { block : 'message', elem : 'avatar' },
        { block : 'message' },
        { block : 'i-chat-api' },
        { block : 'avatar', mods : { 'size' : 'm' } },
        { block : 'i-users' },
        { block : 'notify' },
        { block : 'events', elems : 'channels' },
        { block : 'editable-title', mods : { active : true, empty : true } },
        { block : 'functions', elem : 'debounce' }
    ]
});
