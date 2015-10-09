modules.define('chat-input', ['i-bem__dom', 'BEMHTML', 'jquery'], function(provide, BEMDOM, BEMHTML, $){
    provide(BEMDOM.decl(this.name, {
        onSetMod : {
            js : {
                inited : function(){
                    this._initEmojiPopup();
                }
            }
        },

        _initEmojiPopup : function(){
            this._popup = this.findBlockInside('popup');
            this._emojiButton = this.findBlockInside('button');

            this._popup.setAnchor(this._emojiButton);
            this._popup.setContent(BEMHTML.apply({
                block : 'menu',
                mods : { theme : 'islands', size : 'm' },
                content : [
                    {
                        block : 'menu-item',
                        val : 1,
                        content : 'Море'
                    },
                    {
                        block : 'menu-item',
                        val : 2,
                        content : 'Горы'
                    },
                    {
                        block: 'menu-item',
                        val: 3,
                        content: {
                            block: 'emoji-icon'
                        }
                    }
                ]
            }));

            this._emojiButton.on('click', function(){
                var modStatus = this._popup.getMod('visible');
                this._popup.setMod('visible', !modStatus);
            }.bind(this));
        }
    }));
});
