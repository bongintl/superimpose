function SlowNumber(value, speed, onChange){
	this.target = this.current = value || 0;
	this.speed = speed || .1;
	this.onChange = onChange || function(){};
}

SlowNumber.prototype.get = function(){
	return this.current;
}

SlowNumber.prototype.set = function(value){
	this.target = value;
	if(this.target !== this.current) SlowNumber.start(this);
}

SlowNumber.active = [];

SlowNumber.running = false;

SlowNumber.start = function(sn){
	
	this.active.push(sn);
	
	if(!this.running) rAF.start( this.tick.bind(this) );
	
}

SlowNumber.tick = function(now, dT){
	
	this.active.forEach(function(sn){
		sn.current += (sn.target - sn.current) * sn.speed * Math.min(dT / 1000, 1);
	})
	
	this.active = this.active.filter(function(sn){
		return Math.abs(sn.current - sn.target) >= Number.EPSILON;
	})
	
	if(!this.running.length) return false;
	
}