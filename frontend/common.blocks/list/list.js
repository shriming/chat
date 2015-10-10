modules.define('list', ['i-bem__dom', 'BEMHTML', 'jquery', 'i-chat-api', 'i-users'],
    function(provide, BEMDOM, BEMHTML, $, chatAPI, Users){
        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                'js' : {
                    'inited' : function(){
                        var instances = this.__self.instances || (this.__self.instances = []);
                        instances.push(this);

                        this._container = this.elem('container');
                        this.findBlockInside('spin').setMod('visible');

                        var _this = this;
                        chatAPI.on('rtm.start', function(result){
                            if(_this.getMod('type') === 'channels') {
                                _this._getChannelsData();
                            }else{
                                Users.fetch().then(function(){
                                    var usersStatusOnStart = {};

                                    result.users.forEach(function(user){
                                        usersStatusOnStart[user.id] = user.presence;
                                    });

                                    _this._getUsersData(usersStatusOnStart);
                                }.bind(_this));
                            }
                        });
                    }
                }
            },

            _getChannelsData : function(){
                var _this = this;

                chatAPI.get('channels.list').then(function(data){
                    var channelsList = data.channels.map(function(channel){
                        return BEMHTML.apply({
                            block : 'list',
                            elem : 'item',
                            mods : { type : 'channels' },
                            content : channel.name,
                            js : {
                                id : channel.id,
                                name : '#' + channel.name,
                                realName : channel.topic.value
                            }
                        });
                    });

                    var generalChannelIndex = data.channels.map(function(channel){
                        return channel.is_general;
                    }).indexOf(true);

                    var hashChannelIndex = data.channels.map(function(channel){
                        return channel.name;
                    }).indexOf(location.hash.slice(1));

                    BEMDOM.update(_this._container, channelsList);
                    _this._container.children()[hashChannelIndex != -1 ? hashChannelIndex : generalChannelIndex].click();
                }).always(function(){
                    _this.findBlockInside('spin').delMod('visible');
                });
            },

            _getUsersData : function(usersStatusOnStart){
                var _this = this;

                chatAPI.get('im.list').then(function(data){
                    var imsList = data.ims.map(function(im){
                        var user = Users.getUser(im.user);

                        if(!user){ return; }

                        var presence = usersStatusOnStart[user.id];
                        if (presence) {
                            user.presence = usersStatusOnStart[user.id];
                        }

                        return BEMHTML.apply({
                            block : 'user',
                            js : {
                                id : user.id
                            },
                            mods: { presence: user.presence },
                            mix : {
                                block : 'list',
                                elem : 'item',
                                mods : { type : 'users' },
                                js : {
                                    id : im.id,
                                    name : '@' + user.name,
                                    realName: user.real_name
                                }
                            },
                            user : {
                                name : user.name,
                                realName : user.real_name,
                                image_48 : user.profile.image_48
                            }
                        });
                    });

                    BEMDOM.update(_this._container, imsList);
                }).always(function(){
                    _this.findBlockInside('spin').delMod('visible');
                });

                chatAPI.on('presence_change', function(data){
                    _this.findBlocksInside('user').forEach(function(user){
                        if(user.params.id == data.user){
                            user.setMod('presence', data.presence);
                        }
                    });
                });
            },

            _onItemClick : function(e){
                var item = $(e.currentTarget);
                var type = this.getMod(item, 'type');

                if(type=='channels'){
                    location.hash = e.target.innerText;
                }

                this.__self.instances.forEach(function(list){
                    list.delMod(list.elem('item'), 'current');
                });

                this.setMod(item, 'current', true);
                this.emit('click-' + type, this.elemParams(item));
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
