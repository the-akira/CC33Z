import { createTextObject } from '../objects/TextObject.js';
import { addObjectToScene } from '../../main';

export class TextLoader {
    constructor(scene, selectionManager) {
        this.scene = scene;
        this.selectionManager = selectionManager;
        this.setupUI();
    }

    setupUI() {
        const button = document.createElement('button');
        button.textContent = 'Texto';
        button.onclick = () => this.createText();
        
        const controls = document.querySelector('.controls');
        controls.appendChild(button);
    }

    async createText() {
        const content = prompt('Digite o texto:');
        if (!content) return;

        try {
            const textObject = await createTextObject(content, {
                size: 1,
                height: 0.2,
                color: 0x00ff00,
            });
            textObject.position.set(0, 0.5, 0);
            this.scene.add(textObject);
            this.selectionManager.selectObject(textObject);
            addObjectToScene();
        } catch (error) {
            console.error('Erro ao criar texto:', error);
        }
    }
}