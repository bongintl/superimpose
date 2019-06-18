router.route('work', {
    
    compile: function(assets){
        
        var $template = assets.$template;
        
        var $main = $template.filter('.work-main');
        
        var leftWall = new SuperFace({horizontal: true});
        
        var rightWall = new SuperFace({horizontal: true});
        
        var $mainClones = SuperFace.cloneAndChain($main, [leftWall, rightWall]);
        
        var imgs = [];
        
        $mainClones.each(function(){
            
            $(this).children().each(function(i){
                
                if(!imgs[i]){
                    imgs[i] = $(this);
                } else {
                    imgs[i] = imgs[i].add( this );
                }
                
            })
            
        })
        
        imgs.forEach(function(img){
            img.on('mouseover', function(){
                img.addClass('bright');
            }).on('mouseleave', function(){
                img.removeClass('bright');
            })
        })
        
        assets.objects = {
            leftWall: leftWall,
            rightWall: rightWall,
        }
        
        assets.elements = {
            $main: $mainClones,
            imgs: imgs
        }
        
    },
    
    onBeforeInsert: function(){
      
        var renderer = this.renderer();
        var assets = this.assets();
        
        //renderer.camera.fov = 40;
        //renderer.camera.updateProjectionMatrix();

        assets.elements.imgs.forEach(function(img){
            img.addClass('fade-out');
        })
        
    },
    
    onAfterInsert: function(){
        
        var assets = this.assets();
        
        assets.elements.imgs.forEach(function(img, i){
            setTimeout(function(){
                img.removeClass('fade-out');
            }, i * 50);
        })
        
        assets.objects.leftWall.scrollTo(0);
    },
    
    onTransitionOut: function(done){
        
        var assets = this.assets();
        
        assets.elements.imgs.forEach(function(img, i){
            setTimeout(function(){
                img.addClass('fade-out');
            }, i * 50);
        })
        
        setTimeout(done, assets.elements.imgs.length * 50 + 500);
        
    },
    
    onLayout: function(){
        
        var fovV = THREE.Math.degToRad(this.renderer().camera.fov);
        
        var assets = this.assets();
        var objects = assets.objects;
        var elements = assets.elements;
        
        var w = window.innerWidth;
        var h = window.innerHeight;
        
        var tanHalfFov = Math.tan(fovV/2);
        var near = (h/2) / tanHalfFov;
        
        var depth = w * .5;
        var far = near + depth;
        
        var halfFovH = Math.atan( (w/h) * tanHalfFov );
        
        var widthAtFar = 2 * far * Math.tan(halfFovH);
        
        var leftWallRatio = 0.7;
        var rightWallRatio = 1 - leftWallRatio;
        
        var leftWallScreenWidth = leftWallRatio * widthAtFar;
        var rightWallScreenWidth = rightWallRatio * widthAtFar;
        
        var depthSquared = Math.pow(depth, 2);
        
        var leftWallWidth = Math.sqrt( depthSquared + Math.pow(leftWallScreenWidth, 2) );
        var leftWallX = (-widthAtFar/2) + (leftWallScreenWidth / 2);
        
        var rightWallWidth = Math.sqrt( depthSquared + Math.pow(rightWallScreenWidth, 2) );
        var rightWallX = (widthAtFar/2) - (rightWallScreenWidth/2);
        
        var leftWallAngle = Math.atan2(-depth, leftWallScreenWidth);
        var rightWallAngle = Math.atan2(depth, rightWallScreenWidth);
        
        var wallZ = -near - depth/2;

        objects.leftWall.setPosition({
          w: leftWallWidth,
          h: h,
          x: leftWallX,
          y: 0,
          z: wallZ,
          ry: leftWallAngle
        });
        
        objects.rightWall.setPosition({
          w: rightWallWidth,
          h: h,
          x: rightWallX,
          y: 0,
          z: wallZ,
          ry: rightWallAngle
        });
        
        objects.leftWall.scroll(0);
        
        elements.$main.height(h);
        
    },
    
    onScroll: function(delta){
        
        this.assets().objects.leftWall.scroll(delta);
        
    }
    
})


