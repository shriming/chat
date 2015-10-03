/**
 * @module i-users
 * @description Коллекция пользователей
 */

modules.define('i-users', ['i-chat-api', 'jquery'],
    function(provide, chatAPI, $){

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
                return $.grep(this._users, function(user){ return user.id == id; })[0];
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
