var navigation = require('../../navigation.js');

var Corner = require('../../renderer/corner.js');
var events = require('../events.js');

var fov = 60;

module.exports = function(ctx, next){
    
    var corner = new Corner({
        content: ctx.template,
        fov: fov
    })
    
    corner.wall1.$content.addClass('fade-out');
    corner.wall2.$content.addClass('fade-out');
    
    corner.init();
    
    setTimeout(function(){
        corner.wall1.$content.removeClass('fade-out');
        corner.wall2.$content.removeClass('fade-out');
    });
    
    navigation.show();
    
    events.on({
        
        resize: corner.layout.bind(corner),
        
        mousemove: function(e){
            corner.setMouse(e.clientX);
        },
        
        transitionOut: function(){
            
            corner.wall1.$content.addClass('fade-out');
            corner.wall2.$content.addClass('fade-out');
            
            return 200;
            
        },
        
        remove: corner.remove.bind(corner)
        
    });
    
    next();
    
}