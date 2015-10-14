var vow = require('vow');
var marked = require('marked');

var renderer = new marked.Renderer();
renderer.link = function(href){
    return href;
};

renderer.image = function(href){
    return href;
};

marked.setOptions({
    renderer : renderer,
    sanitize : true,
    highlight : function(code){
        return require('highlight.js').highlightAuto(code).value;
    }
});

module.exports = function(messageText){
    return new vow.Promise(function(resolve){
        if(!messageText.length) {
            resolve(messageText);
        }

        marked(messageText, function(err, content){
            if(err) {
                console.error('Markdown error!');
                resolve(messageText);
            }

            resolve(content);
        });
    });
};
