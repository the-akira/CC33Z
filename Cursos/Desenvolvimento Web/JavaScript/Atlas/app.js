let map, drawControl, db;
let layers = {}; // Armazena as layers (camadas) criadas
let activeLayer = null; // Define a layer ativa para edição
let layerStyles = {};
let currentCoordinates = '';

function logAction(action, details) {
    const transaction = db.transaction(['history'], 'readwrite');
    const objectStore = transaction.objectStore('history');

    const logEntry = {
        timestamp: new Date().toISOString(),
        action: action,
        details: details
    };

    const request = objectStore.add(logEntry);

    request.onsuccess = function () {
        console.log('Ação registrada no histórico:', logEntry);
    };

    request.onerror = function () {
        console.error('Erro ao registrar ação no histórico.');
    };
}

function clearHistory() {
    if (!confirm('Tem certeza de que deseja limpar todo o histórico?')) return;

    const transaction = db.transaction(['history'], 'readwrite');
    const objectStore = transaction.objectStore('history');
    const request = objectStore.clear();

    request.onsuccess = function () {
        console.log('Histórico de ações limpo com sucesso.');
        showToast('Histórico de ações limpo com sucesso.', 'success')
        document.getElementById('history-list').innerHTML = 'Nenhuma ação registrada.';
    };

    request.onerror = function (event) {
        console.error('Erro ao limpar o histórico de ações:', event.target.error);
    };
}

