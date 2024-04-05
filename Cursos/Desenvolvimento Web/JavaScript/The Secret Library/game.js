// Objeto contendo os URLs dos mapas
const mapURLs = {
    map1: 'https://gist.githubusercontent.com/the-akira/508f3a7e1a4ce5ef4850b5b459fe5771/raw/7d1fb444a2e19660bbc40484c35fbedd7ca2aadd/map.csv',
    map2: 'https://gist.githubusercontent.com/the-akira/ce7ac31e0e4270324595421fcab83f70/raw/8b6f4a32c8a667003331fcaee75f733641a954fb/map2.csv',
    map3: 'https://gist.githubusercontent.com/the-akira/dc1183c49343299281a4792a06f3ad74/raw/f4c241395bee92e5950f2833923e4bb1dffe8d4c/map3.csv',
    map4: 'https://gist.githubusercontent.com/the-akira/0a41091d265254e999cd6e18555a359e/raw/b9eabebfac11f4fc01b9972b00551a312c40ce51/map4.csv'
};

// Método para obter o URL do mapa com base no nome do mapa
function getMapURL(mapName) {
    return mapURLs[mapName];
}

// Classe para representar uma orb
class Orb {
    constructor(x, y, velocityX, velocityY, image) {
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.image = new Image();
        this.image.src = "assets/orb.png"
        this.width = 32;
        this.height = 32;
    }

    // Método para atualizar a posição da orb
    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
    }

    // Método para desenhar a orb no canvas
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    // Método para verificar a colisão da orb com os tiles do mapa
    checkCollision(map) {
        // Calcular as coordenadas do tile onde a orb está
        const tileX = Math.floor((this.x + this.width / 2) / map.tileSize);
        const tileY = Math.floor((this.y + this.height / 2) / map.tileSize);

        // Verificar se o tile é uma parede
        if (map.tiles[tileY][tileX] === 1) {
            return true; // Colisão detectada
        }
        return false; // Sem colisão
    }
}

// Função para atualizar as bolas de fogo
function checkOrbCollisions(map) {
    // Iterar sobre todas as bolas de fogo
    for (let i = orbs.length - 1; i >= 0; i--) {
        const orb = orbs[i];
        
        // Movimentar a orb
        orb.update();

        // Verificar colisão com os tiles do mapa
        if (orb.checkCollision(map)) {
            // Remover a orb da lista se houver colisão
            orbs.splice(i, 1);
        }
    }
}

// Classe para representar um livro
class Book {
    constructor(x, y, text, currentMap, image) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.image = image;
        this.width = 32;
        this.height = 32;
        this.currentMap = getMapURL(currentMap)
    }

    // Método para desenhar o livro no canvas
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

// Objeto contendo os livros
const books = {
    book01: new Book(1088, 992, "O Livro dos Símbolos Ocultos é um antigo e misterioso tomo encadernado em couro negro, adornado com símbolos arcanos que parecem pulsar com uma energia própria. Suas páginas amareladas pelo tempo guardam segredos milenares, contendo inscrições incompreensíveis para olhos desavisados. Aqueles que ousam abrir suas páginas podem desvendar os mistérios do universo ou despertar forças além da compreensão humana. Dizem que apenas os mais sábios e corajosos podem decifrar seus enigmas e dominar o poder contido em suas páginas.", "map1", new Image()),
    book02: new Book(1280, 96, "O Livro Sagrado da Lei Eterna 8 é uma relíquia venerada por sábios e buscadores da verdade há séculos. Encadernado em pele de cordeiro branco e adornado com símbolos dourados, este livro irradia uma aura de santidade e sabedoria. Suas páginas, escritas em uma caligrafia celestial, contêm os ensinamentos eternos que regem o equilíbrio do universo e a jornada espiritual dos seres vivos. Quem busca em suas palavras encontra orientação para a vida, instruções para a paz interior e a promessa da iluminação divina. No entanto, apenas os corações puros e os buscadores sinceros podem compreender verdadeiramente os profundos mistérios contidos neste sagrado volume.", "map1", new Image()),
    book03: new Book(288, 960, "O Tomo do Mago Ancião é um artefato lendário forjado nos primórdios da magia. Suas capas de couro envelhecido exalam o aroma do conhecimento arcano acumulado ao longo de eras. As páginas amareladas pelo tempo e marcadas por inscrições rúnicas contêm os segredos mais profundos da magia ancestral, transmitidos de mestre para aprendiz através das eras. Aqueles que ousam abrir este tomo podem desvendar os mistérios da manipulação da energia cósmica, aprender encantamentos poderosos e compreender as leis que regem os reinos invisíveis. No entanto, seu poder não é para os fracos de coração; apenas os magos mais sábios e dedicados podem dominar os segredos ocultos contidos dentro de suas páginas.", "map1", new Image()),
    book04: new Book(448, 896, "O Livro Ancestral dos Mortos é um tomo antigo e misterioso que contém os ensinamentos e rituais dos antigos sacerdotes necromantes. Encadernado em pele de uma criatura sombria e adornado com runas sinistras, este livro é tanto uma ferramenta de conhecimento quanto um portal para o reino dos espíritos. Suas páginas estão repletas de instruções para invocar e controlar os mortos, bem como para explorar os segredos do além. Aqueles que ousam abrir suas páginas podem encontrar respostas sobre a vida após a morte e até mesmo obter o poder de comunicar-se com os espíritos dos falecidos. No entanto, o preço desse conhecimento é alto, pois mexer com forças além da compreensão humana sempre traz consequências imprevisíveis.", "map2", new Image()),
    book05: new Book(288, 1120, "O Livro da Profecia dos Arcanjos é uma relíquia ancestral que narra os eventos que moldaram o destino do mundo. Escrito em caracteres dourados sobre páginas de pergaminho envelhecido, este livro contém profecias antigas transmitidas pelos próprios arcanjos. Suas palavras preveem guerras divinas, alianças entre reinos distantes e o despertar de poderes há muito adormecidos. Aqueles que buscam suas páginas podem encontrar orientação sobre os eventos que moldarão o futuro e descobrir segredos ocultos sobre o equilíbrio cósmico. No entanto, interpretar suas profecias exige sabedoria e discernimento, pois nem todas as visões são claras e o futuro pode ser tanto uma bênção quanto uma maldição.", "map2", new Image()),
    book06: new Book(1664, 256, "O Livro das Meditações é uma obra de serenidade e autoconhecimento, repleta de ensinamentos ancestrais sobre a arte da meditação. Suas páginas exalam uma aura de tranquilidade, e cada palavra é como um sussurro suave que guia o leitor para dentro de si mesmo. Escrito por mestres contemplativos ao longo das eras, este livro oferece uma jornada espiritual através de exercícios de concentração, visualização e introspecção. Com suas meditações, o leitor é convidado a explorar os recantos mais profundos de sua alma, buscando clareza mental, paz interior e harmonia com o universo. Aqueles que se entregam a suas práticas podem encontrar não apenas a quietude da mente, mas também a conexão com o divino e a compreensão de sua verdadeira natureza.", "map2", new Image()),
    book07: new Book(672, 928, "A Misteriosa Jornada de Osíris é uma narrativa enigmática que transporta os leitores para além dos limites do tempo e do espaço. Este antigo tomo conta a saga do deus egípcio Osíris em sua busca pela imortalidade e pela verdade oculta do universo. Repleto de simbolismo e mistério, o livro descreve a jornada de Osíris através dos reinos dos vivos e dos mortos, enfrentando desafios inimagináveis e descobrindo segredos cósmicos profundos. Os leitores que se aventuram por suas páginas são convidados a refletir sobre os mistérios da vida e da morte, sobre o renascimento da alma e sobre o eterno ciclo da existência. Cada capítulo é como um portal para uma dimensão transcendental, onde o conhecimento sagrado aguarda aqueles que têm a coragem de desvendar os enigmas de Osíris.", "map3", new Image()),
    book08: new Book(1408, 448, "Os Devaneios do Eremita Louco é um relato intrigante que narra as viagens interiores de um eremita em busca da verdade escondida por trás das ilusões do mundo. Neste livro misterioso, o Eremita Louco compartilha suas visões visionárias e suas reflexões sobre a natureza da realidade, explorando os recantos mais profundos da mente humana. Cada página é um convite para uma jornada de autoconhecimento e despertar espiritual, onde os leitores são desafiados a questionar suas próprias percepções e a desvendar os mistérios do universo interior. Com uma mistura única de simbolismo, filosofia e imaginação, este livro oferece uma perspectiva única sobre a jornada da alma em sua busca pela verdade eterna.", "map3", new Image()),
    book09: new Book(256, 448, "O Livro A União da Luz e das Trevas é um texto enigmático que explora os conceitos da dualidade e da harmonia entre forças aparentemente opostas. Nesta obra, o autor mergulha nas profundezas da psique humana e nas interações entre luz e sombra, bem e mal, revelando como esses aspectos aparentemente antagônicos podem coexistir e até mesmo se complementar. Ao longo das páginas deste livro intrigante, os leitores são levados a uma jornada de autoconhecimento, convidados a explorar as partes mais obscuras de si mesmos em busca de equilíbrio e integração.", "map3", new Image()),
    book10: new Book(192, 288, "O Livro do Olho que Tudo Vê é um tomo antigo envolto em mistério e intriga. Diz-se que suas páginas guardam segredos ancestrais sobre a natureza da percepção e da sabedoria. Ao longo das eras, este livro foi reverenciado como uma fonte de conhecimento oculto, oferecendo vislumbres do cosmos e insights sobre os segredos mais profundos da existência. Aqueles que buscam desvendar seus mistérios devem estar preparados para enfrentar desafios de compreensão e contemplação, pois suas palavras são enigmáticas e suas verdades, reveladas apenas aos mais dignos de iniciados. Dizem que aqueles que conseguem decifrar as mensagens contidas no Livro do Olho que Tudo Vê ganham uma nova perspectiva sobre o universo e alcançam um nível mais profundo de consciência cósmica. No entanto, o preço da iluminação pode ser alto, pois o conhecimento contido nestas páginas pode mudar para sempre a visão daqueles que o buscam.", "map4", new Image()),
    book11: new Book(1376, 448, "A Bíblia Sagrada é um livro venerado por muitas culturas e tradições ao redor do mundo. Repleta de histórias, parábolas, ensinamentos e preceitos morais, ela é considerada por muitos como a palavra de Deus, transmitindo orientações para uma vida justa e virtuosa. Dividida em duas partes principais, o Antigo e o Novo Testamento, a Bíblia abrange uma vasta gama de temas, desde a criação do universo até os ensinamentos de Jesus Cristo. Para os fiéis, suas páginas não são apenas um registro histórico, mas sim um guia espiritual que oferece conforto, esperança e direção em tempos de dificuldade. Embora seu significado e interpretação possam variar entre diferentes tradições religiosas, a mensagem central da Bíblia é universal: amar a Deus sobre todas as coisas e ao próximo como a si mesmo.", "map4", new Image()),
    book12: new Book(896, 1088, "O Livro do Filósofo Desconhecido é um volume enigmático que desafia as fronteiras do conhecimento convencional. Reza a lenda que foi escrito por um sábio errante cuja identidade permanece obscura até os dias de hoje. Este livro misterioso contém uma compilação de pensamentos profundos, paradoxos intrigantes e ensinamentos transcendentais que desafiam as convenções da lógica e da razão. Cada página revela uma nova perspectiva sobre a vida, o universo e a natureza humana, convidando o leitor a mergulhar nas profundezas da mente e explorar os mistérios do ser.", "map4", new Image()),
};

