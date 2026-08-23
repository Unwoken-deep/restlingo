document.addEventListener('DOMContentLoaded', () => {

    if (localStorage.getItem('restlingo_theme') === 'light') {
        document.body.classList.add('light');
    }

    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.2s';

    const messageInput = document.getElementById('feedback-message');
    const sendButton = document.getElementById('send-feedback');
    const typeButtons = document.querySelectorAll('.feedback-type-btn');

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

        const data = {
            type: selectedType,
            message: message
        };

        try {
            await fetch('https://formspree.io/f/mbgreaqq', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            alert('Спасибо! Сообщение отправлено');
            messageInput.value = '';
            typeButtons.forEach(b => b.classList.remove('active'));
            selectedType = '💬 Сообщение';
        } catch (error) {
            alert('Не получилось отправить. Попробуй ещё раз');
        }
    });
});