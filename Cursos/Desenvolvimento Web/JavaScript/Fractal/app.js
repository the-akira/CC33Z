const canvas = document.getElementById('mandelbrotCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const status = document.getElementById('status');
const tooltip = document.getElementById('tooltip');
let animationId = null;
let animationFrameId = null; // Armazena o identificador da animação
let currentY = 0;
let isRunning = false;
let isColorAnimationRunning = false;
let isWaveAnimationRunning = false;
let isCircularDistortionRunning = false;
let distortionAmplitude; // Amplitude da distorção
let distortionFrequency; // Frequência da distorção
let zoomLevel = 1;
let currentFilter = 'none';
let isDragging = false;
let lastX = 0, lastY = 0;
let transitionProgress = 0; // Valor entre 0 (Mandelbrot) e 1 (Julia)
let isTransitioning = false;

// Configuração inicial da visualização
let viewPort = {
  xMin: -2,
  xMax: 0.5,
  yMin: -1.25,
  yMax: 1.25
};

const twilightColors = [
  [58, 76, 192],  // Azul escuro
  [59, 88, 217],  // Azul mais claro
  [110, 110, 255], // Azul elétrico
  [196, 176, 255], // Lilás claro
  [255, 209, 192], // Laranja claro
  [255, 154, 59],  // Laranja brilhante
  [255, 100, 0],   // Laranja escuro
  [192, 76, 58],   // Vermelho escuro
];

function interpolateColor(colors, t) {
  const numColors = colors.length;

  // Garantir que t esteja no intervalo [0, 1]
  const clampedT = Math.max(0, Math.min(t, 1));
  const scaledT = clampedT * (numColors - 1); // Escalar para o intervalo da paleta
  const i = Math.floor(scaledT); // Índice inferior
  const f = scaledT - i; // Fração entre os dois índices

  // Garante que o índice `i + 1` esteja dentro do intervalo válido
  const c1 = colors[i];
  const c2 = colors[Math.min(i + 1, numColors - 1)];

  // Verificar se as cores existem antes de tentar acessar
  if (!c1 || !c2) {
    console.error("Erro: Índices inválidos ao acessar o esquema de cores.");
    return [0, 0, 0, 255]; // Cor de fallback
  }

  return [
    Math.round(c1[0] * (1 - f) + c2[0] * f),
    Math.round(c1[1] * (1 - f) + c2[1] * f),
    Math.round(c1[2] * (1 - f) + c2[2] * f),
    255, // Opacidade
  ];
}

function getColor(iter, maxIter) {
  const scheme = document.getElementById('colorScheme').value;

  if (iter === maxIter) {
    return [0, 0, 0, 255]; // Cor do conjunto (fundo)
  }

  let color;
  const ratio = Math.log(iter) / Math.log(maxIter);

  switch (scheme) {
    case 'twilight': // Novo esquema de cores
      color = interpolateColor(twilightColors, ratio);
      break;
    case 'hsl': // HSL padrão
      const hue = (ratio * 360) % 360;
      color = hslToRgb(hue / 360, 0.8, 0.5);
      break;

    case 'blue-red': // Azul para Vermelho
      color = [ratio * 255, 0, (1 - ratio) * 255, 255];
      break;

    case 'grayscale': // Escala de Cinza
      const gray = Math.floor(ratio * 255);
      color = [gray, gray, gray, 255];
      break;

    case 'rgb-cycle': // Ciclo RGB
      const r = Math.floor(255 * Math.sin(ratio * Math.PI));
      const g = Math.floor(255 * Math.sin(ratio * Math.PI + (2 * Math.PI / 3)));
      const b = Math.floor(255 * Math.sin(ratio * Math.PI + (4 * Math.PI / 3)));
      color = [Math.abs(r), Math.abs(g), Math.abs(b), 255];
      break;

    case 'warm': // Cores Quentes
      color = [Math.min(255, ratio * 512), Math.min(255, ratio * 256), Math.max(0, 255 - ratio * 512), 255];
      break;

    default: // Caso padrão
      color = [0, 0, 0, 255];
      break;
  }

  return color;
}

function hslToRgb(h, s, l) {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [r * 255, g * 255, b * 255, 255];
}

document.getElementById('fractalMode').addEventListener('change', (e) => {
  const juliaControls = document.getElementById('juliaControls');
  if (e.target.value === 'julia') {
    juliaControls.style.display = 'block';
  } else {
    juliaControls.style.display = 'none';
  }
  resetView();
  updateQuality();
});

function applyJuliaPreset() {
  const preset = document.getElementById('juliaPresets').value;
  
  const presets = {
    default: { real: -0.8, imag: 0.156 },
    goldenRatio: { real: (1 - Math.sqrt(5)) / 2, imag: 0.1 },
    tree: { real: -0.70176, imag: -0.3842 },
    fibonacci: { real: 0.5, imag: Math.sqrt(5) / 10 },
    unitary: { real: -1, imag: 0 },
    spiral: { real: -0.835, imag: -0.2321 },
    feather: { real: -0.74543, imag: 0.11301 },
    web: { real: 0.355, imag: 0.355 },
    flower: { real: -0.4, imag: 0.6 },
    star: { real: -0.79, imag: 0.15 },
    treeFlowers: { real: 0.37, imag: -0.1 },
    leaves: { real: 0.3, imag: -0.5 },
    smoothWaves: { real: -0.8, imag: 0.156 },
    centered: { real: 0, imag: -0.8 },
    strongSwirl: { real: -0.4, imag: 0.4 },
    triangle: { real: 0.285, imag: 0 },
    largeCombination: { real: 0.6, imag: -0.6 },
    highComplexity: { real: -1.25, imag: 0.2 },
    smoothLinear: { real: 0.2, imag: 0.2 },
    explosiveVariation: { real: -0.75, imag: 0.2 },
    oscillator: { real: 0.285, imag: 0.01 },
  };

  if (presets[preset]) {
    document.getElementById('juliaReal').value = presets[preset].real;
    document.getElementById('juliaImag').value = presets[preset].imag;
  }
  updateQuality();
}

function calculatePoint(x0, y0, maxIter) {
  const mode = document.getElementById('fractalMode').value;
  let x, y, iter = 0;
  let escapeRadiusSquared = 4;
  let magnitude = 0;

  if (mode === 'mandelbrot') {
    x = 0;
    y = 0;
  } else if (mode === 'julia') {
    x = x0;
    y = y0;
    x0 = parseFloat(document.getElementById('juliaReal').value);
    y0 = parseFloat(document.getElementById('juliaImag').value);
  } else if (mode === 'burningShip') {
    x = 0; y = 0;
    while (x * x + y * y <= 4 && iter < maxIter) {
      const xTemp = x * x - y * y + x0;
      y = Math.abs(2 * x * y) + y0;
      x = Math.abs(xTemp);
      iter++;
    }
  }

  while ((magnitude = x * x + y * y) <= escapeRadiusSquared && iter < maxIter) {
    const xTemp = x * x - y * y + x0;
    y = 2 * x * y + y0;
    x = xTemp;
    iter++;
  }

  if (iter < maxIter) {
    const smooth = Math.log2(Math.log2(Math.sqrt(magnitude)));
    iter += 1 - smooth;
  }

  return iter;
}

function drawLines() {
  if (!isRunning) return false;
  
  const maxIter = parseInt(document.getElementById('maxIter').value);
  const speed = parseInt(document.getElementById('speed').value);
  const quality = parseFloat(document.getElementById('quality').value);
  const imageData = ctx.createImageData(canvas.width, speed);
  
  const scaledWidth = Math.floor(canvas.width * quality);
  const scaledHeight = Math.floor(canvas.height * quality);
  
  for (let y = 0; y < speed && currentY + y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const x0 = viewPort.xMin + (x / canvas.width) * (viewPort.xMax - viewPort.xMin);
      const y0 = viewPort.yMin + ((currentY + y) / canvas.height) * (viewPort.yMax - viewPort.yMin);
      
      const iter = calculatePoint(x0, y0, maxIter);
      const [r, g, b, a] = getColor(iter, maxIter);
      
      const offset = (y * canvas.width + x) * 4;
      imageData.data[offset] = r;
      imageData.data[offset + 1] = g;
      imageData.data[offset + 2] = b;
      imageData.data[offset + 3] = a;
    }
  }
  
  ctx.putImageData(imageData, 0, currentY);
  currentY += speed;
  
  return currentY < canvas.height;
}

