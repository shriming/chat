modules.define('scrollbox', ['i-bem__dom'], function(provide, BEMDOM){
    provide(BEMDOM.decl(this.name, {
        onSetMod : {
            js : {
                inited : function(){
                    function getScrollbarWidth(){
                       var outer = document.createElement('div');

                       outer.style.visibility = 'hidden';
                       outer.style.width = '100px';

                       document.body.appendChild(outer);

                       var widthNoScroll = outer.offsetWidth;
                       outer.style.overflow = 'scroll';
                       var inner = document.createElement('div');
                       inner.style.width = '100%';
                       outer.appendChild(inner);
                       var widthWithScroll = inner.offsetWidth;
                       outer.parentNode.removeChild(outer);
                       return widthNoScroll - widthWithScroll;
                    }

                    _ScrollbarWidth = getScrollbarWidth();

                    this._onScroll.apply(this.elem('tape')[0]);
                    this.elem('tape').on('scroll', this._onScroll);

                    window.addEventListener('resize', (
                        function(t){
                            return function(){
                                t._onScroll.apply(t.elem('tape')[0]);
                            };
                        })(this)
                    );
               }
           }
       },
       _onScroll : function(){
            scrollbox = this.arentElement;
            scrollbar = this.parentElement.getElementsByClassName('scrollbox__bar')[0];
            this.style.width = this.parentElement.offsetWidth + _ScrollbarWidth + 'px';
            this.style.overflowY = 'scroll';
            scrollbar.style.opacity = 1;

            btn = scrollbar.getElementsByTagName('span')[0];
            console.log(btn);
            scrollHeight = this.offsetHeight / this.scrollHeight * scrollbox.offsetHeight;
            scrollTop = this.scrollTop / (this.scrollHeight - this.offsetHeight) * (scrollbox.offsetHeight - scrollHeight);

            btn.style.top = scrollTop + 'px';
            btn.style.height = scrollHeight + 'px';
        }
    }));
});
