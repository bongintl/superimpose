router.route('home2', {
    
    isDefault: true,
    
    compile: function(assets){

        var $template = assets.$template;
        
        var $logo = $template.filter('.home-logo');
        var $menu = $template.filter('.home-menu');
        var $main = $template.filter('.home-main');
        
		var ceiling = new SuperFace();
		ceiling.addContent($logo);
		
		var floor = new SuperFace();
		floor.addContent($menu);
		
		var $mainClones = $();
		
		var leftWall = new SuperFace({horizontal: true});
		$mainClones = $mainClones.add(leftWall.cloneContent($main));
        
		var backWall = new SuperFace();
		$mainClones = $mainClones.add(backWall.cloneContent($main));
		backWall.chainTo(leftWall);
		
		var rightWall = new SuperFace();
		$mainClones = $mainClones.add(rightWall.cloneContent($main));
		rightWall.chainTo(backWall);
		
		assets.objects = {
		    leftWall: leftWall,
		    backWall: backWall,
		    rightWall: rightWall,
		    ceiling: ceiling,
		    floor: floor
		}
		
		assets.elements = {
			$main: $mainClones,
			$logo: $logo,
			$menu: $menu
		}
		
    },
    
    onBeforeInsert: function(){
    	
        var renderer = this.renderer();
        var assets = this.assets();
        
        renderer.camera.fov = 45;
        renderer.camera.updateProjectionMatrix();
        
        assets.elements.$logo.addClass('fade-out');
        assets.elements.$menu.addClass('fade-out');
        assets.elements.$main.find('img').addClass('fade-out');
        
        assets.objects.leftWall.scrollTo(0);
        
    },
    
    onAfterInsert: function(){
        
        var elements = this.assets().elements;
        
    	elements.$main.each(function(){
    		
    		$(this).find('img').each(function(i){
    			var $this = $(this);
    			setTimeout(function(){
    				$this.removeClass('fade-out');
    			}, i * 50 + 500);
    		})
    		
    	})
        
        setTimeout(function(){
            elements.$logo.removeClass('fade-out');
            elements.$menu.removeClass('fade-out');
        }, 0)
        
    },
    
    onTransitionOut: function(done){
    	
    	var elements = this.assets().elements;
    	
    	elements.$main.each(function(){
    		
    		$(this).find('img').each(function(i){
    			var $this = $(this);
    			setTimeout(function(){
    				$this.addClass('fade-out');
    			}, i * 100);
    		})
    		
    	});
        
        setTimeout(function(){
            elements.$logo.addClass('fade-out');
            elements.$menu.addClass('fade-out');
        }, 0)
        
        setTimeout(done, 1000);
    },
    
    onLayout: function(){
        
        var objects = this.assets().objects;
        var camera = this.renderer().camera;
        
        var W = window.innerWidth;
        var H = window.innerHeight;
        
        var fovV = THREE.Math.degToRad(camera.fov);
        
        var NEAR = (H/2) / Math.tan(fovV/2);
        var D = Math.min(window.innerHeight, window.innerWidth);
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
			ry: Math.PI / 2
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
			h: D,
			rx: -Math.PI / 2,
		});
		
		objects.ceiling.setPosition({
			x: 0,
			y: H/2,
			z: -NEAR - D/2,
			w: D,
			h: D,
			rx: Math.PI / 2
		});
		
		objects.leftWall.scrollTo(0);
		
    },
    
    onScroll: function(delta){
        
        this.assets().objects.leftWall.scroll(delta);
        
    }
    
});