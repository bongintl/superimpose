(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
var firstLoad = {
    is: true,
    done: function(){
        $('body').removeClass('first-load');
        firstLoad.is = false;
    }
}

module.exports = firstLoad;
},{}],3:[function(require,module,exports){
var $buoop = {vs:{i:11,f:25,o:12.1,s:7},c:2}; 
function $buo_f(){ 
 var e = document.createElement("script"); 
 e.src = "//browser-update.org/update.min.js"; 
 document.body.appendChild(e);
};
try {document.addEventListener("DOMContentLoaded", $buo_f,false)}
catch(e){window.attachEvent("onload", $buo_f)}

},{}],4:[function(require,module,exports){
require('./breakpoint.js').init( 414, 768 );
require('./navigation.js').init();
require('./isIE.js');

var firstLoad = require('./firstLoad.js');
var metrics = require('./metrics.js');

if( $('body').hasClass('three-d') ){
    require('./router/main.js')();
} else {
    require('./static.js')();
}

firstLoad.done();
},{"./breakpoint.js":1,"./firstLoad.js":2,"./isIE.js":3,"./metrics.js":5,"./navigation.js":6,"./router/main.js":22,"./static.js":28}],5:[function(require,module,exports){
var breakpoint = require('./breakpoint.js');

module.exports = {
    
    baseMargin: 20,
    
    menuMargin: breakpoint.bind(14 * 3, 16 * 3, 18 * 3)
    
}
},{"./breakpoint.js":1}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
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
},{"./main.js":9,"./scroll.js":13,"./superFace.js":15,"./utils.js":18}],9:[function(require,module,exports){
require('./three.cssrenderer.js');
require('./zepto.plugins.js');

var renderer = new THREE.CSS3DRenderer();
renderer.domElement.id = 'renderer';
document.body.appendChild( renderer.domElement );

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);

scene.add(camera);

function setFOV(fov){
    
    camera.fov = fov;
    
    camera.updateProjectionMatrix();
    
}

function render(){
    
    renderer.render( scene, camera );
    
}

function resize(){
    
    var w = Math.min( window.innerWidth, document.documentElement.clientWidth );
    var h = Math.min( window.innerHeight, document.documentElement.clientHeight );
    
    renderer.setSize( w, h );
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    
}

$(window).on('resize', resize);
resize();

module.exports = {
    
    scene: scene,
    
    setFOV: setFOV,
    
    render: render,
    
    resize: resize,
    
    getSize: renderer.getSize
    
}
},{"./three.cssrenderer.js":17,"./zepto.plugins.js":19}],10:[function(require,module,exports){
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
	
var funcs = {};

var funcCount = 0;

var frame = false;

var then;

function tick(){
	
	frame = requestAnimationFrame(tick);
	
	var now = Date.now();
	var dT = now - then;
	
	for(var name in funcs){
		if( funcs[name](now, dT) === false ){
			stop(name);
		};
	}
	
	then = now;
	
}

function start(name, fn){
	
	if(!fn){
		fn = name;
		name = Math.random().toString();
	}
	
	if(funcs[name]) return false;
	
	funcs[name] = fn;
	
	funcCount++;
	
	if(!frame){
		then = Date.now();
		frame = requestAnimationFrame(tick);
	}
	
}

function stop(name){
	
	if(name){
		delete funcs[name];
		funcCount--;
	} else {
		funcs = {};
		funcCount = 0;
	}
	
	if( funcCount === 0 ){
		cancelAnimationFrame(frame);
		frame = false;
	}

	
}

module.exports =  {
	start: start,
	stop: stop
}
},{}],11:[function(require,module,exports){
function ResizableCSS3DObject($element){
    
    this.$element = $element;
    
    THREE.CSS3DObject.call(this, this.$element[0]);
    
}

ResizableCSS3DObject.prototype = Object.create( THREE.CSS3DObject.prototype );
ResizableCSS3DObject.prototype.constructor = THREE.CSS3DObject;

ResizableCSS3DObject.prototype.resize = function(w, h){
    this.w = w;
    this.h = h;
    this.halfHeight = this.h/2;
    this.$element.css({
        width: w,
        height: h
    })
}

module.exports = ResizableCSS3DObject;
},{}],12:[function(require,module,exports){
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
},{"../metrics.js":5,"./main.js":9,"./scroll.js":13,"./superFace.js":15,"./utils.js":18}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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
},{"./clones.js":7,"./main.js":9,"./rAF.js":10,"./resizableCSS3DObject.js":11,"./scroll.js":13,"./superSingleton.js":16,"./utils.js":18}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
var ResizableCSS3DObject = require('./resizableCSS3DObject.js');

