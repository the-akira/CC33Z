const container = document.getElementById('container');
const grid = document.getElementById('grid');
const minimap = document.getElementById('minimap');
const minimapViewport = document.getElementById('minimapViewport');
const zoomIndicator = document.getElementById('zoomIndicator');

let scale = 1;
let isDragging = false;
let startX, startY, translateX = 0, translateY = 0;

// Navegação com Drag and Drop
container.addEventListener('mousedown', (e) => {
    const startScreen = document.getElementById('startScreen');
    const computedStyle = window.getComputedStyle(startScreen);

    if (computedStyle.display === 'block') {
        return;
    }
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    container.style.cursor = 'grabbing';
});

container.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        return;
    }
    if (drawingMode && !isDrawing && isDragging) {
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;

        // Limites do canvas de desenho (4000x4000)
        const maxTranslateX = Math.min(0, container.offsetWidth - 4000 * scale); // Canvas fixo 4000x4000
        const maxTranslateY = Math.min(0, container.offsetHeight - 4000 * scale);

        const minTranslateX = 0; // Não ultrapassa o lado esquerdo
        const minTranslateY = 0; // Não ultrapassa o topo

        translateX = Math.max(maxTranslateX, Math.min(minTranslateX, translateX));
        translateY = Math.max(maxTranslateY, Math.min(minTranslateY, translateY));

        grid.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;

        // Sincronizar o canvas
        syncCanvasPosition();

        // Atualizar a posição do mini-mapa
        updateMiniMap(drawingMode);
    }
    if (isDragging && !drawingMode) {
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;

        const maxTranslateX = Math.min(0, container.offsetWidth - grid.offsetWidth * scale);
        const maxTranslateY = Math.min(0, container.offsetHeight - grid.offsetHeight * scale);

        translateX = Math.max(maxTranslateX, Math.min(0, translateX));
        translateY = Math.max(maxTranslateY, Math.min(0, translateY));

        grid.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;

        // Atualizar a posição do mini-mapa
        updateMiniMap();
    }
    if (document.getElementById('startScreen').style.display === 'none' && document.getElementById('loadingScreen').style.display === 'none') {
        updateCoordinatesDisplay(e);
    }
});

container.addEventListener('mouseup', () => {
    isDragging = false;
    container.style.cursor = 'default';
});

container.addEventListener('mouseleave', () => {
    isDragging = false;
    container.style.cursor = 'default';
});

// Zoom in/out
container.addEventListener('wheel', (e) => {
    if (drawingMode) {
        return;
    }

    const startScreen = document.getElementById('startScreen');
    const computedStyle = window.getComputedStyle(startScreen);

    if (computedStyle.display === 'block') {
        return;
    }

    e.preventDefault();
    const zoomSpeed = 0.1;
    const prevScale = scale;

    scale += e.deltaY < 0 ? zoomSpeed : -zoomSpeed;
    scale = Math.min(2, Math.max(0.55, scale)); // Limitar o zoom entre 0.6x e 2x

    const maxTranslateX = Math.min(0, container.offsetWidth - grid.offsetWidth * scale);
    const maxTranslateY = Math.min(0, container.offsetHeight - grid.offsetHeight * scale);

    translateX = Math.max(maxTranslateX, Math.min(0, translateX * (scale / prevScale)));
    translateY = Math.max(maxTranslateY, Math.min(0, translateY * (scale / prevScale)));

    grid.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;

    // Atualizar a posição do mini-mapa
    updateMiniMap();
    updateZoomIndicator();
});

function updateZoomIndicator() {
    zoomIndicator.textContent = `Zoom: ${(scale * 100).toFixed(0)}%`;
}

function updateMiniMapElements() {
    // Limpa elementos antigos do mini-mapa
    const minimapElements = document.getElementById('minimapElements');
    minimapElements.innerHTML = ''; // Remove todos os elementos anteriores

    const BORDER_WIDTH = 2;

    const elements = grid.querySelectorAll('.note-block, .image-block, .audio-block, .pdf-block, .video-block, .table-block');

    elements.forEach((element) => {
        const gridRect = grid.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        // Dimensão e escala do grid
        const rect = { width: gridRect.width / scale, height: gridRect.height / scale };

        // Escala para o mini-mapa
        const scaleX = minimap.offsetWidth / rect.width;
        const scaleY = minimap.offsetHeight / rect.height;

        // Calcular posição relativa ao grid considerando o zoom e a câmera (translateX, translateY)
        const relativeLeft = ((elementRect.left - gridRect.left) / scale);
        const relativeTop = ((elementRect.top - gridRect.top) / scale);

        // Criação do retângulo no mini-mapa
        const minimapElement = document.createElement('div');
        minimapElement.className = 'minimap-element';
        minimapElement.style.position = 'absolute';
        minimapElement.style.backgroundColor = 'black';
        minimapElement.style.opacity = 0.7;

        // Define a posição e tamanho proporcionais ao mini-mapa
        minimapElement.style.width = `${(elementRect.width / scale) * scaleX}px`;
        minimapElement.style.height = `${(elementRect.height / scale) * scaleY}px`;
        minimapElement.style.left = `${(relativeLeft * scaleX) - BORDER_WIDTH}px`;
        minimapElement.style.top = `${(relativeTop * scaleY) - BORDER_WIDTH}px`;

        minimapElements.appendChild(minimapElement);
    });
}

// Atualiza o mini-mapa com base na visualização atual
function updateMiniMap(drawingMode) {
    if (drawingMode) {
        const canvasWidth = 4000; // Largura fixa do canvas
        const canvasHeight = 4000; // Altura fixa do canvas

        const containerRect = container.getBoundingClientRect();

        // Ajustar o minimapa para refletir apenas o canvas visível
        minimapViewport.style.width = `${(containerRect.width / (canvasWidth * scale)) * 100}%`;
        minimapViewport.style.height = `${(containerRect.height / (canvasHeight * scale)) * 100}%`;

        // Ajustar a posição do minimapa com base nos limites
        minimapViewport.style.left = `${(-translateX / (canvasWidth * scale)) * 100}%`;
        minimapViewport.style.top = `${(-translateY / (canvasHeight * scale)) * 100}%`;

        const minimapElements = document.getElementById('minimapElements');
        minimapElements.innerHTML = ''; // Remove os elementos anteriores
    } else {
        const gridRect = grid.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Ajustar o mini-mapa conforme o zoom
        minimapViewport.style.width = `${(containerRect.width / gridRect.width) * 100}%`;
        minimapViewport.style.height = `${(containerRect.height / gridRect.height) * 100}%`;

        // Ajustar a posição do mini-mapa
        minimapViewport.style.left = `${(-translateX / gridRect.width) * 100}%`;
        minimapViewport.style.top = `${(-translateY / gridRect.height) * 100}%`;         
        updateMiniMapElements();
    }
}

// Navegar clicando no mini-mapa
minimap.addEventListener('click', (e) => {
    const minimapRect = minimap.getBoundingClientRect();

    // Posição do clique no mini-mapa como proporção
    const scaleX = (e.clientX - minimapRect.left) / minimapRect.width;
    const scaleY = (e.clientY - minimapRect.top) / minimapRect.height;

    let targetX, targetY;

    if (drawingMode) {
        // Calcular a posição correspondente no canvas fixo (4000x4000)
        targetX = scaleX * 4000 * scale - container.offsetWidth / 2;
        targetY = scaleY * 4000 * scale - container.offsetHeight / 2;

        // Ajustar as translações considerando os limites do canvas
        const maxTranslateX = Math.min(0, container.offsetWidth - 4000 * scale);
        const maxTranslateY = Math.min(0, container.offsetHeight - 4000 * scale);

        translateX = Math.max(maxTranslateX, Math.min(0, -targetX));
        translateY = Math.max(maxTranslateY, Math.min(0, -targetY));
    } else {
        // Calcular a posição correspondente na grade principal considerando o zoom
        targetX = scaleX * grid.offsetWidth * scale - container.offsetWidth / 2;
        targetY = scaleY * grid.offsetHeight * scale - container.offsetHeight / 2;

        // Ajustar as translações considerando os limites da grade
        const maxTranslateX = Math.min(0, container.offsetWidth - grid.offsetWidth * scale);
        const maxTranslateY = Math.min(0, container.offsetHeight - grid.offsetHeight * scale);

        translateX = Math.max(maxTranslateX, Math.min(0, -targetX));
        translateY = Math.max(maxTranslateY, Math.min(0, -targetY));
    }

    // Aplicar a translação
    grid.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;

    if (drawingMode) {
        syncCanvasPosition(); // Sincronizar a posição do canvas no modo desenho
    }

    // Atualizar o mini-mapa
    updateMiniMap(drawingMode);
});

// Atualiza o mini-mapa inicialmente
updateMiniMap();

let blockCounter = 0;

// Botão para adicionar blocos
const addBlockButton = document.getElementById('addBlockButton');

addBlockButton.addEventListener('click', () => {
    // Criar o bloco no centro da área visível
    const x = (-translateX + container.offsetWidth / 2) / scale;
    const y = (-translateY + container.offsetHeight / 2) / scale;
    addNoteBlock(x, y);
});

// Adicionar um novo bloco de notas
function addNoteBlock(left, top, content = '', width = '200px', height = '100px') {
    blockCounter++;
    const block = document.createElement('div');
    block.className = 'note-block';
    block.style.left = `${left}px`;
    block.style.top = `${top}px`;
    block.style.width = width; // Restaurar largura
    block.style.height = height; // Restaurar altura

    const textarea = document.createElement('textarea');
    textarea.className = 'note-textarea';
    textarea.placeholder = 'Clique duas vezes para editar...';
    textarea.readOnly = true; // Inicia como apenas leitura
    textarea.value = content;
    block.appendChild(textarea);

    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    block.appendChild(resizeHandle);

    grid.appendChild(block);

    // Ativar comportamento de clique, duplo clique, movimento e redimensionamento
    enableBlockInteractions(block, textarea, resizeHandle);
    saveStateToLocalStorage();
}

// Comportamentos do bloco: clique, duplo clique, movimento e redimensionamento
let selectedBlock = null; // Referência ao bloco selecionado
let selectedImage = null;
let selectedVideo = null;
let selectedAudio = null;
let selectedTable = null;
let selectedPdf = null;

