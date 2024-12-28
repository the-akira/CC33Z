import * as THREE from 'three';

export class LightControls {
    constructor(scene) {
        this.scene = scene;
        this.lights = {
            ambient: null,
            directional: null,
            point: null,
            spot: null
        };
        this.setupInitialLights();
    }

    setupInitialLights() {
        // Ambient Light
        this.lights.ambient = new THREE.AmbientLight(0x404040, 1);
        this.scene.add(this.lights.ambient);

        // Directional Light
        this.lights.directional = new THREE.DirectionalLight(0xffffff, 1);
        this.lights.directional.position.set(5, 5, 5);
        this.lights.directional.castShadow = true;
        this.scene.add(this.lights.directional);

        // Point Light
        this.lights.point = new THREE.PointLight(0xffff00, 1, 100);
        this.lights.point.position.set(0, 5, 0);
        this.lights.point.visible = false;
        this.scene.add(this.lights.point);

        // Spot Light
        this.lights.spot = new THREE.SpotLight(0xffffff, 1);
        this.lights.spot.position.set(0, 10, 0);
        this.lights.spot.angle = Math.PI / 6;
        this.lights.spot.penumbra = 0.1;
        this.lights.spot.visible = false;
        this.scene.add(this.lights.spot);
    }

    toggleLight(type) {
        if (this.lights[type]) {
            this.lights[type].visible = !this.lights[type].visible;
        }
    }

    updateLightIntensity(type, intensity) {
        if (this.lights[type]) {
            this.lights[type].intensity = intensity;
        }
    }

    updateLightColor(type, color) {
        if (this.lights[type]) {
            this.lights[type].color.set(color);
        }
    }

    updateLightPosition(type, position) {
        if (this.lights[type]) {
            this.lights[type].position.copy(position);
        }
    }
}