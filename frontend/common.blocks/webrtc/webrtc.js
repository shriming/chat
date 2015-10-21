modules.define('webrtc', ['i-bem__dom', 'BEMHTML', 'socket-io', 'notify'],
    function(provide, BEMDOM, BEMHTML, io, Notify){

        var PeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        var IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
        var SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
        navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;

        var WebRTC = {
            init : function(e){
                this.call_btn = e;
                var _this = e;

                this.pc = new PeerConnection(
                    {
                        iceServers : [
                            { url : "stun:23.21.150.121" },
                            { url : "stun:stun.l.google.com:19302" }
                        ]
                    },{
                        optional : [{ DtlsSrtpKeyAgreement : true }]
                    }
                );


                io.socket.on('call', function(message){
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
                            WebRTC.getUserMedia(function(stream){
                                WebRTC.gotStream.call(_this, stream);
                                WebRTC.sendMessage('callback', {}, message.from.socketId);
                                WebRTC.openUser(message.from.userId);
                            });
                        });
                    }

                    var icon = _this.findBlockInside('icon');

                    if($toast.find('.incomming-call__no').length) {
                        $toast.delegate('.incomming-call__no', 'click', function(){
                            icon.setMod('name', 'call-disabled');
                            WebRTC.sendMessage('calloff', {}, message.from.socketId);
                        });
                    }
                });

                io.socket.on('callback', function(message){
                    WebRTC.createOffer.call(_this);
                });

                io.socket.on('calloff', function(message){
                    WebRTC.finishCall();
                    Notify.warning('Ваш собеседник завершил вызов');
                });

                io.socket.on('webrtc', function(message){
                    var content = message.content;

                    WebRTC._socketId = message.from.socketId;

                    if(content.type == 'offer') {
                        WebRTC.pc.setRemoteDescription(new SessionDescription(content));
                        WebRTC.createAnswer.call(_this);
                    } else if(content.type == 'answer') {
                        WebRTC.pc.setRemoteDescription(new SessionDescription(content));
                    } else if(content.type == 'candidate') {
                        var candidate = new IceCandidate({
                            sdpMLineIndex : content.label, candidate : content.candidate
                        });

                        WebRTC.pc.addIceCandidate(candidate);
                    }
                });
            },

            getUserMedia : function(callback){
                navigator.getUserMedia({
                    audio : true,
                    video : {
                        mandatory : {
                            maxWidth : 320,
                            maxHeight : 240
                        }
                    }
                }, callback, function(){
                    console.warn('Нужно разрешить доступ к камере!');
                });
            },

            sendMessage : function(type, message, to){
                message = { type : type, content : message, to : to };
                io.socket.get('/csrfToken', function(data){
                    message._csrf = data._csrf;
                    io.socket.post('/webrtc/message', message);
                });
            },

            openUser : function(userId){
                console.log(this.call_btn, userId);
                var pageBlock = this.call_btn.findBlockOutside('page');
                var listBlock = pageBlock.findBlockInside({ block : 'list', modName : 'type', modVal : 'users' });

                console.log(listBlock);
                listBlock.findBlocksInside('user').forEach(function(user){
                    if(user.params.id == userId && user.hasMod('presence', 'local')) {
                        user.domElem.click();
                    }
                });
            },

            finishCall : function(){
                var icon = this.call_btn.findBlockInside('icon');

                var localVideo = this.call_btn.findBlockOutside('page')
                    .findBlockInside({ block : 'video', modName : 'local', modVal : true })
                    .findElem('inner');

                var remoteVideo = this.call_btn.findBlockOutside('page')
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
                this.call_btn.localStream.stop();
                if (this.call_btn.remoteStream) {
                    this.call_btn.remoteStream.stop();
                }
            },

            onCall : function(){
                if(this.hasMod('disabled')) {
                    Notify.warning('Пользователя нет на сайте! Пригласите его, чтобы начать звонок.');
                    return;
                }

                var icon = this.findBlockInside('icon');

                if(icon.hasMod('name', 'call-end')) {
                    WebRTC.finishCall();
                    WebRTC.sendMessage('calloff', {}, WebRTC._socketId);
                } else {
                    WebRTC._slackId = this.domElem.data('slackId');

                    io.socket.get('/webrtc/getUsers', (function(users){
                        WebRTC._socketId = users[WebRTC._slackId];

                        WebRTC.getUserMedia((function(stream){
                            WebRTC.gotStream.call(this, stream);
                            WebRTC.sendMessage('call', {}, WebRTC._socketId);
                        }).bind(this));
                    }).bind(this));
                }
            },

            gotStream : function(stream){
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
                    })
                );

                WebRTC.pc.addStream(stream);
                WebRTC.pc.onicecandidate = WebRTC.gotIceCandidate.bind(this);
                WebRTC.pc.onaddstream = WebRTC.gotRemoteStream.bind(this);

                this.localStream = stream;

                var icon = this.findBlockInside('icon');
                icon.setMod('name', 'call-end');
            },

            gotError : function(error){

            },

            createOffer : function(){
                WebRTC.pc.createOffer(
                    WebRTC.gotLocalDescription.bind(this),
                    WebRTC.gotError,
                    { 'mandatory' : { 'OfferToReceiveAudio' : true, 'OfferToReceiveVideo' : true } }
                );
            },

            createAnswer : function(){
                WebRTC.pc.createAnswer(
                    WebRTC.gotLocalDescription.bind(this),
                    WebRTC.gotError,
                    { 'mandatory' : { 'OfferToReceiveAudio' : true, 'OfferToReceiveVideo' : true } }
                );
            },

            gotLocalDescription : function(description){
                WebRTC.pc.setLocalDescription(description);
                WebRTC.sendMessage('webrtc', description, WebRTC._socketId);
            },

            gotIceCandidate : function(event){
                if(event.candidate) {
                    WebRTC.sendMessage('webrtc', {
                        type : 'candidate',
                        label : event.candidate.sdpMLineIndex,
                        id : event.candidate.sdpMid,
                        candidate : event.candidate.candidate
                    }, WebRTC._socketId);
                }
            },

            gotRemoteStream : function(event){
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

                this.remoteStream = event.stream;
            }
        };

        provide(WebRTC);
    });