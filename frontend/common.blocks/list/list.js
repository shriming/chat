modules.define(
    'list',
    ['i-bem__dom', 'BEMHTML', 'jquery', 'i-chat-api', 'i-users', 'notify', 'events__channels', 'editable-title'],
    function(provide, BEMDOM, BEMHTML, $, chatAPI, Users, Notify, channels, EditableTitle){
        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                'js' : {
                    'inited' : function(){
                        var instances = this.__self.instances || (
                                this.__self.instances = []);
                        instances.push(this);

                        this._container = this.elem('container');

                        var spinBlock = this.findBlockInside('spin');
                        if(spinBlock) {
                            spinBlock.setMod('visible');
                        }

                        var shrimingEvents = channels('shriming-events');

                        shrimingEvents.on('users-loaded', this._initializeLists, this);
                        shrimingEvents.on('channel-received-message', this._handleNewMessage, this);
                        EditableTitle.on('channel-change-title', this._onChannelChangeTitle, this);
                    }
                }
            },

            _handleNewMessage : function(e, data){
                var counter = this._getItemCounter(data.channelId);

                if(counter) {
                    counter.text(Number(counter.text()) + 1);
                }

                this.dropElemCache('item');
            },

            /**
             * Получаем каналы и итерируемся по каждому с целью
             * простановки счетчика непрочитнных сообщений
             *
             * @param {String} channelId - ID канала
             * @returns {Object|null} - Элемент counter счетчика непрочитанных сообщений канала
             *
             * @private
             */
            _getItemCounter : function(channelId){
                var _this = this;
                var counterElem;

                this.elem('item').each(function(index, item){
                    // Получаем параметры канала
                    var itemParams = _this.elemParams($(item));

                    // Если id итерируемого канала равен channelId
                    if(itemParams.id === channelId) {
                        counterElem = $(_this.elem('counter')[index]);
                    }
                });

                return counterElem? counterElem : null;
            },

            _initializeLists : function(){
                var _this = this;

                switch(_this.getMod('type')) {
                    case 'channels':
                        this._getChannelsData();
                        break;

                    case 'users':
                        chatAPI.on('rtm.start', function(result){
                            var usersStatusOnStart = {};

                            result.users.forEach(function(user){
                                usersStatusOnStart[user.id] = user.presence;
                            });

                            _this._getUsersData(usersStatusOnStart);
                        });
                        break;

                    case 'conference':
                        break;

                    default:

                }
            },

            _getChannelsData : function(){
                var _this = this;
                var generalChannelIndex;
                var hashChannelIndex;
                var selectedChannel;
                var items;
                chatAPI.get('channels.list')
                    .then(function(data){
                        var channelsList = data.channels.map(function(channel, index){
                            if(channel.is_general) {
                                generalChannelIndex = index;
                            }

                            if(channel.name == location.hash.slice(1)) {
                                generalChannelIndex = index;
                            }

                            return BEMHTML.apply({
                                block : 'list',
                                elem : 'item',
                                mods : { type : 'channels' },
                                content : channel.name,
                                js : {
                                    channelId : channel.id,
                                    name : channel.name,
                                    title : channel.topic.value
                                }
                            });
                        });

                        BEMDOM.update(_this._container, channelsList);

                        items = _this._container.children();
                        selectedChannel = items[hashChannelIndex || generalChannelIndex];

                        if(selectedChannel) {
                            selectedChannel.click();
                        }
                    })
                    .catch(function(){
                        Notify.error('Ошибка получения списка каналов!');
                    })
                    .always(function(){
                        _this.findBlockInside('spin').delMod('visible');
                    });
            },

            _getUsersData : function(usersStatusOnStart){
                var _this = this;
                var pageBlock = this.findBlockOutside('page');

                chatAPI.get('im.list')
                    .then(function(data){
                        var imsList = data.ims.map(function(im){
                            var user = Users.getUser(im.user);

                            if(!user) {
                                return;
                            }

                            var presence = usersStatusOnStart[user.id];
                            if(presence) {
                                user.presence = usersStatusOnStart[user.id];
                            }

                            return BEMHTML.apply({
                                block : 'list',
                                elem : 'item',
                                mods : { type : 'users' },
                                js : {
                                    channelId : im.id,
                                    name : user.name,
                                    title : user.real_name
                                },
                                content : {
                                    block : 'user',
                                    js : {
                                        id : user.id
                                    },
                                    mods : { presence : user.presence },
                                    user : {
                                        name : user.name,
                                        realName : user.real_name,
                                        image_48 : user.profile.image_48
                                    }
                                }
                            });
                        });

                        BEMDOM.update(_this._container, imsList);
                    })
                    .catch(function(){
                        Notify.error('Ошибка получения списка приватных бесед');
                    })
                    .always(function(){
                        _this.findBlockInside('spin').delMod('visible');
                    });

                function updateUsersStatus(name, data){
                    _this.findBlocksInside('user').forEach(function(user){
                        switch(name) {
                            case 'activeUsersUpdated':
                                if(data[user.params.id]) {
                                    user.setMod('presence', 'local');
                                } else if(user.hasMod('presence', 'local')) {
                                    chatAPI.get('users.getPresence', { user : user.params.id }).then(function(data){
                                        if(data.ok) {
                                            user.setMod('presence', data.presence);
                                        }
                                    });
                                }
                                break;
                            case 'presence_change':
                                if(user.params.id == data.user && !user.hasMod('presence', 'local')) {
                                    user.setMod('presence', data.presence);
                                }
                                break;
                        }
                    });
                }

                pageBlock.on('activeUsersUpdated', function(e, data){
                    updateUsersStatus('activeUsersUpdated', data);
                });

                chatAPI.on('presence_change', function(data){
                    updateUsersStatus('presence_change', data);
                });
            },

            _onItemClick : function(e){
                var item = $(e.currentTarget);
                var type = this.getMod(item, 'type');
                var counter = this._getItemCounter(this.elemParams(item).channelId);

                if(type == 'channels') {
                    location.hash = e.target.innerText;
                }

                if(counter) {
                    counter.text('');
                }

                this.__self.instances.forEach(function(list){
                    list.delMod(list.elem('item'), 'current');
                });

                this.setMod(item, 'current', true);
                this.emit('click-' + type, this.elemParams(item));
                this.dropElemCache('item');
            },

            _onChannelChangeTitle : function(e, data){
                var currentItem = $(this.elem('item_current'));

                if(!currentItem.length) {
                    return;
                }

                var params = $.extend({}, this.elemParams(currentItem));
                params.title = data.newTitle;

                BEMDOM.replace(currentItem, BEMHTML.apply({
                    block : 'list',
                    elem : 'item',
                    mods : { type : 'channels', current : true },
                    content : params.name,
                    js : params
                }));

                this.dropElemCache('item');
            }
        }, {
            live : function(){
                this.liveBindTo('item', 'click', function(e){
                    this._onItemClick(e);
                });

                return false;
            }
        }));
    }
);
