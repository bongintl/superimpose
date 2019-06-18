var config = require('../config.js');
var navigation = require('../../navigation.js');

var Room = require('../../renderer/room.js');
var Clones = require('../../renderer/clones.js');
var events = require('../events.js');

var fov = 60;

module.exports = function(ctx, next){
    
    var $main = ctx.template.filter('.main');
    
    ctx.template.find('.thumbnail-column').addClass('fade-out');
    
    var horizontal = ctx.template.hasClass('horizontal');
    
    var room = new Room({
        content: ctx.template,
        horizontal: horizontal,
        fov: fov
    });
    
    room.init( config.$element );
    
    $main.loadImages();
    room.wall1.$content.loadImages();
    room.wall2.$content.loadImages();
    
    navigation.show();
    
    var columns = new Clones( ctx.template, room.wall1.$content, room.wall2.$content ).find('.thumbnail-column');
    
    columns.forEach(function(i){
        
        var element = this;
        
        setTimeout(function(){
            element.removeClass('fade-out');
        }, i * 200)
        
    });
    
    events.on({
        
        resize: _.debounce(function(){
            room.layout();
            room.scroll();
        }, 100),
        
        scroll: function(){
            room.scroll( horizontal ? pageXOffset : pageYOffset );
        },
        
        transitionOut: function(){
            
            columns.forEach(function(i){
                
                var element = this;
                
                setTimeout(function(){
                    element.addClass('fade-out');
                }, i * 200)
                
            })
            
            return columns.length * 200 + 200;
            
        },

        remove: room.remove.bind(room)
        
    })
    
    next();
    
}