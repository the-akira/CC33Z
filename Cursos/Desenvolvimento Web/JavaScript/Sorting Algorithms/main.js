const barsContainer = document.getElementById('bars');
const algorithmSelect = document.getElementById('algorithm');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const stepButton = document.getElementById('step');
const stepBackButton = document.getElementById('step-back');
const resetButton = document.getElementById('reset');
const arrayContainer = document.getElementById('array');
const speedControl = document.getElementById('speed');
const progress = document.getElementById('progress');
const timeContainer = document.getElementById('time');
const explanationContainer = document.getElementById('explanation');
const submitManualArray = document.getElementById('submit-manual-array');

let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let array = [];
let animations = [];
let animationIndex = 0;
let running = false;
let intervalId = null;
let speed = 200;
let stateHistory = [];
let explanationHistory = [];

function startTimer() {
    if (!timerInterval) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            timeContainer.textContent = (elapsedTime / 1000).toFixed(2);
        }, 100);
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    elapsedTime = 0;
    timeContainer.textContent = '0.00';
}

function initBars() {
    const customArrayInput = document.getElementById('manual-input').value.trim();
    
    if (customArrayInput === '') {
        const numBars = parseInt(document.getElementById('num-bars').value);
        array = Array.from({ length: numBars }, () => Math.floor(Math.random() * 290) + 10);
    } else {
        array = customArrayInput.split(',')
                                .map(val => val.trim())
                                .filter(val => !isNaN(val) && val !== '' && val <= 250)
                                .map(val => parseInt(val));
    }

    animations = [];
    stateHistory = [];
    barsContainer.innerHTML = '';
    
    // Calcula o tamanho das barras com base no comprimento do array
    const barWidth = 800 / array.length - 2;
    
    array.forEach(value => {
        const bar = document.createElement('div');
        bar.style.height = `${value}px`;
        bar.style.width = `${barWidth}px`;
        bar.classList.add('bar');
        barsContainer.appendChild(bar);
    });
    
    updateArrayDisplay();
}

function renderBars() {
    const bars = document.getElementsByClassName('bar');
    
    for (let i = 0; i < array.length; i++) {
        bars[i].style.height = `${array[i]}px`;
    }
}

function updateArrayDisplay() {
    arrayContainer.textContent = `[ ${array.join(', ')} ]`;
}

function updateProgressBar() {
    progress.style.width = `${(animationIndex / animations.length) * 100}%`;
}

function heapSort(arr) {
    const animations = [];

    function heapify(arr, n, i) {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }

        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }

        if (largest !== i) {
            animations.push([i, largest, 'compare']);
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            animations.push([i, largest, 'swap']);
            heapify(arr, n, largest);
        }
    }

    function heapSortHelper(arr) {
        const n = arr.length;

        // Build a max heap
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            heapify(arr, n, i);
        }

        // Extract elements from heap one by one
        for (let i = n - 1; i > 0; i--) {
            // Move current root to end
            animations.push([0, i, 'swap']);
            [arr[0], arr[i]] = [arr[i], arr[0]];

            // Call max heapify on the reduced heap
            heapify(arr, i, 0);
        }

        // Mark all elements as sorted
        for (let i = 0; i < arr.length; i++) {
            animations.push([i, null, 'sorted']);
        }
    }

    heapSortHelper(arr.slice());

    return animations;
}

function bubbleSort(arr) {
    const animations = [];
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        let swapped = false;
        for (let j = 0; j < n - 1 - i; j++) {
            animations.push([j, j + 1, 'compare']);
            if (arr[j] > arr[j + 1]) {
                animations.push([j, j + 1, 'swap']);
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }
        if (!swapped) break;
    }
    for (let i = 0; i < n; i++) {
        animations.push([i, null, 'sorted']);
    }
    return animations;
}

function selectionSort(arr) {
    const animations = [];
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            animations.push([minIdx, j, 'compare']);
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            animations.push([i, minIdx, 'swap']);
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        }
    }
    for (let i = 0; i < n; i++) {
        animations.push([i, null, 'sorted']);
    }
    return animations;
}

