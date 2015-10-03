({
    mustDeps : [
        {
            block : 'textarea',
            mods : { theme : 'islands', size : 'm', focused : true, name : 'msg' }
        },
        { block : 'i-chat-api' },
        {
            block: 'chat-input'
        },
        {
            block: 'chat-input',
            elem: 'emoji'
        }
    ],
    shouldDeps : []
});
