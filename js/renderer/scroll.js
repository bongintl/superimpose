var sizer = $('<div class="sizer">')
var body = $('body');

body.append( sizer );

var horizontal = false;

document.body.addEventListener('mousewheel', function(e){
    
    if ( horizontal ) {
        
        e.preventDefault();
        
        window.scrollBy( e.deltaY + e.deltaX, 0 );
        
    }
    
})

module.exports = {
    setX: function(x){
        horizontal = true;
        sizer.css({
            width: x,
            height: '100%'
        })
        body.css({
            overflowX: 'scroll',
            overflowY: 'hidden'
        })
    },
    setY: function(y){
        horizontal = false;
        sizer.css({
            height: y,
            width: '100%'
        })
        body.css({
            overflowY: 'scroll',
            overflowX: 'hidden'
        })
        
    },
    none: function(){
        horizontal = false;
        sizer.css({
            height: '100%',
            width: '100%'
        })
        body.css({
            overflowX: 'hidden',
            overflowY: 'hidden'
        })
    }
}