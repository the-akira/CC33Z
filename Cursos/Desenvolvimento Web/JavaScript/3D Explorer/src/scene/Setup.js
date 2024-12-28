import * as THREE from 'three';
import { createAxisLabel } from './AxisLabels';
import { CompassViewer } from '../utils/CompassViewer';

export function setupScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    return scene;
}

export function setupCamera(width, height) {
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
    return camera;
}

export function setupRenderer(width, height) {
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    return renderer;
}

export function setupHelpers(scene) {
    const GRID_SIZE = 20;
    const GRID_DIVISIONS = 20;

    // Custom Grid
    const gridGroup = new THREE.Group();
    gridGroup.name = 'gridHelper';

    const gridMaterial = new THREE.LineBasicMaterial({ color: 0x444444, linewidth: 1 });

    for (let i = -GRID_SIZE / 2; i <= GRID_SIZE / 2; i++) {
        if (i !== 0) { // Skip the central lines to avoid overlapping with axes
            // Parallel to X-axis
            const lineX = new THREE.Line(
                new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(-GRID_SIZE / 2, 0, i),
                    new THREE.Vector3(GRID_SIZE / 2, 0, i),
                ]),
                gridMaterial
            );
            gridGroup.add(lineX);

            // Parallel to Z-axis
            const lineZ = new THREE.Line(
                new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(i, 0, -GRID_SIZE / 2),
                    new THREE.Vector3(i, 0, GRID_SIZE / 2),
                ]),
                gridMaterial
            );
            gridGroup.add(lineZ);
        }
    }

    scene.add(gridGroup);

    // Custom Axes
    const axesGroup = new THREE.Group();
    axesGroup.name = 'axesHelper';

    // X Axis (Red)
    const xAxis = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-GRID_SIZE / 2, 0, 0),
            new THREE.Vector3(GRID_SIZE / 2, 0, 0),
        ]),
        new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 })
    );

    // Y Axis (Green)
    const yAxis = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, GRID_SIZE / 2, 0),
        ]),
        new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 })
    );

    // Z Axis (Blue)
    const zAxis = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, -GRID_SIZE / 2),
            new THREE.Vector3(0, 0, GRID_SIZE / 2),
        ]),
        new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 2 })
    );

    // Add axis labels
    const xLabel = createAxisLabel('X', new THREE.Vector3(GRID_SIZE / 2 + 0.5, 0, 0), 0xff0000);
    const yLabel = createAxisLabel('Y', new THREE.Vector3(0, GRID_SIZE / 2 + 0.5, 0), 0x00ff00);
    const zLabel = createAxisLabel('Z', new THREE.Vector3(0, 0, GRID_SIZE / 2 + 0.5), 0x0000ff);

    axesGroup.add(xAxis, yAxis, zAxis, xLabel, yLabel, zLabel);
    scene.add(axesGroup);
}

export function setupCompass(camera, orbitControls) {
    return new CompassViewer(camera, orbitControls);
}