const themes = {
    general: [
        {
            question: 'Qual a capital da França?',
            options: ['Berlim', 'Madri', 'Paris', 'Lisboa'],
            answer: 2
        },
        {
            question: 'Qual é o maior planeta do Sistema Solar?',
            options: ['Terra', 'Marte', 'Júpiter', 'Saturno'],
            answer: 2
        },
        {
            question: 'Qual é a moeda oficial do Japão?',
            options: ['Yuan', 'Won', 'Dólar', 'Iene'],
            answer: 3
        },
        {
            question: 'Quem pintou a Mona Lisa?',
            options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Claude Monet'],
            answer: 2
        },
        {
            question: 'Qual é o menor país do mundo?',
            options: ['Mônaco', 'San Marino', 'Vaticano', 'Liechtenstein'],
            answer: 2
        },
        {
            question: 'Quantos estados tem o Brasil?',
            options: ['26', '27', '25', '28'],
            answer: 1
        },
        {
            question: 'Qual é a língua oficial do Egito?',
            options: ['Inglês', 'Espanhol', 'Árabe', 'Francês'],
            answer: 2
        },
        {
            question: 'Qual a cidade mais populosa do Brasil?',
            options: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 'Curitiba'],
            answer: 0
        }
    ],
    science: [
        {
            question: 'Qual é a fórmula química da água?',
            options: ['CO2', 'H2O', 'O2', 'H2SO4'],
            answer: 1
        },
        {
            question: 'Qual é a velocidade da luz?',
            options: ['300.000 km/s', '150.000 km/s', '299.792 km/s', '400.000 km/s'],
            answer: 2
        },
        {
            question: 'Qual é o elemento químico representado pelo símbolo "O"?',
            options: ['Ouro', 'Oxigênio', 'Osmium', 'Óxido'],
            answer: 1
        },
        {
            question: 'Quantos ossos tem o corpo humano adulto?',
            options: ['206', '208', '210', '212'],
            answer: 0
        },
        {
            question: 'Qual é a unidade básica da vida?',
            options: ['Átomo', 'Célula', 'Molécula', 'Tecido'],
            answer: 1
        },
        {
            question: 'Qual planeta é conhecido como o Planeta Vermelho?',
            options: ['Terra', 'Marte', 'Júpiter', 'Vênus'],
            answer: 1
        },
        {
            question: 'Qual é a substância mais dura encontrada na natureza?',
            options: ['Ouro', 'Ferro', 'Diamante', 'Quartzo'],
            answer: 2
        }
    ],
    history: [
        {
            question: 'Quem escreveu "Dom Quixote"?',
            options: ['Miguel de Cervantes', 'William Shakespeare', 'Machado de Assis', 'J.K. Rowling'],
            answer: 0
        },
        {
            question: 'Quantos continentes existem na Terra?',
            options: ['4', '5', '6', '7'],
            answer: 3
        },
        {
            question: 'Em que ano ocorreu a Revolução Francesa?',
            options: ['1789', '1776', '1804', '1799'],
            answer: 0
        },
        {
            question: 'Quem foi o primeiro presidente dos Estados Unidos?',
            options: ['Abraham Lincoln', 'Thomas Jefferson', 'John Adams', 'George Washington'],
            answer: 3
        },
        {
            question: 'Em que ano o homem pisou na Lua pela primeira vez?',
            options: ['1965', '1969', '1972', '1968'],
            answer: 1
        },
        {
            question: 'Quem era o imperador do Brasil durante a independência?',
            options: ['D. Pedro I', 'D. Pedro II', 'Getúlio Vargas', 'Juscelino Kubitschek'],
            answer: 0
        },
        {
            question: 'Qual civilização construiu as pirâmides de Gizé?',
            options: ['Maias', 'Astecas', 'Egípcios', 'Incas'],
            answer: 2
        }
    ]
};

const themeImages = {
    general: 'images/general.jpeg',
    science: 'images/science.jpeg',
    history: 'images/history.jpeg'
};

