// Dados dos produtos
const produtos = [
    {
        id: 1,
        nome: "Vaso Artesanal",
        descricao: "Vaso de cerâmica feito à mão",
        preco: 89.90,
        imagem: "images/products/vase.png",
        categoria: "Decoração",
        detalhes: {
            imagens: ["images/products/vase/vase1.png", "images/products/vase/vase2.png"],
            descricaoLonga: "Um vaso artesanal feito à mão com materiais de alta qualidade. Ideal para decoração moderna.",
            materiais: ["Cerâmica", "Esmalte"],
            dimensoes: "Altura: 30cm, Diâmetro: 15cm"
        }
    },
    {
        id: 2,
        nome: "Tapete Macramê",
        descricao: "Tapete decorativo em macramê",
        preco: 159.90,
        imagem: "images/products/tapete.png",
        categoria: "Têxtil",
        detalhes: {
            imagens: ["images/products/tapete/tapete1.png", "images/products/tapete/tapete2.png"],
            descricaoLonga: "Tapete feito à mão usando técnicas tradicionais de macramê. Traz aconchego e estilo ao ambiente.",
            materiais: ["Fibras Naturais"],
            dimensoes: "120cm x 80cm"
        }
    },
    {
        id: 3,
        nome: "Cesto Decorativo",
        descricao: "Cesto trançado em palha natural",
        preco: 79.90,
        imagem: "images/products/cesto.png",
        categoria: "Decoração",
        detalhes: {
            imagens: ["images/products/cesto/cesto1.png", "images/products/cesto/cesto2.png"],
            descricaoLonga: "Cesto trançado com palha natural, ideal para organização e decoração.",
            materiais: ["Palha Natural"],
            dimensoes: "Altura: 25cm, Diâmetro: 20cm"
        }
    },
    {
        id: 4,
        nome: "Mandala em Madeira",
        descricao: "Mandala entalhada em madeira",
        preco: 129.90,
        imagem: "images/products/mandala.png",
        categoria: "Arte",
        detalhes: {
            imagens: ["images/products/mandala/mandala1.png", "images/products/mandala/mandala2.png"],
            descricaoLonga: "Mandala entalhada à mão em madeira nobre. Perfeita para decoração de paredes.",
            materiais: ["Madeira Nobre"],
            dimensoes: "Diâmetro: 40cm"
        }
    },
    {
        id: 5,
        nome: "Quadro Decorativo",
        descricao: "Arte em string art",
        preco: 199.90,
        imagem: "images/products/quadro.png",
        categoria: "Arte",
        detalhes: {
            imagens: ["images/products/quadro/quadro1.png", "images/products/quadro/quadro2.png"],
            descricaoLonga: "Quadro decorativo feito com técnicas de string art, combinando design e criatividade.",
            materiais: ["Madeira", "Fios de Algodão"],
            dimensoes: "50cm x 40cm"
        }
    },
    {
        id: 6,
        nome: "Boneca de Pano",
        descricao: "Boneca artesanal em tecido",
        preco: 69.90,
        imagem: "images/products/boneca.png",
        categoria: "Brinquedos",
        detalhes: {
            imagens: ["images/products/boneca/boneca1.png", "images/products/boneca/boneca2.png"],
            descricaoLonga: "Boneca de pano feita à mão com detalhes delicados e materiais seguros para crianças.",
            materiais: ["Tecido de Algodão", "Fibra Sintética"],
            dimensoes: "Altura: 35cm"
        }
    },
    {
        id: 1,
        nome: "Vaso Artesanal",
        descricao: "Vaso de cerâmica feito à mão",
        preco: 89.90,
        imagem: "images/products/vase.png",
        categoria: "Decoração",
        detalhes: {
            imagens: ["images/products/vase/vase1.png", "images/products/vase/vase2.png"],
            descricaoLonga: "Um vaso artesanal feito à mão com materiais de alta qualidade. Ideal para decoração moderna.",
            materiais: ["Cerâmica", "Esmalte"],
            dimensoes: "Altura: 30cm, Diâmetro: 15cm"
        }
    },
    {
        id: 2,
        nome: "Tapete Macramê",
        descricao: "Tapete decorativo em macramê",
        preco: 159.90,
        imagem: "images/products/tapete.png",
        categoria: "Têxtil",
        detalhes: {
            imagens: ["images/products/tapete/tapete1.png", "images/products/tapete/tapete2.png"],
            descricaoLonga: "Tapete feito à mão usando técnicas tradicionais de macramê. Traz aconchego e estilo ao ambiente.",
            materiais: ["Fibras Naturais"],
            dimensoes: "120cm x 80cm"
        }
    },
    {
        id: 3,
        nome: "Cesto Decorativo",
        descricao: "Cesto trançado em palha natural",
        preco: 79.90,
        imagem: "images/products/cesto.png",
        categoria: "Decoração",
        detalhes: {
            imagens: ["images/products/cesto/cesto1.png", "images/products/cesto/cesto2.png"],
            descricaoLonga: "Cesto trançado com palha natural, ideal para organização e decoração.",
            materiais: ["Palha Natural"],
            dimensoes: "Altura: 25cm, Diâmetro: 20cm"
        }
    },
    {
        id: 4,
        nome: "Mandala em Madeira",
        descricao: "Mandala entalhada em madeira",
        preco: 129.90,
        imagem: "images/products/mandala.png",
        categoria: "Arte",
        detalhes: {
            imagens: ["images/products/mandala/mandala1.png", "images/products/mandala/mandala2.png"],
            descricaoLonga: "Mandala entalhada à mão em madeira nobre. Perfeita para decoração de paredes.",
            materiais: ["Madeira Nobre"],
            dimensoes: "Diâmetro: 40cm"
        }
    },
    {
        id: 5,
        nome: "Quadro Decorativo",
        descricao: "Arte em string art",
        preco: 199.90,
        imagem: "images/products/quadro.png",
        categoria: "Arte",
        detalhes: {
            imagens: ["images/products/quadro/quadro1.png", "images/products/quadro/quadro2.png"],
            descricaoLonga: "Quadro decorativo feito com técnicas de string art, combinando design e criatividade.",
            materiais: ["Madeira", "Fios de Algodão"],
            dimensoes: "50cm x 40cm"
        }
    },
    {
        id: 6,
        nome: "Boneca de Pano",
        descricao: "Boneca artesanal em tecido",
        preco: 69.90,
        imagem: "images/products/boneca.png",
        categoria: "Brinquedos",
        detalhes: {
            imagens: ["images/products/boneca/boneca1.png", "images/products/boneca/boneca2.png"],
            descricaoLonga: "Boneca de pano feita à mão com detalhes delicados e materiais seguros para crianças.",
            materiais: ["Tecido de Algodão", "Fibra Sintética"],
            dimensoes: "Altura: 35cm"
        }
    },
    {
        id: 1,
        nome: "Vaso Artesanal",
        descricao: "Vaso de cerâmica feito à mão",
        preco: 89.90,
        imagem: "images/products/vase.png",
        categoria: "Decoração",
        detalhes: {
            imagens: ["images/products/vase/vase1.png", "images/products/vase/vase2.png"],
            descricaoLonga: "Um vaso artesanal feito à mão com materiais de alta qualidade. Ideal para decoração moderna.",
            materiais: ["Cerâmica", "Esmalte"],
            dimensoes: "Altura: 30cm, Diâmetro: 15cm"
        }
    },
    {
        id: 2,
        nome: "Tapete Macramê",
        descricao: "Tapete decorativo em macramê",
        preco: 159.90,
        imagem: "images/products/tapete.png",
        categoria: "Têxtil",
        detalhes: {
            imagens: ["images/products/tapete/tapete1.png", "images/products/tapete/tapete2.png"],
            descricaoLonga: "Tapete feito à mão usando técnicas tradicionais de macramê. Traz aconchego e estilo ao ambiente.",
            materiais: ["Fibras Naturais"],
            dimensoes: "120cm x 80cm"
        }
    },
    {
        id: 3,
        nome: "Cesto Decorativo",
        descricao: "Cesto trançado em palha natural",
        preco: 79.90,
        imagem: "images/products/cesto.png",
        categoria: "Decoração",
        detalhes: {
            imagens: ["images/products/cesto/cesto1.png", "images/products/cesto/cesto2.png"],
            descricaoLonga: "Cesto trançado com palha natural, ideal para organização e decoração.",
            materiais: ["Palha Natural"],
            dimensoes: "Altura: 25cm, Diâmetro: 20cm"
        }
    },
    {
        id: 4,
        nome: "Mandala em Madeira",
        descricao: "Mandala entalhada em madeira",
        preco: 129.90,
        imagem: "images/products/mandala.png",
        categoria: "Arte",
        detalhes: {
            imagens: ["images/products/mandala/mandala1.png", "images/products/mandala/mandala2.png"],
            descricaoLonga: "Mandala entalhada à mão em madeira nobre. Perfeita para decoração de paredes.",
            materiais: ["Madeira Nobre"],
            dimensoes: "Diâmetro: 40cm"
        }
    },
    {
        id: 5,
        nome: "Quadro Decorativo",
        descricao: "Arte em string art",
        preco: 199.90,
        imagem: "images/products/quadro.png",
        categoria: "Arte",
        detalhes: {
            imagens: ["images/products/quadro/quadro1.png", "images/products/quadro/quadro2.png"],
            descricaoLonga: "Quadro decorativo feito com técnicas de string art, combinando design e criatividade.",
            materiais: ["Madeira", "Fios de Algodão"],
            dimensoes: "50cm x 40cm"
        }
    },
    {
        id: 6,
        nome: "Boneca de Pano",
        descricao: "Boneca artesanal em tecido",
        preco: 69.90,
        imagem: "images/products/boneca.png",
        categoria: "Brinquedos",
        detalhes: {
            imagens: ["images/products/boneca/boneca1.png", "images/products/boneca/boneca2.png"],
            descricaoLonga: "Boneca de pano feita à mão com detalhes delicados e materiais seguros para crianças.",
            materiais: ["Tecido de Algodão", "Fibra Sintética"],
            dimensoes: "Altura: 35cm"
        }
    },
    {
        id: 1,
        nome: "Vaso Artesanal",
        descricao: "Vaso de cerâmica feito à mão",
        preco: 89.90,
        imagem: "images/products/vase.png",
        categoria: "Decoração",
        detalhes: {
            imagens: ["images/products/vase/vase1.png", "images/products/vase/vase2.png"],
            descricaoLonga: "Um vaso artesanal feito à mão com materiais de alta qualidade. Ideal para decoração moderna.",
            materiais: ["Cerâmica", "Esmalte"],
            dimensoes: "Altura: 30cm, Diâmetro: 15cm"
        }
    },
    {
        id: 2,
        nome: "Tapete Macramê",
        descricao: "Tapete decorativo em macramê",
        preco: 159.90,
        imagem: "images/products/tapete.png",
        categoria: "Têxtil",
        detalhes: {
            imagens: ["images/products/tapete/tapete1.png", "images/products/tapete/tapete2.png"],
            descricaoLonga: "Tapete feito à mão usando técnicas tradicionais de macramê. Traz aconchego e estilo ao ambiente.",
            materiais: ["Fibras Naturais"],
            dimensoes: "120cm x 80cm"
        }
    },
    {
        id: 3,
        nome: "Cesto Decorativo",
        descricao: "Cesto trançado em palha natural",
        preco: 79.90,
        imagem: "images/products/cesto.png",
        categoria: "Decoração",
        detalhes: {
            imagens: ["images/products/cesto/cesto1.png", "images/products/cesto/cesto2.png"],
            descricaoLonga: "Cesto trançado com palha natural, ideal para organização e decoração.",
            materiais: ["Palha Natural"],
            dimensoes: "Altura: 25cm, Diâmetro: 20cm"
        }
    },
    {
        id: 4,
        nome: "Mandala em Madeira",
        descricao: "Mandala entalhada em madeira",
        preco: 129.90,
        imagem: "images/products/mandala.png",
        categoria: "Arte",
        detalhes: {
            imagens: ["images/products/mandala/mandala1.png", "images/products/mandala/mandala2.png"],
            descricaoLonga: "Mandala entalhada à mão em madeira nobre. Perfeita para decoração de paredes.",
            materiais: ["Madeira Nobre"],
            dimensoes: "Diâmetro: 40cm"
        }
    },
    {
        id: 5,
        nome: "Quadro Decorativo",
        descricao: "Arte em string art",
        preco: 199.90,
        imagem: "images/products/quadro.png",
        categoria: "Arte",
        detalhes: {
            imagens: ["images/products/quadro/quadro1.png", "images/products/quadro/quadro2.png"],
            descricaoLonga: "Quadro decorativo feito com técnicas de string art, combinando design e criatividade.",
            materiais: ["Madeira", "Fios de Algodão"],
            dimensoes: "50cm x 40cm"
        }
    },
    {
        id: 6,
        nome: "Boneca de Pano",
        descricao: "Boneca artesanal em tecido",
        preco: 69.90,
        imagem: "images/products/boneca.png",
        categoria: "Brinquedos",
        detalhes: {
            imagens: ["images/products/boneca/boneca1.png", "images/products/boneca/boneca2.png"],
            descricaoLonga: "Boneca de pano feita à mão com detalhes delicados e materiais seguros para crianças.",
            materiais: ["Tecido de Algodão", "Fibra Sintética"],
            dimensoes: "Altura: 35cm"
        }
    },
    {
        id: 1,
        nome: "Vaso Artesanal",
        descricao: "Vaso de cerâmica feito à mão",
        preco: 89.90,
        imagem: "images/products/vase.png",
        categoria: "Decoração",
        detalhes: {
            imagens: ["images/products/vase/vase1.png", "images/products/vase/vase2.png"],
            descricaoLonga: "Um vaso artesanal feito à mão com materiais de alta qualidade. Ideal para decoração moderna.",
            materiais: ["Cerâmica", "Esmalte"],
            dimensoes: "Altura: 30cm, Diâmetro: 15cm"
        }
    },
    {
        id: 2,
        nome: "Tapete Macramê",
        descricao: "Tapete decorativo em macramê",
        preco: 159.90,
        imagem: "images/products/tapete.png",
        categoria: "Têxtil",
        detalhes: {
            imagens: ["images/products/tapete/tapete1.png", "images/products/tapete/tapete2.png"],
            descricaoLonga: "Tapete feito à mão usando técnicas tradicionais de macramê. Traz aconchego e estilo ao ambiente.",
            materiais: ["Fibras Naturais"],
            dimensoes: "120cm x 80cm"
        }
    },
    {
        id: 3,
        nome: "Cesto Decorativo",
        descricao: "Cesto trançado em palha natural",
        preco: 79.90,
        imagem: "images/products/cesto.png",
        categoria: "Decoração",
        detalhes: {
            imagens: ["images/products/cesto/cesto1.png", "images/products/cesto/cesto2.png"],
            descricaoLonga: "Cesto trançado com palha natural, ideal para organização e decoração.",
            materiais: ["Palha Natural"],
            dimensoes: "Altura: 25cm, Diâmetro: 20cm"
        }
    },
    {
        id: 4,
        nome: "Mandala em Madeira",
        descricao: "Mandala entalhada em madeira",
        preco: 129.90,
        imagem: "images/products/mandala.png",
        categoria: "Arte",
        detalhes: {
            imagens: ["images/products/mandala/mandala1.png", "images/products/mandala/mandala2.png"],
            descricaoLonga: "Mandala entalhada à mão em madeira nobre. Perfeita para decoração de paredes.",
            materiais: ["Madeira Nobre"],
            dimensoes: "Diâmetro: 40cm"
        }
    },
    {
        id: 5,
        nome: "Quadro Decorativo",
        descricao: "Arte em string art",
        preco: 199.90,
        imagem: "images/products/quadro.png",
        categoria: "Arte",
        detalhes: {
            imagens: ["images/products/quadro/quadro1.png", "images/products/quadro/quadro2.png"],
            descricaoLonga: "Quadro decorativo feito com técnicas de string art, combinando design e criatividade.",
            materiais: ["Madeira", "Fios de Algodão"],
            dimensoes: "50cm x 40cm"
        }
    },
    {
        id: 6,
        nome: "Boneca de Pano",
        descricao: "Boneca artesanal em tecido",
        preco: 69.90,
        imagem: "images/products/boneca.png",
        categoria: "Brinquedos",
        detalhes: {
            imagens: ["images/products/boneca/boneca1.png", "images/products/boneca/boneca2.png"],
            descricaoLonga: "Boneca de pano feita à mão com detalhes delicados e materiais seguros para crianças.",
            materiais: ["Tecido de Algodão", "Fibra Sintética"],
            dimensoes: "Altura: 35cm"
        }
    },
];

