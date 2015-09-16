modules.define('api', ['socket', 'inherit', 'events__channels', 'vow', 'objects', 'querystring'],
    function (provide, io, inherit, channels, vow, Objects, querystring) {
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
                /**
                 *
                 * @param params {Object}
                 * @param {string} params.airport - 'DME' or 'SVO'
                 * @param {string} employee.mode - 'dep' or 'arr'
                 * @returns {Promise}
                 */
                get : function (params) {

                    return vow.cast();
                },
                getParams : function () {
                    return this._params;
                }
            })
        );
    }
);
