modules.define(
    'dialog__history',
    ['i-bem__dom', 'BEMHTML', 'socket-io', 'i-chat-api', 'list'],
    function(provide, BEMDOM, BEMHTML, io, chatAPI, List){
        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                'js' : {
                    'inited' : function(){
                        var _this = this;

                        List.on('click-channels', this._onChannelSelect, this);

                        io.socket.on('chat.postMessage', function(response){
                            var data = response.data;

                            if(data && !data.error) {
                                BEMDOM.append(_this.domElem,
                                    BEMHTML.apply({
                                        block : 'message',
                                        content : data.message.user + ': ' + data.message.text
                                    })
                                );
                            }
                        });
                    }
                }
            },

            destruct: function(){
                List.un('click-channels');
            },

            _onChannelSelect : function(e, data){
                var _this = this;
                var container = this.elem('container');

                chatAPI.post('channels.history', {
                    channel : data.id
                }).then(function(resData){
                    var messagesList = resData.messages.reverse().map(function(message){
                        return BEMHTML.apply({
                            block : 'message',
                            mix : [{ block : 'dialog', elem : 'message' }],
                            content : message.user + ': ' + message.text
                        });
                    });

                    BEMDOM.update(_this.domElem, messagesList);
                }, function(error){
                    console.log('channels.history error: ', error);
                });
            }
        }));
    }
);
