import * as THREE from 'three';
import { addObjectToScene } from '../../main';
import { createTextObject } from '../objects/TextObject.js';

export class ControlPanel {
    constructor(lightControls, materialManager, bloomPass, bloomParams, scene) {
        this.lightControls = lightControls;
        this.materialManager = materialManager;
        this.bloomPass = bloomPass;
        this.bloomParams = bloomParams;
        this.scene = scene;
        this.setupUI();
    }

    setupUI() {
        const panel = document.createElement('div');
        panel.className = 'control-panel';
        
        // Lights Section
        const lightsSection = this.createSection('Luzes');
        lightsSection.appendChild(this.createLightControls());
        panel.appendChild(lightsSection);

        // Materials Section
        const materialsSection = this.createSection('Materiais');
        materialsSection.appendChild(this.createMaterialControls());
        panel.appendChild(materialsSection);

        // View Options Section
        const viewSection = this.createSection('Visualização');
        viewSection.appendChild(this.createViewControls());
        panel.appendChild(viewSection);

        const bloomSection = this.createSection('Bloom');
        bloomSection.appendChild(this.createBloomControls());
        panel.appendChild(bloomSection);

        // Scene Management Section
        const sceneManagementSection = this.createSection('Dados da Cena');
        sceneManagementSection.appendChild(this.createSceneManagementControls());
        panel.appendChild(sceneManagementSection);
        sceneManagementSection.style.marginBottom = '0px';

        document.body.appendChild(panel);
    }

    createSceneManagementControls() {
        const container = document.createElement('div');

        // Save Scene Button
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Salvar Cena';
        saveButton.addEventListener('click', () => {
            const sceneData = this.scene.toJSON();
            const jsonString = JSON.stringify(sceneData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'scene.json';
            link.click();
        });
        container.appendChild(saveButton);

        // Load Scene Button
        const loadButton = document.createElement('button');
        loadButton.textContent = 'Carregar Cena';
        loadButton.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (e) => {
                    const jsonData = JSON.parse(e.target.result);

                    // Verificar e tratar geometries do tipo "TextGeometry"
                    if (jsonData.geometries) {
                        jsonData.geometries = jsonData.geometries.filter((geometry) => {
                            if (geometry.type === "TextGeometry") {
                                console.warn(`TextGeometry removida:`, geometry);
                                return false; // Remove TextGeometry
                            }
                            return true; // Mantém outras geometrias
                        });
                    }

                    const loader = new THREE.ObjectLoader();
                    console.log("Dados JSON após remoção de TextGeometry:", jsonData);

                    const loadedScene = loader.parse(jsonData);

                    // Adicionar objetos carregados
                    loadedScene.children.forEach((child) => {
                        if ((child.type === 'Mesh' || child.name === 'GLB') && child.name !== 'essential') {
                            this.scene.add(child.clone());
                            addObjectToScene();
                        }
                    });

                    // Atualizar UI
                    console.log('Cena carregada com sucesso!');
                };
                reader.readAsText(file);
            });
            input.click();
        });
        container.appendChild(loadButton);

        return container;
    }

    createBloomControls() {
        const container = document.createElement('div');

        const bloomSettings = [
            { label: 'Strength', key: 'bloomStrength', min: 0, max: 3, step: 0.1 },
            { label: 'Threshold', key: 'bloomThreshold', min: 0, max: 1, step: 0.01 },
            { label: 'Radius', key: 'bloomRadius', min: 0, max: 1, step: 0.01 }
        ];

        bloomSettings.forEach(setting => {
            const div = document.createElement('div');
            div.className = 'control-row';
            div.style.marginBottom = '0px';

            const label = document.createElement('label');
            label.textContent = setting.label;

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = setting.min;
            slider.max = setting.max;
            slider.step = setting.step;
            slider.value = this.bloomParams[setting.key];
            slider.addEventListener('input', (e) => {
                this.bloomParams[setting.key] = parseFloat(e.target.value);
                this.updateBloomPass();
            });

            div.appendChild(label);
            div.appendChild(slider);
            container.appendChild(div);
        });

        return container;
    }

    updateBloomPass() {
        this.bloomPass.threshold = this.bloomParams.bloomThreshold;
        this.bloomPass.strength = this.bloomParams.bloomStrength;
        this.bloomPass.radius = this.bloomParams.bloomRadius;
    }

    createSection(title) {
        const section = document.createElement('div');
        section.className = 'panel-section';
        
        const header = document.createElement('h3');
        header.textContent = title;
        section.appendChild(header);
        
        return section;
    }

    createLightControls() {
        const container = document.createElement('div');
        
        const lightTypes = ['ambient', 'directional', 'point', 'spot'];
        lightTypes.forEach(type => {
            const div = document.createElement('div');
            div.className = 'control-row';
            
            const toggle = document.createElement('input');
            toggle.type = 'checkbox';
            toggle.checked = true;
            toggle.addEventListener('change', () => {
                this.lightControls.toggleLight(type);
            });
            
            const label = document.createElement('label');
            label.textContent = type.charAt(0).toUpperCase() + type.slice(1);
            
            div.appendChild(toggle);
            div.appendChild(label);
            container.appendChild(div);
        });
        
        return container;
    }

    createMaterialControls() {
        const container = document.createElement('div');
        
        const materials = ['standard', 'phong', 'basic', 'wireframe', 'glass', 'emissive'];
        materials.forEach(material => {
            const button = document.createElement('button');
            button.textContent = material.charAt(0).toUpperCase() + material.slice(1);
            button.addEventListener('click', () => {
                // Event will be handled by Selection Manager
                document.dispatchEvent(new CustomEvent('changeMaterial', { 
                    detail: { materialType: material }
                }));
            });
            container.appendChild(button);
        });
        
        return container;
    }

    createViewControls() {
        const container = document.createElement('div');
        
        // Grid Toggle
        const gridToggle = document.createElement('input');
        gridToggle.type = 'checkbox';
        gridToggle.checked = true;
        gridToggle.addEventListener('change', (e) => {
            document.dispatchEvent(new CustomEvent('toggleGrid', { 
                detail: { visible: e.target.checked }
            }));
        });
        
        const gridLabel = document.createElement('label');
        gridLabel.textContent = ' Show Grid';
        
        container.appendChild(gridToggle);
        container.appendChild(gridLabel);
        
        return container;
    }
}