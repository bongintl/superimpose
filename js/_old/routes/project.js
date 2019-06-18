router.route('project/:slug', {
    
    name: 'project',
    
    touchScroll: 'vertical',
    
    fov: WORK_FOV,
    
    compile: function(assets){
        
        var $template = assets.$template;
        
        var $main = $template.filter('.project-main');
        var $title = $template.filter('.project-title');
        var $nav = $template.filter('.project-nav');
        
        var ceiling = new SuperFace();
        var backWall = new SuperFace();
        var floor = new SuperFace();
        
        assets.objects = {
            ceiling: ceiling,
            floor: floor
        }
        
        assets.objects2d = {
            backWall: backWall
        }
        
        var $mainClones = SuperFace.cloneAndChain($main, [ceiling, backWall, floor]);
        
        backWall.$element.removeClass('super-face').addClass('project-main-flat');
        
        backWall.$content.find('.video-container').each(function(){
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
        
        assets.elements = {
            $main: $mainClones,
            $title: $title,
            $nav: $nav,
            center: backWall.$element
        }
        
    },
    
    onBeforeInsert: function(){
        
        var renderer = this.renderer();
        var assets = this.assets();
        
        assets.elements.$main.addClass('fade-out');
        assets.elements.$title.addClass('fade-out');
        assets.elements.$nav.addClass('fade-out');
        
    },
    
    onAfterInsert: function(){
        
        var elements = this.assets().elements;
        
        this.renderer().$element.append(elements.center, elements.$title, elements.$nav);
        
        $nav.removeClass('hidden');
        
        setTimeout(function(){
            elements.$main.removeClass('fade-out');
            elements.$title.removeClass('fade-out');
            elements.$nav.removeClass('fade-out');
        }, 0)
        
    },
    
    onLayout: function(){
        
        var assets = this.assets();
        var renderer = this.renderer();
        
        var w = window.innerWidth;
        var h = window.innerHeight;
        
        var marginX = breakpoint(40, 40, 50);
        var marginY = breakpoint(30, 40, 50);
        
        var backWallW = w - marginX*2;
        var backWallH = h - marginY*2;
        
        var far = renderer.getPerfectZ();
        
        var depth = marginY / Math.tan( THREE.Math.degToRad( renderer.camera.fov/2) );
        
        var wallZ = far + depth/2;
        
        assets.objects.ceiling.setPosition({
            x: 0,
            y: backWallH/2,
            z: wallZ,
            rx: Math.PI/2,
            w: backWallW,
            h: depth
        })
        
        assets.objects.floor.setPosition({
            x: 0,
            y: -backWallH/2,
            z: wallZ,
            rx: -Math.PI/2,
            w: backWallW,
            h: depth
        });
        
        assets.objects2d.backWall.h = h - marginY*2;
        assets.objects.ceiling.scroll(0);
        
        assets.elements.$main.css('margin-top', depth);
        
        assets.elements.center.css({
            top: marginY,
            left: marginX,
            bottom: marginY,
            right: marginX
        })
        
        assets.elements.$main.find('.auto-height').height( h - marginY*2 );
        
    },
    
    onAfterRender: function(){
        var max = this.assets().objects.ceiling.clampScrollToContent();
        setScroll(false, max + window.innerHeight);
    },
    
    onTransitionOut: function(done){
        
        var assets = this.assets();
        
        assets.elements.$main.addClass('fade-out');
        assets.elements.$title.addClass('fade-out');
        assets.elements.$nav.addClass('fade-out');
        
        $nav.removeClass('collapse');
        
        setTimeout(function(){
            
            assets.elements.$title.detach();
            assets.elements.$nav.detach();
            assets.objects2d.backWall.$element.detach();
            done();
            
        }, 500)
        
    },
    
    onScroll: function(delta){
        
        var assets = this.assets();
        
        var ceiling = assets.objects.ceiling;
        
        var lastScroll = ceiling.scrollTop;
        
        ceiling.scroll(delta);
        
        if(lastScroll === ceiling.scrollTop) return;
        
        if(ceiling.scrollTop === ceiling.minScroll || ceiling.scrollTop < lastScroll){
            $nav.removeClass('hidden');
        } else {
            $nav.addClass('hidden');
        }
        
    }
    
})