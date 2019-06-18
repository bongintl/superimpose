var TUNNEL_LENGTH = 500;
var TRANSITION_IN_DURATION = 8000;

router.route('home', {
	
	isDefault: true,
	
	compile: function(assets, route){
		
		var navigator = this.navigator();
		
		var $imgs = assets.$template.filter('.home-img');
		var $logo = assets.$template.filter('.home-logo');
		
		$logo.on('click', this.navigator().go.bind(this, 'work'));
		
		var $logoTitle = $logo.children('.home-logo__inner-ss');
		var $logoProjectTitle = $logo.children('.home-logo__inner-project');
		
		var $projectTitleText = $logoProjectTitle.children('.home-logo__project-title');
		var $clientText = $logoProjectTitle.children('.home-logo__client');
		
		assets.logo = new ResizableCSS3DObject($logo);
		
		var sides = ['top', 'left', 'bottom', 'right'];
		
		var scene = this.renderer().scene;
		
		assets.imgs = _.map(sides, function(side, i){
			
			var $clones = $imgs.clone();
			
			var axis = i % 2 === 0 ? 'x' : 'y';
			
			return _.map($clones, function(img, j){
				
				var $img = $(img);
				
				$img.mouseenter(function(){
					
					$logo.addClass('home-logo_show-project-title')
					$projectTitleText.text( $img.data('title') );
					$clientText.text( $img.data('client') );
					
				}).mouseleave(function(){
					
					$logo.removeClass('home-logo_show-project-title');
					
				}).click(function(){
					navigator.go( 'project/' + $img.data('slug') );
				})
				
				img =  new SuperSingleton({
					$element: $img,
					axis: axis
				})
				
				switch(side){
					
					case 'top':
						img.rotation.x = Math.PI / 2;
						img.rotation.z = Math.PI / 2;
						break;
						
					case 'left':
						img.rotation.y = Math.PI / 2;
						img.rotation.x = Math.PI;
						break;
						
					case 'bottom':
						img.rotation.x = -Math.PI / 2;
						img.rotation.z = -Math.PI / 2;
						break;
					
					case 'right':
						img.rotation.y = -Math.PI / 2;
					
				}
				
				return img;
				
			})
			
		});
		
		_.each($imgs, function(img, i){
			
			var x = Math.random();
			var y = i / $imgs.length;
			
			_.each(assets.imgs, function(imgs, side){
				imgs[i].contentOffset = {
					x: x,
					y: y
				};
			})
			
		});
		
		assets.allImages = [];
		
		assets.imgs.forEach(function(imgs){
			assets.allImages = assets.allImages.concat(imgs);
		})
		
		assets.scrollTop = 0;
		
	},
	
	onBeforeInsert: function(){
		
        var renderer = this.renderer();
        var assets = this.assets();
        
        renderer.scene.add(assets.logo);
        
        var mouse = {
        	x: window.innerWidth / 2,
        	y: window.innerHeight / 2
        }
        
        var lastMouse = mouse;
        
        $(window).on('mousemove.home', function(e){
        	mouse.x = e.clientX;
        	mouse.y = e.clientY;
        })
        
        assets.startTime = Date.now();
        assets.transitionDuration = TRANSITION_IN_DURATION;
        
        assets.tick = function(now){
        	
        	var elapsed = now - assets.startTime;
        	
        	var normalizedElapsed = elapsed / assets.transitionDuration;
        	normalizedElapsed = Easing.easeOut(normalizedElapsed);
        	
        	var remains = (assets.transitionDuration - elapsed) / assets.transitionDuration;
        	
            var currentMouse = {
                x: lastMouse.x + (mouse.x - lastMouse.x) * 0.01,
                y: lastMouse.y + (mouse.y - lastMouse.y) * 0.01
            }
        	
        	var scrollTop = wrap(elapsed / 10, 0, assets.contentHeight);
        	
        	var cursor2 = new THREE.Vector2(mouse.x - window.innerWidth/2, -mouse.y + window.innerHeight / 2);
        	
        	assets.allImages.forEach(function(img){
				img.setScroll(scrollTop, renderer.scene);
				img.setOpacity( cursor2 );
        	})
        	
        	//renderer.camera.rotation.x += -scale(currentMouse.y, 0, window.innerHeight, -Math.PI/2, Math.PI/2);
        	//renderer.camera.rotation.y += -scale(currentMouse.x, 0, window.innerWidth, -Math.PI/2, Math.PI/2);
        	
        	//renderer.camera.rotation.x *= .3;
        	//renderer.camera.rotation.y *= .3;
        	
        	if(elapsed <= assets.transitionDuration) {
        		//renderer.camera.position.z = Math.max(scale(normalizedElapsed, 0, 1, assets.near * 2, 0), 0);
        		//renderer.camera.fov = scale(normalizedElapsed, 0, 1, 160, WORK_FOV);
        		//renderer.camera.updateProjectionMatrix();
        	}
        	
			renderer.render();
			
			lastMouse = currentMouse;
			
			//if(elapsed >= assets.transitionDuration) return false;
			
        }
        
	},
	
	onAfterInsert: function(){
		
		var assets = this.assets();
		
		assets.allImages.forEach(function(img){
			img.$element.removeClass('fade-out');
		})
		
		assets.logo.$element.removeClass('fade-out');
		
	},
	
	onLayout: function(){
		
		var assets = this.assets();
		var renderer = this.renderer();
		
		var w = window.innerWidth;
		var h = window.innerHeight;
		
		var near = renderer.getPerfectZ();
		
		var depth = Math.min(w, h);
		
		var far = near - depth;
		
		var logo = assets.logo;
		
		logo.resize(w, h);
		logo.position.z = far;
		
		var wallX = w/2;
		var wallY = h/2;
		var wallZ = (near + far) / 2;
		
		var contentHeight = h*2 + w*2;
		var maxImageHeight = Math.min(h, w) / 2;
		
		_.each(assets.imgs, function(imgs, side){
			
			_.each(imgs, function(img, i){
				
				var nativeHeight = img.$element.data('height');
				var nativeWidth = img.$element.data('width');
				
				if(nativeHeight > maxImageHeight){
					img.resize( (maxImageHeight / nativeHeight) * nativeWidth , maxImageHeight);
				} else {
					img.resize(nativeWidth, nativeHeight);
				}
				
				img.getZ(near, far);
				img.setContentSize(depth, contentHeight);
				
				var depthOffset = i/10;
				
				switch(side){
					
					case 0:
						img.position.y = wallY - depthOffset;
						img.setAxisLimits(wallX, -wallX);
						img.scrollOffset = 0;
						img.scrollHeight = w;
						break;
						
					case 1:
						img.position.x = -wallX + depthOffset;
						img.setAxisLimits(wallY, -wallY);
						img.scrollOffset = w;
						img.scrollHeight = h;
						break;
						
					case 2:
						img.position.y = -wallY + depthOffset;
						img.setAxisLimits(-wallX, wallX);
						img.scrollOffset = w + h;
						img.scrollHeight = w;
						break;
						
					case 3:
						img.position.x = wallX - depthOffset;
						img.setAxisLimits(-wallY, wallY);
						img.scrollOffset = w + h + w;
						img.scrollHeight = h;
						break;
					
				}
				
				img.setScroll(0, renderer.scene);
				
			})
			
		})
		
		assets.contentHeight = contentHeight;
		
		rAF.start('home', assets.tick);
		
		setScroll(false, false);
		
	},
	/*
	onScroll: function(delta){
		
		var assets = this.assets();
		var renderer = this.renderer();
		
		assets.scrollTop += delta;
		
		assets.scrollTop = wrap(assets.scrollTop, 0, assets.contentHeight);
		
    	assets.allImages.forEach(function(img){
			img.setScroll(assets.scrollTop, renderer.scene);
    	})
    	
    	renderer.render();
	
	},
	*/
	onTransitionOut: function(done){
		
		var assets = this.assets();
		var renderer = this.renderer();
		
		$(window).off('mousemove.home');
		
		assets.allImages.forEach(function(img){
			img.$element.addClass('fade-out');
		})
		
		assets.logo.$element.addClass('fade-out');
		
		setTimeout(function(){
			assets.allImages.forEach(function(img){
				img.detach(renderer.scene);
			})
			renderer.scene.remove(assets.logo);
			rAF.stop('home');
			done();
		}, 1000);
		
	}
	
})