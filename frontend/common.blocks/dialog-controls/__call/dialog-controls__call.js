modules.define(
    'dialog-controls__call',
    ['i-bem__dom', 'BEMHTML', 'socket-io'],
    function(provide, BEMDOM, BEMHTML, io){
        var PeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        var IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
        var SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
        navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
        var pc = new PeerConnection(null);


        function gotStream(stream){
            BEMDOM.update(
                this.findBlockOutside('page')
                    .findBlockInside({ block : 'video', modName : 'local', modVal : true })
                    .findElem('inner'),
                BEMHTML.apply({
                    tag : 'video',
                    attrs : {
                        class : 'video_local',
                        muted : false,
                        autoplay : true,
                        src : URL.createObjectURL(stream)
                    }
                }));

                pc.addStream(stream);
                pc.onicecandidate = this._gotIceCandidate.bind(this);
                pc.onaddstream = this._gotRemoteStream.bind(this);
        }

        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                'js' : {
                    'inited' : function(){

                        this.bindTo('click', this._onCall.bind(this));

                        var _this = this;

                        io.socket.on('call', function(message){
                            var from = message.from;

                            if(confirm('Принять вызов от ' + from + '?')) {
                                navigator.getUserMedia({
                                        audio : true,
                                        video : {
                                            mandatory : {
                                                maxWidth : 320,
                                                maxHeight : 240
                                            }
                                        }
                                    },
                                    function(stream){
                                        gotStream.call(_this, stream);
                                        _this._sendMessage('callback', {}, from);
                                    },
                                    console.error);
                            }
                        });

                        io.socket.on('callback', function(message){
                            _this._createOffer();
                        });

                        io.socket.on('webrtc', function(message){
                            var content = message.content;
                            var from = message.from;

                            _this._socketId = from;

                            if(content.type == 'offer') {
                                 pc.setRemoteDescription(new SessionDescription(content));
                                _this._createAnswer.call(_this);
                                console.log('offer');
                            } else if(content.type == 'answer') {
                                console.log('answer');
                                pc.setRemoteDescription(new SessionDescription(content));
                            } else if(content.type == 'candidate') {
                                console.log('candidate');

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
                this._slackId = this.domElem.data('slackId');

                io.socket.get('/webrtc/getUsers', (function(users){
                    this._socketId = users[this._slackId];

                    navigator.getUserMedia({
                            audio : true,
                            video : {
                                mandatory : {
                                    maxWidth : 320,
                                    maxHeight : 240
                                }
                            }
                        },
                        (function(stream){
                            gotStream.call(this, stream);
                            this._sendMessage('call', {}, this._socketId);
                        }).bind(this),
                        console.error);

                }).bind(this));

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
                            class : 'video_remote',
                            autoplay : true,
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