function openHistoryModal() {
    const transaction = db.transaction(['history'], 'readonly');
    const objectStore = transaction.objectStore('history');
    const request = objectStore.getAll();

    request.onsuccess = function (event) {
        const logs = event.target.result;
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';

        if (logs.length === 0) {
            historyList.textContent = 'Nenhuma ação registrada.';
        } else {
            logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Ordena por data decrescente

            logs.forEach(log => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span><b>${new Date(log.timestamp).toLocaleString()}:</b> ${log.action}</span>
                    <p>${log.details}</p>
                `;
                historyList.appendChild(li);
            });
        }

        document.getElementById('history-modal').style.display = 'block';
    };

    request.onerror = function () {
        console.error('Erro ao carregar histórico.');
    };
}

function closeHistoryModal() {
    document.getElementById('history-modal').style.display = 'none';
}

function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');

    // Cria o elemento do toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        background-color: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 10px 20px;
        margin-top: 10px;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        opacity: 1;
        transition: opacity 0.5s ease;
    `;

    // Adiciona o toast ao contêiner
    container.appendChild(toast);

    // Remove o toast após o tempo especificado
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => container.removeChild(toast), 500); // Espera o fade-out antes de remover
    }, duration);
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Versão debounce do loadFeatures
const debouncedLoadFeatures = debounce(loadFeatures, 300); // Delay de 300ms

function setLayerStyle(layerName, style) {
    if (!layers[layerName]) return;

    // Atualiza os estilos armazenados
    layerStyles[layerName] = {
        ...layerStyles[layerName],
        ...style,
    };

    // Aplica os estilos na camada
    layers[layerName].eachLayer((layer) => {
        if (layer.setStyle) {
            layer.setStyle({
                color: layerStyles[layerName].color
            });
        }
    });

    updateLayerColorInDB(layerName, layerStyles[layerName].color);
    debouncedLoadFeatures();

    console.log(`Estilos atualizados para a camada "${layerName}":`, layerStyles[layerName]);
}

function updateLayerColorInDB(layerName, color) {
    const transaction = db.transaction(['layers', 'features'], 'readwrite');
    const layerStore = transaction.objectStore('layers');
    const featureStore = transaction.objectStore('features');

    // Atualiza a camada no banco
    const request = layerStore.get(layerName);

    request.onsuccess = function (event) {
        const layerData = event.target.result;

        if (!layerData) {
            console.error(`Camada "${layerName}" não encontrada no banco.`);
            return;
        }

        // Atualiza o estilo da camada
        layerData.style = {
            ...layerData.style,
            color: color, // Atualiza apenas a cor
        };

        const updateRequest = layerStore.put(layerData); // Salva as alterações no banco

        updateRequest.onsuccess = function () {
            console.log(`Cor da camada "${layerName}" atualizada para "${color}" no banco.`);

            // Atualiza a cor das features associadas no banco
            const featureRequest = featureStore.openCursor();

            featureRequest.onsuccess = function (event) {
                const cursor = event.target.result;
                if (cursor) {
                    const feature = cursor.value;

                    if (feature.layer === layerName) {
                        // Atualiza a cor na propriedade layerColor
                        feature.geoJSON.properties.layerColor = color;

                        const updateFeatureRequest = featureStore.put(feature);

                        updateFeatureRequest.onsuccess = function () {
                            console.log(`Feature ID "${feature.id}" atualizada com nova cor "${color}".`);
                        };

                        updateFeatureRequest.onerror = function (event) {
                            console.error(`Erro ao atualizar a feature ID "${feature.id}" no banco:`, event);
                        };
                    }

                    cursor.continue(); // Continua para o próximo registro
                }
            };

            featureRequest.onerror = function (event) {
                console.error(`Erro ao atualizar as features da camada "${layerName}":`, event);
            };
        };

        updateRequest.onerror = function (event) {
            console.error(`Erro ao atualizar a cor da camada "${layerName}" no banco:`, event);
        };
    };

    request.onerror = function (event) {
        console.error(`Erro ao buscar a camada "${layerName}" no banco:`, event);
    };
}

function saveLayerToDB(layerName, isVisible = true, style = null) {
    const transaction = db.transaction(['layers'], 'readwrite');
    const layerStore = transaction.objectStore('layers');

    // Se um estilo for fornecido, usa-o; caso contrário, busca no layerStyles
    const layerData = {
        name: layerName,
        visible: isVisible,
        style: style || layerStyles[layerName] || { color: '#3388ff' }, // Prioriza o estilo passado
    };

    const request = layerStore.put(layerData); // Usar `put` para atualizar ou criar

    request.onsuccess = function () {
        console.log(`Camada "${layerName}" salva/atualizada no banco com sucesso.`);
    };

    request.onerror = function (event) {
        console.error('Erro ao salvar camada no banco:', event);
    };
}

function loadLayers() {
    const transaction = db.transaction(['layers'], 'readonly');
    const objectStore = transaction.objectStore('layers');
    const request = objectStore.getAll();

    request.onsuccess = function (event) {
        const savedLayers = event.target.result;

        savedLayers.forEach(layerData => {
            const newLayer = new L.FeatureGroup();
            layers[layerData.name] = newLayer;

            if (layerData.visible) {
                map.addLayer(newLayer); // Adiciona ao mapa se visível
            }
        });

        loadFeatures(); // Adiciona as geometrias às camadas

        // Define a primeira camada visível como ativa
        const firstVisibleLayer = savedLayers.find(layer => layer.visible);
        if (firstVisibleLayer) {
            setActiveLayer(firstVisibleLayer.name); // Configura a camada ativa
        } else {
            activeLayer = null; // Nenhuma camada visível disponível
        }

        updateLayerList(); // Atualiza a interface com a camada ativa correta
        loadAndApplyStyles();
    };

    request.onerror = function () {
        console.error('Erro ao carregar as layers do banco.');
    };
}

function createLayer(layerName, style = { color: '#3388ff' }) {
    if (!layerName || layers[layerName]) {
        alert('Nome de camada inválido ou já existente.');
        return;
    }

    layers[layerName] = new L.FeatureGroup();
    layerStyles[layerName] = style; // Armazena o estilo na variável global
    map.addLayer(layers[layerName]);
    saveLayerToDB(layerName, true, style); // Salva no banco
    setActiveLayer(layerName);
    updateLayerList(); // Atualiza a interface
    showToast(`Camada "${layerName}" criada com sucesso.`, 'success');
    logAction('Criação', `Layer "${layerName}" criada com sucesso.`);
}

function updateLayerVisibility(layerName, isVisible) {
    const transaction = db.transaction(['layers'], 'readwrite');
    const layerStore = transaction.objectStore('layers');
    const request = layerStore.get(layerName);

    request.onsuccess = function (event) {
        const layerData = event.target.result;
        if (layerData) {
            layerData.visible = isVisible;
            layerStore.put(layerData).onsuccess = function () {
                console.log(`Estado da camada "${layerName}" atualizado para ${isVisible ? 'visível' : 'invisível'}.`);
            };
        }
    };

    request.onerror = function () {
        console.error('Erro ao atualizar visibilidade da camada no banco.');
    };
}

function toggleLayerVisibility(layerName) {
    const layer = layers[layerName];
    if (!layer) return;

    if (activeLayer === layerName && drawControl) {
        // Remove o controle de edição do mapa
        map.removeControl(drawControl); // Remove a barra de ferramentas
        console.log(`Edição desativada para a camada "${layerName}".`);
    }

    // Alterna visibilidade no mapa
    const isVisible = map.hasLayer(layer);
    if (isVisible) {
        map.removeLayer(layer);
    } else {
        map.addLayer(layer);
    }

    // Atualiza no banco de dados
    updateLayerVisibility(layerName, !isVisible);

    if (isVisible) {
        // Camada foi desativada
        if (activeLayer === layerName) {
            activeLayer = null; // Remove a camada ativa temporariamente
            console.log(`Camada ativa removida: ${layerName}`);

            // Busca outra camada visível no banco
            const transaction = db.transaction(['layers'], 'readonly');
            const layerStore = transaction.objectStore('layers');
            const request = layerStore.getAll();

            request.onsuccess = function (event) {
                const allLayers = event.target.result;
                const visibleLayer = allLayers.find(layer => layer.visible);

                if (visibleLayer) {
                    setActiveLayer(visibleLayer.name); // Define a nova camada ativa
                } else {
                    console.warn('Nenhuma camada visível encontrada. Nenhuma camada ativa definida.');
                }
            };

            request.onerror = function () {
                console.error('Erro ao buscar camadas visíveis no banco.');
            };
        }
    } else {
        // Camada foi ativada, define como ativa
        setActiveLayer(layerName);
    }

    updateLayerList(); // Atualiza a lista visual das camadas
}

function updateLayerList() {
    const container = document.getElementById('layers-container');
    container.innerHTML = '';

    Object.keys(layers).forEach(layerName => {
        const layerItem = document.createElement('div');
        layerItem.style.display = 'flex';
        layerItem.style.alignItems = 'center';
        layerItem.style.marginBottom = '10px';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = map.hasLayer(layers[layerName]);
        checkbox.style.marginRight = '10px';
        checkbox.addEventListener('change', () => toggleLayerVisibility(layerName));

        const label = document.createElement('label');
        label.textContent = layerName;
        label.style.marginRight = '10px';
        label.style.padding = '5px';

        // Destaca a camada ativa em negrito
        if (layerName === activeLayer) {
            label.style.fontWeight = 'bold';
            label.style.backgroundColor = '#c9ffd1';
        }

        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        getLayerColor(layerName, (color) => {
            colorInput.value = color; // Atualiza o valor do input após buscar no banco
        });
        colorInput.style.marginRight = '10px';
        colorInput.addEventListener('input', (event) => {
            const color = event.target.value;
            setLayerStyle(layerName, { color });
        });

        const activateButton = document.createElement('button');
        activateButton.textContent = 'Ativar';
        activateButton.style.marginRight = '5px';
        activateButton.addEventListener('click', () => setActiveLayer(layerName));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Deletar';
        deleteButton.addEventListener('click', () => deleteLayer(layerName));

        layerItem.appendChild(checkbox);
        layerItem.appendChild(label);
        layerItem.appendChild(colorInput);
        layerItem.appendChild(activateButton);
        layerItem.appendChild(deleteButton);
        container.appendChild(layerItem);
    });

    updateDrawControl();
}

function getLayerColor(layerName, callback) {
    const transaction = db.transaction(['layers'], 'readonly');
    const objectStore = transaction.objectStore('layers');
    const request = objectStore.get(layerName);

    request.onsuccess = function (event) {
        const layerData = event.target.result;
        if (layerData && layerData.style && layerData.style.color) {
            callback(layerData.style.color);
        } else {
            callback('#3388ff'); // Retorna uma cor padrão se não encontrar a camada ou o estilo
        }
    };

    request.onerror = function () {
        console.error(`Erro ao buscar a cor para a camada "${layerName}".`);
        callback('#3388ff'); // Retorna uma cor padrão em caso de erro
    };
}

function deleteLayer(layerName) {
    if (!layers[layerName]) {
        alert(`A camada "${layerName}" não existe.`);
        return;
    }

    // Confirmação antes de deletar
    if (!confirm(`Tem certeza que deseja deletar a camada "${layerName}" e todas as suas geometrias?`)) {
        return;
    }

    // Remove as geometrias do banco de dados
    const transaction = db.transaction(['features'], 'readwrite');
    const objectStore = transaction.objectStore('features');
    const deleteRequest = objectStore.openCursor();

    deleteRequest.onsuccess = function (event) {
        const cursor = event.target.result;
        if (cursor) {
            const feature = cursor.value;
            if (feature.layer === layerName) {
                cursor.delete(); // Remove a geometria associada à camada
            }
            cursor.continue();
        }
    };

    showToast(`Camada "${layerName}" removida.`, 'success');
    logAction('Remoção', `Layer "${layerName}" removida.`);

    deleteRequest.onerror = function () {
        console.error('Erro ao deletar as geometrias associadas à camada do banco de dados.');
    };

    // Remove a camada do mapa
    map.removeLayer(layers[layerName]);
    delete layers[layerName];

    // Remove a camada do banco de dados
    const layerTransaction = db.transaction(['layers'], 'readwrite');
    const layerStore = layerTransaction.objectStore('layers');
    layerStore.delete(layerName).onsuccess = function () {
        console.log(`Camada "${layerName}" deletada do banco de dados.`);
        if (activeLayer === layerName) {
            // Define outra camada como ativa, se existir
            const remainingLayers = Object.keys(layers);
            if (remainingLayers.length > 0) {
                activeLayer = remainingLayers[0]; // Define a primeira camada restante como ativa
                console.log(`Camada "${activeLayer}" definida como ativa.`);
            } else {
                activeLayer = null; // Reseta a camada ativa se nenhuma outra estiver disponível
                console.log('Nenhuma camada restante. Camada ativa foi resetada.');
            }
        }
        updateLayerList(); // Atualiza a lista de camadas
        loadFeatures();
    };

    layerTransaction.onerror = function () {
        console.error('Erro ao deletar a camada do banco de dados.');
    };
}

function updateDrawControl() {
    if (!activeLayer || !layers[activeLayer]) {
        console.warn('Nenhuma camada ativa disponível para edição.');

        // Remove o controle de desenho atual
        if (drawControl) {
            map.removeControl(drawControl);
        }

        drawControl = new L.Control.Draw({
            edit: {
                featureGroup: new L.FeatureGroup().addTo(map),
                edit: false,
                remove: false
            },
            draw: {
                polygon: false,
                polyline: false,
                rectangle: false,
                circle: false,
                marker: false,
                circlemarker: false
            }
        });

        map.addControl(drawControl);
        return;
    }

    const featureGroup = layers[activeLayer];

    // Remove o controle de desenho atual
    if (drawControl) {
        map.removeControl(drawControl);
    }

    drawControl = new L.Control.Draw({
        edit: {
            featureGroup: featureGroup, // Vincula ao grupo da camada ativa
            edit: true,
            remove: false
        },
        draw: {
            polygon: true,
            polyline: true,
            rectangle: true,
            circle: true,
            marker: true,
            circlemarker: false
        }
    });

    map.addControl(drawControl);
    console.log(`Controle de edição atualizado para a camada ativa: ${activeLayer}`);
}

function setActiveLayer(layerName) {
    if (!layers[layerName]) {
        alert('Essa camada não existe.');
        return;
    }

    // Verifica no banco de dados se a camada está visível
    const transaction = db.transaction(['layers'], 'readonly');
    const layerStore = transaction.objectStore('layers');
    const request = layerStore.get(layerName);

    request.onsuccess = function (event) {
        const layerData = event.target.result;

        if (layerData && layerData.visible) {
            activeLayer = layerName;
            console.log(`Layer ativa: ${layerName}`);
            updateDrawControl();
        } else {
            activeLayer = null;
        }

        updateLayerList(); // Atualiza o estilo das layers após alterar a camada ativa
    };

    request.onerror = function () {
        console.error(`Erro ao verificar visibilidade da camada "${layerName}".`);
    };
}

// Inicializar IndexedDB
function initDatabase(dbName) {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        const objectStore = db.createObjectStore('features', { 
            keyPath: 'id', 
            autoIncrement: true 
        });
        objectStore.createIndex('type', 'type', { unique: false });
        objectStore.createIndex('name', 'name', { unique: false });
        objectStore.createIndex('layer', 'layer', { unique: false });
        if (!db.objectStoreNames.contains('layers')) {
            const layerStore = db.createObjectStore('layers', { keyPath: 'name' });
            layerStore.createIndex('name', 'name', { unique: true });
        }
        if (!db.objectStoreNames.contains('history')) {
            db.createObjectStore('history', { autoIncrement: true }); // Store para registrar ações
        }
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        loadLayers();
    };

    request.onerror = function(event) {
        console.error("Erro ao abrir banco de dados", event);
    };
}

