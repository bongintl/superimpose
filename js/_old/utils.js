function clamp(x, min, max){
	return Math.max( min, Math.min( x, max ) );
}

function wrap(x, min, max) {
	if(max === undefined){
		max = min;
		min = -max;
	}
	var range = max-min;
	while(x < min) x += range;
	while(x > max) x -= range;
	return x;
}

function normalize(x, min, max){
	return (x-min) / (max-min);
}

function scale(x, oldMin, oldMax, newMin, newMax){
    if( !(oldMin === 0 && oldMax === 1) ){
        x = normalize(x, oldMin, oldMax);
    }
    return newMin + x * (newMax - newMin);
}

function breakpoint(small, medium, large){
	var ret;
	if(window.innerWidth <= 414){
		ret = small;
	} else if(window.innerWidth <= 768){
		ret = medium;
	} else {
		ret = large;
	}
	if(_.isFunction(ret)){
		return ret();
	} else {
		return ret;
	}
}

function applyBreakpoint(small, medium, large){
	return function(){
		return breakpoint(small, medium, large);
	}
}

var MIN_MARGIN = 55;

function minMargin(){
	return breakpoint(20, 40, 50);
}

function getMarginY(){
	if(window.innerHeight > window.innerWidth){
		return MIN_MARGIN * (window.innerHeight / window.innerWidth);
	} else {
		return MIN_MARGIN;
	}
}

function getMarginX(){
	if(window.innerHeight > window.innerWidth){
		return MIN_MARGIN;
	} else {
		return MIN_MARGIN * (window.innerWidth / window.innerHeight);
	}
}

var WORK_FOV = 60;

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
		return "//www.youtube.com/embed/" + id + "?playlist=" + id + "&showinfo=0";
	}
	
}

var $sizer = $('.sizer');

function setScroll(x, y){
	$sizer.width(x || '100%').height(y || '100%');
}