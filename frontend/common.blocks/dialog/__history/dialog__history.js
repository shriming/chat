modules.define(
    'dialog__history',
    ['i-bem__dom', 'BEMHTML', 'socket-io', 'i-chat-api', 'i-users', 'list'],
    function(provide, BEMDOM, BEMHTML, io, chatAPI, Users, List){
        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                'js' : {
                    'inited' : function(){
                        var _this = this;

                        List.on('click-channels', this._onChannelSelect, this);

                        io.socket.on('chat.postMessage', function(response){
                            var data = response.data;
                            var user = Users.getUser(data.message.user);
                            var username = user ? (user.real_name || user.name) : 'Бот какой-то';

                            if(data && !data.error) {
                                BEMDOM.append(_this.domElem,
                                    BEMHTML.apply({
                                        block : 'message',
                                        content : username + ': ' + data.message.text
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
                        var user = Users.getUser(message.user);
                        var username = user ? (user.real_name || user.name) : 'Бот какой-то';

                        return BEMHTML.apply({
                            block : 'message',
                            mix : [{ block : 'dialog', elem : 'message' }],
                            content : username + ': ' + message.text
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