function isFullscreen() {
    return !!document.fullscreenElement; // Retorna true se estiver em modo fullscreen
}

// Inicializar Mapa com Ferramentas de Desenho
function initMap(mapStyle) {
    map = L.map('map', {fullscreenControl: true}).setView([-22.9068, -43.1729], 10);
    let worldMiniMap = L.control.worldMiniMap({style: {opacity: 0.9, borderRadius: '0px', border: '1px solid black'}}).addTo(map);

    let options = {position: 'bottomright'};
    L.control.ruler(options).addTo(map);

    map.addControl(L.control.search({ position: 'bottomleft' }));

    L.tileLayer(mapStyle, {
        attribution: '© Contribuidores do mapa e provedores do estilo'
    }).addTo(map);

    // Obtém o elemento onde as coordenadas serão exibidas
    const coordinatesDisplay = document.getElementById('coordinates-display');

    // Adiciona o evento de "mousemove" ao mapa
    map.on('mousemove', (event) => {
        const { lat, lng } = event.latlng; // Obtém latitude e longitude
        currentCoordinates = `Lat ${lat.toFixed(6)}, Lng ${lng.toFixed(6)}`;
        coordinatesDisplay.style.display = 'block';
        coordinatesDisplay.innerHTML = `<b>Coordenadas:</b> ${currentCoordinates}`;
    });

    const coordinatesOverlay = L.control({ position: 'topright' });

    coordinatesOverlay.onAdd = function () {
        const div = L.DomUtil.create('div', 'leaflet-bar');
        div.id = 'coordinates-overlay';
        div.style.padding = '5px 10px';
        div.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        div.style.color = 'black';
        div.style.borderRadius = '4px';
        div.style.border = '1px solid rgb(204, 204, 204)';
        div.innerHTML = '<b>Coordenadas:</b> ';
        return div;
    };

    map.on('mousemove', (e) => {
        if (map.isFullscreen()) {
            const { lat, lng } = e.latlng;
            document.getElementById('coordinates-overlay').innerHTML = `<b>Coordenadas:</b> Lat ${lat.toFixed(6)}, Lng ${lng.toFixed(6)}`;
        }
    });

    map.on('fullscreenchange', () => {
        if (map.isFullscreen()) {
            coordinatesOverlay.addTo(map);
        } else {
            coordinatesOverlay.remove();
        }
    });

    // Configuração do Leaflet Draw
    drawControl = new L.Control.Draw({
        edit: {
            featureGroup: new L.FeatureGroup(), // Não é mais necessário um grupo global
            edit: true,
            remove: false
        },
        draw: {
            polygon: true,
            polyline: true,
            rectangle: true,
            circle: true,
            marker: true,
            circlemarker: false
        }
    });
    map.addControl(drawControl);

    // Evento após criar uma nova geometria
    map.on(L.Draw.Event.CREATED, function (e) {
        // Verifica no banco de dados se a camada ativa está visível
        const transaction = db.transaction(['layers'], 'readonly');
        const layerStore = transaction.objectStore('layers');
        const request = layerStore.getAll();

        request.onsuccess = function (event) {
            const allLayers = event.target.result;

            // Encontra a camada ativa no banco de dados
            let activeLayerData = allLayers.find(layer => layer.name === activeLayer && layer.visible);

            // Caso nenhuma camada ativa válida, define a primeira visível como ativa
            if (!activeLayerData) {
                activeLayerData = allLayers.find(layer => layer.visible);
                if (activeLayerData) {
                    activeLayer = activeLayerData.name;
                    console.log(`Nenhuma camada ativa válida encontrada. Definida a camada "${activeLayer}" como ativa.`);
                } else {
                    alert('Nenhuma camada visível encontrada. Ative uma camada antes de adicionar geometrias.');
                    return; // Interrompe a execução se nenhuma camada estiver visível
                }
            }

            const layerColor = activeLayerData?.style?.color || '#3388ff';

            // Adiciona a geometria à camada ativa
            const layer = e.layer;
            layers[activeLayer].addLayer(layer);

            const featureId = Date.now();

            // Obter informações específicas para círculos
            let geoJSON;
            if (e.layerType === 'circle') {
                geoJSON = {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [
                            layer.getLatLng().lng, // Longitude do centro
                            layer.getLatLng().lat  // Latitude do centro
                        ]
                    },
                    properties: {
                        radius: layer.getRadius(), // Adicionar o raio como propriedade
                        layer: activeLayer,        // Nome da camada ativa
                        layerColor: layerColor     // Cor da camada ativa
                    }
                };
            } else {
                geoJSON = layer.toGeoJSON(); // Para outros tipos, usar o método padrão
                geoJSON.properties.layer = activeLayer;    
                geoJSON.properties.layerColor = layerColor;
            }

            let name, description;

            if (isFullscreen()) {
                name = 'Editar nome';
                description = 'Editar descrição';
            } else {
                name = prompt('Digite um nome para esta geometria:') || 'Sem nome';
                description = prompt('Digite uma descrição (opcional):') || '';
            }

            layer.feature = {
                id: featureId,
                type: e.layerType,
                name: name,
                description: description,
                layer: activeLayer,
                geoJSON: geoJSON,
                timestamp: new Date()
            };

            // Salvar no IndexedDB
            const featureTransaction = db.transaction(['features'], 'readwrite');
            const objectStore = featureTransaction.objectStore('features');

            const featureData = {
                id: featureId,
                type: e.layerType,
                name: layer.feature.name,
                description: layer.feature.description,
                layer: activeLayer,
                geoJSON: geoJSON,
                images: [],
                timestamp: new Date()
            };

            const saveRequest = objectStore.add(featureData); 

            saveRequest.onsuccess = function () {
                console.log(`Geometria adicionada à camada "${activeLayer}" e salva no banco.`);
                showToast('Geometria adicionada com sucesso!', 'success');
                logAction('Criação', `Geometria adicionada com sucesso!`);
                loadFeatures(); // Atualiza a lista de geometrias
            };

            saveRequest.onerror = function (event) {
                console.error('Erro ao salvar a geometria no banco de dados:', event);
            };
        };

        request.onerror = function () {
            console.error(`Erro ao verificar visibilidade da camada "${activeLayer}".`);
        };
    });

    // Evento de edição de geometria
    map.on(L.Draw.Event.EDITED, function (e) {
        const editedLayers = e.layers;

        if (!activeLayer || !layers[activeLayer]) {
            alert('Por favor, ative uma camada antes de editar.');
            return;
        }

        editedLayers.eachLayer(function (layer) {
            // Verifica se a geometria pertence à camada ativa
            if (layer.feature && layer.feature.layer !== activeLayer) {
                alert(`A geometria não pertence à camada ativa "${activeLayer}".`);
                return;
            }

            console.log('Camada ativa editada:', layer);

            if (!layer.feature || !layer.feature.id) {
                console.error('Erro: Camada sem ID ou feature associada.');
                return;
            }

            // Atualiza os dados da geometria no banco
            const geoJSON = layer.toGeoJSON();
            const transaction = db.transaction(['features'], 'readwrite');
            const objectStore = transaction.objectStore('features');
            const request = objectStore.get(layer.feature.id);

            request.onsuccess = function (event) {
                const existingFeature = event.target.result;

                if (!existingFeature) {
                    console.error('Erro: Feature não encontrada no banco.');
                    return;
                }

                if (geoJSON.type === 'circle') {
                    existingFeature.geoJSON.geometry = geoJSON.geometry;
                    existingFeature.geoJSON.properties.radius = layer._mRadius;
                }  else {
                    // Substitui todo o conteúdo de geoJSON para outros tipos de geometria
                    existingFeature.geoJSON.geometry = geoJSON.geometry;
                    existingFeature.geoJSON.properties = { 
                        ...existingFeature.geoJSON.properties, 
                        ...geoJSON.properties 
                    };
                }
                existingFeature.timestamp = new Date().toISOString();

                const updateRequest = objectStore.put(existingFeature);

                updateRequest.onsuccess = function () {
                    console.log(`Feature ID ${layer.feature.id} atualizada com sucesso na camada "${activeLayer}".`);
                    showToast('Geometria alterada com sucesso!', 'success');
                    logAction('Edição', `Geometria alterada com sucesso!`);
                };

                updateRequest.onerror = function (e) {
                    console.error('Erro ao atualizar geometria no banco:', e);
                };
            };

            request.onerror = function () {
                console.error('Erro ao buscar a feature para edição.');
            };
        });
    });
}