function animate() {
  if (drawLines()) {
    disableSelect();
    status.textContent = `Renderizando: ${Math.round((currentY / canvas.height) * 100)}%`;
    animationId = requestAnimationFrame(animate);
  } else {
    isRunning = false;
    enableSelect();
    status.textContent = 'Concluído! Use o mouse para explorar (arraste para mover, scroll para zoom)';
  }
}

function startAnimation() {
  if (!isRunning) {
    isRunning = true;
    if (currentY >= canvas.height) {
      currentY = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    animate();
  }
}

function pauseAnimation() {
  isRunning = false;
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

function resetView() {
  stopColorAnimation();
  stopWaveAnimation();
  stopCircularDistortion();
  pauseAnimation();
  viewPort = {
    xMin: -2,
    xMax: 0.5,
    yMin: -1.25,
    yMax: 1.25
  };
  zoomLevel = 1;
  currentY = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  resetFilter();
  startAnimation();
}

function resetPosition() {
    viewPort = {
      xMin: -2,
      xMax: 0.5,
      yMin: -1.25,
      yMax: 1.25
    };
}

function resetZoomLevel() {
  zoomLevel = 1;
}

function updateQuality() {
  pauseAnimation();
  stopColorAnimation();
  stopWaveAnimation();
  stopCircularDistortion();
  currentY = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  startAnimation();
}

function applyFilter() {
  const filter = document.getElementById('filterSelect').value;
  currentFilter = filter; // Salvar o filtro atual

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  switch (filter) {
    case 'blur':
      applyBlur(data, canvas.width, canvas.height);
      break;

    case 'edge-detection':
      applyEdgeDetection(data, canvas.width, canvas.height);
      break;

    case 'gradient':
      applyDynamicGradient(data);
      break;

    default:
      resetView();
      return; // Nenhum filtro, retorna sem alterações
  }

  // Atualizar o canvas com o filtro aplicado
  ctx.putImageData(imageData, 0, 0);
}

function applyBlur(data, width, height) {
  const kernel = [
    1 / 9, 1 / 9, 1 / 9,
    1 / 9, 1 / 9, 1 / 9,
    1 / 9, 1 / 9, 1 / 9,
  ];
  applyConvolution(data, width, height, kernel);
}

function applyEdgeDetection(data, width, height) {
  const kernel = [
    -1, -1, -1,
    -1,  8, -1,
    -1, -1, -1,
  ];
  applyConvolution(data, width, height, kernel);
}

function applyDynamicGradient(data) {
  for (let i = 0; i < data.length; i += 4) {
    const intensity = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = intensity; // Vermelho
    data[i + 1] = 255 - intensity; // Verde
    data[i + 2] = Math.abs(128 - intensity); // Azul
  }
}

function applyConvolution(data, width, height, kernel) {
  const side = Math.sqrt(kernel.length);
  const half = Math.floor(side / 2);
  const output = new Uint8ClampedArray(data);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0;

      for (let ky = 0; ky < side; ky++) {
        for (let kx = 0; kx < side; kx++) {
          const px = x + kx - half;
          const py = y + ky - half;

          if (px >= 0 && px < width && py >= 0 && py < height) {
            const offset = (py * width + px) * 4;
            const weight = kernel[ky * side + kx];
            r += data[offset] * weight;
            g += data[offset + 1] * weight;
            b += data[offset + 2] * weight;
          }
        }
      }

      const offset = (y * width + x) * 4;
      output[offset] = Math.min(Math.max(r, 0), 255);
      output[offset + 1] = Math.min(Math.max(g, 0), 255);
      output[offset + 2] = Math.min(Math.max(b, 0), 255);
    }
  }

  data.set(output);
}

