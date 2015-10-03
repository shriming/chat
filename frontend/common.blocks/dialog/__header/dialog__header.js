modules.define(
    'dialog__header',
    ['i-bem__dom', 'list'],
    function(provide, BEMDOM, List){
        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                'js' : {
                    'inited' : function(){
                        List.on('click-channels click-users', this._onChannelSelect, this);
                    }
                }
            },

            destruct: function(){
                List.un('click-channels click-users');
            },

            _onChannelSelect : function(e, data){
                this.domElem.text(data.name);
            }
        }));
    }
);
