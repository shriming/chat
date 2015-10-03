modules.define('chat-input', ['i-bem__dom'], function(provide, BEMDOM){
    provide(BEMDOM.decl(this.name, {
        onSetMod : {
            js : {
                inited : function(){
                    //var popup = this.findBlockInside('popup');
                    //var emojiButton = this.findBlockInside('button');
                    //
                    //console.log(popup);
                    //popup.setAnchor(emojiButton);
                    //console.log('here');
                }
            }
        }
    }));
});
