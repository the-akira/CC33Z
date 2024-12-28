import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export function loadGLBModel(file) {
    return new Promise((resolve, reject) => {
        const gltfLoader = new GLTFLoader();
        
        const reader = new FileReader();
        reader.onload = () => {
            const arrayBuffer = reader.result;
            const blob = new Blob([arrayBuffer], { type: file.type });
            const url = URL.createObjectURL(blob);
            
            gltfLoader.load(
                url,
                (gltf) => {
                    const model = gltf.scene;
                    model.name = file.name.split('.')[0] || 'GLBModel';
                    model.position.set(0, 0.5, 0); // Posição inicial
                    resolve(model);
                },
                undefined,
                (error) => reject(error)
            );
        };
        
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
}