import * as THREE from 'three';

export class HistoryManager {
    constructor() {
        this.history = [];
        this.currentIndex = -1;
        this.maxHistory = 50;
    }

    addToHistory(state) {
        // Remove future states
        this.history = this.history.slice(0, this.currentIndex + 1);
        
        // Deep clone the state to prevent reference issues
        const clonedState = {
            ...state,
            timestamp: Date.now(),
            object: state.object ? JSON.parse(JSON.stringify(state.object)) : null,
            before: state.before ? JSON.parse(JSON.stringify(state.before)) : null,
            after: state.after ? JSON.parse(JSON.stringify(state.after)) : null
        };
        
        this.history.push(clonedState);
        this.currentIndex++;

        // Limit history size
        if (this.history.length > this.maxHistory) {
            this.history.shift();
            this.currentIndex--;
        }
    }

    undo() {
        if (this.canUndo()) {
            const state = { ...this.history[this.currentIndex], undoing: true };
            this.currentIndex--;
            return state;
        }
        return null;
    }

    redo() {
        if (this.canRedo()) {
            this.currentIndex++;
            return { ...this.history[this.currentIndex], undoing: false };
        }
        return null;
    }

    canUndo() {
        return this.currentIndex >= 0;
    }

    canRedo() {
        return this.currentIndex < this.history.length - 1;
    }
}