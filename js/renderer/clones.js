function Clones(){
    
    this.clones = [];
    
    for( var i = 0; i < arguments.length; i++ )
        this.clones.push( arguments[i] );
    
}

Clones.prototype.sort = function(clones){
    
    var clones = clones || this.clones;
    var collections = [];
    
    for( var i = 0; i < clones.length; i++ ){
        
        var $elements = clones[i];
        
        $elements.each(function(j){
            
            if( !collections[j] ) collections[j] = [];
            
            collections[j].push( $(this) );
            
        })
        
    }
    
    this.collections = collections;
    this.length = collections.length;
    
    return this;

};

['find', 'filter'].forEach( function( fnName ) {
    
    Clones.prototype[fnName] = function( selector ){
        
        var elements = this.clones.map(function(clone){
            return clone[fnName](selector);
        })
        
        return this.sort( elements );
        
    }
    
});

['forEach', 'map'].forEach(function(fnName){
    
    Clones.prototype[fnName] = function(fn){
            
        var collections = this.collections[fnName](function(collection, i){
            
            return collection[fnName](function( $element, j ){
                
                return fn.call( $element, i, j );
                
            })
            
        })
        
        if(fnName === 'map') this.collections = collections;
        
        return this;
        
    }
    
})


module.exports = Clones;