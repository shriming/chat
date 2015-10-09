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
                        console.info('dialog-controls__call Inited!!');
                        this.bindTo('click', this._onCall);
                        io.socket.on('connect', function(){
                            console.info('connected args: ', arguments);
                            console.log('io.socket.io.engine.id: ', io.socket.id);
                        });
                        io.socket.get('/webrtc/getSocketID', function(){
                            console.info('/webrtc/getSocketID: ', arguments);
                        });

                        var _this = this;

                        io.socket.on('webrtc', function(message){
                            console.log('webrtc args: ', arguments);

                            var content = message.content;
                            var from = message.from;

                            _this._socketId = from;
                            if(content.type == 'offer') {
                                if(confirm('Принять вызов от ' + from + '?')) {
                                    _this._askStream.call(_this);
                                    pc.setRemoteDescription(new SessionDescription(content));
                                    _this._createAnswer.call(_this);
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
            _askStream: function(){
                navigator.getUserMedia({
                        audio : true,
                        video : {
                            mandatory : {
                                maxWidth : 160,
                                maxHeight : 120
                            }
                        }
                    },
                    this._gotStream.bind(this), this._gotError
                );
            },
            _onCall : function(){
                var _this = this;
                this._slackId = this.domElem.data('slackId');
                function callback(users){
                    this._socketId = users[this._slackId];
                    console.log('this._slackId: ', this._slackId);
                    console.log('this._socketId: ', this._socketId);
                    this._askStream.call(this);
                }

                io.socket.get('/webrtc/getUsers', function(users){
                    console.log('users: ', users);
                    callback.call(_this, users);
                });
            },
            _gotStream : function(stream){
                BEMDOM.update(
                    this.findBlockOutside('page')
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
                pc.onicecandidate = this._gotIceCandidate.bind(this);
                pc.onaddstream = this._gotRemoteStream.bind(this);
                this._createOffer.call(this);
            },
            _gotError : function(error){
                console.warn('on stream error: ', error);
            },
            _gotIceCandidate : function gotIceCandidate(event){
                console.info('_gotIceCandidate event: ', event);
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
                console.info('_gotRemoteStream event: ', event);
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
                console.info('_createOffer args: ', arguments);
                pc.createOffer(
                    this._gotLocalDescription.bind(this),
                    console.error,
                    { 'mandatory' : { 'OfferToReceiveAudio' : true, 'OfferToReceiveVideo' : true } }
                );
            },
            _createAnswer : function(){
                console.info('_createAnswer args: ', arguments);
                pc.createAnswer(
                    this._gotLocalDescription.bind(this),
                    console.error,
                    { 'mandatory' : { 'OfferToReceiveAudio' : true, 'OfferToReceiveVideo' : true } }
                );
            },
            _gotLocalDescription : function(description){
                console.info('_gotLocalDescription args: ', arguments);
                pc.setLocalDescription(description);
                this._sendMessage('webrtc', description, this._socketId);
            },
            //Socket
            _sendMessage : function(type, message, to){
                message = { type : type, content : message, to : to };
                io.socket.get('/csrfToken', function(data){
                    message._csrf = data._csrf;
                    console.info('_sendMessage : ', message);
                    io.socket.post('/webrtc/message', message, function(data, jwres){
                        console.info('/webrtc/message: ', arguments);
                    });
                });
            }
        }));
    }
);
