(function ($) {
	
	$.fn.reduce = function(fnReduce, valueInitial) {
		
		if (Array.prototype.reduce) {
			return Array.prototype.reduce.call(this, function(memo, item, i, list){
				return fnReduce.call(item, memo, item, i, list);
			}, valueInitial);
		}
		
		var collection = this;
		
		$.each(arr, function(i, value) {
			valueInitial = fnReduce.call(value, valueInitial, value, i, collection);
		});
		
		return valueInitial;
	};
	
	$.fn.getWidth = function(){
		var element = this[0];
		return element.clientWidth + parseFloat(element.style.marginLeft || 0) + parseFloat(element.style.marginRight || 0);
	}

	$.fn.getHeight = function(){
		var element = this[0];
		return element.clientHeight + parseFloat(element.style.marginTop || 0) + parseFloat(element.style.marginBottom || 0);
	}

})(Zepto);