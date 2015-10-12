modules.define(
    'sidebar',
    ['i-bem__dom', 'header'],
    function(provide, BEMDOM, chatAPI, Notify){
        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                hidden : {
                    true : function(){
                        this.findBlockOutside('page').findBlocksInside('header')[0].findElem('menu')[0].classList.remove('header__menu_close');
                    }
                }
            }
        }));
    });
