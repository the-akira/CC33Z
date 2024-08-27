const volumeControl = document.getElementById('volumeControl');
const clearButton = document.getElementById('clearButton');
const textArea = document.getElementById('textArea');
const keyboard = document.getElementById('keyboard');
const increaseHeightButton = document.getElementById('increaseHeight');
const decreaseHeightButton = document.getElementById('decreaseHeight');
const themeToggleButton = document.getElementById('theme-toggle');
const exportButton = document.getElementById('exportButton');
const copyButton = document.getElementById('copyButton');

const quranWords = [
    { word: "بسم", transliteration: "Bism", translation: "In the name" },
    { word: "الله", transliteration: "Allah", translation: "God" },
    { word: "الرحمن", transliteration: "Ar-Rahman", translation: "The Most Gracious" },
    { word: "الرحيم", transliteration: "Ar-Raheem", translation: "The Most Merciful" },
    { word: "الحمد", transliteration: "Al-Hamd", translation: "All praise" },
    { word: "رب", transliteration: "Rabb", translation: "Lord" },
    { word: "العالمين", transliteration: "Al-'Alamin", translation: "The worlds" },
    { word: "مالك", transliteration: "Malik", translation: "Master" },
    { word: "يوم", transliteration: "Yawm", translation: "Day" },
    { word: "الدين", transliteration: "Ad-Deen", translation: "The Judgment" },
    { word: "إياك", transliteration: "Iyyaka", translation: "You alone" },
    { word: "نعبد", transliteration: "Na'budu", translation: "We worship" },
    { word: "نستعين", transliteration: "Nasta'een", translation: "We seek help" },
    { word: "اهدنا", transliteration: "Ihdina", translation: "Guide us" },
    { word: "الصراط", transliteration: "As-Sirat", translation: "The path" },
    { word: "المستقيم", transliteration: "Al-Mustaqeem", translation: "The straight" },
    { word: "صراط", transliteration: "Sirat", translation: "Path" },
    { word: "الذين", transliteration: "Alladhina", translation: "Those who" },
    { word: "أنعمت", transliteration: "An'amta", translation: "You have bestowed" },
    { word: "عليهم", transliteration: "'Alayhim", translation: "Upon them" },
    { word: "غير", transliteration: "Ghayr", translation: "Not" },
    { word: "المغضوب", transliteration: "Al-Maghdub", translation: "Those who earned wrath" },
    { word: "ولا", transliteration: "Wa La", translation: "Nor" },
    { word: "الضالين", transliteration: "Ad-Dallin", translation: "The misguided" },
    { word: "ذلك", transliteration: "Dhalika", translation: "That" },
    { word: "الكتاب", transliteration: "Al-Kitab", translation: "The Book" },
    { word: "لا", transliteration: "La", translation: "No" },
    { word: "ريب", transliteration: "Rayb", translation: "Doubt" },
    { word: "فيه", transliteration: "Fihi", translation: "In it" },
    { word: "هدى", transliteration: "Hudan", translation: "Guidance" },
    { word: "للمتقين", transliteration: "Lil-Muttaqin", translation: "For the righteous" },
    { word: "الذين", transliteration: "Alladhina", translation: "Those who" },
    { word: "يؤمنون", transliteration: "Yu'minuna", translation: "Believe" },
    { word: "بالغيب", transliteration: "Bil-Ghayb", translation: "In the unseen" },
    { word: "ويقيمون", transliteration: "Yuqi'muna", translation: "And establish" },
    { word: "الصلاة", transliteration: "As-Salat", translation: "The prayer" },
    { word: "ومما", transliteration: "Wa Mimma", translation: "And out of what" },
    { word: "رزقناهم", transliteration: "Razaqnahum", translation: "We have provided them" },
    { word: "ينفقون", transliteration: "Yunfiqun", translation: "They spend" },
    { word: "الذين", transliteration: "Alladhina", translation: "Those who" },
    { word: "يؤمنون", transliteration: "Yu'minuna", translation: "Believe" },
    { word: "بما", transliteration: "Bima", translation: "In what" },
    { word: "أنزل", transliteration: "Unzila", translation: "Has been revealed" },
    { word: "إليك", transliteration: "Ilayka", translation: "To you" },
    { word: "من", transliteration: "Min", translation: "From" },
    { word: "قبل", transliteration: "Qablika", translation: "Before you" },
    { word: "وبالآخرة", transliteration: "Bil-Akhirah", translation: "In the Hereafter" },
    { word: "هم", transliteration: "Hum", translation: "They" },
    { word: "يوقنون", transliteration: "Yuqinun", translation: "Have certainty" },
    { word: "أولئك", transliteration: "Ula'ika", translation: "They are" },
    { word: "على", transliteration: "'Ala", translation: "Upon" },
    { word: "هدى", transliteration: "Hudan", translation: "Guidance" },
    { word: "من", transliteration: "Min", translation: "From" },
    { word: "ربهم", transliteration: "Rabbihim", translation: "Their Lord" },
    { word: "وأولئك", transliteration: "Wa Ula'ika", translation: "And they are" },
    { word: "هم", transliteration: "Hum", translation: "They" },
    { word: "المفلحون", transliteration: "Al-Muflihun", translation: "The successful" }
];

