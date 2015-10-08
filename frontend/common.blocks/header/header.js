modules.define('header', ['i-bem__dom', 'i-chat-api'], function(provide, BEMDOM, chatAPI){
    provide(BEMDOM.decl(this.name, {
        onSetMod : {
            js : {
                inited : function(){
                    this._fetchTitleInfo();
                }
            }
        },

        /**
         * Получает название чата через Slack API
         *
         * @private
         */
        _fetchTitleInfo : function(){
            var _this = this;
            chatAPI.get('team.info').then(function(chatInfo){
                if(!chatInfo.ok) {
                    throw new Error('Ошибка получения информации о чате');
                }

                _this.setTitle(chatInfo.team.name || '');
            }).catch(function(err){
                console.error(err);
            });
        },

        /**
         * Устанавливает название чата
         *
         * @param {string} title Устанавливаемое значение
         */
        setTitle : function(title){
            if(!title.length) {
                return;
            }
            var titleElement = this.elem('title');
            if(!titleElement.length) {
                return;
            }

            titleElement.text(title);
        }
    }));
});
