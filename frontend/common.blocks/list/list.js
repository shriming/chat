modules.define('list', ['i-bem__dom', 'BEMHTML', 'jquery', 'i-chat-api', 'i-users'],
    function(provide, BEMDOM, BEMHTML, $, chatAPI, Users){
        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                'js' : {
                    'inited' : function(){
                        var instances = this.__self.instances || (this.__self.instances = []);
                        instances.push(this);

                        if(this.getMod('type') === 'channels') {
                            this._getChannelsData();
                        }else{
                            this._getUsersData();
                        }
                    }
                }
            },

            _getChannelsData : function(){
                var container = this.elem('container');

                chatAPI.get('channels.list').then(function(data){
                    var channels = data.channels;

                    channels.forEach(function(channel){
                        BEMDOM.append(container,
                            BEMHTML.apply({
                                block : 'list',
                                elem : 'item',
                                mods : { type : 'channels' },
                                content : channel.name,
                                js : {
                                    id : channel.id,
                                    name : channel.name
                                }
                            })
                        );
                    });
                });
            },

            _getUsersData : function(){
                var container = this.elem('container');

                chatAPI.get('im.list').then(function(data){
                    var ims = data.ims;

                    ims.forEach(function(im){
                        var user = Users.getUser(im.user);
                        var username = user ? (user.real_name || user.name) : 'Бот какой-то';

                        BEMDOM.append(container,
                            BEMHTML.apply({
                                block : 'list',
                                elem : 'item',
                                mods : { type : 'users' },
                                content : username,
                                js : {
                                    id : im.id,
                                    name : username
                                }
                            })
                        );
                    });
                });
            },

            _onItemClick : function(e){
                var item = $(e.currentTarget);
                var type = this.getMod(item, 'type');

                this.__self.instances.forEach(function(list){
                    list.delMod(list.elem('item'), 'current');
                });

                this.setMod(item, 'current', true);
                this.emit('click-' + type, this.elemParams(item));
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
