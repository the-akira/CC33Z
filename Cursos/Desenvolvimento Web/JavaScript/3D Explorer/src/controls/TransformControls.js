import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

export function setupTransformControls(camera, renderer, orbitControls) {
    const controls = new TransformControls(camera, renderer.domElement);
    
    // Ajustar sensibilidade dos controles
    controls.setTranslationSnap(0.5); // Snap de 0.5 unidades para movimento
    controls.setRotationSnap(Math.PI / 12); // Snap de 15 graus para rotação
    controls.setScaleSnap(0.25); // Snap de 0.25 para escala
    
    // Desabilitar orbit controls durante transformação
    controls.addEventListener('dragging-changed', function(event) {
        orbitControls.enabled = !event.value;
    });
    
    // Teclas de atalho para modos de transformação
    window.addEventListener('keydown', function(event) {
        switch(event.key.toLowerCase()) {
            case 'g':
                controls.setMode('translate');
                break;
            case 'r':
                controls.setMode('rotate');
                break;
            case 's':
                controls.setMode('scale');
                break;
        }
    });
    
    return controls;
}