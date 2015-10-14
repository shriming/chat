modules.define(
    'landing',
    ['i-bem__dom'],
    function(provide, BEMDOM){
        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                js : {
                    inited : function(){
                        this.setMod('animated');
                    }
                }
            }
        }));
    });
