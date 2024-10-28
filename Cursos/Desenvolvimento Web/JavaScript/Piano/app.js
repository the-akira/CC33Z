const altNames = {
    'C#2': 'Db2',
    'D#2': 'Eb2',
    'F#2': 'Gb2',
    'G#2': 'Ab2',
    'A#2': 'Bb2',
    'C#3': 'Db3',
    'D#3': 'Eb3',
    'F#3': 'Gb3',
    'G#3': 'Ab3',
    'A#3': 'Bb3',
    'C#4': 'Db4',
    'D#4': 'Eb4',
    'F#4': 'Gb4',
    'G#4': 'Ab4',
    'A#4': 'Bb4',
    'C#5': 'Db5',
    'D#5': 'Eb5',
    'F#5': 'Gb5',
    'G#5': 'Ab5',
    'A#5': 'Bb5',
    'C#6': 'Db6',
    'D#6': 'Eb6',
    'F#6': 'Gb6',
    'G#6': 'Ab6',
    'A#6': 'Bb6',
};

const notes = [
    'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2',  // Oitava 1
    'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',  // Oitava 2
    'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',  // Oitava 3
    'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',  // Oitava 4
    'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6', 'A6', 'A#6', 'B6',  // Oitava 5
    'C7',                                                                         // Oitava 6
];

const noteToSyllableMap = {
    'C': 'Do',
    'D': 'Re',
    'E': 'Mi',
    'F': 'Fa',
    'G': 'Sol',
    'A': 'La',
    'B': 'Si'
};

const keyToNoteMap = {
    '1': 'C2', 'shift+!': 'C#2', '2': 'D2', 'shift+@': 'D#2',
    '3': 'E2', '4': 'F2', 'shift+$': 'F#2', '5': 'G2', 'shift+%': 'G#2',
    '6': 'A2', 'shift+&': 'A#2', '7': 'B2', '8': 'C3', 'shift+*': 'C#3',
    '9': 'D3', 'shift+(': 'D#3', '0': 'E3', 'q': 'F3', 'shift+q': 'F#3',
    'w': 'G3', 'shift+w': 'G#3', 'e': 'A3', 'shift+e': 'A#3', 'r': 'B3',
    't': 'C4', 'shift+t': 'C#4', 'y': 'D4', 'shift+y': 'D#4', 'u': 'E4',
    'i': 'F4', 'shift+i': 'F#4', 'o': 'G4', 'shift+o': 'G#4', 'p': 'A4',
    'shift+p': 'A#4', 'a': 'B4', 's': 'C5', 'shift+s': 'C#5', 'd': 'D5',
    'shift+d': 'D#5', 'f': 'E5', 'g': 'F5', 'shift+g': 'F#5', 'h': 'G5',
    'shift+h': 'G#5', 'j': 'A5', 'shift+j': 'A#5', 'k': 'B5', 'l': 'C6',
    'shift+l': 'C#6', 'z': 'D6', 'shift+z': 'D#6', 'x': 'E6', 'c': 'F6',
    'shift+c': 'F#6', 'v': 'G6', 'shift+v': 'G#6', 'b': 'A6', 'shift+b': 
    'A#6', 'n': 'B6', 'm': 'C7'
};

const scaleMap = {
    'C_Major': ['C2','C3','C4','C5','C6','C7'], // Notas em C Major
    'A_minor': ['A2','A3','A4','A5','A6'], // Notas em A Minor
    'G_Major': ['F#2', 'G2', 'F#3', 'G3', 'F#4', 'G4', 'F#5', 'G5', 'F#6', 'G6'], // Notas em G Major, incluindo F#
    'E_minor': ['E2','F#2', 'E3', 'F#3', 'E4', 'F#4', 'E5', 'F#5', 'E6', 'F#6']
};

const metro = new Audio('sound/metro.mp3');
metro.loop = true; // Configura para rodar em loop

let isPlaying = false;
let recordingTimers = [];

