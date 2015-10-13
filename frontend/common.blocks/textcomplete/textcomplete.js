modules.define(
    'textcomplete',
    ['i-bem__dom', 'BEMHTML', 'jquery', 'emoji-icon__data', 'jquery__textcomplete'],
    function(provide, BEMDOM, BEMHTML, $, emojiData){

        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                js : {
                    inited : function(){
                        this._initTextCompletePlugin();
                    }
                }
            },

            /**
             * Инициализирует плагин автодополнения emoji-иконок
             *
             * @private
             */
            _initTextCompletePlugin : function(){
                var _this = this;
                this._textarea = this.findBlockInside('textarea');

                // Код из примера работы плагина
                this._textarea.domElem.textcomplete([{
                    match : /\B:([\-+\w]*)$/,
                    search : function(term, callback){
                        _this._textarea.setMod('emoji');
                        var results = [];
                        var results2 = [];
                        var results3 = [];
                        $.each(emojiData, function(shortname, data){
                            if(shortname.indexOf(term) > -1) {
                                results.push(shortname);
                            } else {
                                if((data.aliases !== null) && (data.aliases.indexOf(term) > -1)) {
                                    results2.push(shortname);
                                }
                                else if((data.keywords !== null) && (data.keywords.indexOf(term) > -1)) {
                                    results3.push(shortname);
                                }
                            }
                        });

                        if(term.length >= 3) {
                            results.sort(function(a, b){
                                return (a.length > b.length);
                            });
                            results2.sort(function(a, b){
                                return (a.length > b.length);
                            });
                            results3.sort();
                        }
                        var newResults = results.concat(results2).concat(results3);
                        callback(newResults);
                    },

                    template : function(shortname){
                        return BEMHTML.apply([
                            {
                                block : 'emoji-icon',
                                cls : 'emojione',
                                icon : emojiData[shortname].unicode,
                                shortname : shortname
                            },
                            ':' + shortname + ':'
                        ]);
                    },

                    replace : function(shortname){
                        return ':' + shortname + ': ';
                    },

                    index : 1,

                    maxCount : 10
                }]).on({

                    'textComplete:hide' : function(){
                        _this._textarea.delMod('emoji');
                    }
                });
            }
        }));
    });