const arabicKeys = [
    { key: 'ا', name: 'ʾAlif', sound: 'sounds/Alif.mp3' },
    { key: 'ب', name: 'Bāʾ', sound: 'sounds/Bā.mp3' },
    { key: 'ت', name: 'Ṯāʾ', sound: 'sounds/Ṯā.mp3' },
    { key: 'ث', name: 'Thāʾ', sound: 'sounds/Thā.mp3' },
    { key: 'ج', name: 'Ǧīm', sound: 'sounds/Ǧīm.mp3' },
    { key: 'ح', name: 'Ḥāʾ', sound: 'sounds/Ḥā.mp3' },
    { key: 'خ', name: 'Khāʾ', sound: 'sounds/Khā.mp3' },
    { key: 'د', name: 'Dāl', sound: 'sounds/Dāl.mp3' },
    { key: 'ذ', name: 'Ḏhāl', sound: 'sounds/Ḏhāl.mp3' },
    { key: 'ر', name: 'Rāʾ', sound: 'sounds/Rā.mp3' },
    { key: 'ز', name: 'Zāy', sound: 'sounds/Zāy.mp3' },
    { key: 'س', name: 'Sīn', sound: 'sounds/Sīn.mp3' },
    { key: 'ش', name: 'Šhīn', sound: 'sounds/Šhīn.mp3' },
    { key: 'ص', name: 'Ṣād', sound: 'sounds/Ṣād.mp3' },
    { key: 'ض', name: 'Ḍād', sound: 'sounds/Ḍād.mp3' },
    { key: 'ط', name: 'Ṭāʾ', sound: 'sounds/Ṭā.mp3' },
    { key: 'ظ', name: 'Dhâʾ', sound: 'sounds/Ẓā.mp3' },
    { key: 'ع', name: 'ʿAyn', sound: 'sounds/Ayn.mp3' },
    { key: 'غ', name: 'Ḡayn', sound: 'sounds/Ḡayn.mp3' },
    { key: 'ف', name: 'Fāʾ', sound: 'sounds/Fā.mp3' },
    { key: 'ق', name: 'Qāf', sound: 'sounds/Qāf.mp3' },
    { key: 'ك', name: 'Kāf', sound: 'sounds/Kāf.mp3' },
    { key: 'ل', name: 'Lām', sound: 'sounds/Lām.mp3' },
    { key: 'م', name: 'Mīm', sound: 'sounds/Mīm.mp3' },
    { key: 'ن', name: 'Nūn', sound: 'sounds/Nūn.mp3' },
    { key: 'ه', name: 'Hāʾ', sound: 'sounds/Hā.mp3' },
    { key: 'و', name: 'Wāw', sound: 'sounds/Wāw.mp3' },
    { key: 'ي', name: 'Yāʾ', sound: 'sounds/Yā.mp3' },
    { key: 'ء', name: 'Hamza' },
    { key: 'ئ', name: 'ʾYāʾ Hamza' },
    { key: 'ؤ', name: 'Wāw Hamza' },
    { key: 'لا', name: 'Lām ʾAlif' },
    { key: 'ى', name: 'ʾAlif Maqsūra' },
    { key: 'ة', name: 'Tāʾ Marbūṭa' },
    { key: 'َ', name: 'Fatḥa' },
    { key: 'ً', name: 'Tanwīn Fatḥa' },
    { key: 'ُ', name: 'Ḍamma' },
    { key: 'ٌ', name: 'Tanwīn Ḍamma' },
    { key: 'ِ', name: 'Kasra' },
    { key: 'ٍ', name: 'Tanwīn Kasra' },
    { key: 'ّ', name: 'Šadda' },
    { key: 'ْ', name: 'Sukūn' },
    { key: 'ء', name: 'Hamza' },
    { key: 'ئ', name: 'ʾYāʾ Hamza' },
    { key: 'ؤ', name: 'Wāw Hamza' },
    { key: 'ٱ', name: 'ʾAlif Waṣla' },
    { key: 'إ', name: 'ʾAlif Hamza Abaixo' },
    { key: 'أ', name: 'ʾAlif Hamza Acima' },
    { key: 'آ', name: 'ʾAlif Maddah' },
    { key: 'ٰ', name: 'Alif Khunjāriyah' },
    { key: '٠', name: '0' },
    { key: '١', name: '1' },
    { key: '٢', name: '2' },
    { key: '٣', name: '3' },
    { key: '٤', name: '4' },
    { key: '٥', name: '5' },
    { key: '٦', name: '6' },
    { key: '٧', name: '7' },
    { key: '٨', name: '8' },
    { key: '٩', name: '9' },
    { key: '؟', name: 'Interrogação' },
    { key: '!', name: 'Exclamação' },
    { key: '؛', name: 'Ponto e vírgula' },
    { key: '،', name: 'Vírgula' },
    { key: '.', name: 'Ponto' },
    { key: 'ـ', name: 'Linha sublinhada' },
    { key: 'ٱ', name: 'ʾAlif Waṣla' },
    { key: 'ٲ', name: 'ʾAlif Abaixo' },
    { key: 'ٳ', name: 'ʾAlif Acima' },
    { key: ' ', name: 'Espaço' },
];

