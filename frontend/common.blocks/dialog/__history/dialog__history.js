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
                        List.on('click-users', this._onChannelSelect, this);

                        io.socket.on('chat.postMessage', function(response){
                            var data = response.data;

                            if(data && !data.error) {
                                var messageHTML = _this._generateMessage(data.message);
                                BEMDOM.append(_this.domElem, messageHTML);
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
                        return _this._generateMessage(message);
                    });

                    BEMDOM.update(_this.domElem, messagesList);

                    chatAPI.on('message',function(data){
                        var result =  _this._generateMessage(data);
                        BEMDOM.append(_this.domElem,result);
                    });
                }, function(error){
                    console.log('channels.history error: ', error);
                });
            },

            _generateMessage : function(message){
                var user = Users.getUser(message.user) || {};
                var username;
                if (!user.profile) {
                    username = 'Bot';
                    user = {
                        profile: {
                            image_32: ''
                            }
                        };
                    user.profile.image_32 = 'https://i0.wp.com/slack-assets2.s3-us-west-2.amazonaws.com/8390/img/avatars/ava_0002-48.png?ssl=1';
                } else {
                    username = user ? (user.real_name || user.name) : 'Бот какой-то';
                }

                var date = new Date(Math.round(message.ts) * 1000);

                 return BEMHTML.apply(
                    {
                        block:'message',
                        mix : [{ block : 'dialog', elem : 'message' }],
                        content: [
                            {
                                block : 'avatar',
                                user : {
                                    name: username,
                                    image_48: user.profile.image_32
                                },
                                mods : { size: 'm'},
                                mix: { block: 'message', elem: 'avatar' }
                            },
                            {
                                elem: 'username',
                                    content: username
                            },
                            {
                                elem: 'time',
                                content : this._getSimpleDate(date)
                            },
                            {
                                elem: 'content',
                                content: message.text
                            }
                        ]
                    }
                );
            },

            _getSimpleDate: function(date){
                var hours = ("0"+date.getHours()).slice(-2);
                var minutes = ("0"+date.getMinutes()).slice(-2);

                return hours + ':'+ minutes;
            }

        }));
    }
);
