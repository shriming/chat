modules.define(
    'dialog',
    ['i-bem__dom', 'BEMHTML', 'socket-io', 'i-chat-api', 'i-users', 'list', 'keyboard__codes', 'jquery'],
    function(provide, BEMDOM, BEMHTML, io, chatAPI, Users, List, keyCodes, $){
        var EVENT_METHODS = {
            'click-channels' : 'channels',
            'click-users' : 'im'
        };

        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                'js' : {
                    'inited' : function(){
                        var _this = this;
                        var textarea = _this.findBlockInside('textarea');
                        _this.container = _this.elem('container');

                        List.on('click-channels click-users', _this._onChannelSelect, _this);
                        textarea.bindTo('keydown', _this._onConsoleKeyDown.bind(_this));

                        io.socket.on('chat.postMessage', function(response){
                            var data = response.data;

                            if (data && !data.error) {
                                var messageHTML = _this._generateMessage(data.message);
                                BEMDOM.append(_this.container, messageHTML);
                                _this._scrollToBottom();
                            }
                        });
                    }
                }
            },

            destruct : function(){
                List.un('click-channels click-users');
            },

            _onChannelSelect : function(e, data){
                this.elem('title').text(data.realName);
                this.elem('description').text(data.name);

                this._channelId = data.id;
                BEMDOM.update(this.container, []);

                this.findBlockInside('spin').setMod('visible');

                this._getData(data.id, EVENT_METHODS[e.type]);
            },

            _getData : function(channelId, type){
                var _this = this;

                chatAPI.post(type + '.history', {
                    channel : channelId
                }).then(function(resData){
                    var messagesList = resData.messages.reverse().map(function(message){
                        return _this._generateMessage(message);
                    });

                    BEMDOM.update(_this.container, messagesList);
                    _this._scrollToBottom();
                    //chatAPI.on('message',function(data){
                    //    var result =  _this._generateMessage(data);
                    //
                    //    BEMDOM.append(_this.container, result);
                    //});
                }, function(error){
                    console.log('channels.history error: ', error);
                }).always(function(){
                    _this.findBlockInside('spin').delMod('visible');
                });
            },

            _generateMessage : function(message){
                var user = Users.getUser(message.user) || {};
                var username = user ? (user.real_name || user.name) : 'Бот какой-то';
                var date = new Date(Math.round(message.ts) * 1000);

                return BEMHTML.apply(
                    {
                        block : 'message',
                        mix : [{ block : 'dialog', elem : 'message' }],
                        content : [
                            {
                                block : 'avatar',
                                user : {
                                    name : username,
                                    image_48 : user.profile.image_32
                                },
                                mods : { size : 'm' },
                                mix : { block : 'message', elem : 'avatar' }
                            },
                            {
                                elem : 'username',
                                content : username
                            },
                            {
                                elem : 'time',
                                content : this._getSimpleDate(date)
                            },
                            {
                                elem : 'content',
                                content : message.text
                            }
                        ]
                    }
                );
            },

            /**
             * Прокручивает блок с сообщениями к последнему сообщению
             *
             * @private
             */
            _scrollToBottom : function(){
                var historyElement = this.elem('history');
                if (historyElement.length) {
                    var historyElementHeight = historyElement[0].scrollHeight;
                    $(historyElement).scrollTop(historyElementHeight);
                }
            },


            _getSimpleDate : function(date){
                var hours = ('0' + date.getHours()).slice(-2);
                var minutes = ('0' + date.getMinutes()).slice(-2);

                return hours + ':' + minutes;
            },

            _onConsoleKeyDown : function(e){
                if (e.keyCode === keyCodes.ENTER && !e.ctrlKey) {
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

                chatAPI.post('chat.postMessage', {
                    text : message,
                    channel : _this._channelId,
                    username : _this.params.username,
                    as_user : true
                }).then(function(data){
                    console('postMessage res data: ', data);
                }, function(error){
                    console('postMessage error: ', error);
                });
            }
        }));
    }
);
