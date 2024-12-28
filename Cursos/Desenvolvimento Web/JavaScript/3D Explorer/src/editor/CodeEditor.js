import loader from '@monaco-editor/loader';
import { createSandbox } from './Sandbox';

export class CodeEditor {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.editor = null;
        this.sandbox = createSandbox(scene, camera, renderer);
        this.setupEditor();
    }

    async setupEditor() {
        const container = document.createElement('div');
        container.id = 'monaco-editor';
        container.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 600px;
            height: 330px;
            background: #1e1e1e;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        `;
        document.body.appendChild(container);

        const toolbar = this.createToolbar();
        container.appendChild(toolbar);

        const editorContainer = document.createElement('div');
        editorContainer.style.height = 'calc(100% - 44px)';
        editorContainer.addEventListener('keydown', (event) => event.stopPropagation());
        container.appendChild(editorContainer);

        try {
            const monaco = await loader.init();
            this.setupMonaco(monaco, editorContainer);
        } catch (error) {
            console.error('Failed to load Monaco Editor:', error);
            container.innerHTML = '<div style="padding: 20px; color: white;">Failed to load code editor</div>';
        }
    }

    createToolbar() {
        const toolbar = document.createElement('div');
        toolbar.style.cssText = `
            padding: 8px;
            background: #2d2d2d;
            display: flex;
            gap: 8px;
            align-items: center;
        `;
        toolbar.id = 'monaco-editorheader'

        const runButton = document.createElement('button');
        runButton.textContent = 'Executar';
        runButton.onclick = () => this.runCode();

        const stopButton = document.createElement('button');
        stopButton.textContent = 'Parar';
        stopButton.onclick = () => this.stopCode();

        const status = document.createElement('span');
        status.style.cssText = `
            color: #aaa;
            margin-left: auto;
            font-size: 12px;
        `;
        status.id = 'editor-status';

        toolbar.appendChild(runButton);
        toolbar.appendChild(stopButton);
        toolbar.appendChild(status);

        return toolbar;
    }

    setupMonaco(monaco, container) {
        // Add Three.js type definitions
        monaco.languages.typescript.javascriptDefaults.addExtraLib(`
            declare const THREE: any;
            declare const scene: THREE.Scene;
            declare const camera: THREE.Camera;
            declare const renderer: THREE.WebGLRenderer;
        `, 'three.d.ts');

        this.editor = monaco.editor.create(container, {
            value: '// Write your Three.js code here\n',
            language: 'javascript',
            theme: 'vs-dark',
            minimap: { enabled: false },
            automaticLayout: true,
            fontSize: 14,
            tabSize: 2,
            scrollBeyondLastLine: false
        });
    }

    runCode() {
        if (this.editor) {
            const status = document.getElementById('editor-status');
            status.textContent = 'Running...';
            status.style.color = '#4CAF50';
            
            try {
                const code = this.editor.getValue();
                this.sandbox.execute(code);
            } catch (error) {
                status.textContent = 'Error: ' + error.message;
                status.style.color = '#f44336';
            }
        }
    }

    stopCode() {
        this.sandbox.stop();
        const status = document.getElementById('editor-status');
        status.textContent = 'Stopped';
        status.style.color = '#aaa';
    }
}