/*

router.route('work', {
    
    compile: function(assets){
        
        var $template = assets.$template;
        
        var $main = $template.filter('.work-main');
        
        var $mainClones = $();
        
        var topFloor = new SuperFace();
        $mainClones = $mainClones.add( topFloor.cloneContent($main) );
        
        var wall = new SuperFace();
        $mainClones = $mainClones.add( wall.cloneContent($main) );
        wall.chainTo(topFloor);
        
        var bottomFloor = new SuperFace();
        $mainClones = $mainClones.add( bottomFloor.cloneContent($main) );
        bottomFloor.chainTo(wall);
        
        assets.objects = {
            topFloor: topFloor,
            wall: wall,
            bottomFloor: bottomFloor
        }
        
    },
    
    onBeforeInsert: function(){
        
        var renderer = this.renderer();
        var camera = renderer.camera;
        
        //camera.rotation.x = -Math.PI / 16;
        camera.updateProjectionMatrix();
        
    },
    
    onLayout: function(){
        
        var assets = this.assets();
        var objects = assets.objects;
        
        var fov = THREE.Math.degToRad(this.renderer().camera.fov);
        var w = window.innerWidth;
        var h = window.innerHeight;
        
        var near = (h/2) / Math.tan(fov/2);
        
        var marginY = 75;
        
        objects.topFloor.setPosition({
            x: 0,
            y: h/2 - marginY,
            z: -near - marginY/2,
            w: w,
            h: marginY,
            rx: -Math.PI / 2
        })
        
        objects.wall.setPosition({
            x: 0,
            y: 0,
            z: -near,
            w: w,
            h: h - marginY*2
        })
        
        objects.bottomFloor.setPosition({
            x: 0,
            y: -h/2 + marginY,
            z: -near + marginY/2,
            w: w,
            h: marginY,
            rx: -Math.PI / 2
        })
        
        objects.topFloor.scrollTo(0);
        
    },
    
    onScroll: function(delta){
        
        this.assets().objects.topFloor.scroll(delta);
        
    }
    
})


/*
router.route('work', {
    
    compile: function(assets){
        
        var $template = assets.$template;
        
        var $main = $template.filter('.main');
        
        var $mainClones = $();
        
        var wall = new SuperFace();
        $mainClones = $mainClones.add(wall.cloneContent($main));
        
        var floor = new SuperFace();
        $mainClones = $mainClones.add(floor.cloneContent($main));
        floor.chainTo(wall);
        
        assets.objects = {
            floor: floor,
            wall: wall
        }
        
        assets.elements = {
            $main: $mainClones
        }
        
    },
    
    onLayout: function(){
        
        var assets = this.assets();
        var objects = assets.objects;
        var elements = assets.elements;
        
        var fov = THREE.Math.degToRad(this.renderer().camera.fov);
        var w = window.innerWidth;
        var h = window.innerHeight;
        
        var near = (h/2) / Math.tan(fov/2);
        
        objects.wall.scrollTo(0);
        
    },
    
    onScroll: function(delta){
        this.assets().objects.wall.scroll(delta);
    }
    
})
*/
/* router.route('work', {
        
    compile: function(assets){
        
        var $template = assets.$template;
        
        var $main = $template.filter('.main');
        
        var $mainClones = $();
        
        var ceiling = new SuperFace();
        $mainClones = $mainClones.add(ceiling.cloneContent($main));
        
        var backWall = new SuperFace();
        $mainClones = $mainClones.add(backWall.cloneContent($main));
        backWall.chainTo(ceiling);
        
        var floor = new SuperFace();
        $mainClones = $mainClones.add(floor.cloneContent($main));
        floor.chainTo(backWall);
        
        assets.objects = {
            ceiling: ceiling,
            backWall: backWall,
            floor: floor
        }
        
        assets.elements = {
            $main: $mainClones
        }
        
    },
    
    onInsert: function(){
        assets.objects.ceiling.scrollTo(0);
    },
    
    onLayout: function(){
        
        var assets = this.assets();
        
        var fov = THREE.Math.degToRad(this.renderer().camera.fov);
        
        var w = window.innerWidth;
        var h = window.innerHeight;
        
        var tanHalfFov = Math.tan(fov/2);
        
        var far = (h/2) / tanHalfFov;
        
        var marginY = 75;
        
        var depth = marginY / tanHalfFov;
        
        var marginX = marginY * (window.innerWidth / window.innerHeight);
        
        //var far = near + depth;
        
        assets.objects.ceiling.setPosition({
            x: 0,
            y: h/2 - marginY,
            z: -far + depth/2,
            rx: Math.PI / 2,
            w: w - marginX * 2,
            h: depth
        });
        
        assets.objects.backWall.setPosition({
            x: 0,
            y: 0,
            z: -far,
            w: w - marginX * 2,
            h: h - marginY * 2
        });
        
        assets.objects.floor.setPosition({
            x: 0,
            y: -h/2 + marginY,
            z: -far + depth/2,
            rx: -Math.PI/2,
            w: w - marginX * 2,
            h: depth
        });
        
        assets.objects.ceiling.scroll(0);
        
    },
    
    onScroll: function(delta){
        
        this.assets().objects.ceiling.scroll(delta);
        
    }
    
})
*/