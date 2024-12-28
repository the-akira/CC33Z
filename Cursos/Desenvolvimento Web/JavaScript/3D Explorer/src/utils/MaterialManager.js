import * as THREE from 'three';

export class MaterialManager {
    constructor() {
        this.materials = {
            standard: new THREE.MeshStandardMaterial({ 
                color: 0x808080,
                roughness: 0.5,
                metalness: 0.5,
                transparent: true,
                opacity: 1
            }),
            phong: new THREE.MeshPhongMaterial({ 
                color: 0x808080,
                shininess: 30,
                transparent: true,
                opacity: 1
            }),
            basic: new THREE.MeshBasicMaterial({ 
                color: 0x808080,
                transparent: true,
                opacity: 1
            }),
            wireframe: new THREE.MeshBasicMaterial({ 
                wireframe: true,
                color: 0x00ff00,
                transparent: true,
                opacity: 1
            }),
            glass: new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                transmission: 0.9,
                opacity: 0.3,
                metalness: 0,
                roughness: 0,
                ior: 1.5,
                thickness: 0.5,
                transparent: true
            }),
            toon: new THREE.MeshToonMaterial({
                color: 0x808080,
                transparent: true,
                opacity: 1
            }),
            normal: new THREE.MeshNormalMaterial({
                transparent: true,
                opacity: 1
            }),
            emissive: new THREE.MeshPhongMaterial({
                color: 0x808080,
                emissive: 0xff0000,
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 1
            })
        };
    }

    getMaterial(type) {
        return this.materials[type].clone();
    }

    updateMaterialProperty(object, property, value) {
        if (object && object.material) {
            object.material[property] = value;
            object.material.needsUpdate = true;
        }
    }
}