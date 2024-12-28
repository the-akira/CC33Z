const createdObjects = [];

export function addObjectToList(object, name) {
    createdObjects.push({ object, name, visible: true, locked: false });
    updateObjectPanel();
}

function updateObjectPanel() {
    const objectList = document.getElementById('objectList');
    objectList.innerHTML = ''; // Limpa a lista atual

    createdObjects.forEach((item, index) => {
        const li = document.createElement('li');
        li.style.marginBottom = '10px';

        li.innerHTML = `
            <strong>${item.name}</strong><br>
            <button onclick="toggleVisibility(${index})">Visível: ${item.visible ? 'Sim' : 'Não'}</button>
            <button onclick="lockObject(${index})">Travado: ${item.locked ? 'Sim' : 'Não'}</button>
            <button onclick="deleteObject(${index})" style="color: red;">Deletar</button>
        `;

        objectList.appendChild(li);
    });
}

function toggleVisibility(index) {
    const item = createdObjects[index];
    item.visible = !item.visible; // Alterna a visibilidade
    item.object.visible = item.visible; // Aplica no objeto da cena
    updateObjectPanel(); // Atualiza o painel
}

function lockObject(index) {
    const item = createdObjects[index];
    item.locked = !item.locked; // Alterna o estado de travado
    if (item.locked) {
        transformControls.detach(item.object); // Remove controles de transformação
    } else {
        selectionManager.selectObject(item.object); // Reanexa aos controles
    }
    updateObjectPanel();
}

function deleteObject(index) {
    const item = createdObjects[index];
    scene.remove(item.object); // Remove o objeto da cena
    createdObjects.splice(index, 1); // Remove da lista
    updateObjectPanel(); // Atualiza o painel
}

window.toggleVisibility = toggleVisibility;
window.lockObject = lockObject;
window.deleteObject = deleteObject;