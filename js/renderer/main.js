require('./three.cssrenderer.js');
require('./zepto.plugins.js');

var renderer = new THREE.CSS3DRenderer();
renderer.domElement.id = 'renderer';
document.body.appendChild( renderer.domElement );

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);

scene.add(camera);

function setFOV(fov){
    
    camera.fov = fov;
    
    camera.updateProjectionMatrix();
    
}

function render(){
    
    renderer.render( scene, camera );
    
}

function resize(){
    
    var w = Math.min( window.innerWidth, document.documentElement.clientWidth );
    var h = Math.min( window.innerHeight, document.documentElement.clientHeight );
    
    renderer.setSize( w, h );
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    
}

$(window).on('resize', resize);
resize();

module.exports = {
    
    scene: scene,
    
    setFOV: setFOV,
    
    render: render,
    
    resize: resize,
    
    getSize: renderer.getSize
    
}