modules.define(
    'emoji-icon',
    ['i-bem__dom'],
    function(provide, BEMDOM){

        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                js : {
                    inited : function(){

                    }
                }
            }
        }));
    }
);
