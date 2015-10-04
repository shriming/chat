({
    mustDeps : [
        { elems : ['message', 'container', 'spin'] }
    ],
    shouldDeps : [
        { block : 'keyboard', elems : ['codes'] },
        { block : 'textarea', mods : { theme : 'islands', size : 'm', focused : true, name : 'msg' } },
        { block : 'message', elem: 'avatar'},
        { block : 'message' },
        { block : 'i-chat-api' },
        { block : 'avatar', mods: {'size': 'm'}},
        { block : 'i-users' },
        { block : 'spin', mods : { theme : 'islands', size : 'xl' } }
    ]
});
