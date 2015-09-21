modules.define(
    'dialog__console',
    ['i-bem__dom', 'socket-io', 'keyboard__codes', 'jquery'],
    function(provide, BEMDOM, io, keyCodes, $) {
        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                'js' : {
                    'inited' : function() {
                        console.log('dialog__console inited io: ', io);
                        var textarea = this.findBlockInside('textarea');
                        textarea.bindTo('keydown', this._onKeyDown.bind(this));
                    }
                }
            },
            _onKeyDown : function(e) {
                if(e.keyCode === keyCodes.ENTER && !e.ctrlKey) {
                    e.preventDefault();
                    this._sendMessage(e.target.value);
                    e.target.value = '';
                }
            },
            _sendMessage : function(message) {
                var _this = this;
                console.log('message : ', message);
                $.get('/csrfToken').success(function(data) {
                    var csrfToken = data._csrf;
                    io.socket.post('/slack/chat.postMessage', {
                        text : message,
                        channel : 'C0AHSF11V',
                        username : _this.params.username,
                        _csrf : csrfToken
                    }, function(data, jwres) {
                        console.log('postMessage args: ', arguments);
                    });
                });
            }
        }));
    }
);