const themeTranslation = {
    general: 'Geral',
    science: 'Ciências',
    history: 'História'   
}

let currentTheme = 'general';
let questions = themes[currentTheme];
let currentQuestionIndex = 0;
let userAnswers = [];
let score = 0;
let timerInterval;
let timerSeconds = 0;
let confirmed = false;

document.addEventListener('DOMContentLoaded', function() {
    const themeSelect = document.getElementById('theme-select');
    const themeImage = document.getElementById('theme-image');
    document.getElementById('selected-theme').innerHTML = `${themeTranslation[currentTheme]}`;

    themeImage.src = themeImages[currentTheme];

    themeSelect.addEventListener('change', (event) => {
        currentTheme = event.target.value;
        themeImage.src = themeImages[currentTheme];
        themeImage.style.display = 'block';
        document.getElementById('selected-theme').innerHTML = `${themeTranslation[currentTheme]}`;
    });

    document.getElementById('confirm-button').addEventListener('click', () => {
        const selectedOption = document.querySelector('input[name="option"]:checked').value;
        userAnswers.push(parseInt(selectedOption));

        const options = document.querySelectorAll('input[name="option"]');
        const correctAnswer = questions[currentQuestionIndex].answer;

        const correctAnswerWord = questions[currentQuestionIndex].options[correctAnswer]
        const userAnswerWord = questions[currentQuestionIndex].options[selectedOption]

        if (correctAnswerWord === userAnswerWord) {
            document.getElementById('feedback').style.display = "block";
            document.getElementById('feedback').style.marginTop = "20px";
            document.getElementById('feedback').classList.remove('incorrect-feedback');
            document.getElementById('feedback').classList.add('correct-feedback');
            document.getElementById('feedback').innerHTML = `Correto! Você escolheu ${userAnswerWord}, resposta exata!`;
        } else {
            document.getElementById('feedback').style.display = "block";
            document.getElementById('feedback').style.marginTop = "20px";
            document.getElementById('feedback').classList.remove('correct-feedback');
            document.getElementById('feedback').classList.add('incorrect-feedback');
            document.getElementById('feedback').innerHTML = `Incorreto! Você escolheu ${userAnswerWord}, resposta correta é ${correctAnswerWord}!`;
        }

        options.forEach((option, index) => {
            if (index == correctAnswer) {
                option.parentElement.classList.add('correct');
            } else if (index == selectedOption) {
                option.parentElement.classList.add('incorrect');
            }
        });

        if (parseInt(selectedOption) === correctAnswer) {
            score++;
        }

        document.getElementById('confirm-button').disabled = true;
        document.getElementById('next-button').disabled = false;
        confirmed = true;

        updateProgressBar();

        if (currentQuestionIndex === questions.length - 1) {
            document.getElementById('next-button').textContent = 'Ver Resultados';
            clearInterval(timerInterval); // Stop the timer
        }
    });

    document.getElementById('next-button').addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            displayQuestion(questions[currentQuestionIndex]);
            confirmed = false;
            document.getElementById('feedback').style.display = "none";
        } else {
            displayScore();
        }
    });

    document.getElementById('start-button').addEventListener('click', () => {
        currentTheme = document.getElementById('theme-select').value;
        questions = themes[currentTheme];
        startQuiz();
    });

    document.getElementById('restart-button').addEventListener('click', () => {
        restartQuiz();
    });
});

