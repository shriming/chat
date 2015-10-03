modules.define(
    'dialog',
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
                this.elem('title').text(data.realName);
                this.elem('description').text(data.name);
            }
        }));
    }
);
