var widths = [];

function init(){
    
    for(var i = 0; i <= arguments.length; i++) widths.push( arguments[i] );
    
}

function q() {
    
    var values = arguments;
	var ret;
	
	for(var i = 0; i < widths.length; i++){
	    
	    if( window.innerWidth <= widths[i] ) return values[i];
	    
	}
	
	return values[ values.length - 1 ];
	
}

function bind(){
    
    var args = arguments;
    
    return function(){
        
        return q.apply(null, args);
        
    }
    
}

module.exports = {
    
    init: init,
    q: q,
    bind: bind
    
}