function displayQuestion(question) {
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = `
        <h2>(${currentQuestionIndex + 1}/${questions.length}) ${question.question}</h2>
        ${question.options.map((option, index) => `
            <div id="question">
                <input type="radio" name="option" value="${index}" id="option${index}">
                <label class="option-label" for="option${index}">${option}</label>
            </div>
        `).join('')}
    `;
    document.getElementById('confirm-button').disabled = true;
    document.getElementById('next-button').disabled = true;
    document.getElementById('restart-button').disabled = false;
    document.getElementById('score-container').innerHTML = '';

    document.querySelectorAll('input[name="option"]').forEach(option => {
        option.addEventListener('change', () => {
            if (!confirmed) {
                document.getElementById('confirm-button').disabled = false;
            }
        });
    });

    document.querySelectorAll('#question').forEach(label => {
        label.addEventListener('click', (event) => {
            const clickedLabel = event.target.parentElement;

            if (confirmed) {
                return
            } else {
                document.getElementById('confirm-button').disabled = false;
            }

            // Remove a classe 'selected' de todos os outros labels
            document.querySelectorAll('#question').forEach(label => {
                if (label !== clickedLabel) {
                    label.classList.remove('selected');
                }
            });

            clickedLabel.classList.add('selected');
        });
    });

    document.getElementById('next-button').textContent = 'Next';
}

function startQuiz() {
    const startContainer = document.getElementById('start-container');
    const questionContainer = document.getElementById('question-container');
    const progressContainer = document.getElementById('progress-container');
    const timerDisplay = document.getElementById('timer');
    const confirmButton = document.getElementById('confirm-button');
    const nextButton = document.getElementById('next-button');
    const restartButton = document.getElementById('restart-button');
    const scoreContainer = document.getElementById('score-container');

    startContainer.style.display = 'none';
    questionContainer.style.display = 'block';
    progressContainer.style.display = 'block';
    timerDisplay.style.display = 'block';
    confirmButton.style.display = 'inline-block';
    nextButton.style.display = 'inline-block';
    restartButton.style.display = 'inline-block';
    scoreContainer.style.display = 'block';

    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = '0%';
    progressBar.textContent = '0%';

    startTimer();

    displayQuestion(questions[currentQuestionIndex]);
}

function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressBar.textContent = `${Math.round(progress)}%`;
}

function displayScore() {
    const scoreContainer = document.getElementById('score-container');
    const scorePercentage = (score / questions.length) * 100;
    scoreContainer.innerHTML = `Você acertou ${score} de ${questions.length} perguntas! (${Math.round(scorePercentage)}%)`;
    scoreContainer.style.marginTop = '20px';
    document.getElementById('next-button').disabled = true;

    const scoreBar = document.getElementById('score-bar');
    scoreBar.style.display = 'block';
    scoreBar.innerHTML = `
        <div class="progress-score-container">
            <div class="progress-score" style="width: ${scorePercentage}%;"></div>
        </div>
    `;
}

function restartQuiz() {
    currentQuestionIndex = 0;
    userAnswers = [];
    score = 0;
    timerSeconds = 0;
    clearInterval(timerInterval);
    const hours = Math.floor(timerSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((timerSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (timerSeconds % 60).toString().padStart(2, '0');
    document.getElementById('timer').textContent = `${hours}:${minutes}:${seconds}`;
    document.getElementById('confirm-button').style.display = 'none';
    document.getElementById('next-button').style.display = 'none';
    document.getElementById('confirm-button').disabled = true;
    document.getElementById('next-button').disabled = true;
    document.getElementById('restart-button').style.display = 'none';
    document.getElementById('score-container').innerHTML = '';
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = '0%';
    progressBar.textContent = '0%';
    confirmed = false;

    document.getElementById('score-container').style.marginTop = '0px';
    document.getElementById('start-container').style.display = 'block';
    document.getElementById('question-container').style.display = 'none';
    document.getElementById('progress-container').style.display = 'none';
    document.getElementById('timer').style.display = 'none';
    document.getElementById('feedback').style.display = 'none';
    document.getElementById('score-container').style.display = 'none';
    document.getElementById('score-bar').style.display = 'none';
}

function startTimer() {
    timerInterval = setInterval(() => {
        timerSeconds++;
        const hours = Math.floor(timerSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((timerSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = (timerSeconds % 60).toString().padStart(2, '0');
        document.getElementById('timer').textContent = `${hours}:${minutes}:${seconds}`;
    }, 1000);
}