function stopPlayback() {
    // Interrompe a reprodução
    isPlaying = false;

    // Limpa o destaque
    document.querySelectorAll('#melody-list span').forEach(span => {
        span.classList.remove('highlight-melody');
    });

    // Resetar a barra de progresso e esconder
    document.getElementById('progress-bar').style.width = '0%';
    document.getElementById('progress-container').style.display = 'none';
    recordingStatus.style.display = 'none';

    // Limpa todos os timers para parar imediatamente a execução
    recordingTimers.forEach(timerId => clearTimeout(timerId));
    recordingTimers = []; // Resetar a lista de timers

    // Reabilitar os controles da interface
    enablePianoKeys();
    document.getElementById('start-recording-btn').disabled = false;
    document.getElementById('stop-recording-btn').disabled = false;
    document.getElementById('play-recording-btn').disabled = false;
    document.getElementById('export-json-btn').disabled = false;
    document.getElementById('importButton').disabled = false;
    document.getElementById('play-music').disabled = false;
    document.getElementById('stop-playback-btn').disabled = true;
}

let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let bufferCache = {};  // Cache dos buffers de áudio
let gainNode = audioContext.createGain();  // Controle de volume
gainNode.connect(audioContext.destination);  // Conectar ao destino de áudio
let isAudioLoaded = false;

async function preloadAudioBuffers() {
    const loadPromises = notes.map(async (note) => {
        const actualNote = altNames[note] || note;
        const audioBuffer = await fetchAudioBuffer(`sound/${actualNote}.mp3`);
        bufferCache[note] = audioBuffer;
    });

    // Espera até que todas as promessas de carregamento sejam resolvidas
    await Promise.all(loadPromises);
    isAudioLoaded = true;  // Sinaliza que o carregamento foi concluído
    document.getElementById('piano-container').style.display = 'flex';
    document.getElementById('pianoMessage').style.display = 'none';
}

async function fetchAudioBuffer(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);
}

function playNoteAudio(note) {
    if (!isAudioLoaded) return;  // Se o áudio não foi carregado, ignora o toque

    const audioBuffer = bufferCache[note];
    if (!audioBuffer) {
        console.error(`Áudio para a nota ${note} não encontrado.`);
        return;
    }

    // Configura volume com controle da UI
    const volumeControl = document.getElementById('volume-control');
    gainNode.gain.value = parseFloat(volumeControl.value);

    // Criar e tocar a fonte de áudio
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(gainNode);
    source.start(0);

    // Exibe a última nota tocada
    document.getElementById('last-note').innerHTML = note;

    highlightKey(note);  // Destaca a tecla

    if (isRecording) {
        const timeElapsed = Date.now() - startTime;
        recording.push({ note: note, time: timeElapsed });
    }
}

window.addEventListener('load', () => {
    preloadAudioBuffers();
    document.getElementById('piano-container').style.display = 'none';
    document.getElementById('pianoMessage').style.display = 'block';
});

let recording = [];
let isRecording = false;
let startTime;

const recordingStatus = document.getElementById('recording-status');
const startRecordingBtn = document.getElementById('start-recording-btn');
const stopRecordingBtn = document.getElementById('stop-recording-btn');
const playRecordingBtn = document.getElementById('play-recording-btn');
stopRecordingBtn.disabled = true;

function startRecording() {
    recording = [];
    isRecording = true;
    startTime = Date.now();

    // Sinaliza na UI que está gravando
    recordingStatus.style.display = 'block';
    recordingStatus.textContent = 'Gravando...';
    startRecordingBtn.disabled = true;
    stopRecordingBtn.disabled = false;
    playRecordingBtn.disabled = true;
    document.getElementById('stop-playback-btn').disabled = true;
    document.getElementById('play-music').disabled = true;
    document.getElementById('export-json-btn').disabled = true;
    document.getElementById('importButton').disabled = true;

    console.log("Gravação iniciada...");
}

function stopRecording() {
    isRecording = false;

    // Sinaliza na UI que a gravação parou
    recordingStatus.style.display = 'none';
    startRecordingBtn.disabled = false;
    playRecordingBtn.disabled = false;
    document.getElementById('stop-playback-btn').disabled = false;
    document.getElementById('export-json-btn').disabled = false;
    document.getElementById('play-music').disabled = false;
    document.getElementById('importButton').disabled = false;

    console.log("Gravação finalizada:", recording);
}

