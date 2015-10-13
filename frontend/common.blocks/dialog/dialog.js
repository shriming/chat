modules.define(
    'dialog',
    ['i-bem__dom', 'BEMHTML', 'socket-io', 'i-chat-api', 'i-users', 'user', 'list', 'message', 'keyboard__codes', 'jquery', 'notify', 'events__channels'],
    function(provide, BEMDOM, BEMHTML, io, chatAPI, Users, User, List, Message, keyCodes, $, Notify, channels){
        var EVENT_METHODS = {
            'click-channels' : 'channels',
            'click-users' : 'im'
        };

        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                'js' : {
                    'inited' : function(){
                        this.container = this.elem('container');

                        List.on('click-channels click-users', this._onChannelSelect, this);
                        User.on('click', this._onUserClick, this);

                        this.findBlockInside('textarea').bindTo('keydown', this._onConsoleKeyDown.bind(this));
                        this._subscribeMessageUpdate();
                    }
                }
            },

            destruct : function(){
                List.un('click-channels click-users');
            },

            _subscribeMessageUpdate : function(){
                var _this = this;
                var shrimingEvents = channels('shriming-events');
                var generatedMessage;

                chatAPI.on('message', function(data){
                    if(_this._channelId && data.channel === _this._channelId){
                        generatedMessage =  _this._generateMessage(data);
                        BEMDOM.append(_this.container, generatedMessage);
                        _this._scrollToBottom();
                    }else{
                        shrimingEvents.emit('channel-received-message', { channelId : data.channel });
                    }
                });
            },

            _onUserClick : function(e, userParams){
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
                this._channelId = data.channelId;
                this.elem('name').text(data.name);
                this._setHeaderTitle(data.title, (e.type == 'click-channels'));

                switch(e.type) {
                    case 'click-channels':
                        this.findBlockInside('dialog-controls').setMod('type', 'channels');
                        this.setMod(this.elem('name'), 'type', 'channels');

                        break;

                    case 'click-users':
                        this.findBlockInside('dialog-controls').setMod('type', 'user');
                        this.setMod(this.elem('name'), 'type', 'users');

                        break;

                    default:

                }

                BEMDOM.update(this.container, []);
                this.setMod(this.elem('spin'), 'visible');
                this._getData(data.channelId, EVENT_METHODS[e.type]);
            },

            _setHeaderTitle : function(value, isActive){
                var element = this.findBlockInside('title', 'editable-title');

                if(!value && isActive){
                    value = 'Без названия';
                    element.setMod('empty');
                }else{
                    element.delMod('empty');
                }

                element.setMod('active', isActive);
                element.elem('title').text(value);
                element.params.channelId = this._channelId;
            },

            _markChannelRead : function(channelId, type, timestamp){
                chatAPI.post(type + '.mark', {
                    channel : channelId,
                    ts : timestamp
                })
                    .then(function(data){
                        console.log('Channel mark: ', data);
                    })
                    .catch(function(){
                        Notify.error('Ошибка при открытии канала!');
                    });
            },

            _getData : function(channelId, type){
                var _this = this;

                this.elem('blank').hide();

                chatAPI.post(type + '.history', {
                    channel : channelId
                })
                    .then(function(resData){
                        var messages = resData.messages.reverse();
                        var messagesList = messages.map(function(message){
                            return _this._generateMessage(message);
                        });

                        if(messages.length){
                            _this._markChannelRead(channelId, type, messages[0].ts);
                            BEMDOM.update(_this.container, messagesList);
                        }else{
                            _this.elem('blank').show();
                        }

                        _this._scrollToBottom();
                    })
                    .catch(function(){
                        Notify.error('Ошибка загрузки списка сообщений!');
                    })
                    .always(function(){
                        _this.delMod(_this.elem('spin'), 'visible');
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
                var historyElementHeight;

                if(historyElement.length){
                    historyElementHeight = historyElement[0].scrollHeight;
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
                })
                    .then(function(){
                        _this.elem('blank').hide();
                    })
                    .catch(function(){
                        Notify.error('Ошибка при отправке сообщения!');
                    });
            }
        }));
    }
);
