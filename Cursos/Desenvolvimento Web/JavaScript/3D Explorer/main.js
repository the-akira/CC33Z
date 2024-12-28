import * as THREE from 'three';
import { setupScene, setupCamera, setupRenderer, setupHelpers, setupCompass } from './src/scene/Setup';
import { setupOrbitControls } from './src/controls/OrbitControls';
import { setupTransformControls } from './src/controls/TransformControls';
import { createCube, createSphere, createCylinder, createTorus, createCone } from './src/objects/Primitives';
import { SelectionManager } from './src/utils/Selection';
import { EditOperations } from './src/utils/EditOperations';
import { LightControls } from './src/controls/LightControls';
import { MaterialManager } from './src/utils/MaterialManager';
import { HistoryManager } from './src/utils/HistoryManager';
import { ControlPanel } from './src/ui/ControlPanel';
import { PropertiesPanel } from './src/ui/PropertiesPanel';
import { ImageLoader } from './src/ui/ImageLoader';
import { GLBLoader } from './src/ui/GLBLoader';
import { TextLoader } from './src/ui/TextLoader';
import { CodeEditor } from './src/editor/CodeEditor';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// Scene Setup
const scene = setupScene();
const camera = setupCamera(window.innerWidth, window.innerHeight);
const renderer = setupRenderer(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Setup Managers and Controls
setupHelpers(scene);
const orbitControls = setupOrbitControls(camera, renderer);
const transformControls = setupTransformControls(camera, renderer, orbitControls);
scene.add(transformControls);
const compass = setupCompass(camera, orbitControls);

const lightControls = new LightControls(scene);
const materialManager = new MaterialManager();
const historyManager = new HistoryManager();
const propertiesPanel = new PropertiesPanel(materialManager);
const selectionManager = new SelectionManager(camera, scene, transformControls, materialManager, historyManager, propertiesPanel);
const editOperations = new EditOperations(scene, selectionManager, historyManager);

const bloomParams = {
  exposure: 1,
  bloomStrength: 1.5,
  bloomThreshold: 0,
  bloomRadius: 0.8
};

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  bloomParams.bloomStrength,
  bloomParams.bloomRadius,
  bloomParams.bloomThreshold
);

// Criar o compositor de efeitos
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// Setup UI
new ControlPanel(lightControls, materialManager, bloomPass, bloomParams, scene);
new TextLoader(scene, selectionManager);
new ImageLoader(scene, selectionManager);
new GLBLoader(scene, selectionManager);
new CodeEditor(scene, camera, renderer);

function updateHierarchyPanel(scene) {
    const hierarchyList = document.getElementById('hierarchy-list');
    hierarchyList.innerHTML = ''; // Limpa a lista

    scene.children.forEach((child, index) => {
        if (child.type === 'Mesh' || child.name === 'GLB') { // Excluímos objetos como luzes e helpers
            const listItem = document.createElement('li');
            listItem.textContent = child.name || `Objeto ${index}`;

            // Botão para deletar o objeto
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '<i class="fa fa-close"></i>';
            deleteButton.onclick = () => {
                scene.remove(child);
                selectionManager.selectObject(child);
                editOperations.delete();
                updateHierarchyPanel(scene);
            };

            // Botão para alternar visibilidade
            const toggleVisibilityButton = document.createElement('button');
            toggleVisibilityButton.innerHTML = child.visible ? '<i class="fa fa-eye-slash"></i>' : '<i class="fa fa-eye"></i>';
            toggleVisibilityButton.onclick = () => {
                child.visible = !child.visible;
                toggleVisibilityButton.innerHTML = child.visible ? '<i class="fa fa-eye-slash"></i>' : '<i class="fa fa-eye"></i>';
            };

            // Botão para bloquear/desbloquear movimento
            const lockButton = document.createElement('button');
            lockButton.innerHTML = child.userData.locked ? '<i class="fa fa-unlock">' : '<i class="fa fa-lock"></i>';
            lockButton.onclick = () => {
                child.userData.locked = !child.userData.locked;
                lockButton.innerHTML = child.userData.locked ? '<i class="fa fa-unlock">' : '<i class="fa fa-lock"></i>';
            };

            listItem.appendChild(deleteButton);
            listItem.appendChild(toggleVisibilityButton);
            listItem.appendChild(lockButton);
            hierarchyList.appendChild(listItem);
        }
    });
}

// Event Listeners for Buttons
document.getElementById('addCube').addEventListener('click', () => {
    const cube = createCube();
    scene.add(cube);
    selectionManager.selectObject(cube);
    historyManager.addToHistory({ type: 'add', object: cube.toJSON() });
    addObjectToScene();
});

