/**
 * @module i-users
 * @description Коллекция пользователей
 */

modules.define('i-users', ['i-chat-api', 'jquery'],
    function(provide, chatAPI, $){
        var BOT_PROFILE = {
            is_bot : true,
            name : 'slackbot',
            real_name : 'Бот',
            profile : {
                image_32 : 'https://i0.wp.com/slack-assets2.s3-us-west-2.amazonaws.com/8390/img/avatars/ava_0002-32.png?ssl=1',
                image_48 : 'https://i0.wp.com/slack-assets2.s3-us-west-2.amazonaws.com/8390/img/avatars/ava_0002-48.png?ssl=1'
            }
        };

        var Users = {
            /**
             * Загружает данные пользователей
             */
            fetch : function(){
                var _this = this;

                chatAPI.get('users.list').then(function(data){
                    if(data.members && data.members.length) {
                        _this._users = data.members;
                    }
                });
            },

            /**
             * Получить данные пользователя
             *
             * @param {String} id - id пользователя
             * @returns {Object}
             */
            getUser : function(id){
                return user = $.grep(this._users, function(user){ return user.id == id; })[0] || BOT_PROFILE;
            },

            /**
             * Получить список пользователей
             *
             * @returns {Array}
             */
            getUsers : function(){
                return this._users;
            }
        };

        provide(/** @exports */Users);
    }
);