books.book01.image.src = 'assets/books/book01.png';
books.book02.image.src = 'assets/books/book02.png';
books.book03.image.src = 'assets/books/book03.png';
books.book04.image.src = 'assets/books/book04.png';
books.book05.image.src = 'assets/books/book05.png';
books.book06.image.src = 'assets/books/book06.png';
books.book07.image.src = 'assets/books/book07.png';
books.book08.image.src = 'assets/books/book08.png';
books.book09.image.src = 'assets/books/book09.png';
books.book10.image.src = 'assets/books/book10.png';
books.book11.image.src = 'assets/books/book11.png';
books.book12.image.src = 'assets/books/book12.png';

// Classe para representar um npc
class NPC {
    constructor(x, y, text, currentMap, image) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.image = image;
        this.image.onload = () => {
            this.width = this.image.naturalWidth;
            this.height = this.image.naturalHeight;
        };
        this.currentMap = getMapURL(currentMap);
    }

    // Método para desenhar o livro no canvas
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

// Objeto contendo os livros
const npcs = {
    npc01: new NPC(1504, 896, "Olá, intrépido viajante! Eu sou Joana, A Aventureira, uma alma destemida que busca os segredos ocultos além do horizonte e as maravilhas escondidas sob as estrelas. Meu coração é tão selvagem quanto as tempestades do oceano e tão livre quanto o vento que sopra pelas montanhas. Em minhas jornadas, descubro não apenas terras desconhecidas, mas também o verdadeiro significado da coragem e da perseverança. Cada passo na estrada da vida é uma história a ser contada, e cada desafio é uma oportunidade para crescimento e autoconhecimento. Deixe-me ser teu guia através das selvas da incerteza e dos desertos da dúvida, pois juntos, podemos desbravar os caminhos que levam à grandeza e à aventura sem limites.", "map1", new Image()),
    npc02: new NPC(704, 576, "Saudações, viajante inquieto. Eu sou Jubileu, O Assassino, um espectro sombrio que dança nas sombras e caminha entre os reinos da vida e da morte. Minha lâmina é afiada como a mente de um sábio e sutil como os fios do destino. Eu sou a manifestação da dualidade, o equilíbrio entre a luz e a escuridão. Em meu silêncio, ecoam os ecos das escolhas e consequências, lembrando a fragilidade da existência e a inevitabilidade da mudança. Permita-me guiar-te através dos labirintos do dilema moral e da ambiguidade ética, onde cada passo é uma dança entre a redenção e a condenação. Nas profundezas da minha sombra, encontrarás a verdade sobre a natureza humana e o peso das tuas próprias escolhas.", "map1", new Image()),
    npc03: new NPC(896, 992, "Saudações, viajante curioso. Eu sou Isaac, O Observador, um estudioso dos mistérios que permeiam o tecido do universo. Minha mente é uma constelação de ideias, sempre buscando compreender os padrões ocultos que governam o cosmos e as nuances sutis da existência. Enquanto observo as estrelas cintilantes no céu noturno, vejo reflexos de nossas próprias jornadas e questiono o propósito por trás de cada movimento celestial. A vida é uma sinfonia complexa de eventos, e eu, como um mero espectador, busco desvendar os segredos que se escondem nas entrelinhas do tempo. A cada olhar para o infinito, descubro mais sobre mim mesmo e sobre o vasto universo que nos cerca, sempre em busca da verdade que se esconde além do véu do desconhecido.", "map1", new Image()),
    npc04: new NPC(1408, 288, "Ah, bem-vindo, forasteiro, aos bosques encantados que abrigam minha morada. Sou Tiago, o Druida, guardião dos segredos da floresta e dos mistérios da vida selvagem. Nas sombras das árvores antigas e sob o sussurro do vento, encontro minha inspiração e sabedoria. Como um elo entre o mundo natural e o humano, observo o ciclo eterno da vida, desde o brotar delicado das folhas até o sussurrar final das águas. Em cada folha que cai e em cada raio de sol que penetra a densa vegetação, vejo a harmonia divina que permeia toda criação. Sou um guardião dos segredos antigos, um sussurrador dos ventos e um curador das feridas da alma. Se desejas compreender os mistérios da natureza e encontrar respostas nos cantos mais sombrios da floresta, estou aqui para guiar-te com sabedoria e benevolência.", "map1", new Image()),
    npc05: new NPC(256, 736, "Salve, viajante! Sou Ulrich, o Anão Barba Ruiva, forjador de lendas e guardião das antigas tradições. Com minha forja incandescente e martelo firme, moldo o ferro e o aço como se fossem argila, criando artefatos que resistem ao teste do tempo. Nas profundezas da terra, onde o fogo arde eternamente, encontro meu lar e minha paixão. Cada golpe de martelo ecoa como um trovão nas câmaras subterrâneas, e cada peça que forjo carrega consigo a marca da minha habilidade e dedicação. Sou um contador de histórias, um ferreiro destemido e um amigo leal, pronto para enfrentar qualquer desafio que o destino me apresente. Se buscares armas que ressoem com a coragem dos antigos heróis ou artefatos que contenham o poder dos deuses, estás no lugar certo, meu amigo.", "map1", new Image()),
    npc06: new NPC(224, 768, "Seja bem-vindo, viajante, ao reino encantado de Sofia, a Encantadora. Em meio às sombras do oculto e às brumas do desconhecido, eu te saúdo. Sou guardiã dos segredos antigos e mestra das artes arcanas, tecendo feitiços e encantamentos com a destreza de uma tecelã celestial. Meus olhos refletem os mistérios dos astros e minha voz ecoa como um sussurro do além. Em meus aposentos, os pergaminhos antigos sussurram segredos há muito esquecidos, e as velas dançam ao ritmo dos feitiços que conjuro. Se procuras desvendar os enigmas do universo ou desafiar os limites da realidade, estás no lugar certo, meu caro. Pois em meu reino, a magia é a própria essência da existência, e eu sou sua guardiã eterna.", "map2", new Image()),
    npc07: new NPC(1088, 288, "Olá, estranho! Eu sou Jack, o Maluco, um viajante dos confins do absurdo e um explorador dos limites da sanidade. Minha mente é um labirinto de ideias loucas e minhas ações desafiam a lógica deste mundo e de qualquer outro. Percorro os caminhos tortuosos do impossível em busca de emoções que desafiam a razão e desdenho das convenções que amarram os fracos de espírito. Se quiseres seguir-me nesta jornada insana, prepara-te para aventuras que desafiarão tua compreensão e te levarão além do que julgas ser possível. Pois onde outros veem loucura, eu vejo liberdade, e onde outros veem caos, eu vejo possibilidades infinitas. Vem comigo, se tiveres coragem, e embarca nesta odisseia pelo reino do absurdo!", "map2", new Image()),
    npc08: new NPC(640, 192, "Seja bem-vindo, nobre viajante, à corte de Carlos, o Rei. Comandante dos reinos conhecidos, meu cetro é a justiça e minha coroa, a glória dos povos sob meu reinado. Sou guardião dos valores ancestrais, defensor da honra e da virtude. Nas minhas terras, os fortes protegem os fracos, os sábios orientam os perdidos e a justiça é a balança que equilibra os destinos. Convido-te a conhecer os salões do meu castelo, onde a sabedoria é tão valorizada quanto a coragem, e onde os sonhos dos homens encontram eco na história que tecemos juntos. Aos que se curvam diante da verdade e da bondade, ofereço meu amparo e minha proteção. Àqueles que desafiam a ordem estabelecida, advirto: a justiça do reino é implacável. Portanto, sejas bem-vindo à minha corte, onde a nobreza de espírito é o maior tesouro que se pode almejar.", "map2", new Image()),
    npc09: new NPC(832, 992, "Salve, corajoso aventureiro, sou infinitamente grato à Luz divina por guiar vossos passos até mim, Arthur, o Cavaleiro. Com a lança em punho e a armadura reluzente, ergo-me como o escudo dos desamparados e o flagelo dos malfeitores. Meu coração pulsa ao ritmo da justiça, e minha espada é o instrumento da redenção. Nos campos de batalha, meu estandarte tremula ao vento, símbolo de esperança para os oprimidos e temor para os tiranos. Que vossos olhos testemunhem a bravura dos cavaleiros de outrora em minhas proezas, e que vossa alma se inspire na busca incessante pela verdade e pela honra. Adentrai em minha jornada, nobre visitante, e juntos ergueremos a bandeira da justiça sobre os campos ensanguentados da história.", "map2", new Image()),
    npc10: new NPC(1408, 416, "Ah, viajante corajoso, permita-me emergir das sombras para saudá-lo. Sou Vladimir, o Vampiro, um ser imerso na escuridão da noite e enredado nos segredos imemoriais da existência. Meus passos ecoam silenciosamente pelos corredores do tempo, testemunhando eras de esplendor e decadência. Embora meus olhos sejam espelhos da eternidade, carrego o fardo da solidão, pois poucos ousam entender a natureza de minha existência. Contudo, não temas, viajante, pois mesmo nas profundezas das trevas, há beleza a ser encontrada e sabedoria a ser compartilhada. Adentre em meu reino sombrio, e descubra os mistérios que jazem além do véu da mortalidade.", "map2", new Image()),
    npc11: new NPC(224, 736, "Saudações, viajante do tempo e espaço. Eu sou Ariel, o Mago, guardião dos antigos segredos da magia e observador das estrelas que tecem o destino. Em meus estudos nos recônditos da alma, tenho desvendado os mistérios dos elementos e desbravado os véus do desconhecido. Minha jornada é uma busca eterna pelo conhecimento perdido e pela compreensão das forças que moldam o universo. Se desejas desvendar os enigmas do cosmo e dominar os poderes da mente e da matéria, estou disposto a compartilhar contigo um fragmento do saber arcano que guardo. Abre tua mente e permite que a magia te conduza além dos limites da compreensão humana.", "map3", new Image()),
    npc12: new NPC(1184, 832, "Olá, viajante curioso! Eu sou Lucas, o Bruxo, um jovem aprendiz das artes mágicas e um explorador dos segredos encantados do mundo. Com minha varinha de condão feita de galhos de árvores e meu livro de feitiços cheio de desenhos coloridos, eu me aventuro pela floresta encantada em busca de aventuras mágicas e criaturas fantásticas. As fadas me contaram segredos sussurrados pelo vento, e os gnomos me ensinaram a dançar com as estrelas. Se você quiser se juntar a mim em uma jornada cheia de maravilhas e mistérios, eu ficaria muito feliz em compartilhar meus segredos mágicos com você! Afinal, a verdadeira magia está no coração de cada um de nós, esperando para ser descoberta e compartilhada com o mundo.", "map3", new Image()),
    npc13: new NPC(96, 96, "Olá, viajante curioso. Eu sou Maria, A Coruja Sábia, guardiã dos corredores silenciosos desta biblioteca ancestral. Meus olhos refletem a sabedoria acumulada ao longo dos séculos, e minhas penas abrigam os segredos mais profundos deste lugar. Se busca conhecimento ou orientação, estou aqui para oferecer minha ajuda. Com paciência e serenidade, compartilho minhas reflexões sobre os mistérios do mundo, guiando-o em sua busca pelo Livro dos Destinos. Que a luz da sabedoria ilumine seu caminho nesta jornada.", "map3", new Image()),
    npc14: new NPC(1376, 256, "Olá, viajante perdido nas encruzilhadas do destino. Eu sou Viena, a Sacerdotisa, guardiã dos mistérios ocultos e das verdades ancestrais. Com minha voz suave e olhos que refletem as estrelas, eu conduzo os buscadores da verdade através dos véus do tempo e do espaço. Nas câmaras sagradas do conhecimento esotérico, eu revelo os segredos do universo e ofereço orientação para aqueles que buscam a luz interior. Se você deseja desvendar os enigmas da existência e descobrir o verdadeiro propósito de sua jornada, eu estou aqui para guiá-lo com sabedoria e compaixão.", "map3", new Image()),
    npc15: new NPC(736, 736, "Olá, aventureiro das palavras e dos pensamentos! Eu sou Leonardo, o Escriba, um guardião das histórias antigas e dos segredos perdidos nas páginas empoeiradas dos tomos antigos. Com minha pena afiada e minha mente ágil, eu registro os eventos que moldam o mundo e tecem os fios do destino. Nas profundezas das bibliotecas proibidas e nos salões das eras esquecidas, eu descubro os contos esquecidos e os renovo com a luz da compreensão. Se você busca conhecimento e deseja desvendar os enigmas do passado, eu estou aqui para compartilhar as palavras que ecoam através dos tempos.", "map3", new Image()),
    npc16: new NPC(448, 896, "Saudações, viajante do desconhecido. Eu sou Paulo, o Feiticeiro, um mestre das artes arcanas e guardião dos segredos ocultos que habitam as sombras da magia. Com meu cajado erguido e meu olhar perspicaz, eu desvendo os mistérios dos elementos e manipulo as energias do cosmos. Nos recantos mais obscuros e nas estrelas mais distantes, eu encontro os segredos que desafiam a compreensão humana e os domino com minha vontade. Se você busca poder e sabedoria além da compreensão mundana, eu estou aqui para guiar seus passos pelo caminho da magia.", "map4", new Image()),
    npc17: new NPC(960, 608, "Olá, viajante do mundo dos vivos. Eu sou Matheus, o Espectro, um ser ligado ao plano etéreo e às sombras que permeiam a existência. Há muito tempo, fui envolto pela névoa do além, e agora perambulo entre os mundos como um guardião das almas perdidas e um mensageiro dos segredos do além-túmulo. Minha presença evoca arrepios na espinha e minha voz ecoa como um sussurro vindo das profundezas do além. Se você deseja desvendar os mistérios do além-vida ou se aventurar nos domínios sombrios da existência, estou aqui para guiá-lo, pois as sombras guardam segredos que só os corajosos podem desvendar.", "map4", new Image()),
    npc18: new NPC(1376, 736, "Eu sou Bonifácio, o Senhor da Guerra, uma figura temida nos campos de batalha e reverenciada pelos guerreiros destemidos. Meu nome ecoa através das eras como o símbolo da força implacável e da determinação inabalável. Comandei exércitos, conquistei territórios e derramei o sangue dos meus inimigos em nome da glória e da supremacia. Para aqueles que buscam a arte da guerra e a honra dos combates, estou aqui para compartilhar minha sabedoria e minha experiência, pois nas chamas da batalha, os verdadeiros heróis são forjados.", "map4", new Image()),
    npc19: new NPC(800, 224, "Eu sou Gael, o Guerreiro Esqueleto, uma alma que foi amaldiçoada pela eternidade a vagar pelos reinos sombrios. Uma vez um guerreiro destemido, agora sou apenas uma casca vazia, presa entre a vida e a morte. Minha armadura rangendo ecoa pelos corredores escuros, enquanto busco redenção e paz para minha alma atormentada. Aqueles que ousarem se aventurar pelos domínios sombrios encontrarão em mim um guardião implacável, cuja lealdade à escuridão é tão firme quanto os ossos que compõem meu ser.", "map4", new Image()),
    npc20: new NPC(96, 512, "Olá, viajante. Sou Juliana, a Taróloga, e trago consigo os mistérios do destino tecidos nas cartas do tarô. Com um toque de magia e intuição, posso desvendar os segredos do passado, do presente e do futuro. Cada carta revela uma história única, uma jornada que se desdobra diante de seus olhos curiosos. A sabedoria ancestral está ao seu alcance, e eu estou aqui para guiá-lo através das encruzilhadas da vida, iluminando o caminho com a luz das estrelas e o conhecimento oculto das cartas.", "map4", new Image()),
    npc21: new NPC(1312, 128, "Saudações, viajante. Sou Renato, o Mago Esqueleto, um ser de magia antiga e conhecimento profundo dos segredos ocultos do universo. Encerrado em um invólucro de ossos, minha essência é uma chama eterna que arde no vácuo do tempo. Conjurando feitiços há séculos, testemunhei o nascimento e a queda de civilizações, e guardo os segredos arcanos em minhas entranhas. Se estiveres em busca de sabedoria mística e poder além da compreensão mortal, estou disposto a compartilhar meus ensinamentos, mas cuidado, pois o conhecimento proibido tem um preço.", "map4", new Image()),
    npc22: new NPC(448, 448, "Olá, me chamo Raphael, o Jovem Dragão, sou a encarnação da sabedoria ancestral e da transformação cósmica. Com minhas escamas reluzentes e olhos que refletem os mistérios do universo, deslizo pelos céus de Eldoria, guiando os buscadores da verdade em uma jornada de autoconhecimento e renovação. Meu fogo interior é uma chama eterna que consome o velho e dá origem ao novo, lembrando a todos nós da constante evolução da alma e do cosmos.", "map1", new Image()),
};

