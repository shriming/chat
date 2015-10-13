modules.define(
    'sidebar',
    ['i-bem__dom', 'header'],
    function(provide, BEMDOM, Header){
        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                js : {
                    inited : function(){
                        var _this = this;

                        Header.on('menu-toggle', function(e, data){
                            data.visible ? _this.setMod('hidden') : _this.delMod('hidden');
                        });
                    }
                }
            }
        }));
    });
