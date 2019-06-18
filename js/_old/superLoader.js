function SuperLoader(root, config){
    
    this.sources = {};
    this.sourceCount = 0;
    
    this.cache = {};
    
    this.root = root || '';
    
    if(config) this.add(config);
    
}

SuperLoader.defaults = {
    extension: '',
    directory: '',
    root: '',
    transform: _.identity
}

SuperLoader.prototype.add = function(name, config){
    if(_.isString(name)){
        return this.addOne(name, config);
    } else {
        return this.addMany(name);
    }
}

SuperLoader.prototype.addMany = function(config){
    for(var key in config){
        this.addOne(key, config[key]);
    }
    return this;
}

SuperLoader.prototype.addOne = function(name, config){
    
    config = config || {};
    
    _.defaults(config, SuperLoader.defaults);
    
    if(!config.directory.length) config.directory = name + 's';
    
    config.directory = SuperRouter.stripSlashes(config.directory);
    
    if(config.extension.length && config.extension.charAt(0) !== '.') {
        config.extension = '.' + config.extension;
    }
    
    if(_.isFunction(config.transform)){
        var transform = {};
        transform[name] = config.transform;
        config.transform = transform;
    }
    
    if(!config.transform[name]) config.transform[name] = _.identity;
    
    this.sources[name] = config;
    this.sourceCount++;
    
    return this;
    
}

SuperLoader.prototype.clone = function(){
    return new SuperLoader(this.root, this.sources);
}

SuperLoader.prototype.extend = function(config){
    return this.clone().add(config);
}

SuperLoader.prototype.get = function(param, callback){
    
    if(this.cache[param]) return callback(this.cache[param]);
    
    var self = this;
    
    var result = {};
    
    function cacheAndCallback(){
        self.cache[param] = result;
        callback(result);
    }
    
    cacheAndCallback = _.after(this.sourceCount, cacheAndCallback);
    
    var source, url;
    
    function done(name, source, url, response){
        
        for(var transform in source.transform){
            result[transform] = source.transform[transform](response);
        }
        
        cacheAndCallback();
    }

    for(var name in this.sources){
        source = this.sources[name];
        url = this.root + source.directory + '/' + param + source.extension;
        $.get(url, done.bind(null, name, source, url))
        /*
        $.get({
            url: url,
            success: done.bind(null, name, source, url)
        })
        */
    }
    
}