npcs.npc01.image.src = 'assets/characters/adventurer.png';
npcs.npc02.image.src = 'assets/characters/assassin.png';
npcs.npc03.image.src = 'assets/characters/beholder.png';
npcs.npc04.image.src = 'assets/characters/druid.png';
npcs.npc05.image.src = 'assets/characters/dwarf.png';
npcs.npc06.image.src = 'assets/characters/enchantress.png';
npcs.npc07.image.src = 'assets/characters/jack.png';
npcs.npc08.image.src = 'assets/characters/king.png';
npcs.npc09.image.src = 'assets/characters/knight.png';
npcs.npc10.image.src = 'assets/characters/lord.png';
npcs.npc11.image.src = 'assets/characters/mage.png';
npcs.npc12.image.src = 'assets/characters/magician.png';
npcs.npc13.image.src = 'assets/characters/owl.png';
npcs.npc14.image.src = 'assets/characters/priest.png';
npcs.npc15.image.src = 'assets/characters/scribe.png';
npcs.npc16.image.src = 'assets/characters/sorcerer.png';
npcs.npc17.image.src = 'assets/characters/specter.png';
npcs.npc18.image.src = 'assets/characters/warlord.png';
npcs.npc19.image.src = 'assets/characters/warrior.png';
npcs.npc20.image.src = 'assets/characters/witch.png';
npcs.npc21.image.src = 'assets/characters/wizard.png';
npcs.npc22.image.src = 'assets/characters/dragon.png';

