/**
 * Запросы к Slack API
 * @module
 */
modules.define('i-chat-api__web', ['socket-io', 'jquery', 'vow'],
    function(provide, io, $, vow){
        var api = {
            /**
             * GET-запрос
             *
             * @param {String} action - код API метода
             * @param {Object} params - передаваемые данные
             * @return {Promise}
             */
            get : function(action, params){
                return connect(action, params, 'get');
            },
            /**
             * POST-запрос
             *
             * @param {String} action - код API метода
             * @param {Object} params - передаваемые данные
             * @return {Promise}
             */
            post : function(action, params){
                return connect(action, params, 'post');
            }
        };

        function connect(action, params, method){
            params = params || {};
            method = method || 'get';

            var promise = new vow.Promise(function(resolve, reject){
                $.get('/csrfToken')
                    .done(function(data){
                        var url = '/slack/' + action;
                        $.extend(params, { _csrf : data._csrf });

                        io.socket[method](url, params, function(resData, jwres){
                            if(!resData || resData.error || jwres.statusCode !== 200) {
                                reject(resData.error || 'Ошибка подключения к API');

                                return;
                            }

                            resolve(resData.data);
                        });
                    })
                    .fail(function(err){
                        reject(err);
                    });
            });

            return promise;
        }

        provide(api);
    }
);
