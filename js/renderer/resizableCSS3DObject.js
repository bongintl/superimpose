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