function playRecording() {
    if (recording.length === 0) {
        alert("Nenhuma gravação disponível.");
        return;
    }

    isPlaying = true; // Iniciar reprodução
    const totalTime = recording[recording.length - 1].time;

    // Configuração inicial da interface
    recordingStatus.style.display = 'block';
    recordingStatus.textContent = 'Reproduzindo...';
    startRecordingBtn.disabled = true;
    stopRecordingBtn.disabled = true;
    playRecordingBtn.disabled = true;
    document.getElementById('export-json-btn').disabled = true;
    document.getElementById('importButton').disabled = true;
    document.getElementById('play-music').disabled = true;
    document.getElementById('stop-playback-btn').disabled = false;
    document.getElementById('progress-container').style.display = 'block';

    disablePianoKeys();

    recording.forEach((entry, index) => {
        const timerId = setTimeout(() => {
            if (!isPlaying) return; // Interrompe se a reprodução foi parada

            playNoteAudio(entry.note);

            // Atualiza a barra de progresso
            const elapsedTime = entry.time;
            const progressPercent = (elapsedTime / totalTime) * 100;
            document.getElementById('progress-bar').style.width = progressPercent + '%';

            // Se for a última nota e ainda estiver em execução
            if (index === recording.length - 1 && isPlaying) {
                setTimeout(stop, 500); // Chama stop para redefinir a interface após o fim da gravação
                recordingStatus.style.display = 'none';
                startRecordingBtn.disabled = false;
                playRecordingBtn.disabled = false;
                document.getElementById('export-json-btn').disabled = false;
                document.getElementById('importButton').disabled = false;
                document.getElementById('play-music').disabled = false;
                document.getElementById('stop-playback-btn').disabled = true;
                enablePianoKeys();

                // Esconder a barra de progresso
                document.getElementById('progress-container').style.display = 'none';
                document.getElementById('progress-bar').style.width = '0%';  // Resetar a barra de progresso
            }
        }, entry.time);

        // Armazena o ID do timer
        recordingTimers.push(timerId);
    });
}

function exportRecordingAsJSON() {
    if (recording.length === 0) {
        alert("Nenhuma gravação disponível para exportação.");
        return;
    }

    // Converte a gravação em JSON
    const recordingJSON = JSON.stringify(recording, null, 2);

    // Cria um blob com os dados JSON
    const blob = new Blob([recordingJSON], { type: 'application/json' });

    // Cria um link para download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'gravacao.json';

    // Adiciona e clica no link para iniciar o download
    document.body.appendChild(link);
    link.click();

    // Remove o link do DOM
    document.body.removeChild(link);
}

document.getElementById('importRecording').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Usando FileReader para ler o conteúdo do arquivo
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Verifica se o JSON tem o formato correto
            if (Array.isArray(importedData) && importedData.every(entry => entry.note && entry.time !== undefined)) {
                recording = importedData;  // Atualiza a gravação com o conteúdo importado
                alert("Gravação importada com sucesso!");
                updateMelodyList();  // Atualiza a lista de exibição se houver uma função para isso
            } else {
                alert("O arquivo JSON não está no formato correto.");
            }
        } catch (error) {
            console.error("Erro ao processar o arquivo JSON:", error);
            alert("Erro ao processar o arquivo. Verifique se ele está no formato JSON correto.");
        }

        // Reseta o valor do input para garantir que o evento "change" seja detectado na próxima vez
        event.target.value = '';
    };

    reader.readAsText(file);  // Lê o arquivo como texto
});

document.getElementById('importButton').addEventListener('click', () => {
    document.getElementById('importRecording').click();
});

startRecordingBtn.addEventListener('click', startRecording);
stopRecordingBtn.addEventListener('click', stopRecording);
playRecordingBtn.addEventListener('click', playRecording);
document.getElementById('export-json-btn').addEventListener('click', exportRecordingAsJSON);

function highlightKey(note) {
    const key = document.querySelector(`.key[data-note="${note}"]`);
    if (key) {
        key.classList.add('pressed');
        setTimeout(() => key.classList.remove('pressed'), 200);  // Remove o destaque após 200ms
    }
}

function createKey(note, isBlack) {
    const key = document.createElement('button');
    key.classList.add('key');
    if (isBlack) {
        key.classList.add('black');
    }

    key.setAttribute('data-note', note);
    key.addEventListener('click', () => playNoteAudio(note));  // Reproduz a nota ao clicar
    return key;
}

