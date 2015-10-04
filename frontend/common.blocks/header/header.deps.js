({
    mustDeps: [],
    shouldDeps : [
        { block : 'current-user' },
        {
            block : 'header',
            elems : 'current-user'
        },
        {
            block : 'logo',
            mods : { white : true }
        }
    ]
});
