modules.define(
    'editable-title',
    ['i-bem__dom', 'i-chat-api', 'keyboard__codes', 'notify'],
    function(provide, BEMDOM, chatAPI, keyCodes, Notify){
        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                'js' : {
                    'inited' : function(){
                        this._title = this.elem('title');
                        this._input = this.elem('input');
                        this._spin  = this.elem('spin');
                    }
                },
                'active' : function(modName, modVal){
                    if(modVal){
                        this.findBlockInside('input').bindTo('keydown', this._handleInputKeyDown.bind(this));
                        this._title.on('click', this._handleTitleClick.bind(this));
                    }else{
                        this._title.off('click');
                        this.findBlockInside('input').unbindFrom('keydown');
                    }
                }
            },

            _handleTitleClick : function(){
                this._input.show();
                this._title.hide();

                this._input.find('input')
                    .val(this._title.text())
                    .focus();
            },

            _handleInputKeyDown : function(e){
                var value = e.target.value;

                if(e.keyCode === keyCodes.ENTER && this._validateInput(value)){
                    this._saveTitle(value);
                }
            },

            _validateInput : function(value){
                if(value){
                    this.delMod(this._input, 'error');
                }else{
                    this.setMod(this._input, 'error');
                    Notify.info('Введите тему канала');
                }

                return Boolean(value);
            },

            _saveTitle : function(value){
                var _this = this;

                this.findBlockInside('input').setMod('disabled');
                this._input.hide();
                this.setMod(this._spin, 'visible');

                chatAPI.post('channels.setTopic', {
                    channel : _this.params.channelId,
                    topic : value
                })
                    .then(function(resData){
                        var newTitle = resData.topic;

                        if (newTitle){
                            _this._title.text(newTitle);
                            _this.delMod('empty');
                            _this.emit('channel-change-title', { newTitle : newTitle });
                        }
                    })
                    .catch(function(){
                        Notify.error('Ошибка изменения темы канала');
                    })
                    .always(function(){
                        _this._title.show();
                        _this.delMod(_this._spin, 'visible');
                        _this.findBlockInside('input').delMod('disabled');
                    });
            }
        }));
    }
);
