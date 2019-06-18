function SuperFace(options){
    
    this.$element = SuperFace.$model.clone();
    
    this.horizontal = options.horizontal;
    this.$content = options.content.clone();
    this.$element.append( this.$content );
    
    THREE.CSS3DObject.call(this, this.$element[0]);
    
}

SuperFace.prototype = Object.create( THREE.CSS3DObject.prototype );
SuperFace.prototype.constructor = THREE.CSS3DObject;

SuperFace.prototype.setSize = function( w, h ) {
    
    if( w !== undefined ) this.setWidth( w );
    if( h !== undefined ) this.setHeight( h );

}

SuperFace.prototype.setWidth = function(w){
    
    //if(w === this.w) return;
    
    if(this.horizontal) w++;
    this.$element.width( w );
    this.w = w;
    
}

SuperFace.prototype.setHeight = function(h){
    
    //if(h === this.h) return;
    
    if(!this.horizontal) h++;
    this.$element.height( h );
    this.h = h;

}

SuperFace.prototype.scroll = function(to){
    
    if( to === this.scrollTop ) return;
    	
    if(this.horizontal){
        this.$content.translate( -to, 0 );
        //this.$content[0].style.transform = 'translate3d(' + Math.round(-this.scrollTop) + 'px, 0, 0)';
        //this.$content.css('transform', 'translate3d(' + (-to + 'px') + ', 0, 0)');
	} else {
	    this.$content.translate( 0, -to );
	    //this.$content[0].style.transform = 'translate3d(0, ' + Math.round(-this.scrollTop) + 'px, 0)';
	    //this.$content.css('transform', 'translate3d(0, ' + (-to + 'px') + ', 0)');
	}
	
	this.scrollTop = to;
	
}

SuperFace.$model = $('<div class="super-face"></div>');

module.exports = SuperFace;