modules.define('page', ['i-bem__dom', 'i-chat-api', 'i-users'],
    function(provide, BEMDOM, chatAPI, Users){
        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                'js' : {
                    'inited' : function(){
                        Users.fetch();

                        if (!chatAPI.isOpen()) {
                            // Нужен на время тестирования
                            var TOKEN = "xoxp-11352820727-11352369638-11388775793-8454f5e6e0";
                            chatAPI.setToken(TOKEN);
                        }

                        chatAPI.on('*', function(message){
                            console.log(message);
                        });
                    }
                }
            }
        }));
    }
);
