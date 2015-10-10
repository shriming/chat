modules.define(
    'dialog',
    ['i-bem__dom', 'BEMHTML', 'socket-io', 'i-chat-api', 'i-users', 'user', 'list', 'message', 'keyboard__codes', 'jquery', 'notify'],
    function(provide, BEMDOM, BEMHTML, io, chatAPI, Users, User, List, Message, keyCodes, $, Notify){
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
                        User.on('click', _this._onUserSelect, _this);

                        textarea.bindTo('keydown', _this._onConsoleKeyDown.bind(_this));

                        io.socket.on('chat.postMessage', function(response){
                            var data = response.data;

                            if(data && !data.error){
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
            _onUserSelect : function(e, userParams){
                var dialogControlBlock = this.findBlockInside('dialog-controls');
                var callButton = dialogControlBlock.findElem('call');
                if(userParams.presence != 'local') {
                    dialogControlBlock.setMod(callButton, 'disabled');
                    dialogControlBlock.setMod(callButton, 'disabled');
                    return;
                }

                dialogControlBlock.delMod(callButton, 'disabled');

                callButton.data('slackId', userParams.id);
            },
            _onChannelSelect : function(e, data){
                this.elem('title').text(data.realName);
                this.elem('description').text(data.name);

                switch(e.type) {
                    case 'click-channels':
                        this.findBlockInside('dialog-controls').setMod('type', 'channels');
                        break;
                    case 'click-users':
                        this.findBlockInside('dialog-controls').setMod('type', 'user');
                        break;
                }

                this._channelId = data.id;
                BEMDOM.update(this.container, []);

                this.findBlockInside('spin').setMod('visible');

                this._getData(data.id, EVENT_METHODS[e.type]);
            },

            _getData : function(channelId, type){
                var _this = this;

                chatAPI.post(type + '.history', {
                    channel : channelId
                })
                    .then(function(resData){
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
                    })
                    .catch(function(){
                        Notify.error('Ошибка загрузки списка сообщений!');
                    })
                    .always(function(){
                        _this.findBlockInside('spin').delMod('visible');
                    });
            },

            _generateMessage : function(message){
                var user = Users.getUser(message.user) || {};
                return Message.render(user, message);
            },

            /**
             * Прокручивает блок с сообщениями к последнему сообщению
             *
             * @private
             */
            _scrollToBottom : function(){
                var historyElement = this.elem('history');
                if(historyElement.length){
                    var historyElementHeight = historyElement[0].scrollHeight;
                    $(historyElement).scrollTop(historyElementHeight);
                }
            },

            _onConsoleKeyDown : function(e){
                if(e.keyCode === keyCodes.ENTER && !e.ctrlKey){
                    e.preventDefault();

                    this._sendMessage(e.target.value);
                    e.target.value = '';
                }
            },

            _sendMessage : function(message){
                var _this = this;

                if(!this._channelId){
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
