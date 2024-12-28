export class AnimationManager {
    constructor() {
        this.frameId = null;
        this.isRunning = false;
        this.currentCallback = null; // Para evitar callbacks duplicados
    }

    requestFrame(callback) {
        if (this.isRunning) {
            this.frameId = requestAnimationFrame(() => {
                // Protege contra múltiplos loops
                if (this.isRunning && this.currentCallback === callback) {
                    callback();
                    this.requestFrame(callback);
                }
            });
        }
    }

    start(callback) {
        if (!this.isRunning) {
            this.isRunning = true;
            this.currentCallback = callback;
            this.requestFrame(callback);
        }
    }

    stop() {
        this.isRunning = false;
        this.currentCallback = null;
        if (this.frameId) {
            cancelAnimationFrame(this.frameId);
            this.frameId = null;
        }
    }
}