// FAQ
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const icon = question.querySelector('.faq-icon');

        answer.classList.toggle('hidden');
        answer.classList.toggle('visible');

        // Alterna o ícone entre plus e minus
        if (answer.classList.contains('visible')) {
            icon.classList.remove('fa-plus');
            icon.classList.add('fa-minus');
        } else {
            icon.classList.remove('fa-minus');
            icon.classList.add('fa-plus');
        }
    });
});

// Carousel
const carousel = document.querySelector('.carousel-container');
const slides = document.querySelectorAll('.carousel-slide');
let currentSlide = 0;
let direction = 1;
let isHovered = false; // Variável para rastrear o estado do hover

// Adiciona eventos de hover para as imagens do carrossel
slides.forEach((slide) => {
    slide.addEventListener('mouseenter', () => {
        isHovered = true; // Pausa o movimento ao passar o mouse
    });

    slide.addEventListener('mouseleave', () => {
        isHovered = false; // Retoma o movimento ao remover o mouse
    });
});

function moveSlide() {
    // Não move o carrossel se o mouse estiver sobre uma imagem
    if (isHovered) return;

    // Atualiza o índice do slide atual
    currentSlide += direction;

    // Verifica se chegou ao final ou ao início
    if (currentSlide >= slides.length) {
        currentSlide = slides.length - 1; // Fica na última imagem
        direction = -1; // Muda a direção para voltar
    } else if (currentSlide < 0) {
        currentSlide = 0; // Fica na primeira imagem
        direction = 1; // Muda a direção para avançar
    }

    // Move o carrossel
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateButtonState();
}

function updateButtonState() {
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');

    prevButton.disabled = currentSlide === 0; // Desabilita o botão anterior no início
    nextButton.disabled = currentSlide === slides.length - 1; // Desabilita o botão próximo no final
}

// Inicia o movimento automático
setInterval(moveSlide, 5000);

// Adiciona eventos de clique para os botões
document.querySelector('.prev').addEventListener('click', () => {
    direction = -1; // Muda a direção para voltar
    moveSlide();
});

document.querySelector('.next').addEventListener('click', () => {
    direction = 1; // Muda a direção para avançar
    moveSlide();
});

// Modal
const modal = document.getElementById('imageModal');
const modalImg = modal.querySelector('img');

slides.forEach(slide => {
    slide.querySelector('img').addEventListener('click', (e) => {
        modal.style.display = 'flex';
        modalImg.src = e.target.src;
    });
});

modal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Paginação de produtos
const productsPerPage = 4;
let currentPage = 1;

