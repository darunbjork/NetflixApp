document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            formStatus.textContent = 'Skickar...';

            try {
                const response = await fetch('/api/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, message }),
                });

                if (response.ok) {
                    formStatus.textContent = 'Meddelande skickat!';
                    formStatus.style.color = 'green';
                    contactForm.reset();
                } else {
                    const errorData = await response.json();
                    formStatus.textContent = `Fel: ${errorData.error || 'Kunde inte skicka meddelandet.'}`;
                    formStatus.style.color = 'red';
                }
            } catch (error) {
                formStatus.textContent = 'Ett nätverksfel inträffade. Försök igen.';
                formStatus.style.color = 'red';
            }
        });
    }
});