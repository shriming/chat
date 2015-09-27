/**
 * @module i-chat-api
 * @description Обеспечивает общение клиентской части чата и Slack RTM
 */

modules.define('i-chat-api', ['api', 'jquery', 'vow', 'eventemitter2', 'i-helper__function'],
    function(provide, webAPI, $, vow, EventEmitter2, helper){

        var chatAPIPrototype = {
            /**
             * Устанавливает token для общения с сервером Slack
             *
             * @param {String} token Токен, выданный при авторизации в Slack
             */
            setToken : function(token){
                this._token = token;

                if (!this.isOpen()) {
                    this._init();
                }
            },

            /**
             * Совершает запрос к серверу Slack
             *
             * @param {String} action  Код метода в API Slack
             * @param {Object} params Передаваемые данные
             * @return {Promise} Promise ответа сервера
             */
            request : webAPI.get,

            /**
             * Алиас к .request()
             */
            get : webAPI.get,

            /**
             * Совершает POST-запрос к серверу Slack
             * ! API Slack позволяет использовать GET-запросы для
             * совершения любых операций.
             *
             * @param {String} action Код метода в API Slack
             * @param {Object} params Передаваемые данные
             * @return {Promise} Promise ответа сервера
             */
            post : webAPI.post,

            /**
             * Аксессор к полю isOpen
             *
             * @param isOpen
             * @returns {bool} Статус соединения (открыто/закрыто)
             */
            isOpen : function(isOpen){
                if (arguments.length) {
                    return this._isOpen = isOpen;
                }

                return this._isOpen;
            },

            _RTM_START_URL : 'https://slack.com/api/rtm.start',

            _init : helper.once(function(){
                this._setHandlers();
                this._getSocketURL();
            }),

            _setHandlers : function(){
                var events = this._internalEvents;
                for (var event in events) if (events.hasOwnProperty(event)) {
                    this.on(event, events[event]);
                }
            },

            _internalEvents : {
                // TODO: Решить с командой правильную обработку потери соединения
                '_connection.open' : function(){
                },
                '_connection.close' : function(response){
                    console.error('Socket.close');
                },
                '_connection.abort' : function(response){
                    console.error('Socket.abort');
                },
                '_connection.error' : function(error){
                    console.log('Socket.connection.error');
                }
            },

            _isOpen : false,

            _getSocketURL : function(){
                var _this = this;
                _this.isOpen(true);

                return new vow.Promise(function(resolve, reject){
                    $.ajax({
                        method : "POST",
                        url : _this._RTM_START_URL,
                        data : {
                            token : _this._token
                        }
                    })
                        .done(function(result){
                            if (!result.ok) {
                                reject(result);
                            }

                            if (!result.url) {
                                reject('URL для создания socket-cоединения не найден!');
                            }

                            _this._initSocket(result.url);
                            resolve(result);

                        })
                        .fail(function(error){
                            reject(error);
                        });
                });
            },

            _initSocket : function(url){
                var _this = this;
                this._socket = new WebSocket(url);

                this._socket.onopen = function(){
                    _this.emit('_connection.open');
                };

                this._socket.onclose = function(event){
                    var response = {
                        code : event.code,
                        reason : event.reason
                    };

                    if (event.wasClean) {
                        _this.emit('_connection.close', response);
                    } else {
                        _this.emit('_connection.abort', response);
                    }
                };

                this._socket.onmessage = function(event){
                    var response = JSON.parse(event.data);
                    _this.emit(response.type, response);
                };

                this._socket.onerror = function(error){
                    _this.emit('_connection.error', error.message);
                };
            }
        };

        var chatAPI = $.extend({}, chatAPIPrototype, new EventEmitter2({
            wildcard : true
        }));

        provide(/** @exports */chatAPI);
    });
