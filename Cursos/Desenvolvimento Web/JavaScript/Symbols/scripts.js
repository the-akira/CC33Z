const symbols = [
  { 
    symbol: 'Raposa', 
    image: 'images/fox.jpeg', 
    meaning: 'Inteligência, Adaptabilidade, Brincadeira', 
    description: 'A raposa simboliza astúcia, inteligência e adaptabilidade, sendo vista em muitas culturas como um animal capaz de enganar, proteger e transformar-se conforme necessário. Representando sabedoria prática, ela aparece nas tradições japonesas como uma mensageira espiritual (kitsune) e, em lendas ocidentais, como um alerta de cautela, lembrando-nos da importância da flexibilidade e do discernimento para enfrentar desafios e se adaptar às mudanças.', 
    category: 'Natureza' 
  },
  { 
    symbol: 'Coruja', 
    image: 'images/owl.jpeg', 
    meaning: 'Sabedoria, Mistério, Intuição', 
    description: 'A coruja simboliza sabedoria, mistério e visão aguçada. Representada em várias culturas como um animal noturno que enxerga além das aparências, a coruja é vista como um guia para a introspecção e o conhecimento profundo. Ela é frequentemente associada ao mistério do inconsciente e à habilidade de perceber o que está oculto.', 
    category: 'Natureza' 
  },
  { 
    symbol: 'Leão', 
    image: 'images/lion.jpeg', 
    meaning: 'Coragem, Força, Nobreza', 
    description: 'O leão simboliza coragem, poder e nobreza, sendo amplamente reverenciado em muitas culturas como o rei dos animais. Representando bravura e autoridade, o leão é também um símbolo de proteção e liderança, especialmente associado à realeza e à coragem de defender o que é justo.', 
    category: 'Natureza' 
  },
  { 
    symbol: 'Dragão', 
    image: 'images/dragon.jpeg', 
    meaning: 'Poder, Sabedoria, Misticismo', 
    description: 'O dragão é um símbolo de poder, sabedoria e misticismo em várias culturas ao redor do mundo. No oriente, ele representa proteção, força e boa sorte, enquanto no ocidente é frequentemente associado ao poder destrutivo e à realeza. O dragão é um ser que domina os elementos, personificando tanto a criação quanto a destruição.', 
    category: 'Mitologia' 
  },
  { 
    symbol: 'Lótus', 
    image: 'images/lotus.jpeg', 
    meaning: 'Pureza, Iluminação, Renascimento', 
    description: 'A flor de lótus é um símbolo de pureza, crescimento espiritual e renascimento. Ela cresce na lama, mas floresce limpa e pura, sendo um símbolo importante no budismo e hinduísmo. Representa a jornada de ascensão da alma, superando dificuldades para alcançar a iluminação.', 
    category: 'Natureza' 
  },
  { 
    symbol: 'Corvo', 
    image: 'images/crow.jpeg', 
    meaning: 'Profecia, Transformação, Sabedoria', 
    description: 'O corvo é um símbolo de transformação, conhecimento e mistério. Frequentemente associado à profecia e aos reinos espirituais, o corvo é visto como um mensageiro que conecta o mundo dos vivos e dos mortos, lembrando-nos da necessidade de introspecção e autoconhecimento.', 
    category: 'Natureza' 
  },
  { 
    symbol: 'Fênix', 
    image: 'images/phoenix.jpeg', 
    meaning: 'Ressurreição, Imortalidade, Transformação', 
    description: 'A fênix é um símbolo de renascimento e imortalidade. Na mitologia, a fênix renasce das próprias cinzas, representando o ciclo de vida, morte e ressurreição. Ela simboliza a capacidade de superar adversidades e ressurgir mais forte.', 
    category: 'Mitologia' 
  },
  { 
    symbol: 'Árvore da Vida', 
    image: 'images/tree.jpeg', 
    meaning: 'Conexão, Crescimento, Sabedoria', 
    description: 'A Árvore da Vida simboliza a interconectividade de toda a existência. Representa crescimento, força e a continuidade da vida, unindo o céu, a terra e o mundo subterrâneo. Presente em várias culturas, ela é um símbolo de sabedoria e do ciclo natural da vida.', 
    category: 'Espiritualidade' 
  },
  { 
    symbol: 'Elefante', 
    image: 'images/elephant.jpeg', 
    meaning: 'Sabedoria, Longevidade, Fortuna', 
    description: 'O elefante é um símbolo de força, sabedoria e longevidade. Na cultura hindu, o elefante é sagrado e está associado ao deus Ganesha, que é considerado o removedor de obstáculos e traz boa sorte e fortuna.', 
    category: 'Natureza' 
  },
  { 
    symbol: 'Águia', 
    image: 'images/eagle.jpeg', 
    meaning: 'Liberdade, Visão, Poder', 
    description: 'A águia representa visão, liberdade e poder. Por sua capacidade de voar alto, ela é considerada um mensageiro dos deuses e simboliza uma visão ampla e uma perspectiva elevada, bem como o espírito de liberdade e a capacidade de superar desafios.', 
    category: 'Natureza' 
  },
  { 
    symbol: 'Sol', 
    image: 'images/sun.jpeg', 
    meaning: 'Vitalidade, Iluminação, Energia', 
    description: 'O sol é símbolo de vida, iluminação e energia em várias culturas. Representa o ciclo da vida, a verdade e a clareza. É também um símbolo de força e poder, associado à luz e ao crescimento.', 
    category: 'Elementos' 
  },
  { 
    symbol: 'Lua', 
    image: 'images/moon.jpeg', 
    meaning: 'Intuição, Mistério, Transformação', 
    description: 'A lua é um símbolo de intuição, mistério e ciclos. Suas fases representam o ciclo de transformação e crescimento, além de estar ligada ao inconsciente e às emoções.', 
    category: 'Elementos' 
  },
  { 
    symbol: 'Borboleta', 
    image: 'images/butterfly.jpeg', 
    meaning: 'Transformação, Beleza, Renascimento', 
    description: 'A borboleta é um símbolo de transformação e renovação. Ela representa a beleza e o renascimento, sendo um lembrete de que mudanças podem levar a uma nova forma de existência mais bela e significativa.', 
    category: 'Natureza' 
  },
  { 
    symbol: 'Serpente', 
    image: 'images/serpent.jpeg', 
    meaning: 'Transformação, Sabedoria, Cura', 
    description: 'A serpente simboliza transformação e renovação, devido à sua capacidade de trocar de pele. Em várias culturas, é também um símbolo de cura e sabedoria.', 
    category: 'Natureza' 
  },
  { 
    symbol: 'Coração', 
    image: 'images/heart.jpeg', 
    meaning: 'Amor, Compaixão, Vida', 
    description: 'O coração é um símbolo universal de amor, compaixão e vida. Ele representa emoções profundas e o vínculo humano com outros seres, sendo associado tanto ao amor romântico quanto ao afeto fraterno.', 
    category: 'Emoções' 
  },
  { 
    symbol: 'Mandala', 
    image: 'images/mandala.jpeg', 
    meaning: 'Equilíbrio, Unidade, Espiritualidade', 
    description: 'A mandala é um símbolo de unidade e equilíbrio, frequentemente usada em práticas espirituais e de meditação. Ela representa a harmonia do universo e o caminho para a iluminação espiritual.', 
    category: 'Espiritualidade' 
  },
  { 
    symbol: 'Ankh', 
    image: 'images/ankh.jpeg', 
    meaning: 'Vida, Imortalidade, Divindade', 
    description: 'O Ankh é um símbolo egípcio de vida e imortalidade. Ele representa o ciclo eterno de vida, morte e renascimento, e é muitas vezes associado à divindade e ao poder dos deuses.', 
    category: 'Antiguidade' 
  },
  { 
    symbol: 'Pentagrama', 
    image: 'images/pentagram.jpeg', 
    meaning: 'Proteção, Equilíbrio, Magia', 
    description: 'O pentagrama é um símbolo de proteção e equilíbrio. Ele representa os cinco elementos - terra, ar, fogo, água e espírito - e é amplamente usado em práticas espirituais e mágicas para trazer equilíbrio e proteção.', 
    category: 'Esoterismo' 
  },
  { 
    symbol: 'Cruz Celta', 
    image: 'images/cross.jpeg', 
    meaning: 'Espiritualidade, Interseção, Eternidade', 
    description: 'A cruz celta representa a interseção entre o mundo físico e o espiritual. É um símbolo de eternidade e fé, comum na cultura celta, que conecta a humanidade ao divino.', 
    category: 'Espiritualidade' 
  },
  { 
    symbol: 'Tartaruga', 
    image: 'images/turtle.jpeg', 
    meaning: 'Longevidade, Persistência, Estabilidade', 
    description: 'A tartaruga representa longevidade, sabedoria e estabilidade. Em muitas culturas, ela é associada à criação do mundo e ao progresso constante.', 
    category: 'Natureza' 
  },
  { 
    symbol: 'Chama Eterna', 
    image: 'images/flame.jpeg', 
    meaning: 'Luz, Inspiração, Vida', 
    description: 'A Chama Eterna representa a luz da inspiração e o fogo da vida, simbolizando a continuidade da alma e a presença do espírito.', 
    category: 'Elementos' 
  },
  { 
    symbol: 'Cruz', 
    image: 'images/christcross.jpeg', 
    meaning: 'Fé, Redenção, Sacrifício', 
    description: 'A cruz é o símbolo mais reconhecido do cristianismo, representando a fé e o sacrifício de Jesus Cristo. Ela simboliza a redenção e a conexão entre o divino e o humano.', 
    category: 'Religião' 
  },
  { 
    symbol: 'Estrela de Davi', 
    image: 'images/davistar.jpeg', 
    meaning: 'Proteção, União, Divindade', 
    description: 'A Estrela de Davi é um símbolo de proteção e união entre o céu e a terra, amplamente associado à cultura judaica e ao equilíbrio entre os opostos.', 
    category: 'Religião' 
  },
  { 
    symbol: 'Yin-Yang', 
    image: 'images/yinyang.jpeg', 
    meaning: 'Equilíbrio, Dualidade, Harmonia', 
    description: 'O símbolo Yin-Yang representa o equilíbrio entre forças opostas e complementares, como luz e escuridão. Ele simboliza a dualidade presente em todos os aspectos da vida e a harmonia entre elas.', 
    category: 'Religião' 
  },
  { 
    symbol: 'Chave de Salomão', 
    image: 'images/key.jpeg', 
    meaning: 'Sabedoria, Conhecimento, Poder', 
    description: 'A Chave de Salomão é um símbolo esotérico de sabedoria e controle sobre o espiritual. Acredita-se que proporciona o domínio dos elementos e uma conexão com o divino.', 
    category: 'Esoterismo' 
  },
  {
    symbol: 'Flor da Vida', 
    image: 'images/flower.jpeg', 
    meaning: 'Harmonia, Criação, Unidade', 
    description: 'A Flor da Vida é um símbolo geométrico que representa a criação e a harmonia universal. Ela é composta por círculos entrelaçados, simbolizando a interconexão de todas as coisas.', 
    category: 'Esoterismo'
  },
  {
    symbol: 'Olho Que Tudo Vê', 
    image: 'images/eye.jpeg', 
    meaning: 'Onisciência, Poder, Proteção', 
    description: 'O Olho Que Tudo Vê representa a onisciência e a proteção divina, comumente associado à vigilância e ao poder espiritual.', 
    category: 'Esoterismo'
  },
  {
    symbol: 'Torre', 
    image: 'images/tower.jpeg', 
    meaning: 'Resiliência, Isolamento, Defesa', 
    description: 'A torre representa defesa e proteção, bem como resiliência. Muitas vezes, indica força diante de desafios e isolamento necessário para refletir.', 
    category: 'Esoterismo'
  },
  {
    symbol: 'Escaravelho', 
    image: 'images/scarab.jpeg', 
    meaning: 'Renovação, Proteção, Transformação', 
    description: 'O escaravelho era um amuleto popular no Egito antigo, simbolizando renovação e transformação devido ao ciclo de vida do inseto.', 
    category: 'Esoterismo'
  },
  {
    symbol: 'Escudo', 
    image: 'images/shield.jpeg', 
    meaning: 'Proteção, Defesa, Segurança', 
    description: 'O escudo representa defesa e proteção, sendo frequentemente usado como emblema de força e segurança em contextos heráldicos.', 
    category: 'Esoterismo'
  },
  {
    symbol: 'Caveira', 
    image: 'images/skull.jpeg', 
    meaning: 'Mortalidade, Transformação, Força', 
    description: 'A caveira simboliza a mortalidade, lembrando a transitoriedade da vida e a inevitabilidade da morte, assim como força e transformação.', 
    category: 'Misticismo'
  },
  {
    symbol: 'Lobo', 
    image: 'images/wolf.jpeg', 
    meaning: 'Lealdade, Instinto, Força', 
    description: 'O lobo é um símbolo de instinto, lealdade e força, representando também o espírito de comunidade e sobrevivência.', 
    category: 'Natureza'
  },
  {
    symbol: 'Bússola', 
    image: 'images/compass.jpeg', 
    meaning: 'Orientação, Direção, Proteção', 
    description: 'A bússola simboliza orientação e determinação, ajudando a manter o rumo certo e trazendo um senso de proteção e segurança.', 
    category: 'Náutica'
  },
  {
    symbol: 'Âncora', 
    image: 'images/anchor.jpeg', 
    meaning: 'Estabilidade, Esperança, Segurança', 
    description: 'A âncora representa segurança e firmeza, sendo frequentemente usada como símbolo de estabilidade emocional e esperança em tempos difíceis.', 
    category: 'Náutica'
  },
  {
    symbol: 'Pavão',
    image: 'images/peacock.jpeg',
    meaning: 'Beleza, Orgulho, Ressurreição',
    description: 'O pavão simboliza beleza e orgulho, além de ser associado à ressurreição em diversas tradições espirituais.',
    category: 'Natureza'
  },
  {
    symbol: 'Caduceu',
    image: 'images/caduceus.jpeg',
    meaning: 'Cura, Saúde, Proteção',
    description: 'O caduceu é símbolo de cura e saúde, frequentemente associado à medicina e à proteção espiritual.',
    category: 'Saúde'
  },
  {
    symbol: 'Unicórnio',
    image: 'images/unicorn.jpeg',
    meaning: 'Pureza, Magia, Raridade',
    description: 'O unicórnio simboliza pureza e magia, frequentemente visto como um ser raro e mítico.',
    category: 'Mitologia'
  },
  {
    symbol: 'Espelho',
    image: 'images/mirror.jpeg',
    meaning: 'Autoconhecimento, Verdade, Reflexão',
    description: 'O espelho representa a busca pela verdade e o autoconhecimento, refletindo a alma e os sentimentos profundos.',
    category: 'Misticismo'
  },
  {
    symbol: 'Lira',
    image: 'images/lyre.jpeg',
    meaning: 'Arte, Inspiração, Música',
    description: 'A lira é um símbolo de inspiração artística e criatividade, associada a músicos e poetas da antiguidade.',
    category: 'Arte'
  },
  {
    symbol: 'Ampulheta',
    image: 'images/hourglass.jpeg',
    meaning: 'Tempo, Transitoriedade, Reflexão',
    description: 'A ampulheta simboliza o tempo e a transitoriedade da vida, lembrando a efemeridade e a reflexão sobre o presente.',
    category: 'Misticismo'
  },
  {
    symbol: 'Pena',
    image: 'images/feather.jpeg',
    meaning: 'Liberdade, Inspiração, Leveza',
    description: 'A pena simboliza liberdade e leveza, sendo um emblema de inspiração criativa e espiritual.',
    category: 'Natureza'
  },
  {
    symbol: 'Veado',
    image: 'images/deer.jpeg',
    meaning: 'Graça, Gentileza, Espiritualidade',
    description: 'O veado representa gentileza e espiritualidade, evocando um espírito de paz e harmonia com a natureza.',
    category: 'Animais'
  },
  {
    symbol: 'Abelha',
    image: 'images/bee.jpeg',
    meaning: 'Trabalho, Comunidade, Cooperação',
    description: 'A abelha é símbolo de cooperação e trabalho em equipe, representando a importância da comunidade.',
    category: 'Natureza'
  },
  {
    symbol: 'Estrela Cadente',
    image: 'images/star.jpeg',
    meaning: 'Esperança, Desejo, Mudança',
    description: 'Uma estrela cadente simboliza esperança, mudança e a realização de desejos.',
    category: 'Natureza'
  },
  {
    symbol: 'Libélula',
    image: 'images/dragonfly.jpeg',
    meaning: 'Mudança, Ilusão, Adaptabilidade',
    description: 'A libélula simboliza transformação, adaptabilidade e o despertar para novas realidades.',
    category: 'Natureza'
  },
  {
    symbol: 'Guerreiro Samurai',
    image: 'images/samurai.jpeg',
    meaning: 'Honra, Coragem, Disciplina',
    description: 'Representa o código de honra e disciplina dos guerreiros samurais, conhecidos por sua coragem.',
    category: 'Mitologia'
  },
  {
    symbol: 'Touro',
    image: 'images/bull.jpeg',
    meaning: 'Força, Determinação, Resiliência',
    description: 'O touro simboliza força e resiliência, sendo associado a uma personalidade forte e determinada.',
    category: 'Natureza'
  },
  {
    symbol: 'Grifo',
    image: 'images/griffin.jpeg',
    meaning: 'Força, Proteção, Vigilância',
    description: 'O grifo é um símbolo mitológico de força e vigilância, combinando as características do leão e da águia.',
    category: 'Mitologia'
  },
  {
    symbol: 'Ametista',
    image: 'images/amethyst.jpeg',
    meaning: 'Proteção, Espiritualidade, Tranquilidade',
    description: 'A ametista é uma pedra que simboliza proteção espiritual e promove tranquilidade.',
    category: 'Cristais'
  },
  {
    symbol: 'Carvalho',
    image: 'images/oak.jpeg',
    meaning: 'Força, Estabilidade, Longevidade',
    description: 'O carvalho é símbolo de força e estabilidade, sendo reverenciado em várias culturas por sua longevidade.',
    category: 'Natureza'
  },
  {
    symbol: 'Tigre',
    image: 'images/tiger.jpeg',
    meaning: 'Coragem, Força, Proteção',
    description: 'O tigre é visto como um símbolo de poder e proteção, especialmente na cultura asiática.',
    category: 'Animais'
  },
  {
    symbol: 'Falcão',
    image: 'images/falcon.jpeg',
    meaning: 'Visão, Liberdade, Agilidade',
    description: 'O falcão simboliza liberdade e visão ampliada, representando foco e determinação.',
    category: 'Animais'
  },
  {
    symbol: 'Castelo',
    image: 'images/castle.jpeg',
    meaning: 'Fortaleza, Proteção, Poder',
    description: 'O castelo representa segurança e proteção, sendo um símbolo de fortaleza e domínio. Comumente associado a realeza e poder, é uma construção resistente, erguida para proteger seus ocupantes.',
    category: 'Arquitetura'
  },
  {
    symbol: 'Espada',
    image: 'images/sword.jpeg',
    meaning: 'Coragem, Justiça, Honra',
    description: 'A espada simboliza força e justiça, sendo uma arma de honra e coragem usada em combates e desafios. Ela também representa clareza de pensamento e proteção espiritual.',
    category: 'Armas'
  },
  {
    symbol: 'Sacerdote',
    image: 'images/priest.jpeg',
    meaning: 'Sabedoria, Espiritualidade, Guia',
    description: 'O sacerdote representa um guia espiritual, alguém que facilita o contato com o divino. Ele simboliza sabedoria, fé e dedicação a princípios religiosos e espirituais.',
    category: 'Religião'
  },
  {
    symbol: 'Livro',
    image: 'images/book.jpeg',
    meaning: 'Conhecimento, Aprendizado, Verdade',
    description: 'O livro é símbolo de conhecimento e sabedoria, representando o registro de experiências e o compartilhamento de ideias. Frequentemente associado à busca por verdade e desenvolvimento pessoal.',
    category: 'Literatura'
  },
  {
    symbol: 'Peixe',
    image: 'images/fish.jpeg',
    meaning: 'Abundância, Prosperidade, Fertilidade',
    description: 'O peixe simboliza abundância e fertilidade, sendo também associado à prosperidade financeira.',
    category: 'Natureza'
  },
  {
    symbol: 'Mago',
    image: 'images/wizard.jpeg',
    meaning: 'Misticismo, Sabedoria, Magia',
    description: 'O mago simboliza poder místico, conhecimento arcano e a capacidade de manipular forças ocultas. Ele representa a busca por conhecimento espiritual e o domínio de energias superiores.',
    category: 'Misticismo'
  },
  {
    symbol: 'Igreja',
    image: 'images/church.jpeg',
    meaning: 'Fé, Comunidade, Espiritualidade',
    description: 'A igreja simboliza a fé, o sentido de pertencimento e a comunhão espiritual. É um local sagrado onde as pessoas se reúnem para buscar orientação e fortalecer sua conexão com o divino.',
    category: 'Religião'
  },
  {
    symbol: 'Cemitério',
    image: 'images/cemetery.jpeg',
    meaning: 'Morte, Transição, Memória',
    description: 'O cemitério representa o ciclo de vida e morte, sendo um lugar de descanso final e de lembranças. Ele simboliza respeito pelos antepassados e o mistério da vida após a morte.',
    category: 'Espiritualidade'
  },
  {
    symbol: 'Caixão',
    image: 'images/coffin.jpeg',
    meaning: 'Morte, Transitoriedade, Respeito',
    description: 'O caixão simboliza a passagem para outro plano e a transitoriedade da vida. É também um símbolo de respeito aos mortos e o fim de um ciclo terreno.',
    category: 'Espiritualidade'
  },
  {
    symbol: 'Piano',
    image: 'images/piano.jpeg',
    meaning: 'Harmonia, Criatividade, Emoção',
    description: 'O piano representa a expressão artística e emocional através da música. Ele simboliza harmonia, sensibilidade e a capacidade de criar beleza por meio das notas musicais.',
    category: 'Arte'
  },
  {
    symbol: 'Pirâmide',
    image: 'images/pyramid.jpeg',
    meaning: 'Misticismo, Estabilidade, Ascensão',
    description: 'A pirâmide simboliza ascensão espiritual e poder duradouro. Associada a civilizações antigas, como a egípcia, representa também estabilidade e sabedoria ancestral.',
    category: 'Antiguidade'
  },
  {
    symbol: 'Rosa',
    image: 'images/rose.jpeg',
    meaning: 'Amor, Beleza, Pureza',
    description: 'A rosa simboliza o amor, a beleza e a pureza. Cada cor carrega significados diferentes, mas ela é amplamente vista como um emblema de afeto, paixão e delicadeza.',
    category: 'Natureza'
  },
  {
    symbol: 'Cachorro',
    image: 'images/dog.jpeg',
    meaning: 'Lealdade, Companheirismo, Proteção',
    description: 'O cachorro simboliza amizade e lealdade. Conhecido como o melhor amigo do homem, ele representa proteção e um vínculo fiel com seus cuidadores.',
    category: 'Animais'
  },
  {
    symbol: 'Gato',
    image: 'images/cat.jpeg',
    meaning: 'Independência, Mistério, Intuição',
    description: 'O gato simboliza independência e mistério. Associado a intuição e misticismo, ele é um animal que representa tanto o afeto quanto a autossuficiência.',
    category: 'Animais'
  },
  {
    symbol: 'Coelho',
    image: 'images/rabbit.jpeg',
    meaning: 'Fertilidade, Agilidade, Sorte',
    description: 'O coelho é símbolo de fertilidade, renovação e sorte em várias culturas. Ele representa agilidade, rapidez e adaptabilidade, sendo também associado à inocência e gentileza.',
    category: 'Natureza'
  },
  {
    symbol: 'Bode',
    image: 'images/goat.jpeg',
    meaning: 'Força, Determinação, Independência',
    description: 'O bode simboliza resistência e força, frequentemente associado à natureza independente e persistente. Em algumas tradições, representa também o misticismo e a dualidade entre o bem e o mal.',
    category: 'Animais'
  },
  {
    symbol: 'Relógio',
    image: 'images/clock.jpeg',
    meaning: 'Tempo, Ciclo, Mortalidade',
    description: 'O relógio simboliza o tempo e a passagem da vida. Representa o ciclo das horas, a importância de aproveitar o presente e o conceito de mortalidade e finitude.',
    category: 'Objetos'
  },
  {
    symbol: 'Gnomo',
    image: 'images/gnome.jpeg',
    meaning: 'Proteção, Natureza, Mistério',
    description: 'O gnomo é um símbolo de proteção e ligação com a natureza. Nos contos de fadas, ele guarda tesouros e segredos, sendo um símbolo de magia e mistério.',
    category: 'Folclore'
  },
  {
    symbol: 'Polvo',
    image: 'images/octopus.jpeg',
    meaning: 'Inteligência, Adaptabilidade, Mistério',
    description: 'O polvo representa inteligência e adaptabilidade, com sua habilidade de mudar de forma e cor. Ele simboliza também o mistério e o desconhecido das profundezas do oceano.',
    category: 'Animais'
  },
  {
    symbol: 'Macaco',
    image: 'images/monkey.jpeg',
    meaning: 'Brincadeira, Curiosidade, Adaptabilidade',
    description: 'O macaco simboliza curiosidade, inteligência e brincadeira. Em várias culturas, ele é visto como um mensageiro espirituoso e representa a adaptabilidade e o aprendizado constante.',
    category: 'Animais'
  },
  {
    symbol: 'Pinheiro',
    image: 'images/pinetree.jpeg',
    meaning: 'Longevidade, Força, Resiliência',
    description: 'O pinheiro representa longevidade e imortalidade, pois permanece verde ao longo do ano. É um símbolo de resistência e força, especialmente nas culturas orientais.',
    category: 'Natureza'
  },
  {
    symbol: 'Moinho',
    image: 'images/windmill.jpeg',
    meaning: 'Energia, Transformação, Trabalho',
    description: 'O moinho simboliza a energia e o trabalho constante. Ele representa a transformação e a força gerada pelo vento, sendo um símbolo de renovação e adaptação.',
    category: 'Objetos'
  },
  {
    symbol: 'Ovelha',
    image: 'images/sheep.jpeg',
    meaning: 'Pureza, Tranquilidade, Obediência',
    description: 'A ovelha é um símbolo de pureza e gentileza, representando também a tranquilidade e a conformidade. Ela é um símbolo comum em tradições religiosas, simbolizando sacrifício e inocência.',
    category: 'Animais'
  },
  {
    symbol: 'Morcego',
    image: 'images/bat.jpeg',
    meaning: 'Renovação, Mistério, Intuição',
    description: 'O morcego é visto como um símbolo de renovação e mistério. Associado ao desconhecido, ele representa o renascimento e a habilidade de ver além das aparências.',
    category: 'Animais'
  },
  {
    symbol: 'Urso',
    image: 'images/bear.jpeg',
    meaning: 'Força, Proteção, Introspecção',
    description: 'O urso simboliza força e proteção. Ele é frequentemente associado à coragem e introspecção, sendo também um símbolo de liderança e maternidade.',
    category: 'Animais'
  },
  {
    symbol: 'Sapo',
    image: 'images/frog.jpeg',
    meaning: 'Transformação, Fertilidade, Renovação',
    description: 'O sapo representa transformação e renovação, especialmente em ciclos de vida. Ele é um símbolo de adaptação e prosperidade, ligado à fertilidade e à água.',
    category: 'Natureza'
  },
  {
    symbol: 'Salamandra',
    image: 'images/salamander.jpeg',
    meaning: 'Resiliência, Elemento Fogo, Proteção',
    description: 'A salamandra é tradicionalmente associada ao fogo e à proteção. Ela simboliza resiliência e adaptação, com a habilidade de sobreviver em condições extremas.',
    category: 'Mitologia'
  },
  {
    symbol: 'Galo',
    image: 'images/rooster.jpeg',
    meaning: 'Coragem, Vigilância, Prosperidade',
    description: 'O galo é um símbolo de vigilância e coragem, representando também o amanhecer e a renovação. Ele é associado à proteção contra as forças do mal em várias culturas.',
    category: 'Animais'
  },
  {
    symbol: 'Aranha',
    image: 'images/spider.jpeg',
    meaning: 'Criatividade, Destino, Conexão',
    description: 'A aranha simboliza a criatividade e a interconectividade da vida. Ela representa o destino e a habilidade de tecer o próprio caminho, simbolizando também paciência e habilidade.',
    category: 'Animais'
  },
  {
    symbol: 'Escorpião',
    image: 'images/scorpion.jpeg',
    meaning: 'Proteção, Mistério, Transformação',
    description: 'O escorpião é um símbolo de proteção e transformação. Ele representa também o mistério e a determinação, associado à regeneração e à superação de desafios.',
    category: 'Animais'
  },
  {
    symbol: 'Cavaleiro',
    image: 'images/knight.jpeg',
    meaning: 'Honra, Coragem, Lealdade',
    description: 'O cavaleiro representa a honra, o valor e a lealdade. Ele é um símbolo de coragem e proteção, personificando ideais de justiça e moralidade, além de representar a dedicação a um código de ética.',
    category: 'Mitologia'
  },
  {
    symbol: 'Druida',
    image: 'images/druid.jpeg',
    meaning: 'Sabedoria, Natureza, Espiritualidade',
    description: 'O druida simboliza a conexão espiritual com a natureza e o conhecimento ancestral. Ele representa a sabedoria, o equilíbrio e a habilidade de interagir com o mundo natural e o espiritual, estando ligado a práticas de cura e compreensão profunda.',
    category: 'Mitologia'
  },
  {
    symbol: 'Sino',
    image: 'images/bell.jpeg',
    meaning: 'Chamado, Purificação, Passagem',
    description: 'O sino é um símbolo de purificação e comunicação espiritual. Ele representa um chamado ou um aviso, sendo frequentemente usado em cerimônias e celebrações.',
    category: 'Espiritualidade'
  },
  {
    symbol: 'Navio',
    image: 'images/ship.jpeg',
    meaning: 'Viagem, Aventura, Destino',
    description: 'O navio simboliza jornada e aventura, sendo um meio de transporte que explora o desconhecido. Representa também o destino e a capacidade de superar obstáculos no caminho da vida.',
    category: 'Exploração'
  },
  {
    symbol: 'Farol',
    image: 'images/lighthouse.jpeg',
    meaning: 'Orientação, Esperança, Segurança',
    description: 'O farol é um símbolo de orientação e segurança, representando esperança e a iluminação do caminho para aqueles que estão perdidos. Ele guia os viajantes, lembrando-nos de nossa própria luz interior.',
    category: 'Exploração'
  },
  {
    symbol: 'Trevo de Quatro Folhas',
    image: 'images/4leaf.jpeg',
    meaning: 'Sorte, Prosperidade, Proteção',
    description: 'O trevo de quatro folhas é um símbolo universal de sorte e proteção. Ele representa esperança e prosperidade, sendo considerado um amuleto de sorte em muitas culturas.',
    category: 'Fortuna'
  },
  {
    symbol: 'Balança',
    image: 'images/scales.jpeg',
    meaning: 'Justiça, Equilíbrio, Verdade',
    description: 'A balança é símbolo de justiça e equilíbrio. Representa a imparcialidade e a busca pela verdade, sendo uma figura importante para as leis e a moralidade.',
    category: 'Justiça'
  },
  {
    symbol: 'Rato',
    image: 'images/mouse.jpeg',
    meaning: 'Adaptabilidade, Astúcia, Sobrevivência',
    description: 'O rato representa adaptabilidade e sobrevivência, sendo símbolo de astúcia e rapidez. Ele consegue prosperar mesmo em ambientes hostis, ensinando sobre a importância da flexibilidade e de saber usar os recursos disponíveis.',
    category: 'Natureza'
  },
  {
    symbol: 'Urubu',
    image: 'images/vulture.jpeg',
    meaning: 'Renovação, Transformação, Ciclo da Vida',
    description: 'O urubu simboliza a renovação e o ciclo da vida, ajudando a transformar o velho em algo novo. Ele é uma figura associada à regeneração e ao equilíbrio, ensinando a importância de limpar o que está desgastado para dar lugar ao novo.',
    category: 'Natureza'
  },
  {
    symbol: 'Camaleão',
    image: 'images/chameleon.jpeg',
    meaning: 'Versatilidade, Camuflagem, Adaptação',
    description: 'O camaleão representa a versatilidade e a habilidade de se adaptar ao ambiente. Ele simboliza a capacidade de mudança e flexibilidade, destacando a importância de estar em sintonia com o que nos cerca.',
    category: 'Natureza'
  },
  {
    symbol: 'Cisne',
    image: 'images/swan.jpeg',
    meaning: 'Beleza, Graça, Pureza',
    description: 'O cisne é símbolo de beleza e graça, representando a pureza e o amor. É associado à elegância e à transformação, lembrando-nos de apreciar a beleza interior e a transformação pessoal.',
    category: 'Natureza'
  },
  {
    symbol: 'Jacaré',
    image: 'images/alligator.jpeg',
    meaning: 'Força Primordial, Instinto, Resiliência',
    description: 'O jacaré simboliza a força primordial e os instintos. Ele representa a resiliência e a conexão com as forças primitivas da natureza, destacando a importância de confiar em nossos instintos e enfrentar desafios com persistência.',
    category: 'Natureza'
  },
  {
    symbol: 'Baú',
    image: 'images/chest.jpeg',
    meaning: 'Tesouro, Mistério, Descoberta',
    description: 'O baú simboliza tesouro e mistério, frequentemente associado à descoberta de riquezas ou segredos ocultos. Ele representa o potencial inexplorado e a emoção de desbravar o desconhecido, seja em termos de conhecimento ou de experiência.',
    category: 'Antiguidade'
  },
  {
    symbol: 'Jester',
    image: 'images/jester.jpeg',
    meaning: 'Humor, Sabedoria Oculta, Liberdade',
    description: 'O Jester, ou bobo da corte, simboliza humor e liberdade de expressão. Apesar de sua aparência brincalhona, ele é frequentemente portador de verdades ocultas, representando uma visão sagaz sobre a vida e os comportamentos humanos, lembrando-nos da importância do riso e da perspectiva.',
    category: 'Personagens'
  },
  {
    symbol: 'Pantera',
    image: 'images/panther.jpeg',
    meaning: 'Poder, Mistério, Agilidade',
    description: 'A pantera simboliza força, mistério e astúcia. Frequentemente associada à noite e ao desconhecido, representa a capacidade de enfrentar desafios ocultos.',
    category: 'Natureza'
  },
  {
    symbol: 'Labirinto', 
    image: 'images/labyrinth.jpeg', 
    meaning: 'Busca, Mistério, Jornada Interior', 
    description: 'O labirinto representa a jornada da vida, com desafios e busca por autoconhecimento. É um símbolo de mistério e de um caminho espiritual.', 
    category: 'Misticismo'
  },
  {
    symbol: 'Vela',
    image: 'images/candle.jpeg',
    meaning: 'Iluminação, Esperança, Meditação',
    description: 'A vela simboliza luz, paz e espiritualidade, sendo frequentemente usada em cerimônias e rituais como fonte de clareza e foco. Ela representa a busca interior e a conexão com o divino, proporcionando conforto e orientação em momentos de escuridão.',
    category: 'Ritual'
  },
  {
    symbol: 'Maçã',
    image: 'images/apple.jpeg',
    meaning: 'Tentação, Saúde, Sabedoria',
    description: 'A maçã é um símbolo de saúde, conhecimento e, em algumas culturas, de tentação. Associada ao mito de Adão e Eva, representa a dualidade entre desejo e conhecimento, além de simbolizar a abundância e os ciclos naturais da vida.',
    category: 'Natureza'
  },
  {
    symbol: 'Rei',
    image: 'images/king.jpeg',
    meaning: 'Liderança, Autoridade, Poder',
    description: 'O Rei simboliza poder, liderança e autoridade suprema. Muitas vezes associado ao domínio e à responsabilidade, ele representa a capacidade de governar com justiça, força e sabedoria. Em várias culturas, o rei é uma figura de proteção e é visto como a cabeça do reino, guiando e defendendo seu povo.',
    category: 'Nobreza'
  },
  {
    symbol: 'Rainha',
    image: 'images/queen.jpeg',
    meaning: 'Graça, Sabedoria, Fertilidade',
    description: 'A Rainha simboliza graça, sabedoria e poder feminino. Ela é muitas vezes associada à bondade, à proteção de seu povo e ao equilíbrio entre força e compaixão. Em várias mitologias e culturas, a rainha representa fertilidade, soberania e o poder de nutrir e transformar o reino.',
    category: 'Nobreza'
  },
  {
    symbol: 'Cetro',
    image: 'images/scepter.jpeg',
    meaning: 'Poder, Soberania, Autoridade',
    description: 'O cetro representa autoridade e realeza. Ele é associado ao poder de governar e simboliza a legitimidade e o direito de liderança em várias culturas ao longo da história.',
    category: 'Nobreza'
  },
  {
    symbol: 'Martelo',
    image: 'images/hammer.jpeg',
    meaning: 'Trabalho, Justiça, Construção',
    description: 'O martelo simboliza trabalho e criação, representando a capacidade humana de moldar e construir o mundo ao seu redor. É também um símbolo de força e justiça.',
    category: 'Construção'
  },
  {
    symbol: 'Ponte',
    image: 'images/bridge.jpeg',
    meaning: 'Conexão, União, Transição',
    description: 'A ponte é um símbolo de união e transição, conectando pessoas, lugares e ideias. Ela representa a passagem de um ponto a outro, física ou espiritualmente.',
    category: 'Arquitetura'
  },
  {
    symbol: 'Corrente',
    image: 'images/chain.jpeg',
    meaning: 'União, Conexão, Restrição',
    description: 'A corrente representa ligação e conexão, mas também pode simbolizar restrição. Ela é usada tanto para unir quanto para limitar.',
    category: 'Objetos'
  },
  {
    symbol: 'Vaga-lume',
    image: 'images/firefly.jpeg',
    meaning: 'Esperança, Iluminação, Orientação',
    description: 'O vaga-lume simboliza esperança e orientação em tempos de escuridão. Sua luz representa a inspiração e a capacidade de encontrar o caminho.',
    category: 'Natureza'
  },
  {
    symbol: 'Flecha',
    image: 'images/arrow.jpeg',
    meaning: 'Direção, Foco, Objetivo',
    description: 'A flecha representa direção e propósito. Ela é símbolo de foco e determinação, sempre apontando em direção a um objetivo específico.',
    category: 'Guerra'
  },
  {
    symbol: 'Fogo',
    image: 'images/fire.jpeg',
    meaning: 'Transformação, Energia, Paixão',
    description: 'O fogo simboliza transformação e poder, representando tanto a destruição quanto a renovação. Ele está associado à paixão, coragem e impulso vital.',
    category: 'Elementos'
  },
  {
    symbol: 'Água',
    image: 'images/water.jpeg',
    meaning: 'Pureza, Renovação, Emoção',
    description: 'A água representa a fluidez e adaptação. É símbolo de purificação, vida e emoções profundas, conectando-se também ao inconsciente e à intuição.',
    category: 'Elementos'
  },
  {
    symbol: 'Ar',
    image: 'images/air.jpeg',
    meaning: 'Liberdade, Inteligência, Movimento',
    description: 'O ar simboliza liberdade e expansão. Representa a mente, o pensamento e o movimento, sendo também ligado à comunicação e criatividade.',
    category: 'Elementos'
  },
  {
    symbol: 'Terra',
    image: 'images/earth.jpeg',
    meaning: 'Estabilidade, Fertilidade, Crescimento',
    description: 'A terra representa solidez, segurança e sustentação. É símbolo de fertilidade e crescimento, sendo associada à natureza e ao cuidado.',
    category: 'Elementos'
  },
  {
    symbol: 'Sereia',
    image: 'images/mermaid.jpeg',
    meaning: 'Sedução, Mistério, Feminilidade',
    description: 'A sereia simboliza o mistério e a sedução, sendo frequentemente associada ao mar e ao subconsciente. Em várias culturas, representa tanto a beleza quanto o perigo.',
    category: 'Mitologia'
  },
  {
    symbol: 'Espectro',
    image: 'images/specter.jpeg',
    meaning: 'Medo, Mistério, Transição',
    description: 'O espectro simboliza o desconhecido e a ligação com o mundo espiritual, evocando sentimentos de medo e mistério, além de representar a transição entre mundos.',
    category: 'Espiritualidade'
  },
  {
    symbol: 'Portal',
    image: 'images/portal.jpeg',
    meaning: 'Transição, Mudança, Mistério',
    description: 'O portal representa uma passagem para o desconhecido, simbolizando novas oportunidades e transformações profundas que podem ser misteriosas e reveladoras.',
    category: 'Misticismo'
  },
  {
    symbol: 'Anjo',
    image: 'images/angel.jpeg',
    meaning: 'Proteção, Pureza, Guia Espiritual',
    description: 'O anjo simboliza proteção e guia espiritual, associado à bondade, à pureza e ao amor divino. É uma figura de esperança e proteção em várias tradições.',
    category: 'Espiritualidade'
  },
  {
    symbol: 'Coroa',
    image: 'images/crown.jpeg',
    meaning: 'Realeza, Poder, Liderança',
    description: 'A coroa simboliza autoridade, poder e legitimidade, sendo um símbolo de realeza e liderança suprema, frequentemente representando o controle e a responsabilidade.',
    category: 'Antiguidade'
  },
  {
    symbol: 'Punhal',
    image: 'images/dagger.jpeg',
    meaning: 'Perigo, Sacrifício, Proteção',
    description: 'O punhal representa perigo e sacrifício, sendo um símbolo ambíguo de defesa e ameaça. É frequentemente associado à coragem e à força.',
    category: 'Armas'
  },
  {
    symbol: 'Diamante',
    image: 'images/diamond.jpeg',
    meaning: 'Pureza, Perfeição, Força',
    description: 'O diamante é um símbolo de pureza e perfeição, representando a resistência e a força. É valorizado por sua raridade e clareza inigualáveis.',
    category: 'Objetos'
  },
  {
    symbol: 'Pombo',
    image: 'images/dove.jpeg',
    meaning: 'Paz, Esperança, Harmonia',
    description: 'O pombo simboliza a paz e a harmonia, sendo amplamente utilizado como símbolo de esperança e reconciliação. É visto como mensageiro divino em várias culturas.',
    category: 'Natureza'
  },
  {
    symbol: 'Bandeira',
    image: 'images/flag.jpeg',
    meaning: 'Identidade, União, Propósito',
    description: 'A bandeira representa a união e a identidade de um grupo ou nação, carregando o propósito e a determinação de quem ela representa.',
    category: 'Objetos'
  },
  {
    symbol: 'Floresta',
    image: 'images/forest.jpeg',
    meaning: 'Mistério, Vida, Refúgio',
    description: 'A floresta simboliza o mistério e o refúgio, sendo um lugar de vida e renovação. É associada à natureza selvagem e ao desconhecido.',
    category: 'Natureza'
  },
  {
    symbol: 'Fonte',
    image: 'images/fountain.jpeg',
    meaning: 'Vitalidade, Pureza, Renovação',
    description: 'A fonte simboliza a vitalidade e a renovação, sendo frequentemente associada à juventude e à energia renovada. Representa a fluidez e o ciclo de vida.',
    category: 'Elementos'
  },
  {
    symbol: 'Moeda',
    image: 'images/coin.jpeg',
    meaning: 'Fortuna, Valor, Prosperidade',
    description: 'A moeda representa a prosperidade e o valor, simbolizando a riqueza material e a troca. É vista como símbolo de fortuna e recompensa.',
    category: 'Objetos'
  },
  {
    symbol: 'Machado',
    image: 'images/axe.jpeg',
    meaning: 'Força, Coragem, Superação',
    description: 'O machado simboliza força e coragem, sendo associado a superação e transformação. É também um símbolo de desbravamento e da luta por um objetivo.',
    category: 'Armas'
  },
  {
    symbol: 'Bola de Cristal',
    image: 'images/crystalball.jpeg',
    meaning: 'Visão, Intuição, Profecia',
    description: 'A bola de cristal simboliza a clarividência e a intuição, sendo um instrumento místico usado para acessar informações além do comum. É associada à visão do futuro e à sabedoria oculta.',
    category: 'Misticismo'
  },
  {
    symbol: 'Cálice',
    image: 'images/chalice.jpeg',
    meaning: 'Sacralidade, Fertilidade, União',
    description: 'O cálice representa a sacralidade e a abundância, simbolizando união e celebração. Em diversas tradições, é um símbolo de espiritualidade e de comunhão.',
    category: 'Espiritualidade'
  },
  {
    symbol: 'Dado',
    image: 'images/dice.jpeg',
    meaning: 'Destino, Sorte, Aleatoriedade',
    description: 'O dado simboliza o acaso e o destino, remetendo à sorte e à imprevisibilidade da vida. É um símbolo de escolhas e caminhos inesperados.',
    category: 'Objetos'
  },
];

