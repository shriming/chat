modules.define('page', ['i-bem__dom', 'i-chat-api'],
    function(provide, BEMDOM, chatAPI){
        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                'js' : {
                    'inited' : function(){
                        if (!chatAPI.isOpen()) {
                            chatAPI.init();
                        }
                    }
                }
            }
        }));
    }
);