function normalize(x, min, max){
	return (x-min) / (max-min);
}

function scale(x, oldMin, oldMax, newMin, newMax){
    if( !(oldMin === 0 && oldMax === 1) ){
        x = normalize(x, oldMin, oldMax);
    }
    return newMin + x * (newMax - newMin);
}

function SuperSingleton(options){
    
    _.extend(this, options);
    
    this.attached = false;
    this.cropped = false;
    
    this.nativeWidth = this.$element.data('width');
    this.nativeHeight = this.$element.data('height');
    
    ResizableCSS3DObject.call(this, this.$element);
    
}

SuperSingleton.prototype = Object.create( ResizableCSS3DObject.prototype );
SuperSingleton.prototype.constructor = ResizableCSS3DObject;

SuperSingleton.prototype.getZ = function(min, max){
    
    if(min < 0){
        min += this.w/2;
    } else {
        min -= this.w/2;
    }
    
    if(max <= 0){
        max += this.w / 2;
    } else {
        max -= this.w / 2;
    }
    
    this.position.z = scale(this.contentOffset.x, 0, 1, min - this.w/2, max + this.w/2);
}

SuperSingleton.prototype.setContentSize = function(w, h){
    var centerY = scale(this.contentOffset.y, 0, 1, this.h/2, h - this.h/2);
    this.bounds = {
        center: centerY,
        top: centerY - this.h/2,
        bottom: centerY + this.h/2
    };
    this.contentHeight = h;
}

SuperSingleton.prototype.setAxisLimits = function(min, max){
    
    var halfHeight = this.h/2;
    
    this.axisMin = min;
    this.axisMax = max;
    
    this.cropMin = min > 0 ? min - halfHeight + 1 : min + halfHeight - 1;
    this.cropMax = max > 0 ? max - halfHeight + 1 : max + halfHeight - 1;
}

SuperSingleton.prototype.attach = function(scene){
    if(this.attached) return;
    scene.add(this);
    this.attached = true;
}

SuperSingleton.prototype.detach = function(scene){
    if(!this.attached) return;
    scene.remove(this);
    this.attached = false;
}

SuperSingleton.prototype.crop = function(){
    
    var position = this.position[this.axis];
    
    var cropTop = 0
    var cropBottom = 0;
    
    if(this.cropMax > 0){
        if(position > this.cropMax) cropTop = position - this.cropMax;
    } else {
        if(position < this.cropMax) cropTop = this.cropMax - position;
    }
    
    if(this.cropMin > 0){
        if(position > this.cropMin) cropBottom = position - this.cropMin;
    } else {
        if(position < this.cropMin) cropBottom = this.cropMin - position;
    }
    
    var h = this.h - cropTop - cropBottom;
    
    if(cropTop){
        this.$element.css('height', h)
        this.position[this.axis] += this.cropMax > 0 ? -cropTop/2 : cropTop/2;
        if(this.cropped !== 'top'){
            this.$element.css('backgroundPosition', 'center bottom')
        }
        this.cropped = 'top';
    } else if(cropBottom){
        this.$element.css('height', h);
        this.position[this.axis] += this.cropMin < 0 ? cropBottom/2 : -cropBottom/2;
        if(this.cropped !== 'bottom'){
            this.$element.css('backgroundPosition', 'center top');
        }
        this.cropped = 'bottom';
    } else {
        if(this.cropped){
            this.$element.css({
                backgroundPosition: 'center center',
                height: this.h
            })
        }
        this.cropped = false;
    }
    
}

SuperSingleton.prototype.setScroll = function(top, scene){
    
    top += this.scrollOffset;
    var bottom = top + this.scrollHeight;

    if( top < this.bounds.bottom && bottom > this.bounds.top ){
        this.attach(scene);
        this.position[this.axis] = scale(this.bounds.center, top, bottom, this.axisMin, this.axisMax);
        this.crop();
    } else if (
        bottom > this.contentHeight &&
            ( top - this.contentHeight < this.bounds.bottom && bottom - this.contentHeight > this.bounds.top )
    ){
        this.attach(scene);
        this.position[this.axis] = scale(this.bounds.center, top - this.contentHeight, bottom - this.contentHeight, this.axisMin, this.axisMax);
        this.crop();
    } else {
        this.detach(scene);
    }
    
}

