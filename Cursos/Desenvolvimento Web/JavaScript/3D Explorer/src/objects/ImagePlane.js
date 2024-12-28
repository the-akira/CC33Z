import * as THREE from 'three';

export function createImagePlane(imageUrl) {
    return new Promise((resolve, reject) => {
        const textureLoader = new THREE.TextureLoader();
        
        textureLoader.load(
            imageUrl,
            (texture) => {
                const aspect = texture.image.width / texture.image.height;
                const geometry = new THREE.PlaneGeometry(1 * aspect, 1);
                const material = new THREE.MeshBasicMaterial({
                    map: texture,
                    side: THREE.DoubleSide,
                    transparent: true
                });
                
                const plane = new THREE.Mesh(geometry, material);
                plane.name = 'image';
                plane.position.set(0, 0.5, 0);
                
                resolve(plane);
            },
            undefined,
            (error) => reject(error)
        );
    });
}