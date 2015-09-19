modules.define('api', ['jquery', 'inherit', 'events__channels', 'vow', 'objects', 'querystring'],
    function (provide, $, inherit, channels, vow, Objects, querystring) {
        provide(
            inherit({
                __constructor : function (params) {
                    this._params = {};
                    if(Object.prototype.toString.call(params).indexOf('Object') !== -1) {
                        Objects.extend(this._params, params);
                    }
                    this._events = channels(this.name);
                },

                on : function (eventName, handler) {
                    this._events.on(eventName, handler);
                },

                get : function (url, data) {
                    this._ajax(url, data, 'get');
                },

                post : function (url, data) {
                    this._ajax(url, data, 'post');
                },

                _ajax : function (url, data, method) {
                    var _this = this;
                    var defer = vow.defer();
                    var promise = defer.promise();

                    $.ajax({
                        dataType : 'jsonp',
                        url : url,
                        data : data,
                        method : method,
                        beforeSend : function () {
                            _this._events.emit('loading');
                        }
                    })
                        .done(function (data) {
                            if(data.error) {
                                return defer.reject(data.error);
                            }
                            defer.resolve(data);
                        })
                        .fail(function (reason) {
                            defer.reject(reason);
                        })
                        .always(function () {
                            _this._events.emit('complete');
                        });

                    return promise;
                }
            })
        );
    }
);
