modules.define(
    'dialog-controls__call',
    ['i-bem__dom', 'BEMHTML', 'socket-io', 'notify'],
    function(provide, BEMDOM, BEMHTML, io, Notify){
        var PeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        var IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
        var SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;

        navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;

        var pc = new PeerConnection({
                iceServers : [
                    { url : "stun:23.21.150.121" },
                    { url : "stun:stun.l.google.com:19302" }
                ]
            },
            {
                optional : [
                    // FF/Chrome interop? https://hacks.mozilla.org/category/webrtc/as/complete/
                    { DtlsSrtpKeyAgreement : true }
                ]
            });

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

            var icon = _this.findBlockInside('icon');
            icon.setMod('name', 'call-end');
        }

        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                'js' : {
                    'inited' : function(){
                        this.bindTo('click', this._onCall.bind(this));

                        var _this = this;

                        io.socket.on('call', function(message){

                            console.info('call from: ', message.from);
                            var userName = message.from.userTitle || message.from.userName;

                            var msg = BEMHTML.apply({
                                block : 'incomming-call',
                                content : [
                                    {
                                        elem : 'question',
                                        tag : 'p',
                                        content : userName + ' хочет поговорить с вами! Принять звонок?'
                                    },
                                    {
                                        elem : 'yes',
                                        tag : 'button',
                                        content : 'Да'
                                    },
                                    {
                                        elem : 'no',
                                        tag : 'button',
                                        content : 'Нет'
                                    }
                                ]
                            });

                            var options = {
                                positionClass : 'toast-top-center',
                                timeOut : "25000",
                                extendedTimeOut : "5000"
                            };

                            $toast = Notify.native.info(msg, 'Входящий вызов...', options);

                            if($toast.find('.incomming-call__yes').length) {
                                $toast.delegate('.incomming-call__yes', 'click', function(){
                                    _this._openUser(message.from.userId);
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
                                            _this._sendMessage('callback', {}, message.from.socketId);
                                        },
                                        console.error);
                                });
                            }

                            if($toast.find('.incomming-call__no').length) {
                                $toast.delegate('.incomming-call__no', 'click', function(){
                                    _this._sendMessage('calloff', {}, _this._socketId);
                                });
                            }

                            var icon = this.findBlockInside('icon');
                            icon.setMod('name', 'call-end');
                        });

                        io.socket.on('callback', function(message){
                            _this._createOffer();
                        });

                        io.socket.on('calloff', function(message){
                            _this._finishCall();
                            Notify.warning('Ваш собеседник завершил вызов');
                        });

                        io.socket.on('webrtc', function(message){
                            var content = message.content;

                            _this._socketId = message.from.socketId;

                            if(content.type == 'offer') {
                                pc.setRemoteDescription(new SessionDescription(content));
                                _this._createAnswer.call(_this);
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
            _finishCall : function(){
                var icon = this.findBlockInside('icon');

                var localVideo = this.findBlockOutside('page')
                    .findBlockInside({ block : 'video', modName : 'local', modVal : true })
                    .findElem('inner');

                var remoteVideo = this.findBlockOutside('page')
                    .findBlockInside({ block : 'video', modName : 'remote', modVal : true })
                    .findElem('inner');

                [localVideo, remoteVideo].forEach(function(video){
                    BEMDOM.update(
                        video,
                        BEMHTML.apply({
                            content : null
                        }));
                });

                icon.setMod('name', 'call-disabled');
            },
            _openUser : function(userId){
                var pageBlock = this.findBlockOutside('page');
                var listBlock = pageBlock.findBlockInside({ block : 'list', modName : 'type', modVal : 'users' });
                listBlock.findBlocksInside('user').forEach(function(user){
                    if(user.params.id == userId && !user.hasMod('presence', 'local')) {
                        user.domElem.click();
                    }
                });
            },
            _onCall : function(){
                if(this.hasMod('disabled')) {
                    Notify.warning('Пользователя нет на сайте! Пригласите его, чтобы начать звонок.');
                    return;
                }

                var icon = this.findBlockInside('icon');

                if(icon.hasMod('name', 'call-end')) {
                    this._finishCall();
                    this._sendMessage('calloff', {}, this._socketId);
                } else {
                    this._slackId = this.domElem.data('slackId');

                    io.socket.get('/webrtc/getUsers', (
                        function(users){
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
                                (
                                    function(stream){
                                        gotStream.call(this, stream);
                                        this._sendMessage('call', {}, this._socketId);
                                    }).bind(this),
                                console.error);

                        }).bind(this));
                }
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
                    io.socket.post('/webrtc/message', message);
                });
            }
        }));
    }
);
