require('./renderer/zepto.plugins.js');

var metrics = require('./metrics.js');
var nav = require('./navigation.js');

var $document = $(document);
var $body = $('body');

module.exports = function(){
    
    $(function(){
        
        $('.video-container').loadVideo();
        
        var $rspImgs = $('.rsp-img');
        var $autoHeights = $('.auto-height');
        
        function onResize(){
            $rspImgs.loadImages();
            $autoHeights.height( window.innerHeight - metrics.baseMargin - metrics.menuMargin() );
        }
        
        $(window).on('resize', onResize);
        onResize();
        
        if( $body.hasClass('page-home') ) {
            
            var Showcase = require('./renderer/showcase.js');
            
            var showcase = new Showcase({
                logo: $('.home-logo').detach(),
                imgs: $('.home-img').detach(),
                fov: 60
            })
            
            showcase.init();
            
        } else if( $body.hasClass('page-project') ) {
            
            var lastScroll = 0;
            
            function onScroll(){
                
                var st = $body.scrollTop();
                
                if( st <= 0 || st < lastScroll ){
                    nav.show();
                } else {
                    nav.hide();
                }
                
                lastScroll = st;
                
            }
            
            $document.on('scroll', onScroll);
            onScroll();
            
        }
        
    })    
    
}

