document.addEventListener('DOMContentLoaded', () => {

    document.body.style.opacity = '1';
document.body.style.transition = 'opacity 0.2s';

    const dictionaryList = document.getElementById('dictionary-list');
    const searchInput = document.getElementById('dictionary-search');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let selectedType = 'all';

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
            const matchesSearch =
                c.word.toLowerCase().includes(filter.toLowerCase()) ||
                c.translation.toLowerCase().includes(filter.toLowerCase());

            const matchesType =
                selectedType === 'all' ||
                c.type === selectedType ||
                (selectedType === 'word' && !c.type) ||
                (selectedType === 'phrase' && c.type === 'phrase');

            return matchesSearch && matchesType;
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
            const typeLabel = '';

            div.innerHTML = `
                <div class="dictionary-info">
                    <div class="word">${typeLabel} ${item.word}</div>
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

    if (filterButtons) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedType = btn.getAttribute('data-type');
                render(searchInput.value);
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => render(searchInput.value));
    }

    render();

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