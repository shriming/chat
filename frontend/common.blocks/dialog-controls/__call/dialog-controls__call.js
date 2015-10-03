modules.define(
    'dialog-controls__call',
    ['i-bem__dom', 'BEMHTML', 'socket-io'],
    function(provide, BEMDOM, BEMHTML, io){
        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                'js' : {
                    'inited' : function(){
                        console.info('dialog-controls__call Inited!!');
                        var IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
                        var SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
                        navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia ||
                                                 navigator.webkitGetUserMedia;
                        this.bindTo('click', this._onCall);
                        io.socket.on('connect', function(){
                            console.info('connected args: ', arguments);
                            console.log('io.socket.io.engine.id: ', io.socket.id);
                        });
                        io.socket.get('/webrtc/message', function(){
                            console.info('/webrtc/message: ', arguments);
                        });
                        io.socket.get('/webrtc/getSocketID', function(){
                            console.info('/webrtc/getSocketID: ', arguments);
                        });
                    }
                }
            },
            _onCall : function(){
                console.log('Button clicked this: ', this);
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

                //                pc = new PeerConnection(null);
                //                pc.addStream(stream);
                //                pc.onicecandidate = this._gotIceCandidate;
                //                pc.onaddstream = this._gotRemoteStream;
            },
            _gotError : function(error){
                console.warn('on stream error: ', error);
            },
            _gotIceCandidate : function gotIceCandidate(event){
                if(event.candidate) {
                    sendMessage('webrtc', {
                        type : 'candidate',
                        label : event.candidate.sdpMLineIndex,
                        id : event.candidate.sdpMid,
                        candidate : event.candidate.candidate
                    }, userSelect);
                }
            },
            _gotRemoteStream : function gotRemoteStream(event){
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
            }
        }));
    }
);
