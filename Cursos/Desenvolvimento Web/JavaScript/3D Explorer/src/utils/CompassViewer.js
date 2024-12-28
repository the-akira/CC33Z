import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class CompassViewer {
    constructor(camera, orbitControls) {
        this.mainCamera = camera;
        this.mainControls = orbitControls;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.setupCompass();
        this.setupEventListeners();
    }

    setupCompass() {
        // Create mini viewport for compass
        const container = document.createElement('div');
        container.id = 'compass-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 485px;
            width: 100px;
            height: 100px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 50%;
            overflow: hidden;
            cursor: pointer;
        `;
        document.body.appendChild(container);

        // Setup compass scene
        this.scene = new THREE.Scene();
        
        // Setup compass camera
        this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
        this.camera.position.set(3, 3, 3);
        this.camera.lookAt(0, 0, 0);

        // Setup compass renderer
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(100, 100);
        container.appendChild(this.renderer.domElement);

        // Create clickable axis objects
        this.createAxisObjects();

        // Add axis labels
        this.addAxisLabel('X', new THREE.Vector3(2.2, 0, 0), 'red');
        this.addAxisLabel('Y', new THREE.Vector3(0, 2.2, 0), 'green');
        this.addAxisLabel('Z', new THREE.Vector3(0, 0, 2.2), 'blue');

        // Start animation
        this.animate();
    }

    createAxisObjects() {
        // Create colored materials
        const xMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const yMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const zMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });

        // Create axis lines with thickness using cylinders
        const createAxis = (material, rotation) => {
            const geometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
            const mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.setFromVector3(rotation);
            mesh.position.set(0, 0, 0);
            return mesh;
        };

        // Create axis objects
        this.xAxis = createAxis(xMaterial, new THREE.Vector3(0, 0, -Math.PI/2));
        this.yAxis = createAxis(yMaterial, new THREE.Vector3(0, 0, 0));
        this.zAxis = createAxis(zMaterial, new THREE.Vector3(Math.PI/2, 0, 0));

        // Add names for identification
        this.xAxis.name = 'x-axis';
        this.yAxis.name = 'y-axis';
        this.zAxis.name = 'z-axis';

        // Add to scene
        this.scene.add(this.xAxis);
        this.scene.add(this.yAxis);
        this.scene.add(this.zAxis);
    }

    addAxisLabel(text, position, color) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 32, 32);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        sprite.position.copy(position);
        sprite.scale.set(0.5, 0.5, 0.5);
        this.scene.add(sprite);
    }

    setupEventListeners() {
        const container = document.getElementById('compass-container');
        
        container.addEventListener('click', (event) => {
            const rect = container.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects([this.xAxis, this.yAxis, this.zAxis]);

            if (intersects.length > 0) {
                const clickedAxis = intersects[0].object.name;
                switch(clickedAxis) {
                    case 'x-axis':
                        this.setView('right');
                        break;
                    case 'y-axis':
                        this.setView('top');
                        break;
                    case 'z-axis':
                        this.setView('front');
                        break;
                }
            }
        });

        // Add hover effect
        container.addEventListener('mousemove', (event) => {
            const rect = container.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects([this.xAxis, this.yAxis, this.zAxis]);

            // Reset all axes colors
            this.xAxis.material.opacity = 1;
            this.yAxis.material.opacity = 1;
            this.zAxis.material.opacity = 1;

            if (intersects.length > 0) {
                container.style.cursor = 'pointer';
                // Highlight hovered axis
                intersects[0].object.material.opacity = 0.7;
            } else {
                container.style.cursor = 'default';
            }
        });
    }

    setView(view) {
        const distance = 10;
        let targetPosition = new THREE.Vector3();

        switch(view) {
            case 'front':
                targetPosition.set(0, 0, distance);
                break;
            case 'right':
                targetPosition.set(distance, 0, 0);
                break;
            case 'top':
                targetPosition.set(0, distance, 0);
                break;
            case 'left':
                targetPosition.set(-distance, 0, 0);
                break;
        }

        // Animate camera movement
        const startPosition = this.mainCamera.position.clone();
        const duration = 1000; // 1 second
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use easing function for smooth animation
            const eased = 1 - Math.pow(1 - progress, 3);
            
            this.mainCamera.position.lerpVectors(startPosition, targetPosition, eased);
            this.mainCamera.lookAt(0, 0, 0);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update compass camera to match main camera orientation
        this.camera.position.copy(this.mainCamera.position).normalize().multiplyScalar(3);
        this.camera.lookAt(0, 0, 0);
        
        this.renderer.render(this.scene, this.camera);
    }
}