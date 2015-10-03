({
    mustDeps: [],

    shouldDeps : [
        {
            block : 'header',
            elems : 'current-user'
        },
        {
            block : 'current-user'
        },
        {
            block : 'logo',
            mods : { white : true }
        }
    ]
});