function quickSort(arr) {
    const animations = [];
    function partition(low, high) {
        let pivot = arr[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            animations.push([j, high, 'compare']);
            if (arr[j] < pivot) {
                i++;
                animations.push([i, j, 'swap']);
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }
        animations.push([i + 1, high, 'swap']);
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        return i + 1;
    }

    function quickSortRecursive(low, high) {
        if (low < high) {
            let pi = partition(low, high);
            quickSortRecursive(low, pi - 1);
            quickSortRecursive(pi + 1, high);
        }
    }

    quickSortRecursive(0, arr.length - 1);
    for (let i = 0; i < arr.length; i++) {
        animations.push([i, null, 'sorted']);
    }
    return animations;
}

function mergeSort(arr) {
    const animations = [];
    if (arr.length < 2) return animations;

    function mergeSortRecursive(arr, aux, low, high) {
        if (low < high) {
            const mid = Math.floor((low + high) / 2);
            mergeSortRecursive(arr, aux, low, mid);
            mergeSortRecursive(arr, aux, mid + 1, high);
            merge(arr, aux, low, mid, high);
        }
    }

    function merge(arr, aux, low, mid, high) {
        for (let k = low; k <= high; k++) {
            aux[k] = arr[k];
        }

        let i = low;
        let j = mid + 1;
        let k = low;

        while (i <= mid && j <= high) {
            animations.push([i, j, 'compare']);
            if (aux[i] <= aux[j]) {
                animations.push([k, aux[i], 'overwrite']);
                arr[k++] = aux[i++];
            } else {
                animations.push([k, aux[j], 'overwrite']);
                arr[k++] = aux[j++];
            }
        }

        while (i <= mid) {
            animations.push([k, aux[i], 'overwrite']);
            arr[k++] = aux[i++];
        }

        while (j <= high) {
            animations.push([k, aux[j], 'overwrite']);
            arr[k++] = aux[j++];
        }
    }

    const aux = arr.slice();
    mergeSortRecursive(arr, aux, 0, arr.length - 1);
    for (let i = 0; i < arr.length; i++) {
        animations.push([i, null, 'sorted']);
    }
    return animations;
}

function insertionSort(arr) {
    const animations = [];
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            animations.push([j + 1, j, 'compare']);
            animations.push([j + 1, j, 'swap']);
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
    for (let i = 0; i < arr.length; i++) {
        animations.push([i, null, 'sorted']);
    }
    return animations;
}

function saveState() {
    stateHistory.push({
        array: array.slice(),
        animationIndex: animationIndex
    });
    explanationHistory.push(explanationContainer.textContent);
}

function restoreState() {
    if (stateHistory.length > 0) {
        const prevState = stateHistory.pop();
        array = prevState.array.slice();
        animationIndex = prevState.animationIndex;
        
        const prevExplanation = explanationHistory.pop();
        explanationContainer.textContent = prevExplanation;

        const bars = document.getElementsByClassName('bar');
        const barArray = Array.from(bars);

        // Encontra os índices dos elementos que estão marcados como "sorted"
        const sortedIndices = barArray.reduce((indices, bar, index) => {
            if (bar.classList.contains('sorted')) {
                indices.push(index);
            }
            return indices;
        }, []);

        // Remove o último índice dos elementos "sorted" se existir
        if (sortedIndices.length > 0) {
            const lastIndex = sortedIndices.pop();
            barArray[lastIndex].classList.remove('sorted');
        } else {
            // Se não houver elementos "sorted" para remover, restaura as comparações temporariamente
            const animation = animations[animationIndex - 1];
            if (animation && animation[2] === 'compare') {
                const [i, j] = animation;
                barArray[i].classList.add('comparing');
                barArray[j].classList.add('comparing');
                setTimeout(() => {
                    barArray[i].classList.remove('comparing');
                    barArray[j].classList.remove('comparing');
                }, speed);
            }
        }

        // Renderiza as barras com base no estado restaurado
        renderBars();
        updateArrayDisplay();
        updateProgressBar();
    }
}

function updateExplanation(message) {
    explanationContainer.textContent = message;
}

function startAnimation() {
    running = true;
    stepButton.disabled = true;
    stepBackButton.disabled = true;
    submitManualArray.disabled = true;
    startTimer();
    intervalId = setInterval(() => {
        if (animationIndex < animations.length) {
            saveState();
            const animation = animations[animationIndex];
            const bars = document.getElementsByClassName('bar');
            if (animation[2] === 'compare') {
                const [i, j] = animation;
                bars[i].classList.add('comparing');
                bars[j].classList.add('comparing');
                setTimeout(() => {
                    bars[i].classList.remove('comparing');
                    bars[j].classList.remove('comparing');
                }, speed);
                updateExplanation(`Comparando elementos nas posições ${i} e ${j}.`);
            } else if (animation[2] === 'swap') {
                const [i, j] = animation;
                const tempHeight = bars[i].style.height;
                bars[i].style.height = bars[j].style.height;
                bars[j].style.height = tempHeight;
                [array[i], array[j]] = [array[j], array[i]];
                bars[i].classList.add('highlight');
                bars[j].classList.add('highlight');
                setTimeout(() => {
                    bars[i].classList.remove('highlight');
                    bars[j].classList.remove('highlight');
                }, speed);
                updateExplanation(`Trocando elementos nas posições ${i} e ${j}.`);
            } else if (animation[2] === 'overwrite') {
                const [k, newHeight] = animation;
                bars[k].style.height = `${newHeight}px`;
                array[k] = newHeight;
                bars[k].classList.add('overwriting');
                setTimeout(() => {
                    bars[k].classList.remove('overwriting');
                }, speed);
                updateExplanation(`Substituindo o valor na posição ${k} pelo valor ${newHeight}.`);
            } else if (animation[2] === 'sorted') {
                const [i] = animation;
                bars[i].classList.add('sorted');
                updateExplanation(`Elemento na posição ${i} está ordenado.`);
            }
            updateArrayDisplay();
            animationIndex++;
            updateProgressBar();
        } else {
            clearInterval(intervalId);
            running = false;
            pauseTimer();
            updateProgressBar();
            updateExplanation('Ordenação concluída.');
            stepButton.disabled = false;
            stepBackButton.disabled = false;
            submitManualArray.disabled = false;
        }
    }, speed);
}

function pauseAnimation() {
    running = false;
    clearInterval(intervalId);
}

function stepAnimation() {
    if (animationIndex < animations.length) {
        saveState();
        const animation = animations[animationIndex];
        const bars = document.getElementsByClassName('bar');
        if (animation[2] === 'compare') {
            const [i, j] = animation;
            bars[i].classList.add('comparing');
            bars[j].classList.add('comparing');
            setTimeout(() => {
                bars[i].classList.remove('comparing');
                bars[j].classList.remove('comparing');
            }, speed);
            updateExplanation(`Comparando elementos nas posições ${i} e ${j}.`);
        } else if (animation[2] === 'swap') {
            const [i, j] = animation;
            const tempHeight = bars[i].style.height;
            bars[i].style.height = bars[j].style.height;
            bars[j].style.height = tempHeight;
            [array[i], array[j]] = [array[j], array[i]];
            bars[i].classList.add('highlight');
            bars[j].classList.add('highlight');
            setTimeout(() => {
                bars[i].classList.remove('highlight');
                bars[j].classList.remove('highlight');
            }, speed);
            updateExplanation(`Trocando elementos nas posições ${i} e ${j}.`);
        } else if (animation[2] === 'overwrite') {
            const [k, newHeight] = animation;
            bars[k].style.height = `${newHeight}px`;
            array[k] = newHeight;
            bars[k].classList.add('overwriting');
            setTimeout(() => {
                bars[k].classList.remove('overwriting');
            }, speed);
            updateExplanation(`Substituindo o valor na posição ${k} pelo valor ${newHeight}.`);
        } else if (animation[2] === 'sorted') {
            const [i] = animation;
            bars[i].classList.add('sorted');
            updateExplanation(`Elemento na posição ${i} está ordenado.`);
        }
        updateArrayDisplay();
        animationIndex++;
        updateProgressBar();
    } else {
        running = false;
        updateProgressBar();
        updateExplanation('Ordenação concluída.');
    }
}

function resetBars() {
    pauseAnimation();
    initBars();
    resetTimer();
    animationIndex = 0;
    const arrayCopy = array.slice();
    switch (algorithmSelect.value) {
        case 'bubble':
            animations = bubbleSort(arrayCopy);
            break;
        case 'selection':
            animations = selectionSort(arrayCopy);
            break;
        case 'quick':
            animations = quickSort(arrayCopy);
            break;
        case 'merge':
            animations = mergeSort(arrayCopy);
            break;
        case 'insertion':
            animations = insertionSort(arrayCopy);
            break;
        case 'heap':
            animations = heapSort(arrayCopy);
            break;
        default:
            animations = [];
            break;
    }
    updateArrayDisplay();
    updateProgressBar();
}

startButton.addEventListener('click', () => {
    if (!running) {
        startAnimation();
    }
});

pauseButton.addEventListener('click', () => {
    pauseAnimation();
    pauseTimer();
    stepButton.disabled = false;
    stepBackButton.disabled = false;
    submitManualArray.disabled = false;
});

stepButton.addEventListener('click', () => {
    if (!running) {
        stepAnimation();
    }
});

stepBackButton.addEventListener('click', () => {
    if (!running) {
        restoreState();
    }
});

resetButton.addEventListener('click', () => {
    document.getElementById('manual-input').value = null;
    resetBars();
    stepButton.disabled = false;
    stepBackButton.disabled = false;
    submitManualArray.disabled = false;
    explanationContainer.innerHTML = "Explicação";
});

algorithmSelect.addEventListener('change', resetBars);

speedControl.addEventListener('input', (event) => {
    speed = parseInt(event.target.value);
    if (running) {
        clearInterval(intervalId);
        startAnimation();
    }
});

document.getElementById('submit-manual-array').addEventListener('click', () => {
    initBars();
    resetBars();
});

window.onload = () => {
    resetBars();
    document.getElementById('num-bars').addEventListener('input', initBars);
    document.getElementById('num-bars').addEventListener('input', () => {
        let array = document.getElementById('manual-input').value
        document.getElementById('manual-input').value = null;
        resetBars();
        document.getElementById('manual-input').value = array;
    });
};

window.addEventListener('focus', () => {
    if (running) startTimer();
});

window.addEventListener('blur', pauseTimer);