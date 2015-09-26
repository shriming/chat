modules.define(
    'dialog__console',
    ['i-bem__dom', 'socket-io', 'keyboard__codes', 'api'],
    function(provide, BEMDOM, io, keyCodes, api){
        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                'js' : {
                    'inited' : function(){
                        console.log('dialog__console inited io: ', io);
                        var textarea = this.findBlockInside('textarea');
                        textarea.bindTo('keydown', this._onKeyDown.bind(this));
                    }
                }
            },
            _onKeyDown : function(e){
                if(e.keyCode === keyCodes.ENTER && !e.ctrlKey){
                    e.preventDefault();
                    this._sendMessage(e.target.value);
                    e.target.value = '';
                }
            },
            _sendMessage : function(message){
                var _this = this;
                console.log('message : ', message);

                api.post('chat.postMessage', {
                    text : message,
                    channel : 'C0AHSF11V',
                    username : _this.params.username
                }).then(function(data){
                    console('postMessage res data: ', data);
                }, function(error){
                    console('postMessage error: ', error);
                });
            }
        }));
    }
);
