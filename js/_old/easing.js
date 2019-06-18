var Easing = {
    linear: function(x){
        return x;
    },
    easeIn: function(x){
        return Math.pow(x, 2);
    },
    easeOut: function(x){
        return 1 - Math.pow(x-1, 2);
    },
    cubicIn: function(x){
        return Math.pow(x, 3);
    },
    cubicOut: function(x){
        return 1-Math.pow(1-x,3);
    },
    cubicInOut: function(x){
        if(x < 0.5) return Easing.cubicIn(x*2)/2;
        return 1-Easing.cubicIn((1-x)*2)/2; 
    },
    quadIn: function(x){
        return Math.pow(x, 4);
    },
    quadOut: function(x){
        return 1-Math.pow(1-x,4);
    },
    quadInOut: function(x){
        if(x < 0.5) return Easing.quadIn(x*2)/2;
        return 1-Easing.quadIn((1-x)*2)/2; 
    },
    easeInOut: function(x){
        if (x > .5) return Easing.easeIn(x);
        return Easing.easeOut(x);
    },
    bounce: function(x) {
        if (x < (1 / 2.75)) {
            return 7.6 * x * x;
        } else if (x < (2 /2.75)) {
            return 7.6 * (x -= (1.5 / 2.75)) * x + 0.74;
        } else if (x < (2.5 / 2.75)) {
            return 7.6 * (x -= (2.25 / 2.75)) * x + 0.91;
        } else {
            return 7.6 * (x -= (2.625 / 2.75)) * x + 0.98;
        }
    }
}