function enableBlockInteractions(block, textarea, resizeHandle) {
    let isDragging = false;
    let initialMouseX, initialMouseY, initialBlockX, initialBlockY;

    // Clique para selecionar o bloco
    block.addEventListener('mousedown', (e) => {
        if (e.target === resizeHandle) return; // Evitar conflito com redimensionamento

        e.stopPropagation(); // Impedir que o evento alcance a grid
        selectBlock(block); // Seleciona o bloco

        isDragging = true;
        populateSidebarFromLocalStorage(currentMapId);

        // Coordenadas iniciais do mouse e do bloco
        initialMouseX = e.clientX;
        initialMouseY = e.clientY;
        initialBlockX = parseFloat(block.style.left) || 0;
        initialBlockY = parseFloat(block.style.top) || 0;

        block.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            // Calcular o deslocamento considerando o zoom
            const deltaX = (e.clientX - initialMouseX) / scale;
            const deltaY = (e.clientY - initialMouseY) / scale;

            // Atualizar a posição do bloco
            const newLeft = initialBlockX + deltaX;
            const newTop = initialBlockY + deltaY;

            // Limitar os blocos dentro do grid
            block.style.left = `${Math.max(0, Math.min(grid.offsetWidth - block.offsetWidth, newLeft))}px`;
            block.style.top = `${Math.max(0, Math.min(grid.offsetHeight - block.offsetHeight, newTop))}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        block.style.cursor = 'grab';
    });

    block.addEventListener('click', () => {
        saveStateToLocalStorage();                
        populateSidebar(currentMapId);
    });

    // Duplo clique para editar
    block.addEventListener('dblclick', (e) => {
        e.stopPropagation(); // Impedir que o evento alcance a grid
        textarea.readOnly = false;
        textarea.focus();
    });

    textarea.addEventListener('wheel', (e) => {
        e.stopPropagation(); // Impede que o evento continue
    });

    // Sair da edição ao perder o foco
    textarea.addEventListener('blur', () => {
        textarea.readOnly = true;
        saveStateToLocalStorage();
    });

    // Redimensionamento
    let isResizing = false;
    let startWidth, startHeight, startMouseX, startMouseY;

    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startWidth = block.offsetWidth;
        startHeight = block.offsetHeight;
        startMouseX = e.clientX;
        startMouseY = e.clientY;
        e.stopPropagation();
    });

    document.addEventListener('mousemove', (e) => {
        if (isResizing) {
            const width = Math.max(100, startWidth + (e.clientX - startMouseX) / scale);
            const height = Math.max(50, startHeight + (e.clientY - startMouseY) / scale);

            block.style.width = `${width}px`;
            block.style.height = `${height}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isResizing = false;
    });
}

// Selecionar um bloco
function selectBlock(block) {
    clearSelections(); // Limpa seleções anteriores
    selectedBlock = block;
    highlightBlock(selectedBlock); // Destaca o bloco
}

// Remover o destaque de um bloco
function removeHighlight(block) {
    block.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.1)';
}

// Destacar o bloco selecionado
function highlightBlock(block) {
    block.style.boxShadow = '0 0 10px rgba(0, 0, 255, 0.5)';
}

// Evento global para deletar o bloco selecionado
document.addEventListener('keydown', (e) => {
    if (e.key === 'Delete' && selectedBlock) {
        selectedBlock.remove(); // Remove o bloco selecionado do DOM
        selectedBlock = null; // Limpa a referência
    }
    if (e.key === 'Delete' && selectedTable) {
        selectedTable.remove();
    }
    if (e.key === 'Delete' && selectedImage) {
        const imageId = selectedImage.dataset.id; // Obtém o ID do PDF
        deleteImageFromIndexedDB(imageId); // Remove do IndexedDB
        selectedImage.remove();
        removeImageOrVideo(selectedImage);
        selectedImage = null;
    }
    if (e.key === 'Delete' && selectedVideo) {
        selectedVideo.remove();
        const videoId = selectedVideo.querySelector('video').dataset.id;
        deleteVideoFromIndexedDB(videoId); // Remover do IndexedDB
        removeImageOrVideo(selectedVideo);
        selectedVideo = null;
    }
    if (e.key === 'Delete' && selectedPdf) {
        const pdfId = selectedPdf.dataset.id; // Obtém o ID do PDF
        deletePdfFromIndexedDB(pdfId); // Remove do IndexedDB
        selectedPdf.remove();
        selectedPdf = null;
    }
    if (e.key === 'Delete' && selectedAudio) {
        const audioId = selectedAudio.dataset.id;
        deleteAudioFromIndexedDB(audioId);
        selectedAudio.remove();
        removeImageOrVideo(selectedAudio);
        selectedAudio = null;
    }
});

// Remover a seleção ao clicar na grid
grid.addEventListener('mousedown', (e) => {
    if (!e.target.closest('.note-block') && !e.target.closest('.image-block')) {
        clearSelections();
    }
});

// Adicionar a funcionalidade de carregar e manipular imagens
const imageInput = document.getElementById('imageInput');
const addImageButton = document.getElementById('addImageButton');

// Adicionar evento ao botão para abrir o seletor de arquivos
addImageButton.addEventListener('click', () => {
    imageInput.click(); // Simula um clique no input de arquivo
});

const MAX_IMAGE_SIZE = 1 * 1024 * 1024;

// Adicionar evento ao input para carregar a imagem
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Verificar tamanho da imagem
    if (file.size > MAX_IMAGE_SIZE) {
        alert(`O tamanho da imagem não pode exceder ${MAX_IMAGE_SIZE / (1024 * 1024)} MB.`);
        e.target.value = ''; // Reseta o input
        return;
    }

    const id = `image-${Date.now()}`;
    const reader = new FileReader();

    reader.onload = (event) => {
        const imageUrl = event.target.result;
        saveImageToIndexedDB(currentMapId, id, file);
        addImageToGrid(id, imageUrl);
    };

    reader.readAsDataURL(file);
    e.target.value = '';
});

// Função para adicionar a imagem na grid
function addImageToGrid(id, imageUrl, left = '100px', top = '100px', width = '150px', height = '150px') {
    const imageBlock = document.createElement('div');
    imageBlock.className = 'image-block';
    imageBlock.style.left = `${left}`;
    imageBlock.style.top = `${top}`;
    imageBlock.style.width = width;
    imageBlock.style.height = height;
    imageBlock.dataset.id = id;

    const img = document.createElement('img');
    img.src = imageUrl;
    img.preload = 'none';
    img.setAttribute('loading', 'lazy');
    imageBlock.appendChild(img);

    grid.appendChild(imageBlock);

    enableImageInteractions(imageBlock); // Ativar interações para a imagem
}

// Função para ativar interações na imagem
function enableImageInteractions(imageBlock) {
    let isDragging = false;
    let isResizing = false;
    let initialMouseX, initialMouseY, initialBlockX, initialBlockY;
    let startWidth, startHeight, resizeDirection;

    // Criar handles para redimensionamento
    const handles = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    handles.forEach(direction => {
        const handle = document.createElement('div');
        handle.className = `resize-handle ${direction}`;
        imageBlock.appendChild(handle);

        handle.addEventListener('mousedown', (e) => {
            isResizing = true;
            resizeDirection = direction;
            startWidth = imageBlock.offsetWidth;
            startHeight = imageBlock.offsetHeight;
            initialMouseX = e.clientX;
            initialMouseY = e.clientY;
            e.stopPropagation(); // Previne propagação
        });
    });

    // Clique para mover
    imageBlock.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('resize-handle')) return; // Ignorar handles

        e.stopPropagation(); // Previne propagação para a grid
        isDragging = true;
        selectImage(imageBlock); // Selecionar imagem

        initialMouseX = e.clientX;
        initialMouseY = e.clientY;
        initialBlockX = parseFloat(imageBlock.style.left) || 0;
        initialBlockY = parseFloat(imageBlock.style.top) || 0;

        imageBlock.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = (e.clientX - initialMouseX) / scale;
            const deltaY = (e.clientY - initialMouseY) / scale;

            const newLeft = initialBlockX + deltaX;
            const newTop = initialBlockY + deltaY;

            imageBlock.style.left = `${Math.max(0, Math.min(grid.offsetWidth - imageBlock.offsetWidth, newLeft))}px`;
            imageBlock.style.top = `${Math.max(0, Math.min(grid.offsetHeight - imageBlock.offsetHeight, newTop))}px`;
        }

        if (isResizing) {
            const deltaX = (e.clientX - initialMouseX) / scale;
            const deltaY = (e.clientY - initialMouseY) / scale;

            let newWidth = startWidth;
            let newHeight = startHeight;

            if (resizeDirection.includes('right')) newWidth += deltaX;
            if (resizeDirection.includes('left')) newWidth -= deltaX;
            if (resizeDirection.includes('bottom')) newHeight += deltaY;
            if (resizeDirection.includes('top')) newHeight -= deltaY;

            newWidth = Math.max(50, newWidth);
            newHeight = Math.max(50, newHeight);

            imageBlock.style.width = `${newWidth}px`;
            imageBlock.style.height = `${newHeight}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        isResizing = false;
        imageBlock.style.cursor = 'grab';
    });

    imageBlock.addEventListener('click', () => {
        updateImageMetadataInIndexedDB(
            imageBlock.dataset.id,
            imageBlock.style.left,
            imageBlock.style.top,
            imageBlock.style.width,
            imageBlock.style.height
        );
        populateSidebar(currentMapId);
    });

    // Clique fora da grid remove a seleção
    grid.addEventListener('mousedown', (e) => {
        imageBlock.classList.remove('selected');
    });
}

// Selecionar uma imagem
function selectImage(image) {
    clearSelections(); // Limpa seleções anteriores
    selectedImage = image;
    image.classList.add('selected'); // Adiciona a borda azul
}

// Evento para carregar o vídeo
const videoInput = document.getElementById('videoInput');
const addVideoButton = document.getElementById('addVideoButton');

// Adicionar evento ao botão para abrir o seletor de arquivos
addVideoButton.addEventListener('click', () => {
    videoInput.click(); // Simula um clique no input de arquivo
});

const MAX_VIDEO_SIZE = 10 * 1024 * 1024;

// Adicionar evento ao input para carregar o vídeo
videoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Verificar tamanho do vídeo
    if (file.size > MAX_VIDEO_SIZE) {
        alert(`O tamanho do vídeo não pode exceder ${MAX_VIDEO_SIZE / (1024 * 1024)} MB.`);
        e.target.value = ''; // Reseta o input
        return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
        const videoUrl = event.target.result;
        addVideoToGrid(videoUrl);
    };

    reader.readAsDataURL(file);
    e.target.value = '';
});

const MAX_VIDEOS = 3;

// Função para adicionar o vídeo na grid
function addVideoToGrid(videoUrl, left = '500px', top = '300px', width = '200px', height = '150px', saveToDb = true, id = null) {
    const currentVideos = document.querySelectorAll('.video-block').length;

    if (currentVideos >= MAX_VIDEOS) {
        alert(`Você atingiu o limite máximo de ${MAX_VIDEOS} vídeos.`);
        return; // Não adiciona o vídeo
    }
    const videoBlock = document.createElement('div');
    videoBlock.className = 'video-block';

    // Aplicar posição e dimensões restauradas ou padrões
    videoBlock.style.left = left; 
    videoBlock.style.top = top; 
    videoBlock.style.width = width; 
    videoBlock.style.height = height; 

    const video = document.createElement('video');
    video.src = videoUrl;
    video.controls = true; // Ativa controles do vídeo (play, pause, volume)
    video.preload = 'none'; // Configura o preload para carregar apenas metadados
    video.style.pointerEvents = 'auto'; // Permite interagir com os controles do vídeo
    videoBlock.appendChild(video);
    const videoId = `video-${Date.now()}`;

    if (!id) {
        video.dataset.id = videoId;           
    } else {
        video.dataset.id = id;
    }

    if (saveToDb) {
        saveVideoToIndexedDB(currentMapId, videoId, video.src)
    }

    grid.appendChild(videoBlock);

    enableVideoInteractions(videoBlock); // Ativa interações para o vídeo
}

// Função para ativar interações no vídeo
function enableVideoInteractions(videoBlock) {
    let isDragging = false;
    let isResizing = false;
    let initialMouseX, initialMouseY, initialBlockX, initialBlockY;
    let startWidth, startHeight, resizeDirection;

    const video = videoBlock.querySelector('video');
    const id = video.dataset.id;

    // Criar handles para redimensionamento
    const handles = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    handles.forEach(direction => {
        const handle = document.createElement('div');
        handle.className = `resize-handle ${direction}`;
        videoBlock.appendChild(handle);

        handle.addEventListener('mousedown', (e) => {
            isResizing = true;
            resizeDirection = direction;
            startWidth = videoBlock.offsetWidth;
            startHeight = videoBlock.offsetHeight;
            initialMouseX = e.clientX;
            initialMouseY = e.clientY;
            e.stopPropagation(); // Previne propagação
        });
    });

    // Clique para selecionar o vídeo
    videoBlock.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('resize-handle')) return; // Ignorar handles

        e.stopPropagation(); // Previne propagação para a grid
        selectVideo(videoBlock); // Seleciona o vídeo

        isDragging = true;
        initialMouseX = e.clientX;
        initialMouseY = e.clientY;
        initialBlockX = parseFloat(videoBlock.style.left) || 0;
        initialBlockY = parseFloat(videoBlock.style.top) || 0;

        videoBlock.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = (e.clientX - initialMouseX) / scale;
            const deltaY = (e.clientY - initialMouseY) / scale;

            const newLeft = initialBlockX + deltaX;
            const newTop = initialBlockY + deltaY;

            videoBlock.style.left = `${Math.max(0, Math.min(grid.offsetWidth - videoBlock.offsetWidth, newLeft))}px`;
            videoBlock.style.top = `${Math.max(0, Math.min(grid.offsetHeight - videoBlock.offsetHeight, newTop))}px`;
        }

        if (isResizing) {
            const deltaX = (e.clientX - initialMouseX) / scale;
            const deltaY = (e.clientY - initialMouseY) / scale;

            let newWidth = startWidth;
            let newHeight = startHeight;

            if (resizeDirection.includes('right')) newWidth += deltaX;
            if (resizeDirection.includes('left')) newWidth -= deltaX;
            if (resizeDirection.includes('bottom')) newHeight += deltaY;
            if (resizeDirection.includes('top')) newHeight -= deltaY;

            newWidth = Math.max(50, newWidth);
            newHeight = Math.max(50, newHeight);

            videoBlock.style.width = `${newWidth}px`;
            videoBlock.style.height = `${newHeight}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        isResizing = false;
        videoBlock.style.cursor = 'grab';
    });

    videoBlock.addEventListener('click', () => {
        updateVideoMetadataInIndexedDB(
            id,
            videoBlock.style.left,
            videoBlock.style.top,
            videoBlock.style.width,
            videoBlock.style.height
        );
        populateSidebar(currentMapId);
        isResizing = false;
    });
}