function resetFilter() {
  const filterSelect = document.getElementById('filterSelect');
  filterSelect.value = 'none'; // Define o valor padrão como "Nenhum"
}

function disableSelect() {
  const filterSelect = document.getElementById('filterSelect');
  filterSelect.disabled = true;
}

function enableSelect() {
  const filterSelect = document.getElementById('filterSelect');
  filterSelect.disabled = false;
}

function updateTooltip(e) {
  const rect = canvas.getBoundingClientRect();
  const x = (e.offsetX / canvas.width) * (viewPort.xMax - viewPort.xMin) + viewPort.xMin;
  const y = (e.offsetY / canvas.height) * (viewPort.yMax - viewPort.yMin) + viewPort.yMin;
  
  tooltip.style.left = `${e.clientX + 10}px`;
  tooltip.style.top = `${e.clientY + 10}px`;
  tooltip.textContent = `x: ${x.toFixed(6)}, y: ${y.toFixed(6)}, zoom: ${zoomLevel.toFixed(2)}x`;
}

function handleMouseDown(e) {
  isDragging = true;
  lastX = e.offsetX;
  lastY = e.offsetY;
  canvas.style.cursor = 'grabbing';
}

function handleMouseMove(e) {
  updateTooltip(e);
  
  if (isDragging) {
    const dx = (e.offsetX - lastX) / canvas.width * (viewPort.xMax - viewPort.xMin);
    const dy = (e.offsetY - lastY) / canvas.height * (viewPort.yMax - viewPort.yMin);
    
    viewPort.xMin -= dx;
    viewPort.xMax -= dx;
    viewPort.yMin -= dy;
    viewPort.yMax -= dy;
    
    lastX = e.offsetX;
    lastY = e.offsetY;
    
    pauseAnimation();
    currentY = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    startAnimation();
  }
}