let currentPage = 1;
const symbolsPerPage = 8;
let filteredSymbols = symbols;
let currentSortOrder = 'alphabetical';

function addAlphabeticalIds(symbols) {
  symbols
    .sort((a, b) => a.symbol.localeCompare(b.symbol)) // Ordena os símbolos em ordem alfabética
    .forEach((symbol, index) => {
      symbol.id = index + 1; // Atribui um ID sequencial após a ordenação
    });
}

addAlphabeticalIds(symbols);

function displaySymbols(page) {
  const symbolList = document.getElementById('symbol-list');
  symbolList.innerHTML = '';

  const start = (page - 1) * symbolsPerPage;
  const end = start + symbolsPerPage;
  const symbolsToDisplay = filteredSymbols.slice(start, end);

  document.getElementById("total-symbols").innerHTML = `<b>Total de Símbolos:</b> ${filteredSymbols.length}`;

  symbolsToDisplay.forEach((symbol, index) => {
    const symbolItem = document.createElement('div');
    symbolItem.classList.add('symbol-item');

    symbolItem.innerHTML = `
      <h2 class="index">${toRoman(symbol.id)}</h2>
      <img loading="lazy" src="${symbol.image}" alt="${symbol.symbol}">
      <h3>${symbol.symbol}</h3>
      <p>${symbol.meaning}</p>
      <button class="details-button" onclick="openModal('${symbol.symbol}', '${symbol.image}', '${symbol.description}')">Ver Detalhes</button>
    `;

    // Aplica um efeito de atraso de 100ms em cada item
    setTimeout(() => {
      symbolItem.classList.add('flip-in');
    }, index * 100); 

    symbolList.appendChild(symbolItem);
  });

  updatePagination();
}