const keyMapping = {
    'a': 'ا',  
    'b': 'ب',  
    't': 'ت',  
    's': 'س',  
    'j': 'ج',
    'H': 'ح',
    'd': 'د',
    'r': 'ر',
    'z': 'ز',
    'S': 'ص',
    'D': 'ض',
    'T': 'ط',
    'Z': 'ظ',
    'g': 'ع',
    'f': 'ف',
    'q': 'ق',
    'k': 'ك',
    'l': 'ل',
    'm': 'م',
    'n': 'ن',
    'h': 'ه',
    'w': 'و',
    'y': 'ي',
    '-': 'ء',
};

const specialCombinations = {
    't\'': 'ث',
    'H\'': 'خ',
    'd\'': 'ذ',
    's\'': 'ش',
    'g\'': 'غ', 
};

function createKeyboard() {
    arabicKeys.forEach(({ key, name, sound }) => {
        const keyElement = document.createElement('div');
        keyElement.classList.add('key');
        keyElement.textContent = key;
        keyElement.setAttribute('title', name);

        keyElement.addEventListener('click', () => {
            textArea.value += key;
            textArea.focus();
            textArea.setSelectionRange(textArea.value.length, textArea.value.length);

            const userInput = textArea.value.trim().split(' ').pop();

            if (userInput) {
                const suggestions = quranWords.filter(item => item.word.startsWith(userInput)).slice(0, 5);
                showSuggestions(suggestions);
            } else {
                showSuggestions([]);
            }

            if (sound) {
                const audio = new Audio(sound);
                audio.volume = volumeControl.value;
                audio.play();
            }
        });

        keyboard.appendChild(keyElement);
    });
}