// Selecionar vídeo
function selectVideo(video) {
    clearSelections(); // Limpa seleções anteriores
    selectedVideo = video;
    video.classList.add('selected'); // Adiciona a borda azul
}

// Função para remover o destaque de um bloco
function removeHighlight(block) {
    block.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.1)';
}

function removeImageOrVideo(element) {
    // Remover a imagem ou vídeo da grid
    element.remove();

    // Resetar o campo de input para permitir o carregamento de novo arquivo
    document.getElementById('imageInput').value = ''; // Para imagens
    document.getElementById('videoInput').value = ''; // Para vídeos, caso tenha esse campo
    document.getElementById('audioInput').value = '';
}

// Selecionar os elementos de botão e input
const audioInput = document.getElementById('audioInput');
const addAudioButton = document.getElementById('addAudioButton');

// Abrir o seletor de arquivos ao clicar no botão
addAudioButton.addEventListener('click', () => {
    audioInput.click();
});

const MAX_AUDIO_SIZE = 5 * 1024 * 1024;

// Adicionar evento para carregar o áudio
audioInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Verificar tamanho do áudio
    if (file.size > MAX_AUDIO_SIZE) {
        alert(`O tamanho do áudio não pode exceder ${MAX_AUDIO_SIZE / (1024 * 1024)} MB.`);
        e.target.value = ''; // Reseta o input
        return;
    }

    const id = `audio-${Date.now()}`;
    const reader = new FileReader();

    reader.onload = (event) => {
        const audioUrl = event.target.result;
        saveAudioToIndexedDB(currentMapId, id, file);
        addAudioToGrid(id, audioUrl);
    };

    reader.readAsDataURL(file);
    e.target.value = '';
});

// Função para adicionar o áudio na grid
function addAudioToGrid(id, audioUrl, left = '200px', top = '200px') {
    const audioBlock = document.createElement('div');
    audioBlock.className = 'audio-block';
    audioBlock.style.left = `${left}`;
    audioBlock.style.top = `${top}`;
    audioBlock.dataset.id = id;

    const audio = document.createElement('audio');
    audio.src = audioUrl;
    audio.controls = true; // Controles para play/pause/volume
    audio.preload = 'none';
    audioBlock.appendChild(audio);

    grid.appendChild(audioBlock);

    enableAudioInteractions(audioBlock); // Ativar interações no bloco de áudio
}

// Função para ativar interações no bloco de áudio
function enableAudioInteractions(audioBlock) {
    let isDragging = false;
    let initialMouseX, initialMouseY, initialBlockX, initialBlockY;

    // Clique para mover o bloco
    audioBlock.addEventListener('mousedown', (e) => {
        // Ignorar cliques no player de áudio
        if (e.target.tagName === 'AUDIO') return;

        e.stopPropagation(); // Previne propagação para a grid
        isDragging = true;
        selectAudio(audioBlock); // Selecionar o bloco de áudio

        initialMouseX = e.clientX;
        initialMouseY = e.clientY;
        initialBlockX = parseFloat(audioBlock.style.left) || 0;
        initialBlockY = parseFloat(audioBlock.style.top) || 0;

        audioBlock.style.cursor = 'grabbing';
    });

    // Mover o bloco
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = (e.clientX - initialMouseX) / scale;
            const deltaY = (e.clientY - initialMouseY) / scale;

            const newLeft = initialBlockX + deltaX;
            const newTop = initialBlockY + deltaY;

            audioBlock.style.left = `${Math.max(0, Math.min(grid.offsetWidth - audioBlock.offsetWidth, newLeft))}px`;
            audioBlock.style.top = `${Math.max(0, Math.min(grid.offsetHeight - audioBlock.offsetHeight, newTop))}px`;
        }
    });

    // Soltar o bloco
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            audioBlock.style.cursor = 'grab';
        }
    });

    // Clique fora da grid remove a seleção
    grid.addEventListener('mousedown', (e) => {
        if (!e.target.closest('.audio-block') && selectedAudio) {
            clearSelections();
        }
    });

    audioBlock.addEventListener('click', () => {
        updateAudioMetadataInIndexedDB(
            audioBlock.dataset.id,
            audioBlock.style.left,
            audioBlock.style.top,
            audioBlock.style.width,
            audioBlock.style.height
        );
        populateSidebar(currentMapId);
    });
}

// Função para selecionar o áudio
function selectAudio(audioBlock) {
    clearSelections(); // Limpa seleções anteriores
    selectedAudio = audioBlock;
    audioBlock.classList.add('selected'); // Adiciona a borda azul
}

// Selecionar os elementos de botão e input
const pdfInput = document.getElementById('pdfInput');
const addPdfButton = document.getElementById('addPdfButton');

// Abrir o seletor de arquivos ao clicar no botão
addPdfButton.addEventListener('click', () => {
    pdfInput.click();
});

const MAX_PDF_SIZE = 5 * 1024 * 1024; 

// Adicionar evento para carregar o PDF
pdfInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Verificar tamanho do PDF
    if (file.size > MAX_PDF_SIZE) {
        alert(`O tamanho do PDF não pode exceder ${MAX_PDF_SIZE / (1024 * 1024)} MB.`);
        e.target.value = ''; // Reseta o input
        return;
    }

    const id = `pdf-${Date.now()}`;
    const pdfUrl = URL.createObjectURL(file);
    savePdfToIndexedDB(currentMapId, id, file);
    addPdfToGrid(pdfUrl, id, '100px', '100px');

    e.target.value = ''; // Reseta o input após adicionar
});

// Função para adicionar o PDF na grid
function addPdfToGrid(pdfUrl, id, left = '100px', top = '100px') {
    const pdfBlock = document.createElement('div');
    pdfBlock.className = 'pdf-block';
    pdfBlock.style.left = left;
    pdfBlock.style.top = top;
    pdfBlock.dataset.id = id;
    pdfBlock.dataset.mapId = currentMapId;

    const pdfIcon = document.createElement('div');
    pdfIcon.className = 'pdf-icon';
    pdfIcon.textContent = '📄'; // Representação visual do PDF
    pdfBlock.appendChild(pdfIcon);

    // Duplo clique para abrir o PDF
    pdfBlock.addEventListener('dblclick', () => {
        window.open(pdfUrl, '_blank'); // Abre o PDF em uma nova aba
    });

    grid.appendChild(pdfBlock);

    enablePdfInteractions(pdfBlock); // Ativar interações no bloco de PDF
}

