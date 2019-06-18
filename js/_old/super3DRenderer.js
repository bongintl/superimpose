SuperRenderer.renderers.Super3DRenderer = function(element){
    
    var router = this;
    
    var cssRenderer = new THREE.CSS3DRenderer();
    cssRenderer.domElement.id = 'renderer';
    element.appendChild(cssRenderer.domElement);
    cssRenderer.setSize( window.innerWidth, window.innerHeight );
    
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);

    scene.add(camera);
    
    var $element = $(element);
    
    function render(){
        router.trigger('layout');
        cssRenderer.render(scene, camera);
        router.trigger('afterRender');
    }
    
    function insert(assets){
        
        camera.position.z = 0;
        
        var route = router.route();
        
        $element.addClass(route.name);
        
        /*
        
        if(route.touchScroll === 'horizontal'){
            hammer.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });
        } else if(route.touchScroll === 'vertical') {
            hammer.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL });
        }
        
        */
        
        if(route.fov !== camera.fov){
            camera.fov = route.fov;
            camera.updateProjectionMatrix();
        }
        
        //hammer.off('pan');
        //hammer.on('pan', scrollHandlers[ route.touchScroll || 'none' ]);
        
        $body.scrollTop(0).scrollLeft(0);
        
        $(window).off('scroll.superscroll').on('scroll.superscroll', scrollHandlers[ route.touchScroll ] || 'none');
        
        var obj;
        
        var objects = assets.objects || {};
        
        for(var objName in objects){
            obj = objects[objName];
            if(_.isArray(obj)){
                scene.add.apply(scene, obj);
            } else {
                scene.add(obj);
            }
        }
        
        render();
    
    }
    
    function remove(assets){

        $element.removeClass(router.route().name);

        var obj;
        
        var objects = assets.objects || {};
        
        for(var objName in objects){
            obj = objects[objName];
            scene.remove(obj);
        }
        
    }
    
    /*
    
    Hamster(window).wheel(function(event, delta, dX, dY){
        if (dY) event.preventDefault();
        router.trigger('scroll', -delta);
    })
    
    */
    
    router.on('routeAdded', function(route, config){
        route.touchScroll = config.touchScroll;
        route.fov = config.fov || 45;
    })
        
    var $body = $('body');
    
    function scrollDirectionHandler(prop){
        
        function handler(){
            
            var scroll = $body[prop]();
            
            var delta = scroll - handler.last;
            
            router.trigger('scroll', delta);
            
            handler.last = scroll;
            
            /*
            
            e.preventDefault();
            var delta = -e[prop];
            router.trigger('scroll', delta - handler.last);
            handler.last = delta;
            if(e.isFirst || e.isFinal) handler.last = 0;
            
            */
            
        }
        
        handler.last = 0;
        
        return handler;
        
    }
    
    var scrollHandlers = {
        
        horizontal: scrollDirectionHandler('scrollLeft'),
        
        vertical: scrollDirectionHandler('scrollTop'),
        
        none: function(e){ e.preventDefault() }
        
    }
    
    function resize(){
        cssRenderer.setSize( window.innerWidth, window.innerHeight );
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        render();
    }
    
    window.addEventListener('resize', resize);
    
    function getPerfectZ(fov){
        return -(window.innerHeight/2) / Math.tan( THREE.Math.degToRad( (fov || camera.fov) / 2 ) );
    }
    
    return {
        $element: $element,
        cssRenderer: cssRenderer,
        scene: scene,
        camera: camera,
        insert: insert,
        remove: remove,
        resize: resize,
        getPerfectZ: getPerfectZ,
        render: function(){
            cssRenderer.render(scene, camera);
        }
    }
    
}

SuperRenderer.renderers.Super3DRenderer.assets = SuperRenderer.renderers.jQuery.assets;
/*
SuperRouter.renderers.Super3DRenderer = {
    
    init: function(element){
        
        var router = this;
        
        var cssRenderer = new THREE.CSS3DRenderer();
        
        cssRenderer.domElement.id = 'renderer';
        element.appendChild(cssRenderer.domElement);
        cssRenderer.setSize( window.innerWidth, window.innerHeight );
        
        scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);

        scene.add(camera);
        
        function render(){
            cssRenderer.render(scene, camera);
        }
        
        function insert(assets){
            
            var obj;
            
            for(var objName in assets.objects){
                obj = assets.objects[objName];
                renderer.scene.add(obj);
            }
            
            router.trigger('resize');
            render();
        
        }
        
        function remove(assets){
            
            var obj;
            
            for(var objName in assets.objects){
                obj = assets.objects[objName];
                renderer.scene.remove(obj);
            }
            
        }
        
        Hamster(window).wheel(function(event, delta){
            event.preventDefault();
            router.trigger('scroll', delta);
        })
        
        window.addEventListener('resize', function(){
            renderer.cssRenderer.setSize( window.innerWidth, window.innerHeight );
            renderer.camera.aspect = window.innerWidth / window.innerHeight;
            renderer.camera.updateProjectionMatrix();
            router.trigger('resize');
            render();
        })
        
        return{
            $element: $(element),
            cssRenderer: cssRenderer,
            scene: scene,
            camera: camera,
            insert: insert,
            remove: remove
        }
        
    },
    
    assets: {
        
        $template: {
            directory: 'templates',
            type: 'html',
            transform: function(html){
                return $(html);
            }
        }
        
    },
    
    data: {
        scrollTop: 0
    },
    
    events: {
        
        compile: function(renderer, assets){
            
            assets.objects = {};
            
        },
        
        remove: function(renderer, assets){
            
            var obj;
            
            for(var objName in assets.objects){
                obj = assets.objects[objName];
                renderer.scene.remove(obj);
            }
            
        },
        
        insert: function(renderer, assets){
            
            var obj;
            
            for(var objName in assets.objects){
                obj = assets.objects[objName];
                renderer.scene.add(obj);
            }
            
        },
        
        afterInsert: function(renderer, assets){
            renderer.render();
        },
        
        resize: function(renderer, assets){
            
            renderer.cssRenderer.setSize( window.innerWidth, window.innerHeight );
            renderer.camera.aspect = window.innerWidth / window.innerHeight;
            renderer.camera.updateProjectionMatrix();
            
        },
        
        scroll: function(renderer, assets, delta){
            
            this.route.data.scrollTop -= delta || 0;
            
        }
        
    }
    
}
*/