function displayProducts(page) {
    const productsGrid = document.getElementById('productsGrid');
    const noProductsMessage = document.getElementById('noProductsMessage');
    const progressBar = document.getElementById('progressBar');
    const categoryFilter = document.getElementById('categoryFilter').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const priceSort = document.getElementById('priceSort').value;

    // Mostra a barra de progresso
    progressBar.classList.remove('hidden');
    progressBar.style.width = '0%';

    setTimeout(() => {
        progressBar.style.width = '100%';

        setTimeout(() => {
            let filteredProducts = produtos.filter(produto => {
                const matchesCategory = categoryFilter ? produto.categoria === categoryFilter : true;
                const matchesSearch = produto.nome.toLowerCase().includes(searchInput) || produto.descricao.toLowerCase().includes(searchInput);
                const matchesPrice = produto.preco <= parseFloat(document.getElementById('priceRange').value);
                return matchesCategory && matchesSearch && matchesPrice;
            });

            // Aplica a ordenação por preço
            if (priceSort === "asc") {
                filteredProducts = filteredProducts.sort((a, b) => a.preco - b.preco);
            } else if (priceSort === "desc") {
                filteredProducts = filteredProducts.sort((a, b) => b.preco - a.preco);
            }

            const start = (page - 1) * productsPerPage;
            const end = start + productsPerPage;
            const paginatedProducts = filteredProducts.slice(start, end);

            productsGrid.innerHTML = '';
            noProductsMessage.classList.add('hidden'); // Oculta a mensagem inicialmente

            if (paginatedProducts.length === 0) {
                noProductsMessage.classList.remove('hidden'); // Mostra a mensagem se não houver produtos
            } else {
                paginatedProducts.forEach(produto => {
                    productsGrid.innerHTML += `
                        <div class="product-card">
                            <img src="${produto.imagem}" alt="${produto.nome}">
                            <div class="product-info">
                                <h3>${produto.nome}</h3>
                                <p class="product-category">${produto.categoria}</p>
                                <p class="product-description">${produto.descricao}</p>
                                <p class="product-price">R$ ${produto.preco.toFixed(2)}</p>
                                <button class="details-button" data-id="${produto.id}">Ver Detalhes</button>
                            </div>
                        </div>
                    `;
                });
            }

            updatePagination(page, filteredProducts.length);

            addProductImageClickEvents();
            addProductImageModalClickEvents();

            // Oculta a barra de progresso
            progressBar.classList.add('hidden');
        }, 500); // Simula o tempo de carregamento
    }, 100);
}

function addProductImageModalClickEvents() {
    document.querySelectorAll(".details-button").forEach(button => {
        button.addEventListener("click", (event) => {
            const productId = event.target.getAttribute("data-id");
            const produto = produtos.find(p => p.id == productId);

            if (produto) {
                document.getElementById("modalTitleProduct").textContent = produto.nome;
                document.getElementById("modalDescription").innerHTML = `<b>Descrição:</b> ${produto.detalhes.descricaoLonga}`;

                const modalImages = document.getElementById("modalImages");
                modalImages.innerHTML = produto.detalhes.imagens
                    .map(img => `<img src="${img}" alt="${produto.nome}" class="modal-image">`)
                    .join("");

                const modalDetails = document.getElementById("modalDetails");
                modalDetails.innerHTML = `
                    <li><b>Materiais:</b> ${produto.detalhes.materiais.join(", ")}</li>
                    <li><b>Dimensões:</b> ${produto.detalhes.dimensoes}</li>
                `;

                document.getElementById("productModal").style.display = "flex";
            }
        });
    });

    document.querySelector(".close-button").addEventListener("click", () => {
        document.getElementById("productModal").style.display = "none";
    });
}

const productModal = document.getElementById("productModal");

productModal.addEventListener('click', () => {
    productModal.style.display = 'none';
});

function addProductImageClickEvents() {
    const productImages = document.querySelectorAll('.product-card img');
    productImages.forEach(img => {
        img.addEventListener('click', (e) => {
            modal.style.display = 'flex';
            modalImg.src = e.target.src;
        });
    });
}

function updatePagination(currentPage, totalProducts) {
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    if (totalPages <= 1) {
        pagination.classList.add('hidden'); // Oculta a paginação se houver apenas uma página
        return;
    }

    pagination.classList.remove('hidden'); // Mostra a paginação
    const createButton = (page, isActive = false, isDots = false) => {
        const button = document.createElement('button');
        if (isDots) {
            button.textContent = '...';
            button.disabled = true;
            button.className = 'dots';
        } else {
            button.textContent = page;
            button.className = isActive ? 'active' : '';
            button.addEventListener('click', () => displayProducts(page));
        }
        pagination.appendChild(button);
    };

    // Sempre mostra a primeira página
    createButton(1, currentPage === 1);

    // Reticências antes do bloco do meio
    if (currentPage > 3) createButton(null, false, true);

    // Exibe até 3 páginas antes e depois da página atual
    for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
        createButton(i, i === currentPage);
    }

    // Reticências depois do bloco do meio
    if (currentPage < totalPages - 2) createButton(null, false, true);

    // Sempre mostra a última página
    createButton(totalPages, currentPage === totalPages);
}

const searchInput = document.getElementById('searchInput');

if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.onresult = (event) => {
        searchInput.value = event.results[0][0].transcript;
        displayProducts(1); // Atualiza a exibição dos produtos com base na busca
    };

    const voiceSearchBtn = document.createElement('button');
    voiceSearchBtn.innerHTML = '<i title="Pesquisar com Comando de Voz" class="fa-solid fa-microphone"></i>';
    voiceSearchBtn.classList.add("voice-search");
    voiceSearchBtn.addEventListener('click', () => recognition.start());
    document.getElementById('search').appendChild(voiceSearchBtn);
}

document.getElementById('categoryFilter').addEventListener('change', () => {
    displayProducts(1);
});

let debounceTimeout;

document.getElementById('searchInput').addEventListener('input', () => {
    // Limpa o timeout anterior se o usuário continuar digitando rapidamente
    clearTimeout(debounceTimeout);
    
    // Configura o timeout para chamar a função displayProducts após 300ms
    debounceTimeout = setTimeout(() => {
        displayProducts(1);  // Chama a função para atualizar os produtos
    }, 300);  // Ajuste o tempo conforme necessário
});

document.getElementById('priceSort').addEventListener('change', () => {
    displayProducts(1); // Recarrega os produtos com base na nova ordenação
});

document.getElementById('priceRange').addEventListener('input', (e) => {
    const value = e.target.value;
    document.getElementById('priceValue').textContent = `Até R$ ${value}`;
    displayProducts(1); // Atualiza os produtos exibidos
});

// Inicialização
displayProducts(1);

