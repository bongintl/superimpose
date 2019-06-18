require('./breakpoint.js').init( 414, 768 );
require('./navigation.js').init();
require('./isIE.js');

var firstLoad = require('./firstLoad.js');
var metrics = require('./metrics.js');

if( $('body').hasClass('three-d') ){
    require('./router/main.js')();
} else {
    require('./static.js')();
}

firstLoad.done();