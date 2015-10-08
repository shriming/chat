modules.define('chat-input', ['i-bem__dom', 'jquery'], function(provide, BEMDOM, $){
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
            this._popup.setContent('Emoji!');

            this._emojiButton.on('click', function(){
                var modStatus =  this._popup.getMod('visible');
                this._popup.setMod('visible', !modStatus);
            }.bind(this));
        }
    }));
});
