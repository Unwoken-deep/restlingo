document.addEventListener('DOMContentLoaded', () => {

    // Карточка слова
    const card = document.getElementById('flashcard');
    const wordElement = document.getElementById('word');
    const translationElement = document.getElementById('translation');

    // Карточка фразы
    const phraseCard = document.getElementById('phrase-card');
    const phraseElement = document.getElementById('phrase');
    const phraseTranslationElement = document.getElementById('phrase-translation');

    const newWordInput = document.getElementById('new-word');
    const newTranslationInput = document.getElementById('new-translation');
    const addButton = document.getElementById('add-button');
    const shuffleButton = document.getElementById('shuffle-button');
    const deleteButton = document.getElementById('delete-button');

    const prevWord = document.getElementById('prev-word');
    const nextWord = document.getElementById('next-word');
    const prevPhrase = document.getElementById('prev-phrase');
    const nextPhrase = document.getElementById('next-phrase');

    const counter = document.getElementById('card-counter');
    const daysCount = document.getElementById('days-count');
    const moonPhrase = document.getElementById('moon-phrase');
    const themeToggle = document.getElementById('theme-toggle');
    const moon = document.getElementById('moon');

    const typeWordBtn = document.getElementById('type-word');
    const typePhraseBtn = document.getElementById('type-phrase');

    let selectedType = 'word';

    let cards = [
        { word: 'Hello', translation: 'Привет', type: 'word', active: true },
        { word: 'Goodbye', translation: 'Пока', type: 'word', active: true },
        { word: 'Thank you', translation: 'Спасибо', type: 'word', active: true },
        { word: 'Please', translation: 'Пожалуйста', type: 'word', active: true },
        { word: 'Piece of cake', translation: 'Легко', type: 'phrase', active: true },
        { word: 'Break a leg', translation: 'Удачи', type: 'phrase', active: true }
    ];

    function saveCards() {
        localStorage.setItem('restlingo_cards', JSON.stringify(cards));
    }

    const savedCards = localStorage.getItem('restlingo_cards');
    if (savedCards) {
        cards = JSON.parse(savedCards);
    }

    let wordCards = cards.filter(c => c.type === 'word' && c.active !== false);
    let phraseCards = cards.filter(c => c.type === 'phrase' && c.active !== false);

    let wordIndex = 0;
    let phraseIndex = 0;

    if (localStorage.getItem('restlingo_theme') === 'light') {
        document.body.classList.add('light');
        themeToggle.textContent = '🌙';
    }

    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.2s';

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light');
        if (document.body.classList.contains('light')) {
            localStorage.setItem('restlingo_theme', 'light');
            themeToggle.textContent = '🌙';
        } else {
            localStorage.setItem('restlingo_theme', 'dark');
            themeToggle.textContent = '☀️';
        }
    });

    let lastVisit = localStorage.getItem('restlingo_last_visit');
    let days = parseInt(localStorage.getItem('restlingo_days')) || 1;
    const today = new Date().toDateString();

    if (lastVisit !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (lastVisit === yesterday) {
            days += 1;
        } else {
            days = 1;
        }
        localStorage.setItem('restlingo_last_visit', today);
        localStorage.setItem('restlingo_days', days);
    }

    function updateCounter() {
        const total = wordCards.length + phraseCards.length;
        if (counter) counter.textContent = total;
    }

    function updateMoon() {
        if (!daysCount || !moonPhrase) return;

        daysCount.textContent = days;

        const specialPhrases = {
            1: 'Ну что, погнали?',
            3: 'А ты втягиваешься ;)',
            7: 'Omg, целая неделя!',
            14: 'Уже привычка',
            30: 'Месяц! Ну ты даёшь!',
            50: 'Полтинник! Шутишь!?',
            100: 'Сотка!? Чего-чего!?',
            365: 'Легенда, базару ноль ;)'
        };

        const regularPhrases = [
            'Ну чё, погнали дальше',
            'Ты снова тут. Это сильно',
            'Сегодня тоже зашёл — уважение',
            'Не останавливайся',
            'Ты реально делаешь',
            'Ещё один день в копилку',
            'Стрик жив. Ты жив. Всё отлично',
            'Ты не сдулся — это главное',
            'Продолжаешь. Это редкость',
            'Тихо, но идёшь',
            'Молча делаешь. Так и надо',
            'Ты уже не нытик, ты система',
            'Ты снова здесь. Это уже не случайность',
            'Стрик живёт, пока ты заходишь',
            'Каждый день — плюс к тебе',
            'Язык не выучит сам себя, но ты и не ждёшь',
            'Ты реально в процессе',
            'Не гони. Просто продолжай',
            'Этот день тоже твой',
            'Ты снова выбрал не забить',
            'Скучно? Зато работает',
            'Ты на длинной дистанции',
            'Не геройствуй. Просто заходи',
            'У тебя уже система, а не попытки',
            'Вот так и становятся теми, кто знает',
            'Ты не забросил. Это уже много',
            'Один раз — случайность. Каждый день — характер',
            'Не ищешь оправданий. Вижу',
            'Зашёл, хотя мог залипнуть. Сильно',
            'Ты в игре',
            'Язык — это марафон, а ты бежишь',
            'У тебя сегодня +1 к силе',
            'Всё, что нужно, — уже происходит',
            'Ты не ждёшь идеального дня. Ты делаешь',
            'Продолжаешь. Без фанфар. Так и надо',
            'Это и есть дисциплина',
            'Ты уже не на нуле',
            'Копилка пополнилась',
            'Ты сам себе тренер',
            'Не зря зашёл',
            'Не ради галочки. Ради себя',
            'Ты снова сделал выбор в свою пользу',
            'Английский по чуть-чуть — и он уже твой',
            'Ты не оправдываешься. Это видно',
            'Молча, но каждый день',
            'Сегодня ты сильнее вчерашнего',
            'Дисциплина тихо делает своё дело',
            'Ты не забросил. Это уже половина',
            'Язык покоряется тем, кто не останавливается',
            'Даже 5 минут — это шаг',
            'Ты снова тут. Значит, тебе не всё равно',
            'Не прыгаешь выше головы, но растёшь',
            'Вот это я понимаю — стабильность',
            'Зашёл, сделал, пошёл дальше',
            'Ты не ждёшь понедельника. Это сильно',
            'Каждый день — кирпичик',
            'Ты уже не тот, кто начинал',
            'Без суеты. Так и становятся',
            'Всё идёт, пока ты идёшь',
            'Ты создаёшь привычку',
            'И это работает',
            'Ты не остановился. Респект',
            'Сегодня тоже не сдался',
            'Английский чувствует, что ты серьёзен',
            'Ты не откладываешь. Это редкость',
            'Продолжаешь без шума. Сильно',
            'Ты в своём ритме',
            'Это и есть путь',
            'Ты не теряешь дни',
            'С каждым днём всё естественнее'
        ];

        if (specialPhrases[days]) {
            moonPhrase.textContent = specialPhrases[days];
        } else {
            const randomIndex = Math.floor(Math.random() * regularPhrases.length);
            moonPhrase.textContent = regularPhrases[randomIndex];
        }

        updateMoonVisual();
    }

    function updateMoonVisual() {
        if (!moon) return;

        moon.classList.remove('moon-phase-1', 'moon-phase-2', 'moon-phase-3', 'moon-phase-4');

        if (days <= 3) {
            moon.classList.add('moon-phase-1');
        } else if (days <= 7) {
            moon.classList.add('moon-phase-2');
        } else if (days <= 14) {
            moon.classList.add('moon-phase-3');
        } else {
            moon.classList.add('moon-phase-4');
        }
    }

    function showWordCard() {
        if (!card || !wordElement || !translationElement) return;

        if (wordCards.length === 0) {
            wordElement.textContent = 'Пусто';
            translationElement.textContent = 'Добавь слово';
            updateCounter();
            return;
        }

        const current = wordCards[wordIndex];

        if (card.classList.contains('is-flipped')) {
            card.classList.remove('is-flipped');

            wordElement.textContent = current.word;
            translationElement.textContent = current.translation;

            card.style.transition = 'none';
            card.style.opacity = '0';

            setTimeout(() => {
                card.style.transition = 'transform 0.5s, opacity 0.3s';
                card.style.opacity = '1';
            }, 50);
        } else {
            wordElement.textContent = current.word;
            translationElement.textContent = current.translation;
        }

        updateCounter();
    }

    function showPhraseCard() {
        if (!phraseCard || !phraseElement || !phraseTranslationElement) return;

        if (phraseCards.length === 0) {
            phraseElement.textContent = 'Пусто';
            phraseTranslationElement.textContent = 'Добавь фразу';
            updateCounter();
            return;
        }

        const current = phraseCards[phraseIndex];

        if (phraseCard.classList.contains('is-flipped')) {
            phraseCard.classList.remove('is-flipped');

            phraseElement.textContent = current.word;
            phraseTranslationElement.textContent = current.translation;

            phraseCard.style.transition = 'none';
            phraseCard.style.opacity = '0';

            setTimeout(() => {
                phraseCard.style.transition = 'transform 0.5s, opacity 0.3s';
                phraseCard.style.opacity = '1';
            }, 50);
        } else {
            phraseElement.textContent = current.word;
            phraseTranslationElement.textContent = current.translation;
        }

        updateCounter();
    }

    function nextWordCard() {
        wordCards = cards.filter(c => c.type === 'word' && c.active !== false);
        if (wordCards.length === 0) return;
        wordIndex = (wordIndex + 1) % wordCards.length;
        showWordCard();
    }

    function prevWordCard() {
        wordCards = cards.filter(c => c.type === 'word' && c.active !== false);
        if (wordCards.length === 0) return;
        wordIndex = (wordIndex - 1 + wordCards.length) % wordCards.length;
        showWordCard();
    }

    function nextPhraseCard() {
        phraseCards = cards.filter(c => c.type === 'phrase' && c.active !== false);
        if (phraseCards.length === 0) return;
        phraseIndex = (phraseIndex + 1) % phraseCards.length;
        showPhraseCard();
    }

    function prevPhraseCard() {
        phraseCards = cards.filter(c => c.type === 'phrase' && c.active !== false);
        if (phraseCards.length === 0) return;
        phraseIndex = (phraseIndex - 1 + phraseCards.length) % phraseCards.length;
        showPhraseCard();
    }

    if (card) {
        card.addEventListener('click', () => {
            card.classList.toggle('is-flipped');
        });
    }

    if (phraseCard) {
        phraseCard.addEventListener('click', () => {
            phraseCard.classList.toggle('is-flipped');
        });
    }

    if (nextWord) nextWord.addEventListener('click', nextWordCard);
    if (prevWord) prevWord.addEventListener('click', prevWordCard);
    if (nextPhrase) nextPhrase.addEventListener('click', nextPhraseCard);
    if (prevPhrase) prevPhrase.addEventListener('click', prevPhraseCard);

    if (typeWordBtn) {
        typeWordBtn.addEventListener('click', () => {
            selectedType = 'word';
            typeWordBtn.classList.add('active');
            typePhraseBtn.classList.remove('active');
        });
    }

    if (typePhraseBtn) {
        typePhraseBtn.addEventListener('click', () => {
            selectedType = 'phrase';
            typePhraseBtn.classList.add('active');
            typeWordBtn.classList.remove('active');
        });
    }

    function addCard() {
        const w = newWordInput.value.trim();
        const t = newTranslationInput.value.trim();
        if (w && t) {
            cards.push({
                word: w,
                translation: t,
                type: selectedType,
                active: true
            });
            saveCards();

            if (selectedType === 'word') {
                wordCards = cards.filter(c => c.type === 'word' && c.active !== false);
                wordIndex = wordCards.length - 1;
                showWordCard();
            } else {
                phraseCards = cards.filter(c => c.type === 'phrase' && c.active !== false);
                phraseIndex = phraseCards.length - 1;
                showPhraseCard();
            }

            newWordInput.value = '';
            newTranslationInput.value = '';
        } else {
            alert('Заполни оба поля');
        }
    }

    if (addButton) {
        addButton.addEventListener('click', addCard);
    }

    if (newWordInput && newTranslationInput) {
        newWordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                newTranslationInput.focus();
            }
        });

        newTranslationInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addCard();
            }
        });
    }

    if (shuffleButton) {
        shuffleButton.addEventListener('click', () => {
            if (selectedType === 'word') {
                for (let i = wordCards.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [wordCards[i], wordCards[j]] = [wordCards[j], wordCards[i]];
                }
                wordIndex = 0;
                showWordCard();
            } else {
                for (let i = phraseCards.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [phraseCards[i], phraseCards[j]] = [phraseCards[j], phraseCards[i]];
                }
                phraseIndex = 0;
                showPhraseCard();
            }
        });
    }

    if (deleteButton) {
        deleteButton.addEventListener('click', () => {
            if (selectedType === 'word') {
                if (wordCards.length === 0) return;
                if (!confirm('Удалить это слово?')) return;
                const target = wordCards[wordIndex];
                cards = cards.filter(c => !(c.word === target.word && c.translation === target.translation));
                saveCards();
                wordCards = cards.filter(c => c.type === 'word' && c.active !== false);
                wordIndex = 0;
                showWordCard();
            } else {
                if (phraseCards.length === 0) return;
                if (!confirm('Удалить эту фразу?')) return;
                const target = phraseCards[phraseIndex];
                cards = cards.filter(c => !(c.word === target.word && c.translation === target.translation));
                saveCards();
                phraseCards = cards.filter(c => c.type === 'phrase' && c.active !== false);
                phraseIndex = 0;
                showPhraseCard();
            }
        });
    }

    window.addEventListener('focus', () => {
        const saved = localStorage.getItem('restlingo_cards');
        if (saved) {
            cards = JSON.parse(saved);
        }
        wordCards = cards.filter(c => c.type === 'word' && c.active !== false);
        phraseCards = cards.filter(c => c.type === 'phrase' && c.active !== false);
        wordIndex = 0;
        phraseIndex = 0;
        showWordCard();
        showPhraseCard();
    });

    function createFirefly() {
        const firefly = document.createElement('div');
        firefly.className = 'firefly';
        firefly.style.left = Math.random() * 100 + '%';
        firefly.style.animationDuration = (Math.random() * 8 + 9) + 's';
        firefly.style.animationDelay = Math.random() * 6 + 's';
        document.body.appendChild(firefly);
    }

    for (let i = 0; i < 16; i++) {
        createFirefly();
    }

    showWordCard();
    showPhraseCard();
    updateMoon();
});