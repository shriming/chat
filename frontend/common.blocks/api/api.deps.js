(
{
    shouldDeps : [],
    mustDeps : [
        { block : 'socket' },
        { block : 'vow' },
        { block : 'querystring' },
        {
            block : 'events',
            elems : ['channels']
        }
    ]
}
);