function handleMouseUp() {
  isDragging = false;
  canvas.style.cursor = 'default';
  resetFilter();
  stopColorAnimation();
  stopWaveAnimation();
  stopCircularDistortion();
}

function handleMouseLeave() {
  isDragging = false;
  tooltip.style.display = 'none';
  canvas.style.cursor = 'default';
}

function handleMouseEnter() {
  tooltip.style.display = 'block';
  canvas.style.cursor = isDragging ? 'grabbing' : 'default';
}

function handleWheel(e) {
  e.preventDefault();
  stopColorAnimation();
  stopWaveAnimation();
  stopCircularDistortion();
  
  const mouseX = e.offsetX / canvas.width;
  const mouseY = e.offsetY / canvas.height;
  
  const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
  zoomLevel *= (1 / zoomFactor);
  
  const centerX = viewPort.xMin + mouseX * (viewPort.xMax - viewPort.xMin);
  const centerY = viewPort.yMin + mouseY * (viewPort.yMax - viewPort.yMin);
  
  const newWidth = (viewPort.xMax - viewPort.xMin) * zoomFactor;
  const newHeight = (viewPort.yMax - viewPort.yMin) * zoomFactor;
  
  viewPort.xMin = centerX - newWidth * mouseX;
  viewPort.xMax = centerX + newWidth * (1 - mouseX);
  viewPort.yMin = centerY - newHeight * mouseY;
  viewPort.yMax = centerY + newHeight * (1 - mouseY);
  
  pauseAnimation();
  currentY = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  resetFilter();
  startAnimation();
}

