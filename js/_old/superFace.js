function SuperSingleton(options){
    
    _.extend(this, options);
    
    this.attached = false;
    this.cropped = false;
    
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

function SuperFace(options){
    
    var self = this;
    
    this.$element = SuperFace.$model.clone();

    this.scrollTop = 0;
    
    _.defaults(this, options || {}, SuperFace.defaults);
    
    THREE.CSS3DObject.call(this, this.$element[0]);
    
}

SuperFace.prototype = Object.create( THREE.CSS3DObject.prototype );
SuperFace.prototype.constructor = THREE.CSS3DObject;

SuperFace.prototype.setPosition = function(params){
    if(params.x) this.position.x = params.x;
    if(params.y) this.position.y = params.y;
    if(params.z) this.position.z = params.z;
    if(params.rx) this.rotation.x = params.rx;
    if(params.ry) this.rotation.y = params.ry;
    if(params.rz) this.rotation.z = params.rz;
    if(params.w){
        if(this.horizontal) params.w++;
        this.$element.width(params.w);
        this.w = params.w;
    }
    if(params.h){
        if(!this.horizontal) params.h++;
        this.$element.height(params.h);
        this.h = params.h;
    }
}

SuperFace.prototype.addContent = function($content){
    this.$content = $content;
    this.$element.append($content);
}

SuperFace.prototype.cloneContent = function($content){
    var $clone = $content.clone();
    this.addContent( $clone );
    return $clone;
}

SuperFace.prototype.scrollTo = function(to){
    
    if(to !== this.scrollTop){
	
    	this.scrollDir = to < this.scrollTop ? -1 : 1;
    	
    	if(this.loop){
    	    to = wrap(to, this.minScroll, this.maxScroll);
    	} else {
    	    to = clamp(to, this.minScroll, this.maxScroll);
    	}
    	
    	this.scrollTop = to;
    	
    	if(this.$content){
    	    if(this.horizontal){
    	        this.$content[0].style.transform = 'translate3d(' + Math.round(-this.scrollTop) + 'px, 0, 0)';
    	        //this.$content.css('transform', 'translate3d(' + (-this.scrollTop + 'px') + ', 0, 0)');
        	} else {
        	    this.$content[0].style.transform = 'translate3d(0, ' + Math.round(-this.scrollTop) + 'px, 0)';
        	    //this.$content.css('transform', 'translate3d(0, ' + (-this.scrollTop + 'px') + ', 0)');
        	}
    	}
	
    }
	
    if(this.nextInChain) this.nextInChain.scrollTo(this.scrollTop + (this.horizontal ? this.w : this.h) );
}

SuperFace.prototype.scroll = function(by){
    this.scrollTo(this.scrollTop + by);
}

SuperFace.prototype.clampScroll = function(min, max){
    this.minScroll = min;
    this.maxScroll = max;
}

SuperFace.prototype.getMaxScroll = function(){
    
    var max;
    
    if(this.horizontal){
        max = this.$content.getWidth();
    } else {
        max = this.$content.getHeight();
    }
    
    var next = this.nextInChain;
    
    while(next){
        max -= this.horizontal ? next.w : next.h;
        next = next.nextInChain;
    }
    
    return max;
    
}

SuperFace.prototype.clampScrollToContent = function(plus){
    
    var plus = plus || 0;
    
    var max = this.getMaxScroll();
    
    this.clampScroll(0, max + plus);
    
    this.$content.find('img').one('load', this.clampScrollToContent.bind(this, plus));
    
    return max;
    
}

SuperFace.prototype.addChain = function(other){
    this.nextInChain = other;
    this.scrollTo(this.scrollTop);
}

SuperFace.prototype.chainTo = function(other){
    this.horizontal = other.horizontal;
    other.addChain(this);
}

SuperFace.prototype.autoScroll = function(){
    
    this.scrollDir = 1;
    
    var self = this;
    
    rAF.start('faceAutoScroll', function(now, dT){
        self.scroll( dT * 0.025 * self.scrollDir);
    })
    
    this.addEventListener( 'removed', rAF.stop.bind(null, 'faceAutoScroll') );

}

SuperFace.prototype.autoScrollStop = function(){
    cancelAnimationFrame(this.animationFrame);
}

SuperFace.cloneAndChain = function($content, faces){
    
    var $clones = $();
    var $clone, face, lastFace;
    
    for(var i = 0; i < faces.length; i++){
        
        face = faces[i];
        
        $clone = $content.clone();
        
        face.addContent($clone);
        
        $clones = $clones.add($clone);
        
        if(lastFace) face.chainTo(lastFace);
        
        lastFace = face;
        
    }
    
    return $clones;
    
}

SuperFace.$model = $('<div class="super-face"></div>');

SuperFace.defaults = {
    horizontal: false,
    loop: false,
    minScroll: -Infinity,
    maxScroll: Infinity
};

/*

function SuperChain(options){
    _.extend(this, options || {});
    this.members = [];
    this.scrollTop = 0;
    this.maxScroll = 0;
    if(this.loop) this.autoScroll();
}

SuperChain.prototype.autoScroll = function(){
    if(!this.then) this.then = Date.now();
    var now = Date.now();
    var dT = now - this.then;
    this.scrollBy(dT * 0.025);
    this.then = now;
    var self = this;
    requestAnimationFrame(function(){
        self.autoScroll();
    })
}

SuperChain.prototype.add = function(newFace){
    this.members.push(newFace);
    this.getMaxScroll();
}

SuperChain.prototype.addContent = function($content){
    for(var i = 0; i < this.members.length; ++i){
        this.members[i].addContent( $content.clone(true) );
    }
    this.styleContent();
}

SuperChain.prototype.styleContent = function(){
    var y = 0;
    var face;
    for(var i = 0; i < this.members.length; ++i){
        face = this.members[i];
        face.$content.css('top', y + 'px');
        y -= face.h;
    }
    
}

SuperChain.prototype.getMaxScroll = function(){
    if(!this.loop) return;
    this.maxScroll = _.reduce(this.members, function(memo, face){
        return memo + face.h;
    }, 0);
}

SuperChain.prototype.scrollTo = function(to){
	if(this.loop){
	    while(to > this.maxScroll) to -= this.maxScroll;
	    while(to < 0) to += this.maxScroll;
	}
	this.scrollTop = to;
    _.each(this.members, function(face){
        face.scrollTo(to);
        //to += face.h;
    })
}

SuperChain.prototype.scrollBy = function(delta){
	this.scrollTo(this.scrollTop + delta);
}

SuperChain.prototype.eachElement = function(fn){
	
	for(var i = 0; i < this.members.length; i++){
		fn(this.members[i].$element, i);
	}
	
}

*/