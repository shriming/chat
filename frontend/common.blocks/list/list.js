modules.define('list', ['i-bem__dom', 'BEMHTML', 'api'], function(provide, BEMDOM, BEMHTML, api){
    var LISTS = {
        users: 'members',
        channels: 'channels',
        groups: 'groups'
    };

    BEMDOM.decl(this.name, {
        onSetMod : {
            'js' : {
                'inited' : function(){
                    var type = this.getMod('type');

                    this._getListData(type);
                }
            }
        },

        _getListData : function(type){
            var container = this.elem('container');

            api.get(type + '.list', {}).then(function(data){
                var items = data[LISTS[type]];

                items.forEach(function(item){
                    BEMDOM.append(container,
                        BEMHTML.apply({
                            block : 'list',
                            elem : 'item',
                            mods : { type: type },
                            content: item.name
                        })
                    );
                });
            });
        }
    });

    provide(BEMDOM);
});
