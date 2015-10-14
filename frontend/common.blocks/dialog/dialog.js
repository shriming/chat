modules.define(
    'dialog',
    ['i-bem__dom', 'BEMHTML', 'socket-io', 'i-chat-api', 'i-users', 'user', 'list',
        'message', 'keyboard__codes', 'jquery', 'notify', 'events__channels', 'functions__debounce'],
    function(provide, BEMDOM, BEMHTML, io, chatAPI, Users, User, List, Message, keyCodes, $, Notify, channels, debounce){
        var EVENT_METHODS = {
            'click-channels' : 'channels',
            'click-users' : 'im'
        };

        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                'js' : {
                    'inited' : function(){
                        this._textarea = this.findBlockInside('textarea');
                        this._container = this.elem('container');

                        List.on('click-channels click-users', this._onChannelSelect, this);
                        User.on('click', this._onUserClick, this);

                        this._textarea.bindTo('keydown', this._onConsoleKeyDown.bind(this));
                        this.bindTo('history', 'wheel DOMMouseScroll mousewheel', this._onHistoryScroll.bind(this));
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
                        generatedMessage = _this._generateMessage(data);
                        BEMDOM.append(_this._container, generatedMessage);
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
                this._channelType = EVENT_METHODS[e.type];
                this._tsOffset = 0;

                this.elem('name').text(data.name);
                this.findBlockInside('editable-title')
                    .reset()
                    .setVal(this._channelId, data.title, (e.type == 'click-channels'));

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

                BEMDOM.update(this._container, []);
                this.setMod(this.elem('spin'), 'visible');
                this._getData();
            },

            _onHistoryScroll : debounce(function(e){
                var history = this.elem('history');
                
                if((e.type === 'wheel' || e.type === 'DOMMouseScroll' || e.type === 'mousewheel') && history.scrollTop() === 0){
                    this.setMod(this.elem('spin'), 'visible');
                    this._getData(true);
                }
            }, 100),

            _markChannelRead : function(timestamp){
                chatAPI.post(this._channelType + '.mark', {
                    channel : this._channelId,
                    ts : timestamp
                })
                    .then(function(data){
                        console.log('Channel mark: ', data);
                    })
                    .catch(function(){
                        Notify.error('Ошибка при открытии канала!');
                    });
            },

            _getData : function(infiniteScroll){
                var _this = this;

                this.elem('blank').hide();

                chatAPI.post(this._channelType + '.history', {
                    channel : this._channelId,
                    latest : infiniteScroll? this._tsOffset : 0
                })
                    .then(function(resData){
                        var messages = resData.messages.reverse();
                        var messagesList = messages.map(function(message){
                            return _this._generateMessage(message);
                        });

                        if(messages.length){
                            _this._markChannelRead(messages[messages.length - 1].ts);
                            _this._tsOffset = messages[0].ts;
                        }else{
                            _this.elem('blank').show();
                        }

                        if(infiniteScroll){
                            BEMDOM.prepend(_this._container, messagesList.join(''));
                        }else{
                            BEMDOM.update(_this._container, messagesList);
                            _this._scrollToBottom();
                        }
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

                    if(!this._textarea.hasMod('emoji')){
                        this._sendMessage(e.target.value);
                        e.target.value = '';
                    }
                }
            },

            _sendMessage : function(message){
                var _this = this;

                if(!this._channelId) {
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
