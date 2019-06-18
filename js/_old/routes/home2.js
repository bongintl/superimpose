router.route('home', {
    
    isDefault: true,
    
    compile: function(assets, route){

        var $template = assets.$template;
        
        var $menu = $template.filter('.home-logo-menu');
        var $main = $template.filter('.home-main');
        
        function mainClone(){
        	return $main.clone().removeClass('home-main').css('height', '50%');
        }
        
        var $loopContainer = $('<div class="home-main">').append( mainClone(), mainClone() );
        
		var ceiling = new SuperFace({loop: true});
		var floor = new SuperFace();
		var leftWall = new SuperFace();
		var rightWall = new SuperFace();
		
		var $mainClones = SuperFace.cloneAndChain($loopContainer, [ceiling, rightWall, floor, leftWall]);
		
		var backWall = new SuperFace();
		backWall.addContent($menu);
		
		var $overlay = $('<div class="home-overlay">');
		
		var imgs = [];
		
		$mainClones.each(function(i){
			
			$(this).children().children().each(function(){
				
				var $img = $(this);
				var offsetPct = $img.css('top');
				var offset = Number( offsetPct.slice(0, -1) ) / 100;
				var offsetRad = scale(offset, 0, 1, -Math.PI, Math.PI);
				
				var collection = imgs.find(function(c){
					return c.offset === offsetRad;
				});
				
				if(collection){
					collection.$elements = collection.$elements.add($img);
				} else {
					imgs.push({
						$elements: $img,
						offset: offsetRad
					})
				}

			})
			
		});
		
		route.data.mouse = {x: 0, y: 0};
		
		$overlay.on('mousemove', function(e){
			route.data.mouse.x = e.clientX;
			route.data.mouse.y = e.clientY;
		}).on('click', this.navigator().go.bind(null, '/work'));

		assets.objects = {
		    leftWall: leftWall,
		    backWall: backWall,
		    rightWall: rightWall,
		    ceiling: ceiling,
		    floor: floor
		}
		
		assets.elements = {
			$main: $mainClones,
			$menu: $menu,
			$overlay: $overlay,
			$imgs: imgs
		}
		
    },
    
    onBeforeInsert: function(){
    	
        var renderer = this.renderer();
        var assets = this.assets();
        
        renderer.$element.append(assets.elements.$overlay);
        
        renderer.camera.fov = 45;
        renderer.camera.updateProjectionMatrix();
        
        assets.elements.$menu.addClass('fade-out');
        assets.elements.$main.addClass('fade-out');
        
        var ceiling = assets.objects.ceiling;
        var imgs = assets.elements.$imgs;
        
        ceiling.autoScroll();
        
		var lastAngle = 0;
		
		var TAU = Math.PI * 2;
		var QUARTER_PI = Math.PI / 4;
		
		var route = this.route();
		
		var acceleration = 0;
        
		rAF.start('homeMousemove', function(){
			
			var cMX = route.data.mouse.x - window.innerWidth/2;
			var cMY = route.data.mouse.y - window.innerHeight/2;
			
			var angle = Math.atan2( cMY, cMX );
			
			angle -= QUARTER_PI;
			
			angle = wrap(angle - QUARTER_PI, -Math.PI, Math.PI);
			
			var angleDelta = wrap(angle - lastAngle, -Math.PI, Math.PI);
			
			var dist = Math.sqrt(Math.pow(cMX, 2) + Math.pow(cMY, 2));
			
			acceleration += -angleDelta * dist * 0.03;
			
			ceiling.scroll(acceleration);
			
			acceleration *= 0.9;
			
			var scrollTopRad = scale(ceiling.scrollTop, 0, ceiling.maxScroll, -Math.PI, Math.PI);
			
			imgs.forEach(function(img){
				
				var angleOffset = wrap(angle - img.offset + scrollTopRad, -Math.PI, Math.PI);
				
				img.$elements.css('opacity', Math.abs(angleOffset / Math.PI));
				
			})
			
			lastAngle = angle;
			
		})
        
    },
    
    onAfterInsert: function(){
        
        var elements = this.assets().elements;
        
        setTimeout(function(){
        	elements.$main.removeClass('fade-out');
        }, 0);
        
        setTimeout(function(){
            elements.$menu.removeClass('fade-out');
        }, 500)
        
        //this.assets().objects.ceiling.scrollTo(1);
        
    },
    
    onTransitionOut: function(done){
    	
    	var elements = this.assets().elements;
    	
    	elements.$overlay.detach();
    	
    	elements.$main.addClass('fade-out');
        
        setTimeout(function(){
            //elements.$logo.addClass('fade-out');
            elements.$menu.addClass('fade-out');
        }, 500)
        
        rAF.stop('homeMousemove');
        
        setTimeout(done, 1000);
    },
    
    onLayout: function(){
        
        var assets = this.assets();
        var objects = assets.objects;
        var elements = assets.elements;
        var camera = this.renderer().camera;
        
        var W = window.innerWidth;
        var H = window.innerHeight;
        
        var fovV = THREE.Math.degToRad(camera.fov);
        
        var NEAR = (H/2) / Math.tan(fovV/2);
        var D = 1000//Math.min(window.innerHeight, window.innerWidth);
        var FAR = NEAR - D;
        
		objects.backWall.setPosition({
			x: 0,
			y: 0,
			z: -NEAR - D,
			w: W,
			h: H
		});
		
		objects.leftWall.setPosition({
			x: -W/2,
			y: 0,
			z: -NEAR - D/2,
			w: D,
			h: H,
			ry: Math.PI / 2,
			rx: Math.PI
		});
		
		objects.rightWall.setPosition({
			x: W/2,
			y: 0,
			z: -NEAR - D/2,
			w: D,
			h: H,
			ry: -Math.PI / 2
		});
	    
	    objects.floor.setPosition({
			x: 0,
			y: -H/2,
			z: -NEAR - D/2,
			w: D,
			h: W,
			rx: -Math.PI / 2,
			rz: -Math.PI / 2
		});
		
		objects.ceiling.setPosition({
			x: 0,
			y: H/2,
			z: -NEAR - D/2,
			w: D,
			h: W,
			rx: Math.PI / 2,
			rz: Math.PI / 2
		});
		
		objects.leftWall.scrollTo(0);
		
		elements.$main.height(W*4 + H*4);
		objects.ceiling.clampScroll(0, W*2 + H*2);
		
    }
    
});