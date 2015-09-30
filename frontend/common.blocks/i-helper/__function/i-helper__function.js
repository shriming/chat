/**
 * @module i-helper__function
 * @description Набор вспомогательных методов для работы с функциями
 */

modules.define('i-helper__function', function(provide){
    provide(/** @exports **/{
        /**
         * Creates a function that is restricted to invoking {@code func} once.
         * Взял из исходников lodash :).
         *
         * @param func The function to restrict.
         * @returns {Function} Returns the new restricted function.
         */
        once: function(func){
            var ran = false;
            var memo;
            return function(){
                if (ran) return memo;
                ran = true;
                memo = func.apply(this, arguments);
                func = null;
                return memo;
            };
        }
    });
});