function enablePdfInteractions(pdfBlock) {
    let isDragging = false;
    let initialMouseX, initialMouseY, initialBlockX, initialBlockY;

    // Selecione o PDF ao clicar uma vez
    pdfBlock.addEventListener('click', (e) => {
        selectPdf(pdfBlock); // Seleciona o PDF
        updatePdfMetadataInIndexedDB(
            pdfBlock.dataset.id,
            pdfBlock.style.left,
            pdfBlock.style.top
        );
        populateSidebar(currentMapId);
    });

    // Mover o bloco com o mouse
    pdfBlock.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        isDragging = true;
        selectPdf(pdfBlock);

        initialMouseX = e.clientX;
        initialMouseY = e.clientY;
        initialBlockX = parseFloat(pdfBlock.style.left) || 0;
        initialBlockY = parseFloat(pdfBlock.style.top) || 0;

        pdfBlock.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - initialMouseX;
            const deltaY = e.clientY - initialMouseY;

            pdfBlock.style.left = `${initialBlockX + deltaX}px`;
            pdfBlock.style.top = `${initialBlockY + deltaY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            pdfBlock.style.cursor = 'grab';
        }
    });

    grid.addEventListener('mousedown', (e) => {
        if (!e.target.closest('.pdf-block') && selectedPdf) {
            clearSelections();
        }
    });
}

function selectPdf(pdfBlock) {
    clearSelections(); // Limpa seleções anteriores
    selectedPdf = pdfBlock;
    pdfBlock.classList.add('selected'); // Adiciona borda azul
}

// Função para limpar seleções de todos os elementos
function clearSelections() {
    if (selectedBlock) {
        removeHighlight(selectedBlock);
        selectedBlock = null;
    }
    if (selectedImage) {
        selectedImage.classList.remove('selected');
        selectedImage = null;
    }
    if (selectedAudio) {
        selectedAudio.classList.remove('selected');
        selectedAudio = null;
    }
    if (selectedTable) {
        selectedTable.classList.remove('selected');
        selectedTable = null;
    }
    if (selectedPdf) {
        selectedPdf.classList.remove('selected');
        selectedPdf = null;
    }
    if (selectedVideo) {
        selectedVideo.classList.remove('selected');
        selectedVideo = null;
    }
}

// Função para selecionar uma tabela
function selectTable(tableBlock) {
    clearSelections(); // Limpa seleções anteriores
    selectedTable = tableBlock;
    tableBlock.classList.add('selected'); // Adiciona borda azul ou destaque
}

const addTableButton = document.getElementById('addTableButton');
const tableModal = document.getElementById('tableModal');
const createTableButton = document.getElementById('createTable');
const closeModal = document.querySelector('.modal .close');
const modalContent = document.querySelector('.modal-content');
let isModalOpen = false;

tableModal.addEventListener('mousedown', (e) => e.stopPropagation());
tableModal.addEventListener('mousemove', (e) => e.stopPropagation());
tableModal.addEventListener('mouseup', (e) => e.stopPropagation());

// Abrir modal
addTableButton.addEventListener('click', () => {
    tableModal.style.display = 'flex';
    isModalOpen = true;
});

// Fechar modal
closeModal.addEventListener('click', () => {
    tableModal.style.display = 'none';
});

tableModal.addEventListener('click', (e) => {
    if (!modalContent.contains(e.target)) {
        closeModalFunction();
    }
});

// Função para fechar o modal
function closeModalFunction() {
    tableModal.style.display = 'none';
    isModalOpen = false; // Modal inativo
}

// Criar tabela
createTableButton.addEventListener('click', () => {
    const rows = parseInt(document.getElementById('rows').value);
    const columns = parseInt(document.getElementById('columns').value);

    if (rows > 0 && columns > 0) {
        createTableBlock(rows, columns);
        tableModal.style.display = 'none';
    }
});

// Criar tabela na grid
function createTableBlock(rows, columns) {
    const tableBlock = document.createElement('div');
    tableBlock.className = 'table-block';
    // Calcular tamanho com base nas dimensões
    const cellWidth = 100; // Largura de cada célula (em pixels)
    const cellHeight = 50; // Altura de cada célula (em pixels)

    tableBlock.style.width = `${columns * cellWidth}px`;
    tableBlock.style.height = `${rows * cellHeight}px`;
    tableBlock.style.left = '100px';
    tableBlock.style.top = '100px';

    const table = document.createElement('table');
    for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < columns; j++) {
            const td = document.createElement('td');
            td.contentEditable = true; // Permitir edição das células
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    tableBlock.appendChild(table);

    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    resizeHandle.style.bottom = '0';
    resizeHandle.style.right = '0';
    tableBlock.appendChild(resizeHandle);

    grid.appendChild(tableBlock);

    enableTableInteractions(tableBlock, resizeHandle);
    saveStateToLocalStorage();
}

// Interações com a tabela
function enableTableInteractions(tableBlock, resizeHandle) {
    let isDragging = false;
    let isResizing = false;
    let initialMouseX, initialMouseY, initialBlockX, initialBlockY, startWidth, startHeight;

    // Movimento
    tableBlock.addEventListener('mousedown', (e) => {
        if (e.target === resizeHandle) return;

        e.stopPropagation();
        isDragging = true;

        initialMouseX = e.clientX;
        initialMouseY = e.clientY;
        initialBlockX = parseFloat(tableBlock.style.left) || 0;
        initialBlockY = parseFloat(tableBlock.style.top) || 0;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = (e.clientX - initialMouseX) / scale;
            const deltaY = (e.clientY - initialMouseY) / scale;

            const newLeft = initialBlockX + deltaX;
            const newTop = initialBlockY + deltaY;

            tableBlock.style.left = `${Math.max(0, Math.min(grid.offsetWidth - tableBlock.offsetWidth, newLeft))}px`;
            tableBlock.style.top = `${Math.max(0, Math.min(grid.offsetHeight - tableBlock.offsetHeight, newTop))}px`;
        }

        if (isResizing) {
            const deltaX = (e.clientX - initialMouseX) / scale;
            const deltaY = (e.clientY - initialMouseY) / scale;

            const newWidth = Math.max(100, startWidth + deltaX);
            const newHeight = Math.max(50, startHeight + deltaY);

            tableBlock.style.width = `${newWidth}px`;
            tableBlock.style.height = `${newHeight}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        isResizing = false;
    });

    // Redimensionamento
    resizeHandle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        isResizing = true;

        startWidth = tableBlock.offsetWidth;
        startHeight = tableBlock.offsetHeight;
        initialMouseX = e.clientX;
        initialMouseY = e.clientY;
    });

    tableBlock.addEventListener('click', () => {
        saveStateToLocalStorage();                
        populateSidebar(currentMapId);
    });

    tableBlock.addEventListener('keyup', () => {
        saveStateToLocalStorage();
    });

    grid.addEventListener('mousedown', (e) => {
        if (!e.target.closest('.table-block')) {
            tableBlock.classList.remove('selected');
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target.closest('.table-block')) {
            selectTable(e.target.closest('.table-block')); // Seleciona a tabela clicada
        }
    });
}

function createTableFromState(left, top, width, height, rows, columns, tableData) {
    const tableBlock = document.createElement('div');
    tableBlock.className = 'table-block';
    tableBlock.style.left = `${left}px`;
    tableBlock.style.top = `${top}px`;
    tableBlock.style.width = `${width}px`;
    tableBlock.style.height = `${height}px`;

    const table = document.createElement('table');
    let dataIndex = 0;
    for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < columns; j++) {
            const td = document.createElement('td');
            td.contentEditable = true; // Permitir edição das células
            td.innerHTML = tableData[dataIndex++] || '';
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    tableBlock.appendChild(table);

    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    resizeHandle.style.bottom = '0';
    resizeHandle.style.right = '0';
    tableBlock.appendChild(resizeHandle);

    grid.appendChild(tableBlock);

    enableTableInteractions(tableBlock, resizeHandle);
}

let currentMapId = null;

function getMapNameById(mapId) {
    const maps = JSON.parse(localStorage.getItem('maps')) || [];
    const map = maps.find((m) => m.id === mapId);
    return map ? map.name : 'Mapa não encontrado';
}

function updateCurrentMap() {
    const mapName = getMapNameById(currentMapId);
    document.getElementById('currentMapIndicator').textContent = `${mapName}`;
}

function saveStateToLocalStorage() {
    const elements = [];

    document.querySelectorAll('.note-block, .table-block').forEach((element) => {
        const type = element.className.split(' ')[0];
        const data = {
            type,
            left: element.style.left,
            top: element.style.top,
            width: element.style.width || null,
            height: element.style.height || null,
            content: type === 'note-block' ? element.querySelector('textarea').value : null,
            rows: type === 'table-block' ? element.querySelectorAll('tr').length : null,
            columns: type === 'table-block' ? element.querySelector('tr').children.length : null,
            tableData: type === 'table-block' ? [...element.querySelectorAll('td')].map(td => td.innerHTML) : null,
        };
        elements.push(data);
    });

    const transaction = db.transaction(['elements'], 'readwrite');
    const store = transaction.objectStore('elements');

    // Certifique-se de que o objeto `map` contém um campo `id` válido
    const map = { id: currentMapId, data: elements };

    const request = store.put(map); // Salvar no IndexedDB

    request.onsuccess = () => {
        console.log('Estado salvo no IndexedDB com sucesso!');
    };

    request.onerror = (e) => {
        console.error('Erro ao salvar estado no IndexedDB:', e.target.error);
    };
}

function loadStateFromLocalStorage() {
    const transaction = db.transaction(['elements'], 'readonly');
    const store = transaction.objectStore('elements');
    const request = store.get(currentMapId);

    request.onsuccess = (event) => {
        const map = event.target.result;

        if (!map || !map.data) {
            console.log('Nenhum estado encontrado para o mapa atual no IndexedDB.');
            return;
        }

        map.data.forEach((element) => {
            switch (element.type) {
                case 'note-block':
                    addNoteBlock(
                        parseFloat(element.left),
                        parseFloat(element.top),
                        element.content,
                        element.width,
                        element.height
                    );
                    break;
                case 'table-block':
                    createTableFromState(
                        parseFloat(element.left),
                        parseFloat(element.top),
                        parseFloat(element.width),
                        parseFloat(element.height),
                        element.rows,
                        element.columns,
                        element.tableData
                    );
                    break;
            }
        });

        console.log('Estado carregado do IndexedDB com sucesso!');
    };

    request.onerror = (e) => {
        console.error('Erro ao carregar estado do IndexedDB:', e.target.error);
    };
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Delete') {
        saveStateToLocalStorage(); // Atualizar estado após deleção
        populateSidebar(currentMapId);
        populateSidebarFromLocalStorage(currentMapId);
    }
});

let db;