document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault(); // Previne o comportamento padrão do link
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        // Rolagem suave
        targetSection.scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const posts = [
    {
        id: 1,
        titulo: "Como começar no artesanato",
        conteudo: "Aprenda os primeiros passos para criar peças incríveis.",
        categoria: "Dicas",
        imagem: "images/blog/post1.png",
        paragrafos: [
            "Artesanato é uma arte que exige dedicação e criatividade.",
            "Você pode começar com materiais simples, como papel, tecido ou madeira.",
            "Busque inspiração em tutoriais online ou visite feiras de artesanato."
        ]
    },
    {
        id: 2,
        titulo: "5 técnicas de macramê",
        conteudo: "Descubra técnicas avançadas de macramê para suas criações.",
        categoria: "Tutoriais",
        imagem: "images/blog/post2.png",
        paragrafos: [
            "O macramê é uma técnica de nós que permite criar peças decorativas incríveis.",
            "Explore variações como o nó quadrado, espiral e festonê.",
            "Experimente usar fios de diferentes cores para resultados únicos.",
            "O macramê é uma técnica de nós que permite criar peças decorativas incríveis.",
            "Explore variações como o nó quadrado, espiral e festonê.",
            "Experimente usar fios de diferentes cores para resultados únicos.",
            "O macramê é uma técnica de nós que permite criar peças decorativas incríveis.",
            "Explore variações como o nó quadrado, espiral e festonê.",
            "Experimente usar fios de diferentes cores para resultados únicos.",
            "O macramê é uma técnica de nós que permite criar peças decorativas incríveis.",
            "Explore variações como o nó quadrado, espiral e festonê.",
            "Experimente usar fios de diferentes cores para resultados únicos.",
        ]
    },
    {
        id: 3,
        titulo: "História do artesanato brasileiro",
        conteudo: "Explore a rica história do artesanato no Brasil.",
        categoria: "Histórias",
        imagem: "images/blog/post3.png",
        paragrafos: [
            "O artesanato brasileiro reflete a diversidade cultural de nosso país.",
            "Cada região do Brasil possui técnicas e estilos únicos, como o barro no nordeste e o bordado no sul.",
            "Preservar o artesanato é uma forma de valorizar a nossa cultura e tradição."
        ]
    },
    {
        id: 4,
        titulo: "Decoração com peças artesanais",
        conteudo: "Dicas para decorar sua casa com produtos artesanais.",
        categoria: "Dicas",
        imagem: "images/blog/post4.png",
        paragrafos: [
            "Peças artesanais trazem autenticidade e charme para a decoração da sua casa.",
            "Combine diferentes materiais, como madeira, cerâmica e tecido, para criar um ambiente acolhedor.",
            "Priorize peças feitas à mão para apoiar artistas locais e dar um toque único à sua casa."
        ]
    },
    {
        id: 5,
        titulo: "Artesanato sustentável: reaproveitando materiais",
        conteudo: "Descubra como criar peças incríveis usando materiais reciclados.",
        categoria: "Sustentabilidade",
        imagem: "images/blog/post5.png",
        paragrafos: [
            "Reaproveitar materiais é uma maneira criativa de contribuir para o meio ambiente.",
            "Com garrafas plásticas, você pode criar vasos, luminárias e até brinquedos.",
            "Explore técnicas como pintura, colagem e corte para transformar lixo em arte."
        ]
    },
    {
        id: 6,
        titulo: "Tendências de artesanato para 2025",
        conteudo: "Confira as principais tendências no mundo do artesanato para o próximo ano.",
        categoria: "Tendências",
        imagem: "images/blog/post6.png",
        paragrafos: [
            "Peças minimalistas e com tons neutros estão em alta.",
            "O uso de materiais naturais, como algodão orgânico e bambu, é uma forte tendência.",
            "Customização e personalização de peças continuam sendo uma das preferências do público."
        ]
    },
    {
        id: 7,
        titulo: "Os benefícios terapêuticos do artesanato",
        conteudo: "Descubra como o artesanato pode ajudar a relaxar e melhorar sua saúde mental.",
        categoria: "Bem-Estar",
        imagem: "images/blog/post7.png",
        paragrafos: [
            "Fazer artesanato é uma atividade relaxante que reduz o estresse.",
            "A concentração necessária para criar peças ajuda a mente a focar no presente.",
            "Além disso, concluir um projeto artesanal gera um sentimento de conquista e satisfação."
        ]
    },
    {
        id: 8,
        titulo: "10 ideias de presentes artesanais",
        conteudo: "Inspire-se com essas ideias únicas e criativas de presentes feitos à mão.",
        categoria: "Inspiração",
        imagem: "images/blog/post8.png",
        paragrafos: [
            "Porta-retratos personalizados com materiais reciclados são uma ótima opção.",
            "Velas aromáticas feitas à mão são presentes charmosos e fáceis de fazer.",
            "Outras ideias incluem sabonetes artesanais, quadros decorativos e bolsas de tecido."
        ]
    },
    {
        id: 1,
        titulo: "Como começar no artesanato",
        conteudo: "Aprenda os primeiros passos para criar peças incríveis.",
        categoria: "Dicas",
        imagem: "images/blog/post1.png",
        paragrafos: [
            "Artesanato é uma arte que exige dedicação e criatividade.",
            "Você pode começar com materiais simples, como papel, tecido ou madeira.",
            "Busque inspiração em tutoriais online ou visite feiras de artesanato."
        ]
    },
    {
        id: 2,
        titulo: "5 técnicas de macramê",
        conteudo: "Descubra técnicas avançadas de macramê para suas criações.",
        categoria: "Tutoriais",
        imagem: "images/blog/post2.png",
        paragrafos: [
            "O macramê é uma técnica de nós que permite criar peças decorativas incríveis.",
            "Explore variações como o nó quadrado, espiral e festonê.",
            "Experimente usar fios de diferentes cores para resultados únicos.",
            "O macramê é uma técnica de nós que permite criar peças decorativas incríveis.",
            "Explore variações como o nó quadrado, espiral e festonê.",
            "Experimente usar fios de diferentes cores para resultados únicos.",
            "O macramê é uma técnica de nós que permite criar peças decorativas incríveis.",
            "Explore variações como o nó quadrado, espiral e festonê.",
            "Experimente usar fios de diferentes cores para resultados únicos.",
            "O macramê é uma técnica de nós que permite criar peças decorativas incríveis.",
            "Explore variações como o nó quadrado, espiral e festonê.",
            "Experimente usar fios de diferentes cores para resultados únicos.",
        ]
    },
    {
        id: 3,
        titulo: "História do artesanato brasileiro",
        conteudo: "Explore a rica história do artesanato no Brasil.",
        categoria: "Histórias",
        imagem: "images/blog/post3.png",
        paragrafos: [
            "O artesanato brasileiro reflete a diversidade cultural de nosso país.",
            "Cada região do Brasil possui técnicas e estilos únicos, como o barro no nordeste e o bordado no sul.",
            "Preservar o artesanato é uma forma de valorizar a nossa cultura e tradição."
        ]
    },
    {
        id: 4,
        titulo: "Decoração com peças artesanais",
        conteudo: "Dicas para decorar sua casa com produtos artesanais.",
        categoria: "Dicas",
        imagem: "images/blog/post4.png",
        paragrafos: [
            "Peças artesanais trazem autenticidade e charme para a decoração da sua casa.",
            "Combine diferentes materiais, como madeira, cerâmica e tecido, para criar um ambiente acolhedor.",
            "Priorize peças feitas à mão para apoiar artistas locais e dar um toque único à sua casa."
        ]
    },
    {
        id: 5,
        titulo: "Artesanato sustentável: reaproveitando materiais",
        conteudo: "Descubra como criar peças incríveis usando materiais reciclados.",
        categoria: "Sustentabilidade",
        imagem: "images/blog/post5.png",
        paragrafos: [
            "Reaproveitar materiais é uma maneira criativa de contribuir para o meio ambiente.",
            "Com garrafas plásticas, você pode criar vasos, luminárias e até brinquedos.",
            "Explore técnicas como pintura, colagem e corte para transformar lixo em arte."
        ]
    },
    {
        id: 6,
        titulo: "Tendências de artesanato para 2025",
        conteudo: "Confira as principais tendências no mundo do artesanato para o próximo ano.",
        categoria: "Tendências",
        imagem: "images/blog/post6.png",
        paragrafos: [
            "Peças minimalistas e com tons neutros estão em alta.",
            "O uso de materiais naturais, como algodão orgânico e bambu, é uma forte tendência.",
            "Customização e personalização de peças continuam sendo uma das preferências do público."
        ]
    },
    {
        id: 7,
        titulo: "Os benefícios terapêuticos do artesanato",
        conteudo: "Descubra como o artesanato pode ajudar a relaxar e melhorar sua saúde mental.",
        categoria: "Bem-Estar",
        imagem: "images/blog/post7.png",
        paragrafos: [
            "Fazer artesanato é uma atividade relaxante que reduz o estresse.",
            "A concentração necessária para criar peças ajuda a mente a focar no presente.",
            "Além disso, concluir um projeto artesanal gera um sentimento de conquista e satisfação."
        ]
    },
    {
        id: 8,
        titulo: "10 ideias de presentes artesanais",
        conteudo: "Inspire-se com essas ideias únicas e criativas de presentes feitos à mão.",
        categoria: "Inspiração",
        imagem: "images/blog/post8.png",
        paragrafos: [
            "Porta-retratos personalizados com materiais reciclados são uma ótima opção.",
            "Velas aromáticas feitas à mão são presentes charmosos e fáceis de fazer.",
            "Outras ideias incluem sabonetes artesanais, quadros decorativos e bolsas de tecido."
        ]
    },
    {
        id: 1,
        titulo: "Como começar no artesanato",
        conteudo: "Aprenda os primeiros passos para criar peças incríveis.",
        categoria: "Dicas",
        imagem: "images/blog/post1.png",
        paragrafos: [
            "Artesanato é uma arte que exige dedicação e criatividade.",
            "Você pode começar com materiais simples, como papel, tecido ou madeira.",
            "Busque inspiração em tutoriais online ou visite feiras de artesanato."
        ]
    },
    {
        id: 2,
        titulo: "5 técnicas de macramê",
        conteudo: "Descubra técnicas avançadas de macramê para suas criações.",
        categoria: "Tutoriais",
        imagem: "images/blog/post2.png",
        paragrafos: [
            "O macramê é uma técnica de nós que permite criar peças decorativas incríveis.",
            "Explore variações como o nó quadrado, espiral e festonê.",
            "Experimente usar fios de diferentes cores para resultados únicos.",
            "O macramê é uma técnica de nós que permite criar peças decorativas incríveis.",
            "Explore variações como o nó quadrado, espiral e festonê.",
            "Experimente usar fios de diferentes cores para resultados únicos.",
            "O macramê é uma técnica de nós que permite criar peças decorativas incríveis.",
            "Explore variações como o nó quadrado, espiral e festonê.",
            "Experimente usar fios de diferentes cores para resultados únicos.",
            "O macramê é uma técnica de nós que permite criar peças decorativas incríveis.",
            "Explore variações como o nó quadrado, espiral e festonê.",
            "Experimente usar fios de diferentes cores para resultados únicos.",
        ]
    },
    {
        id: 3,
        titulo: "História do artesanato brasileiro",
        conteudo: "Explore a rica história do artesanato no Brasil.",
        categoria: "Histórias",
        imagem: "images/blog/post3.png",
        paragrafos: [
            "O artesanato brasileiro reflete a diversidade cultural de nosso país.",
            "Cada região do Brasil possui técnicas e estilos únicos, como o barro no nordeste e o bordado no sul.",
            "Preservar o artesanato é uma forma de valorizar a nossa cultura e tradição."
        ]
    },
    {
        id: 4,
        titulo: "Decoração com peças artesanais",
        conteudo: "Dicas para decorar sua casa com produtos artesanais.",
        categoria: "Dicas",
        imagem: "images/blog/post4.png",
        paragrafos: [
            "Peças artesanais trazem autenticidade e charme para a decoração da sua casa.",
            "Combine diferentes materiais, como madeira, cerâmica e tecido, para criar um ambiente acolhedor.",
            "Priorize peças feitas à mão para apoiar artistas locais e dar um toque único à sua casa."
        ]
    },
    {
        id: 5,
        titulo: "Artesanato sustentável: reaproveitando materiais",
        conteudo: "Descubra como criar peças incríveis usando materiais reciclados.",
        categoria: "Sustentabilidade",
        imagem: "images/blog/post5.png",
        paragrafos: [
            "Reaproveitar materiais é uma maneira criativa de contribuir para o meio ambiente.",
            "Com garrafas plásticas, você pode criar vasos, luminárias e até brinquedos.",
            "Explore técnicas como pintura, colagem e corte para transformar lixo em arte."
        ]
    },
    {
        id: 6,
        titulo: "Tendências de artesanato para 2025",
        conteudo: "Confira as principais tendências no mundo do artesanato para o próximo ano.",
        categoria: "Tendências",
        imagem: "images/blog/post6.png",
        paragrafos: [
            "Peças minimalistas e com tons neutros estão em alta.",
            "O uso de materiais naturais, como algodão orgânico e bambu, é uma forte tendência.",
            "Customização e personalização de peças continuam sendo uma das preferências do público."
        ]
    },
    {
        id: 7,
        titulo: "Os benefícios terapêuticos do artesanato",
        conteudo: "Descubra como o artesanato pode ajudar a relaxar e melhorar sua saúde mental.",
        categoria: "Bem-Estar",
        imagem: "images/blog/post7.png",
        paragrafos: [
            "Fazer artesanato é uma atividade relaxante que reduz o estresse.",
            "A concentração necessária para criar peças ajuda a mente a focar no presente.",
            "Além disso, concluir um projeto artesanal gera um sentimento de conquista e satisfação."
        ]
    },
    {
        id: 8,
        titulo: "10 ideias de presentes artesanais",
        conteudo: "Inspire-se com essas ideias únicas e criativas de presentes feitos à mão.",
        categoria: "Inspiração",
        imagem: "images/blog/post8.png",
        paragrafos: [
            "Porta-retratos personalizados com materiais reciclados são uma ótima opção.",
            "Velas aromáticas feitas à mão são presentes charmosos e fáceis de fazer.",
            "Outras ideias incluem sabonetes artesanais, quadros decorativos e bolsas de tecido."
        ]
    },
    {
        id: 1,
        titulo: "Como começar no artesanato",
        conteudo: "Aprenda os primeiros passos para criar peças incríveis.",
        categoria: "Dicas",
        imagem: "images/blog/post1.png",
        paragrafos: [
            "Artesanato é uma arte que exige dedicação e criatividade.",
            "Você pode começar com materiais simples, como papel, tecido ou madeira.",
            "Busque inspiração em tutoriais online ou visite feiras de artesanato."
        ]
    },
    {
        id: 2,
        titulo: "5 técnicas de macramê",
        conteudo: "Descubra técnicas avançadas de macramê para suas criações.",
        categoria: "Tutoriais",
        imagem: "images/blog/post2.png",
        paragrafos: [
            "O macramê é uma técnica de nós que permite criar peças decorativas incríveis.",
            "Explore variações como o nó quadrado, espiral e festonê.",
            "Experimente usar fios de diferentes cores para resultados únicos.",
            "O macramê é uma técnica de nós que permite criar peças decorativas incríveis.",
            "Explore variações como o nó quadrado, espiral e festonê.",
            "Experimente usar fios de diferentes cores para resultados únicos.",
            "O macramê é uma técnica de nós que permite criar peças decorativas incríveis.",
            "Explore variações como o nó quadrado, espiral e festonê.",
            "Experimente usar fios de diferentes cores para resultados únicos.",
            "O macramê é uma técnica de nós que permite criar peças decorativas incríveis.",
            "Explore variações como o nó quadrado, espiral e festonê.",
            "Experimente usar fios de diferentes cores para resultados únicos.",
        ]
    },
    {
        id: 3,
        titulo: "História do artesanato brasileiro",
        conteudo: "Explore a rica história do artesanato no Brasil.",
        categoria: "Histórias",
        imagem: "images/blog/post3.png",
        paragrafos: [
            "O artesanato brasileiro reflete a diversidade cultural de nosso país.",
            "Cada região do Brasil possui técnicas e estilos únicos, como o barro no nordeste e o bordado no sul.",
            "Preservar o artesanato é uma forma de valorizar a nossa cultura e tradição."
        ]
    },
    {
        id: 4,
        titulo: "Decoração com peças artesanais",
        conteudo: "Dicas para decorar sua casa com produtos artesanais.",
        categoria: "Dicas",
        imagem: "images/blog/post4.png",
        paragrafos: [
            "Peças artesanais trazem autenticidade e charme para a decoração da sua casa.",
            "Combine diferentes materiais, como madeira, cerâmica e tecido, para criar um ambiente acolhedor.",
            "Priorize peças feitas à mão para apoiar artistas locais e dar um toque único à sua casa."
        ]
    },
    {
        id: 5,
        titulo: "Artesanato sustentável: reaproveitando materiais",
        conteudo: "Descubra como criar peças incríveis usando materiais reciclados.",
        categoria: "Sustentabilidade",
        imagem: "images/blog/post5.png",
        paragrafos: [
            "Reaproveitar materiais é uma maneira criativa de contribuir para o meio ambiente.",
            "Com garrafas plásticas, você pode criar vasos, luminárias e até brinquedos.",
            "Explore técnicas como pintura, colagem e corte para transformar lixo em arte."
        ]
    },
    {
        id: 6,
        titulo: "Tendências de artesanato para 2025",
        conteudo: "Confira as principais tendências no mundo do artesanato para o próximo ano.",
        categoria: "Tendências",
        imagem: "images/blog/post6.png",
        paragrafos: [
            "Peças minimalistas e com tons neutros estão em alta.",
            "O uso de materiais naturais, como algodão orgânico e bambu, é uma forte tendência.",
            "Customização e personalização de peças continuam sendo uma das preferências do público."
        ]
    },
    {
        id: 7,
        titulo: "Os benefícios terapêuticos do artesanato",
        conteudo: "Descubra como o artesanato pode ajudar a relaxar e melhorar sua saúde mental.",
        categoria: "Bem-Estar",
        imagem: "images/blog/post7.png",
        paragrafos: [
            "Fazer artesanato é uma atividade relaxante que reduz o estresse.",
            "A concentração necessária para criar peças ajuda a mente a focar no presente.",
            "Além disso, concluir um projeto artesanal gera um sentimento de conquista e satisfação."
        ]
    },
    {
        id: 8,
        titulo: "10 ideias de presentes artesanais",
        conteudo: "Inspire-se com essas ideias únicas e criativas de presentes feitos à mão.",
        categoria: "Inspiração",
        imagem: "images/blog/post8.png",
        paragrafos: [
            "Porta-retratos personalizados com materiais reciclados são uma ótima opção.",
            "Velas aromáticas feitas à mão são presentes charmosos e fáceis de fazer.",
            "Outras ideias incluem sabonetes artesanais, quadros decorativos e bolsas de tecido."
        ]
    },
];

