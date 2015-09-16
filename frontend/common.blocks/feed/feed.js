modules.define(
    'feed',
    ['i-bem__dom', 'BEMHTML', 'socket-io'],
    function (provide, BEMDOM, BEMHTML, io) {
        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                'js' : {
                    'inited' : function () {
                        console.log('feed inited io: ', io);
                        io.socket.get('/dev/session', function (body, JWR) {
                            console.log('socket request /dev/session args: ', arguments);
                            BEMDOM.update(this.domElem,
                                BEMHTML.apply([
                                    {
                                        block : 'response',
                                        content : JSON.stringify(body, null, 2)
                                    }
                                ])
                            );
                        })
                    }
                }
            },
            renderHtml : function () {
                return '5';
            }
        }));
    }
);
