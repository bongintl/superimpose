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