const postsPerPage = 4; // Quantidade de posts por página

function displayPosts(page) {
    const postsGrid = document.getElementById('postsGrid');
    const noPostsMessage = document.getElementById('noPostsMessage');
    const progressBar = document.getElementById('progressBar');
    const categoryFilter = document.getElementById('blogCategoryFilter').value;
    const searchInput = document.getElementById('blogSearchInput').value.toLowerCase();

    progressBar.classList.remove('hidden');
    progressBar.style.width = '0%';

    setTimeout(() => {
        progressBar.style.width = '100%';

        setTimeout(() => {
            const filteredPosts = posts.filter(post => {
                const matchesCategory = categoryFilter ? post.categoria === categoryFilter : true;
                const matchesSearch = post.titulo.toLowerCase().includes(searchInput) || post.conteudo.toLowerCase().includes(searchInput);
                return matchesCategory && matchesSearch;
            });

            const start = (page - 1) * postsPerPage;
            const end = start + postsPerPage;
            const paginatedPosts = filteredPosts.slice(start, end);

            postsGrid.innerHTML = '';
            noPostsMessage.classList.add('hidden');

            if (paginatedPosts.length === 0) {
                noPostsMessage.classList.remove('hidden');
            } else {
                paginatedPosts.forEach(post => {
                    postsGrid.innerHTML += `
                        <div class="post-card">
                            <img src="${post.imagem}" alt="${post.titulo}">
                            <div class="post-info">
                                <h3 class="post-title">${post.titulo}</h3>
                                <p class="post-category">${post.categoria}</p>
                                <p class="post-content">${post.conteudo}</p>
                                <button class="read-more-btn" data-id="${post.id}">Leia mais</button>
                            </div>
                        </div>
                    `;
                });
            }

            updateBlogPagination(page, filteredPosts.length);

            // Adiciona evento para o botão "Leia mais"
            document.querySelectorAll('.read-more-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const postId = e.target.dataset.id;
                    openPostModal(postId);
                });
            });

            progressBar.classList.add('hidden');
        }, 500);
    }, 100);
}

const blogSearchInput = document.getElementById('blogSearchInput');

if ('webkitSpeechRecognition' in window) {
    const recognitionPosts = new webkitSpeechRecognition();
    recognitionPosts.lang = 'pt-BR';
    recognitionPosts.onresult = (event) => {
        blogSearchInput.value = event.results[0][0].transcript;
        displayPosts(1); // Atualiza a exibição dos posts com base na busca
    };

    const voiceSearchPostsBtn = document.createElement('button');
    voiceSearchPostsBtn.innerHTML = '<i title="Pesquisar com Comando de Voz" class="fa-solid fa-microphone"></i>';
    voiceSearchPostsBtn.classList.add("voice-search");
    voiceSearchPostsBtn.addEventListener('click', () => recognitionPosts.start());
    document.getElementById('blogSearch').appendChild(voiceSearchPostsBtn);
}