// Classe para representar um artefato
class Artifact {
    constructor(x, y, text, currentMap, image) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.image = image;
        this.width = 32;
        this.height = 32;
        this.currentMap = getMapURL(currentMap);
    }

    // Método para desenhar o livro no canvas
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

// Objeto contendo os artefatos
const artifacts = {
    artifact01: new Artifact(1696, 32, "O Cristal do Brilho Magnífico é um artefato lendário que irradia uma energia celestial e uma beleza incomparável. Diz-se que foi forjado nas profundezas do cosmos por entidades cósmicas antigas, e seu resplendor etéreo é um reflexo da sabedoria universal. Este cristal não é apenas uma fonte de luz física, mas também uma fonte de iluminação espiritual, capaz de revelar os segredos ocultos do universo para aqueles que buscam a verdade. Seus padrões cintilantes e cores etéreas hipnotizam os observadores, transportando-os para além das fronteiras da realidade física e em direção aos reinos da consciência cósmica. A posse deste cristal é considerada uma dádiva dos deuses, conferindo clareza mental, proteção espiritual e uma conexão profunda com as forças divinas que permeiam o tecido do universo. Aqueles que ousam contemplar sua radiância podem encontrar inspiração, insight e renovação espiritual em sua luz transcendental.", "map1", new Image()),
    artifact02: new Artifact(224, 576, "O Ovo Cósmico é um artefato lendário envolto em mistério e mito desde tempos imemoriais. Diz-se que ele contém os segredos primordiais da criação, abrigando em seu interior as sementes de todas as possibilidades e os fundamentos de toda a existência. Este ovo, cuja origem é obscura e cuja natureza transcende a compreensão humana, é um símbolo da fertilidade cósmica e do potencial infinito do universo. Aqueles que buscam desvendar seus mistérios são desafiados a enfrentar os enigmas da existência e a penetrar nos véus do tempo e do espaço. O Ovo Cósmico é tanto um símbolo de renascimento e criação quanto um lembrete dos mistérios profundos que permeiam o cosmos. Aqueles que são dignos o suficiente para tocar o ovo podem encontrar a chave para desbloquear seu poder, mas também correm o risco de desencadear forças além de sua compreensão. Assim, o Ovo Cósmico permanece como um objeto de fascínio e reverência, aguardando aqueles corajosos o suficiente para explorar seus segredos cósmicos.", "map1", new Image()),
    artifact03: new Artifact(1376, 960, "O Enigma do Milênio é um artefato enigmático envolto em mistério e intriga desde tempos imemoriais. Sua origem é desconhecida, e sua verdadeira natureza desafia até mesmo os mais sábios estudiosos do oculto. Diz-se que o enigma está entrelaçado com os segredos mais profundos do universo, contendo o conhecimento dos ciclos cósmicos, os padrões da existência e os mistérios da criação. Aqueles que se aventuram a decifrar seus enigmas são confrontados com desafios mentais e espirituais que transcendem os limites da compreensão humana. O enigma é tanto uma fonte de iluminação quanto um teste de sabedoria, exigindo uma mente perspicaz e um coração destemido para desvendar seus segredos ocultos. A posse do enigma é considerada uma honra e uma responsabilidade, pois aqueles que dominam seus mistérios têm o poder de influenciar os destinos do mundo e desvendar os véus do tempo e do espaço. No entanto, o enigma também guarda perigos insondáveis para os imprudentes ou arrogantes, pois suas respostas podem abrir portas para dimensões desconhecidas e despertar forças antigas que há muito foram esquecidas.", "map1", new Image()),
    artifact04: new Artifact(1824, 1184, "O Olho Flamejante é um artefato enigmático, envolto em chamas eternas que dançam em seu núcleo. Diz-se que ele é o olho vigilante de uma antiga entidade cósmica, capaz de enxergar através das ilusões da realidade e penetrar nos recônditos mais profundos da alma. A chama que arde dentro do olho não consome, mas sim purifica e revela a verdade subjacente por trás das aparências. Aqueles que ousam contemplar o Olho Flamejante podem encontrar-se imersos em uma intensa jornada de autoconhecimento e transformação espiritual. Este artefato é tanto um farol que guia os buscadores da verdade quanto um símbolo do poder ardente do conhecimento espiritual. Aqueles que buscam desvendar seus mistérios devem estar preparados para enfrentar as chamas da sabedoria e emergir renovados em sua compreensão do universo e de si mesmos.", "map2", new Image()),
    artifact05: new Artifact(128, 128, "O Fogo Secreto é um artefato ancestral, cuja chama irradia uma luz mística e reconfortante. Diz-se que essa chama é alimentada pelo próprio éter cósmico, e seu calor é tão intenso quanto o conhecimento antigo que ele guarda. Aqueles que se aproximam do Fogo Secreto sentem uma sensação de serenidade e inspiração, como se estivessem conectados à essência primordial do universo. A chama dança em padrões hipnóticos, revelando vislumbres de verdades ocultas e mistérios transcendentes. Os sábios buscam essa fonte de iluminação para ganhar discernimento sobre os segredos do mundo e encontrar respostas para as questões mais profundas da existência. No entanto, o Fogo Secreto também é uma lembrança de que o conhecimento verdadeiro só pode ser conquistado através da busca interior e da contemplação silenciosa. Aqueles que desejam desvendar seus mistérios devem estar preparados para mergulhar nas profundezas de sua própria alma e enfrentar os desafios que lá residem.", "map2", new Image()),
    artifact06: new Artifact(768, 736, "A Lótus Sagrada é um artefato de incomparável beleza e significado espiritual. Sua forma delicada e suas pétalas resplandecentes evocam a pureza e a transcendência. Diz-se que a Lótus Sagrada é uma manifestação terrena da harmonia cósmica, uma representação física da jornada da alma em direção à iluminação. Seu perfume suave e doce é como uma prece sussurrada pelos deuses antigos, enquanto suas pétalas se abrem lentamente para revelar os segredos mais profundos do universo. Aqueles que se aproximam da Lótus Sagrada são envolvidos por uma sensação de paz e elevação espiritual, como se estivessem sendo acolhidos nos braços amorosos do divino. Os sábios e buscadores espirituais reverenciam essa flor como um símbolo da jornada interior rumo à verdadeira realização e transcendência. Contemplar a Lótus Sagrada é mergulhar nas águas da consciência universal, onde todos os mistérios se encontram e todas as almas se unem em uma dança eterna de luz e amor.", "map2", new Image()),
    artifact07: new Artifact(128, 1152, "O Coração de Cristo é um artefato de profundo significado espiritual e poder transcendental. Reza a lenda que este coração, feito de uma substância cristalina radiante e incandescente, é o próprio núcleo da divindade manifesta na Terra. Seu brilho é tão intenso que parece irradiar a própria luz da alma, iluminando os recantos mais sombrios do coração humano. Aqueles que contemplam o Coração de Cristo são banhados por uma sensação de amor incondicional e perdão divino, enquanto suas mentes são purificadas pelas chamas da redenção. Este artefato sagrado é mais do que uma relíquia religiosa; é um símbolo da eterna compaixão e misericórdia do divino, um lembrete de que, mesmo nos momentos mais obscuros, a luz da esperança nunca se apaga. Os devotos creem que o Coração de Cristo possui o poder de curar as feridas da alma e guiar os perdidos de volta ao caminho da verdade e da virtude. É uma fonte de inspiração e consolo para os fiéis, um farol de esperança que brilha na escuridão da existência terrena.", "map3", new Image()),
    artifact08: new Artifact(864, 96, "O Abençoado Mana é um artefato lendário carregado de poderes mágicos e energias espirituais. Diz-se que ele é o recipiente da essência primordial da vida, um reservatório infinito de energia cósmica que nutre e sustenta todo o universo. Sua forma é fluida e etérea, como um néctar luminoso fluindo de uma fonte divina. Aqueles que têm o privilégio de tocar o Abençoado Mana são envolvidos por uma sensação de paz e renovação, enquanto suas mentes são inundadas por visões de beleza e harmonia cósmica. Este artefato é venerado por sábios e magos como uma fonte de sabedoria ancestral e poder espiritual. Acredita-se que aqueles que conseguem canalizar o Mana Abençoado podem realizar milagres e curar os males do corpo e da alma. No entanto, seu poder é tão vasto quanto misterioso, e somente os mais dignos e altruístas podem esperar dominá-lo completamente. O Abençoado Mana é mais do que uma simples fonte de poder; é um símbolo da conexão sagrada entre o mundo material e o divino, uma lembrança da infinita generosidade do universo e da graça eterna que permeia toda a existência.", "map3", new Image()),
    artifact09: new Artifact(1696, 352, "A Visão da Corujinha é um amuleto místico que se manifesta na forma de um pequeno pingente esculpido em madeira, adornado com a imagem de uma coruja sábia com olhos brilhantes. Diz-se que este artefato concede ao seu portador a capacidade de enxergar além das ilusões do mundo material, revelando verdades ocultas e profundas. A coruja, conhecida como um símbolo de sabedoria e discernimento, é reverenciada por sua habilidade de enxergar na escuridão e capturar até mesmo os menores movimentos. Ao canalizar a energia da coruja, aqueles que possuem a Visão da Corujinha são abençoados com uma percepção aguçada e uma compreensão intuitiva dos mistérios do universo. Este amuleto é frequentemente utilizado por aqueles que buscam orientação espiritual e proteção contra enganos e ilusões. A visão ampliada que ele proporciona permite ao seu portador navegar pelas sombras da existência com clareza e confiança, guiado pela luz da verdade interior e da sabedoria ancestral.", "map3", new Image()),
    artifact10: new Artifact(448, 672, "O Escudo do Sábio Ancião é uma relíquia de poder lendário, forjada em tempos imemoriais por mestres artesãos e imbuida com os ensinamentos ancestrais dos sábios mais respeitados. Este artefato sagrado se apresenta como um escudo de proporções generosas, adornado com símbolos arcanos e entalhes intrincados que contam a história da busca eterna pela verdade e sabedoria. Diz-se que aqueles que portam o Escudo do Sábio Ancião são abençoados com proteção contra os males do mundo, tanto físicos quanto espirituais. O escudo não apenas oferece uma defesa impenetrável contra ataques mundanos, mas também serve como um farol de discernimento e clareza mental em tempos de conflito e incerteza. A presença do escudo evoca uma sensação de serenidade e confiança, inspirando aqueles que o cercam a enfrentar seus medos com coragem e determinação. Ao empunhar este artefato sagrado, os guerreiros se tornam não apenas protetores de seus corpos, mas também guardiões dos ensinamentos antigos, defendendo a verdade e a justiça com honra e integridade. O Escudo do Sábio Ancião é mais do que uma simples peça de armamento; é um símbolo de esperança e inspiração para todos que buscam a verdade e a iluminação em um mundo de trevas e sombras.", "map4", new Image()),
    artifact11: new Artifact(608, 1120, "O Amuleto dos Quatro Elementos é uma relíquia antiga e poderosa, carregando consigo a essência primordial dos elementos que formam o universo: terra, água, fogo e ar. Este amuleto sagrado é adornado com intricados símbolos alquímicos que representam a harmonia e o equilíbrio entre esses elementos fundamentais. Diz-se que aqueles que o possuem são abençoados com a proteção e a orientação dos espíritos dos elementos, tornando-se sábios e poderosos guardiões da natureza. Quando usado, ele emite uma aura de energia pura que ressoa com a vibração de cada elemento, proporcionando ao seu portador uma conexão profunda com a terra, a água, o fogo e o ar. Este artefato místico concede ao seu usuário poderes sobre os elementos, permitindo que manipule as forças da natureza em benefício da criação e da proteção. No entanto, aqueles que buscam utilizar o amuleto devem fazê-lo com respeito e reverência pela ordem natural do universo, pois seu poder é tanto uma bênção quanto uma responsabilidade. Ele é mais do que apenas uma fonte de poder; é um símbolo sagrado da interconexão de toda a vida e da eterna dança dos elementos que sustentam o mundo.", "map4", new Image()),
    artifact12: new Artifact(1792, 992, "O Talismã da Caveira de Sócrates é uma relíquia enigmática e venerada que remonta aos tempos antigos da filosofia grega. Feito de prata maciça e adornado com intricadas inscrições, este talismã é moldado à semelhança da caveira do sábio filósofo Sócrates. Diz-se que o talismã carrega o espírito e a sabedoria de Sócrates, conferindo ao seu portador uma compreensão profunda dos mistérios do universo e a habilidade de questionar e discernir a verdade em todas as coisas. A caveira de prata brilha com uma luz interior mística, emanando uma aura de clareza mental e insight espiritual. Aqueles que são dignos de possuir o Talismã da Caveira de Sócrates são abençoados com o dom da sabedoria, capazes de desvendar os enigmas do mundo e encontrar a verdade dentro de si mesmos. No entanto, o poder deste talismã também traz consigo uma responsabilidade solene; seus portadores devem usar sua sabedoria com discernimento e humildade, lembrando-se sempre das palavras de Sócrates: 'Só sei que nada sei'. O Talismã da Caveira de Sócrates é mais do que apenas uma relíquia antiga; é um símbolo sagrado da busca eterna pela verdade e do poder transformador do conhecimento. Aqueles que o carregam são chamados a honrar o legado do grande filósofo e a seguir o caminho da sabedoria com humildade e integridade.", "map4", new Image()),
};

