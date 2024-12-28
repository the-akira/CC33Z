import * as THREE from 'three';
import { ThreeContext } from './context/ThreeContext';
import { AnimationManager } from './context/AnimationManager';

export function createSandbox(scene, camera, renderer) {
    const threeContext = new ThreeContext(scene, camera, renderer);
    const animationManager = new AnimationManager();

    function createExecutionContext() {
        return {
            THREE,  // Pass the actual THREE object instead of window.THREE
            scene,
            camera,
            renderer,
            requestAnimationFrame: (callback) => animationManager.start(callback),
            cancelAnimationFrame: () => animationManager.stop()
        };
    }

    return {
        execute(code) {
            this.stop();
            
            try {
                const context = createExecutionContext();
                const wrappedCode = `
                    try {
                        ${code}
                    } catch (error) {
                        console.error('Simulation error:', error.message);
                        throw error;
                    }
                `;
                
                const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
                const fn = new AsyncFunction(...Object.keys(context), wrappedCode);
                
                fn(...Object.values(context)).catch(error => {
                    console.error('Runtime error:', error.message);
                    this.stop();
                });
            } catch (error) {
                console.error('Compilation error:', error.message);
                this.stop();
            }
        },

        stop() {
            animationManager.stop();
            threeContext.cleanup();
        }
    };
}