function openPostModal(postId) {
    const post = posts.find(p => p.id == postId);
    if (!post) return;

    // Preenche os dados do modal
    document.getElementById('modalTitle').textContent = post.titulo;
    document.getElementById('modalImage').src = post.imagem;

    const paragrafosContainer = document.getElementById('modalParagrafos');
    paragrafosContainer.innerHTML = '';
    post.paragrafos.forEach(paragrafo => {
        const p = document.createElement('p');
        p.textContent = paragrafo;
        paragrafosContainer.appendChild(p);
    });

    // Mostra o modal
    const modal = document.getElementById('postModal');
    modal.classList.add('visible');

    // Fecha o modal ao clicar no botão X
    document.getElementById('closeModal').addEventListener('click', () => {
        modal.classList.remove('visible');
    });

    // Fecha o modal ao clicar fora do conteúdo
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('visible');
        }
    });
}

function updateBlogPagination(currentPage, totalPosts) {
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const pagination = document.getElementById('blogPagination');
    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    const createButton = (page, isActive = false, isDots = false) => {
        const button = document.createElement('button');
        if (isDots) {
            button.textContent = '...';
            button.disabled = true;
            button.className = 'dots';
        } else {
            button.textContent = page;
            button.className = isActive ? 'active' : '';
            button.addEventListener('click', () => displayPosts(page));
        }
        pagination.appendChild(button);
    };

    // Sempre mostra a primeira página
    createButton(1, currentPage === 1);

    // Reticências antes do bloco do meio
    if (currentPage > 3) createButton(null, false, true);

    // Exibe até 3 páginas antes e depois da página atual
    for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
        createButton(i, i === currentPage);
    }

    // Reticências depois do bloco do meio
    if (currentPage < totalPages - 2) createButton(null, false, true);

    // Sempre mostra a última página
    createButton(totalPages, currentPage === totalPages);
}

document.getElementById('blogCategoryFilter').addEventListener('change', () => {
    displayPosts(1);
});

let debounceTimeoutBlog;

document.getElementById('blogSearchInput').addEventListener('input', () => {
    // Limpa o timeout anterior se o usuário continuar digitando rapidamente
    clearTimeout(debounceTimeoutBlog);
    
    // Configura o timeout para chamar a função displayPosts após 300ms
    debounceTimeoutBlog = setTimeout(() => {
        displayPosts(1);  // Chama a função para atualizar os posts
    }, 300);  // Ajuste o tempo conforme necessário
});

displayPosts(1);

const testemunhos = [
    {
        id: 1,
        nome: "Maria Silva",
        foto: "images/testimonials/testimonial1.png",
        citacao: "Os produtos são incríveis! Qualidade impecável e entrega rápida.",
        cargo: "Designer de Interiores"
    },
    {
        id: 2,
        nome: "João Oliveira",
        foto: "images/testimonials/testimonial2.png",
        citacao: "Fiquei impressionado com a criatividade e o acabamento dos produtos.",
        cargo: "Arquiteto"
    },
    {
        id: 3,
        nome: "Ana Souza",
        foto: "images/testimonials/testimonial3.png",
        citacao: "Amei o atendimento e os produtos. Recomendo para todos os meus amigos!",
        cargo: "Veterinária"
    },
    {
        id: 4,
        nome: "Carlos Lima",
        foto: "images/testimonials/testimonial4.png",
        citacao: "Peças únicas e feitas com tanto carinho. Voltarei a comprar!",
        cargo: "Professor"
    }
];

let currentTestimonialSlide = 0; // Índice do slide atual
let testimonialDirection = 1; // 1 para avançar, -1 para retroceder

function renderTestemunhos() {
    const slidesContainer = document.getElementById('testemunhosSlides');
    slidesContainer.innerHTML = '';

    testemunhos.forEach(testemunho => {
        slidesContainer.innerHTML += `
            <div class="testimonial-slide">
                <img src="${testemunho.foto}" alt="${testemunho.nome}">
                <p class="citacao">"${testemunho.citacao}"</p>
                <p class="name">${testemunho.nome}</p>
                <p class="role">${testemunho.cargo}</p>
            </div>
        `;
    });
}

function moveTestimonialSlide() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const totalSlides = slides.length;

    // Atualiza o índice do slide atual
    currentTestimonialSlide += testimonialDirection;

    // Verifica se chegou ao final ou ao início
    if (currentTestimonialSlide >= totalSlides) {
        currentTestimonialSlide = totalSlides - 1; // Fica na última imagem
        testimonialDirection = -1; // Muda a direção para voltar
    } else if (currentTestimonialSlide < 0) {
        currentTestimonialSlide = 0; // Fica na primeira imagem
        testimonialDirection = 1; // Muda a direção para avançar
    }

    // Move o carrossel
    const slidesContainer = document.getElementById('testemunhosSlides');
    slidesContainer.style.transform = `translateX(-${currentTestimonialSlide * 100}%)`;

    // Desabilita ou habilita os botões com base nos limites
    const prevButton = document.querySelector('.testimonial-carousel-button.prev');
    const nextButton = document.querySelector('.testimonial-carousel-button.next');

    prevButton.disabled = currentTestimonialSlide === 0; // Desabilita o botão anterior no início
    nextButton.disabled = currentTestimonialSlide === totalSlides - 1; // Desabilita o botão próximo no final
}

// Inicia o movimento automático a cada 5 segundos
setInterval(moveTestimonialSlide, 5000);

// Adiciona eventos de clique para os botões
document.querySelector('.testimonial-carousel-button.prev').addEventListener('click', () => {
    testimonialDirection = -1; // Muda a direção para voltar
    moveTestimonialSlide();
});

document.querySelector('.testimonial-carousel-button.next').addEventListener('click', () => {
    testimonialDirection = 1; // Muda a direção para avançar
    moveTestimonialSlide();
});

// Inicializa o carousel
renderTestemunhos();

// Mostrar/Ocultar o botão "Voltar ao Topo"
window.addEventListener('scroll', () => {
    const backToTopButton = document.getElementById('backToTop');
    if (window.scrollY > 300) { // Mostra o botão após rolar 300px
        backToTopButton.classList.remove('hidden');
        backToTopButton.style.display = 'block'; // Exibe o botão
    } else {
        backToTopButton.classList.add('hidden');
        backToTopButton.style.display = 'none'; // Oculta o botão
    }
});

// Rolar suavemente para o topo
document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Rolagem suave
    });
});

const themeMosaic = document.getElementById("themeMosaic");

function createMosaicTiles() {
    themeMosaic.innerHTML = ''; // Limpa mosaicos anteriores
    for (let i = 0; i < 100; i++) { // 10x10 mosaicos
        const tile = document.createElement("div");
        tile.className = "theme-tile";
        tile.style.animationDelay = `${Math.random() * 0.6}s`; // Delay aleatório
        themeMosaic.appendChild(tile);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const themeSelect = document.getElementById("themeSelect");
    const logo = document.getElementById("logo");
    const currentTheme = localStorage.getItem("theme") || "default";
    document.documentElement.setAttribute("data-theme", currentTheme);
    themeSelect.value = currentTheme;

    // Inicializa partículas e animação
    initParticles();
    initShapes();
    animateParticles();
    animateShapes();

    // Mapeamento de temas para imagens de logo
    const themeLogos = {
        "default": "images/avatar/default.png",
        "autumn": "images/avatar/autumn.png",
        "desert": "images/avatar/desert.png",
        "cherry-blossom": "images/avatar/cherry-blossom.png"
    };

    // Atualiza a imagem do logo com base no tema atual
    logo.src = themeLogos[currentTheme];

    themeSelect.addEventListener("change", (e) => {
        const selectedTheme = e.target.value;

        createMosaicTiles();
        themeMosaic.classList.add("active");

        setTimeout(() => {
            document.documentElement.setAttribute("data-theme", selectedTheme);
            localStorage.setItem("theme", selectedTheme);
            logo.src = themeLogos[selectedTheme];

            setTimeout(() => themeMosaic.classList.remove("active"), 600);
        }, 600);
    });
});

// Função para remover a tela de introdução
window.addEventListener("load", () => {
    const overlay = document.querySelector(".intro-overlay");
    const body = document.body;

    // Aguarda o efeito de máquina de escrever
    setTimeout(() => {
        overlay.style.animation = "fadeOut 2.5s ease forwards";

        // Remove o overlay do DOM após a animação
        overlay.addEventListener("animationend", () => {
            overlay.remove();
            body.classList.remove("no-scroll");
        });
    }, 6000); // Tempo suficiente para completar a animação de digitação
});

// Array de imagens
const images = [
    'images/cards/sacerdotisa.png',
    'images/cards/rainha.png',
    'images/cards/lua.png',
    'images/cards/imperatriz.png',
    'images/cards/justica.png'
];

// Função para escolher uma imagem aleatória
function chooseRandomImage() {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
}

// Definindo a imagem aleatória no elemento <img>
document.getElementById('randomImage').src = chooseRandomImage();

const messageInput = document.getElementById('message');
const speechToTextBtn = document.getElementById('speechToTextBtn');

if ('webkitSpeechRecognition' in window) {
    const recognitionMessage = new webkitSpeechRecognition();
    recognitionMessage.lang = 'pt-BR';

    recognitionMessage.onresult = (event) => {
        messageInput.value += event.results[0][0].transcript; // Adiciona o texto reconhecido ao campo
    };

    recognitionMessage.onerror = (event) => {
        alert('Erro no reconhecimento de fala: ' + event.error);
    };

    speechToTextBtn.addEventListener('click', () => {
        recognitionMessage.start();
    });
} else {
    speechToTextBtn.style.display = 'none'; // Oculta o botão se o navegador não suportar
}

let currentProductSlide = 0;
let productDirection = 1; // 1 para avançar, -1 para retroceder
const numberOfProducts = 3;

