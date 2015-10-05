modules.define('message', ['i-bem__dom', 'BEMHTML'], function(provide, BEMDOM, BEMHTML){
    provide(BEMDOM.decl(this.name, {}, {
            render : function(user, message){
                var date = new Date(Math.round(message.ts) * 1000);
                var username = user ? (user.real_name || user.name) : 'Бот какой-то';

                var _getSimpleDate = function(date){
                    var hours = ('0' + date.getHours()).slice(-2);
                    var minutes = ('0' + date.getMinutes()).slice(-2);

                    return hours + ':' + minutes;
                };

                return BEMHTML.apply(
                    {
                        block : 'message',
                        mix : [{ block : 'dialog', elem : 'message' }],
                        content : [
                            {
                                block : 'avatar',
                                user : {
                                    name : username,
                                    image_48 : user.profile.image_32
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
                                content : message.text
                            }
                        ]
                    }
                );
            }
        }
    ));
});
