document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const messageDiv = document.getElementById('message');
    const passwordInput = document.getElementById('password');
    const togglePasswordIcon = document.getElementById('togglePasswordIcon');

    // Função de ver a senha (reutilizada)
    togglePasswordIcon.addEventListener('click', () => {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        if (isPassword) {
            passwordInput.setAttribute('type', 'text');
            togglePasswordIcon.classList.replace('bi-eye-slash-fill', 'bi-eye-fill');
        } else {
            passwordInput.setAttribute('type', 'password');
            togglePasswordIcon.classList.replace('bi-eye-fill', 'bi-eye-slash-fill');
        }
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = passwordInput.value;

        if (!email || !password) {
            showMessage('Por favor, preencha todos os campos.', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // SUCESSO! O token foi recebido.
                showMessage('Login realizado com sucesso! Redirecionando...', 'success');

                // 1. Salvar o token no localStorage do navegador
                localStorage.setItem('token', data.token);

                // 2. Redirecionar para uma página protegida (ex: dashboard) após um breve momento
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);

            } else {
                throw new Error(data.message);
            }

        } catch (error) {
            showMessage(error.message, 'error');
        }
    });

    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = type ? `message ${type}` : '';
    }
});