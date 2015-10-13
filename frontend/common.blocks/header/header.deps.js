({
    mustDeps: [],
    shouldDeps : [
        { block : 'current-user' },
        {
            elems : ['menu', 'current-user', 'title']
        },
        {
            block : 'logo',
            mods : { white : true }
        },
        {
            block: 'notify'
        }
    ]
});
