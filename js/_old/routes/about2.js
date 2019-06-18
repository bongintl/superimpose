router.route('about', {
    
    compile: function(assets){
        
        var $template = assets.$template;
        
        var $main = $template.filter('.about-main');
        var $side = $template.filter('.side');
        var $nav = $template.filter('nav');
        
        var $mainClones = $();
        
        var ceiling = new SuperFace();
        $mainClones = $mainClones.add(ceiling.cloneContent($main));
        
        var rightWall = new SuperFace();
        $mainClones = $mainClones.add(rightWall.cloneContent($main));
        rightWall.chainTo(ceiling);
        rightWall.$element.append($nav);
        
        var leftWall = new SuperFace();
        leftWall.addContent($side);

        assets.objects = {
            ceiling: ceiling,
            rightWall: rightWall,
            leftWall: leftWall
        }
        
        assets.elements = {
            $main: $mainClones,
            $side: $side,
            $nav: $nav
        }
        
    },
    
    onBeforeInsert: function(){
      
        var renderer = this.renderer();
        var assets = this.assets();
        
        renderer.camera.fov = 25;
        renderer.camera.updateProjectionMatrix();
        
        assets.elements.$main.addClass('fade-out');
        assets.elements.$side.addClass('fade-out');
        assets.elements.$nav.addClass('fade-out');
        
        assets.objects.ceiling.scrollTo(0);
        
        $nav.removeClass('hidden');
        
    },
    
    onAfterInsert: function(){
        
        var assets = this.assets();
        var elements = assets.elements;
        var objects = assets.objects;
        
        setTimeout(function(){
          elements.$main.removeClass('fade-out');
          elements.$nav.removeClass('fade-out');
        }, 0)
        
        setTimeout(function(){
            elements.$side.removeClass('fade-out');
        }, 500)

        objects.ceiling.clampScrollToContent();
        
    },
    
    onTransitionOut: function(done){

        var elements = this.assets().elements;
        
        elements.$main.addClass('fade-out');
        elements.$nav.addClass('fade-out');
        
        setTimeout(function(){
          elements.$side.addClass('fade-out');
        }, 500)
        
        setTimeout(done, 1000);
        
    },
    
    onLayout: function(){
        
        var fov = THREE.Math.degToRad(this.renderer().camera.fov);
        
        var assets = this.assets();
        var objects = assets.objects;
        var elements = assets.elements;
        
        var w = window.innerWidth;
        var h = window.innerHeight;
        
        var tanHalfFov = Math.tan(fov/2);
        
        var near = (h/2) / tanHalfFov;
        
        var leftWallAngle = THREE.Math.degToRad(60);
        
        var rightWallAngle = leftWallAngle - Math.PI/2;
        var leftWallWidth = Math.cos(leftWallAngle) * w;
        var rightWallWidth = Math.sin(leftWallAngle) * w;
        
        var depth = Math.sin(leftWallAngle) * leftWallWidth;
        
        var leftWallScreenWidth = Math.sqrt(Math.pow(leftWallWidth, 2) - Math.pow(depth, 2));
        var rightWallScreenWidth = Math.sqrt(Math.pow(rightWallWidth, 2) - Math.pow(depth, 2));

        var wallZ = -near - depth/2;
        
        var wallHeight = h + ( depth * tanHalfFov );
        
        var wallY = -(wallHeight-h) / 2;
        
        objects.leftWall.setPosition({
          w: leftWallWidth,
          h: wallHeight,
          x: (-w/2) + (leftWallScreenWidth / 2),
          y: wallY,
          z: wallZ,
          ry: leftWallAngle
        });
        
        objects.rightWall.setPosition({
          w: rightWallWidth,
          h: wallHeight,
          x: (w/2) - (rightWallScreenWidth / 2),
          y: wallY,
          z: wallZ,
          ry: rightWallAngle
        });
        
        objects.ceiling.setPosition({
          x: 0,
          y: h/2,
          z: -near,
          rx: Math.PI/2,
          rz: -rightWallAngle,
          w: rightWallWidth,
          h: leftWallWidth
        })
        
        
        elements.$main.css({
          marginTop: leftWallWidth,
        });
        
        objects.ceiling.scrollTo(0);
        
    },
    
    onAfterRender: function(){
        var objects = this.assets().objects;
        var ceiling = objects.ceiling;
        ceiling.clampScrollToContent();
        ceiling.maxScroll += objects.rightWall.h / 2;
    },
    
    onScroll: function(delta){
        this.assets().objects.ceiling.scroll(delta);
    }
    
})