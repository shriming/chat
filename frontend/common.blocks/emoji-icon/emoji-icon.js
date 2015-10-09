modules.define(
    'emoji-icon',
    ['i-bem__dom', 'emoji-lib_type_twemoji'],
    function(provide, BEMDOM, twemoji){

        provide(BEMDOM.decl(this.name, {
            onSetMod : {
                js : {
                    inited : function(){

                        var test = twemoji.parse('\u2764\uFE0F ', function(icon, options, variant){
                            console.log(arguments);
                            return options.base + '/' + options.size + '/' + icon + options.ext;
                        });

                        console.log(test);
                    }
                }
            }
        }));
    }
);