// Abrir ou criar o banco de dados
function initDatabase(callback) {
    const request = indexedDB.open('MindMapDB', 1);

    request.onupgradeneeded = (e) => {
        db = e.target.result;
        if (!db.objectStoreNames.contains('videos')) {
            db.createObjectStore('videos', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('pdfs')) {
            db.createObjectStore('pdfs', { keyPath: 'id' }); // Adicionar suporte a PDFs
        }
        if (!db.objectStoreNames.contains('images')) {
            db.createObjectStore('images', { keyPath: 'id' }); // Adicionar suporte a imagens
        }
        if (!db.objectStoreNames.contains('audios')) {
            db.createObjectStore('audios', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('maps')) {
            db.createObjectStore('maps', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('elements')) {
            db.createObjectStore('elements', { keyPath: 'id' });
        }
    };

    request.onsuccess = (e) => {
        db = e.target.result;
        if (callback) callback(); // Chama o callback após o sucesso
    };

    request.onerror = (e) => {
        console.error('Erro ao abrir o IndexedDB:', e.target.error);
    };
}

function deleteAudioFromIndexedDB(id) {
    const transaction = db.transaction(['audios'], 'readwrite');
    const store = transaction.objectStore('audios');

    const request = store.delete(id);

    request.onsuccess = () => {
        console.log(`Áudio com ID ${id} removido do IndexedDB.`);
    };

    request.onerror = (e) => {
        console.error('Erro ao remover áudio do IndexedDB:', e.target.error);
    };
}

function loadAudiosFromIndexedDB(mapId) {
    const transaction = db.transaction(['audios'], 'readonly');
    const store = transaction.objectStore('audios');
    const request = store.getAll();

    request.onsuccess = (e) => {
        const audios = e.target.result.filter((audio) => audio.mapId === mapId);

        audios.forEach((audioData) => {
            let audioUrl;

            if (typeof audioData.file === 'string' && audioData.file.startsWith('data:audio')) {
                try {
                    const audioBlob = base64ToBlob(audioData.file, 'audio/mp3'); // Ajuste o MIME type conforme necessário
                    audioUrl = URL.createObjectURL(audioBlob);
                } catch (error) {
                    console.error('Erro ao converter Base64 para Blob:', error);
                    return;
                }
            } else if (audioData.file instanceof Blob) {
                audioUrl = URL.createObjectURL(audioData.file);
            }

            addAudioToGrid(
                audioData.id,
                audioUrl,
                audioData.left,
                audioData.top,
            );
        });
    };

    request.onerror = (e) => {
        console.error('Erro ao carregar áudios do IndexedDB:', e.target.error);
    };
}

function updateAudioMetadataInIndexedDB(id, left, top, width, height) {
    const transaction = db.transaction(['audios'], 'readwrite');
    const store = transaction.objectStore('audios');

    const request = store.get(id);

    request.onsuccess = (e) => {
        const audioData = e.target.result;

        if (audioData) {
            audioData.left = left;
            audioData.top = top;
            audioData.width = width;
            audioData.height = height;

            store.put(audioData);

            transaction.oncomplete = () => {
                console.log(`Metadados do áudio (${id}) atualizados com sucesso!`);
            };
        }
    };

    request.onerror = (e) => {
        console.error('Erro ao atualizar metadados do áudio:', e.target.error);
    };
}

function saveAudioToIndexedDB(mapId, id, file, left = '200px', top = '200px', width = '320px', height = '80px') {
    if (file instanceof Blob) {
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64File = reader.result;

            const transaction = db.transaction(['audios'], 'readwrite');
            const store = transaction.objectStore('audios');

            const audioData = {
                mapId,
                id,
                file: base64File,
                left,
                top,
                width,
                height,
            };

            store.put(audioData);

            transaction.oncomplete = () => {
                console.log('Áudio salvo no IndexedDB com sucesso!');
            };

            transaction.onerror = (e) => {
                console.error('Erro ao salvar áudio:', e.target.error);
            };
        };

        reader.readAsDataURL(file);
    }
}

function loadImagesFromIndexedDB(mapId) {
    const transaction = db.transaction(['images'], 'readonly');
    const store = transaction.objectStore('images');
    const request = store.getAll();

    request.onsuccess = (e) => {
        const images = e.target.result.filter((image) => image.mapId === mapId);

        images.forEach((imageData) => {
            let imageUrl;

            // Verifica se o arquivo está em Base64 e converte para Blob
            if (typeof imageData.file === 'string' && imageData.file.startsWith('data:image')) {
                try {
                    const mimeType = detectMimeType(imageData.file); // Detectar o tipo MIME da imagem
                    const imageBlob = base64ToBlob(imageData.file, mimeType); // Converter Base64 para Blob
                    imageUrl = URL.createObjectURL(imageBlob); // Gera URL para o Blob
                } catch (error) {
                    console.error('Erro ao converter Base64 para Blob:', error);
                    return;
                }
            } else if (imageData.file instanceof Blob) {
                // Se já for um Blob, cria a URL diretamente
                imageUrl = URL.createObjectURL(imageData.file);
            } else {
                console.error('Formato de arquivo inválido:', imageData.file);
                return;
            }

            // Adiciona a imagem à grid
            addImageToGrid(
                imageData.id,
                imageUrl,
                imageData.left,
                imageData.top,
                imageData.width,
                imageData.height
            );
        });
    };

    request.onerror = (e) => {
        console.error('Erro ao carregar imagens do IndexedDB:', e.target.error);
    };
}

function detectMimeType(base64String) {
    const mimeTypePattern = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-+.]+);base64,/;
    const matches = base64String.match(mimeTypePattern);
    return matches && matches[1] ? matches[1] : 'image/jpeg'; // Retorna tipo 'image/jpeg' como fallback
}

function deleteImageFromIndexedDB(id) {
    const transaction = db.transaction(['images'], 'readwrite');
    const store = transaction.objectStore('images');

    const request = store.delete(id);

    request.onsuccess = () => {
        console.log(`Imagem com ID ${id} removida do IndexedDB.`);
    };

    request.onerror = (e) => {
        console.error('Erro ao remover imagem do IndexedDB:', e.target.error);
    };
}

function updateImageMetadataInIndexedDB(id, left, top, width, height) {
    const transaction = db.transaction(['images'], 'readwrite');
    const store = transaction.objectStore('images');

    const request = store.get(id);

    request.onsuccess = (e) => {
        const imageData = e.target.result;

        if (imageData) {
            imageData.left = left;
            imageData.top = top;
            imageData.width = width;
            imageData.height = height;

            store.put(imageData);

            transaction.oncomplete = () => {
                console.log(`Metadados da imagem (${id}) atualizados com sucesso!`);
            };
        }
    };

    request.onerror = (e) => {
        console.error('Erro ao atualizar metadados da imagem:', e.target.error);
    };
}

function saveImageToIndexedDB(mapId, id, file, left = '100px', top = '100px', width = '150px', height = '150px') {
    if (file instanceof Blob) {
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64File = reader.result;

            const transaction = db.transaction(['images'], 'readwrite');
            const store = transaction.objectStore('images');

            const imageData = {
                mapId,
                id,
                file: base64File,
                left,
                top,
                width,
                height,
            };

            store.put(imageData);

            transaction.oncomplete = () => {
                console.log('Imagem salva no IndexedDB com sucesso!');
            };

            transaction.onerror = (e) => {
                console.error('Erro ao salvar imagem:', e.target.error);
            };
        };

        reader.readAsDataURL(file);
    }
}

function deletePdfFromIndexedDB(id) {
    const transaction = db.transaction(['pdfs'], 'readwrite');
    const store = transaction.objectStore('pdfs');

    const request = store.delete(id);

    request.onsuccess = () => {
        console.log(`PDF com ID ${id} removido do IndexedDB.`);
    };

    request.onerror = (e) => {
        console.error('Erro ao remover PDF do IndexedDB:', e.target.error);
    };
}

function loadPdfsFromIndexedDB(mapId) {
    const transaction = db.transaction(['pdfs'], 'readonly');
    const store = transaction.objectStore('pdfs');
    const request = store.getAll();

    request.onsuccess = (e) => {
        const pdfs = e.target.result.filter((pdf) => pdf.mapId === mapId);
        pdfs.forEach((pdfData) => {
            let pdfUrl;

            // Verifica se o arquivo está em Base64 e converte para Blob
            if (typeof pdfData.file === 'string') {
                try {
                    const pdfBlob = base64ToBlob(pdfData.file, 'application/pdf'); // Converte Base64 para Blob
                    pdfUrl = URL.createObjectURL(pdfBlob); // Gera URL para o Blob
                } catch (error) {
                    console.error('Erro ao converter Base64 para Blob:', error);
                    return;
                }
            } else {
                // Se já for um Blob, cria a URL diretamente
                pdfUrl = URL.createObjectURL(pdfData.file);
            }

            // Adiciona o PDF à grid
            addPdfToGrid(pdfUrl, pdfData.id, pdfData.left, pdfData.top);
        });
    };

    request.onerror = (e) => {
        console.error('Erro ao carregar PDFs do IndexedDB:', e.target.error);
    };
}

function updatePdfMetadataInIndexedDB(id, left, top) {
    const transaction = db.transaction(['pdfs'], 'readwrite');
    const store = transaction.objectStore('pdfs');

    const request = store.get(id);

    request.onsuccess = (e) => {
        const pdfData = e.target.result;

        if (pdfData) {
            pdfData.left = left;
            pdfData.top = top;

            store.put(pdfData);

            transaction.oncomplete = () => {
                console.log(`Metadados do PDF (${id}) atualizados com sucesso!`);
            };
        }
    };

    request.onerror = (e) => {
        console.error('Erro ao atualizar metadados do PDF:', e.target.error);
    };
}

function savePdfToIndexedDB(mapId, id, file, left = '100px', top = '100px') {
    // Verificar se o arquivo é um Blob
    if (file instanceof Blob) {
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64File = reader.result; // Converter para Base64

            const transaction = db.transaction(['pdfs'], 'readwrite');
            const store = transaction.objectStore('pdfs');

            const pdfData = {
                mapId,
                id,
                file: base64File,
                left,
                top,
            };

            store.put(pdfData);

            transaction.oncomplete = () => {
                console.log('PDF salvo no IndexedDB com sucesso!');
            };

            transaction.onerror = (e) => {
                console.error('Erro ao salvar PDF:', e.target.error);
            };
        };

        reader.readAsDataURL(file);
    } else {
        const transaction = db.transaction(['pdfs'], 'readwrite');
        const store = transaction.objectStore('pdfs');

        const pdfData = {
            mapId,
            id,
            file,
            left,
            top,
        };

        store.put(pdfData);

        transaction.oncomplete = () => {
            console.log('PDF salvo no IndexedDB com sucesso!');
        };

        transaction.onerror = (e) => {
            console.error('Erro ao salvar PDF:', e.target.error);
        };
    }
}

function saveVideoToIndexedDB(mapId, id, file, left = '500px', top = '300px', width = '200px', height = '150px') {
    // Verificar se o arquivo é um Blob
    if (file instanceof Blob) {
        // Se for Blob, converta para Base64 antes de armazenar
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64File = reader.result; // Resultado da conversão para Base64

            const transaction = db.transaction(['videos'], 'readwrite');
            const store = transaction.objectStore('videos');

            const videoData = {
                mapId,
                id,        
                file: base64File,      
                left,     
                top,  
                width,     
                height, 
            };

            store.put(videoData);

            transaction.oncomplete = () => {
                console.log('Vídeo salvo no IndexedDB com sucesso!');
            };

            transaction.onerror = (e) => {
                console.error('Erro ao salvar vídeo:', e.target.error);
            };
        };

        reader.onerror = (e) => {
            console.error('Erro ao converter o Blob para Base64:', e.target.error);
        };

        // Inicia a leitura do Blob como URL de dados (Base64)
        reader.readAsDataURL(file);
    } else {
        // Se o arquivo já for uma string (Base64), salve diretamente
        const transaction = db.transaction(['videos'], 'readwrite');
        const store = transaction.objectStore('videos');

        const videoData = {
            mapId,
            id,        
            file,      
            left,      
            top,       
            width,     
            height,    
        };

        store.put(videoData);

        transaction.oncomplete = () => {
            console.log('Vídeo salvo no IndexedDB com sucesso!');
        };

        transaction.onerror = (e) => {
            console.error('Erro ao salvar vídeo:', e.target.error);
        };
    }
}

function updateVideoMetadataInIndexedDB(id, left, top, width, height) {
    const transaction = db.transaction(['videos'], 'readwrite');
    const store = transaction.objectStore('videos');

    const request = store.get(id);

    request.onsuccess = (e) => {
        const videoData = e.target.result;

        if (videoData) {
            videoData.left = left;
            videoData.top = top;
            videoData.width = width;
            videoData.height = height;

            store.put(videoData);

            transaction.oncomplete = () => {
                console.log(`Metadados do vídeo (${id}) atualizados com sucesso!`);
            };
        }
    };

    request.onerror = (e) => {
        console.error('Erro ao atualizar metadados do vídeo:', e.target.error);
    };
}

function base64ToBlob(base64, mimeType = 'video/mp4') {
    const byteCharacters = atob(base64.split(',')[1]); // Decodifica a parte Base64
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
}