function renderProdutos() {
    const slidesContainer = document.getElementById('productSlides');
    slidesContainer.innerHTML = '';

    // Seleciona 3 produtos aleatórios
    const randomProducts = [];
    while (randomProducts.length < numberOfProducts) {
        const randomIndex = Math.floor(Math.random() * produtos.length);
        if (!randomProducts.includes(produtos[randomIndex])) {
            randomProducts.push(produtos[randomIndex]);
        }
    }

    randomProducts.forEach(produto => {
        slidesContainer.innerHTML += `
            <div class="product-slide">
                <h2>${produto.nome}</h2>
                <img src="${produto.imagem}" alt="${produto.nome}">
                <p style="margin-bottom: 0px;" class="product-category">${produto.categoria}</p>
                <p class="product-description">${produto.descricao}</p>
                <p class="product-price">R$ ${produto.preco.toFixed(2)}</p>
            </div>
        `;
    });
}

function moveProductSlide() {
    const slides = document.querySelectorAll('.product-slide');
    const totalSlides = slides.length;

    // Atualiza o índice do slide atual
    currentProductSlide += productDirection;

    // Verifica se chegou ao final ou ao início
    if (currentProductSlide >= totalSlides) {
        currentProductSlide = totalSlides - 1; // Fica na última imagem
        productDirection = -1; // Muda a direção para voltar
    } else if (currentProductSlide < 0) {
        currentProductSlide = 0; // Fica na primeira imagem
        productDirection = 1; // Muda a direção para avançar
    }

    // Move o carrossel
    const slidesContainer = document.getElementById('productSlides');
    slidesContainer.style.transform = `translateX(-${currentProductSlide * 100 }%)`;
    updateProductButtonState();
}

// Função para atualizar o estado dos botões
function updateProductButtonState() {
    const prevButton = document.querySelector('#prev');
    const nextButton = document.querySelector('#next');

    prevButton.disabled = currentProductSlide === 0; // Desabilita o botão anterior no início
    nextButton.disabled = currentProductSlide === document.querySelectorAll('.product-slide').length - 1; // Desabilita o botão próximo no final
}

document.querySelector('#prev').addEventListener('click', () => {
    productDirection = -1;
    moveProductSlide();
});

document.querySelector('#next').addEventListener('click', () => {
    productDirection = 1;
    moveProductSlide();
});

// Inicia o carrossel e renderiza os produtos
renderProdutos();
setInterval(() => {
    renderProdutos();
    currentProductSlide = 0; // Reseta o índice do slide atual
    moveProductSlide();
}, 1200000); // Atualiza a cada 20 minutos

// Inicia o movimento automático a cada 5 segundos
setInterval(moveProductSlide, 5000);

// Configuração de partículas
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const particleCount = 100; // Número de partículas

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particlesArray = [];
    shapesArray = [];
    initShapes();
    initParticles();
}

window.addEventListener('resize', resizeCanvas);

// Cria partículas
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        const rootStyles = getComputedStyle(document.documentElement);
        this.color = rootStyles.getPropertyValue('--color-middle').trim();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Reposiciona se sair da tela
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// Inicializa partículas
function initParticles() {
    for (let i = 0; i < particleCount; i++) {
        particlesArray.push(new Particle());
    }
}

// Anima partículas
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesArray.forEach((particle) => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animateParticles);
}

class Shape {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 20 + 10; // Tamanho da forma
        this.sides = Math.floor(Math.random() * 5) + 3; // Número de lados (3 a 7)
        this.rotation = Math.random() * Math.PI * 2;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        const rootStyles = getComputedStyle(document.documentElement);
        this.color = rootStyles.getPropertyValue('--color-primary-dark').trim(); // Cor das formas
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Reposiciona se sair da tela
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        this.rotation += 0.01; // Rotação lenta
    }

    draw() {
        ctx.beginPath();
        const angle = (Math.PI * 2) / this.sides;

        for (let i = 0; i < this.sides; i++) {
            const x = this.x + this.size * Math.cos(angle * i + this.rotation);
            const y = this.y + this.size * Math.sin(angle * i + this.rotation);
            ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }
}

let shapesArray = [];
const shapeCount = 20; // Número de formas geométricas

function initShapes() {
    for (let i = 0; i < shapeCount; i++) {
        shapesArray.push(new Shape());
    }
}

function animateShapes() {
    shapesArray.forEach((shape) => {
        shape.update();
        shape.draw();
    });

    requestAnimationFrame(animateShapes);
}

// Redimensiona o canvas com a janela
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const eventos = [
    {
        id: 1,
        titulo: "Oficina de Artesanato Sustentável",
        data: "2025-02-15",
        hora: "14:00",
        local: "Espaço Cultural Vida & Arte",
        descricao: "Aprenda a criar peças artesanais utilizando materiais reciclados.",
        jaOcorreu: false,
    },
    {
        id: 2,
        titulo: "Feira de Artesanato Local",
        data: "2025-03-05",
        hora: "09:00",
        local: "Praça Central",
        descricao: "Explore artesanatos únicos de artistas locais.",
        jaOcorreu: false,
    },
    {
        id: 3,
        titulo: "Workshop de Escultura em Madeira",
        data: "2024-01-20",
        hora: "10:00",
        local: "Ateliê Criativo",
        descricao: "Domine as técnicas de macramê com este workshop exclusivo.",
        jaOcorreu: true,
    },
    {
        id: 4,
        titulo: "Curso de Pintura em Cerâmica",
        data: "2025-04-10",
        hora: "15:00",
        local: "Ateliê Vida & Arte",
        descricao: "Aprenda a técnica de pintura em cerâmica e personalize suas peças.",
        jaOcorreu: false,
    },
    {
        id: 5,
        titulo: "Oficina de Crochê Moderno",
        data: "2025-05-20",
        hora: "10:00",
        local: "Espaço Criativo Centro",
        descricao: "Descubra como criar peças de crochê modernas para decoração.",
        jaOcorreu: false,
    },
    {
        id: 6,
        titulo: "Feira de Artesanato e Sustentabilidade",
        data: "2024-12-15",
        hora: "09:00",
        local: "Parque Central",
        descricao: "Conheça artistas locais e explore o impacto sustentável do artesanato.",
        jaOcorreu: true,
    },
    {
        id: 7,
        titulo: "Workshop de Encadernação Manual",
        data: "2025-06-05",
        hora: "14:30",
        local: "Oficina do Saber",
        descricao: "Domine a arte de criar cadernos e álbuns com encadernação manual.",
        jaOcorreu: false,
    },
    {
        id: 8,
        titulo: "Exposição de Bordados Tradicionais",
        data: "2024-11-25",
        hora: "18:00",
        local: "Galeria Arte Viva",
        descricao: "Explore bordados únicos inspirados em tradições culturais.",
        jaOcorreu: true,
    },
    {
        id: 9,
        titulo: "Oficina de Papel Machê para Crianças",
        data: "2025-07-15",
        hora: "09:30",
        local: "Centro Comunitário Bairro Verde",
        descricao: "Uma oficina divertida para as crianças aprenderem a criar arte com papel machê.",
        jaOcorreu: false,
    },
    {
        id: 10,
        titulo: "Curso de Tapeçaria Artesanal",
        data: "2025-08-01",
        hora: "10:00",
        local: "Espaço Cultural Criativo",
        descricao: "Aprenda técnicas tradicionais de tapeçaria e crie peças incríveis.",
        jaOcorreu: true,
    },
    {
        id: 11,
        titulo: "Feira de Artesanato Natalino",
        data: "2024-12-05",
        hora: "10:00",
        local: "Praça do Natal",
        descricao: "Descubra peças exclusivas para decoração e presentes natalinos.",
        jaOcorreu: true,
    },
]

const eventosPerPage = 3; // Quantidade de eventos por página

function formatarData(data) {
    const partes = data.split('-'); // Divide a data em partes
    return `${partes[2]}-${partes[1]}-${partes[0]}`; // Retorna no formato DD-MM-AAAA
}

function calcularDiasRestantes(dataEvento) {
    const dataAtual = new Date(); // Data atual
    const dataEventoObj = new Date(dataEvento); // Converte a data do evento para um objeto Date

    // Calcula a diferença em milissegundos
    const diferenca = dataEventoObj - dataAtual;

    // Converte a diferença de milissegundos para dias
    const diasRestantes = Math.ceil(diferenca / (1000 * 60 * 60 * 24)); // 1000 ms * 60 s * 60 min * 24 h

    return diasRestantes;
}

function displayEventos(page) {
    const eventosContainer = document.getElementById('eventosContainer');
    const eventosPagination = document.getElementById('eventosPagination');
    const progressBar = document.getElementById('progressBar'); // Barra de carregamento
    const eventStatusSort = document.getElementById('eventStatusSort').value;

    // Mostra a barra de carregamento
    progressBar.classList.remove('hidden');
    progressBar.style.width = '0%';

    setTimeout(() => {
        progressBar.style.width = '100%';

        setTimeout(() => {
            let filteredEventos = eventos;

            // Filtra os eventos com base no status selecionado
            if (eventStatusSort === 'upcoming') {
                filteredEventos = eventos.filter(evento => !evento.jaOcorreu);
            } else if (eventStatusSort === 'past') {
                filteredEventos = eventos.filter(evento => evento.jaOcorreu);
            }

            // Ordena os eventos por data
            filteredEventos.sort((a, b) => {
                const dateA = new Date(a.data);
                const dateB = new Date(b.data);
                return dateA - dateB; // Ordena do mais próximo para o mais distante
            });

            const start = (page - 1) * eventosPerPage;
            const end = start + eventosPerPage;
            const paginatedEventos = filteredEventos.slice(start, end);

            eventosContainer.innerHTML = '';

            if (paginatedEventos.length === 0) {
                eventosContainer.innerHTML = '<p class="no-events">Nenhum evento disponível no momento.</p>';
                eventosPagination.innerHTML = '';
                progressBar.classList.add('hidden');
                return;
            }

            paginatedEventos.forEach(evento => {
                const diasRestantes = evento.jaOcorreu ? "" : `(${calcularDiasRestantes(evento.data)} dias)`;
                eventosContainer.innerHTML += `
                    <div class="evento-card">
                        <h3>${evento.titulo}</h3>
                        <p class="evento-data">${formatarData(evento.data)} às ${evento.hora} ${diasRestantes}</p>
                        <p class="evento-local">${evento.local}</p>
                        <p class="evento-descricao">${evento.descricao}</p>
                        ${
                            evento.jaOcorreu
                                ? `<span class="evento-status">Evento Finalizado</span>`
                                : `<button class="evento-button">Participar</button>`
                        }
                    </div>
                `;
            });

            updateEventosPagination(page, filteredEventos.length);

            // Esconde a barra de carregamento
            progressBar.classList.add('hidden');
        }, 500); // Tempo do carregamento
    }, 100);
}

