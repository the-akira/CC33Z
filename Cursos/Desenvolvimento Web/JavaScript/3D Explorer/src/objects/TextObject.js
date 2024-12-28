import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export function createTextObject(content, options = {}) {
    return new Promise((resolve, reject) => {
        const fontLoader = new FontLoader();

        fontLoader.load(
            'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', // Use um caminho válido para uma fonte no formato JSON
            (font) => {
                const geometry = new TextGeometry(content, {
                    font: font,
                    size: options.size || 1,
                    height: options.height || 0.2,
                    curveSegments: options.curveSegments || 12,
                    bevelEnabled: options.bevelEnabled || false,
                    bevelThickness: options.bevelThickness || 0.03,
                    bevelSize: options.bevelSize || 0.02,
                    bevelSegments: options.bevelSegments || 5,
                });

                const material = new THREE.MeshStandardMaterial({
                    color: options.color || 0xffffff,
                });

                const textMesh = new THREE.Mesh(geometry, material);
                textMesh.userData.textContent = content;
                textMesh.userData.color = options.color;
                textMesh.name = 'textObject';
                resolve(textMesh);
            },
            undefined,
            (error) => reject(error)
        );
    });
}