function loadVideosFromIndexedDB(currentMapId) {
    if (!db) {
        console.error('Banco de dados não inicializado!');
        return;
    }
    const transaction = db.transaction(['videos'], 'readonly');
    const store = transaction.objectStore('videos');
    const request = store.getAll();

    request.onsuccess = (e) => {
        const videos = e.target.result;
        videos.forEach((videoData) => {
            if (videoData.mapId === currentMapId) { // Carregar apenas vídeos do mapa atual
                let videoUrl;

                if (typeof videoData.file === 'string') {
                    try {
                        const videoBlob = base64ToBlob(videoData.file);
                        videoUrl = URL.createObjectURL(videoBlob);
                    } catch (error) {
                        console.error('Erro ao converter Base64 para Blob:', error);
                        return;
                    }
                }

                addVideoToGrid(
                    videoUrl,
                    videoData.left,
                    videoData.top,
                    videoData.width,
                    videoData.height,
                    saveToDb = false,
                    videoData.id
                );
            }
        });
    };

    request.onerror = (e) => {
        console.error('Erro ao carregar vídeos do IndexedDB:', e.target.error);
    };
}

function deleteVideoFromIndexedDB(id) {
    const transaction = db.transaction(['videos'], 'readwrite');
    const store = transaction.objectStore('videos');

    const request = store.delete(id); // Deleta o vídeo pelo ID

    request.onsuccess = () => {
        console.log(`Vídeo com ID ${id} removido do IndexedDB.`);
    };

    request.onerror = (e) => {
        console.error('Erro ao remover vídeo do IndexedDB:', e.target.error);
    };
}

const maps = [];

function createNewMap(name, width, height) {
    const maps = JSON.parse(localStorage.getItem('maps')) || [];
    const newMap = {
        id: `map-${Date.now()}`,
        name,
        width,
        height,
        data: [],
    };
    maps.push(newMap);
    localStorage.setItem('maps', JSON.stringify(maps));
    return newMap;
}

function loadExistingMaps() {
    const maps = JSON.parse(localStorage.getItem('maps')) || [];
    const mapList = document.getElementById('mapList');
    mapList.innerHTML = '';

    maps.forEach((map) => {
        const div = document.createElement('div');
        div.classList.add('mapItem');
        div.style.display = 'flex'; // Para alinhar os botões e o texto
        div.style.alignItems = 'center';
        div.style.justifyContent = 'space-between';
        div.style.marginBottom = '10px';
        div.style.padding = '10px';
        div.style.border = '1px solid #ddd';
        div.style.borderRadius = '5px';
        div.style.backgroundColor = '#f9f9f9';

        // Informações do mapa
        const mapInfo = document.createElement('span');
        mapInfo.textContent = `${map.name} (${map.width}, ${map.height}) | ${new Date(parseInt(map.id.split('-')[1])).toLocaleString()}`;
        mapInfo.style.flexGrow = '1';
        mapInfo.style.marginRight = '10px';
        mapInfo.style.color = '#333';
        mapInfo.classList.add('mapName');

        // Botão de acessar
        const accessButton = document.createElement('button');
        accessButton.textContent = 'Acessar';
        accessButton.style.marginRight = '5px';
        accessButton.style.padding = '8px 12px';
        accessButton.style.cursor = 'pointer';
        accessButton.style.backgroundColor = '#4CAF50';
        accessButton.style.color = 'white';
        accessButton.style.border = 'none';
        accessButton.style.borderRadius = '4px';
        accessButton.classList.add('accessMapButton');

        // Ação de acessar o mapa
        accessButton.addEventListener('click', () => openMap(map.id));

        // Botão de remover
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remover';
        removeButton.style.padding = '8px 12px';
        removeButton.style.cursor = 'pointer';
        removeButton.style.backgroundColor = '#F44336';
        removeButton.style.color = 'white';
        removeButton.style.border = 'none';
        removeButton.style.borderRadius = '4px';
        removeButton.classList.add('removeMapButton');

        // Previne propagação e remove o mapa
        removeButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Impede que o clique acione outra ação
            const confirmDelete = confirm(`Tem certeza que deseja remover o mapa "${map.name}"?`);
            if (confirmDelete) {
                removeMap(map.id);
                const maps = JSON.parse(localStorage.getItem('maps')) || [];

                if (maps.length === 0) {
                    document.getElementById("existingMap").textContent = "Crie o seu primeiro mapa!";
                }  else {
                    document.getElementById("existingMap").textContent = "Mapas Existentes";
                }
            }
        });

        // Adiciona os elementos na div
        div.appendChild(mapInfo);
        div.appendChild(accessButton);
        div.appendChild(removeButton);

        // Adiciona a div ao mapList
        mapList.appendChild(div);
    });
}

function removeMap(mapId) {
    const maps = JSON.parse(localStorage.getItem('maps')) || [];
    const updatedMaps = maps.filter(map => map.id !== mapId); // Remove o mapa pelo ID
    localStorage.setItem('maps', JSON.stringify(updatedMaps)); // Atualiza o localStorage

    loadExistingMaps(); // Recarrega a lista de mapas após a remoção
}

function fetchAllElementsFromDB(mapId, callback) {
    const transaction = db.transaction(['images', 'videos', 'audios', 'pdfs'], 'readonly');
    const elements = [];
    const objectStores = ['images', 'videos', 'audios', 'pdfs'];

    objectStores.forEach((storeName) => {
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => {
            request.result.forEach((item) => {
                if (item.mapId === mapId) {
                    elements.push({
                        id: item.id,
                        type: storeName,
                        name: item.name || `${storeName} ${item.id}`, // Nome amigável
                        left: parseFloat(item.left),
                        top: parseFloat(item.top),
                    });
                }
            });
        };
    });

    transaction.oncomplete = () => {
        callback(elements);
    };

    transaction.onerror = (e) => {
        console.error('Erro ao buscar elementos:', e.target.error);
    };
}

// Função para buscar todos os elementos do tipo bloco e tabela no localStorage
function fetchAllElementsFromLocalStorage(mapId, callback) {
    if (!db) {
        console.error("IndexedDB não está inicializado.");
        return;
    }

    const transaction = db.transaction(['elements'], 'readonly');
    const store = transaction.objectStore('elements');
    const request = store.get(mapId);

    request.onsuccess = (event) => {
        const map = event.target.result;
        const elements = [];

        if (map && map.data) {
            map.data.forEach((item) => {
                // Verificando se é um bloco ou tabela e extraindo as posições
                elements.push({
                    type: item.type, // Ex: 'block' ou 'table'
                    name: item.name || `${item.type} ${item.id || ''}`,
                    left: parseFloat(item.left),
                    top: parseFloat(item.top),
                });
            });
        }

        // Passa os elementos encontrados para o callback
        callback(elements);
    };

    request.onerror = (e) => {
        console.error('Erro ao buscar elementos do IndexedDB:', e.target.error);
        callback([]); // Retorna uma lista vazia em caso de erro
    };
}

const openSidebarButton = document.getElementById('openSidebarButton');
const closeSidebarButton = document.getElementById('closeSidebarButton');
const sidebar = document.getElementById('sidebar');

sidebar.addEventListener('wheel', (e) => {
    e.stopPropagation(); // Impede que o scroll afete o zoom na grid
});

// Função para abrir a sidebar
openSidebarButton.addEventListener('click', () => {
    sidebar.style.display = 'block'; // Torna a sidebar visível
    populateSidebar(currentMapId);
    populateSidebarFromLocalStorage(currentMapId);
});

// Função para fechar a sidebar
closeSidebarButton.addEventListener('click', () => {
    sidebar.style.display = 'none'; // Oculta a sidebar
});

// Função para popular a sidebar com os elementos do localStorage
function populateSidebarFromLocalStorage(mapId) {
    fetchAllElementsFromLocalStorage(mapId, (elements) => {
        const elementList = document.getElementById('localStorageElementList');
        elementList.innerHTML = ''; // Limpa a lista atual

        elements.forEach((element) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${element.type.toUpperCase()}`;
            listItem.dataset.id = element.id;

            // Navegar para o elemento ao clicar
            listItem.addEventListener('click', () => {
                navigateToElementViaMiniMap(element.left, element.top);
            });

            elementList.appendChild(listItem);
        });
    });
}

function populateSidebar(mapId) {
    fetchAllElementsFromDB(mapId, (elements) => {
        const elementList = document.getElementById('elementList');
        elementList.innerHTML = ''; // Limpa a lista atual

        elements.forEach((element) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${element.type.toUpperCase()} - ${element.name}`;
            listItem.dataset.id = element.id;

            // Navegar para o elemento ao clicar
            listItem.addEventListener('click', () => {
                navigateToElementViaMiniMap(element.left, element.top);
            });

            elementList.appendChild(listItem);
        });
    });
}

function navigateToElementViaMiniMap(left, top) {
    const minimapRect = minimap.getBoundingClientRect();

    // Calcular a posição proporcional no minimapa
    const scaleX = left / grid.offsetWidth;
    const scaleY = top / grid.offsetHeight;

    const clickX = minimapRect.left + scaleX * minimapRect.width;
    const clickY = minimapRect.top + scaleY * minimapRect.height;

    // Criar um evento de clique simulado
    const simulatedClick = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        clientX: clickX,
        clientY: clickY,
    });

    // Disparar o clique no minimapa
    minimap.dispatchEvent(simulatedClick);
}

function openMap(mapId) {
    const maps = JSON.parse(localStorage.getItem('maps')) || [];
    const map = maps.find((m) => m.id === mapId);

    document.getElementById('mainBody').style.overflow = 'hidden';
    document.getElementById('container').style.overflow = 'hidden';
    document.getElementById('container').style.background = 'none';

    if (map) {
        currentMapId = mapId;

        loadExistingMaps();
        loadVideosFromIndexedDB(currentMapId);
        loadPdfsFromIndexedDB(currentMapId);
        loadImagesFromIndexedDB(currentMapId);
        loadAudiosFromIndexedDB(currentMapId);
        populateSidebar(currentMapId);
        populateSidebarFromLocalStorage(currentMapId);
        loadStateFromLocalStorage(); // Carrega outros elementos

        // Oculta a tela inicial
        document.getElementById('startScreen').style.display = 'none';

        // Mostra a tela de carregamento
        const loadingScreen = document.getElementById('loadingScreen');
        const loadingBar = document.getElementById('loadingBar');
        const loadingText = document.getElementById('loadingText');
        loadingScreen.style.display = 'flex';

        let progress = 0;

        // Simula o progresso da barra de carregamento
        const interval = setInterval(() => {
            progress += 20; // Incremento em %
            loadingBar.style.width = `${progress}%`;

            if (progress === 100) {
                clearInterval(interval);

                // Atualiza o texto para indicar a conclusão
                loadingText.textContent = 'Mapa Carregado!';

                // Aguarda um pouco antes de mostrar o mapa
                setTimeout(() => {
                    loadingScreen.style.display = 'none';

                    // Configurações do mapa
                    const grid = document.getElementById('grid');
                    const elements = document.getElementById('elements');
                    const minimap = document.getElementById('minimap');

                    grid.style.width = `${map.width}px`;
                    grid.style.height = `${map.height}px`;

                    grid.style.display = 'block';
                    elements.style.display = 'block';
                    minimap.style.display = 'block';

                    updateMiniMap();
                    updateCurrentMap();
                }, 500); // Pequeno delay para transição
            }
        }, 400); // Atualiza a barra a cada 400ms
    }
}

function saveCurrentMap(mapId, data) {
    const maps = JSON.parse(localStorage.getItem('maps')) || [];
    const mapIndex = maps.findIndex((m) => m.id === mapId);

    if (mapIndex !== -1) {
        maps[mapIndex].data = data;
        localStorage.setItem('maps', JSON.stringify(maps));
    }
}