function exportImage() {
  const link = document.createElement('a');
  link.download = 'fractal.png';
  link.href = canvas.toDataURL();
  link.click();
}

function resizeCanvasToSelection() {
  const sizeOption = document.getElementById('canvasSize').value;

  const [width, height] = sizeOption.split('x').map(Number);
  canvas.width = width;
  canvas.height = height;

  resetView();
  startAnimation();
}

function lerp(start, end, t) {
  return start + (end - start) * t;
}

function calculatePointTransition(x0, y0, maxIter) {
  const mandelbrotX = 0;
  const mandelbrotY = 0;
  const juliaX = parseFloat(document.getElementById('juliaReal').value);
  const juliaY = parseFloat(document.getElementById('juliaImag').value);

  // Interpolação entre Mandelbrot e Julia
  let x = lerp(mandelbrotX, x0, transitionProgress);
  let y = lerp(mandelbrotY, y0, transitionProgress);

  let iter = 0;
  const escapeRadiusSquared = 4;

  while (x * x + y * y <= escapeRadiusSquared && iter < maxIter) {
    const xTemp = x * x - y * y + lerp(x0, juliaX, transitionProgress);
    y = 2 * x * y + lerp(y0, juliaY, transitionProgress);
    x = xTemp;
    iter++;
  }

  return iter;
}

function getTransitionColor(iter, maxIter) {
  // Interpolação de cores suave
  const startColor = [50, 50, 200]; // Cor inicial (ex.: azul)
  const endColor = [200, 50, 50];   // Cor final (ex.: vermelho)

  const ratio = iter / maxIter;
  const t = transitionProgress; // Progresso da transição

  // Interpolar entre as paletas
  return [
    Math.round(lerp(startColor[0], endColor[0], t) * ratio),
    Math.round(lerp(startColor[1], endColor[1], t) * ratio),
    Math.round(lerp(startColor[2], endColor[2], t) * ratio),
    255, // Opacidade
  ];
}

function renderTransition() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const maxIter = parseInt(document.getElementById('maxIter').value);
  const imageData = ctx.createImageData(canvas.width, canvas.height);

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const x0 = viewPort.xMin + (x / canvas.width) * (viewPort.xMax - viewPort.xMin);
      const y0 = viewPort.yMin + (y / canvas.height) * (viewPort.yMax - viewPort.yMin);

      // Usar a nova função de transição
      const iter = calculatePointTransition(x0, y0, maxIter);
      const [r, g, b, a] = getTransitionColor(iter, maxIter);

      const offset = (y * canvas.width + x) * 4;
      imageData.data[offset] = r;
      imageData.data[offset + 1] = g;
      imageData.data[offset + 2] = b;
      imageData.data[offset + 3] = a;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function renderFractal() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const maxIter = parseInt(document.getElementById('maxIter').value);
  const imageData = ctx.createImageData(canvas.width, canvas.height);

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const x0 = viewPort.xMin + (x / canvas.width) * (viewPort.xMax - viewPort.xMin);
      const y0 = viewPort.yMin + (y / canvas.height) * (viewPort.yMax - viewPort.yMin);

      const iter = calculatePoint(x0, y0, maxIter); // Usar a função padrão de cálculo
      const [r, g, b, a] = getColor(iter, maxIter);

      const offset = (y * canvas.width + x) * 4;
      imageData.data[offset] = r;
      imageData.data[offset + 1] = g;
      imageData.data[offset + 2] = b;
      imageData.data[offset + 3] = a;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function stopTransition() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId); // Cancela a animação
    animationFrameId = null; // Reseta o identificador
  }
  isTransitioning = false; // Indica que a transição foi interrompida

  // Opcional: Limpar a tela ou renderizar o fractal final
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  renderFractal(); // Renderiza o fractal estático após cancelar
  enableCanvasInteractions();
  enableButtonsByIds(['initBtn', 'pauseBtn', 'resetBtn', 'exportBtn', 
    'transitionBtn', 'infoBtn', 'playColorAnimationBtn', 
    'stopColorAnimationBtn', 'playWaveAnimationBtn', 'stopWaveAnimationBtn',
    'playCircularAnimationBtn', 'stopCircularAnimationBtn']);
}

