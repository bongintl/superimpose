var renderer = require('./main.js');

module.exports = {
    
    perfectZ: function (fov){
        return -( renderer.getSize().height /2) / Math.tan( THREE.Math.degToRad( fov / 2 ) );
    },
    
    fovX: function (fovY){
        
        var size = renderer.getSize();
        
        var fovY_rad = THREE.Math.degToRad( fovY );
        var aspect = size.width / size.height;
        
        var fovX_rad = 2 * Math.atan( aspect * Math.tan( fovY_rad / 2) );
        
        return THREE.Math.radToDeg( fovX_rad );
        
    }
    
}