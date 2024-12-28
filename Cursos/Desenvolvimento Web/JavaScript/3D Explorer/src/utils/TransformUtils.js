import * as THREE from 'three';
import { roundToDecimals } from './MathUtils';

export function updateObjectPosition(object, axis, value) {
    if (object) {
        object.position[axis] = roundToDecimals(parseFloat(value), 2);
    }
}

export function updateObjectRotation(object, axis, degrees) {
    if (object) {
        object.rotation[axis] = THREE.MathUtils.degToRad(parseFloat(degrees));
    }
}

export function updateObjectScale(object, axis, value) {
    if (object) {
        object.scale[axis] = Math.max(0.1, roundToDecimals(parseFloat(value), 2));
    }
}