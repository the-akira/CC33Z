const canvas = document.getElementById('bookCanvas');
const ctx = canvas.getContext('2d');
const maxPageButtons = 5;
let currentPage = 0;

const pages = [
    { 
      title: "Title 1", 
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.", 
      image: "images/01.jpeg" 
    },
    { 
      title: "Title 2", 
      text: "Lorem Ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.", 
      image: "images/02.jpeg" 
    },
    { 
      title: "Title 3", 
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.", 
      image: "images/03.jpeg" 
    },
    { 
      title: "Title 4", 
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.", 
      image: "images/01.jpeg" 
    },
    { 
      title: "Title 5", 
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.", 
      image: "images/02.jpeg" 
    },
    { 
      title: "Title 6", 
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.", 
      image: "images/03.jpeg" 
    },
    { 
      title: "Title 7", 
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.", 
      image: "images/01.jpeg" 
    },
    { 
      title: "Title 8", 
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.", 
      image: "images/01.jpeg" 
    },
    { 
      title: "Title 9", 
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.", 
      image: "images/01.jpeg" 
    },
    { 
      title: "Title 10", 
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.", 
      image: "images/01.jpeg" 
    },
    { 
      title: "Title 11", 
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.", 
      image: "images/01.jpeg" 
    },
    { 
      title: "Title 12", 
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.", 
      image: "images/01.jpeg" 
    },
    { 
      title: "Title 13", 
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.", 
      image: "images/01.jpeg" 
    },
    { 
      title: "Title 14", 
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.", 
      image: "images/01.jpeg" 
    },
    { 
      title: "Title 15", 
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.", 
      image: "images/01.jpeg" 
    },
];

function drawPage(pageIndex) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const page = pages[pageIndex];

    ctx.fillStyle = '#04010d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the title
    ctx.fillStyle = '#FFF';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(page.title, canvas.width / 2, 50);

    // Draw the text
    ctx.font = '20px Arial';
    const lines = wrapText(page.text, canvas.width - 40, ctx);
    lines.forEach((line, i) => {
        ctx.fillText(line, canvas.width / 2, 100 + i * 30);
    });

    // Draw the image
    const img = new Image();
    img.onload = () => {
        // Calcular a posição da imagem no canvas
        const imgX = canvas.width / 2 - img.width / 2;
        const imgY = canvas.height / 2 - 41;

        // Desenhar a imagem
        ctx.drawImage(img, imgX, imgY);

        // Definir o estilo da borda (cor, espessura)
        ctx.strokeStyle = 'white'; // Cor da borda
        ctx.lineWidth = 1; // Espessura da borda

        // Desenhar a borda ao redor da imagem
        ctx.strokeRect(imgX, imgY, img.width, img.height);
    };
    img.src = page.image;

    updateControls();
}

function wrapText(text, maxWidth, context) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = context.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

function turnPage(direction) {
    if (direction === 'next' && currentPage < pages.length - 1) {
        currentPage++;
    } else if (direction === 'prev' && currentPage > 0) {
        currentPage--;
    }
    drawPage(currentPage);
}

function goToPage(pageIndex) {
    currentPage = pageIndex;
    drawPage(currentPage);
}

function updateControls() {
    document.getElementById('prevPage').disabled = currentPage === 0;
    document.getElementById('nextPage').disabled = currentPage === pages.length - 1;

    const pageButtons = document.getElementById('pageButtons');
    pageButtons.innerHTML = '';

    if (pages.length <= maxPageButtons) {
        // Se há menos páginas do que o número máximo de botões, exiba todos os botões
        pages.forEach((_, index) => {
            const button = document.createElement('button');
            button.innerText = index + 1;
            button.disabled = index === currentPage;
            button.addEventListener('click', () => goToPage(index));
            pageButtons.appendChild(button);
        });
    } else {
        // Caso contrário, mostre apenas as extremidades com um botão de "..."
        let startPage = Math.max(0, currentPage - Math.floor(maxPageButtons / 2));
        let endPage = Math.min(pages.length - 1, startPage + maxPageButtons - 1);

        if (endPage - startPage < maxPageButtons - 1) {
            startPage = Math.max(0, endPage - maxPageButtons + 1);
        }

        if (startPage > 0) {
            const firstButton = document.createElement('button');
            firstButton.innerText = '1';
            firstButton.addEventListener('click', () => goToPage(0));
            pageButtons.appendChild(firstButton);

            if (startPage > 1) {
                const ellipsisStart = document.createElement('button');
                ellipsisStart.innerText = '...';
                ellipsisStart.disabled = true;
                pageButtons.appendChild(ellipsisStart);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement('button');
            button.innerText = i + 1;
            button.disabled = i === currentPage;
            button.addEventListener('click', () => goToPage(i));
            pageButtons.appendChild(button);
        }

        if (endPage < pages.length - 1) {
            if (endPage < pages.length - 2) {
                const ellipsisEnd = document.createElement('button');
                ellipsisEnd.innerText = '...';
                ellipsisEnd.disabled = true;
                pageButtons.appendChild(ellipsisEnd);
            }

            const lastButton = document.createElement('button');
            lastButton.innerText = pages.length.toString();
            lastButton.addEventListener('click', () => goToPage(pages.length - 1));
            pageButtons.appendChild(lastButton);
        }
    }
}

document.getElementById('nextPage').addEventListener('click', () => turnPage('next'));
document.getElementById('prevPage').addEventListener('click', () => turnPage('prev'));

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        if (currentPage < pages.length - 1) {
            turnPage('next')
        }
    } else if (event.key === 'ArrowLeft') {
        if (currentPage > 0) {
            turnPage('prev')
        }
    }
});

drawPage(currentPage);