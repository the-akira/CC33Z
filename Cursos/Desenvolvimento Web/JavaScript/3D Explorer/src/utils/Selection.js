import * as THREE from 'three';
import { updateCoordinatesDisplay } from './CoordinatesDisplay.js';

export class SelectionManager {
    constructor(camera, scene, transformControls, materialManager, historyManager, propertiesPanel) {
        this.camera = camera;
        this.scene = scene;
        this.transformControls = transformControls;
        this.materialManager = materialManager;
        this.historyManager = historyManager;
        this.propertiesPanel = propertiesPanel;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.selectedObject = null;
        this.originalPosition = new THREE.Vector3();
        this.originalRotation = new THREE.Euler();
        this.originalScale = new THREE.Vector3();
        
        this.selectableObjects = ['cube', 'sphere', 'cylinder', 'torus', 'cone', 'image', 'GLB', 'textObject', 'light'];
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.transformControls.addEventListener('mouseDown', () => {
            if (this.selectedObject) {
                this.saveObjectState();
            }
        });
        
        this.transformControls.addEventListener('objectChange', () => {
            if (this.selectedObject) {
                this.updateCoordinatesDisplay();
                this.propertiesPanel.updatePanel(this.selectedObject);
            }
        });

        this.transformControls.addEventListener('mouseUp', () => {
            if (this.selectedObject) {
                this.recordObjectChange();
            }
        });
    }
    
    onMouseDown(event) {
        if (this.transformControls.dragging) return;
        
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        let selectedObject = null;
        for (const intersect of intersects) {
            let object = intersect.object;
            while (object.parent && !this.selectableObjects.includes(object.name)) {
                object = object.parent;
            }
            
            if (this.selectableObjects.includes(object.name)) {
                selectedObject = object;
                break;
            }
        }
        
        if (selectedObject) {
            this.selectObject(selectedObject);
        } else if (!event.target.closest('.control-panel') && !event.target.closest('.properties-panel')) {
            this.clearSelection();
        }
    }
    
    selectObject(object) {
        this.selectedObject = object;
        this.transformControls.attach(object);
        this.saveObjectState();
        this.updateCoordinatesDisplay();
        this.propertiesPanel.updatePanel(object);
    }
    
    clearSelection() {
        if (this.selectedObject) {
            this.transformControls.detach();
            this.selectedObject = null;
            this.updateCoordinatesDisplay();
            this.propertiesPanel.updatePanel(null);
        }
    }
    
    saveObjectState() {
        if (this.selectedObject) {
            this.originalPosition.copy(this.selectedObject.position);
            this.originalRotation.copy(this.selectedObject.rotation);
            this.originalScale.copy(this.selectedObject.scale);
        }
    }
    
    recordObjectChange() {
        if (this.selectedObject) {
            const changeState = {
                type: 'transform',
                object: this.selectedObject.uuid,
                before: {
                    position: this.originalPosition.toArray(),
                    rotation: [this.originalRotation.x, this.originalRotation.y, this.originalRotation.z],
                    scale: this.originalScale.toArray()
                },
                after: {
                    position: this.selectedObject.position.toArray(),
                    rotation: [this.selectedObject.rotation.x, this.selectedObject.rotation.y, this.selectedObject.rotation.z],
                    scale: this.selectedObject.scale.toArray()
                }
            };
            this.historyManager.addToHistory(changeState);
        }
    }

    changeMaterial(materialType) {
        if (this.selectedObject) {
            const newMaterial = this.materialManager.getMaterial(materialType);
            this.selectedObject.material = newMaterial;
            this.historyManager.addToHistory({
                type: 'material',
                object: this.selectedObject.uuid,
                materialType: materialType
            });
        }
    }
    
    updateCoordinatesDisplay() {
        const coordsDiv = document.getElementById('coordinates');
        if (this.selectedObject) {
            const pos = this.selectedObject.position;
            const rot = this.selectedObject.rotation;
            const scale = this.selectedObject.scale;
            
            coordsDiv.innerHTML = `
                <div>Posição: X: ${pos.x.toFixed(2)} Y: ${pos.y.toFixed(2)} Z: ${pos.z.toFixed(2)}</div>
                <div>Rotação: X: ${(rot.x * 180 / Math.PI).toFixed(1)}° Y: ${(rot.y * 180 / Math.PI).toFixed(1)}° Z: ${(rot.z * 180 / Math.PI).toFixed(1)}°</div>
                <div>Escala: X: ${scale.x.toFixed(2)} Y: ${scale.y.toFixed(2)} Z: ${scale.z.toFixed(2)}</div>
            `;
        } else {
            coordsDiv.textContent = 'Nenhum objeto selecionado';
        }
    }
}