function startTransition() {
  if (isTransitioning) return; // Evitar múltiplas animações
  isTransitioning = true;
  document.getElementById('maxIter').value = 100;

  const mode = document.getElementById('fractalMode').value;
  if (mode === 'julia' || mode === 'burningShip') {
    resetPosition();
    resetZoomLevel();
  }

  const duration = 20000; // Duração em milissegundos
  const startTime = performance.now();
  disableCanvasInteractions();
  disableButtonsByIds(['initBtn', 'pauseBtn', 'resetBtn', 'exportBtn', 
    'transitionBtn', 'infoBtn', 'playColorAnimationBtn', 
    'stopColorAnimationBtn', 'playWaveAnimationBtn', 'stopWaveAnimationBtn',
    'playCircularAnimationBtn', 'stopCircularAnimationBtn']);
  resetFilter();
  disableSelect();
  stopColorAnimation();
  stopWaveAnimation();
  stopCircularDistortion();

  function animateTransition(currentTime) {
    const elapsed = currentTime - startTime;
    transitionProgress = Math.min(elapsed / duration, 1); // Progresso da transição (0 a 1)

    // Renderizar a transição
    renderTransition();

    if (transitionProgress < 1) {
      animationFrameId = requestAnimationFrame(animateTransition);
    } else {
      isTransitioning = false;
      animationFrameId = null; // Limpa o identificador
      enableCanvasInteractions();
      enableButtonsByIds(['initBtn', 'pauseBtn', 'resetBtn', 'exportBtn', 
        'transitionBtn', 'infoBtn', 'playColorAnimationBtn', 
        'stopColorAnimationBtn', 'playWaveAnimationBtn', 'stopWaveAnimationBtn',
        'playCircularAnimationBtn', 'stopCircularAnimationBtn']);
      enableSelect();
    }
  }

  animationFrameId = requestAnimationFrame(animateTransition);
}

function disableCanvasInteractions() {
  canvas.removeEventListener('mousedown', handleMouseDown);
  canvas.removeEventListener('mousemove', handleMouseMove);
  canvas.removeEventListener('mouseup', handleMouseUp);
  canvas.removeEventListener('mouseleave', handleMouseLeave);
  canvas.removeEventListener('mouseenter', handleMouseEnter);
  canvas.removeEventListener('wheel', handleWheel);
}

function enableCanvasInteractions() {
  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseup', handleMouseUp);
  canvas.addEventListener('mouseleave', handleMouseLeave);
  canvas.addEventListener('mouseenter', handleMouseEnter);
  canvas.addEventListener('wheel', handleWheel);
}

// Função para desabilitar múltiplos botões por ID
function disableButtonsByIds(buttonIds) {
  buttonIds.forEach(buttonId => {
    const button = document.getElementById(buttonId);
    if (button) {
      button.disabled = true;
    }
  });
}

// Função para habilitar múltiplos botões por ID
function enableButtonsByIds(buttonIds) {
  buttonIds.forEach(buttonId => {
    const button = document.getElementById(buttonId);
    if (button) {
      button.disabled = false;
    }
  });
}

document.getElementById('infoBtn').addEventListener('click', () => {
  const modal = document.getElementById('infoModal');
  modal.style.display = 'block';
});

function closeModal() {
  const modal = document.getElementById('infoModal');
  modal.style.display = 'none';
}