let currentPage = 1;
const itemsPerPage = 4;

function populateLayerDropdown() {
    const layerDropdown = document.getElementById('layer-filter');
    const uniqueLayers = [...new Set(allFeatures.map(feature => feature.layer))];

    layerDropdown.innerHTML = '<option value="">Todas as Layers</option>';
    uniqueLayers.forEach(layer => {
        const option = document.createElement('option');
        option.value = layer;
        option.textContent = layer;
        layerDropdown.appendChild(option);
    });
}

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function populateTypeDropdown() {
    const typeDropDown = document.getElementById('type-filter');
    const uniqueTypes = [...new Set(allFeatures.map(feature => feature.type))];

    typeDropDown.innerHTML = '<option value="">Todas as Geometrias</option>';
    uniqueTypes.forEach(layer => {
        const option = document.createElement('option');
        option.value = layer;
        option.textContent = capitalizeFirstLetter(layer);
        typeDropDown.appendChild(option);
    });
}

function applyFilters() {
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    const selectedLayer = document.getElementById('layer-filter').value;
    const selectedType = document.getElementById('type-filter').value;

    // Filtra com base nos critérios de busca e camada
    filteredFeatures = allFeatures.filter(feature => {
        const matchesSearch = 
            feature.name.toLowerCase().includes(searchQuery) ||
            feature.description.toLowerCase().includes(searchQuery);
        const matchesLayer = !selectedLayer || feature.layer === selectedLayer;
        const matchesType = !selectedType || feature.type === selectedType;

        return matchesSearch && matchesLayer && matchesType;
    });

    renderFeatures(); // Renderiza a lista de features com base no filtro
}

function renderFeatures() {
    const featuresList = document.getElementById('features-list');
    featuresList.innerHTML = '';

    const totalItems = filteredFeatures.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Ajusta a página atual se necessário
    if (currentPage > totalPages) {
        currentPage = totalPages > 0 ? totalPages : 1;
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const featuresToDisplay = filteredFeatures.slice(start, end);

    featuresToDisplay.forEach(feature => {
        const featureItem = document.createElement('div');
        featureItem.classList.add('feature-item');
        featureItem.innerHTML = `
            <div style="margin-right: 10px">
                <button style="margin-bottom: 5px;" onclick="openCustomAttributesModal(${feature.id})">Atributos</button>
                <span style="display: inline-block; width: 15px; height: 15px; background-color: ${feature.geoJSON.properties.layerColor}; float: right;"></span>
                <p><b>Nome:</b> ${feature.name}</p>
                <p><b>Tipo:</b> ${capitalizeFirstLetter(feature.type)}</p>
                <p><b>Layer:</b> ${feature.layer}</p>
                <p><b>Descrição:</b> ${feature.description}</p>
                <p><b>Atributos:</b> ${Object.entries(feature.customAttributes || {}).map(
                    ([key, value]) => `<br><b>${key}:</b> ${value}`
                ).join('')}</p>
            </div>
            <div class="feature-actions">
                <button onclick="zoomToFeature(${feature.id})">Zoom</button>
                <button onclick="editFeature(${feature.id})">Editar</button>
                <button onclick="removeFeature(${feature.id})">Remover</button>
                <button onclick="openImageModal(${feature.id})">Imagens</button>
            </div>
        `;
        featuresList.appendChild(featureItem);
    });

    updatePaginationControls(totalPages);
}

function paginateFeatures() {
    renderFeatures();
}

function updatePaginationControls(totalPages) {
    const paginationContainer = document.getElementById('pagination-controls');
    paginationContainer.innerHTML = '';

    if (totalPages <= 1) return; // Sem paginação se houver apenas uma página

    const maxVisiblePages = 5; // Número máximo de páginas visíveis antes de exibir "..."
    let pages = [];

    if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        pages.push(1);

        if (currentPage > 3) {
            pages.push("...");
        }

        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 2) {
            pages.push("...");
        }

        pages.push(totalPages);
    }

    // Criar botões de paginação
    pages.forEach(page => {
        const button = document.createElement('button');

        if (page === "...") {
            button.textContent = "...";
            button.disabled = true;
            button.style.cursor = "not-allowed";
        } else {
            button.textContent = page;
            button.classList.add('pagination-btn');

            if (page === currentPage) {
                button.classList.add('active');
            }

            button.addEventListener('click', () => {
                currentPage = page;
                paginateFeatures();
            });
        }

        paginationContainer.appendChild(button);
    });

    // Criar div para centralizar o campo e o botão "Ir para"
    const goToPageContainer = document.createElement('div');
    goToPageContainer.style.marginTop = '10px';
    goToPageContainer.style.display = 'flex';
    goToPageContainer.style.alignItems = 'center';
    goToPageContainer.style.gap = '5px';

    // Criar campo de entrada para número da página
    const pageInput = document.createElement('input');
    pageInput.type = 'number';
    pageInput.min = 1;
    pageInput.max = totalPages;
    pageInput.placeholder = "Página";
    pageInput.style.width = '60px';
    pageInput.style.padding = '5px';
    pageInput.classList.add("go-to-page-input");

    // Criar botão "Ir para Página"
    const goToPageButton = document.createElement('button');
    goToPageButton.textContent = "Ir";
    goToPageButton.classList.add('pagination-btn');

    // Quando pressionar Enter ou clicar no botão, navegar para a página
    function goToPage() {
        const pageNum = parseInt(pageInput.value);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
            currentPage = pageNum;
            paginateFeatures();
        } else {
            alert("Número de página inválido.");
        }
    }

    goToPageButton.addEventListener('click', goToPage);
    pageInput.addEventListener('keypress', (event) => {
        if (event.key === "Enter") {
            goToPage();
        }
    });

    // Adicionar campo e botão dentro da div
    goToPageContainer.appendChild(pageInput);
    goToPageContainer.appendChild(goToPageButton);

    // Adicionar a div abaixo da paginação
    paginationContainer.appendChild(goToPageContainer);
}


let allFeatures = []; // Armazena todas as features carregadas do banco
let filteredFeatures = []; // Armazena features após aplicar os filtros

