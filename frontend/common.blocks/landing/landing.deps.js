({
    mustDeps : [
        { elems : ['title', 'description', 'image', 'footer', 'login', 'link'] },
        {
            block : 'landing',
            mods : { animated : true }
        }
    ],
    shouldDeps : [
        {
            block : 'link',
            mods : { theme : 'islands', size : 'm' }
        }
    ]
});
