var vow = require('vow');
var marked  = require('marked');


marked.setOptions({
    renderer: new marked.Renderer(),
    sanitize: true
});

module.exports = function(messageText){
    return new vow.Promise(function(resolve){
        if(!messageText.length) {
            resolve(messageText);
        }

        var resultStr = marked(messageText);
        resolve(resultStr);
    });
};