SuperSingleton.prototype.setOpacity = function(cursor){
    
    if(window.innerWidth <= 768) return;
    
    var distance = new THREE.Vector2(this.position.x, this.position.y).distanceTo(cursor);
    
    var min = window.innerWidth * .1;
    var max = window.innerWidth * 0.75;
    
    this.$element.css('opacity', scale(distance, min, max, 1, 0) );
    
}

module.exports = SuperSingleton;
},{"./resizableCSS3DObject.js":11}],17:[function(require,module,exports){
/**
 * Based on http://www.emagix.net/academic/mscs-project/item/camera-sync-with-css3-and-webgl-threejs
 * @author mrdoob / http://mrdoob.com/
 */

THREE.CSS3DObject = function ( element ) {

	THREE.Object3D.call( this );

	this.element = element;
	this.element.style.position = 'absolute';

	this.addEventListener( 'removed', function ( event ) {

		if ( this.element.parentNode !== null ) {

			this.element.parentNode.removeChild( this.element );

		}

	} );

};

THREE.CSS3DObject.prototype = Object.create( THREE.Object3D.prototype );
THREE.CSS3DObject.prototype.constructor = THREE.CSS3DObject;

THREE.CSS3DSprite = function ( element ) {

	THREE.CSS3DObject.call( this, element );

};

THREE.CSS3DSprite.prototype = Object.create( THREE.CSS3DObject.prototype );
THREE.CSS3DSprite.prototype.constructor = THREE.CSS3DSprite;

//

THREE.CSS3DRenderer = function () {

	console.log( 'THREE.CSS3DRenderer', THREE.REVISION );

	var _width, _height;
	var _widthHalf, _heightHalf;

	var matrix = new THREE.Matrix4();

	var cache = {
		camera: { fov: 0, style: '' },
		objects: {}
	};

	var domElement = document.createElement( 'div' );
	domElement.style.overflow = 'hidden';

	domElement.style.WebkitTransformStyle = 'preserve-3d';
	domElement.style.MozTransformStyle = 'preserve-3d';
	domElement.style.oTransformStyle = 'preserve-3d';
	domElement.style.transformStyle = 'preserve-3d';

	this.domElement = domElement;

	var cameraElement = document.createElement( 'div' );

	cameraElement.style.WebkitTransformStyle = 'preserve-3d';
	cameraElement.style.MozTransformStyle = 'preserve-3d';
	cameraElement.style.oTransformStyle = 'preserve-3d';
	cameraElement.style.transformStyle = 'preserve-3d';

	domElement.appendChild( cameraElement );

	this.setClearColor = function () {};

	this.getSize = function() {

		return {
			width: _width,
			height: _height
		};

	};

	this.setSize = function ( width, height ) {

		_width = width;
		_height = height;

		_widthHalf = _width / 2;
		_heightHalf = _height / 2;

		domElement.style.width = width + 'px';
		domElement.style.height = height + 'px';

		cameraElement.style.width = width + 'px';
		cameraElement.style.height = height + 'px';

	};

	var epsilon = function ( value ) {
		
		// adding the = fixes mobile safari
		
		return Math.abs( value ) <= Number.EPSILON ? 0 : value;

	};

	var getCameraCSSMatrix = function ( matrix ) {

		var elements = matrix.elements;

		return 'matrix3d(' +
			epsilon( elements[ 0 ] ) + ',' +
			epsilon( - elements[ 1 ] ) + ',' +
			epsilon( elements[ 2 ] ) + ',' +
			epsilon( elements[ 3 ] ) + ',' +
			epsilon( elements[ 4 ] ) + ',' +
			epsilon( - elements[ 5 ] ) + ',' +
			epsilon( elements[ 6 ] ) + ',' +
			epsilon( elements[ 7 ] ) + ',' +
			epsilon( elements[ 8 ] ) + ',' +
			epsilon( - elements[ 9 ] ) + ',' +
			epsilon( elements[ 10 ] ) + ',' +
			epsilon( elements[ 11 ] ) + ',' +
			epsilon( elements[ 12 ] ) + ',' +
			epsilon( - elements[ 13 ] ) + ',' +
			epsilon( elements[ 14 ] ) + ',' +
			epsilon( elements[ 15 ] ) +
		')';

	};

	var getObjectCSSMatrix = function ( matrix ) {

		var elements = matrix.elements;

		return 'translate3d(-50%,-50%,0) matrix3d(' +
			epsilon( elements[ 0 ] ) + ',' +
			epsilon( elements[ 1 ] ) + ',' +
			epsilon( elements[ 2 ] ) + ',' +
			epsilon( elements[ 3 ] ) + ',' +
			epsilon( - elements[ 4 ] ) + ',' +
			epsilon( - elements[ 5 ] ) + ',' +
			epsilon( - elements[ 6 ] ) + ',' +
			epsilon( - elements[ 7 ] ) + ',' +
			epsilon( elements[ 8 ] ) + ',' +
			epsilon( elements[ 9 ] ) + ',' +
			epsilon( elements[ 10 ] ) + ',' +
			epsilon( elements[ 11 ] ) + ',' +
			epsilon( elements[ 12 ] ) + ',' +
			epsilon( elements[ 13 ] ) + ',' +
			epsilon( elements[ 14 ] ) + ',' +
			epsilon( elements[ 15 ] ) +
		')';

	};

	var renderObject = function ( object, camera ) {

		if ( object instanceof THREE.CSS3DObject ) {

			var style;

			if ( object instanceof THREE.CSS3DSprite ) {

				// http://swiftcoder.wordpress.com/2008/11/25/constructing-a-billboard-matrix/

				matrix.copy( camera.matrixWorldInverse );
				matrix.transpose();
				matrix.copyPosition( object.matrixWorld );
				matrix.scale( object.scale );

				matrix.elements[ 3 ] = 0;
				matrix.elements[ 7 ] = 0;
				matrix.elements[ 11 ] = 0;
				matrix.elements[ 15 ] = 1;

				style = getObjectCSSMatrix( matrix );

			} else {

				style = getObjectCSSMatrix( object.matrixWorld );

			}

			var element = object.element;
			var cachedStyle = cache.objects[ object.id ];

			if ( cachedStyle === undefined || cachedStyle !== style ) {

				element.style.WebkitTransform = style;
				element.style.MozTransform = style;
				element.style.oTransform = style;
				element.style.transform = style;
				
				cache.objects[ object.id ] = style;

			}

			if ( element.parentNode !== cameraElement ) {

				cameraElement.appendChild( element );

			}

		}

		for ( var i = 0, l = object.children.length; i < l; i ++ ) {

			renderObject( object.children[ i ], camera );

		}

	};

	this.render = function ( scene, camera ) {

		var fov = 0.5 / Math.tan( THREE.Math.degToRad( camera.fov * 0.5 ) ) * _height;

		if ( cache.camera.fov !== fov ) {

			domElement.style.WebkitPerspective = fov + "px";
			domElement.style.MozPerspective = fov + "px";
			domElement.style.oPerspective = fov + "px";
			domElement.style.perspective = fov + "px";

			cache.camera.fov = fov;

		}

		scene.updateMatrixWorld();

		if ( camera.parent === null ) camera.updateMatrixWorld();

		camera.matrixWorldInverse.getInverse( camera.matrixWorld );

		var style = "translate3d(0,0," + fov + "px)" + getCameraCSSMatrix( camera.matrixWorldInverse ) +
			" translate3d(" + _widthHalf + "px," + _heightHalf + "px, 0)";

		if ( cache.camera.style !== style ) {

			cameraElement.style.WebkitTransform = style;
			cameraElement.style.MozTransform = style;
			cameraElement.style.oTransform = style;
			cameraElement.style.transform = style;

			cache.camera.style = style;

		}

		renderObject( scene, camera );

	};

};
},{}],18:[function(require,module,exports){
var renderer = require('./main.js');

module.exports = {
    
    perfectZ: function (fov){
        return -( renderer.getSize().height /2) / Math.tan( THREE.Math.degToRad( fov / 2 ) );
    },
    
    fovX: function (fovY){
        
        var size = renderer.getSize();
        
        var fovY_rad = THREE.Math.degToRad( fovY );
        var aspect = size.width / size.height;
        
        var fovX_rad = 2 * Math.atan( aspect * Math.tan( fovY_rad / 2) );
        
        return THREE.Math.radToDeg( fovX_rad );
        
    }
    
}
},{"./main.js":9}],19:[function(require,module,exports){
/*! modernizr 3.3.1 (Custom Build) | MIT *
 * https://modernizr.com/download/?-prefixed-setclasses !*/
!function(e,n,t){function r(e,n){return typeof e===n}function o(){var e,n,t,o,i,s,a;for(var f in g)if(g.hasOwnProperty(f)){if(e=[],n=g[f],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(o=r(n.fn,"function")?n.fn():n.fn,i=0;i<e.length;i++)s=e[i],a=s.split("."),1===a.length?Modernizr[a[0]]=o:(!Modernizr[a[0]]||Modernizr[a[0]]instanceof Boolean||(Modernizr[a[0]]=new Boolean(Modernizr[a[0]])),Modernizr[a[0]][a[1]]=o),y.push((o?"":"no-")+a.join("-"))}}function i(e){var n=_.className,t=Modernizr._config.classPrefix||"";if(w&&(n=n.baseVal),Modernizr._config.enableJSClass){var r=new RegExp("(^|\\s)"+t+"no-js(\\s|$)");n=n.replace(r,"$1"+t+"js$2")}Modernizr._config.enableClasses&&(n+=" "+t+e.join(" "+t),w?_.className.baseVal=n:_.className=n)}function s(e){return e.replace(/([a-z])-([a-z])/g,function(e,n,t){return n+t.toUpperCase()}).replace(/^-/,"")}function a(e,n){return!!~(""+e).indexOf(n)}function f(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):w?n.createElementNS.call(n,"http://www.w3.org/2000/svg",arguments[0]):n.createElement.apply(n,arguments)}function l(e,n){return function(){return e.apply(n,arguments)}}function u(e,n,t){var o;for(var i in e)if(e[i]in n)return t===!1?e[i]:(o=n[e[i]],r(o,"function")?l(o,t||n):o);return!1}function p(e){return e.replace(/([A-Z])/g,function(e,n){return"-"+n.toLowerCase()}).replace(/^ms-/,"-ms-")}function d(){var e=n.body;return e||(e=f(w?"svg":"body"),e.fake=!0),e}function c(e,t,r,o){var i,s,a,l,u="modernizr",p=f("div"),c=d();if(parseInt(r,10))for(;r--;)a=f("div"),a.id=o?o[r]:u+(r+1),p.appendChild(a);return i=f("style"),i.type="text/css",i.id="s"+u,(c.fake?c:p).appendChild(i),c.appendChild(p),i.styleSheet?i.styleSheet.cssText=e:i.appendChild(n.createTextNode(e)),p.id=u,c.fake&&(c.style.background="",c.style.overflow="hidden",l=_.style.overflow,_.style.overflow="hidden",_.appendChild(c)),s=t(p,e),c.fake?(c.parentNode.removeChild(c),_.style.overflow=l,_.offsetHeight):p.parentNode.removeChild(p),!!s}function m(n,r){var o=n.length;if("CSS"in e&&"supports"in e.CSS){for(;o--;)if(e.CSS.supports(p(n[o]),r))return!0;return!1}if("CSSSupportsRule"in e){for(var i=[];o--;)i.push("("+p(n[o])+":"+r+")");return i=i.join(" or "),c("@supports ("+i+") { #modernizr { position: absolute; } }",function(e){return"absolute"==getComputedStyle(e,null).position})}return t}function v(e,n,o,i){function l(){p&&(delete N.style,delete N.modElem)}if(i=r(i,"undefined")?!1:i,!r(o,"undefined")){var u=m(e,o);if(!r(u,"undefined"))return u}for(var p,d,c,v,h,y=["modernizr","tspan","samp"];!N.style&&y.length;)p=!0,N.modElem=f(y.shift()),N.style=N.modElem.style;for(c=e.length,d=0;c>d;d++)if(v=e[d],h=N.style[v],a(v,"-")&&(v=s(v)),N.style[v]!==t){if(i||r(o,"undefined"))return l(),"pfx"==n?v:!0;try{N.style[v]=o}catch(g){}if(N.style[v]!=h)return l(),"pfx"==n?v:!0}return l(),!1}function h(e,n,t,o,i){var s=e.charAt(0).toUpperCase()+e.slice(1),a=(e+" "+S.join(s+" ")+s).split(" ");return r(n,"string")||r(n,"undefined")?v(a,n,o,i):(a=(e+" "+E.join(s+" ")+s).split(" "),u(a,n,t))}var y=[],g=[],C={_version:"3.3.1",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){g.push({name:e,fn:n,options:t})},addAsyncTest:function(e){g.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=C,Modernizr=new Modernizr;var _=n.documentElement,w="svg"===_.nodeName.toLowerCase(),x="Moz O ms Webkit",S=C._config.usePrefixes?x.split(" "):[];C._cssomPrefixes=S;var b=function(n){var r,o=prefixes.length,i=e.CSSRule;if("undefined"==typeof i)return t;if(!n)return!1;if(n=n.replace(/^@/,""),r=n.replace(/-/g,"_").toUpperCase()+"_RULE",r in i)return"@"+n;for(var s=0;o>s;s++){var a=prefixes[s],f=a.toUpperCase()+"_"+r;if(f in i)return"@-"+a.toLowerCase()+"-"+n}return!1};C.atRule=b;var E=C._config.usePrefixes?x.toLowerCase().split(" "):[];C._domPrefixes=E;var z={elem:f("modernizr")};Modernizr._q.push(function(){delete z.elem});var N={style:z.elem.style};Modernizr._q.unshift(function(){delete N.style}),C.testAllProps=h;C.prefixed=function(e,n,t){return 0===e.indexOf("@")?b(e):(-1!=e.indexOf("-")&&(e=s(e)),n?h(e,n,t):h(e,"pfx"))};o(),i(y),delete C.addTest,delete C.addAsyncTest;for(var P=0;P<Modernizr._q.length;P++)Modernizr._q[P]();e.Modernizr=Modernizr}(window,document);

function videoUrlToEmbed(url){
	
	var vimeoRe = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
	var youtubeRe = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
	var match, id;
	
	if(url.indexOf('vimeo') > -1){
		match = url.match(vimeoRe);
		id = match[3];
		return 'https://player.vimeo.com/video/' + id;
	} else {
		match = url.match(youtubeRe);
		id = match[7];
		return "//www.youtube.com/embed/" + id + "?showinfo=0";
	}
	
}

var PREFIXED_TRANSFORM = Modernizr.prefixed('transform');

var $window = $(window);

$.fn.translate = function(x, y){
    
    this[0].style[PREFIXED_TRANSFORM] = 'translate(' + x + 'px, ' + y + 'px)';
    
}

var sizes = {
    small: 300,
    medium: 600,
    large: 1200,
    xlarge: 2000
}

var DPR = window.devicePixelRatio || 1;

$.fn.loadImages = function(){
    
    var el = this.hasClass('rsp-img') ? this : this.find('.rsp-img');
    
    el.each(function(){
        
        var $this = $(this);
        
        function go(){
            
            function setSrc(size){
                
                var src = $this.data('src-' + size);
                
                if( $this.is('img') ) {
                    $this.attr('src', src);
                } else {
                    $this.css('background-image', 'url(' + src + ')');
                }
                
            }
            
            var w = $this.width() * DPR;
            
            for(var size in sizes){
                
                if( w < sizes[size] ) {
                    setSrc( size );
                    return;
                }
                
            }
            
            setSrc('xlarge');
            
        }
        
        go();
        
        $window.on('resize', go);
        
        /*
        $window.on('routechange', function(){
            $window.off('resize', go);
        })
        */
        
    })
    
}

$.fn.loadVideo = function(){
    
    this.each(function(){
        var $this = $(this);
        var videoUrl = $this.data('video-url');
        var $iframe = $('<iframe>');
        $iframe.attr({
            src: videoUrlToEmbed(videoUrl),
            width: '100%',
            height: '100%'
        });
        $this.append( $iframe );
    })    
    
}
},{}],20:[function(require,module,exports){
module.exports = {
    
    element: 'main',
    
    routes: {
        '/': 'home',
        '/work': 'work',
        '/archive': 'work',
        '/about': 'about',
        '/project/:slug': 'project',
        '/post/:slug': 'post'
    }
    
}
},{}],21:[function(require,module,exports){
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
},{}],22:[function(require,module,exports){
var config = require('./config.js')
config.$element = $(config.element);

var common = require('./routes/common.js');
var home = require('./routes/home.js');
var info = require('./routes/info.js');
var work = require('./routes/work.js');
var project = require('./routes/project.js');

module.exports = function(){
    
    // if( !$('body').hasClass('holding') ) page.base('/index.php');
    page( '*', common.getTemplate, common.transitionOut, common.go );
    page( '/', home );
    page( '/home', home );
    page( '/about', info );
    page( '/team', work );
    page( '/work', work );
    page( '/project/:slug', project );
    page( '/archive', work );
    page( '/services-unknown', work );
    page( '/post/:slug', project );
    page();
    
};
},{"./config.js":20,"./routes/common.js":23,"./routes/home.js":24,"./routes/info.js":25,"./routes/project.js":26,"./routes/work.js":27}],23:[function(require,module,exports){
module.exports = {
    getTemplate: getTemplate,
    transitionOut: transitionOut,
    go: go
};

var config = require('../config.js')
var selector = config.element;
var routes = config.routes;
var $element = config.$element;
var $window = $(window);
var $loading = $('.loading');

var events = require('../events.js');

var $htmlBody = $('html, body');
var $body = $('body');

var firstLoad = require('../../firstLoad.js');

var templateCache = {};

function saveTemplate(html, ctx){
    
    var template = $(html).filter(selector).children();
    
    ctx.template = templateCache[ ctx.path ] = template;

}

 function getTemplate(ctx, next){
     
     $loading.addClass('on');
    
    var cached = templateCache[ ctx.path ];
    
    if( cached ) {
        
        ctx.template = cached;

        next();
        
    } else if( firstLoad.is ) {
        
        saveTemplate( document.documentElement.innerHTML, ctx );
        
        $element.empty().detach();
        
        next();
        
    } else {
    
        $.get( ctx.path, function(response){
            
            saveTemplate( response, ctx );
            
            next();
            
        })
        
    }
    
}

function transitionOut(ctx, next){
    
    $loading.removeClass('on');
    
    var delay = events.trigger('transitionOut');
    
    if( delay ){
        
        setTimeout( next, delay );
        
    } else {
        
        next();
        
    }
    
}

function go(ctx, next){
    
    events.trigger('remove');
    
    events.off();
    
    $htmlBody.scrollLeft(0).scrollTop(0);
    
    var routeName = ctx.path === '/' ? 'home' : ctx.path.split('/')[1];
    
    $body.removeClass (function (index, className) {
        return (className.match (/(^|\s)page-\S+/g) || []).join(' ');
    }).addClass( 'page-' + routeName );
    
    $window.trigger('routechange');
    
    next();
    
}
},{"../../firstLoad.js":2,"../config.js":20,"../events.js":21}],24:[function(require,module,exports){
var navigation = require('../../navigation.js');

var Showcase = require('../../renderer/showcase.js');
var events = require('../events.js');

var fov = 60;

module.exports = function(ctx, next){
    
    var showcase = new Showcase({
        logo: ctx.template.filter('.home-logo'),
        imgs: ctx.template.filter('.home-img'),
        fov: fov
    });
    
    showcase.logo.$element.addClass('fade-out');
    showcase.imgs.forEach(function(){
        this.$element.addClass('fade-out');
    })
    
    showcase.init();
    
    setTimeout(function(){
        showcase.logo.$element.removeClass('fade-out');
        showcase.imgs.forEach(function(){
            this.$element.removeClass('fade-out');
        })
    });
    
    showcase.logo.$element.addClass('fade-out');
    showcase.imgs.forEach(function(){
        this.$element.addClass('fade-out');
    })
    
    navigation.hide();
    
    events.on({
        
        resize: showcase.layout.bind(showcase),
        
        mousemove: function(e){
            
            showcase.setMouse(e.clientX, e.clientY);
            
        },
        
        transitionOut: function(){
            
            showcase.imgs.forEach(function(){
                this.$element.addClass('fade-out');
            })
            
            showcase.logo.$element.addClass('fade-out');
            
            return 1000;
            
        },
        
        remove: showcase.remove.bind(showcase)
        
    })
    
    next();
    
}
},{"../../navigation.js":6,"../../renderer/showcase.js":14,"../events.js":21}],25:[function(require,module,exports){
var navigation = require('../../navigation.js');

var Corner = require('../../renderer/corner.js');
var events = require('../events.js');

var fov = 60;

module.exports = function(ctx, next){
    
    var corner = new Corner({
        content: ctx.template,
        fov: fov
    })
    
    corner.wall1.$content.addClass('fade-out');
    corner.wall2.$content.addClass('fade-out');
    
    corner.init();
    
    setTimeout(function(){
        corner.wall1.$content.removeClass('fade-out');
        corner.wall2.$content.removeClass('fade-out');
    });
    
    navigation.show();
    
    events.on({
        
        resize: corner.layout.bind(corner),
        
        mousemove: function(e){
            corner.setMouse(e.clientX);
        },
        
        transitionOut: function(){
            
            corner.wall1.$content.addClass('fade-out');
            corner.wall2.$content.addClass('fade-out');
            
            return 200;
            
        },
        
        remove: corner.remove.bind(corner)
        
    });
    
    next();
    
}
},{"../../navigation.js":6,"../../renderer/corner.js":8,"../events.js":21}],26:[function(require,module,exports){
var config = require('../config.js');
var navigation = require('../../navigation.js');

var Room = require('../../renderer/room.js');
var Clones = require('../../renderer/clones.js');
var events = require('../events.js');

var metrics = require('../../metrics.js');

var $body = $('body');

var fov = 60;

module.exports = function(ctx, next){
    
    var $main = ctx.template.filter('.main');
    
    $main.addClass('fade-out');
    
    var room = new Room({
        content: $main,
        horizontal: false,
        fov: fov
    });
    
    room.init( config.$element );
    
    $main.loadImages();
    room.wall1.$content.loadImages();
    room.wall2.$content.loadImages();
    
    var $titles = ctx.template.filter('ul');
    $titles.addClass('nav_hidden');
    $body.append( $titles );
    
    navigation.show();
    
    $main.find('.video-container').loadVideo();
    
    setTimeout(function(){
        $main.removeClass('fade-out');
        room.wall1.$content.removeClass('fade-out');
        room.wall2.$content.removeClass('fade-out');
        $titles.removeClass('nav_hidden')
    });
    
    var $autoHeights = new Clones( $main, room.wall1.$content, room.wall2.$content ).find('.auto-height');
    
    $autoHeights.forEach(function(){
        this.height( window.innerHeight - metrics.menuMargin() * 2 );
    })
    
    var lastScroll = 0;
    
    events.on({
        
        resize: _.debounce(function(){
            
            $autoHeights.forEach(function(){
                this.height( window.innerHeight - metrics.menuMargin() * 2 );
            })
            
            room.layout();
            room.scroll();
            
        }, 100),
        
        scroll: function(){
            
            var y = pageYOffset;
            
            if(y <= 0 || y < lastScroll){
                navigation.show();
            } else {
                navigation.hide();
            }
            
            room.scroll( y );
            
            lastScroll = y;
        },
        
        transitionOut: function(){
            
            $main.addClass('fade-out');
            room.wall1.$content.addClass('fade-out');
            room.wall2.$content.addClass('fade-out');
            $titles.addClass('nav_hidden');
            
            return 200;
            
        },

        remove: room.remove.bind(room)
        
    })
    
    next();
    
}
},{"../../metrics.js":5,"../../navigation.js":6,"../../renderer/clones.js":7,"../../renderer/room.js":12,"../config.js":20,"../events.js":21}],27:[function(require,module,exports){
var config = require('../config.js');
var navigation = require('../../navigation.js');

var Room = require('../../renderer/room.js');
var Clones = require('../../renderer/clones.js');
var events = require('../events.js');

var fov = 60;

module.exports = function(ctx, next){
    
    var $main = ctx.template.filter('.main');
    
    ctx.template.find('.thumbnail-column').addClass('fade-out');
    
    var horizontal = ctx.template.hasClass('horizontal');
    
    var room = new Room({
        content: ctx.template,
        horizontal: horizontal,
        fov: fov
    });
    
    room.init( config.$element );
    
    $main.loadImages();
    room.wall1.$content.loadImages();
    room.wall2.$content.loadImages();
    
    navigation.show();
    
    var columns = new Clones( ctx.template, room.wall1.$content, room.wall2.$content ).find('.thumbnail-column');
    
    columns.forEach(function(i){
        
        var element = this;
        
        setTimeout(function(){
            element.removeClass('fade-out');
        }, i * 200)
        
    });
    
    events.on({
        
        resize: _.debounce(function(){
            room.layout();
            room.scroll();
        }, 100),
        
        scroll: function(){
            room.scroll( horizontal ? pageXOffset : pageYOffset );
        },
        
        transitionOut: function(){
            
            columns.forEach(function(i){
                
                var element = this;
                
                setTimeout(function(){
                    element.addClass('fade-out');
                }, i * 200)
                
            })
            
            return columns.length * 200 + 200;
            
        },

        remove: room.remove.bind(room)
        
    })
    
    next();
    
}
},{"../../navigation.js":6,"../../renderer/clones.js":7,"../../renderer/room.js":12,"../config.js":20,"../events.js":21}],28:[function(require,module,exports){
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


},{"./metrics.js":5,"./navigation.js":6,"./renderer/showcase.js":14,"./renderer/zepto.plugins.js":19}]},{},[4]);
