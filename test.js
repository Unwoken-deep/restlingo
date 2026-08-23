document.addEventListener('DOMContentLoaded', () => {

    if (localStorage.getItem('restlingo_theme') === 'light') {
        document.body.classList.add('light');
    }

    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.2s';

    const settings = document.getElementById('test-settings');
    const testCard = document.getElementById('test-card');
    const testResult = document.getElementById('test-result');

    const testWord = document.getElementById('test-word');
    const testOptions = document.getElementById('test-options');
    const testScore = document.getElementById('test-score');
    const nextButton = document.getElementById('next-test-button');
    const finishButton = document.getElementById('finish-test-button');
    const startButton = document.getElementById('start-test');
    const restartButton = document.getElementById('restart-test');

    const resultCorrect = document.getElementById('result-correct');
    const resultWrong = document.getElementById('result-wrong');
    const resultPhrase = document.getElementById('result-phrase');

    let direction = 'en-ru';
    let totalQuestions = 10;
    let testType = 'all';

    let currentQuestion = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let currentCard = null;
    let options = [];
    let answered = false;
    let usedWords = [];

    function loadCards() {
        const saved = localStorage.getItem('restlingo_cards');
        if (saved) return JSON.parse(saved);
        return [];
    }

    function chooseDirection(btn) {
        document.querySelectorAll('.direction-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        direction = btn.getAttribute('data-direction');
    }

    function chooseCount(btn) {
        document.querySelectorAll('.count-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const count = btn.getAttribute('data-count');
        totalQuestions = count === 'all' ? 'all' : parseInt(count);
    }

    function chooseTestType(btn) {
        document.querySelectorAll('.test-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        testType = btn.getAttribute('data-test-type');
    }

    document.querySelectorAll('.direction-btn').forEach(btn => {
        btn.addEventListener('click', () => chooseDirection(btn));
    });

    document.querySelectorAll('.count-btn').forEach(btn => {
        btn.addEventListener('click', () => chooseCount(btn));
    });

    document.querySelectorAll('.test-type-btn').forEach(btn => {
        btn.addEventListener('click', () => chooseTestType(btn));
    });

    function filterCardsByType(cards) {
        if (testType === 'all') return cards.filter(c => c.active !== false);
        if (testType === 'word') return cards.filter(c => (c.type === 'word' || !c.type) && c.active !== false);
        if (testType === 'phrase') return cards.filter(c => c.type === 'phrase' && c.active !== false);
        return cards.filter(c => c.active !== false);
    }

    function startTest() {
        const cards = filterCardsByType(loadCards());

        if (cards.length < 6) {
            alert('Нужно минимум 6 карточек для теста');
            return;
        }

        settings.style.display = 'none';
        testCard.style.display = 'block';
        testResult.style.display = 'none';

        currentQuestion = 0;
        correctAnswers = 0;
        wrongAnswers = 0;
        usedWords = [];

        generateQuestion(cards);
    }

    function generateQuestion(cards) {
        answered = false;

        const available = cards.filter(c => !usedWords.includes(c.word + c.translation));

        if (available.length === 0) {
            finishTest();
            return;
        }

        currentCard = available[Math.floor(Math.random() * available.length)];
        usedWords.push(currentCard.word + currentCard.translation);

        const variants = [currentCard];
        while (variants.length < 6) {
            const random = cards[Math.floor(Math.random() * cards.length)];
            if (!variants.includes(random)) {
                variants.push(random);
            }
        }

        options = variants.sort(() => Math.random() - 0.5);

        testWord.textContent = direction === 'en-ru' ? currentCard.word : currentCard.translation;
        testOptions.innerHTML = '';

        options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'test-option';
            btn.textContent = direction === 'en-ru' ? option.translation : option.word;
            btn.addEventListener('click', () => selectAnswer(btn, option));
            testOptions.appendChild(btn);
        });

        const maxQuestions = totalQuestions === 'all' ? cards.length : Math.min(totalQuestions, cards.length);
        testScore.textContent = `${currentQuestion + 1} / ${maxQuestions}`;
    }

    function selectAnswer(btn, selected) {
        if (answered) return;
        answered = true;

        const buttons = document.querySelectorAll('.test-option');

        buttons.forEach(b => {
            const option = options.find(o => {
                const text = direction === 'en-ru' ? o.translation : o.word;
                return text === b.textContent;
            });

            if (option === currentCard) {
                b.classList.add('correct');
            } else if (b === btn) {
                b.classList.add('wrong');
            }
            b.disabled = true;
        });

        if (selected === currentCard) {
            correctAnswers++;
        } else {
            wrongAnswers++;
        }
    }

    function nextQuestion() {
        if (!answered) return;

        const cards = filterCardsByType(loadCards());
        const maxQuestions = totalQuestions === 'all' ? cards.length : Math.min(totalQuestions, cards.length);

        currentQuestion++;

        if (currentQuestion >= maxQuestions) {
            finishTest();
        } else {
            generateQuestion(cards);
        }
    }

    function finishTest() {
        testCard.style.display = 'none';
        testResult.style.display = 'block';

        resultCorrect.textContent = `✅ Правильных: ${correctAnswers}`;
        resultWrong.textContent = `❌ Ошибок: ${wrongAnswers}`;

        const phrases = {
            0: [
                'Без единой ошибки. Ты вообще человек?',
                'Идеально. Можно учить других'
            ],
            '1-2': [
                'Почти чисто. Уважение',
                'Огонь. Ошибки вообще не в счёт'
            ],
            '3-5': [
                'Нормально. Мозг работает',
                'Хорошо идёшь, не гони'
            ],
            '6-10': [
                'И Рим не за два дня построился, не переживай',
                'Ошибаешься — значит учишься'
            ],
            '11-20': [
                'Ты всё ещё тут. Это уже победа',
                'Тяжело — значит растешь'
            ],
            '20+': [
                'Зато ты не сдался. Это главное',
                'Сегодня не твой день, но ты держишься'
            ]
        };

        let group = '';

        if (wrongAnswers === 0) group = '0';
        else if (wrongAnswers <= 2) group = '1-2';
        else if (wrongAnswers <= 5) group = '3-5';
        else if (wrongAnswers <= 10) group = '6-10';
        else if (wrongAnswers <= 20) group = '11-20';
        else group = '20+';

        const selectedPhrases = phrases[group];
        const phrase = selectedPhrases[Math.floor(Math.random() * selectedPhrases.length)];

        resultPhrase.textContent = `«${phrase}»`;
    }

    startButton.addEventListener('click', startTest);
    nextButton.addEventListener('click', nextQuestion);
    finishButton.addEventListener('click', finishTest);
    restartButton.addEventListener('click', () => {
        testResult.style.display = 'none';
        settings.style.display = 'block';
    });
    function createFirefly() {
    const firefly = document.createElement('div');
    firefly.className = 'firefly';
    firefly.style.left = Math.random() * 100 + '%';
    firefly.style.animationDuration = (Math.random() * 8 + 9) + 's';
    firefly.style.animationDelay = Math.random() * 6 + 's';
    document.body.appendChild(firefly);
}

for (let i = 0; i < 14; i++) {
    createFirefly();
}

function createFirefly() {
    const firefly = document.createElement('div');
    firefly.className = 'firefly';
    firefly.style.left = Math.random() * 100 + '%';
    firefly.style.animationDuration = (Math.random() * 8 + 9) + 's';
    firefly.style.animationDelay = Math.random() * 6 + 's';
    document.body.appendChild(firefly);
}

for (let i = 0; i < 14; i++) {
    createFirefly();
}
});