modules.define(
    'feed',
    ['i-bem__dom', 'BEMHTML', 'socket-io'],
    function (provide, BEMDOM, BEMHTML, io) {
        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                'js' : {
                    'inited' : function () {
                        console.log('feed inited io: ', io);
                        var _this = this;
                        io.socket.get('/message/find/1', function () {
                            console.log('/message/find/1 response: ', arguments);
                        });
                        io.socket.on('newUserConnected', function (msg) {
                            console.log('newUserConnected msg: ', msg);
                            BEMDOM.append(_this.findElem('content'),
                                BEMHTML.apply([
                                    {
                                        block : 'response',
                                        content : msg
                                    }
                                ])
                            );
                        });
                        io.socket.on('newUserLoggedIn', function (name) {
                            console.log('newUserLoggedIn name: ', name);
                            BEMDOM.append(_this.findElem('content'),
                                BEMHTML.apply([
                                    {
                                        block : 'response',
                                        content : name + ' joined to a chat.'
                                    }
                                ])
                            );
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
