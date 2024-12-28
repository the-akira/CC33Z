import { addObjectToScene } from '../../main';

export class ImageLoader {
    constructor(scene, selectionManager) {
        this.scene = scene;
        this.selectionManager = selectionManager;
        this.setupUI();
    }

    setupUI() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';
        input.id = 'imageInput';
        document.body.appendChild(input);

        const button = document.createElement('button');
        button.textContent = 'Imagem';
        button.onclick = () => input.click();
        
        const controls = document.querySelector('.controls');
        controls.appendChild(button);

        input.addEventListener('change', this.handleImageUpload.bind(this));
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => this.createImagePlane(e.target.result);
            reader.readAsDataURL(file);
        }
    }

    async createImagePlane(imageUrl) {
        const { createImagePlane } = await import('../objects/ImagePlane.js');
        try {
            const plane = await createImagePlane(imageUrl);
            this.scene.add(plane);
            this.selectionManager.selectObject(plane);
            addObjectToScene();
        } catch (error) {
            console.error('Error loading image:', error);
        }
    }
}