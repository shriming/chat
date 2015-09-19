modules.define(
    'dialog__console',
    ['i-bem__dom', 'socket-io', 'keyboard__codes'],
    function (provide, BEMDOM, io, keyCodes) {
        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                'js' : {
                    'inited' : function () {
                        console.log('dialog__console inited io: ', io);
                        var textarea = this.findBlockInside('textarea');
                        textarea.bindTo('keydown', this._onKeyDown.bind(this));
                    }
                }
            },
            _onKeyDown : function (e) {
                if(e.keyCode === keyCodes.ENTER && !e.ctrlKey) {
                    e.preventDefault();
                    this._sendMessage(e.target.value);
                    e.target.value = '';
                }
            },
            _sendMessage : function (message) {
                console.log('message : ', message);
                io.socket.post('/message/create', {
                    text : message
                }, function (data, jwres) {
                    console.log('args: ', arguments);
                });
            }
        }));
    }
);
