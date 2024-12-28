import { addObjectToScene } from '../../main';

export class GLBLoader {
    constructor(scene, selectionManager) {
        this.scene = scene;
        this.selectionManager = selectionManager;
        this.setupUI();
    }

    setupUI() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.glb';
        input.style.display = 'none';
        input.id = 'glbInput';
        document.body.appendChild(input);

        const button = document.createElement('button');
        button.textContent = 'Arquivo GLB';
        button.onclick = () => input.click();

        const controls = document.querySelector('.controls');
        controls.appendChild(button);

        input.addEventListener('change', this.handleGLBUpload.bind(this));
    }

    handleGLBUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.loadGLBModel(file);
        }
    }

    async loadGLBModel(file) {
        const { loadGLBModel } = await import('../objects/GLBFile.js');
        try {
            const model = await loadGLBModel(file);
            model.name = 'GLB';
            this.scene.add(model);
            this.selectionManager.selectObject(model);
            addObjectToScene();
        } catch (error) {
            console.error('Error loading GLB model:', error);
        }
    }
}