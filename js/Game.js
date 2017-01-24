var camera, controls, scene, renderer, container;
textureLoader = new THREE.TextureLoader()
init();
animate();
function getHeightData(img) {
  canvas = document.createElement( 'canvas' );
  canvas.width = 128;
  canvas.height = 128;
  context = canvas.getContext( '2d' );
  size = 128 * 128, data = new Float32Array( size );
  context.drawImage(img,0,0);
  for ( i = 0; i < size; i ++ ) {
    data[i] = 0
  }
  imgd = context.getImageData(0, 0, 128, 128);
  pix = imgd.data;
  j=0;
  for ( i = 0, n = pix.length; i < n; i += (4)) {
    all = pix[i]+pix[i+1]+pix[i+2];
    data[j++] = all/30;
  }
  return data;
}
function init() {
  container = document.createElement('div');
  document.body.appendChild(container);
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2( 0xcccccc, 0.00005 );
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor( scene.fog.color );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );
  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 20000 );
  camera.position.y = 9000;

  controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.enableZoom = true;
    img = new Image();
    img.onload = function () {
      data = getHeightData(img);
      geometry = new THREE.PlaneGeometry(32000,32000,127,127);
      for ( i = 0; i<geometry.vertices.length; i++ ) {
        geometry.vertices[i].z = 220*data[i];
      }
      Texture = new textureLoader.load("data/grass.png");
      Texture.wrapS = Texture.wrapT = THREE.RepeatWrapping;
      Texture.repeat.set( 16, 16 );
      material = new THREE.MeshPhongMaterial( { map: Texture, shininess: 0.1 } );
      plane = new THREE.Mesh( geometry, material );
      plane.rotation.x = -Math.PI / 2;
      scene.add(plane);
};
  img.src = "data/map.png";
  light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 1, 1, 1 );
  scene.add( light );
  light = new THREE.DirectionalLight( 0x002288 );
  light.position.set( -1, -1, -1 );
  scene.add( light );
  light = new THREE.AmbientLight( 0x222222 );
  scene.add( light );
  window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
  requestAnimationFrame( animate );
  controls.update();
  render();
}
function render() {
  renderer.render( scene, camera );
}
