modules.define('user', ['i-bem__dom'],
    function(provide, BEMDOM){
        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                'js' : {
                    'inited' : function(){
                        this.bindTo('click', this._onUserClick);
                    }
                },
                'presence' : {
                    '*' : function(){
                        var pageBlock = this.findBlockOutside('page');
                        var dialogControlBlock = pageBlock.findBlockInside('dialog-controls');
                        var callButton = dialogControlBlock.findElem('call');
                        if(this.hasMod('presence', 'local')) {
                            dialogControlBlock.delMod(callButton, 'disabled');
                        } else {
                            dialogControlBlock.setMod(callButton, 'disabled');
                        }
                    }
                }
            },
            _onUserClick : function(){
                console.info('_onUserClick!!');
                var userParams = this.params;
                userParams.presence = this.getMod('presence');
                this.emit('click', userParams);
            }
        }));
    }
);
