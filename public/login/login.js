document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = '/dashboard/';
        return; 
    }
    const form = document.getElementById('login-form');
    const messageDiv = document.getElementById('message');
    const passwordInput = document.getElementById('password');
    const togglePasswordIcon = document.getElementById('togglePasswordIcon');

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

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const email = emailInput.value;
    const password = passwordInput.value;
    
    emailInput.classList.remove('input-error');
    passwordInput.classList.remove('input-error');
    showMessage('', '');

    if (!email || !password) {
        showMessage('Por favor, preencha todos os campos.', 'error');
        
        emailInput.classList.add('input-error');
        passwordInput.classList.add('input-error');
        
        setTimeout(() => {
            showMessage('', '');

            emailInput.classList.remove('input-error');
            passwordInput.classList.remove('input-error');
        }, 3000);

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
            showMessage('Login realizado com sucesso! Redirecionando...', 'success');
            localStorage.setItem('token', data.token);
            setTimeout(() => {
                window.location.href = '/dashboard/';
            }, 1000);
        } else {

            showMessage(data.message, 'error');
            
            emailInput.classList.add('input-error');
            passwordInput.classList.add('input-error');

            setTimeout(() => {
                showMessage('', '');

                emailInput.classList.remove('input-error');
                passwordInput.classList.remove('input-error');
            }, 3000);
        }

    } catch (error) {

        showMessage('Falha na comunicação com o servidor.', 'error');
        

        emailInput.classList.add('input-error');
        passwordInput.classList.add('input-error');

        setTimeout(() => {
            showMessage('', '');

            emailInput.classList.remove('input-error');
            passwordInput.classList.remove('input-error');
        }, 3000);
    }
});

    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = type ? `message ${type}` : '';
    }
});