function showSuggestions(suggestions) {
    const suggestionBox = document.getElementById('suggestionBox');

    if (suggestions.length > 0) {
        suggestionBox.style.display = 'block';
        suggestionBox.style.border = '1px solid #ccc';
        suggestionBox.style.marginBottom = '20px';
    } else {
        suggestionBox.style.display = 'none';
    }
    suggestionBox.innerHTML = '';  // Limpa as sugestões anteriores
    suggestions.forEach(suggestion => {
        const suggestionElement = document.createElement('div');
        suggestionElement.classList.add('suggestion');
        suggestionElement.innerHTML = `
            <strong>${suggestion.word}</strong><br>
            <small>Transliteração: ${suggestion.transliteration}</small><br>
            <small>Tradução: ${suggestion.translation}</small>
        `;
        suggestionElement.addEventListener('click', () => {
            const words = textArea.value.split(' ');
            words.pop();  // Remove a palavra parcial
            textArea.value = words.join(' ') + ' ' + suggestion.word + ' ';
            suggestionBox.innerHTML = '';  // Limpa as sugestões após a seleção
            textArea.focus();
            suggestionBox.style.border = 'none';
            suggestionBox.style.marginBottom = '0px';
        });
        suggestionBox.appendChild(suggestionElement);
    });
}

exportButton.addEventListener('click', function() {
    const textAreaContent = document.getElementById('textArea').value;
    const blob = new Blob([textAreaContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = 'texto_arabico.txt';
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
});

copyButton.addEventListener('click', function() {
    const textArea = document.getElementById('textArea');
    textArea.select();
    textArea.setSelectionRange(0, 99999);
    document.execCommand('copy');
    alert('Texto copiado para a área de transferência');
});

clearButton.addEventListener('click', () => {
    textArea.value = '';
    showSuggestions([]);
});

let lastKey = '';
textArea.addEventListener('keydown', function(event) {
    const currentKey = event.key;

    const combination = lastKey + currentKey;
    if (combination in specialCombinations) {
        event.preventDefault();
        textArea.value = textArea.value.slice(0, -1) + specialCombinations[combination];
    }
    else if (currentKey in keyMapping) {
        event.preventDefault();
        textArea.value += keyMapping[currentKey];
    }

    lastKey = currentKey;
});

textArea.addEventListener('keyup', function() {
    const userInput = textArea.value.trim().split(' ').pop();

    if (userInput) {
        const suggestions = quranWords.filter(item => item.word.startsWith(userInput)).slice(0, 5);
        showSuggestions(suggestions);
    } else {
        showSuggestions([]);
    }
});

textArea.addEventListener('keydown', function(event) {
    if (event.key === "Backspace" || event.key === "Delete") {
        const userInput = textArea.value.slice(0, -1); // Remova o último caractere
        console.log(userInput)
        if (userInput.trim()) {
            const suggestions = quranWords.filter(item => item.word.startsWith(userInput)).slice(0, 5);
            showSuggestions(suggestions);
        } else {
            showSuggestions([]);
        }
    }
});

increaseHeightButton.addEventListener('click', () => {
    const currentHeight = parseInt(window.getComputedStyle(textArea).height);
    textArea.style.height = `${currentHeight + 20}px`;
});

decreaseHeightButton.addEventListener('click', () => {
    const currentHeight = parseInt(window.getComputedStyle(textArea).height);
    if (currentHeight > 85) { // Prevenção para evitar altura negativa ou muito pequena
        textArea.style.height = `${currentHeight - 20}px`;
    }
});

themeToggleButton.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        themeToggleButton.textContent = 'Claro';
    } else {
        themeToggleButton.textContent = 'Noturno';
    }
});

createKeyboard();