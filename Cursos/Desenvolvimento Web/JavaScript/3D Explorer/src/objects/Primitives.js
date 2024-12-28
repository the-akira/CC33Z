import * as THREE from 'three';

export function createCube(size = 1) {
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshPhongMaterial({ 
        color: Math.random() * 0xffffff,
        flatShading: true,
        transparent: true,
        opacity: 1
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, size/2, 0);
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.name = 'cube';
    return cube;
}

export function createSphere(radius = 0.5) {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshPhongMaterial({ 
        color: Math.random() * 0xffffff,
        flatShading: true,
        transparent: true,
        opacity: 1
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, radius, 0);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sphere.name = 'sphere';
    return sphere;
}

export function createCylinder(radius = 0.5, height = 1) {
    const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
    const material = new THREE.MeshPhongMaterial({ 
        color: Math.random() * 0xffffff,
        flatShading: true,
        transparent: true,
        opacity: 1
    });
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.set(0, height/2, 0);
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    cylinder.name = 'cylinder';
    return cylinder;
}

export function createTorus(radius = 0.5) {
    const geometry = new THREE.TorusGeometry(radius, radius/4, 16, 100);
    const material = new THREE.MeshPhongMaterial({ 
        color: Math.random() * 0xffffff,
        flatShading: true,
        transparent: true,
        opacity: 1
    });
    const torus = new THREE.Mesh(geometry, material);
    torus.position.set(0, radius, 0);
    torus.castShadow = true;
    torus.receiveShadow = true;
    torus.name = 'torus';
    return torus;
}

export function createCone(radius = 0.5, height = 1) {
    const geometry = new THREE.ConeGeometry(radius, height, 32);
    const material = new THREE.MeshPhongMaterial({ 
        color: Math.random() * 0xffffff,
        flatShading: true,
        transparent: true,
        opacity: 1
    });
    const cone = new THREE.Mesh(geometry, material);
    cone.position.set(0, height/2, 0);
    cone.castShadow = true;
    cone.receiveShadow = true;
    cone.name = 'cone';
    return cone;
}