const pressedKeys = new Set(); // Conjunto para rastrear as teclas pressionadas

window.addEventListener('keydown', (event) => {
    const activeElement = document.activeElement;
    let key = event.key.toLowerCase();  // Captura a tecla pressionada em minúsculas

    // Adiciona Shift, Ctrl ou Alt como prefixo, se estiverem pressionados
    if (event.shiftKey) {
        key = 'shift+' + key;
    }

    // Se a tecla já estiver no conjunto, não executa a função novamente
    if (pressedKeys.has(key)) {
        return;
    }
    pressedKeys.add(key); // Marca a tecla como pressionada

    // Verifica se há uma nota mapeada para essa tecla e se o foco não está em um campo de input ou textarea
    const note = keyToNoteMap[key];
    if (note && activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
        playNoteAudio(note);  // Toca a nota mapeada
    }
});

// Libera a tecla ao soltar, permitindo que seja tocada novamente
window.addEventListener('keyup', (event) => {
    let key = event.key.toLowerCase();
    if (event.shiftKey) {
        key = 'shift+' + key;
    }
    pressedKeys.delete(key); // Remove a tecla do conjunto
});

const pianoContainer = document.getElementById('piano');

notes.forEach(note => {
    const isBlack = note.includes('#');  // Verifica se a nota é preta
    const key = createKey(note, isBlack);
    pianoContainer.appendChild(key);
});

async function playMusic(melody, delay) {
    // Iniciar reprodução
    isPlaying = true;

    // Desabilita os controles
    disablePianoKeys();
    document.getElementById('start-recording-btn').disabled = true;
    document.getElementById('stop-recording-btn').disabled = true;
    document.getElementById('play-recording-btn').disabled = true;
    document.getElementById('export-json-btn').disabled = true;
    document.getElementById('importButton').disabled = true;
    document.getElementById('play-music').disabled = true;
    document.getElementById('stop-playback-btn').disabled = false;

    for (let index = 0; index < melody.length && isPlaying; index++) {
        const element = melody[index];
        
        let currentSpan;
        if (Array.isArray(element)) {
            currentSpan = document.getElementById(`chord-${index}`);
        } else {
            currentSpan = document.getElementById(`note-${index}`);
        }

        // Remove o destaque de todos os outros spans
        document.querySelectorAll('#melody-list span').forEach(span => {
            span.classList.remove('highlight-melody');
        });

        // Adiciona o destaque ao item atual
        currentSpan.classList.add('highlight-melody');

        // Toca a nota ou acorde, se ainda estiver em execução
        if (Array.isArray(element)) {
            playChordAudio(element);
        } else {
            playNoteAudio(element);
        }
        
        // Aguardar o tempo de delay antes de tocar a próxima nota/acorde
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    stopPlayback(); // Limpa a interface após a reprodução completa
}

document.getElementById('show-shortcuts').addEventListener('change', (event) => {
    const showShortcuts = event.target.checked; // Verifica se a checkbox está marcada
    if (showShortcuts) {
        document.getElementById('show-notes').checked = false; // Desmarca a outra checkbox
        document.getElementById('show-scales').checked = false; 
        document.getElementById('show-syllables').checked = false;
    }
    updateKeyLabels(showShortcuts); // Atualiza a exibição das teclas
});

document.getElementById('show-notes').addEventListener('change', (event) => {
    const showNotes = event.target.checked; // Verifica se a checkbox está marcada
    if (showNotes) {
        document.getElementById('show-shortcuts').checked = false; // Desmarca a outra checkbox
        document.getElementById('show-scales').checked = false; 
        document.getElementById('show-syllables').checked = false;
    }
    updateNotesLabels(showNotes); // Atualiza a exibição das teclas
});

document.getElementById('scale-selector').addEventListener('change', (event) => {
    const selectedScale = event.target.value; // Valor da escala selecionada
    if (selectedScale) {
        highlightScale(selectedScale); // Função para destacar as notas da escala
    }
});

document.getElementById('play-audio').addEventListener('change', (event) => {
    if (event.target.checked) {
        metro.play(); // Toca o áudio em loop
    } else {
        metro.pause(); // Pausa o áudio
        metro.currentTime = 0; // Reseta o tempo para o início
    }
});

function highlightScale(scale) {
    const keys = document.querySelectorAll('.key'); // Seleciona todas as teclas
    const keysCircles = document.querySelectorAll('.key-circle');
    const notesInScale = scaleMap[scale]; // Notas correspondentes à escala selecionada
    
    keys.forEach(key => {
        const note = key.getAttribute('data-note'); // Nota da tecla
        if (notesInScale.includes(note) && key.firstChild) {
            key.firstChild.classList.add('highlight'); // Adiciona destaque se a nota fizer parte da escala
        } else if (key.firstChild) {
            key.firstChild.classList.remove('highlight'); // Remove o destaque se a nota não fizer parte da escala
        }
    });
}

document.getElementById('show-scales').addEventListener('change', (event) => {
    const showScales = event.target.checked;
    document.getElementById('show-notes').checked = false;
    document.getElementById('show-shortcuts').checked = false;
    document.getElementById('show-syllables').checked = false;
    updateKeyLabels(false);
    updateScaleCircles(showScales);

    const dropdown = document.getElementById('scale-selector');
    const selectedValue = dropdown.value; // Obtém o valor atual selecionado
    if (showScales) {
        highlightScale(selectedValue);
    }
});

function updateScaleCircles(showScales) {
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        let circle = key.querySelector('.key-circle');
        
        if (!circle && showScales) {
            // Cria o círculo se ele ainda não existir e a opção for marcada
            circle = document.createElement('div');
            circle.classList.add('key-circle'); // Usa classes para gradientes de cor
            key.appendChild(circle); // Adiciona o círculo à tecla
        } else if (circle && !showScales) {
            // Remove o círculo se a opção for desmarcada
            key.removeChild(circle);
        }
    });
}

