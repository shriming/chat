modules.define('page', ['i-bem__dom', 'i-chat-api', 'socket-io', 'i-users'],
    function(provide, BEMDOM, chatAPI, io, Users){
        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                'js' : {
                    'inited' : function(){
                        var _this = this;

                        if(!this.hasMod('logged')) {
                            return;
                        }

                        io.socket = io.sails.connect();

                        io.socket.on('connect', function(){
                            setTimeout(function(){
                                io.socket.get('/csrfToken', function(data){
                                    io.socket.get('/webrtc/connected', { _csrf : data._csrf });
                                });
                            });
                        });

                        io.socket.on('activeUsersUpdated', function(users){
                            console.log('Active users: ', users);
                            _this._activeUsersUpdated = users;
                            _this.emit('activeUsersUpdated', users);
                        });

                        io.socket.on('slackInited', function(){
                            console.log('Slack inited!');
                            if(!chatAPI.isOpen()) {
                                chatAPI.init();
                            }

                            Users.fetch().catch(function(){
                                Notify.error('Ошибка загрузки списка пользователей!');
                            });
                            _this.emit('slackInited');
                        });

                    }
                }
            }
        }));
    }
);