function navigateHome() {
    window.location.reload();
}

document.getElementById('mapConfigForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('mapName').value;
    const width = parseInt(document.getElementById('mapWidth').value, 10);
    const height = parseInt(document.getElementById('mapHeight').value, 10);

    // Validação para largura e altura mínimas
    if (width < 4000 || height < 4000) {
        alert('A largura e a altura do mapa devem ser no mínimo 4000 pixels.');
        return;
    }

    if (width > 12000 || height > 12000) {
        alert('A largura e a altura do mapa não devem ultrapassar 12000 pixels.');
        return;
    }

    const newMap = createNewMap(name, width, height);
    openMap(newMap.id);
});

// Alternar visibilidade ao pressionar "Tab"
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('grid').style.display === 'block') {
        e.preventDefault(); // Evita comportamento padrão da tecla "Tab"
        navigateHome();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('startScreen');
    const computedStyle = window.getComputedStyle(startScreen);

    if (computedStyle.display === 'block') {
        document.getElementById('mainBody').style.overflow = 'visible';
        document.getElementById('container').style.overflow = 'visible';
        document.getElementById('container').style.overflowX = 'hidden';
    }

    const maps = JSON.parse(localStorage.getItem('maps')) || [];

    if (maps.length === 0) {
        document.getElementById('startScreen').style.height = "100%";
        document.getElementById("existingMap").textContent = "Crie o seu primeiro mapa!";
    } else {
        document.getElementById('startScreen').style.height = "none";
        document.getElementById("existingMap").textContent = "Mapas Existentes";
    }

    initDatabase();
    loadExistingMaps(); // Carregar lista de mapas
});

document.getElementById('exportZipButton').addEventListener('click', async () => {
    const zip = new JSZip();

    // Exportar notas como .txt
    document.querySelectorAll('.note-block').forEach((note, index) => {
        const content = note.querySelector('textarea').value;
        zip.file(`note-${index + 1}.txt`, content);
    });

    // Exportar tabelas como .csv
    document.querySelectorAll('.table-block').forEach((tableBlock, index) => {
        const table = tableBlock.querySelector('table');
        let csvContent = '';
        table.querySelectorAll('tr').forEach(row => {
            const rowData = [];
            row.querySelectorAll('td').forEach(cell => rowData.push(cell.textContent.trim()));
            csvContent += rowData.join(',') + '\n';
        });
        zip.file(`table-${index + 1}.csv`, csvContent);
    });

    // Exportar elementos do IndexedDB do mapa atual
    const dbStores = ['images', 'videos', 'audios', 'pdfs'];
    for (const storeName of dbStores) {
        await exportFromIndexedDB(storeName, currentMapId, zip);
    }

    // Gerar o arquivo .zip e baixar
    zip.generateAsync({ type: 'blob' }).then(content => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `map_${currentMapId}_elements.zip`;
        link.click();
    });
});

async function exportFromIndexedDB(storeName, mapId, zip) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => {
            const results = request.result.filter(item => item.mapId === mapId);

            results.forEach(item => {
                const mimeType = detectMimeType(item.file);
                const extension = mimeType.split('/')[1]; // Obtém a extensão baseada no tipo MIME
                const blob = base64ToBlob(item.file, mimeType);
                zip.file(`${storeName}-${item.id}.${extension}`, blob);
            });

            resolve();
        };

        request.onerror = (e) => {
            console.error(`Erro ao exportar ${storeName}:`, e.target.error);
            reject(e.target.error);
        };
    });
}

let isDrawing = false;
let drawingMode = false;
const drawingCanvas = document.getElementById('drawingCanvas');
const ctx = drawingCanvas.getContext('2d');

// Função para redimensionar o canvas conforme a grid
function resizeCanvas() {
    drawingCanvas.width = 4000;
    drawingCanvas.height = 4000;
    drawingCanvas.style.position = 'absolute';
    drawingCanvas.style.top = '0';
    drawingCanvas.style.left = '0';
    drawingCanvas.style.zIndex = '10'; // Acima da grid
    drawingCanvas.style.display = 'none';
}

