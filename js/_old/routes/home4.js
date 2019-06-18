var TUNNEL_LENGTH = 500;
var TRANSITION_IN_DURATION = 3000;

router.route('home', {
	
	isDefault: true,
	
	compile: function(assets, route){
		
		var $imgs = assets.$template.filter('.home-img');
		var $logo = assets.$template.filter('.home-logo');
		
		$logo.on('click', this.navigator().go.bind(this, 'work'));
		
		assets.logo = new ResizableCSS3DObject($logo);
		
		var sides = ['top', 'left', 'bottom', 'right'];
		
		var scene = this.renderer().scene;
		
		assets.imgs = _.map(sides, function(side, i){
			
			var $clones = $imgs.clone();
			
			var axis = i % 2 === 0 ? 'x' : 'y';
			
			return _.map($clones, function(img){
				
				var $img = $(img);
				
				img =  new SuperSingleton({
					$element: $img,
					axis: axis
				})
				
				img.resize( $img.data('width'), $img.data('height') );
				
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
			var y = Math.random();
			
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
		
	},
	
	onBeforeInsert: function(){
		
        var renderer = this.renderer();
        var assets = this.assets();
        
        renderer.scene.add(assets.logo);
        
		assets.allImages.forEach(function(img){
			img.$element.css('opacity', 1);
		})
		
		assets.logo.$element.css('opacity', 1);
        
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
        	
        	var scrollTop = elapsed / 10;
        	
        	assets.allImages.forEach(function(img){
				img.setScroll(scrollTop, renderer.scene);
        	})
        	
        	
        	renderer.camera.rotation.x += -scale(currentMouse.y, 0, window.innerHeight, -Math.PI/2, Math.PI/2);
        	renderer.camera.rotation.y += -scale(currentMouse.x, 0, window.innerWidth, -Math.PI/2, Math.PI/2);
        	
        	renderer.camera.rotation.x *= .3;
        	renderer.camera.rotation.y *= .3;
        	
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
	
	onLayout: function(){
		
		var assets = this.assets();
		var renderer = this.renderer();
		
		var w = window.innerWidth;
		var h = window.innerHeight;
		
		var marginX = getMarginX();
		var marginY = getMarginY();
		
		var backWallW = w - marginX*2;
		var backWallH = h - marginY*2;
		
		var far = renderer.getPerfectZ(WORK_FOV);
		var depth = backWallW;
		var near = far + depth;
		
		assets.near = near;
		
		var logo = assets.logo;
		
		logo.resize(backWallW, backWallH);
		logo.position.z = far;
		
		var wallX = (w/2) - marginX;
		var wallY = (h/2) - marginY;
		var wallZ = (far + near) / 2;
		
		_.each(assets.imgs, function(imgs, side){
			
			_.each(imgs, function(img){
				
				img.getZ(near, far);
				
				img.setContentSize(depth, backWallH*2 + backWallW*2);
				
				switch(side){
					
					case 0:
						img.position.y = wallY + Math.random();
						img.setAxisLimits(wallX, -wallX);
						img.scrollOffset = 0;
						img.scrollHeight = backWallW;
						break;
						
					case 1:
						img.position.x = -wallX + Math.random();
						img.setAxisLimits(wallY, -wallY);
						img.scrollOffset = backWallW;
						img.scrollHeight = backWallH;
						break;
						
					case 2:
						img.position.y = -wallY + Math.random();
						img.setAxisLimits(-wallX, wallX);
						img.scrollOffset = backWallW + backWallH;
						img.scrollHeight = backWallW;
						break;
						
					case 3:
						img.position.x = wallX + Math.random();
						img.setAxisLimits(-wallY, wallY);
						img.scrollOffset = backWallW*2 + backWallH;
						img.scrollHeight = backWallH;
						break;
					
				}
				
				img.setScroll(0, renderer.scene);
				
			})
			
		})
		
		rAF.start('home', assets.tick);
		
	},
	
	onTransitionOut: function(done){
		
		var assets = this.assets();
		var renderer = this.renderer();
		
		assets.allImages.forEach(function(img){
			img.$element.css('opacity', 0);
		})
		
		assets.logo.$element.css('opacity', 0);
		
		$(window).off('mousemove.home');
		
		var now = Date.now();
		var elapsed = now - assets.startTime;
		
		if(elapsed < assets.transitionDuration){
		
			var remains = assets.transitionDuration - elapsed;
			
			var timeScale = 1800 / remains;
			
			assets.startTime = scale(now, assets.startTime, assets.startTime + assets.transitionDuration, assets.startTime, now );
			
			assets.transitionDuration *= timeScale;
			assets.startTime = now + 1800 - assets.transitionDuration;
		
		}
		
		setTimeout(function(){
			assets.allImages.forEach(function(img){
				img.detach(renderer.scene);
			})
			done();
			rAF.stop('home');
		}, 1800);
		
		setTimeout(function(){
			renderer.scene.remove(assets.logo);
		}, 7500);
		
	}
	
})