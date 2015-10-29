({
    mustDeps: [
    ],
    shouldDeps: [
        { block: 'current-user' },
        { block: 'image' },
        { block: 'avatar' },
        { block: 'avatar', mod: 'size', val: 's' },
        { block: 'user',
            elems: ['avatar', 'title', 'nick', 'status', 'container', 'video'],
            mods: { presence: ['active', 'away', 'local'] }
        }
    ]
});
