import * as THREE from 'three';
import { addObjectToScene } from '../../main';
import { createTextObject } from '../objects/TextObject.js';

export class EditOperations {
    constructor(scene, selectionManager, historyManager) {
        this.scene = scene;
        this.selectionManager = selectionManager;
        this.historyManager = historyManager;
        this.clipboard = null;
        
        this.setupKeyboardShortcuts();
    }
    
    setupKeyboardShortcuts() {
        window.addEventListener('keydown', (event) => {
            if (event.ctrlKey || event.metaKey) {
                switch(event.key.toLowerCase()) {
                    case 'c':
                        event.preventDefault();
                        this.copy();
                        break;
                    case 'p':
                        event.preventDefault();
                        this.paste();
                        addObjectToScene();
                        break;
                    case 'z':
                        event.preventDefault();
                        if (event.shiftKey) {
                            this.redo();
                        } else {
                            this.undo();
                        }
                        break;
                    case 'y':
                        event.preventDefault();
                        this.redo();
                        break;
                }
            } else if (event.key === 'Delete') {
                event.preventDefault();
                this.delete();
                addObjectToScene();
            }
        });
    }
    
    copy() {
        const selected = this.selectionManager.selectedObject;
        if (selected) {
            this.clipboard = selected.clone();
            this.clipboard.position.copy(selected.position);
            this.clipboard.rotation.copy(selected.rotation);
            this.clipboard.scale.copy(selected.scale);
        }
    }
    
    paste() {
        if (this.clipboard) {
            const newObject = this.clipboard.clone();
            newObject.position.add(new THREE.Vector3(1, 0, 1)); // Offset para não sobrepor
            this.scene.add(newObject);
            this.selectionManager.selectObject(newObject);
            this.historyManager.addToHistory({
                type: 'add',
                object: newObject.toJSON()
            });
        }
    }
    
    delete() {
        const selected = this.selectionManager.selectedObject;
        if (selected) {
            const objectState = {
                type: 'delete',
                object: selected.toJSON(),
                position: selected.position.toArray(),
                rotation: [selected.rotation.x, selected.rotation.y, selected.rotation.z],
                scale: selected.scale.toArray()
            };
            this.scene.remove(selected);
            this.selectionManager.clearSelection();
            this.historyManager.addToHistory(objectState);
        }
    }
    
    undo() {
        const state = this.historyManager.undo();
        if (state) {
            this.applyHistoryState(state);
            addObjectToScene();
        }
    }
    
    redo() {
        const state = this.historyManager.redo();
        if (state) {
            this.applyHistoryState(state);
            addObjectToScene();
        }
    }
    
    async applyHistoryState(state) {
        switch (state.type) {
            case 'add':
                const loader = new THREE.ObjectLoader();
                const newObject = loader.parse(state.object);
                this.scene.add(newObject);
                this.selectionManager.selectObject(newObject);
                break;
                
            case 'delete':
                if (state.undoing) {
                    const loader = new THREE.ObjectLoader();

                    if (state.object.object.name === 'textObject') {
                        // Tratamento especial para objetos de texto
                        const textGeometry = await createTextObject(state.object.object.userData.textContent, 
                            { color: state.object.materials[0].color });
                        textGeometry.position.fromArray(state.position);
                        textGeometry.scale.fromArray(state.scale);
                        textGeometry.rotation.setFromVector3(new THREE.Vector3().fromArray(state.rotation));
                        this.scene.add(textGeometry);
                        this.selectionManager.selectObject(textGeometry);
                        addObjectToScene();
                    } else {
                        // Lógica para outros objetos
                        const restoredObject = loader.parse(state.object);
                        restoredObject.position.fromArray(state.position);
                        restoredObject.rotation.setFromVector3(new THREE.Vector3().fromArray(state.rotation));
                        restoredObject.scale.fromArray(state.scale);
                        this.scene.add(restoredObject);
                        this.selectionManager.selectObject(restoredObject);
                    }
                } else {
                    // Lógica para remoção de objetos
                    const objectToRemove = this.scene.getObjectByProperty('uuid', state.object.object.uuid);
                    if (objectToRemove) {
                        this.scene.remove(objectToRemove);
                        this.selectionManager.clearSelection();
                    }
                }
                break;
                
            case 'transform':
                const object = this.scene.getObjectByProperty('uuid', state.object);
                if (object) {
                    const targetState = state.undoing ? state.before : state.after;
                    object.position.fromArray(targetState.position);
                    object.rotation.setFromVector3(new THREE.Vector3().fromArray(targetState.rotation));
                    object.scale.fromArray(targetState.scale);
                    this.selectionManager.selectObject(object);
                }
                break;
        }
    }
}