// Carregar geometrias salvas
function loadFeatures() {
    const featuresList = document.getElementById('features-list');
    featuresList.innerHTML = '';

    const transaction = db.transaction(['features'], 'readonly');
    const objectStore = transaction.objectStore('features');
    const request = objectStore.getAll();

    request.onsuccess = function (event) {
        const features = event.target.result;

        // Limpa todas as camadas antes de recarregar
        Object.keys(layers).forEach(layerName => {
            layers[layerName].clearLayers(); // Garante que as layers sejam resetadas
        });

        features.forEach(feature => {
            let layer;

            // Criar a geometria correspondente
            if (feature.type === 'circle') {
                const center = L.latLng(
                    feature.geoJSON.geometry.coordinates[1], // Latitude
                    feature.geoJSON.geometry.coordinates[0]  // Longitude
                );
                const radius = feature.geoJSON.properties.radius; // Raio armazenado
                layer = L.circle(center, { radius: radius });
            } else if (feature.geoJSON.geometry.type === 'Polygon') {
                const latlngs = feature.geoJSON.geometry.coordinates[0].map(coord => L.latLng(coord[1], coord[0]));
                layer = L.polygon(latlngs); // Converte o GeoJSON para um L.Polygon
            } else if (feature.geoJSON.geometry.type === 'LineString') {
                const latlngs = feature.geoJSON.geometry.coordinates.map(coord => L.latLng(coord[1], coord[0]));
                layer = L.polyline(latlngs); // Converte o GeoJSON para um L.Polyline
            } else if (feature.type === 'marker' || feature.type === 'Point') {
                const latLng = L.latLng(
                    feature.geoJSON.geometry.coordinates[1], // Latitude
                    feature.geoJSON.geometry.coordinates[0]  // Longitude
                );
                layer = L.marker(latLng);
            } else {
                // Use L.geoJSON para tipos não suportados diretamente
                layer = L.geoJSON(feature.geoJSON, {
                    onEachFeature: function (geoFeature, subLayer) {
                        subLayer.feature = feature; // Vincula o feature à geometria
                    }
                });
            }

            layer.feature = feature;

            // Aplica o estilo da camada à geometria, se disponível
            const style = layerStyles[feature.layer] || { color: '#3388ff' };
            if (layer.setStyle) {
                layer.setStyle(style);
            }

            // Adicionar ao grupo da camada correspondente
            if (layers[feature.layer]) {
                layers[feature.layer].addLayer(layer); // Adiciona à camada correta
            }

            // Atualizar a lista na barra lateral
            const featureItem = document.createElement('div');
            featureItem.classList.add('feature-item');
            featureItem.innerHTML = `
                <div style="margin-right: 10px">
                    <button style="margin-bottom: 5px;" onclick="openCustomAttributesModal(${feature.id})">Atributos</button>
                    <span style="display: inline-block; width: 15px; height: 15px; background-color: ${feature.geoJSON.properties.layerColor}; float: right;"></span>
                    <p><b>Nome:</b> ${feature.name}</p>
                    <p><b>Tipo:</b> ${capitalizeFirstLetter(feature.type)}</p>
                    <p><b>Layer:</b> ${feature.layer}</p>
                    <p><b>Descrição:</b> ${feature.description}</p>
                    <p><b>Atributos:</b> ${Object.entries(feature.customAttributes || {}).map(
                        ([key, value]) => `<br>${key}: ${value}`
                    ).join('')}</p>
                </div>
                <div class="feature-actions">
                    <button onclick="zoomToFeature(${feature.id})">Zoom</button>
                    <button onclick="editFeature(${feature.id})">Editar</button>
                    <button onclick="removeFeature(${feature.id})">Remover</button>
                    <button onclick="openImageModal(${feature.id})">Imagens</button>
                </div>
            `;
            featuresList.appendChild(featureItem);
        });

        allFeatures = event.target.result; // Armazena todas as features
        populateLayerDropdown(); // Atualiza o dropdown de layers
        populateTypeDropdown();
        applyFilters(); // Aplica os filtros para exibir as features
    };

    request.onerror = function () {
        console.error('Erro ao carregar as geometrias do banco.');
    };
}

let currentFeatureId = null;

function openImageModal(featureId) {
    currentFeatureId = featureId;

    // Carrega as imagens associadas a partir do banco
    const transaction = db.transaction(['features'], 'readonly');
    const objectStore = transaction.objectStore('features');
    const request = objectStore.get(featureId);

    request.onsuccess = function (event) {
        const feature = event.target.result;
        const imageList = document.getElementById('image-list');
        const imageInfo = document.getElementById('image-info');
        imageList.innerHTML = '';

        if (feature.images && feature.images.length > 0) {
            feature.images.forEach((image, index) => {
                const img = document.createElement('img');
                img.src = image;
                img.style.width = '150px';
                img.style.height = '150px';
                img.style.margin = '5px';
                img.classList.add("feature-image");

                img.onclick = () => openFullImage(image);

                const removeBtn = document.createElement('button');
                removeBtn.textContent = 'Remover';
                removeBtn.style.display = 'block';
                removeBtn.onclick = () => removeImage(featureId, index);

                const container = document.createElement('div');
                container.appendChild(img);
                container.appendChild(removeBtn);

                imageList.appendChild(container);
                imageInfo.textContent = `Total de imagens: ${feature.images.length}`;
                imageInfo.style.marginTop = '15px';
            });
        } else {
            imageInfo.textContent = 'Nenhuma imagem associada.';
            imageInfo.style.marginTop = '0px';
        }

        document.getElementById('image-modal').style.display = 'block';
    };

    request.onerror = function () {
        console.error('Erro ao carregar a geometria.');
    };
}

function closeImageModal() {
    document.getElementById('image-modal').style.display = 'none';
    currentFeatureId = null;
}

window.onclick = function(event) {
    const modal = document.getElementById("image-modal");
    const statisticsModal = document.getElementById("statistics-modal");
    const openCustomAttributesModal = document.getElementById("custom-attributes-modal");
    const historyModal = document.getElementById('history-modal');

    if (event.target === modal) {
        modal.style.display = "none";
    }
    if (event.target === statisticsModal) {
        statisticsModal.style.display = "none";
    }
    if (event.target === openCustomAttributesModal) {
        openCustomAttributesModal.style.display = "none";                
    }
    if (event.target === historyModal) {
        historyModal.style.display = 'none';
    }
}

