modules.define(
    'dialog__history',
    ['i-bem__dom', 'BEMHTML', 'socket-io'],
    function (provide, BEMDOM, BEMHTML, io) {
        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                'js' : {
                    'inited' : function () {
                        console.log('feed inited io: ', io);
                        var _this = this;

                        io.socket.get('/message', function () {
                            console.log('/message/find/1 response123: ', arguments);
                        });

                        io.socket.on('chat.postMessage', function (response) {
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

                        io.socket.on('users.list', function (res) {
                            if(res.error) {
                                console.warn(res.error);

                                return;
                            }

                            console.info(res.data);
                        });
                    }
                }
            },
            renderHtml : function () {
                return '5';
            }
        }));
    }
);
