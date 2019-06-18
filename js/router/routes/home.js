var navigation = require('../../navigation.js');

var Showcase = require('../../renderer/showcase.js');
var events = require('../events.js');

var fov = 60;

module.exports = function(ctx, next){
    
    var showcase = new Showcase({
        logo: ctx.template.filter('.home-logo'),
        imgs: ctx.template.filter('.home-img'),
        fov: fov
    });
    
    showcase.logo.$element.addClass('fade-out');
    showcase.imgs.forEach(function(){
        this.$element.addClass('fade-out');
    })
    
    showcase.init();
    
    setTimeout(function(){
        showcase.logo.$element.removeClass('fade-out');
        showcase.imgs.forEach(function(){
            this.$element.removeClass('fade-out');
        })
    });
    
    showcase.logo.$element.addClass('fade-out');
    showcase.imgs.forEach(function(){
        this.$element.addClass('fade-out');
    })
    
    navigation.hide();
    
    events.on({
        
        resize: showcase.layout.bind(showcase),
        
        mousemove: function(e){
            
            showcase.setMouse(e.clientX, e.clientY);
            
        },
        
        transitionOut: function(){
            
            showcase.imgs.forEach(function(){
                this.$element.addClass('fade-out');
            })
            
            showcase.logo.$element.addClass('fade-out');
            
            return 1000;
            
        },
        
        remove: showcase.remove.bind(showcase)
        
    })
    
    next();
    
}