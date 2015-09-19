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
                        io.socket.on('newMessage', function (msgObj) {
                            console.log('newMessage msgObj: ', msgObj);
                            BEMDOM.append(_this.domElem,
                                BEMHTML.apply([
                                    {
                                        block : 'message',
                                        content : msgObj.text
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