function updateEventosPagination(currentPage, totalEventos) {
    const totalPages = Math.ceil(totalEventos / eventosPerPage);
    const pagination = document.getElementById('eventosPagination');
    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    const createButton = (page, isActive = false, isDots = false) => {
        const button = document.createElement('button');
        if (isDots) {
            button.textContent = '...';
            button.disabled = true;
            button.className = 'dots';
        } else {
            button.textContent = page;
            button.className = isActive ? 'active' : '';
            button.addEventListener('click', () => {
                displayEventos(page);
            });
        }
        pagination.appendChild(button);
    };

    // Sempre mostra a primeira página
    createButton(1, currentPage === 1);

    // Reticências antes do bloco do meio
    if (currentPage > 3) createButton(null, false, true);

    // Exibe até 3 páginas antes e depois da página atual
    for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
        createButton(i, i === currentPage);
    }

    // Reticências depois do bloco do meio
    if (currentPage < totalPages - 2) createButton(null, false, true);

    // Sempre mostra a última página
    createButton(totalPages, currentPage === totalPages);
}

document.getElementById('eventStatusSort').addEventListener('change', () => {
    displayEventos(1); // Recarrega a página 1 ao trocar o filtro
});

// Inicializa os eventos e paginação
document.addEventListener("DOMContentLoaded", () => {
    displayEventos(1); // Mostra a primeira página
});

const musicList = [
    'music/god.mp3',
    'music/universe.mp3',
    'music/dark.mp3',
    // Adicione mais caminhos de músicas aqui
];

const audioPlayer = document.getElementById('audioPlayer');
const playButton = document.getElementById('playButton');
const volumeControl = document.getElementById('volume');
const stopButton = document.getElementById('stopButton');

// Função para tocar uma música aleatória
function playRandomMusic() {
    const randomIndex = Math.floor(Math.random() * musicList.length);
    const newSrc = musicList[randomIndex];

    // Garante que a música anterior seja pausada
    audioPlayer.pause();
    audioPlayer.currentTime = 0;

    // Atualiza a fonte do player somente se for uma música diferente
    if (audioPlayer.src !== newSrc) {
        audioPlayer.src = newSrc;
        audioPlayer.load(); // Carrega o novo arquivo de áudio

        // Aguarda o carregamento do áudio antes de tocar
        audioPlayer.addEventListener('canplaythrough', () => {
            audioPlayer.play().catch(error => {
                console.error("Erro ao reproduzir a música:", error);
            });
        }, { once: true }); // Garante que o evento é tratado apenas uma vez
    } else {
        // Toca a música se já estiver carregada
        audioPlayer.play().catch(error => {
            console.error("Erro ao reproduzir a música:", error);
        });
    }

    // Cria o círculo expandindo
    const circle = document.createElement('div');
    circle.className = 'music-circle';
    document.body.appendChild(circle);

    // Remove o círculo após a animação
    circle.addEventListener('animationend', () => circle.remove());
}

// Evento de clique no botão
playButton.addEventListener('click', playRandomMusic);

// Evento de clique no botão de parar
stopButton.addEventListener('click', () => {
    audioPlayer.pause(); // Para a música
    audioPlayer.currentTime = 0; // Reseta a música para o início

    const shrinkCircle = document.createElement('div');
    shrinkCircle.className = 'music-circle-shrink';
    document.body.appendChild(shrinkCircle);

    shrinkCircle.addEventListener('animationend', () => shrinkCircle.remove());
});

// Controlador de volume
volumeControl.addEventListener('input', (event) => {
    audioPlayer.volume = event.target.value; // Define o volume do áudio
});

// Define o volume inicial
audioPlayer.volume = volumeControl.value;

document.getElementById("fullscreenButton").addEventListener("click", () => {
    const icon = document.querySelector("#fullscreenButton i");

    if (!document.fullscreenElement) {
        // Ativa o modo de tela cheia
        document.documentElement.requestFullscreen().then(() => {
            icon.classList.replace("fa-expand", "fa-compress");
        }).catch((err) => {
            console.error(`Erro ao ativar tela cheia: ${err.message}`);
        });
    } else {
        // Sai do modo de tela cheia
        document.exitFullscreen().then(() => {
            icon.classList.replace("fa-compress", "fa-expand");
        }).catch((err) => {
            console.error(`Erro ao sair da tela cheia: ${err.message}`);
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const videoPlayer = document.getElementById("videoPlayer");
    const prevButton = document.querySelector(".video-carousel-btn.prev");
    const nextButton = document.querySelector(".video-carousel-btn.next");
    const loadingIndicator = document.getElementById("loading");
    const showAllVideosBtn = document.getElementById("showAllVideosBtn");
    const videoList = document.getElementById("videoList");
    const videoListUl = videoList.querySelector("ul");
    const prevPageBtn = document.getElementById("prevPageBtn");
    const nextPageBtn = document.getElementById("nextPageBtn");

    const videos = [
        { src: "videos/video1.mp4", caption: "Tutorial de Artesanato Sustentável" },
        { src: "videos/video2.mp4", caption: "Como Criar uma Escultura em Madeira" },
        { src: "videos/video3.mp4", caption: "Técnicas de Pintura em Madeira" },
        { src: "videos/video4.mp4", caption: "Entenda o significado de UpCycle" },
        { src: "videos/video5.mp4", caption: "Como Pintar uma Mandala" },
        { src: "videos/video6.mp4", caption: "A História da Arte" },
        // Adicione mais vídeos conforme necessário
    ];

    let currentIndex = 0;
    let currentPage = 0;
    const videosPerPage = 5; // Número de vídeos por página

    function loadVideo(index) {
        loadingIndicator.style.display = "block"; // Mostra o indicador de carregamento
        videoPlayer.pause(); // Pausa o vídeo atual

        // Desabilita os botões enquanto o vídeo está carregando
        prevButton.disabled = true;
        nextButton.disabled = true;

        // Simula o carregamento do vídeo
        setTimeout(() => {
            videoPlayer.src = videos[index].src; // Atualiza a fonte do vídeo
            videoPlayer.load(); // Carrega o novo vídeo
            document.querySelector(".video-caption").textContent = videos[index].caption; // Atualiza a legenda
            loadingIndicator.style.display = "none"; // Esconde o indicador de carregamento

            // Habilita ou desabilita os botões
            prevButton.disabled = index === 0;
            nextButton.disabled = index === videos.length - 1;
        }, 1000); // Simula um tempo de carregamento de 1 segundo
    }

    prevButton.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            loadVideo(currentIndex);
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentIndex < videos.length - 1) {
            currentIndex++;
            loadVideo(currentIndex);
        }
    });

    // Inicializa o primeiro vídeo
    loadVideo(currentIndex);

    // Função para mostrar ou esconder a lista de vídeos
    function toggleVideoList() {
        if (videoList.style.display === "block") {
            videoList.style.display = "none"; // Esconde a lista
        } else {
            videoList.style.display = "block"; // Mostra a lista
            currentPage = 0; // Reseta a página atual
            loadVideosForPage(currentPage); // Carrega os vídeos da primeira página
        }
    }

    // Função para carregar vídeos de uma página específica
    function loadVideosForPage(page) {
        videoListUl.innerHTML = ""; // Limpa a lista
        const start = page * videosPerPage; // Índice inicial
        const end = start + videosPerPage; // Índice final

        // Carrega os vídeos da página atual
        for (let i = start; i < end && i < videos.length; i++) {
            const li = document.createElement("li");
            li.textContent = videos[i].caption; // Título do vídeo
            const playButton = document.createElement("button");
            playButton.innerHTML = `<i class="fa-solid fa-play"></i>`;
            playButton.addEventListener("click", () => {
                currentIndex = i; // Atualiza o índice atual
                loadVideo(currentIndex); // Carrega o vídeo selecionado
                videoList.style.display = "none"; // Esconde a lista após selecionar
            });
            li.insertBefore(playButton, li.firstChild);
            videoListUl.appendChild(li);
        }

        // Atualiza os botões de navegação
        prevPageBtn.disabled = page === 0; // Desabilita o botão "Anterior" na primeira página
        nextPageBtn.disabled = end >= videos.length; // Desabilita o botão "Próximo" na última página
    }

    // Eventos para os botões de paginação
    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 0) {
            currentPage--; // Decrementa a página atual
            loadVideosForPage(currentPage); // Carrega vídeos da nova página
        }
    });

    nextPageBtn.addEventListener("click", () => {
        if ((currentPage + 1) * videosPerPage < videos.length) {
            currentPage++; // Incrementa a página atual
            loadVideosForPage(currentPage); // Carrega vídeos da nova página
        }
    });

    showAllVideosBtn.addEventListener("click", toggleVideoList);
}); 