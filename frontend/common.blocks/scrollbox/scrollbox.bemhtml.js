block('scrollbox')(
  js()(true),
  content()(function(){
    return [
      {
        elem : 'tape',
        content : this.ctx.content
      }, {
        elem : 'bar',
        content : {
            tag : 'span'
        }
      }
    ];
  })
);