document.getElementById('show-syllables').addEventListener('change', (event) => {
    const showSyllables = event.target.checked; // Verifica se a checkbox está marcada
    if (showSyllables) {
        document.getElementById('show-notes').checked = false;  // Desmarca outras checkboxes
        document.getElementById('show-shortcuts').checked = false;
        document.getElementById('show-scales').checked = false;
    }
    updateSyllablesLabels(showSyllables); // Atualiza a exibição das sílabas
});

function updateSyllablesLabels(showSyllables) {
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        const note = key.getAttribute('data-note').replace(/[0-9]/g, ''); // Extrai a nota
        const syllable = noteToSyllableMap[note]; // Obtém a sílaba correspondente
        if (showSyllables && syllable) {
            key.textContent = syllable; // Exibe a sílaba
        } else {
            key.textContent = ''; // Remove o texto se não estiver exibindo sílabas
        }
    });
}

function updateKeyLabels(showShortcuts) {
    const keys = document.querySelectorAll('.key');
    const specialCharsMap = {
        'shift+': '⬆',
        '!': '1',
        '@': '2',
        '#': '3',
        '$': '4',
        '%': '5',
        '&': '7',
        '*': '8',
        '(': '9'
    };

    keys.forEach(key => {
        const note = key.getAttribute('data-note');
        if (showShortcuts) {
            const shortcut = Object.keys(keyToNoteMap).find(k => keyToNoteMap[k] === note);
            const displayShortcut = shortcut 
                ? shortcut.replace(/shift\+|[!@#$%&*()]/g, match => specialCharsMap[match] || match)
                : note;
            key.textContent = displayShortcut;
        } else {
            key.textContent = ''; // Limpa o conteúdo se o atalho não for exibido
        }
    });
}

function updateNotesLabels(showNotes) {
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        const note = key.getAttribute('data-note').replace(/[0-9]/g, '');;
        if (showNotes) {
            key.textContent = note; // Exibe o atalho com a seta para cima
        } else {
            key.textContent = ''; // Exibe a nota normalmente
        }
    });
}

function generateMelodyOptions() {
    const melodySelect = document.getElementById('note-select');
    const chordSelect = document.getElementById('chord-select');
    notes.forEach(note => {
        const optionMelody = document.createElement('option');
        const optionChord = document.createElement('option');
        optionMelody.value = note;
        optionMelody.textContent = note;
        optionChord.value = note;
        optionChord.textContent = note;
        melodySelect.appendChild(optionMelody);
        chordSelect.appendChild(optionChord);
    });
}

