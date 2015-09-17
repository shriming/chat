modules.define(
    'feed',
    ['i-bem__dom'],
    function (provide, BEMDOM) {
        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                'js' : {
                    'inited' : function () {
                        console.log('feed inited!');
                    }
                }
            },
            renderHtml : function () {
                return '5';
            }
        }));
    }
);