// Sincroniza a posição do canvas com a posição da grid
function syncCanvasPosition() {
    drawingCanvas.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

// Ativar/Desativar o modo de desenho
const toggleDrawingButton = document.getElementById('toggleDrawingModeButton');
const brushColorInput = document.getElementById('brushColor');
const brushSizeInput = document.getElementById('brushSize');
const drawingControls = document.getElementById('drawingControls');

// Função para atualizar a cor e o tamanho do pincel
function updateBrushSettings() {
    const brushColor = brushColorInput.value; // Cor do pincel
    const brushSize = parseInt(brushSizeInput.value, 10); // Tamanho do pincel

    // Configurações do contexto do canvas
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;

    ctx.lineCap = 'round'; // Faz o pincel circular
    ctx.lineJoin = 'round'; // Conexões suaves
}

// Atualiza as configurações do pincel ao alterar os controles
brushColorInput.addEventListener('input', updateBrushSettings);
brushSizeInput.addEventListener('input', updateBrushSettings);

drawingControls.addEventListener('mousedown', (e) => {
    e.stopPropagation(); // Previne que cliques no painel afetem a grade ou a câmera
});

brushColorInput.addEventListener('mousedown', (e) => {
    e.stopPropagation(); // Previne que o evento se propague para outros listeners
    updateBrushSettings();
});

brushSizeInput.addEventListener('mousedown', (e) => {
    e.stopPropagation(); // Previne que o evento se propague para outros listeners
    updateBrushSettings();
});

toggleDrawingButton.addEventListener('click', () => {
    drawingMode = !drawingMode;
    drawingCanvas.classList.toggle('active');
    toggleDrawingButton.textContent = drawingMode ? 'Ativar Mapa' : 'Ativar Desenho';

    if (drawingMode) {
        // Resetar escala e translação para a posição inicial
        scale = 1;
        translateX = 0;
        translateY = 0;
        
        // Aplica o reset de escala e translação no grid
        grid.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        
        // Redimensiona o canvas e atualiza o mini-mapa

        updateZoomIndicator();
        syncCanvasPosition();
        loadDrawingFromLocalStorage();

        // Torna o canvas visível e com interações ativas
        drawingCanvas.style.display = 'block';
        drawingCanvas.style.zIndex = '10'; // Canvas acima da grade
        drawingCanvas.style.pointerEvents = 'auto'; // Ativa interações no canvas
        drawingCanvas.style.backgroundColor = 'white'; // Ativa interações no canvas
        drawingControls.style.display = 'block';
        drawingControls.style.zIndex = '11';
        drawingControls.style.backgroundColor = '#e3e3e3';
        document.getElementById('minimap').style.zIndex = '10';

        // Atualiza o mini-mapa para o modo desenho
        updateMiniMap(drawingMode); 
    } else {
        // Define o canvas abaixo da grade e desativa interações
        drawingCanvas.style.zIndex = '-1';
        drawingCanvas.style.pointerEvents = 'none';
        drawingControls.style.display = 'none';
        document.getElementById('coordinatesDisplay').style.display = 'block';
        document.getElementById('drawingCanvas').style.display = 'none';

        // Reseta a posição da câmera de volta ao início
        translateX = 0;
        translateY = 0;
        scale = 1;
        grid.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`; // Restaura a posição inicial
        updateMiniMap();
    }
});

// Prevenir menu de contexto ao desenhar
drawingCanvas.addEventListener('contextmenu', (e) => {
    if (drawingMode) {
        e.preventDefault(); // Previne o menu de contexto
    }
});

drawingCanvas.addEventListener('mousedown', (e) => {
    if (e.button === 0 || e.button === 1) {
        drawingCanvas.style.cursor = 'grabbing';
    }
});

// Iniciar desenho com o botão direito
drawingCanvas.addEventListener('mousedown', (e) => {
    if (e.button !== 2 || !drawingMode) return; // Somente direito do mouse

    if (e.button === 2) {
        drawingCanvas.style.cursor = 'crosshair';
    }

    isDrawing = true;
    const rect = drawingCanvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
});

// Desenhar enquanto o botão direito está pressionado
drawingCanvas.addEventListener('mousemove', (e) => {
    if (!isDrawing || !drawingMode) return;

    const rect = drawingCanvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
});

// Parar de desenhar ao soltar o botão direito
drawingCanvas.addEventListener('mouseup', () => {
    drawingCanvas.style.cursor = 'default';
    if (!isDrawing) return;

    isDrawing = false;
    ctx.closePath();
});

async function saveDrawingToLocalStorage() {
    const transaction = db.transaction(['maps'], 'readwrite');
    const store = transaction.objectStore('maps');

    const drawingData = drawingCanvas.toDataURL(); // Salva o canvas como Base64

    const mapData = {
        id: currentMapId,
        drawing: drawingData,
    };

    store.put(mapData);

    transaction.oncomplete = () => {
        console.log('Desenho salvo no IndexedDB com sucesso!');
    };

    transaction.onerror = (e) => {
        console.error('Erro ao salvar o desenho:', e.target.error);
    };
}

async function loadDrawingFromLocalStorage() {
    const transaction = db.transaction(['maps'], 'readonly');
    const store = transaction.objectStore('maps');
    const request = store.get(currentMapId);

    request.onsuccess = (event) => {
        const mapData = event.target.result;

        if (mapData && mapData.drawing) {
            const img = new Image();
            img.src = mapData.drawing;
            img.onload = () => {
                ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height); // Limpa o canvas
                ctx.drawImage(img, 0, 0); // Desenha no canvas
            };
        } else {
            console.warn('Nenhum desenho encontrado no IndexedDB para o mapa atual.');
            ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height); // Limpa o canvas
        }
    };

    request.onerror = (e) => {
        console.error('Erro ao carregar o desenho do IndexedDB:', e.target.error);
    };
}

// Carregar o desenho ao abrir o mapa
resizeCanvas();
syncCanvasPosition();

document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'c' && drawingMode) { 
        if (confirm('Tem certeza de que deseja limpar todo o canvas? Esta ação não pode ser desfeita.')) {
            // Limpa o conteúdo do canvas
            ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
            console.log('Canvas limpo e desenho removido do armazenamento.');
        }
    }
    if (e.key.toLowerCase() === 's' && drawingMode) {
        if(confirm('Tem certeza que deseja salvar as alterações no canvas?')) {
            saveDrawingToLocalStorage();
        }
    }
});

document.addEventListener('contextmenu', event => {
    if (!drawingMode) {
        event.preventDefault();
    }
});

grid.addEventListener('dragover', (e) => {
    e.preventDefault(); // Permite o "drop"
    grid.style.backgroundColor = 'white'; 
});

grid.addEventListener('dragleave', () => {
    grid.style.backgroundColor = '#F4F4F4';
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB em bytes

grid.addEventListener('drop', (e) => {
    e.preventDefault();
    grid.style.backgroundColor = '#F4F4F4';

    const files = e.dataTransfer.files;

    for (let file of files) {
        // Verificar se o arquivo excede o limite de 5MB
        if (file.size > MAX_FILE_SIZE) {
            alert('O arquivo excede o tamanho máximo permitido de 5MB.');
            return; // Não processar o arquivo
        }

        // Lidar com arquivo de texto
        if (file.type === 'text/plain') {
            handleTextFile(file, e.clientX, e.clientY);
        }
        // Lidar com arquivo CSV
        else if (file.type === 'text/csv') {
            const { left, top } = calculatePositionOnGrid(e.clientX, e.clientY);
            handleCSVFile(file, left, top);
        }
        // Lidar com imagens
        else if (file.type.startsWith('image/')) {
            const id = `image-${Date.now()}`;
            handleImageFile(file, e.clientX, e.clientY, id);
            const { left, top } = calculatePositionOnGrid(e.clientX, e.clientY);
            saveImageToIndexedDB(currentMapId, id, file, `${left}px`, `${top}px`, width = '150px', height = '150px');
        }
        // Lidar com áudio
        else if (file.type.startsWith('audio/')) {
            const id = `audio-${Date.now()}`;
            handleAudioFile(file, e.clientX, e.clientY, id);
            const { left, top } = calculatePositionOnGrid(e.clientX, e.clientY);
            saveAudioToIndexedDB(currentMapId, id, file, `${left}px`, `${top}px`, width = '320px', height = '80px');
        }
        // Lidar com PDFs
        else if (file.type === 'application/pdf') {
            const id = `pdf-${Date.now()}`;
            handlePdfFile(file, e.clientX, e.clientY);
            const { left, top } = calculatePositionOnGrid(e.clientX, e.clientY);
            savePdfToIndexedDB(currentMapId, id, file, `${left}px`, `${top}px`);
        }
        // Lidar com vídeos
        else if (file.type.startsWith('video/')) {
            const id = `video-${Date.now()}`;
            handleVideoFile(file, e.clientX, e.clientY, id);
            const { left, top } = calculatePositionOnGrid(e.clientX, e.clientY);
            saveVideoToIndexedDB(currentMapId, id, file, `${left}px`, `${top}px`, width = '320px', height = '240px');
        }
        else {
            alert('Tipo de arquivo não suportado. Apenas arquivos de texto, CSV, imagem, áudio, PDF e vídeo são aceitos.');
        }
    }
});

function handleTextFile(file, mouseX, mouseY) {
    const reader = new FileReader();

    reader.onload = (event) => {
        const content = event.target.result;

        // Calcular a posição baseada no zoom e câmera
        const { left, top } = calculatePositionOnGrid(mouseX, mouseY);

        // Adicionar o bloco de notas na grid
        addNoteBlock(left, top, content);
    };

    reader.readAsText(file);
}

function calculatePositionOnGrid(mouseX, mouseY) {
    const rect = grid.getBoundingClientRect();

    const gridX = (mouseX - translateX)/scale;
    const gridY = (mouseY - translateY)/scale;

    return { left: parseInt(gridX), top: parseInt(gridY) };
}

function handleVideoFile(file, mouseX, mouseY, id) {
    const reader = new FileReader();

    reader.onload = (event) => {
        const videoUrl = event.target.result;

        // Calcular a posição baseada no zoom e câmera
        const { left, top } = calculatePositionOnGrid(mouseX, mouseY);

        // Adicionar o vídeo na grid
        addVideoToGrid(videoUrl, `${left}px`, `${top}px`, '320px', '240px', false, id);
    };

    reader.readAsDataURL(file);
}

// Função para lidar com o arquivo de imagem
function handleImageFile(file, mouseX, mouseY, id) {
    const reader = new FileReader();

    reader.onload = (event) => {
        const imageUrl = event.target.result;

        // Calcular a posição baseada no zoom e câmera
        const { left, top } = calculatePositionOnGrid(mouseX, mouseY);
        // Adicionar a imagem na grid
        addImageToGrid(id, imageUrl, `${left}px`, `${top}px`, '150px', '150px');
    };

    reader.readAsDataURL(file);
}

// Função para lidar com o arquivo de áudio
function handleAudioFile(file, mouseX, mouseY) {
    const reader = new FileReader();

    reader.onload = (event) => {
        const audioUrl = event.target.result;

        // Calcular a posição baseada no zoom e câmera
        const { left, top } = calculatePositionOnGrid(mouseX, mouseY);

        // Adicionar o áudio na grid
        addAudioToGrid(`audio-${Date.now()}`, audioUrl, `${left}px`, `${top}px`);
    };

    reader.readAsDataURL(file);
}

// Função para lidar com o arquivo PDF
function handlePdfFile(file, mouseX, mouseY) {
    const pdfUrl = URL.createObjectURL(file);

    // Calcular a posição baseada no zoom e câmera
    const { left, top } = calculatePositionOnGrid(mouseX, mouseY);

    // Adicionar o PDF na grid
    addPdfToGrid(pdfUrl, `pdf-${Date.now()}`, `${left}px`, `${top}px`);
}

function handleCSVFile(file, left, top) {
    const reader = new FileReader();

    reader.onload = (event) => {
        const csvContent = event.target.result;
        const tableData = parseCSV(csvContent);

        const rows = tableData.length;
        const columns = tableData[0]?.length || 0;

        // Converter o conteúdo CSV em uma lista linear de dados para `createTableFromState`
        const flatData = tableData.flat();

        // Criar tabela reutilizando a função existente
        createTableFromState(left, top, columns * 100, rows * 50, rows, columns, flatData);
        saveStateToLocalStorage();
    };

    reader.readAsText(file);
}

function parseCSV(csvContent) {
    const rows = csvContent
        .trim() // Remove espaços em branco extras no início e fim
        .split('\n') // Divide por linhas
        .map((row) => {
            // Verifica o delimitador (vírgula ou ponto e vírgula)
            const delimiter = row.includes(';') ? ';' : ',';
            return row.split(delimiter).map(cell => cell.trim());
        });
    return rows;
}

function updateCoordinatesDisplay(event) {
    const rect = grid.getBoundingClientRect();

    // Calcular as coordenadas considerando o translate e o scale
    const gridX = Math.round((event.clientX - translateX) / scale);
    const gridY = Math.round((event.clientY - translateY) / scale);

    const coordinatesDisplay = document.getElementById('coordinatesDisplay');
    coordinatesDisplay.style.display = 'block';
    coordinatesDisplay.textContent = `X: ${gridX}, Y: ${gridY}`;
}

// Função para calcular o uso do IndexedDB
async function getIndexedDBUsage() {
    if (!navigator.storage || !navigator.storage.estimate) {
        console.warn("API Storage Estimate não é suportada neste navegador.");
        return null;
    }

    const estimate = await navigator.storage.estimate();
    const used = estimate.usage; // Espaço utilizado
    const quota = estimate.quota; // Espaço total disponível

    return {
        used: used || 0,
        quota: quota || 0,
        percentage: ((used / quota) * 100).toFixed(2) || 0
    };
}

// Atualizar as informações de armazenamento e exibir as barras de progresso
async function updateStorageInfo() {
    // IndexedDB
    const indexedDBInfo = await getIndexedDBUsage();
    if (indexedDBInfo) {
        const usedInMB = (indexedDBInfo.used / 1024 / 1024).toFixed(2); // Convertendo para MB
        const quotaInMB = (indexedDBInfo.quota / 1024 / 1024).toFixed(2); // Convertendo para MB
        const percentage = indexedDBInfo.percentage;

        document.getElementById('indexedDBUsage').innerHTML = 
            `<b>Uso do IndexedDB:</b> ${usedInMB} MB / ${quotaInMB} MB (${percentage}%)`;
        document.getElementById('indexedDBProgressBar').style.width = `${percentage}%`;
    }
}

// Exibir as informações de armazenamento ao clicar no botão
document.getElementById('showStorageInfoBtn').addEventListener('click', (e) => {
    e.preventDefault();
    const storageInfo = document.getElementById('storageInfo');
    const overlay = document.getElementById('overlay');

    // Mostrar o overlay e o modal
    overlay.style.display = 'block';
    storageInfo.style.display = 'block'; 

    updateStorageInfo(); // Atualiza as informações de armazenamento
});

// Fechar o modal ao clicar no botão "fechar"
document.getElementById('closeModalBtn').addEventListener('click', () => {
    const storageInfo = document.getElementById('storageInfo');
    const overlay = document.getElementById('overlay');

    // Esconder o modal e o overlay
    storageInfo.style.display = 'none';
    overlay.style.display = 'none';
});

// Fechar o modal quando clicar fora do conteúdo do modal
window.addEventListener('click', (e) => {
    const modal = document.getElementById('storageInfo');
    const overlay = document.getElementById('overlay');
    if (e.target === overlay) {
        modal.style.display = 'none';
        overlay.style.display = 'none';
    }
});

const avatar = document.querySelector('.avatar');

// Adicionar a classe "fast" ao passar o mouse na imagem
avatar.addEventListener('mouseenter', () => {
    container.classList.add('fast');
});

// Remover a classe "fast" ao sair da imagem
avatar.addEventListener('mouseleave', () => {
    container.classList.remove('fast');
});

let elementsVisible = true; // Controle da visibilidade

// IDs dos elementos que serão ocultados/exibidos
const toggleableElements = [
    'buttons',
    'minimap',
    'zoomIndicator',
    'currentMapIndicator',
];

// Função para alternar visibilidade
function toggleElementsVisibility() {
    elementsVisible = !elementsVisible; // Alterna o estado

    toggleableElements.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.toggle('hidden', !elementsVisible);
        }
    });
}

// Listener para a tecla 'h'
document.addEventListener('keydown', (e) => {
    if (e.key === 'h') {
        toggleElementsVisibility();
    }
});

// Função para limpar completamente todas as ObjectStores do IndexedDB
function clearAllIndexedDBStores() {
    const transaction = db.transaction(['elements', 'videos', 'audios', 'pdfs', 'images', 'maps'], 'readwrite');

    const stores = ['elements', 'videos', 'audios', 'pdfs', 'images', 'maps'];
    stores.forEach((storeName) => {
        const store = transaction.objectStore(storeName);
        const clearRequest = store.clear();

        clearRequest.onsuccess = () => {
            console.log(`Todos os dados da ObjectStore "${storeName}" foram removidos com sucesso.`);
        };

        clearRequest.onerror = (e) => {
            console.error(`Erro ao limpar a ObjectStore "${storeName}":`, e.target.error);
        };
    });

    transaction.oncomplete = () => {
        console.log('Todas as ObjectStores foram limpas do IndexedDB.');
    };

    transaction.onerror = (e) => {
        console.error('Erro ao executar a transação para limpar o IndexedDB:', e.target.error);
    };
}

// Função para remover todos os elementos da grid
function clearGridElementsAndStorage() {
    const confirmation = confirm('Tem certeza de que deseja apagar todos os elementos da grade e os dados armazenados?');
    if (!confirmation) return;

    // Limpar elementos da grid no DOM
    const elements = grid.querySelectorAll(
        '.note-block, .image-block, .audio-block, .pdf-block, .video-block, .table-block'
    );
    elements.forEach((element) => element.remove());

    // Limpar dados do IndexedDB
    clearAllIndexedDBStores();

    console.log('Todos os elementos foram removidos da grade e do IndexedDB.');
}

// Listener para a tecla 'd'
document.addEventListener('keydown', (e) => {
    if (e.key === 'd') {
        clearGridElementsAndStorage();
    }
});

window.addEventListener('resize', function(event) {
    updateMiniMap();
}, true);