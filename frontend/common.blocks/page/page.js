modules.define('page', ['i-bem__dom', 'i-chat-api', 'socket-io'],
    function(provide, BEMDOM, chatAPI, io){
        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                'js' : {
                    'inited' : function(){
                        var _this = this;
                        io.socket.on('activeUsersUpdated', function(users){
                            console.log('Active users: ', users);
                            _this._activeUsersUpdated = users;
                            _this.emit('activeUsersUpdated', users);
                        });
                        if(this.hasMod('logged')) {
                            if(!chatAPI.isOpen()) {
                                chatAPI.init();
                            }
                        }
                    }
                }
            }
        }));
    }
);
