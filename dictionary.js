document.addEventListener('DOMContentLoaded', () => {

    const dictionaryList = document.getElementById('dictionary-list');
    const searchInput = document.getElementById('dictionary-search');

    function loadCards() {
        const saved = localStorage.getItem('restlingo_cards');
        if (saved) {
            return JSON.parse(saved);
        }
        return [];
    }

    function saveCards(cards) {
        localStorage.setItem('restlingo_cards', JSON.stringify(cards));
    }

    function render(filter = '') {
        const cards = loadCards();
        const filtered = cards.filter(c => {
            return c.word.toLowerCase().includes(filter.toLowerCase()) ||
                   c.translation.toLowerCase().includes(filter.toLowerCase());
        });

        dictionaryList.innerHTML = '';

        if (filtered.length === 0) {
            dictionaryList.innerHTML = '<p style="color:#8b8490;">Ничего не найдено</p>';
            return;
        }

        filtered.forEach((item) => {
            const div = document.createElement('div');
            div.className = 'dictionary-item';

            const isActive = item.active !== false;

            div.innerHTML = `
                <div class="dictionary-info">
                    <div class="word">${item.word}</div>
                    <div class="translation">${item.translation}</div>
                </div>
                <div class="dictionary-actions">
                    <button class="toggle-btn">${isActive ? '⏸ Убрать' : '▶ Вернуть'}</button>
                    <button class="delete-btn">🗑</button>
                </div>
            `;

            if (!isActive) {
                div.style.opacity = '0.55';
            }

            div.querySelector('.toggle-btn').addEventListener('click', () => {
                const cards = loadCards();
                const target = cards.find(c => c.word === item.word && c.translation === item.translation);
                if (target) {
                    target.active = target.active === false ? true : false;
                    saveCards(cards);
                    render(searchInput.value);
                }
            });

            div.querySelector('.delete-btn').addEventListener('click', () => {
                const cards = loadCards();
                const targetIndex = cards.findIndex(c => c.word === item.word && c.translation === item.translation);
                if (targetIndex !== -1) {
                    cards.splice(targetIndex, 1);
                    saveCards(cards);
                    render(searchInput.value);
                }
            });

            dictionaryList.appendChild(div);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => render(searchInput.value));
    }

    render();
});