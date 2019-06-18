var renderer = require('./main.js');
var SuperFace = require('./superFace.js');
var utils = require('./utils.js');
var scroll = require('./scroll.js');
var margin = require('../metrics.js').menuMargin;

function Room(options){
    
    this.horizontal = options.horizontal;
    this.fov = options.fov;
    this.content = options.content;
    
    var faceOptions = {
        horizontal: this.horizontal,
        content: this.content
    }
    
    this.wall1 = new SuperFace( faceOptions );
    this.wall2 = new SuperFace( faceOptions );
    
    if(this.horizontal){
        
        this.wall1.rotation.y = Math.PI / 2;
        this.wall2.rotation.y = -Math.PI / 2;

    } else {
        
        this.wall1.rotation.x = Math.PI / 2;
        this.wall2.rotation.x = -Math.PI / 2;

    }
    
    this.depth = 0;
    this.size = 0;
    
    var self = this;
    
    this.content.find('img').each(function(i){
        this.onload = function(){
            self.setScrollSize();
        };
    })
    
}

Room.prototype.init = function( element ){
    
    renderer.setFOV( this.fov );
    renderer.scene.add( this.wall1, this.wall2 );
    element.append( this.content );
    element.appendTo( 'body' );
    this.layout();
    this.scroll( 0 );
    
}

    
Room.prototype.layout = function(){
    
    this.setScrollSize();
        
    var m = margin();
    
    var size = renderer.getSize();
    
    var w = size.width - m * 2;
    var h = size.height - m * 2;
    
    var far = utils.perfectZ( this.fov );
    var fovX = utils.fovX( this.fov );
    
    var depth = Math.max(
        m / Math.tan( THREE.Math.degToRad( this.fov / 2) ),
        m / Math.tan( THREE.Math.degToRad( fovX / 2) )
    );
    
    var cz = far + depth/2;
    
    this.wall1.position.z = cz;
    this.wall2.position.z = cz;
    
    if ( this.horizontal ) {
        
        this.wall1.position.x = -w/2;
        this.wall1.setSize( depth, h );
        
        this.wall2.position.x = w/2;
        this.wall2.setSize( depth, h );
        
    } else {
        
        this.wall1.position.y = h/2;
        this.wall1.setSize( w, depth );
        
        this.wall2.position.y = -h/2;
        this.wall2.setSize( w, depth );
        
    }
    
    this.depth = depth;
    this.size = this.horizontal ? w : h;
    
    renderer.render();
     
}

Room.prototype.setScrollSize = function(){
    
    if( this.horizontal ){
        
        scroll.setX( this.content.width() );
        
    } else {
        
        scroll.setY( this.content.height() + this.depth * 2 );
        
    }
    
    renderer.resize();
    
}
    
Room.prototype.scroll = function(s){
        
    if(s === undefined){
        s = this.wall1.scrollTop;
    } else {
        s -= this.depth;
    }
    
    this.wall1.scroll( s );
    
    if(this.horizontal){
        
        this.content.translate( -s - this.depth, 0 );
        
    } else {
        
        this.content.translate( 0, -s - this.depth );
    }
    
    this.wall2.scroll( s + this.depth + this.size );
    
}

Room.prototype.remove = function(){
    
    renderer.scene.remove( this.wall1, this.wall2 );
    
    this.content.parent().detach();
    this.content.detach();
    
}

module.exports = Room;