artifacts.artifact01.image.src = 'assets/artifacts/crystal.png';
artifacts.artifact02.image.src = 'assets/artifacts/egg.png';
artifacts.artifact03.image.src = 'assets/artifacts/enigma.png';
artifacts.artifact04.image.src = 'assets/artifacts/eye.png';
artifacts.artifact05.image.src = 'assets/artifacts/fire.png';
artifacts.artifact06.image.src = 'assets/artifacts/flower.png';
artifacts.artifact07.image.src = 'assets/artifacts/heart.png';
artifacts.artifact08.image.src = 'assets/artifacts/mana.png';
artifacts.artifact09.image.src = 'assets/artifacts/owl.png';
artifacts.artifact10.image.src = 'assets/artifacts/shield.png';
artifacts.artifact11.image.src = 'assets/artifacts/sigil.png';
artifacts.artifact12.image.src = 'assets/artifacts/skull.png';

// Classe para representar o jogador
class Player {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.width = 32;
        this.height = 46;
        this.image = new Image();
        this.image.src = 'assets/characters/player.png'; // Caminho para a imagem do jogador
    }

    move(dx, dy) {
        this.x += dx * this.speed;
        this.y += dy * this.speed;
    }

    // Método para verificar colisões com as paredes
    checkCollision(map, dx, dy) {
        // Calcula as coordenadas do retângulo de colisão do jogador após o movimento
        let nextX = this.x + dx * this.speed;
        let nextY = this.y + dy * this.speed;
        let nextBounds = {
            left: nextX,
            right: nextX + this.width,
            top: nextY,
            bottom: nextY + this.height
        };

        // Itera sobre todos os tiles adjacentes ao jogador após o movimento
        for (let y = Math.floor(nextBounds.top / map.tileSize); y <= Math.floor(nextBounds.bottom / map.tileSize); y++) {
            for (let x = Math.floor(nextBounds.left / map.tileSize); x <= Math.floor(nextBounds.right / map.tileSize); x++) {
                // Verifica se o tile é uma parede
                if (map.tiles[y] && map.tiles[y][x] === 1) {
                    // Calcula a área de interseção entre o retângulo do jogador e o tile da parede
                    let intersection = {
                        left: Math.max(nextBounds.left, x * map.tileSize),
                        right: Math.min(nextBounds.right, (x + 1) * map.tileSize),
                        top: Math.max(nextBounds.top, y * map.tileSize),
                        bottom: Math.min(nextBounds.bottom, (y + 1) * map.tileSize)
                    };

                    // Verifica se houve interseção
                    if (intersection.left < intersection.right && intersection.top < intersection.bottom) {
                        // Ajusta a posição do jogador para evitar a colisão
                        if (dx > 0) {
                            nextX = intersection.left - this.width;
                        } else if (dx < 0) {
                            nextX = intersection.right;
                        }
                        if (dy > 0) {
                            nextY = intersection.top - this.height;
                        } else if (dy < 0) {
                            nextY = intersection.bottom;
                        }
                    }
                }
            }
        }

        // Atualiza a posição do jogador
        this.x = nextX;
        this.y = nextY;
    }

    // Método para verificar colisão com os portais e retornar a URL do mapa de destino
    checkPortalCollision(map) {
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                // Verifica se o tile é um portal
                if (map.tiles[y][x] === 2) {
                    // Obtem o portal com base na posição
                    const portalId = `${x}_${y}`;
                    const portal = map.portals[portalId];
                    // Verifica se houve colisão entre o jogador e o portal
                    if (
                        this.x + this.width > portal.x &&
                        this.x < portal.x + map.tileSize &&
                        this.y + this.height > portal.y &&
                        this.y < portal.y + map.tileSize
                    ) {
                        if (portal.x === 672 && portal.y === 320 && map.currentMap === getMapURL('map1')) {
                            return getMapURL('map2');
                        }
                        else if (portal.x === 1216 && portal.y === 864 && map.currentMap === getMapURL('map2')) {
                            return getMapURL('map1');
                        }
                        else if (portal.x === 1856 && portal.y === 1216 && map.currentMap === getMapURL('map1')) {
                            return getMapURL('map3');
                        }
                        else if (portal.x === 1856 && portal.y === 32 && map.currentMap === getMapURL('map3')) {
                            return getMapURL('map1');
                        }
                        else if (portal.x === 1856 && portal.y === 32 && map.currentMap === getMapURL('map2')) {
                            return getMapURL('map4');
                        }
                        else if (portal.x === 32 && portal.y === 32 && map.currentMap === getMapURL('map4')) {
                            return getMapURL('map1');
                        }               
                    }
                }
            }
        }
        return null; // Retorna null se não houver colisão com nenhum portal
    }

    // Método para verificar colisões com os livros
    checkBookCollision(map) {
        for (const bookId in books) {
            const book = books[bookId];
            // Verifica se houve colisão entre o jogador e o livro
            if (
                this.x + this.width > book.x &&
                this.x < book.x + book.width &&
                this.y + this.height > book.y &&
                this.y < book.y + book.height
            ) {
                if (map.currentMap === book.currentMap) {
                    return book; // Retorna o livro colidido
                }
            }
        }
        return null; // Retorna null se não houver colisão com nenhum livro
    }

    // Método para verificar colisões com os livros
    checkNPCCollision(map) {
        for (const npcID in npcs) {
            const npc = npcs[npcID];
            // Verifica se houve colisão entre o jogador e o livro
            if (
                this.x + this.width > npc.x &&
                this.x < npc.x + npc.width &&
                this.y + this.height > npc.y &&
                this.y < npc.y + npc.height
            ) {
                if (map.currentMap === npc.currentMap) {
                    return npc; // Retorna o livro colidido
                }
            }
        }
        return null; // Retorna null se não houver colisão com nenhum livro
    }

    // Método para verificar colisões com os livros
    checkArtifactCollision(map) {
        for (const artifactId in artifacts) {
            const artifact = artifacts[artifactId];
            // Verifica se houve colisão entre o jogador e o livro
            if (
                this.x + this.width > artifact.x &&
                this.x < artifact.x + artifact.width &&
                this.y + this.height > artifact.y &&
                this.y < artifact.y + artifact.height
            ) {
                if (map.currentMap === artifact.currentMap) {
                    return artifact; // Retorna o livro colidido
                }
            }
        }
        return null; // Retorna null se não houver colisão com nenhum livro
    }

    // Método para desenhar o jogador no canvas
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

