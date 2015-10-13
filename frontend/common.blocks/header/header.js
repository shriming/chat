modules.define(
    'header',
    ['i-bem__dom', 'i-chat-api', 'notify', 'list'],
    function(provide, BEMDOM, chatAPI, Notify, List){
        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                js : {
                    inited : function(){
                        var pageBlock = this.findBlockOutside('page');
                        var _this = this;
                        pageBlock.on('slackInited', function(){
                            if(!_this.hasMod('logged')){
                                return;
                            }
                            _this._fetchTitleInfo();
                        });

                        this.elem('menu').on('click', this._toggleMenuIcon.bind(this));
                        List.on('click-channels click-users', this._toggleMenuIcon, this);
                    }
                }
            },

            _toggleMenuIcon : function(){
                this.toggleMod('closed');
                this.emit('menu-toggle', { visible : this.getMod('closed') });
            },

            /**
             * Получает название чата через Slack API
             *
             * @private
             */
            _fetchTitleInfo : function(){
                var _this = this;
                chatAPI.get('team.info')
                    .then(function(chatInfo){
                        if(!chatInfo.ok){
                            throw new Error('Ошибка получения информации о чате');
                        }

                        _this.setTitle(chatInfo.team.name || '');
                    })
                    .catch(function(err){
                        Notify.error('Ошибка получения информации о чате');
                    });
            },

            /**
             * Устанавливает название чата
             *
             * @param {string} title Устанавливаемое значение
             */
            setTitle : function(title){
                if(!title.length){
                    return;
                }
                var titleElement = this.elem('title');
                if(!titleElement.length){
                    return;
                }

                titleElement.text(title);
            }
        }));
    });