window.addEventListener('click', (event) => {
  const modal = document.getElementById('infoModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

let colorShift = 0;
let lastUpdateTime = 0; // Timestamp do último quadro

function animateColorsSimple(timestamp) {
  const timeSinceLastFrame = timestamp - lastUpdateTime;

  // Atualiza apenas se mais de 100ms tiverem passado (10 quadros por segundo)
  if (timeSinceLastFrame > 350) {
    colorShift = (colorShift + 1) % 360; // Incrementa lentamente
    lastUpdateTime = timestamp;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const [h, s, l] = rgbToHsl(data[i], data[i + 1], data[i + 2]);
      const newHue = (h * 360 + colorShift) % 360;
      const [r, g, b] = hslToRgb(newHue / 360, s, l);

      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }

    ctx.putImageData(imageData, 0, 0);
  }

  // Continua a animação
  if (isColorAnimationRunning) requestAnimationFrame(animateColorsSimple);
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // Cinza
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h, s, l];
}

function startColorAnimation() {
  if (!isColorAnimationRunning) {
    isColorAnimationRunning = true;
    animateColorsSimple();
  }
}

function stopColorAnimation() {
  isColorAnimationRunning = false;
}

function animateWaves(timestamp) {
  const waveFrequency = 0.06; // Frequência das ondas
  const waveAmplitude = 1; // Amplitude mais intensa
  const phaseShift = timestamp * 0.007; // Movimento dinâmico com o tempo

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const index = (y * canvas.width + x) * 4;

      // Combinação de seno/cosseno para criar um efeito dinâmico
      const wave = Math.sin(x * waveFrequency + phaseShift) * waveAmplitude
                 + Math.cos(y * waveFrequency - phaseShift) * waveAmplitude;

      // Intensificar o efeito no RGB
      data[index] = Math.min(data[index] + wave, Math.floor(100 + Math.random() * 155));     // Red
      data[index + 1] = Math.min(data[index + 1] + wave, 255); // Green
      data[index + 2] = Math.min(data[index + 2] + wave, 255); // Blue
    }
  }

  ctx.putImageData(imageData, 0, 0);

  if (isWaveAnimationRunning) requestAnimationFrame(animateWaves);
}

function startWaveAnimation() {
  if (!isWaveAnimationRunning) {
    isWaveAnimationRunning = true;
    animateWaves(performance.now());
  }
}

function stopWaveAnimation() {
  isWaveAnimationRunning = false;
}

function animateCircularDistortion(timestamp) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const phaseShift = timestamp * 0.005; // Movimento dinâmico com o tempo
  const transparencyFactor = 0.35; // Controle da transparência (0 = invisível, 1 = total)

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const index = (y * canvas.width + x) * 4;

      // Calcular a distância do centro
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Aplicar uma distorção baseada em seno/cosseno
      const distortion = Math.sin(distance * distortionFrequency + phaseShift) * distortionAmplitude;

      // Misturar a distorção com os valores originais
      data[index] = Math.min(data[index] + distortion * transparencyFactor, 255); // Red
      data[index + 1] = Math.min(data[index + 1] + distortion * transparencyFactor, 255); // Green
      data[index + 2] = Math.min(data[index + 2] + distortion * transparencyFactor, 255); // Blue
    }
  }

  ctx.putImageData(imageData, 0, 0);

  if (isCircularDistortionRunning) requestAnimationFrame(animateCircularDistortion);
}

function startCircularDistortion() {
  if (!isCircularDistortionRunning) {
    // Gerar valores aleatórios para amplitude e frequência
    distortionAmplitude = 20 + Math.random() * 30; // Amplitude entre 20 e 50
    distortionFrequency = 0.01 + Math.random() * 0.02; // Frequência entre 0.01 e 0.03

    console.log(`Amplitude: ${distortionAmplitude.toFixed(2)}, Frequency: ${distortionFrequency.toFixed(3)}`);

    isCircularDistortionRunning = true;
    animateCircularDistortion(performance.now());
  }
}

function stopCircularDistortion() {
  isCircularDistortionRunning = false;
}

// Iniciar automaticamente
startAnimation();
enableCanvasInteractions();