document.getElementById('addSphere').addEventListener('click', () => {
    const sphere = createSphere();
    scene.add(sphere);
    selectionManager.selectObject(sphere);
    historyManager.addToHistory({ type: 'add', object: sphere.toJSON() });
    addObjectToScene();
});

document.getElementById('addCylinder').addEventListener('click', () => {
    const cylinder = createCylinder();
    scene.add(cylinder);
    selectionManager.selectObject(cylinder);
    historyManager.addToHistory({ type: 'add', object: cylinder.toJSON() });
    addObjectToScene();
});

document.getElementById('addTorus').addEventListener('click', () => {
    const torus = createTorus();
    scene.add(torus);
    selectionManager.selectObject(torus);
    historyManager.addToHistory({ type: 'add', object: torus.toJSON() });
    addObjectToScene();
});

document.getElementById('addCone').addEventListener('click', () => {
    const cone = createCone();
    scene.add(cone);
    selectionManager.selectObject(cone);
    historyManager.addToHistory({ type: 'add', object: cone.toJSON() });
    addObjectToScene();
});

// Window Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Custom Event Handlers
document.addEventListener('changeMaterial', (e) => {
    selectionManager.changeMaterial(e.detail.materialType);
});

document.addEventListener('toggleGrid', (e) => {
    const gridHelper = scene.getObjectByName('gridHelper');
    if (gridHelper) gridHelper.visible = e.detail.visible;
});

var editor = document.querySelector('#monaco-editor');
editor.classList.add('hidden');

var objects = document.querySelector('#hierarchy-panel');
objects.classList.add('hidden');

function clearGridObjects(scene) {
    const objectsToRemove = [];
    
    // Filtra objetos que não são essenciais
    scene.children.forEach((child) => {
        if (child.type === 'Mesh' || child.name === 'GLB' && child.name !== 'essential') {
            objectsToRemove.push(child);
            selectionManager.clearSelection();
        }
    });

    // Remove os objetos da cena
    objectsToRemove.forEach((object) => scene.remove(object));

    // Atualiza o painel de hierarquia
    updateHierarchyPanel(scene);
}

let gravityEnabled = false;

document.addEventListener('keydown', (event) => {
  if (event.key !== 'v') {
    event.preventDefault();
  }
  if (event.ctrlKey && event.key === 'q') {
    var helpText = document.querySelector('.help-text');
    helpText.classList.toggle('hidden');
  }
  if (event.ctrlKey && event.key === 'm') {
    editor.classList.toggle('hidden');
  }
  if (event.ctrlKey && event.key === 'i') {
    objects.classList.toggle('hidden');
  }
  if (event.ctrlKey && event.key === 'd') {
    clearGridObjects(scene);
  }
  if (event.ctrlKey && event.key === 'b') { // Pressione "B" para alternar
    bloomEnabled = !bloomEnabled;
    console.log(`Bloom effect ${bloomEnabled ? 'enabled' : 'disabled'}`);
  }
  if (event.ctrlKey && event.key === 'g') {
    gravityEnabled = !gravityEnabled;
    applyGravityToScene(scene);
  }
});

dragElement(document.querySelector("#monaco-editor"));

function dragElement(element) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(element.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(element.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    element.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

export function addObjectToScene() {
    updateHierarchyPanel(scene); // Atualiza o painel
}

transformControls.addEventListener('objectChange', () => {
    const selectedObject = transformControls.object;
    if (selectedObject && selectedObject.userData.locked) {
        // Reverte a transformação se o objeto estiver bloqueado
        transformControls.detach();
    }
});

const gravity = -0.98; // Valor da gravidade (ajustável)
const objectsWithVelocity = [];

function applyGravityToScene(scene) {
    scene.children.forEach((child) => {
        if (child.type === 'Mesh' || child.name === 'GLB' && child.name !== 'essential') {
            if (!child.userData.velocity) {
                child.userData.velocity = 0; // Inicializa a velocidade
            }
            objectsWithVelocity.push(child);
        }
    });
}

let bloomEnabled = false;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    if (gravityEnabled) {
        objectsWithVelocity.forEach((object) => {
            // Aplica a gravidade
            object.userData.velocity += gravity * 0.001; // Aceleração * deltaTime (~16ms por frame)
            object.position.y += object.userData.velocity;

            // Colisão com o chão (posição Y = 0)
            if (object.position.y <= 0) {
                object.position.y = 0; // Mantém no chão
                object.userData.velocity = 0; // Para o movimento
            }
        });
    }

    orbitControls.update();
    if (bloomEnabled) {
        composer.render(scene, camera); // Renderiza com o efeito de bloom
    } else {
        renderer.render(scene, camera); // Renderiza sem o efeito de bloom
    }
}

animate();