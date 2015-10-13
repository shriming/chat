modules.define(
    'dialog__typing',
    ['i-bem__dom', 'BEMHTML'],
    function(provide, BEMDOM, BEMHTML){
        provide(BEMDOM.decl(this.name, {
            onElemSetMod : {
                'visible' : function(){
                   // visible
                }
            },
            onSetMod : {
                'js' : {
                    'inited' : function(){

                    }
                }
            },
        }));
    }
);
