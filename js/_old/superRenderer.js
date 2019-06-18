function SuperRenderer(ctor){
    
    var args = _.toArray(arguments).slice(1);
    
    _.extend(this, ctor.apply(null, args), SuperRenderer.defaults);
    
}

SuperRenderer.defaults = {
    insert: _.noop,
    remove: _.noop
}
/*
SuperRenderer.prototype.validateAssets = function(assets){
    var name, asset;
    var ret = [];
    for(var i = 0; i < this.requiredAssets.length; i++){
        name = this.requiredAssets[i];
        asset = assets[name];
        if(!asset) console.error('Asset ' + name + ' not found');
        ret.push(asset);
    }
    return ret;
}

SuperRenderer.prototype.bind = function(name, value){
    if(_.isFunction(value)){
        this[name] = function(router){
            this._renderer[name].apply(router, assets);
        }
    } else {
        this[name] = value;
    }
}
*/

SuperRenderer.renderers = {};

SuperRenderer.renderers.dom = ['template', function(element){
    return {
        insert: function(template){
            element.innerHTML = template;
        }
    }
}];

SuperRenderer.renderers.dom.assets = {
    'template': {
        extension: 'html'
    }
}

SuperRenderer.renderers.jQuery = ['$template', function($element){
    
    $element = $($element);
    
    return {
        insert: function($template){
            $element.append($template);
        },
        remove: function($template){
            $template.detach();
        }
    }
    
}]

SuperRenderer.renderers.jQuery.assets = {
    'template': {
        extension: 'html',
        transform: {
            '$template': function(template){
                return $(template);
            }
        }
    }
}