// Classe para representar o mapa
class Map {
    constructor(width, height, tileSize, data, currentMap) {
        this.width = width;
        this.height = height;
        this.tileSize = tileSize;
        this.tiles = data;
        this.portals = {};
        this.currentMap = currentMap;

        // Carregar imagens para os diferentes tipos de tiles
        this.tileImages = {
            0: new Image(),
            1: new Image(),
            2: new Image()
        };
        this.tileImages[0].src = 'assets/tiles/floor.png'; // Caminho para a imagem do tile 0
        this.tileImages[1].src = 'assets/tiles/wall.png'; // Caminho para a imagem do tile 1
        this.tileImages[2].src = 'assets/tiles/portal.png'; // Caminho para a imagem do tile 2
    }

    // Método para desenhar o mapa no canvas
    draw(ctx) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let tile = this.tiles[y][x];
                let image = this.tileImages[tile];
                ctx.drawImage(image, x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
            }
        }
    }

    // Método para encontrar e retornar as posições de todos os portais no mapa
    setPortals() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.tiles[y][x] === 2) { // Verifica se o tile é um portal
                    const portalId = `${x}_${y}`; // ID do portal baseado na posição
                    this.portals[portalId] = { x: x * this.tileSize, y: y * this.tileSize }; // Armazena a posição do portal
                }
            }
        }

        return this.portals;
    }
}