window.onload = generateMelodyOptions;

const melody = [];  // Array para armazenar as notas selecionadas

document.getElementById('add-note').addEventListener('click', () => {
    const noteSelect = document.getElementById('note-select');
    const selectedNote = noteSelect.value;
    
    melody.push(selectedNote);  // Adiciona a nota à melodia
    updateMelodyList();  // Atualiza a lista de notas exibida
});

document.getElementById('add-chord').addEventListener('click', () => {
    const noteSelect = document.getElementById('chord-select');
    const selectedNotes = Array.from(noteSelect.selectedOptions).map(option => option.value);

    if (selectedNotes.length > 0) {
        melody.push(selectedNotes);  // Adiciona o acorde à melodia
        updateMelodyList();  // Atualiza a lista de acordes exibida
    }
});

function updateMelodyList() {
    const melodyList = document.getElementById('melody-list');
    melodyList.innerHTML = '';  // Limpa a lista antes de atualizar

    if (melody.length <= 0) {
        melodyList.style.padding = '0px';
        document.getElementById('current-melody').style.display = 'none';
    } else {
        document.getElementById('current-melody').style.display = 'block';
    }

    melody.forEach((item, index) => {
        const span = document.createElement('span');

        // Verifica se o item é um acorde (array de notas) ou uma nota única
        if (Array.isArray(item)) {
            span.innerHTML = `<b>Acorde ${index + 1}:</b> ${item.join(', ')}`;
            span.id = `chord-${index}`;  // Define o ID do acorde baseado no índice
        } else {
            span.innerHTML = `<b>Nota ${index + 1}:</b> ${item}`;
            span.id = `note-${index}`;  // Define o ID da nota baseado no índice
        }

        // Adiciona um botão "Remover" para cada nota/acorde
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remover';
        removeButton.classList.add("remove-button");
        removeButton.addEventListener('click', () => {
            melody.splice(index, 1);  // Remove a nota/acorde pelo índice
            updateMelodyList();  // Atualiza a lista
        });

        span.appendChild(removeButton);
        melodyList.appendChild(span);
    });
}

function playChordAudio(chord) {
    const promises = chord.map(note => {
        const actualNote = altNames[note] || note;
        highlightKey(note);
        const audio = new Audio(`sound/${actualNote}.mp3`);
        audio.volume = document.getElementById('volume-control').value;  // Ajusta o volume de cada nota
        document.getElementById('last-note').innerHTML = note;
        return audio.play();  // Toca cada nota e retorna a promessa
    });

    // Garantir que todas as notas do acorde sejam tocadas ao mesmo tempo
    Promise.all(promises)
        .then(() => console.log('Acorde tocado com sucesso!'))
        .catch(error => console.error('Erro ao tocar acorde:', error));
}

document.getElementById('play-music').onclick = () => {
    // Pega o intervalo de tempo entre as notas
    const delay = parseInt(document.getElementById('delay-input').value, 10);
    
    // Toca a melodia com os parâmetros definidos
    if (melody.length > 0) {
        playMusic(melody, delay);
    } else {
        alert("Por favor, selecione ao menos uma nota ou acorde.");
    }
};

const chordSelect = document.getElementById('chord-select');

let expandTimeout;  // Variável para armazenar o timeout

chordSelect.addEventListener('mouseenter', () => {
    clearTimeout(expandTimeout);  // Limpa o timeout anterior
    expandTimeout = setTimeout(() => {
        chordSelect.classList.add('expanded');  // Adiciona a classe para expandir após 300ms
    }, 600);  // Ajuste o tempo conforme necessário
});

chordSelect.addEventListener('mouseleave', () => {
    clearTimeout(expandTimeout);  // Limpa o timeout anterior
    expandTimeout = setTimeout(() => {
        chordSelect.classList.remove('expanded');  // Remove a classe após 300ms
    }, 150);  // Ajuste o tempo conforme necessário
});

function disablePianoKeys() {
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        key.disabled = true;  // Desativa cada tecla
        key.classList.add('disabled');  // Adiciona uma classe para feedback visual (opcional)
    });
}

function enablePianoKeys() {
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        key.disabled = false;  // Ativa cada tecla
        key.classList.remove('disabled');  // Remove a classe de feedback visual (opcional)
    });
}