// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create platonic solids
const solids = [];
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];

// Create tetrahedron
let geometry = new THREE.TetrahedronGeometry(2, 0);
let material = new THREE.MeshStandardMaterial({
  color: colors[0],
  metalness: 0.3,
  roughness: 0.5,
});
let tetrahedron = new THREE.Mesh(geometry, material);
tetrahedron.position.x = -4;
tetrahedron.position.y = -2;
solids.push(tetrahedron);

// Create cube
geometry = new THREE.BoxGeometry(2, 2, 2);
material = new THREE.MeshStandardMaterial({
  color: colors[1],
  metalness: 0.3,
  roughness: 0.5,
});
const cube = new THREE.Mesh(geometry, material);
cube.position.x = -5;
cube.position.y = 2.2;
solids.push(cube);

// Create octahedron
geometry = new THREE.OctahedronGeometry(2, 0);
material = new THREE.MeshStandardMaterial({
  color: colors[2],
  metalness: 0.3,
  roughness: 0.5,
});
const octahedron = new THREE.Mesh(geometry, material);
octahedron.position.y = 4.6;
octahedron.position.x = -0.9;
solids.push(octahedron);

// Create dodecahedron
geometry = new THREE.DodecahedronGeometry(2, 0);
material = new THREE.MeshStandardMaterial({
  color: colors[3],
  metalness: 0.3,
  roughness: 0.5,
});
const dodecahedron = new THREE.Mesh(geometry, material);
dodecahedron.position.x = 3.85;
dodecahedron.position.y = 2.6;
solids.push(dodecahedron);

// Create icosahedron
geometry = new THREE.IcosahedronGeometry(2, 0);
material = new THREE.MeshStandardMaterial({
  color: colors[4],
  metalness: 0.3,
  roughness: 0.5,
});
const icosahedron = new THREE.Mesh(geometry, material);
icosahedron.position.x = 0.85;
icosahedron.position.y = -2;
solids.push(icosahedron);

solids.forEach((solid) => {
  scene.add(solid);
});

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// Add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Position the camera
camera.position.z = 10;

// Add a resize event listener
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Create an animation loop
function animate() {
  requestAnimationFrame(animate);
  solids.forEach((solid, index) => {
    solid.rotation.x += 0.01;
    solid.rotation.y += 0.01;
    solid.material.color.setHex(colors[index % colors.length]);
  });
  renderer.render(scene, camera);
}

animate();