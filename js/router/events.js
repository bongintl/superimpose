var handlers = {};

function on(evts){
    
    for ( var name in evts ) {
        
        if( !handlers[ name ] ) handlers[ name ] = [];
        
        handlers[ name ].push( evts[ name ] );
        
    }
    
}

function off(){
    
    handlers = {};
    
}

function trigger(evt){
    
    var fns = handlers[evt];
    
    if( !fns ) return;
    
    var args = [];
    
    for(var i = 1; i < arguments.length; i++) args.push( arguments[i] );
    
    var ret, result;
    
    for ( var i = 0; i < fns.length; i++ ) {
        
        ret = fns[i].apply(null, args);
        
        if( result !== ret ) result = ret;
        
    }
    
    return result;
    
}

$(window)
    .on( 'scroll', trigger.bind( null, 'scroll' ) )
    .on( 'resize', trigger.bind( null, 'resize' ) )
    .on( 'mousemove', trigger.bind( null, 'mousemove' ) )

module.exports = {
    on: on,
    off: off,
    trigger: trigger
}