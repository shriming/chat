modules.define('avatar', ['i-bem__dom', 'BEMHTML'], function(provide, BEMDOM, BEMHTML){
    provide(BEMDOM.decl(this.name, {
        onSetMod : {
            js : {
                inited : function(){

                    this.bindTo('click', this._onClick.bind(this));
                }
            },
            size : {
                xl : function(){
                    console.log('I am big!');
                }
            }
        },

        _onClick : function(){
            this.toggleMod('size', 'm', 's');
        }
    }));
});
