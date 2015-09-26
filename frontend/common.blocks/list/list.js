modules.define(
    'list',
    ['i-bem__dom', 'BEMHTML', 'jquery', 'api'],
    function(provide, BEMDOM, BEMHTML, $, api){
        var LISTS = {
            users: 'members',
            channels: 'channels',
            groups: 'groups'
        };

        provide(BEMDOM.decl('list', {
            onSetMod : {
                'js' : {
                    'inited' : function(){
                        var type = this.getMod('type');

                        this._getListData(type);
                    }
                }
            },

            onElemSetMod : {
                'item' : {
                    'current' : {
                        'true' : function(elem){
                            this.delMod(this._current, 'current');
                            this._current = elem;
                        }
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
                                mods : { type : type },
                                content : item.name,
                                js : {
                                    id: item.id,
                                    name: item.name
                                }
                            })
                        );
                    });
                });
            },

            _onItemClick : function(e){
                var item = $(e.currentTarget);
                var type = this.getMod(item, 'type');

                this.setMod(item, 'current', true);
                this.emit('click-' + type, this.elemParams(item));
            }
        }, {
            live : function(){
                this.liveBindTo('item', 'click', function(e){
                    this._onItemClick(e);
                });

                return false;
            }
        }));
    }
);
