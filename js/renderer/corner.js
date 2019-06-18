var renderer = require('./main.js');
var SuperFace = require('./superFace.js');
var utils = require('./utils.js');
var scroll = require('./scroll.js');

function Corner(options){
    
    this.wall1 = new SuperFace({
        horizontal: true,
        content: options.content
    });
    
    this.wall2 = new SuperFace({
        horizontal: true,
        content: options.content
    });
    
    this.$inner1 = this.wall1.$content.find('.info-inner');
    this.$inner2 = this.wall2.$content.find('.info-inner');
    
    this.fov = options.fov;
    this.mouseX = 0.5;
    
}

Corner.prototype.init = function(){
    
    scroll.none();
    
    renderer.scene.add( this.wall1, this.wall2 );
    
    this.layout();
    
}

Corner.prototype.layout = function( isMouse ){
    
    var w = window.innerWidth;
    var h = window.innerHeight;
    
    var halfWidth = w/2;
    
    var near = -utils.perfectZ( this.fov );
    
    var depth = w * .25;
    var far = near + depth;
    var cz = -near - depth/2;
    
    var lefWallRatio = this.mouseX;
    var rightWallRatio = 1 - lefWallRatio;
    
    var leftWallScreenWidth = lefWallRatio * w;
    var rightWallScreenWidth = rightWallRatio  * w;
    
    var depthSquared = Math.pow(depth, 2);
    
    var leftWallWidth = Math.sqrt( depthSquared + Math.pow(leftWallScreenWidth, 2) );
    var rightWallWidth = Math.sqrt( depthSquared + Math.pow(rightWallScreenWidth, 2) );
    
    this.wall1.setSize( leftWallWidth, h );
    this.wall1.position.x = -halfWidth + leftWallScreenWidth / 2;
    this.wall1.position.z = cz;
    this.wall1.rotation.y = Math.atan2(-depth, leftWallScreenWidth);
    
    this.wall2.setSize( rightWallWidth, h );
    this.wall2.position.x = halfWidth - rightWallScreenWidth / 2;
    this.wall2.position.z = cz;
    this.wall2.rotation.y = Math.atan2(depth, rightWallScreenWidth);
    
    if(!isMouse) {
        this.wall1.setHeight( h );
        this.wall2.setHeight( h );
    }
    
    var totalWallWidth = leftWallWidth + rightWallWidth;
    
    this.wall1.$content.width( totalWallWidth );
    this.wall2.$content.width( totalWallWidth );
    
    var flatAngle = Math.atan2(far, w/2);
    var margin = depth / Math.sin(flatAngle);
    var maxWallWidth = Math.sqrt( Math.pow(w/2, 2) + depthSquared ) * 2;
    var innerWidth = maxWallWidth - margin * 2;
    
    this.$inner1.width( innerWidth );
    this.$inner2.width( innerWidth );
    
    this.wall1.scroll( 0 );
    this.wall2.scroll( leftWallWidth );
    
    renderer.render();
    
}

Corner.prototype.setMouse = function(x){
    
    this.mouseX = x / window.innerWidth;
    
    this.layout( true );
    
}

Corner.prototype.remove = function(){
    
    renderer.scene.remove( this.wall1, this.wall2 );
    
}

module.exports = Corner;