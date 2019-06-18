router.route('work', {
    
    name: 'work',
    
    touchScroll: 'horizontal',
    
    fov: WORK_FOV,
    
    compile: function(assets){
        
        var $template = assets.$template;
        
        var $main = $template.filter('.work-main');

        var leftWall = new SuperFace({horizontal: true});
        var backWall = new SuperFace({horizontal: true});
        var rightWall = new SuperFace({horizontal: true});

        assets.objects = {
            leftWall: leftWall,
            rightWall: rightWall
        }
        
        assets.objects2d = {
            backWall: backWall
        }
        
        var $mainClones = SuperFace.cloneAndChain($main, [leftWall, backWall, rightWall]);
        
        backWall.$element.addClass('project-main-flat');
        
        var columns = $mainClones.reduce(function(memo){
            
            $(this).find('.work-thumbnail-column').each(function(i){
                
                if(!memo[i]) memo[i] = $();
                
                memo[i] = memo[i].add( $(this) );
                
            });
            
            return memo;
            
        }, []);
        
        assets.elements = {
            $main: $mainClones,
            columns: columns,
            center: backWall.$element
        }
        
    },
    
    onBeforeInsert: function(){
        
        var renderer = this.renderer();
        var assets = this.assets();
        
        //assets.elements.$main.addClass('fade-out');
        
        assets.elements.columns.forEach(function(columnSet){
            columnSet.addClass('fade-out');
        })
        
        $nav.removeClass('hidden');
        
        assets.objects.leftWall.scrollTo(0)
  
    },
    
    onAfterInsert: function(){
        
        var elements = this.assets().elements;
        
        this.renderer().$element.append(elements.center);
        
        setTimeout(function(){
            //elements.$main.removeClass('fade-out');
        }, 0);
        
        elements.columns.forEach(function(columnSet, i){
            setTimeout(columnSet.removeClass.bind(columnSet, 'fade-out'), i * 250);
        });
        
    },
    
    onLayout: function(){
        
        var assets = this.assets();
        var renderer = this.renderer();
        
        var w = window.innerWidth;
        var h = window.innerHeight;
        
        var marginX = minMargin();
        var marginY = 50 //minMargin();
        
        var backWallW = w - marginX*2;
        var backWallH = h - marginY*2;
        
        var far = renderer.getPerfectZ();
        
        var depth = marginY / Math.tan( THREE.Math.degToRad( renderer.camera.fov/2) );
        
        var wallZ = far + depth/2;
        
        assets.objects.leftWall.setPosition({
            x: -backWallW/2,
            y: 0,
            z: wallZ,
            w: depth,
            h: backWallH,
            ry: Math.PI/2
        });
        
        assets.objects.rightWall.setPosition({
            x: backWallW/2,
            y: 0,
            z: wallZ,
            w: depth,
            h: backWallH,
            ry: -Math.PI/2
        })
        
        assets.objects2d.backWall.w = backWallW;
        
        assets.objects.leftWall.scroll(0);
        
        assets.elements.$main.css('margin-left', depth);
        
        assets.elements.center.css({
            top: marginY,
            left: marginX,
            bottom: marginY,
            right: marginX
        })
        
    },
    
    onAfterRender: function(){
        
        var max = this.assets().objects.leftWall.clampScrollToContent();
        
        setScroll( max + window.innerWidth, false );
        
    },
    
    onTransitionOut: function(done){
        
        var assets = this.assets();
        
        //assets.elements.$main.addClass('fade-out');
        
        assets.elements.columns.forEach(function(columnSet, i){
            setTimeout(columnSet.addClass.bind(columnSet, 'fade-out'), i * 250);
        });
        
        setTimeout(function(){
            
            assets.objects2d.backWall.$element.detach();
            done();
            
        }, assets.elements.columns.length * 250 + 500);
        
    },
    
    onScroll: function(delta){
        
        var assets = this.assets();
        
        var leftWall = assets.objects.leftWall;
        
        leftWall.scroll(delta);

    }
    
})