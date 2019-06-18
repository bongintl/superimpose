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