function updatePagination() {
  const pageNumbers = document.getElementById('page-numbers');
  pageNumbers.innerHTML = '';

  const totalPages = Math.ceil(filteredSymbols.length / symbolsPerPage);
  const maxPagesToShow = 5; // Número máximo de páginas a mostrar
  const half = Math.floor(maxPagesToShow / 2); // Metade do total de páginas visíveis

  let startPage = currentPage - half > 1 ? currentPage - half : 1;
  let endPage = currentPage + half < totalPages ? currentPage + half : totalPages;

  // Corrigir o startPage se o endPage estiver próximo ao total
  if (endPage - startPage + 1 < maxPagesToShow) {
    if (currentPage < half + 1) {
      endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);
    } else {
      startPage = Math.max(endPage - maxPagesToShow + 1, 1);
    }
  }

  if (totalPages > 1) {
    document.getElementById('pagination').style.display = 'flex';
  } else {
    document.getElementById('pagination').style.display = 'none';
  }

  // Exibir sempre o primeiro número de página
  if (startPage > 1) {
    appendPageNumber(1);
    if (startPage > 2) {
      appendEllipsis();
    }
  }

  // Exibir as páginas intermediárias
  for (let i = startPage; i <= endPage; i++) {
    appendPageNumber(i);
  }

  // Exibir sempre o último número de página
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      appendEllipsis();
    }
    appendPageNumber(totalPages);
  }

  // Atualizar botões de navegação
  document.getElementById('prev-page').disabled = currentPage === 1;
  document.getElementById('go-left').disabled = currentPage === 1;
  document.getElementById('next-page').disabled = currentPage === totalPages;
  document.getElementById('go-right').disabled = currentPage === totalPages;
  document.getElementById('go-all-left').disabled = currentPage === 1;
  document.getElementById('first-page').disabled = currentPage === 1;
  document.getElementById('last-page').disabled = currentPage === totalPages;
  document.getElementById('go-all-right').disabled = currentPage === totalPages;
  document.getElementById('current-page').innerHTML = `<b>Página Atual:</b> ${currentPage}`;
}