function uploadImages() {
    const fileInput = document.getElementById('image-upload');
    const files = fileInput.files;

    if (!currentFeatureId || files.length === 0) {
        alert('Nenhuma geometria selecionada ou arquivos carregados.');
        return;
    }

    const transaction = db.transaction(['features'], 'readwrite');
    const objectStore = transaction.objectStore('features');
    const request = objectStore.get(currentFeatureId);

    request.onsuccess = function (event) {
        const feature = event.target.result;
        if (!feature) {
            console.error('Geometria não encontrada.');
            return;
        }

        const readerPromises = Array.from(files).map(file => {
            return new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = function (e) {
                    resolve(e.target.result);
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readerPromises)
            .then(images => {
                feature.images = feature.images || [];
                feature.images.push(...images);

                // Garante que a transação só finalize após a operação de `put`
                const updateTransaction = db.transaction(['features'], 'readwrite');
                const updateObjectStore = updateTransaction.objectStore('features');
                const updateRequest = updateObjectStore.put(feature);

                updateRequest.onsuccess = function () {
                    console.log('Imagens salvas com sucesso.');
                    openImageModal(currentFeatureId); // Recarrega o modal
                    fileInput.value = '';
                };

                updateRequest.onerror = function () {
                    console.error('Erro ao salvar as imagens no banco.');
                };
            })
            .catch(error => {
                console.error('Erro ao processar as imagens:', error);
            });
    };

    showToast(`Upload concluído com sucesso.`, 'success');
    logAction('Criação', `Upload concluído com sucesso.`);

    request.onerror = function () {
        console.error('Erro ao buscar geometria para upload de imagens.');
    };
}

async function exportImages() {
    if (!currentFeatureId) {
        alert('Nenhuma geometria selecionada para exportar imagens.');
        return;
    }

    // Busca as imagens associadas à geometria
    const transaction = db.transaction(['features'], 'readonly');
    const objectStore = transaction.objectStore('features');
    const request = objectStore.get(currentFeatureId);

    request.onsuccess = async function (event) {
        const feature = event.target.result;

        if (!feature || !feature.images || feature.images.length === 0) {
            alert('Nenhuma imagem encontrada para exportar.');
            return;
        }

        // Cria o arquivo ZIP
        const zip = new JSZip();

        feature.images.forEach((imageData, index) => {
            // Identifica o tipo de imagem (e.g., PNG, JPEG)
            const match = imageData.match(/^data:image\/(png|jpeg|jpg);base64,/);
            if (!match) {
                console.error(`Formato de imagem inválido para a imagem ${index + 1}`);
                return;
            }

            const imageType = match[1]; // Tipo da imagem (e.g., png, jpeg)
            const base64Data = imageData.split(',')[1]; // Remove o prefixo "data:image/...;base64,"

            // Adiciona a imagem ao ZIP
            zip.file(`image_${index + 1}.${imageType}`, base64Data, { base64: true });
        });

        // Gera o ZIP e faz o download
        try {
            const blob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `imagens_geometria_${currentFeatureId}.zip`;
            a.click();

            console.log('Arquivo ZIP criado com sucesso.');
        } catch (error) {
            console.error('Erro ao criar o arquivo ZIP:', error);
        }
    };

    request.onerror = function () {
        console.error('Erro ao buscar as imagens para exportação.');
    };
}

function openFullImage(imageSrc) {
    const fullImageModal = document.createElement('div');
    fullImageModal.id = 'full-image-modal';
    fullImageModal.style.position = 'fixed';
    fullImageModal.style.top = '0';
    fullImageModal.style.left = '0';
    fullImageModal.style.width = '100%';
    fullImageModal.style.height = '100%';
    fullImageModal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    fullImageModal.style.display = 'flex';
    fullImageModal.style.alignItems = 'center';
    fullImageModal.style.justifyContent = 'center';
    fullImageModal.style.zIndex = '1000';

    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.maxWidth = '90%';
    img.style.maxHeight = '90%';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Fechar';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '20px';
    closeButton.style.right = '20px';
    closeButton.style.padding = '10px 15px';
    closeButton.style.backgroundColor = 'red';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';

    closeButton.onclick = () => {
        document.body.removeChild(fullImageModal);
    };

    fullImageModal.appendChild(img);
    fullImageModal.appendChild(closeButton);
    document.body.appendChild(fullImageModal);
}

function removeImage(featureId, index) {
    const transaction = db.transaction(['features'], 'readwrite');
    const objectStore = transaction.objectStore('features');
    const request = objectStore.get(featureId);

    if (!confirm(`Tem certeza que deseja deletar a imagem?`)) {
        return;
    }

    request.onsuccess = function (event) {
        const feature = event.target.result;
        feature.images.splice(index, 1); // Remove a imagem pelo índice

        const updateRequest = objectStore.put(feature);
        updateRequest.onsuccess = function () {
            console.log('Imagem removida com sucesso.');
            openImageModal(featureId); // Recarrega o modal
        };
        updateRequest.onerror = function () {
            console.error('Erro ao remover imagem no banco.');
        };
    };

    showToast(`Imagem removida com sucesso.`, 'success');
    logAction('Remoção', `Imagem removida com sucesso.`);

    request.onerror = function () {
        console.error('Erro ao buscar geometria para remoção de imagem.');
    };
}

function editFeature(featureId) {
    const transaction = db.transaction(['features'], 'readonly');
    const objectStore = transaction.objectStore('features');
    const request = objectStore.get(featureId);

    request.onsuccess = function(event) {
        const feature = event.target.result;

        // Editar propriedades básicas
        const newName = prompt('Digite o novo nome:', feature.name);
        const newDescription = prompt('Digite a nova descrição:', feature.description);

        if (newName || newDescription) {
            const updatedFeature = { 
                ...feature, 
                name: newName || feature.name, 
                description: newDescription || feature.description 
            };

            // Atualizar no banco
            const updateTransaction = db.transaction(['features'], 'readwrite');
            const updateStore = updateTransaction.objectStore('features');
            updateStore.put(updatedFeature).onsuccess = function() {
                loadFeatures(); // Atualizar a lista no painel lateral
                showToast(`Informações alteradas com sucesso.`, 'success');
                logAction('Edição', `Informações alteradas com sucesso.`);
            };
        }
    };
}

// Zoom para uma geometria específica
function zoomToFeature(featureId) {
    const transaction = db.transaction(['features'], 'readonly');
    const objectStore = transaction.objectStore('features');
    const request = objectStore.get(featureId);

    request.onsuccess = function(event) {
        const feature = event.target.result;
        if (feature.geoJSON.geometry.type === 'circle') {
            feature.geoJSON.geometry.type = 'Point';
        }
        const leafletLayer = L.geoJSON(feature.geoJSON.geometry);
        map.fitBounds(leafletLayer.getBounds());
    };
}

// Remover geometria
function removeFeature(featureId) {
    const transaction = db.transaction(['features'], 'readwrite');
    const objectStore = transaction.objectStore('features');

    const request = objectStore.get(featureId);

    request.onsuccess = function (event) {
        const feature = event.target.result;

        if (!feature) {
            console.error(`Feature com ID ${featureId} não encontrada no banco.`);
            return;
        }

        if (!confirm(`Tem certeza que deseja deletar a geometria "${feature.name}"?`)) {
            return;
        }

        // Remover a geometria da camada correspondente
        const layerName = feature.layer; // A camada associada à geometria
        if (layers[layerName]) {
            layers[layerName].eachLayer(layer => {
                if (layer.feature && layer.feature.id === featureId) {
                    layers[layerName].removeLayer(layer); // Remove do mapa
                }
            });
        }

        // Remover do banco de dados
        const deleteRequest = objectStore.delete(featureId);
        deleteRequest.onsuccess = function () {
            console.log(`Feature ID ${featureId} removida com sucesso.`);
            loadFeatures(); // Atualizar lista na barra lateral
            showToast(`Feature ID ${featureId} removida com sucesso.`, 'success');
            logAction('Remoção', `Feature ID ${featureId} removida com sucesso.`);
        };

        deleteRequest.onerror = function () {
            console.error(`Erro ao remover a feature ID ${featureId} do banco.`);
        };
    };

    request.onerror = function () {
        console.error('Erro ao buscar a feature para remoção.');
    };
}

function exportToGeoJSON() {
    const transaction = db.transaction(['features'], 'readonly');
    const objectStore = transaction.objectStore('features');
    const request = objectStore.getAll();

    request.onsuccess = function (event) {
        const features = event.target.result.map(feature => {
            const geoJSON = { ...feature.geoJSON };

            // Ajusta o formato do círculo para exportação
            if (feature.type === 'circle') {
                geoJSON.geometry.type = 'circle'; // Exporta círculos como "Circle"
                geoJSON.properties.radius = feature.geoJSON.properties.radius;
            }

            // Inclui o nome da layer no objeto GeoJSON
            geoJSON.properties.layer = feature.layer;

            // Inclui a cor da camada no objeto GeoJSON
            const layerColor = layerStyles[feature.layer]?.color || '#3388ff'; // Pega do estilo ou usa padrão
            geoJSON.properties.layerColor = layerColor;
            geoJSON.properties.name = feature.name || 'Sem nome';
            geoJSON.properties.description = feature.description || '';
            geoJSON.properties.customAttributes = feature.customAttributes || {};

            return geoJSON;
        });

        const geoJSONData = { type: "FeatureCollection", features: features };
        const blob = new Blob([JSON.stringify(geoJSONData)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'geometrias.geojson';
        a.click();
    };

    request.onerror = function () {
        console.error('Erro ao exportar as geometrias.');
    };
}

function importGeoJSON(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const geoJSONData = JSON.parse(event.target.result);

        if (!geoJSONData || !geoJSONData.features || !geoJSONData.features.length) {
            alert('Arquivo GeoJSON inválido ou sem geometrias.');
            return;
        }

        const importedLayers = {}; // Para rastrear cores por camada

        geoJSONData.features.forEach(feature => {
            const layerName = feature.properties.layer || 'Default Layer';
            const layerColor = feature.properties.layerColor || '#3388ff';
            const featureId = feature.id || Date.now() + Math.random(); // ID único

            // Cria ou atualiza o estilo da camada no mapa
            if (!layers[layerName]) {
                createLayer(layerName, { color: layerColor }); // Passa o estilo na criação
                importedLayers[layerName] = layerColor; // Armazena a cor
            }

            let layer;
            if (feature.geometry.type === 'circle') {
                const center = L.latLng(
                    feature.geometry.coordinates[1],
                    feature.geometry.coordinates[0]
                );
                const radius = feature.properties.radius;
                layer = L.circle(center, { radius, color: layerColor });
            } else if (feature.geometry.type === 'Point') {
                const coordinates = feature.geometry.coordinates;
                layer = L.marker([coordinates[1], coordinates[0]]);
            } else {
                layer = L.geoJSON(feature, {
                    onEachFeature: function (f, subLayer) {
                        subLayer.feature = f;
                        layers[layerName].addLayer(subLayer);
                    },
                    style: { color: layerColor },
                });
            }

            layers[layerName].addLayer(layer); // Adiciona ao mapa

            // Salva no IndexedDB
            const transaction = db.transaction(['features'], 'readwrite');
            const objectStore = transaction.objectStore('features');
            const featureData = {
                id: featureId,
                type: feature.geometry.type,
                name: feature.properties.name || 'Sem nome',
                description: feature.properties.description || '',
                customAttributes: feature.properties.customAttributes || {},
                layer: layerName,
                geoJSON: feature,
                timestamp: new Date().toISOString()
            };

            objectStore.add(featureData).onsuccess = function () {
                console.log(`Feature adicionada à camada "${layerName}" e salva no banco.`);
            };
        });

        loadFeatures();
        updateLayerList();
    };

    reader.readAsText(file);
}

function loadAndApplyStyles() {
    if (!db) {
        console.error('Banco de dados não inicializado.');
        return;
    }

    const transaction = db.transaction(['layers'], 'readonly');
    const objectStore = transaction.objectStore('layers');
    const request = objectStore.getAll();

    request.onsuccess = function (event) {
        const savedLayers = event.target.result;

        savedLayers.forEach(layerData => {
            if (layers[layerData.name]) {
                // Atualiza o `layerStyles` com os estilos do banco
                layerStyles[layerData.name] = layerData.style || { color: '#3388ff' };

                // Aplica os estilos nas camadas existentes
                layers[layerData.name].eachLayer(layer => {
                    if (layer.setStyle) {
                        layer.setStyle({
                            color: layerStyles[layerData.name].color
                        });
                    }
                });

                console.log(`Estilo aplicado à camada "${layerData.name}":`, layerStyles[layerData.name]);
            } else {
                console.warn(`Camada "${layerData.name}" não encontrada para aplicar estilo.`);
            }
        });

        console.log('Estilos carregados e aplicados com sucesso.');
    };

    request.onerror = function () {
        console.error('Erro ao carregar estilos do banco de dados.');
    };
}

// Lista de bancos de dados
let dbList = [];
let currentDBName = null;

// Atualiza a lista na interface
function updateDBListUI() {
    const dbListContainer = document.getElementById('db-list');
    const projects = document.getElementById('projects');

    dbListContainer.innerHTML = '';

    if (dbList.length === 0) {
        projects.textContent = 'Crie o seu primeiro mapa!'
        dbListContainer.style.margin = '0px';
    } else {
        projects.textContent = 'Lista de Mapas'
        dbListContainer.style.margin = '10px';
    }

    dbList.forEach(dbName => {
        const listItem = document.createElement('li');
        listItem.style.marginBottom = '20px';
        listItem.classList.add("dbItem");

        const dbNameLabel = document.createElement('span');
        dbNameLabel.textContent = dbName;
        dbNameLabel.style.marginRight = '10px';
        dbNameLabel.style.fontWeight = 'bold';

        const buttonDiv = document.createElement('div');
        buttonDiv.classList.add("initialButtons");
        buttonDiv.style.marginTop = '10px';

        const accessButton = document.createElement('button');
        accessButton.textContent = 'Acessar';         
        accessButton.style.marginRight = '10px'
        accessButton.onclick = () => accessDatabase(dbName);
        accessButton.classList.add("access-db-button");

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.onclick = () => deleteDatabase(dbName);
        deleteButton.style.marginRight = '10px';
        deleteButton.classList.add("delete-db-button");

        listItem.appendChild(dbNameLabel);
        listItem.appendChild(buttonDiv);
        buttonDiv.appendChild(accessButton);
        buttonDiv.appendChild(deleteButton);

        dbListContainer.appendChild(listItem);
    });
}

// Carrega a lista de bancos de dados salvos no LocalStorage
function loadDBList() {
    const savedDBList = localStorage.getItem('dbList');
    if (savedDBList) {
        dbList = JSON.parse(savedDBList);
    }
    updateDBListUI();
}

// Salva a lista de bancos de dados no LocalStorage
function saveDBList() {
    localStorage.setItem('dbList', JSON.stringify(dbList));
}

// Cria um novo banco de dados
function createDatabase() {
    const dbName = document.getElementById('new-db-name').value.trim();
    if (!dbName || dbList.includes(dbName)) {
        alert('Nome inválido ou banco já existe.');
        return;
    }

    dbList.push(dbName);
    saveDBList();
    updateDBListUI();
    document.getElementById('new-db-name').value = '';
}

// Exclui um banco de dados
function deleteDatabase(dbName) {
    if (!confirm(`Tem certeza que deseja excluir o banco "${dbName}"?`)) return;

    const dbRequest = indexedDB.deleteDatabase(dbName);
    dbRequest.onsuccess = () => {
        dbList = dbList.filter(db => db !== dbName);
        saveDBList();
        updateDBListUI();
        console.log(`Banco de dados "${dbName}" excluído com sucesso.`);
    };
    dbRequest.onerror = (event) => {
        console.error(`Erro ao excluir o banco de dados "${dbName}":`, event.target.error);
    };
}

// Acessa o banco de dados selecionado
function accessDatabase(dbName) {
    currentDBName = dbName;
    
    const startScreen = document.getElementById('start-screen');
    const mapContainer = document.getElementById('map-container');
    const mapStyle = document.getElementById('map-style-dropdown').value;

    // Adiciona a classe para iniciar a animação de subida
    startScreen.classList.add('hidden');

    // Aguarda a animação da cortina antes de exibir o mapa
    setTimeout(() => {
        startScreen.style.display = 'none'; // Remove a tela inicial do fluxo do DOM

        // Exibe o mapa com fade-in
        mapContainer.style.display = 'block';
        mapContainer.classList.add('visible');
        document.getElementById('db-name-info').textContent = dbName;

        // Inicializa o mapa
        initDatabase(dbName);
        initMap(mapStyle);
    }, 1000); // Duração igual ao tempo da transição CSS
}

let typeChartInstance = null;
let layerChartInstance = null;
let actionChartInstance = null;

function calculateStatistics() {
    const featuresTransaction = db.transaction(['features'], 'readonly');
    const featuresStore = featuresTransaction.objectStore('features');
    const featuresRequest = featuresStore.getAll();

    const historyTransaction = db.transaction(['history'], 'readonly');
    const historyStore = historyTransaction.objectStore('history');
    const historyRequest = historyStore.getAll();

    Promise.all([
        new Promise((resolve) => {
            featuresRequest.onsuccess = (event) => resolve(event.target.result);
            featuresRequest.onerror = () => resolve([]);
        }),
        new Promise((resolve) => {
            historyRequest.onsuccess = (event) => resolve(event.target.result);
            historyRequest.onerror = () => resolve([]);
        })
    ]).then(([features, history]) => {
        // Agrupa geometrias por tipo
        const typeCounts = {};
        const layerCounts = {};
        features.forEach(feature => {
            const type = feature.type;
            typeCounts[type] = (typeCounts[type] || 0) + 1;

            const layer = feature.layer;
            layerCounts[layer] = (layerCounts[layer] || 0) + 1;
        });

        // Agrupa ações do histórico
        const actionCounts = {};
        history.forEach(entry => {
            const action = entry.action;
            actionCounts[action] = (actionCounts[action] || 0) + 1;
        });

        // Resumo total
        const totalFeatures = features.length;
        const totalLayers = Object.keys(layerCounts).length;

        // Atualiza o resumo
        const summary = document.getElementById('statistics-summary');
        summary.innerHTML = `
            <p style="margin-top: 10px;"><b>Total de Geometrias:</b> ${totalFeatures}</p>
            <p><b>Total de Camadas:</b> ${totalLayers}</p>
        `;

        // Renderiza os gráficos
        renderTypeChart(typeCounts);
        renderLayerChart(layerCounts);
        renderActionChart(actionCounts);

        // Exibe o modal
        document.getElementById('statistics-modal').style.display = 'block';
    });
}

function renderActionChart(actionCounts) {
    const ctx = document.getElementById('chart-actions').getContext('2d');

    // Destroi o gráfico anterior, se existir
    if (actionChartInstance) {
        actionChartInstance.destroy();
    }

    // Cria um novo gráfico
    actionChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(actionCounts),
            datasets: [{
                label: 'Ações no Histórico',
                data: Object.values(actionCounts),
                backgroundColor: [
                    'rgba(250, 95, 95, 0.6)',
                    'rgba(116, 250, 95, 0.6)',
                    'rgba(78, 114, 245, 0.6)',
                ],
                borderColor: [
                    'rgba(250, 95, 95, 0.6)',
                    'rgba(116, 250, 95, 0.6)',
                    'rgba(78, 114, 245, 0.6)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}

function renderTypeChart(typeCounts) {
    const ctx = document.getElementById('chart-types').getContext('2d');

    // Destroi o gráfico anterior, se existir
    if (typeChartInstance) {
        typeChartInstance.destroy();
    }

    // Cria um novo gráfico
    typeChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(typeCounts),
            datasets: [{
                label: 'Geometrias por Tipo',
                data: Object.values(typeCounts),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            },
            plugins: {
                legend: {
                    display: false
                },
            }
        }
    });
}

function renderLayerChart(layerCounts) {
    const ctx = document.getElementById('chart-layers').getContext('2d');

    // Destroi o gráfico anterior, se existir
    if (layerChartInstance) {
        layerChartInstance.destroy();
    }

    // Cria um novo gráfico
    layerChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(layerCounts),
            datasets: [{
                label: 'Geometrias por Layer',
                data: Object.values(layerCounts),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            indexAxis: 'y', // Torna o gráfico de barras horizontal
            scales: {
                x: { beginAtZero: true }
            },
            plugins: {
                legend: {
                    display: false
                },
            }
        }
    });
}

function closeStatisticsModal() {
    document.getElementById('statistics-modal').style.display = 'none';
}

function closeCustomAttributesModal() {
    document.getElementById('custom-attributes-modal').style.display = 'none';           
}

let currentFeatureIdCustomAttributes = null;

function openCustomAttributesModal(featureId) {
    currentFeatureIdCustomAttributes = featureId;

    // Obter atributos da geometria selecionada
    const transaction = db.transaction(['features'], 'readonly');
    const objectStore = transaction.objectStore('features');
    const request = objectStore.get(featureId);

    request.onsuccess = function (event) {
        const feature = event.target.result;
        const attributesList = document.getElementById('attributes-list');
        attributesList.innerHTML = '';

        const attributes = feature.customAttributes || {};
        for (const key in attributes) {
            const li = document.createElement('li');

            const span = document.createElement('span');
            span.innerHTML = `<b>${key}:</b> ${attributes[key]}`;
            
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remover';
            removeBtn.style.marginLeft = '5px';
            removeBtn.style.marginTop = '5px';

            // Configurar evento de clique no botão "Remover"
            removeBtn.addEventListener('click', () => removeAttribute(key));

            li.appendChild(span);
            li.appendChild(removeBtn);

            attributesList.appendChild(li);
        }

        document.getElementById('custom-attributes-modal').style.display = 'block';
    };

    request.onerror = function () {
        console.error('Erro ao buscar a geometria no banco.');
    };
}

document.getElementById('add-save-attribute-btn').addEventListener('click', () => {
    const key = document.getElementById('new-attribute-key').value.trim();
    const value = document.getElementById('new-attribute-value').value.trim();

    if (!key || !value) {
        alert('Chave e valor não podem estar vazios.');
        return;
    }

    if (!currentFeatureIdCustomAttributes) {
        console.error('Nenhuma geometria selecionada.');
        return;
    }

    const transaction = db.transaction(['features'], 'readwrite');
    const objectStore = transaction.objectStore('features');
    const request = objectStore.get(currentFeatureIdCustomAttributes);

    request.onsuccess = function (event) {
        const feature = event.target.result;

        if (!feature) {
            console.error('Geometria não encontrada no banco.');
            return;
        }

        // Atualiza os atributos no objeto
        feature.customAttributes = feature.customAttributes || {};
        feature.customAttributes[key] = value;

        // Salva no banco de dados
        const updateRequest = objectStore.put(feature);
        updateRequest.onsuccess = function () {
            console.log(`Atributo "${key}" adicionado/atualizado no banco.`);

            // Atualiza a lista na UI
            const attributesList = document.getElementById('attributes-list');
            const li = document.createElement('li');
            li.innerHTML = `
                <span><b>${key}:</b> ${value}</span>
            `;

            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remover';
            removeBtn.addEventListener('click', () => removeAttribute(key));
            li.appendChild(removeBtn);

            attributesList.appendChild(li);

            document.getElementById('new-attribute-key').value = '';
            document.getElementById('new-attribute-value').value = '';
            debouncedLoadFeatures();
            showToast(`Atributo adicionado com sucesso.`, 'success');
            logAction('Criação', `Atributo adicionado com sucesso.`);
        };

        updateRequest.onerror = function () {
            console.error('Erro ao salvar o atributo no banco.');
        };
    };

    request.onerror = function () {
        console.error('Erro ao buscar a geometria no banco.');
    };
});

function removeAttribute(key) {
    if (!currentFeatureIdCustomAttributes) {
        console.error('Nenhuma geometria selecionada.');
        return;
    }

    if (!confirm(`Tem certeza que deseja deletar o atributo "${key}"?`)) {
        return;
    }

    const transaction = db.transaction(['features'], 'readwrite');
    const objectStore = transaction.objectStore('features');
    const request = objectStore.get(currentFeatureIdCustomAttributes);

    request.onsuccess = function (event) {
        const feature = event.target.result;

        if (!feature || !feature.customAttributes) {
            console.error('Atributos não encontrados na geometria.');
            return;
        }

        // Remove o atributo do objeto no banco
        delete feature.customAttributes[key];

        // Atualiza o banco de dados
        const updateRequest = objectStore.put(feature);
        updateRequest.onsuccess = function () {
            console.log(`Atributo "${key}" removido com sucesso do banco.`);

            // Atualiza a lista na UI
            const attributesList = document.getElementById('attributes-list');
            const items = Array.from(attributesList.children);
            items.forEach((item) => {
                if (item.innerHTML.includes(`<b>${key}:</b>`)) {
                    attributesList.removeChild(item); // Remove o item da lista
                }
            });
            debouncedLoadFeatures();
            showToast(`Atributo removido com sucesso.`, 'success');
            logAction('Remoção', `Atributo removido com sucesso.`);
        };

        updateRequest.onerror = function () {
            console.error(`Erro ao remover o atributo "${key}" do banco.`);
        };
    };

    request.onerror = function () {
        console.error('Erro ao buscar a geometria no banco.');
    };
}

function reloadPage() {
    window.location.reload();
}

let canReload = true; // Variável de controle

document.addEventListener('keyup', function (e) {
    if (e.ctrlKey && e.key.toLowerCase() === 'b' && document.getElementById('map-container').style.display === 'block') {
        if (canReload) {
            reloadPage();

            // Bloqueia novas ações por 8 segundos
            canReload = false;
            setTimeout(() => {
                canReload = true; // Permite novamente após 8 segundos
            }, 8000);
        }
    }
});

document.addEventListener('keydown', (event) => {
    // Verifica se a tecla pressionada é "C" (ou outra que preferir)
    if (event.key.toLowerCase() === 'c') {
        if (currentCoordinates) {
            navigator.clipboard.writeText(currentCoordinates)
                .then(() => {
                    const coordinatesDisplay = document.getElementById('coordinates-display');
                    coordinatesDisplay.textContent = 'Coordenadas copiadas!';
                    setTimeout(() => {
                        coordinatesDisplay.textContent = `Coordenadas: ${currentCoordinates}`;
                    }, 1000);
                })
                .catch(err => {
                    console.error('Erro ao copiar para o clipboard:', err);
                });
        } else {
            console.error('Nenhuma coordenada disponível para copiar.');
        }
    }
});

document.getElementById('go-to-coordinate-button').addEventListener('click', () => {
    const input = document.getElementById('coordinate-input').value.trim();

    // Valida a entrada
    const regex = /^Lat\s*(-?\d+(\.\d+)?),\s*Lng\s*(-?\d+(\.\d+)?)$/i;
    const match = input.match(regex);

    if (!match) {
        alert('Formato inválido! Use: Lat -22.806567, Lng -42.938690');
        return;
    }

    // Extrai as coordenadas
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[3]);

    // Move o mapa para as coordenadas
    map.setView([lat, lng], 15); // Ajuste o zoom (15 é um exemplo)
});

// Inicialização
window.onload = function() {
    document.getElementById('create-db-button').addEventListener('click', createDatabase);
    document.getElementById('export-btn').addEventListener('click', exportToGeoJSON);
    document.getElementById('statistics-btn').addEventListener('click', calculateStatistics);

    loadDBList();

    const importInput = document.getElementById('import-input');
    document.getElementById('import-btn').addEventListener('click', function() {
        importInput.click(); // Simula clique no input de arquivo
    });

    document.getElementById('create-layer-btn').addEventListener('click', () => {
        const layerName = prompt('Digite o nome da nova camada:');
        if (layerName) {
            createLayer(layerName);
        }
    });

    importInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            importGeoJSON(file);
        }
    });

    document.getElementById('map-container').style.display = 'none';
};