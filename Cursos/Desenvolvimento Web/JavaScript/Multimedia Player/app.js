document.addEventListener('DOMContentLoaded', function() {
    const mediaPlayer = document.getElementById('mediaPlayer');
    const playPauseButton = document.getElementById('playPauseButton');
    const stopButton = document.getElementById('stopButton');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const loopButton = document.getElementById('loopButton');
    const muteButton = document.getElementById('muteButton');
    const volumeSlider = document.getElementById('volumeSlider');
    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('progressContainer');
    const playlist = document.getElementById('playlist');
    const currentTimeDisplay = document.getElementById('currentTime');
    const durationDisplay = document.getElementById('duration');
    const uploadZone = document.getElementById('uploadZone');
    const uploadButton = document.getElementById('uploadButton');
    const fileInput = document.getElementById('fileInput');
    const shuffleButton = document.getElementById('shuffleButton');
    const fullscreenButton = document.getElementById('fullscreenButton');
    const equalizer = document.getElementById('equalizer');
    const groupControls = document.getElementById('groupControls');
    const groupContainer = document.getElementById('groupContainer');
    const loadingGroupMessage = document.getElementById('loadingGroupMessage');

    let isLooping = false;
    let isShuffling = false;
    let currentPlaylistIndex = 0;
    let currentGroup = '';
    let db;

    const request = indexedDB.open('MediaPlayerDB', 1);

    request.onupgradeneeded = (e) => {
        db = e.target.result;
        if (!db.objectStoreNames.contains('playlist')) {
            const store = db.createObjectStore('playlist', { keyPath: 'id', autoIncrement: true });                    
            store.createIndex('group', 'group', { unique: false });
        }
    };

    request.onsuccess = (e) => {
        db = e.target.result;
        loadGroups();
        loadPlaylist(currentGroup);
    };

    request.onerror = (e) => {
        console.error('Erro ao abrir o IndexedDB', e);
    };

    function saveMediaToDB(media) {
        const transaction = db.transaction(['playlist'], 'readwrite');
        const store = transaction.objectStore('playlist');
        store.add(media);
    }

    function loadGroups() {
        // Adiciona a barra de carregamento na interface
        const loadingBarContainer = document.createElement('div');
        loadingBarContainer.style.position = 'fixed';
        loadingBarContainer.style.top = '0';
        loadingBarContainer.style.left = '0';
        loadingBarContainer.style.width = '100%';
        loadingBarContainer.style.height = '4px';
        loadingBarContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        loadingBarContainer.style.zIndex = '9999';
        loadingGroupMessage.style.display = 'block';

        const loadingBar = document.createElement('div');
        loadingBar.style.width = '0%';
        loadingBar.style.height = '100%';
        loadingBar.style.backgroundColor = '#1db954';
        loadingBar.style.transition = 'width 0.2s ease';

        loadingBarContainer.appendChild(loadingBar);
        document.body.appendChild(loadingBarContainer);

        const transaction = db.transaction(['playlist'], 'readonly');
        const store = transaction.objectStore('playlist');
        const groupIndex = store.index('group');
        const groups = new Set();

        let processed = 0; // Para rastrear progresso
        let totalGroups = 0;

        // Obtém a contagem total para calcular o progresso
        store.count().onsuccess = (e) => {
            totalGroups = e.target.result;

            const request = groupIndex.openCursor(null, 'next');
            request.onsuccess = (e) => {
                const cursor = e.target.result;
                if (cursor) {
                    groups.add(cursor.value.group || 'Default');
                    processed++;

                    // Atualiza a barra de progresso
                    const progress = Math.round((processed / totalGroups) * 100);
                    loadingBar.style.width = `${progress}%`;

                    cursor.continue();
                } else {
                    // Após finalizar o carregamento, renderiza os grupos
                    renderGroups(Array.from(groups));
                    updateNoGroupMessage();
                    loadingGroupMessage.style.display = 'none';

                    // Remove a barra de carregamento
                    setTimeout(() => {
                        loadingBarContainer.remove();
                    }, 500); // Pequeno atraso para transição
                }
            };

            request.onerror = () => {
                console.error('Erro ao carregar os grupos.');
                loadingBarContainer.remove();
            };
        };
    }

    function renderGroups(groups) {
        groups.forEach(group => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'group';
            groupDiv.dataset.group = group;

            // Container do nome e botão
            const groupContent = document.createElement('div');
            groupContent.style.display = 'flex';
            groupContent.style.justifyContent = 'space-between';
            groupContent.style.alignItems = 'center';

            // Nome do grupo
            const groupNameSpan = document.createElement('span');
            groupNameSpan.textContent = group;

            // Botão de remoção
            const removeButton = document.createElement('button');
            removeButton.textContent = '✕';
            removeButton.className = 'remove-button';
            removeButton.style.marginLeft = '10px';
            removeButton.style.backgroundColor = '#ff4444';
            removeButton.style.color = 'white';
            removeButton.style.border = 'none';
            removeButton.style.borderRadius = '4px';
            removeButton.style.cursor = 'pointer';

            removeButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Impede o clique no botão de ativar o grupo

                // Remove o grupo da interface
                groupDiv.remove();

                // Limpa o playlist se o grupo removido for o ativo
                if (group === currentGroup) {
                    playlist.innerHTML = '';
                    currentGroup = null;
                    resetInterface();
                }

                // Remove o grupo do banco de dados ou sistema
                removeGroupFromDB(group);
                updateNoGroupMessage();
            });

            // Adiciona nome e botão ao container
            groupContent.appendChild(groupNameSpan);
            groupContent.appendChild(removeButton);

            // Adiciona o conteúdo ao grupo
            groupDiv.appendChild(groupContent);

            // Marcar o grupo como ativo ao carregar
            if (group === currentGroup) {
                Array.from(groupContainer.children).forEach(groupElem => {
                    groupElem.classList.remove('active');
                });
                groupDiv.classList.add('active');
            }

            groupDiv.addEventListener('click', () => {
                // Atualiza o grupo atual
                currentGroup = group;

                // Remove o destaque de outros grupos
                Array.from(groupContainer.children).forEach(groupElem => {
                    groupElem.classList.remove('active');
                });

                // Adiciona destaque ao grupo clicado
                groupDiv.classList.add('active');

                // Carrega a playlist do grupo selecionado
                loadPlaylist(group);
            });

            groupContainer.appendChild(groupDiv);
        });
    }

    function removeGroupFromDB(groupName) {
        // Criar elementos diretamente na função
        const loadingBar = document.createElement('div');
        loadingBar.style.position = 'fixed';
        loadingBar.style.top = '0';
        loadingBar.style.left = '0';
        loadingBar.style.width = '0%';
        loadingBar.style.height = '4px';
        loadingBar.style.background = '#1db954';
        loadingBar.style.transition = 'width 0.4s';
        document.body.appendChild(loadingBar);

        const transaction = db.transaction(['playlist'], 'readwrite');
        const store = transaction.objectStore('playlist');
        const index = store.index('group');

        const request = index.openCursor(groupName);

        // Variável para simular progresso
        let progress = 0;

        request.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
                store.delete(cursor.primaryKey); // Remove todos os itens associados ao grupo
                cursor.continue();

                // Simula progresso para a barra
                progress += 20; // Incrementa 20% a cada remoção
                loadingBar.style.width = `${Math.min(progress, 100)}%`;
            } else {
                // Conclui o carregamento
                loadingBar.style.width = '100%';
                setTimeout(() => {
                    loadingBar.remove(); // Remove a barra após conclusão
                }, 500);
            }
        };

        request.onerror = () => {
            alert('Erro ao remover o grupo.');
            loadingBar.remove(); // Remove a barra em caso de erro
        };

        transaction.oncomplete = () => {
            console.log('Transação concluída.');
        };

        transaction.onerror = () => {
            console.error('Erro na transação.');
            loadingBar.remove(); // Remove a barra em caso de erro
        };
    }

    // Adicionar mídia à interface
    function addMediaToUI(media, id) {
        const item = document.createElement('div');
        item.className = 'playlist-item';
        item.dataset.src = media.url;
        item.dataset.type = media.type;
        item.dataset.id = id;

        const nameSpan = document.createElement('span');
        nameSpan.textContent = media.name;
        nameSpan.contentEditable = true;
        nameSpan.style.cursor = 'text';

        nameSpan.addEventListener('blur', () => {
            media.name = nameSpan.textContent;
            updateMediaInDB(id, media);
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'end';
        const removeButton = document.createElement('button');
        removeButton.className = 'remove-button';
        removeButton.textContent = '✕';
        removeButton.onclick = (e) => {
            e.stopPropagation();

            // Verifica se o item removido é o que está sendo reproduzido
            const isCurrentlyPlaying = mediaPlayer.src === item.dataset.src;

            // Remove do banco de dados
            removeMediaFromDB(id);

            // Remove o item da interface
            item.remove();

            // Se o item removido estava sendo reproduzido, limpa o player
            if (isCurrentlyPlaying) {
                resetInterface();
            }
        };

        const downloadButton = document.createElement('button');
        downloadButton.className = 'download-button';
        downloadButton.textContent = 'Download';
        downloadButton.onclick = (e) => {
            e.stopPropagation(); // Evita conflito com outros eventos de clique

            // Cria um link temporário para download
            const link = document.createElement('a');
            link.href = media.url;
            link.download = media.name || 'media'; // Define o nome do arquivo
            link.style.display = 'none';
            document.body.appendChild(link);

            link.click(); // Simula o clique para iniciar o download

            document.body.removeChild(link); // Remove o link temporário
        };

        item.appendChild(nameSpan);
        buttonContainer.appendChild(downloadButton);
        buttonContainer.appendChild(removeButton);
        item.appendChild(buttonContainer);

        item.addEventListener('click', () => {
            currentPlaylistIndex = Array.from(playlist.children).indexOf(item);
            loadMedia(currentPlaylistIndex);
        });

        playlist.appendChild(item);

        if (playlist.children.length === 1) {
            loadMedia(0);
        }
    }

    function updateMediaInDB(id, updatedData) {
        const transaction = db.transaction(['playlist'], 'readwrite');
        const store = transaction.objectStore('playlist');
        store.put({ ...updatedData, id });
    }

    function removeMediaFromDB(id) {
        const transaction = db.transaction(['playlist'], 'readwrite');
        const store = transaction.objectStore('playlist');
        store.delete(id);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Funções auxiliares
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Atualizar ícones
    function updatePlayPauseIcon() {
        playPauseButton.innerHTML = `<i class="fas fa-${mediaPlayer.paused ? 'play' : 'pause'}"></i>`;
    }

    function updateMuteIcon() {
        muteButton.innerHTML = `<i class="fas fa-volume-${mediaPlayer.muted ? 'mute' : 'up'}"></i>`;
    }

    // Event Listeners para novos controles
    let originalPlaylist = [];

    shuffleButton.addEventListener('click', () => {
        const items = Array.from(playlist.children);

        if (!isShuffling) {
            // Armazene a ordem original da playlist
            originalPlaylist = items.map(item => item.cloneNode(true));
            // Embaralhe os itens
            const shuffledItems = shuffleArray(items);
            // Atualize a playlist com a ordem embaralhada
            playlist.innerHTML = '';
            shuffledItems.forEach(item => playlist.appendChild(item));
            isShuffling = true;
        } else {
            // Restaure a ordem original
            playlist.innerHTML = '';
            originalPlaylist.forEach(item => playlist.appendChild(item));
            isShuffling = false;
        }
    });

    fullscreenButton.addEventListener('click', () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
        } else {
            mediaPlayer.requestFullscreen();
            fullscreenButton.innerHTML = '<i class="fas fa-compress"></i>';
        }
    });

    function loadPlaylist(group) {
        // Desativa os botões de acesso aos grupos
        const groupButtons = document.querySelectorAll('.group');
        groupButtons.forEach((button) => {
            button.style.pointerEvents = 'none'; // Desativa interações
            button.style.opacity = '0.5'; // Indica visualmente que estão desativados
        });

        // Libera URLs Blob antigas antes de recarregar a playlist
        const playlistItems = playlist.querySelectorAll('.playlist-item');
        playlistItems.forEach((item) => {
            const url = item.dataset.src;
            if (url) {
                URL.revokeObjectURL(url); // Revoga a URL Blob
            }
        });

        playlist.innerHTML = ''; // Limpa a interface da playlist

        const transaction = db.transaction(['playlist'], 'readonly');
        const store = transaction.objectStore('playlist');
        const index = store.index('group');

        const request = index.openCursor(group);
        request.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
                const media = cursor.value;

                // Cria uma nova URL Blob e salva no atributo `data-src`
                media.url = URL.createObjectURL(new Blob([media.data], { type: media.type }));

                addMediaToUI(media, media.id);
                cursor.continue();
            } else {
                // Reativa os botões de acesso aos grupos após o carregamento
                groupButtons.forEach((button) => {
                    button.style.pointerEvents = ''; // Restaura interações
                    button.style.opacity = ''; // Restaura a opacidade original
                });
            }
        };

        request.onerror = (e) => {
            console.error('Erro ao carregar a playlist:', e.target.error);

            // Certifique-se de reativar os botões em caso de erro
            groupButtons.forEach((button) => {
                button.style.pointerEvents = ''; // Restaura interações
                button.style.opacity = ''; // Restaura a opacidade original
            });
        };
    }

    function updateNoGroupMessage() {
        const noGroupMessage = document.getElementById('noGroupMessage');
        const hasGroups = groupContainer.children.length > 2; // Ignora a mensagem como filho
        noGroupMessage.style.display = hasGroups ? 'none' : 'block';
    }

    const addGroupButton = document.getElementById('addGroupButton');
    const groupNameInput = document.getElementById('groupNameInput');

    addGroupButton.addEventListener('click', () => {
        const groupName = groupNameInput.value.trim();
        if (!groupName) return;

        // Verifica se o grupo já existe para evitar duplicatas
        const existingGroups = Array.from(groupContainer.children).map(
            (group) => group.dataset.group
        );
        if (existingGroups.includes(groupName)) {
            alert('Este grupo já existe!');
            groupNameInput.value = '';
            return;
        }

        // Atualiza o grupo atual e adiciona o novo grupo
        currentGroup = groupName;
        createGroupUI(groupName); // Adiciona o novo grupo na UI
        groupNameInput.value = '';
        updateNoGroupMessage();
    });

    // Função para criar um grupo individual na UI
    function createGroupUI(groupName) {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'group';
        groupDiv.dataset.group = groupName;

        // Container do nome e botão
        const groupContent = document.createElement('div');
        groupContent.style.display = 'flex';
        groupContent.style.justifyContent = 'space-between';
        groupContent.style.alignItems = 'center';

        // Nome do grupo
        const groupNameSpan = document.createElement('span');
        groupNameSpan.textContent = groupName;

        // Botão de remoção
        const removeButton = document.createElement('button');
        removeButton.textContent = '✕';
        removeButton.className = 'remove-button';
        removeButton.style.marginLeft = '10px';
        removeButton.style.backgroundColor = '#ff4444';
        removeButton.style.color = 'white';
        removeButton.style.border = 'none';
        removeButton.style.borderRadius = '4px';
        removeButton.style.cursor = 'pointer';

        removeButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Impede o clique no botão de ativar o grupo

            // Remove o grupo da interface
            groupDiv.remove();

            // Limpa o playlist se o grupo removido for o ativo
            if (groupName === currentGroup) {
                playlist.innerHTML = '';
                currentGroup = null;
                resetInterface();
            }

            // Lógica para remover o grupo do banco de dados ou sistema
            removeGroupFromDB(groupName);
            updateNoGroupMessage();
        });

        // Adiciona nome e botão ao container
        groupContent.appendChild(groupNameSpan);
        groupContent.appendChild(removeButton);

        // Adiciona o conteúdo ao grupo
        groupDiv.appendChild(groupContent);

        // Define o grupo como ativo se for o grupo atual
        if (groupName === currentGroup) {
            Array.from(groupContainer.children).forEach(groupElem => {
                groupElem.classList.remove('active');
            });
            groupDiv.classList.add('active');
            loadPlaylist(groupName);
        }

        groupDiv.addEventListener('click', () => {
            // Atualiza o grupo atual
            currentGroup = groupName;

            // Remove o destaque de outros grupos
            Array.from(groupContainer.children).forEach(groupElem => {
                groupElem.classList.remove('active');
            });

            // Adiciona destaque ao grupo clicado
            groupDiv.classList.add('active');

            // Carrega a playlist do grupo selecionado
            loadPlaylist(groupName);
        });

        groupContainer.appendChild(groupDiv);
    }

    playlist.addEventListener('click', (e) => {
        const item = e.target.closest('.playlist-item');
        if (!item) return; // Clique fora de um item da playlist

        // Verifica se o botão de remover foi clicado
        if (e.target.classList.contains('remove-button')) {
            const url = item.dataset.src;
            URL.revokeObjectURL(url);
            item.remove();

            if (playlist.children.length === 0) {
                mediaPlayer.src = '';
                pauseMedia();
            }
            return;
        }

        // Caso seja um item de playlist
        currentPlaylistIndex = Array.from(playlist.children).indexOf(item);
        loadMedia(currentPlaylistIndex);
    });

    function loadMedia(index) {
        const items = playlist.getElementsByClassName('playlist-item');
        if (items.length === 0) return;

        const item = items[index];

        // Atualiza a classe 'active' na playlist
        Array.from(items).forEach(item => item.classList.remove('active'));
        item.classList.add('active');

        // Atualiza a fonte do mediaPlayer
        mediaPlayer.src = item.dataset.src;

        // Adiciona um listener para garantir que o play só ocorra após carregar
        // mediaPlayer.addEventListener('canplay', playMedia, { once: true });
        pauseMedia();
        progressBar.style.width = '0%';
        currentTimeDisplay.textContent = '0:00';
        durationDisplay.textContent = '0:00';

        mediaPlayer.load();
    }

    function resetInterface() {
        mediaPlayer.src = '';
        mediaPlayer.load(); // Recarrega para garantir que o player esteja limpo
        pauseMedia(); // Pausa o player para garantir

        // Reseta a barra de progresso e os tempos exibidos
        progressBar.style.width = '0%';
        currentTimeDisplay.textContent = '0:00';
        durationDisplay.textContent = '0:00';
    }

    function playMedia() {
        mediaPlayer.play();
        updatePlayPauseIcon();
    }

    function pauseMedia() {
        mediaPlayer.pause();
        updatePlayPauseIcon();
    }

    // Event Listeners para Upload
    uploadButton.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        if (!currentGroup) {
            alert('Por favor, crie ou selecione uma playlist antes de fazer o upload.');
            return;
        }

        if (!isGroupAvailable()) {
            alert(`O grupo "${currentGroup}" já atingiu o limite de 15 itens.`);
            return;
        }

        Array.from(e.target.files).forEach(handleLargeFileUpload);
        fileInput.value = '';
    });

    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });

    let activeUploads = 0; // Contador de uploads ativos

    function handleLargeFileUpload(file) {
        activeUploads++; // Incrementa o contador ao iniciar um upload

        const MAX_SIZE_MB = 20;
        const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

        if (file.size > MAX_SIZE_BYTES) {
            alert(`O arquivo "${file.name}" excede o limite de ${MAX_SIZE_MB} MB e não pode ser carregado.`);
            activeUploads--; // Decrementa o contador se não for carregado
            return;
        }

        const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB por chunk
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        let currentChunk = 0;

        const uploadProgress = document.getElementById('uploadProgress');
        const fileProgress = document.createElement('div');
        fileProgress.textContent = `Carregando "${file.name}": 0%`;
        uploadProgress.appendChild(fileProgress);
        uploadProgress.style.display = 'block';

        const stream = new ReadableStream({
            start(controller) {
                const reader = new FileReader();

                function processChunk() {
                    if (currentChunk >= totalChunks) {
                        controller.close();
                        return;
                    }

                    const start = currentChunk * CHUNK_SIZE;
                    const end = Math.min(start + CHUNK_SIZE, file.size);
                    const chunk = file.slice(start, end);

                    reader.onload = (event) => {
                        controller.enqueue(new Uint8Array(event.target.result));
                        currentChunk++;

                        const progress = Math.round((currentChunk / totalChunks) * 100);
                        fileProgress.textContent = `Carregando "${file.name}": ${progress}%`;

                        processChunk();
                    };

                    reader.onerror = (error) => {
                        controller.error(error);
                        fileProgress.textContent = `Erro ao carregar "${file.name}"`;
                    };

                    reader.readAsArrayBuffer(chunk);
                }

                processChunk();
            }
        });

        let chunks = [];

        stream
            .pipeTo(new WritableStream({
                write(chunk) {
                    chunks.push(chunk);
                },
                close() {
                    const finalData = new Uint8Array(
                        chunks.reduce((acc, chunk) => acc + chunk.length, 0)
                    );

                    let offset = 0;
                    chunks.forEach(chunk => {
                        finalData.set(chunk, offset);
                        offset += chunk.length;
                    });

                    saveLargeFileToDB(file.name, finalData, file.type);
                    fileProgress.textContent = `Upload concluído: "${file.name}"`;

                    setTimeout(() => {
                        fileProgress.remove();
                        if (!uploadProgress.children.length) {
                            uploadProgress.style.display = 'none';
                        }

                        // Decrementa o contador ao finalizar
                        activeUploads--;
                        checkForReset();
                    }, 2000);

                    chunks = null; // Limpa a memória
                }
            }))
            .catch(error => {
                console.error('Erro no processamento do arquivo:', error);
                fileProgress.textContent = `Erro ao processar "${file.name}"`;

                activeUploads--; // Garante decremento no caso de erro
                checkForReset();
            });
    }

    function checkForReset() {
        if (activeUploads === 0) {
            showLoadingScreenAndReload();
        }
    }

    function showLoadingScreenAndReload() {
        // Cria o elemento de tela cheia
        const loadingScreen = document.createElement('div');
        loadingScreen.style.position = 'fixed';
        loadingScreen.style.top = '0';
        loadingScreen.style.left = '0';
        loadingScreen.style.width = '100%';
        loadingScreen.style.height = '100%';
        loadingScreen.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        loadingScreen.style.color = 'white';
        loadingScreen.style.display = 'flex';
        loadingScreen.style.flexDirection = 'column';
        loadingScreen.style.justifyContent = 'center';
        loadingScreen.style.alignItems = 'center';
        loadingScreen.style.zIndex = '9999';
        loadingScreen.style.transition = 'background-color 1s ease, opacity 0.5s ease';

        // Adiciona o elemento à tela
        document.body.appendChild(loadingScreen);

        // Passo 1: Muda a cor do fundo
        setTimeout(() => {
            loadingScreen.style.backgroundColor = 'rgba(0, 0, 0, 1)';
        }, 100);

        // Passo 2: Exibe o texto "Preparando dados"
        setTimeout(() => {
            const loadingText = document.createElement('div');
            loadingText.textContent = 'Preparando dados...';
            loadingText.style.fontSize = '24px';
            loadingText.style.marginBottom = '20px';
            loadingText.style.opacity = '0';
            loadingText.style.transition = 'opacity 1s ease';
            loadingScreen.appendChild(loadingText);

            setTimeout(() => {
                loadingText.style.opacity = '1';
            }, 100); // Delay para a animação de opacidade
        }, 500); // Aparece após a transição da cor

        // Passo 3: Adiciona a barra de carregamento
        setTimeout(() => {
            const loadingBarContainer = document.createElement('div');
            loadingBarContainer.style.width = '80%';
            loadingBarContainer.style.height = '10px';
            loadingBarContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            loadingBarContainer.style.borderRadius = '5px';
            loadingBarContainer.style.overflow = 'hidden';

            const loadingBar = document.createElement('div');
            loadingBar.style.width = '0%';
            loadingBar.style.height = '100%';
            loadingBar.style.backgroundColor = '#1db954';
            loadingBar.style.transition = 'width 2s ease';

            loadingBarContainer.appendChild(loadingBar);
            loadingScreen.appendChild(loadingBarContainer);

            // Anima a barra de carregamento
            setTimeout(() => {
                loadingBar.style.width = '100%';
            }, 100);
        }, 2500); // Aparece após o texto

        // Passo 4: Remove a tela após a animação e recarrega a página
        setTimeout(() => {
            setTimeout(() => {
                location.reload();
            }, 500); // Espera o fade-out antes do reload
        }, 5000); // Tempo total de exibição antes do reload
    }

    function saveLargeFileToDB(name, data, type) {
        const transaction = db.transaction(['playlist'], 'readwrite');
        const store = transaction.objectStore('playlist');
        const groupIndex = store.index('group');

        // Verifica o número de itens no grupo atual
        const countRequest = groupIndex.count(currentGroup);

        countRequest.onsuccess = () => {
            const itemCount = countRequest.result;

            if (itemCount >= 15) {
                console.log(`O grupo "${currentGroup}" já atingiu o limite de 15 itens.`);
                return; // Não insere o item
            }

            // Se ainda houver espaço, salva o item
            const media = {
                name: name,
                data: data,
                type: type,
                group: currentGroup,
            };

            const addRequest = store.add(media);

            addRequest.onsuccess = (event) => {
                const id = event.target.result;

                // Cria a URL Blob para exibição
                media.url = URL.createObjectURL(new Blob([media.data], { type: media.type }));

                // Atualiza a interface
                addMediaToUI(media, id);
            };

            addRequest.onerror = (event) => {
                console.error('Erro ao salvar no IndexedDB:', event.target.error);
            };
        };

        countRequest.onerror = (event) => {
            console.error('Erro ao verificar contagem no grupo:', event.target.error);
        };
    }

    const largeFileUploadButton = document.getElementById('largeFileUploadButton');
    const largeFileInput = document.getElementById('largeFileInput');

    largeFileUploadButton.addEventListener('click', () => {
        largeFileInput.click();
    });

    largeFileInput.addEventListener('change', (e) => {
        if (!currentGroup) {
            alert('Por favor, crie ou selecione uma playlist antes de fazer o upload.');
            largeFileInput.value = ''; // Reseta o campo
            return;
        }

        if (!isGroupAvailable()) {
            alert(`O grupo "${currentGroup}" já atingiu o limite de 15 itens.`);
            return;
        }

        const file = e.target.files[0]; // Apenas o primeiro arquivo
        if (file) {
            handleLargeSingleFileUpload(file);
        }

        largeFileInput.value = ''; // Reseta o campo
    });

    let isUploadingLargeFile = false;

    function handleLargeSingleFileUpload(file) {
        if (isUploadingLargeFile) {
            alert('Já há um upload de arquivo grande em andamento. Aguarde até que termine.');
            return;
        }

        isUploadingLargeFile = true;

        const MAX_SIZE_MB = 110; // Limite de 110MB
        const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
        const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB por chunk

        if (file.size > MAX_SIZE_BYTES) {
            alert(`O arquivo "${file.name}" excede o limite de ${MAX_SIZE_MB} MB e não pode ser carregado.`);
            isUploadingLargeFile = false;
            return;
        }

        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        let currentChunk = 0;

        const uploadProgress = document.getElementById('uploadProgress');
        const fileProgress = document.createElement('div');

        // Configuração visual do progresso
        fileProgress.style.marginBottom = '10px';
        fileProgress.textContent = `Carregando "${file.name}": 0%`;

        uploadProgress.appendChild(fileProgress);
        uploadProgress.style.display = 'block';

        let chunks = [];

        function processNextChunk() {
            if (currentChunk >= totalChunks) {
                finalizeUpload();
                return;
            }

            const start = currentChunk * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, file.size);
            const chunk = file.slice(start, end);

            const reader = new FileReader();

            reader.onload = (event) => {
                chunks.push(new Uint8Array(event.target.result));
                currentChunk++;

                // Atualiza o progresso
                const progress = Math.round((currentChunk / totalChunks) * 100);
                fileProgress.firstChild.textContent = `Carregando "${file.name}": ${progress}%`;

                // Adiciona um pequeno atraso para evitar travamentos
                setTimeout(processNextChunk, 50);
            };

            reader.onerror = () => {
                fileProgress.textContent = `Erro ao carregar "${file.name}"`;
                console.error('Erro ao ler o arquivo.');
                isUploadingLargeFile = false;
            };

            reader.readAsArrayBuffer(chunk);
        }

        function finalizeUpload() {
            // Combina todos os chunks
            const finalData = new Uint8Array(
                chunks.reduce((acc, chunk) => acc + chunk.length, 0)
            );

            let offset = 0;
            chunks.forEach((chunk) => {
                finalData.set(chunk, offset);
                offset += chunk.length;
            });

            // Salva no IndexedDB
            saveLargeFileToDB(file.name, finalData, file.type);

            // Atualiza a interface para concluído
            fileProgress.firstChild.textContent = `Upload concluído: "${file.name}"`;

            setTimeout(() => {
                fileProgress.remove();
                if (!uploadProgress.children.length) {
                    uploadProgress.style.display = 'none';
                }
                isUploadingLargeFile = false;
                checkForReset();
            }, 2000);

            // Libera a memória
            chunks = null;
        }

        processNextChunk();
    }

    function isGroupAvailable() {
        const playlistElement = document.getElementById('playlist');
        const currentCount = playlistElement.children.length; // Conta os filhos diretos
        const availableSlots = 15 - currentCount;

        return availableSlots > 0; // Retorna true se houver espaço, false caso contrário
    }

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');

        // Verifica se há um grupo ativo
        if (!currentGroup) {
            alert('Por favor, crie ou selecione uma playlist antes de fazer o upload.');
            return;
        }

        if (!isGroupAvailable()) {
            alert(`O grupo "${currentGroup}" já atingiu o limite de 15 itens.`);
            return;
        }

        Array.from(e.dataTransfer.files)
            .filter(file => file.type.includes('video') || file.type.includes('audio'))
            .forEach(handleLargeFileUpload);
    });

    // Event Listeners para controles
    playPauseButton.addEventListener('click', () => {
        if (!mediaPlayer.src || mediaPlayer.src === '') {
            alert('Nenhuma mídia carregada para reproduzir.');
            return;
        }

        if (mediaPlayer.paused) {
            playMedia();
        } else {
            pauseMedia();
        }
        updatePlayPauseIcon();
    });

    stopButton.addEventListener('click', () => {
        mediaPlayer.pause();
        mediaPlayer.currentTime = 0;
        updatePlayPauseIcon();
    });

    prevButton.addEventListener('click', () => {
        if (playlist.children.length <= 1) return;
        currentPlaylistIndex = (currentPlaylistIndex - 1 + playlist.children.length) % playlist.children.length;
        loadMedia(currentPlaylistIndex);
        playMedia();
    });

    nextButton.addEventListener('click', () => {
        if (playlist.children.length <= 1) return;
        currentPlaylistIndex = (currentPlaylistIndex + 1) % playlist.children.length;
        loadMedia(currentPlaylistIndex);
        playMedia();
    });

    loopButton.addEventListener('click', () => {
        isLooping = !isLooping;
        mediaPlayer.loop = isLooping;
        loopButton.style.background = isLooping ? '#1db954' : '#333';
    });

    muteButton.addEventListener('click', () => {
        mediaPlayer.muted = !mediaPlayer.muted;
        updateMuteIcon();
    });

    volumeSlider.addEventListener('input', (e) => {
        mediaPlayer.volume = e.target.value / 100;
    });

    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;

        // Atualiza a barra de progresso imediatamente
        progressBar.style.width = `${pos * 100}%`;

        // Define o tempo atual do player
        mediaPlayer.currentTime = pos * mediaPlayer.duration;
    });

    let isDragging = false;

    progressContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateProgress(e);
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            updateProgress(e);
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
        }
    });

    function updateProgress(e) {
        const rect = progressContainer.getBoundingClientRect();
        const pos = Math.max(0, Math.min((e.clientX - rect.left) / rect.width, 1)); // Garante que fique entre 0 e 1

        // Atualiza a barra de progresso visualmente
        progressBar.style.width = `${pos * 100}%`;

        // Define o tempo atual do player
        mediaPlayer.currentTime = pos * mediaPlayer.duration;
    }

    mediaPlayer.addEventListener('timeupdate', () => {
        const progress = (mediaPlayer.currentTime / mediaPlayer.duration) * 100;
        progressBar.style.width = `${progress}%`;
        currentTimeDisplay.textContent = formatTime(mediaPlayer.currentTime);
    });

    mediaPlayer.addEventListener('loadedmetadata', () => {
        durationDisplay.textContent = formatTime(mediaPlayer.duration);
    });

    mediaPlayer.addEventListener('ended', () => {
        if (!isLooping) {
            if (currentPlaylistIndex < playlist.children.length - 1) {
                currentPlaylistIndex++;
                loadMedia(currentPlaylistIndex);
            } else {
                pauseMedia();
            }
        }
    });
});