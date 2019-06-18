var config = require('../config.js');
var navigation = require('../../navigation.js');

var Room = require('../../renderer/room.js');
var Clones = require('../../renderer/clones.js');
var events = require('../events.js');

var metrics = require('../../metrics.js');

var $body = $('body');

var fov = 60;

module.exports = function(ctx, next){
    
    var $main = ctx.template.filter('.main');
    
    $main.addClass('fade-out');
    
    var room = new Room({
        content: $main,
        horizontal: false,
        fov: fov
    });
    
    room.init( config.$element );
    
    $main.loadImages();
    room.wall1.$content.loadImages();
    room.wall2.$content.loadImages();
    
    var $titles = ctx.template.filter('ul');
    $titles.addClass('nav_hidden');
    $body.append( $titles );
    
    navigation.show();
    
    $main.find('.video-container').loadVideo();
    
    setTimeout(function(){
        $main.removeClass('fade-out');
        room.wall1.$content.removeClass('fade-out');
        room.wall2.$content.removeClass('fade-out');
        $titles.removeClass('nav_hidden')
    });
    
    var $autoHeights = new Clones( $main, room.wall1.$content, room.wall2.$content ).find('.auto-height');
    
    $autoHeights.forEach(function(){
        this.height( window.innerHeight - metrics.menuMargin() * 2 );
    })
    
    var lastScroll = 0;
    
    events.on({
        
        resize: _.debounce(function(){
            
            $autoHeights.forEach(function(){
                this.height( window.innerHeight - metrics.menuMargin() * 2 );
            })
            
            room.layout();
            room.scroll();
            
        }, 100),
        
        scroll: function(){
            
            var y = pageYOffset;
            
            if(y <= 0 || y < lastScroll){
                navigation.show();
            } else {
                navigation.hide();
            }
            
            room.scroll( y );
            
            lastScroll = y;
        },
        
        transitionOut: function(){
            
            $main.addClass('fade-out');
            room.wall1.$content.addClass('fade-out');
            room.wall2.$content.addClass('fade-out');
            $titles.addClass('nav_hidden');
            
            return 200;
            
        },

        remove: room.remove.bind(room)
        
    })
    
    next();
    
}