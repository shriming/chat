modules.define(
    'chat-input__emoji-icon',
    ['i-bem__dom', 'button'],
    function(provide, BEMDOM, Button){

        provide(BEMDOM.decl({ block : this.name, baseBlock : Button }, {

            onSetMod : {
                js : {
                    inited : function(){
                        this._shortname = this.params.shortname || '';
                        this.bindTo('click', this._onClick);
                    }
                }
            },

            getShortname : function(){
                return ' :' + this._shortname + ': ';
            },

            _onClick : function(){
                this.emit('click');
            }
        }));
    }
);
