modules.define(
    'dialog__console',
    ['i-bem__dom', 'socket-io', 'keyboard__codes', 'i-chat-api', 'list'],
    function(provide, BEMDOM, io, keyCodes, api, List){
        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                'js' : {
                    'inited' : function(){
                        var textarea = this.findBlockInside('textarea');

                        List.on('click-channels', this._onChannelSelect, this);
                        textarea.bindTo('keydown', this._onKeyDown.bind(this));
                    }
                }
            },

            destruct: function(){
                List.un('click-channels');
            },

            _onChannelSelect : function(e, data){
                this._channelId = data.id;
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

                if (!this._channelId) {
                    return;
                }

                api.post('chat.postMessage', {
                    text : message,
                    channel : _this._channelId,
                    username : _this.params.username,
                    as_user: true
                }).then(function(data){
                    console('postMessage res data: ', data);
                }, function(error){
                    console('postMessage error: ', error);
                });
            }
        }));
    }
);
