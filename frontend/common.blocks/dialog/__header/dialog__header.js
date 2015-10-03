modules.define(
    'dialog__header',
    ['i-bem__dom', 'list'],
    function(provide, BEMDOM, List){
        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                'js' : {
                    'inited' : function(){
                        List.on('click-channels', this._onChannelSelect, this);
                    }
                }
            },

            destruct: function(){
                List.un('click-channels');
            },

            _onChannelSelect : function(e, data){
                this.findBlockInside('title').domElem.text(data.name);
            }
        }));
    }
);
