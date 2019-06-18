function SuperRouter(config){
    
    config = _.defaults(config, SuperRouter.defaults);
    
    this.events = {};
    this.data = {};
    
    this._routes = {};
    this._route = {
        url: '',
        events: {},
        data: {},
        assets: {},
        sham: true
    }
    
    this._assets = {};
    this._loader = new SuperLoader(config.apiRoot);
    
    if(config.navigator){
        this.navigator(config.navigator);
    }
    
    if(config.renderer){
        this.renderer(config.renderer);
    }
    
    if(config.routes){
        this.routes(config.routes);
    }
    
    if(config.assets){
        this.assets(config.assets);
    }
    
    if(config.defaultUrl){
        this.defaultUrl = config.defaultUrl;
    }
    
    //_.defaults(this, options || {}, SuperRouter.defaults);
    
    //if(this.navigator) this.useNavigator(this.navigator);
    //if(this.renderer) this.useRenderer(this.renderer);
    
    //Hamster(window).wheel(this.onWheel.bind(this) );
    
    //$(window).on('resize', this.render.bind(this) );
    //this.render();
    
}

SuperRouter.stripSlashes = function(url){
    return url.toString().replace(/\/$/, '').replace(/^\//, '');
}

SuperRouter.defaults = {
    navigator: 'hash',
    renderer: 'dom',
    apiRoot: ''
}

SuperRouter.navigators = {
    
    hash: {
        getUrl: function(){
            return window.location.hash.slice(1);
        },
        listen: function(onChange){
            window.onload = onChange;
            window.onhashchange = onChange;
        },
        go: function(url){
            window.location.hash = '#' + url;
        }
    },
    
    history: {
        getUrl: function(){
            return location.pathname + location.search;
        },
        listen: function(onChange){
            window.onpopstate = onChange;
        }
    }
    
}

SuperRouter.prototype.renderer = function(config){
    
    if(!config) return this._renderer;
    
    var args;

    if(arguments.length !== 1) {
        args = _.toArray(arguments).slice(1);
    }
    
    if (!_.isFunction(config)){
        for(var name in config){
            args = config[name];
            if(!_.isArray(args)) args = [args];
            config = SuperRenderer.renderers[name];
            break;
        }
    }
    
    if(_.isString(config)){
        config = SuperRenderer.renderers[config];
    }
    
    this._renderer = config.apply(this, args);

    if(config.assets) this.assets(config.assets);
    
}

SuperRouter.prototype.navigator = function(navigator){
    if(!navigator) return this._navigator;
    if(typeof navigator === 'string') navigator = SuperRouter.navigators[navigator];
    var router = this;
    navigator.listen(function(){
        router.go( navigator.getUrl() );
    });
    this._navigator = navigator;
}

SuperRouter.prototype.route = function(url, config){
    
    if(!url) return this._route;

    config = config || {};
    
    var route = {};
    
    url = SuperRouter.stripSlashes(url);
    
    route.url = url;
    route.matcher = new SuperMatcher(url);
    
    if(!config.events) config.events = {};
    
    var eventName;

    for(var key in config){
        if(key.slice(0, 2) === 'on'){
            eventName = key.slice(2,3).toLowerCase() + key.slice(3);
            config.events[eventName] = config[key];
            delete config[key];
        }
    }
    
    route.events = config.events;
    
    if(config.assets){
        config.loader = this._loader.extend(config.assets);
    } else {
        config.loader = this._loader.clone();
    }
    
    route.loader = config.loader;
    route.assets = false;
    
    if(!config.data) config.data = {};
    _.extend(config.data, this.data);
    
    route.data = config.data;
    
    if(!config.name) config.name = url;
    
    route.name = config.name;
    if(config.compile) route.compile = config.compile;
    
    this.trigger('routeAdded', route, config);
    
    this._routes[url] = route;
    
    if(this.waitFor === url) this.go(url);
    
    return route;
    
}

SuperRouter.prototype.routes = function(defs){
    
    if(!defs) return this._routes;
    
    for(var key in defs){
        this.route(key, defs[key]);
    }
    
}

SuperRouter.prototype.assets = function(assets){
    if(!assets) return this._route.assets;
    this._loader.add(assets);
}

SuperRouter.prototype.on = function(nameOrObject, handler){
    var self = this;
    
    function onEvent(name, handler){
        //if(!self.events[name]) self.events[name] = [];
        //self.events[name].push(handler);
        self.events[name] = handler;
    }
    
    if(handler !== undefined){
        onEvent(nameOrObject, handler);
    } else {
        for(var name in nameOrObject){
            handler = nameOrObject[name];
            onEvent(name, handler);
        }
    }
}

SuperRouter.prototype.triggerOnRoute = function(name, route){
    
    console.log('event', name, 'fired on', route.name)
    
    var thisHandler = this.events[name];
    var routeHandler = route.events[name];
    
    var args = _.toArray(arguments).slice(2);
    
    var result;
    
    if(routeHandler){
        this.super = (thisHandler || _.noop).bind(this, args);
        result = routeHandler.apply(this, args);
        delete this.super;
        return result;
    } else if(thisHandler) {
        return thisHandler.apply(this, args);
    } else {
        return true;
    }
}

SuperRouter.prototype.trigger = function(name){
    
    var args = _.toArray(arguments).slice(1);
    
    args.unshift(name, this._route);
    
    return this.triggerOnRoute.apply(this, args);
    
    /*
    if(this._route.events[name]){
        this.super = thisHandler;
        
    }
    var handler = this.route.events[name];
    if(!handler) return;
    var args = _.toArray(arguments).slice(1);
    handler.apply(this, args);
    */
}

SuperRouter.prototype.triggerAsync = function(name, callback){
    
    if(this.trigger(name, callback)) callback();
    
}

SuperRouter.prototype.go = function(url){
    
    console.log('go', url);
    
    url = SuperRouter.stripSlashes(url);
    
    var route, params;
    
    if(url === '' && this.defaultUrl){
        url = this.defaultUrl;
    }
    
    for(var routeUrl in this._routes){
        if(params = this._routes[routeUrl].matcher.match(url)){
            route = this._routes[routeUrl];
            break;
        }
    }
    
    if(_.keys(params).length) route = this.route(url, route);
    
    if(!route){
        if(this.route().sham){
            this.waitFor = url;
            return;
        } else {
            console.error('Route not found: ' + url);
        }
    }
    
    if(this.trigger('beforeLoad', route) === false) return;
    
    var self = this;
    
    function change(){
        //self.trigger('beforeRemove', self.renderer, self.route.assets);
        self.trigger('beforeRemove');
        self._renderer.remove(self.assets(), self);
        self.trigger('afterRemove');
        self._route = route;
        self.trigger('beforeInsert');
        self._renderer.insert(self.assets(), self);
        self.trigger('afterInsert');
    }
    
    change = _.after(2, change);
    
    this.triggerAsync('transitionOut', change);
    this.compileRoute(route, params, change);
    
}

SuperRouter.prototype.compileRoute = function(route, params, callback){
    
    var self = this;
    
    if(route.compiled){
        
        return callback();
        
    } else {
        
        route.loader.get(route.url, function(assets){
            
            route.assets = assets;
            
            if(route.compile) route.compile.call(self, route.assets, route);
            
            //self.triggerOnRoute('compile', route);
            
            route.compiled = true;
            
            callback();
            
        })
        
    }
    
}

SuperRouter.prototype.super = function(){
    console.error('No super');
};

function SuperMatcher(url){
    
    var parts = url.split('/');
    var part;
    var tokens = [];
    
    for(var i = 0; i < parts.length; i++){
        part = parts[i];
        if(part.charAt(0) === ':'){
            tokens.push({ type: 'param', name: part.slice(1) });
        } else {
            tokens.push({ type: 'literal', value: part });
        }
    }
    
    this.tokens = tokens;
    
}

SuperMatcher.prototype.match = function(url){
    
    var parts = url.split('/');
    
    if(parts.length !== this.tokens.length) return false;
    
    var token, part;
    var params = {};
    
    for(var i = 0; i < this.tokens.length; ++i){
        
        token = this.tokens[i];
        part = parts[i];
        
        if(token.type === 'literal' && token.value !== part) return false;
        
        if(token.type === 'param') params[token.name] = part;
        
    }
    
    return params;
    
}

SuperMatcher.prototype.getUrl = function(params){
    
    var url = '';
    
    var token;
    
    for(var i = 0; i < this.tokens.length; ++i){
        
        token = this.tokens[i];
        
        if(token.type === 'literal') url += token.value;
        
        if(token.type === 'param'){
            
            if(params[token.name]){
                url += params[token.name];
            } else {
                console.error('Missing paramater, ', param);
            }
            
        }
        
        if(i < this.tokens.length - 1) url += '/';
        
    }
    
    return url;
    
}