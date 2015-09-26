modules.define(
    'dialog__history',
    ['i-bem__dom', 'BEMHTML', 'socket-io', 'jquery'],
    function(provide, BEMDOM, BEMHTML, io, $){
        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                'js' : {
                    'inited' : function(){
                        console.log('feed inited io: ', io);
                        var _this = this;
                        var socketSlack;

                        /* Тестирование Client-side. Не трогайте :) */
                        $.get('/csrfToken').success(function(data){
                            var csrfToken = data._csrf;
                            io.socket.post('/slack/rtm.start', { _csrf : csrfToken }, function(data, jwres){
                                socketSlack = io(data.url);
                                socketSlack.on('hello', function(response){
                                    console.log('newMessage response: ', response);
                                    var data = response.data;

                                    BEMDOM.append(_this.domElem,
                                        BEMHTML.apply([
                                            {
                                                block : 'message',
                                                content : data.message.username + ': ' + data.message.text
                                            }
                                        ])
                                    );
                                });
                            });
                        });

                        io.socket.on('chat.postMessage', function(response){
                            console.log('newMessage response: ', response);
                            var data = response.data;

                            if(data && !data.error) {
                                BEMDOM.append(_this.domElem,
                                    BEMHTML.apply({
                                        block : 'message',
                                        content : data.message.username + ': ' + data.message.text
                                    })
                                );
                            }
                        });
                    }
                }
            },
            renderHtml : function(){
                return '5';
            }
        }));
    }
);
