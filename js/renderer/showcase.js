var renderer = require('./main.js');
var utils = require('./utils.js');
var scroll = require('./scroll.js');
var rAF = require('./rAF.js');

var SuperSingleton = require('./superSingleton.js');
var ResizableCSS3DObject = require("./resizableCSS3DObject.js");
var Clones = require('./clones.js');

var sides = ['top', 'left', 'bottom', 'right'];

function Showcase(options){
    
	var $projectTitleText = options.logo.find('.home-logo__project-title');
	var $clientText = options.logo.find('.home-logo__client');
    
    this.fov = options.fov;
    
    var $logo = options.logo;
    this.logo = new ResizableCSS3DObject( $logo );
    
    this.imgs = new Clones( options.imgs, options.imgs.clone(), options.imgs.clone(), options.imgs.clone() )
        .sort()
        .map(function( imgIndex, sideIndex ){
        
            var $img = this;
            
            var title = $img.data('title')
            var client = $img.data('client');
            
            if( title ) {
            
                $img.mouseenter(function(){
                    
            		$logo.addClass('home-logo_show-project-title')
        			$projectTitleText.text( title );
        			$clientText.text( client );
                    
                }).mouseleave(function(){
                    
                    $logo.removeClass('home-logo_show-project-title');
                    
                })
            
            }
            
            var img3d = new SuperSingleton({
                $element: $img,
                axis: sideIndex % 2 === 0 ? 'x' : 'y'
            });
            
            switch( sides[sideIndex] ) {
                
                case 'top':
                    img3d.rotation.x = Math.PI / 2;
                    img3d.rotation.z = Math.PI / 2;
                    break;
                    
                case 'left':
                    img3d.rotation.y = Math.PI / 2;
                    img3d.rotation.x = Math.PI;
                    break;
                    
                case 'bottom':
                    img3d.rotation.x = -Math.PI / 2;
                    img3d.rotation.z = -Math.PI / 2;
                    break;
                    
                case 'right':
                    img3d.rotation.y = -Math.PI / 2;
                    break;
                
            }
            
            return img3d;
            
        });
    
    this.imgs.collections.forEach(function(imgClones, i, list){
        
        var x = Math.random();
        var y = i / list.length;
        
        imgClones.forEach(function(img){
            
            img.contentOffset = {
                x: x,
                y: y
            }
            
        });
        
    });
    
    this.prevMouse = new THREE.Vector2();
    this.mouse = new THREE.Vector2();
    this.slowedMouse = new THREE.Vector2();
    
}

Showcase.prototype.init = function(){
    
    renderer.scene.add( this.logo );
    
    scroll.none();
    
    this.startTime = Date.now();
    
    this.layout();
    
    rAF.start( this.tick.bind(this) );
    
}

Showcase.prototype.layout = function(){
    
    var w = window.innerWidth;
    var h = window.innerHeight;
    
    var near = utils.perfectZ( this.fov );
    var depth = Math.min(w, h);
    
    var far = near - depth;
    
    this.logo.resize(w, h);
    this.logo.position.z = far;
    
    var halfW = w/2;
    var halfH = h/2;
    var cz = (near + far) / 2;
    
    var perimiter = h*2 + w*2;
    
    var maxImageHeight = Math.min(h, w) / 2;
    
    this.imgs.forEach(function(imgIndex, sideIndex){
        
        var img = this;
        
        var imgW, imgH;
        
        if ( img.nativeHeight > maxImageHeight ) {
           
           imgW = (maxImageHeight / img.nativeHeight) * img.nativeWidth;
           imgH = maxImageHeight;
            
        } else {
            
            imgW = img.nativeWidth;
            imgH = img.nativeHeight;
            
        }
        
        img.resize( imgW, imgH );
        
        img.getZ( near, far );
        img.setContentSize( depth, perimiter );
        
        var depthOffset = imgIndex / 20;
        
        switch( sides[ sideIndex ] ) {
            
            case 'top':
                img.position.y = halfH - depthOffset;
                img.setAxisLimits( halfW, -halfW );
                img.scrollOffset = 0;
                img.scrollHeight = w;
                break;
                
            case 'left':
                img.position.x = -halfW + depthOffset;
                img.setAxisLimits( halfH, -halfH );
                img.scrollOffset = w;
                img.scrollHeight = h;
                break;
                
            case 'bottom':
                img.position.y = -halfH + depthOffset;
                img.setAxisLimits( -halfW, halfW );
                img.scrollOffset = w + h;
                img.scrollHeight = w;
                break;
                
            case 'right':
                img.position.x = halfW - depthOffset;
                img.setAxisLimits( -halfH, halfH );
                img.scrollOffset = w + h + w;
                img.scrollHeight = h;
                break;
                
            
        }
        
        img.setScroll(0, renderer.scene);
        
    });
    
}

Showcase.prototype.setMouse = function(x, y){
    this.mouse.x = x - window.innerWidth / 2;
    this.mouse.y = -(y - window.innerHeight / 2);
}

Showcase.prototype.remove = function(){
    
    rAF.stop();
    
    renderer.scene.remove(this.logo);
    
    this.imgs.forEach(function(){
        this.detach( renderer.scene );
    })
    
}

Showcase.prototype.tick = function(now){
    
    var showcase = this;
    
    var elapsed = now - this.startTime;
    
    this.slowedMouse.x = this.prevMouse.x + ( this.mouse.x - this.prevMouse.x ) * 0.1;
    this.slowedMouse.y = this.prevMouse.y + ( this.mouse.y - this.prevMouse.y ) * 0.1;
    
    var perimiter = window.innerHeight * 2 + window.innerWidth * 2;
    
    var scrollTop = (elapsed / 10) % perimiter;
    
    this.imgs.forEach(function(){
        this.setScroll( scrollTop, renderer.scene );
        this.setOpacity( showcase.slowedMouse );
    })
    
    renderer.render();
    
    this.prevMouse.copy( this.slowedMouse );
    
}

module.exports = Showcase;