var config = require('./config.js')
config.$element = $(config.element);

var common = require('./routes/common.js');
var home = require('./routes/home.js');
var info = require('./routes/info.js');
var work = require('./routes/work.js');
var project = require('./routes/project.js');

module.exports = function(){
    
    // if( !$('body').hasClass('holding') ) page.base('/index.php');
    page( '*', common.getTemplate, common.transitionOut, common.go );
    page( '/', home );
    page( '/home', home );
    page( '/about', info );
    page( '/team', work );
    page( '/work', work );
    page( '/project/:slug', project );
    page( '/archive', work );
    page( '/services-unknown', work );
    page( '/post/:slug', project );
    page();
    
};