modules.define(
    'dialog-controls__call',
    ['i-bem__dom', 'BEMHTML', 'socket-io'],
    function(provide, BEMDOM, BEMHTML, io){
        var PeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        var IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
        var SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
        navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;

        var pc = new PeerConnection(null);

        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                'js' : {
                    'inited' : function(){

                        this.bindTo('click', this._onCall);

                        var _this = this;

                        io.socket.on('webrtc', function(message){

                            var content = message.content;
                            var from = message.from;

                            _this._socketId = from;

                            if(content.type == 'offer') {
                                if(confirm('Принять вызов от ' + from + '?')) {
                                    _this._processAnswerStream(content);
                                }
                            } else if(content.type == 'answer') {
                                pc.setRemoteDescription(new SessionDescription(content));
                            } else if(content.type == 'candidate') {
                                var candidate = new IceCandidate({
                                    sdpMLineIndex : content.label, candidate : content.candidate
                                });

                                pc.addIceCandidate(candidate);
                            }
                        });
                    }
                }
            },
            _onCall : function(){
                if (this.hasMod('disabled')) {
//                    todo call tostr error!!
                    console.log('Button disabled!!!!');
                    return;
                }
                var _this = this;
                this._slackId = this.domElem.data('slackId');

                function callback(users){
                    this._socketId = users[this._slackId];
                    console.log('users from server', users);
                    console.log("Maxim socketid:", this._socketId);
                    this._processOfferStream.call(this);
                }

                io.socket.get('/webrtc/getUsers', function(users){
                    callback.call(_this, users);
                });
            },
            _processOfferStream : function(){
                _this = this;

                navigator.getUserMedia({
                        audio : true,
                        video : {
                            mandatory : {
                                maxWidth : 160,
                                maxHeight : 120
                            }
                        }
                    },
                    function(stream){
                        BEMDOM.update(
                            _this.findBlockOutside('page')
                                .findBlockInside({ block : 'video', modName : 'local', modVal : true })
                                .findElem('inner'),
                            BEMHTML.apply({
                                tag : 'video',
                                attrs : {
                                    autoplay : true,
                                    muted : true,
                                    src : URL.createObjectURL(stream)
                                }
                            })
                        );

                        pc.addStream(stream);
                        pc.onicecandidate = _this._gotIceCandidate.bind(_this);
                        pc.onaddstream = _this._gotRemoteStream.bind(_this);
                        _this._createOffer.call(_this);
                    }, this._gotError
                );
            },
            _processAnswerStream : function(content){
                _this = this;

                navigator.getUserMedia({
                        audio : true,
                        video : {
                            mandatory : {
                                maxWidth : 160,
                                maxHeight : 120
                            }
                        }
                    },
                    function(stream){
                        BEMDOM.update(
                            _this.findBlockOutside('page')
                                .findBlockInside({ block : 'video', modName : 'local', modVal : true })
                                .findElem('inner'),
                            BEMHTML.apply({
                                tag : 'video',
                                attrs : {
                                    autoplay : true,
                                    muted : true,
                                    src : URL.createObjectURL(stream)
                                }
                            })
                        );

                        pc.addStream(stream);
                        pc.onicecandidate = _this._gotIceCandidate.bind(_this);
                        pc.onaddstream = _this._gotRemoteStream.bind(_this);

                        pc.setRemoteDescription(new SessionDescription(content));
                        _this._createAnswer.call(_this);
                    }, this._gotError
                );

            },
            _gotError : function(error){
            },
            _gotIceCandidate : function gotIceCandidate(event){

                if(event.candidate) {
                    this._sendMessage('webrtc', {
                        type : 'candidate',
                        label : event.candidate.sdpMLineIndex,
                        id : event.candidate.sdpMid,
                        candidate : event.candidate.candidate
                    }, this._socketId);
                }
            },
            _gotRemoteStream : function(event){
                BEMDOM.update(
                    this.findBlockOutside('page')
                        .findBlockInside({ block : 'video', modName : 'remote', modVal : true })
                        .findElem('inner'),
                    BEMHTML.apply({
                        tag : 'video',
                        attrs : {
                            autoplay : true,
                            muted : true,
                            src : URL.createObjectURL(event.stream)
                        }
                    })
                );
            },
            _getSocketId : function(name){
                return this[name + 'SocketId'];
            },
            _createOffer : function(){
                pc.createOffer(
                    this._gotLocalDescription.bind(this),
                    console.error,
                    { 'mandatory' : { 'OfferToReceiveAudio' : true, 'OfferToReceiveVideo' : true } }
                );
            },
            _createAnswer : function(){
                pc.createAnswer(
                    this._gotLocalDescription.bind(this),
                    console.error,
                    { 'mandatory' : { 'OfferToReceiveAudio' : true, 'OfferToReceiveVideo' : true } }
                );
            },
            _gotLocalDescription : function(description){
                pc.setLocalDescription(description);
                this._sendMessage('webrtc', description, this._socketId);
            },
            //Socket
            _sendMessage : function(type, message, to){
                message = { type : type, content : message, to : to };
                io.socket.get('/csrfToken', function(data){
                    message._csrf = data._csrf;
                    io.socket.post('/webrtc/message', message, function(data, jwres){
                    });
                });
            }
        }));
    }
);