function appendPageNumber(page) {
  const pageNumber = document.createElement('div');
  pageNumber.classList.add('page-number');
  if (page === currentPage) {
    pageNumber.classList.add('active');
  }
  pageNumber.innerText = page;
  pageNumber.addEventListener('click', () => goToPage(page));
  document.getElementById('page-numbers').appendChild(pageNumber);
}

function appendEllipsis() {
  const ellipsis = document.createElement('div');
  ellipsis.classList.add('ellipsis');
  ellipsis.innerText = '...';
  document.getElementById('page-numbers').appendChild(ellipsis);
}

function goToPage(page) {
  currentPage = page;
  displaySymbols(currentPage);
}

function openModal(symbol, image, description) {
  const modal = document.getElementById('modal');
  document.getElementById('modal-symbol').innerText = symbol;
  document.getElementById('modal-image').src = image;
  document.getElementById('modal-description').innerText = description;
  modal.style.display = 'flex';
}

document.getElementById('close-modal').addEventListener('click', () => {
  document.getElementById('modal').style.display = 'none';
});

window.addEventListener('click', (event) => {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

function removeDiacritics(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function filterSymbols() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const selectedCategory = document.getElementById('category-select').value;
  const selectedInitial = document.getElementById('initial-select').value; // Seleção de letra inicial

  filteredSymbols = symbols.filter(symbol => {
    const symbolText = symbol.symbol.toLowerCase();
    const meaningText = symbol.meaning.toLowerCase();

    const matchesQuery = symbolText.includes(query) || meaningText.includes(query);
    const matchesCategory = (selectedCategory === 'all') || (symbol.category === selectedCategory);
    
    // Filtra também pela letra inicial, se houver uma selecionada
    const matchesInitial = (selectedInitial === 'all') || (symbolText.startsWith(selectedInitial));

    return matchesQuery && matchesCategory && matchesInitial;
  });

  if (currentSortOrder === 'alphabetical') {
    filteredSymbols.sort((a, b) => a.symbol.localeCompare(b.symbol));
  } else if (currentSortOrder === 'reverse') {
    filteredSymbols.sort((a, b) => b.symbol.localeCompare(a.symbol));
  }

  if (filteredSymbols.length > 0) {
    document.getElementById('pagination').style.display = 'flex';
    document.getElementById('messageNotFound').style.display = 'none';
  } else {
    document.getElementById('pagination').style.display = 'none';
    document.getElementById('messageNotFound').style.display = 'block';
  }

  currentPage = 1; // Resetar para a primeira página
  displaySymbols(currentPage);
}

function updateSortOrder(order) {
  currentSortOrder = order; // Atualiza a variável de ordenação
  filterSymbols(); // Atualiza a exibição dos símbolos com a nova ordenação
}

// Filtros
document.getElementById('category-select').addEventListener('change', filterSymbols);
document.getElementById('search-input').addEventListener('input', filterSymbols);
document.getElementById('initial-select').addEventListener('change', filterSymbols);

// Navegação pelos botões de paginação
document.getElementById('first-page').addEventListener('click', () => goToPage(1));
document.getElementById('go-all-left').addEventListener('click', () => goToPage(1));
document.getElementById('prev-page').addEventListener('click', () => goToPage(currentPage - 1));
document.getElementById('go-left').addEventListener('click', () => goToPage(currentPage - 1));
document.getElementById('next-page').addEventListener('click', () => goToPage(currentPage + 1));
document.getElementById('go-right').addEventListener('click', () => goToPage(currentPage + 1));
document.getElementById('last-page').addEventListener('click', () => goToPage(Math.ceil(filteredSymbols.length / symbolsPerPage)));
document.getElementById('go-all-right').addEventListener('click', () => goToPage(Math.ceil(filteredSymbols.length / symbolsPerPage)));

// Inicializa a exibição
displaySymbols(currentPage);
updateSortOrder(currentSortOrder);

function populateAlphabetDropdown() {
  const initialSelect = document.getElementById('initial-select');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // Cria uma opção para cada letra do alfabeto
  for (const letter of alphabet) {
    const option = document.createElement('option');
    option.value = letter.toLowerCase(); // Valor em minúsculas para fácil comparação
    option.textContent = letter; // Letra em maiúsculas para exibição
    initialSelect.appendChild(option);
  }
}

populateAlphabetDropdown();

function populateCategoryDropdown() {
  const categorySelect = document.getElementById('category-select');
  
  // Extrai categorias únicas
  const uniqueCategories = [...new Set(symbols.map(symbol => symbol.category))];

  // Adiciona cada categoria única como uma opção no dropdown
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

populateCategoryDropdown();

const searchInput = document.getElementById('search-input');
const suggestionsBox = document.getElementById('suggestions');
const MAX_SUGGESTIONS = 5; // Número máximo de sugestões exibidas

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  
  if (!query) {
    suggestionsBox.style.display = 'none';
    return;
  }

  // Filtra os símbolos e limita o número de sugestões exibidas
  const filteredSymbols = symbols
    .filter(symbol => symbol.symbol.toLowerCase().includes(query))
    .slice(0, MAX_SUGGESTIONS); // Limita o array aos primeiros MAX_SUGGESTIONS itens

  // Limpa e atualiza as sugestões
  suggestionsBox.innerHTML = '';
  filteredSymbols.forEach(symbol => {
    const item = document.createElement('div');
    item.classList.add('suggestion-item');
    item.textContent = symbol.symbol;
    
    item.addEventListener('click', () => {
      searchInput.value = symbol.symbol;
      suggestionsBox.style.display = 'none';
      filterSymbols();
    });

    suggestionsBox.appendChild(item);
  });

  suggestionsBox.style.display = filteredSymbols.length ? 'inline-block' : 'none';
});

function shuffleSymbols() {
  for (let i = filteredSymbols.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filteredSymbols[i], filteredSymbols[j]] = [filteredSymbols[j], filteredSymbols[i]];
  }
  displaySymbols(currentPage); // Atualiza a exibição após embaralhar
}

function exportSymbolsAsJSON() {
  // Converte o array em uma string JSON
  const symbolsJSON = JSON.stringify(filteredSymbols, null, 2);

  // Cria um objeto Blob com o conteúdo JSON
  const blob = new Blob([symbolsJSON], { type: 'application/json' });

  // Cria um link temporário para download
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'symbols.json';
  
  // Aciona o download e remove o link
  link.click();
  URL.revokeObjectURL(link.href);
}

function toRoman(num) {
  const romanNumerals = [
    { value: 1000, numeral: 'M' },
    { value: 900, numeral: 'CM' },
    { value: 500, numeral: 'D' },
    { value: 400, numeral: 'CD' },
    { value: 100, numeral: 'C' },
    { value: 90, numeral: 'XC' },
    { value: 50, numeral: 'L' },
    { value: 40, numeral: 'XL' },
    { value: 10, numeral: 'X' },
    { value: 9, numeral: 'IX' },
    { value: 5, numeral: 'V' },
    { value: 4, numeral: 'IV' },
    { value: 1, numeral: 'I' }
  ];

  let roman = '';

  for (const { value, numeral } of romanNumerals) {
    while (num >= value) {
      roman += numeral;
      num -= value;
    }
  }

  return roman;
}