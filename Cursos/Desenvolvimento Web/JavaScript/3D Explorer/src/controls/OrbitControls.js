import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function setupOrbitControls(camera, renderer) {
    const controls = new OrbitControls(camera, renderer.domElement);
    
    // Configurações para movimento mais suave
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Limitar zoom
    controls.minDistance = 2;
    controls.maxDistance = 20;
    
    // Limitar rotação vertical
    controls.maxPolarAngle = Math.PI / 2;
    
    return controls;
}