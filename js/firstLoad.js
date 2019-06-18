var firstLoad = {
    is: true,
    done: function(){
        $('body').removeClass('first-load');
        firstLoad.is = false;
    }
}

module.exports = firstLoad;