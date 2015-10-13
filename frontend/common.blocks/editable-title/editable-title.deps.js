({
    mustDeps : [
        { block : 'input', mods : { theme : 'shriming', size : 's', width : 'available' } },
        { block : 'spin', mods : { theme : 'shriming', size : 's', visible : true } }
    ],
    shouldDeps : [
        { elems : ['spin', 'input', 'title'] }
    ]
});
