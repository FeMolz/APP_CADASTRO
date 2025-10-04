document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        // Se já existe um token, o usuário já está logado.
        // Redireciona para o dashboard e para a execução do script.
        window.location.href = '/dashboard/';
        return; 
    }
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

    // 1. Selecionar os elementos dos inputs, não apenas os valores
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Pegar os valores
    const email = emailInput.value;
    const password = passwordInput.value;
    
    // 2. Limpar bordas de erro de tentativas anteriores
    emailInput.classList.remove('input-error');
    passwordInput.classList.remove('input-error');
    showMessage('', '');

    // Validação de campos vazios
    if (!email || !password) {
        showMessage('Por favor, preencha todos os campos.', 'error');
        
        // 3. ADICIONADO: Aplica a classe de erro nas bordas
        emailInput.classList.add('input-error');
        passwordInput.classList.add('input-error');
        
        setTimeout(() => {
            showMessage('', '');
            // 4. ADICIONADO: Remove a classe de erro das bordas
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
            // Erro vindo da API (ex: senha incorreta)
            showMessage(data.message, 'error');
            
            // 3. ADICIONADO: Aplica a classe de erro nas bordas
            emailInput.classList.add('input-error');
            passwordInput.classList.add('input-error');

            setTimeout(() => {
                showMessage('', '');
                // 4. ADICIONADO: Remove a classe de erro das bordas
                emailInput.classList.remove('input-error');
                passwordInput.classList.remove('input-error');
            }, 3000);
        }

    } catch (error) {
        // Erro de conexão com o servidor
        showMessage('Falha na comunicação com o servidor.', 'error');
        
        // 3. ADICIONADO: Aplica a classe de erro nas bordas
        emailInput.classList.add('input-error');
        passwordInput.classList.add('input-error');

        setTimeout(() => {
            showMessage('', '');
            // 4. ADICIONADO: Remove a classe de erro das bordas
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