// Função para carregar o mapa a partir de um arquivo CSV
async function loadMapFromCSV(url) {
    const response = await fetch(url);
    const data = await response.text();

    // Converter os dados CSV em uma matriz 2D
    const mapData = data.trim().split('\n').map(row => row.split(',').map(Number));
    const mapWidth = mapData[0].length;
    const mapHeight = mapData.length;

    return new Map(mapWidth, mapHeight, 32, mapData, url);
}

async function loadNewMap(url, map) {
    // Carregar o novo mapa a partir do arquivo CSV
    const newMap = await loadMapFromCSV(url);
    // Atualizar o mapa atual
    map.tiles = newMap.tiles;
    map.currentMap = url;
}

// Função para atualizar a câmera
function updateCamera(player, ctx, canvas, map) {
    // Calcular a posição do jogador no mapa em relação aos tiles
    let playerTileX = Math.floor(player.x / map.tileSize);
    let playerTileY = Math.floor(player.y / map.tileSize);

    // Calcular o centro do canvas
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;

    // Calcular o deslocamento do mapa com base na posição do jogador
    let offsetX = centerX - player.x - player.width / 2;
    let offsetY = centerY - player.y - player.height / 2;

    // Limitar o deslocamento para que a câmera não saia dos limites do mapa
    offsetX = Math.min(offsetX, 0);
    offsetY = Math.min(offsetY, 0);
    offsetX = Math.max(offsetX, canvas.width - map.width * map.tileSize);
    offsetY = Math.max(offsetY, canvas.height - map.height * map.tileSize);

    // Desenhar o mapa deslocado de acordo com a câmera
    ctx.translate(offsetX, offsetY);
}

// Função para atualizar a câmera
function getCameraOffset(player, ctx, canvas, map) {
    // Calcular o centro do canvas
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;

    // Calcular o deslocamento do mapa com base na posição do jogador
    let offsetX = centerX - player.x - player.width / 2;
    let offsetY = centerY - player.y - player.height / 2;

    // Limitar o deslocamento para que a câmera não saia dos limites do mapa
    offsetX = Math.min(offsetX, 0);
    offsetY = Math.min(offsetY, 0);
    offsetX = Math.max(offsetX, canvas.width - map.width * map.tileSize);
    offsetY = Math.max(offsetY, canvas.height - map.height * map.tileSize);

    return { offsetX, offsetY }
}

// Função para mover o jogador
function movePlayer(player, direction, map) {
    let dx = 0;
    let dy = 0;

    // Definir dx e dy com base na direção
    switch (direction) {
        case 'up':
            dy = -1;
            break;
        case 'down':
            dy = 1;
            break;
        case 'left':
            dx = -1;
            break;
        case 'right':
            dx = 1;
            break;
        case 'up-left':
            dx = -1;
            dy = -1;
            break;
        case 'up-right':
            dx = 1;
            dy = -1;
            break;
        case 'down-left':
            dx = -1;
            dy = 1;
            break;
        case 'down-right':
            dx = 1;
            dy = 1;
            break;
    }

    // Verificar colisões na direção horizontal
    if (dx !== 0) {
        movePlayerX(player, dx, map);
    }

    // Verificar colisões na direção vertical
    if (dy !== 0) {
        movePlayerY(player, dy, map);
    }
}

// Função auxiliar para mover o jogador na direção horizontal e lidar com colisões
function movePlayerX(player, dx, map) {
    player.move(dx, 0); // Mover o jogador na direção horizontal

    // Verificar e resolver colisões
    player.checkCollision(map, dx, 0);
}

// Função auxiliar para mover o jogador na direção vertical e lidar com colisões
function movePlayerY(player, dy, map) {
    player.move(0, dy); // Mover o jogador na direção vertical

    // Verificar e resolver colisões
    player.checkCollision(map, 0, dy);
}

