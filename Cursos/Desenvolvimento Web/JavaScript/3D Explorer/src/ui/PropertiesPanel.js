import * as THREE from 'three';
import { updateObjectPosition, updateObjectRotation, updateObjectScale } from '../utils/TransformUtils.js';
import { radToDeg } from '../utils/MathUtils.js';
import { createTextObject } from '../objects/TextObject.js';

export class PropertiesPanel {
    constructor(materialManager) {
        this.materialManager = materialManager;
        this.selectedObject = null;
        this.panel = this.createPanel();
        document.body.appendChild(this.panel);
        this.hide();
    }

    createPanel() {
        const panel = document.createElement('div');
        panel.className = 'properties-panel';
        
        // Position Group
        const positionGroup = document.createElement('div');
        positionGroup.className = 'property-group';
        positionGroup.innerHTML = `
            <h4>Posição</h4>
            <div class="property-row">
                <label>X:</label>
                <input type="number" step="0.1" data-property="position" data-axis="x">
            </div>
            <div class="property-row">
                <label>Y:</label>
                <input type="number" step="0.1" data-property="position" data-axis="y">
            </div>
            <div class="property-row">
                <label>Z:</label>
                <input type="number" step="0.1" data-property="position" data-axis="z">
            </div>
        `;

        // Rotation Group
        const rotationGroup = document.createElement('div');
        rotationGroup.className = 'property-group';
        rotationGroup.innerHTML = `
            <h4>Rotação (graus)</h4>
            <div class="property-row">
                <label>X:</label>
                <input type="number" step="1" data-property="rotation" data-axis="x">
            </div>
            <div class="property-row">
                <label>Y:</label>
                <input type="number" step="1" data-property="rotation" data-axis="y">
            </div>
            <div class="property-row">
                <label>Z:</label>
                <input type="number" step="1" data-property="rotation" data-axis="z">
            </div>
        `;

        // Scale Group
        const scaleGroup = document.createElement('div');
        scaleGroup.className = 'property-group';
        scaleGroup.innerHTML = `
            <h4>Escala</h4>
            <div class="property-row">
                <label>X:</label>
                <input type="number" step="0.1" min="0.1" data-property="scale" data-axis="x">
            </div>
            <div class="property-row">
                <label>Y:</label>
                <input type="number" step="0.1" min="0.1" data-property="scale" data-axis="y">
            </div>
            <div class="property-row">
                <label>Z:</label>
                <input type="number" step="0.1" min="0.1" data-property="scale" data-axis="z">
            </div>
        `;

        // Color Group
        const colorGroup = document.createElement('div');
        colorGroup.className = 'property-group';
        colorGroup.innerHTML = `
            <h4>Cor</h4>
            <div class="property-row">
                <label>Cor:</label>
                <input type="color" data-property="color">
            </div>
        `;

        const textGroup = document.createElement('div');
        textGroup.className = 'property-group property-group-text';
        textGroup.innerHTML = `
            <h4>Texto</h4>
            <div class="property-row">
                <label>C:</label>
                <input type="text" data-property="textContent">
            </div>
        `;

        panel.appendChild(textGroup);
        panel.appendChild(positionGroup);
        panel.appendChild(rotationGroup);
        panel.appendChild(scaleGroup);
        panel.appendChild(colorGroup);

        this.setupEventListeners(panel);
        return panel;
    }

    setupEventListeners(panel) {
        panel.addEventListener('input', (e) => {
            const input = e.target;
            if (!input.dataset.property) return;

            const property = input.dataset.property;
            const axis = input.dataset.axis;
            const value = input.value;

            if (!this.selectedObject) return;

            switch (property) {
                case 'position':
                    updateObjectPosition(this.selectedObject, axis, value);
                    break;
                case 'rotation':
                    updateObjectRotation(this.selectedObject, axis, value);
                    break;
                case 'scale':
                    updateObjectScale(this.selectedObject, axis, value);
                    break;
                case 'color':
                    if (this.selectedObject.material) {
                        this.selectedObject.material.color.setStyle(value);
                    }
                    break;
                case 'textContent':
                    if (this.selectedObject.name === 'textObject') {
                        const content = input.value;
                        const oldGeometry = this.selectedObject.geometry;
                        createTextObject(content, { size: 1, height: 0.2 }).then((newText) => {
                            this.selectedObject.geometry = newText.geometry;
                            this.selectedObject.userData.textContent = content;
                            oldGeometry.dispose(); // Liberar recursos
                        });
                    }
                    break;
            }
        });
        panel.addEventListener('keydown', (e) => {
            e.stopPropagation();
        });
    }

    updatePanel(object) {
        this.selectedObject = object;
        
        if (!object) {
            this.hide();
            return;
        }

        this.show();
 
        // Update position inputs
        ['x', 'y', 'z'].forEach(axis => {
            const posInput = this.panel.querySelector(`input[data-property="position"][data-axis="${axis}"]`);
            posInput.value = object.position[axis].toFixed(2);
        });

        // Update rotation inputs (convert to degrees)
        ['x', 'y', 'z'].forEach(axis => {
            const rotInput = this.panel.querySelector(`input[data-property="rotation"][data-axis="${axis}"]`);
            rotInput.value = radToDeg(object.rotation[axis]).toFixed(1);
        });

        // Update scale inputs
        ['x', 'y', 'z'].forEach(axis => {
            const scaleInput = this.panel.querySelector(`input[data-property="scale"][data-axis="${axis}"]`);
            scaleInput.value = object.scale[axis].toFixed(2);
        });

        // Update color input
        if (object.material && object.material.color) {
            const colorInput = this.panel.querySelector('input[data-property="color"]');
            colorInput.value = '#' + object.material.color.getHexString();
        }

        if (object.name === 'textObject') {
            const textInput = this.panel.querySelector('input[data-property="textContent"]');
            const textPanel = this.panel.querySelector('.property-group-text');
            textInput.value = object.userData.textContent || '';
            textPanel.style.display = 'block';
        } else {
            const textPanel = this.panel.querySelector('.property-group-text');
            textPanel.style.display = 'none';
        }
    }

    show() {
        this.panel.style.display = 'block';
    }

    hide() {
        this.panel.style.display = 'none';
    }
}