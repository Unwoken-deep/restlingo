document.addEventListener('DOMContentLoaded', () => {

    if (localStorage.getItem('restlingo_theme') === 'light') {
        document.body.classList.add('light');
    }

    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.2s';

    const messageInput = document.getElementById('feedback-message');
    const sendButton = document.getElementById('send-feedback');
    const typeButtons = document.querySelectorAll('.feedback-type-btn');

    const TOKEN = '8838463728:AAE-MPRExTau_zkVnAjuk5TPYAQqi7Cdr4k';
    const CHAT_ID = '8345303973';

    let selectedType = '💬 Сообщение';

    typeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            typeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedType = btn.getAttribute('data-type');
        });
    });

    sendButton.addEventListener('click', async () => {
        const message = messageInput.value.trim();

        if (!message) {
            alert('Напиши сообщение');
            return;
        }

        const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

        try {
            await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: `📩 RestLingo\n${selectedType}\n\n${message}`
                })
            });

            alert('Спасибо! Сообщение отправлено');
            messageInput.value = '';
            typeButtons.forEach(b => b.classList.remove('active'));
            selectedType = '💬 Сообщение';
        } catch (error) {
            alert('Не получилось отправить. Попробуй ещё раз');
        }
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