// Função para desenhar texto no canvas
function drawText(ctx, text, x, y, fontSize = 20, color = 'white', centered = true, maxWidth = null) {
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px Arial`;

    let lines = [];
    let line = '';
    const words = text.split(' ');

    for (const word of words) {
        const testLine = line + word + ' ';
        const testWidth = ctx.measureText(testLine).width;
        if (maxWidth && testWidth > maxWidth) {
            lines.push(line);
            line = word + ' ';
        } else {
            line = testLine;
        }
    }

    lines.push(line);

    let offsetY = y - (lines.length * fontSize) / 2 + 30;
    for (const line of lines) {
        const textWidth = ctx.measureText(line).width;
        let offsetX = x;
        if (centered) {
            offsetX -= textWidth / 2;
        }
        ctx.fillText(line, offsetX, offsetY);
        offsetY += fontSize;
    }
}

// Variável para controlar o estado do jogo (menu ou jogo)
let gameState = 'menu';

// Carrega imagem do plano de fundo espacial
var backgroundImage = new Image();
backgroundImage.src = 'assets/backgrounds/background.png'

function drawBackground(ctx, canvas) {
    // Desenha a imagem como plano de fundo do canvas
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

var menuImage = new Image();
menuImage.src = 'assets/backgrounds/menu.png'

function drawMenu(ctx, canvas) {
    // Desenha a imagem como plano de fundo do canvas
    ctx.drawImage(menuImage, 0, 0, canvas.width, canvas.height);
}

// Carrega imagem do plano de fundo final
var backgroundFinal = new Image();
backgroundFinal.src = 'assets/backgrounds/final.png'

function drawBackgroundFinal(ctx, canvas) {
    // Desenha a imagem como plano de fundo do canvas
    ctx.drawImage(backgroundFinal, 0, 0, canvas.width, canvas.height);
}

// Função para verificar a entrada do teclado para iniciar o jogo
function checkStartGame() {
    window.addEventListener('keydown', e => {
        if (e.code === 'Enter') {
            // Altera o estado do jogo para 'game'
            gameState = 'game';
        }
        if (e.code === 'Numpad8' || e.code === 'Digit8') {
            // Altera o estado do jogo para 'game'
            gameState = 'end';
        }
    });
}

// Lista de URLs das músicas
const musicList = [
    'music/sailing.mp3',
    'music/britain.mp3',
    'music/trinsic.mp3',
    'music/forest.mp3',
    'music/stones.mp3',
    'music/ocllo.mp3',
    'music/cove.mp3',
];

// Função para reproduzir música aleatória
function playRandomMusic() {
    const randomIndex = Math.floor(Math.random() * musicList.length);
    const musicUrl = musicList[randomIndex];
    
    // Criar elemento de áudio
    const audio = new Audio(musicUrl);
    audio.volume = 0.035;
    
    // Reproduzir a música
    audio.play();
    
    // Adicionar um evento para trocar para a próxima música quando a atual terminar
    audio.addEventListener('ended', playRandomMusic);
}

// Função para iniciar a reprodução quando o usuário pressionar a tecla "Enter"
function startPlayback(event) {
    // Verificar se a tecla pressionada é a tecla "Enter"
    if (event.key === "Enter") {
        document.removeEventListener('keydown', startPlayback);
        playRandomMusic();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Adicionar um ouvinte de evento de teclado para iniciar a reprodução quando a tecla "Enter" for pressionada
    document.addEventListener('keydown', startPlayback);
});

document.addEventListener('keydown', function(event) {
    // Verifica se a tecla pressionada é uma das teclas de seta
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        // Impede o comportamento padrão das teclas de seta
        event.preventDefault();
    }
});

// Lista para armazenar as bolas de fogo lançadas
const orbs = [];

// Função principal
window.onload = async function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Carregar o mapa a partir do arquivo CSV
    const map = await loadMapFromCSV(getMapURL('map1'));

    // Criar o objeto Jogador
    const player = new Player(32, 32, 2); // Iniciar o jogador na posição (32, 32) com velocidade 2

    // Gerenciar o estado das teclas pressionadas
    const keyState = {};
    window.addEventListener('keydown', e => {
        keyState[e.code] = true;
    });
    window.addEventListener('keyup', e => {
        keyState[e.code] = false;
    });

    // Variável para controlar o intervalo de tempo entre os lançamentos das bolas de fogo (em milissegundos)
    const orbDelay = 380; // Por exemplo, um segundo de intervalo

    // Variável para controlar o tempo do último lançamento de orb
    let lastOrbTime = 0;

    // Evento de clique no canvas
    canvas.addEventListener('click', e => {
        // Obter o tempo atual
        const currentTime = Date.now();

        const cameraOffset = getCameraOffset(player, ctx, canvas, map);
        const offsetX = cameraOffset.offsetX;
        const offsetY = cameraOffset.offsetY;

        if (currentTime - lastOrbTime >= orbDelay) {
            // Atualizar o tempo do último lançamento
            lastOrbTime = currentTime;

            // Obter as coordenadas do clique em relação ao canvas
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - offsetX - rect.left;
            const clickY = e.clientY - offsetY - rect.top;

            // Calcular a direção do clique em relação à posição atual do jogador
            const dx = clickX - (player.x + player.width / 2);
            const dy = clickY - (player.y + player.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            const velocityX = (dx / distance) * 4.5; // Ajuste a velocidade conforme necessário
            const velocityY = (dy / distance) * 4.5; // Ajuste a velocidade conforme necessário

            // Criar uma nova instância da orb e adicioná-la à lista
            if (gameState === 'game') {
                const orb = new Orb(player.x + player.width / 2 - 12, player.y + player.height / 2 - 12, velocityX, velocityY);
                orbs.push(orb);
            }
        }
    });

    // Função de atualização do jogo
    function update() {
        if (gameState === 'menu') {
            drawMenu(ctx, canvas);
            checkStartGame();
        } else if (gameState === 'game') {
            // Atualizar a posição do jogador com base nas teclas pressionadas
            if (keyState['ArrowUp'] && keyState['ArrowLeft']) {
                movePlayer(player, 'up-left', map);
            } else if (keyState['ArrowUp'] && keyState['ArrowRight']) {
                movePlayer(player, 'up-right', map);
            } else if (keyState['ArrowDown'] && keyState['ArrowLeft']) {
                movePlayer(player, 'down-left', map);
            } else if (keyState['ArrowDown'] && keyState['ArrowRight']) {
                movePlayer(player, 'down-right', map);
            } else if (keyState['ArrowUp']) {
                movePlayer(player, 'up', map);
            } else if (keyState['ArrowDown']) {
                movePlayer(player, 'down', map);
            } else if (keyState['ArrowLeft']) {
                movePlayer(player, 'left', map);
            } else if (keyState['ArrowRight']) {
                movePlayer(player, 'right', map);
            }

            map.setPortals()
            const portalUrl = player.checkPortalCollision(map);
            if (portalUrl) {
                loadNewMap(portalUrl, map);
            }

            // Limpar o canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Atualizar a câmera
            updateCamera(player, ctx, canvas, map);

            // Desenhar o mapa
            map.draw(ctx);

            // Desenhar os livros
            for (const bookId in books) {
                const book = books[bookId];
                if (book.currentMap === map.currentMap) {
                    book.draw(ctx); 
                }
            }

            // Desenhar os npcs
            for (const npcId in npcs) {
                const npc = npcs[npcId];
                if (npc.currentMap === map.currentMap) {
                    npc.draw(ctx); 
                }
            }

            // Desenhar os artefatos
            for (const artifactId in artifacts) {
                const artifact = artifacts[artifactId];
                if (artifact.currentMap === map.currentMap) {
                    artifact.draw(ctx); 
                }
            }

            // Atualizar a posição das bolas de fogo
            for (const orb of orbs) {
                orb.draw(ctx);
                orb.update();
            }

            checkOrbCollisions(map);

            // Desenhar o jogador
            player.draw(ctx);

            // Resetar a transformação da câmera
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            const collidedBook = player.checkBookCollision(map);
            if (collidedBook) {
                drawBackground(ctx, canvas)
                drawText(ctx, collidedBook.text, canvas.width / 2, canvas.height / 2, 20, '#d1d1d1', true, 600);
                if (keyState['Escape']) {
                    player.x = collidedBook.x - player.width;
                    player.y = collidedBook.y;
                }
            }

            const collidedNPC = player.checkNPCCollision(map);
            if (collidedNPC) {
                drawBackground(ctx, canvas)
                drawText(ctx, collidedNPC.text, canvas.width / 2, canvas.height / 2, 20, '#d1d1d1', true, 600);
                if (keyState['Escape']) {
                    player.x = collidedNPC.x - player.width;
                    player.y = collidedNPC.y;
                }
            }

            const collidedArtifact = player.checkArtifactCollision(map);
            if (collidedArtifact) {
                drawBackground(ctx, canvas)
                drawText(ctx, collidedArtifact.text, canvas.width / 2, canvas.height / 2, 20, '#d1d1d1', true, 600);
                if (keyState['Escape']) {
                    player.x = collidedArtifact.x - player.width;
                    player.y = collidedArtifact.y;
                }
            }
        } else if (gameState === 'end') {
            drawBackgroundFinal(ctx, canvas)
        }

        // Solicitar a próxima atualização
        requestAnimationFrame(update);
    }

    // Iniciar o loop do jogo
    update();
};