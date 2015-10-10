modules.define(
    'chat-input',
    ['i-bem__dom', 'BEMHTML', 'emoji-icon__data', 'chat-input__emoji-icon', 'jquery'],
    function(provide, BEMDOM, BEMHTML, emojiIconData, EmojiIcon, $){
        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                js : {
                    inited : function(){
                        this._textarea = this.findBlockInside('textarea');
                        this._popup = this.findBlockInside('popup');
                        this._emojiButton = this.findBlockInside('button');

                        this._initEmojiPopup();
                        this._generateEmojis();
                        this._submitOnEmojiClicked();
                    }
                }
            },

            _initEmojiPopup : function(){

                this._popup.setAnchor(this._emojiButton);
                this._popup.setContent(BEMHTML.apply({
                    block : 'menu',
                    mods : { theme : 'islands', size : 'm' },
                    content : this._generateEmojis()
                }));

                this._emojiButton.on('click', function(){
                    this._togglePopup();
                }.bind(this));
            },

            /**
             * Формирует BEMJSON со всеми emoji-иконками
             *
             * @private
             */
            _generateEmojis : function(){
                var emojiIconsBEMJSON = [];

                for (var emojiIcon in emojiIconData) if(emojiIconData.hasOwnProperty(emojiIcon)) {
                    emojiIconsBEMJSON.push({
                        block : 'emoji-icon',
                        mods : { size : 's' },
                        mix : [
                            {
                                block : 'chat-input',
                                elem : 'emoji-icon',
                                js : { shortname : emojiIcon }
                            },
                            {
                                block : 'i-bem'
                            }
                        ],
                        icon : emojiIconData[emojiIcon].unicode,
                        shortname : emojiIcon
                    });
                }

                return emojiIconsBEMJSON;
            },

            _togglePopup : function(){
                var modStatus = this._popup.getMod('visible');
                this._popup.setMod('visible', !modStatus);
            },

            _submitOnEmojiClicked : function(){
                var _this = this;

                EmojiIcon.on(
                    'click',
                    function(e){
                        var emojiIcon = e.target;
                        _this._textarea.setVal(_this._textarea.getVal() + emojiIcon.getShortname());
                        _this._textarea.setMod('focused', true);
                        _this._togglePopup();
                    });
            }
        }));
    });
