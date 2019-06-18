var router = new SuperRouter({
    defaultUrl: 'home',
    apiRoot: 'http://toeplusbee.com/dev/',
    renderer: {
        Super3DRenderer: document.body
    },
    assets: {
        template: {
            transform: {
                $template: function(template){
                    return $(template);
                }
            }
        }
    }
});

$navMobile.children().on('click', function(){
    $navMobile.toggleClass('open');
})

var $socialMenu = $('.social-menu');

$('.social-toggle').on('mouseenter', function(){
    $socialMenu.addClass('open');
}).on('mouseleave', function(){
    $socialMenu.removeClass('open');
})