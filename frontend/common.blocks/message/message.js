modules.define(
    'message',
    ['i-bem__dom', 'BEMHTML', 'i-users', 'jquery'],
    function(provide, BEMDOM, BEMHTML, Users, $){

        provide(BEMDOM.decl(this.name, {}, {
                render : function(user, message){
                    var date = new Date(Math.round(message.ts) * 1000);
                    var username = user ? (user.real_name || user.name) : 'Бот какой-то';
                    var text = this._parseSystemMessage(message.text);

                    var _getSimpleDate = function(date){
                        var hours = ('0' + date.getHours()).slice(-2);
                        var minutes = ('0' + date.getMinutes()).slice(-2);

                        return hours + ':' + minutes;
                    };

                    var unescapeHtml = function(safe){
                        return $('<div />').html(safe).text();
                    };

                    var textBefore = text;
                    var needFormating = false;

                    text = unescapeHtml(text);
                    if(textBefore !== text) {
                        needFormating = true;
                    }

                    return BEMHTML.apply(
                        {
                            block : 'message',
                            mix : [{ block : 'dialog', elem : 'message' }],
                            js : !needFormating ? false : {
                                content : text
                            },
                            content : [
                                {
                                    block : 'avatar',
                                    user : {
                                        name : username,
                                        image_48 : user.profile.image_48
                                    },
                                    mods : { size : 'm' },
                                    mix : { block : 'message', elem : 'avatar' }
                                },
                                {
                                    elem : 'username',
                                    content : username
                                },
                                {
                                    elem : 'time',
                                    content : _getSimpleDate(date)
                                },
                                {
                                    elem : 'content',
                                    content : text
                                }
                            ]
                        }
                    );
                },

                _parseSystemMessage : function(message){
                    var regexp = {
                        system : /<@(.*)\|(.*)>/g,
                        pm : /<@(.*)>/g
                    };

                    var matchSystem = regexp.system.exec(message);
                    var matchPm = regexp.pm.exec(message);

                    if(matchSystem) {
                        message = '@' + matchSystem[2] + message.replace(regexp.system, '');
                    } else if(matchPm) {
                        message = '@' + Users.getUser(matchPm[1]).name + message.replace(regexp.pm, '');
                    }

                    return message;
                }
            }
        ));
    });
