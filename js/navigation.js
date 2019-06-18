var $nav = $('.nav_full, .nav_small');
var $full = $nav.filter('.nav_full');
var $small = $nav.filter('.nav_small');
var $dropdowns = $full.find('.dropdown');

var isHidden = false;

module.exports = {
    
    init: function(){
        
        $(function(){
        
            $small.children().on('click', function(){
                $small.toggleClass('open');
            })
            
            $dropdowns.each( function(){
                
                var $this = $(this);
                
                var $menu = $this.find('.dropdown__menu');
                
                $this.on('mouseenter', function(){
                    $menu.addClass('open');
                }).on('mouseleave', function(){
                    $menu.removeClass('open');
                })
                
            })
            
            // $('.social-toggle').on('mouseenter', function(){
            //     $socialMenu.addClass('open');
            // }).on('mouseleave', function(){
            //     $socialMenu.removeClass('open');
            // })
            
        })
        
    },
    
    show: function(){
        if(!isHidden) return;
        $nav.removeClass('nav_hidden');
        isHidden = false;
    },
    
    hide: function(){
        if(isHidden) return;
        $nav.addClass('nav_hidden');
        isHidden = true;
    },
    
    elements: {
        $full: $full,
        $small: $small,
        $both: $nav
    }
    
}