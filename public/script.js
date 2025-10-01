document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const confirmEmailInput = document.getElementById('confirmEmail');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const messageDiv = document.getElementById('message');
    const passwordStrengthDiv = document.getElementById('password-strength');

    // Função para alternar a visibilidade da senha
    const togglePasswordVisibility = (input, icon) => {
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('bi-eye-slash-fill');
            icon.classList.add('bi-eye-fill');
        } else {
            input.type = 'password';
            icon.classList.remove('bi-eye-fill');
            icon.classList.add('bi-eye-slash-fill');
        }
    };

    document.getElementById('togglePasswordIcon').addEventListener('click', () => {
        togglePasswordVisibility(passwordInput, document.getElementById('togglePasswordIcon'));
    });

    document.getElementById('toggleConfirmPasswordIcon').addEventListener('click', () => {
        togglePasswordVisibility(confirmPasswordInput, document.getElementById('toggleConfirmPasswordIcon'));
    });

    // Função para verificar a força da senha
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        let score = 0;
        
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        const strengthBar = passwordStrengthDiv.querySelector('div') || document.createElement('div');
        passwordStrengthDiv.innerHTML = '';
        passwordStrengthDiv.appendChild(strengthBar);

        switch (score) {
            case 1:
            case 2:
                strengthBar.className = 'strength-weak';
                break;
            case 3:
                strengthBar.className = 'strength-medium';
                break;
            case 4:
                strengthBar.className = 'strength-good';
                break;
            case 5:
                strengthBar.className = 'strength-strong';
                break;
            default:
                strengthBar.className = '';
        }
    });

    // Função para mostrar erro
    const showError = (input, message) => {
        const formGroup = input.parentElement.closest('.form-group');
        formGroup.classList.remove('success');
        formGroup.classList.add('error');
        messageDiv.textContent = message;
        messageDiv.className = 'error';
    };

    // Função para mostrar sucesso
    const showSuccess = (input) => {
        const formGroup = input.parentElement.closest('.form-group');
        formGroup.classList.remove('error');
        formGroup.classList.add('success');
    };
    
    // Função para validar email
    const isValidEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Validação do formulário no envio
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        messageDiv.textContent = '';
        
        let isValid = true;
        const inputs = [nameInput, emailInput, confirmEmailInput, passwordInput, confirmPasswordInput];
        
        // Resetar estilos
        inputs.forEach(input => {
            input.parentElement.closest('.form-group').classList.remove('error', 'success');
        });

        // 1. Verificar campos vazios
        inputs.forEach(input => {
            if (input.value.trim() === '') {
                showError(input, 'Todos os campos são obrigatórios.');
                isValid = false;
            } else {
                showSuccess(input);
            }
        });

        if (!isValid) return;

        // 2. Validar Email
        if (!isValidEmail(emailInput.value)) {
            showError(emailInput, 'Por favor, insira um e-mail válido.');
            isValid = false;
        } else {
            showSuccess(emailInput);
        }

        // 3. Confirmar Email
        if (emailInput.value !== confirmEmailInput.value) {
            showError(confirmEmailInput, 'Os e-mails não coincidem.');
            isValid = false;
        } else {
             if(isValidEmail(emailInput.value)) showSuccess(confirmEmailInput);
        }

        // 4. Validar senha (mínimo 8 caracteres)
        if (passwordInput.value.length < 8) {
            showError(passwordInput, 'A senha deve ter no mínimo 8 caracteres.');
            isValid = false;
        } else {
            showSuccess(passwordInput);
        }

        // 5. Confirmar Senha
        if (passwordInput.value !== confirmPasswordInput.value) {
            showError(confirmPasswordInput, 'As senhas não coincidem.');
            isValid = false;
        } else {
            if(passwordInput.value.length >= 8) showSuccess(confirmPasswordInput);
        }

        if (isValid) {
            // Enviar dados para o servidor
            const userData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value
            };

            fetch('http://localhost:3000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
            .then(async response => {
                const data = await response.json();
                if (response.ok) {
                    messageDiv.textContent = data.message || 'Cadastro realizado com sucesso!';
                    messageDiv.className = 'success';
                    form.reset();
                    passwordStrengthDiv.innerHTML = '';
                } else {
                    throw new Error(data.message || 'Erro ao cadastrar.');
                }
            })
            .catch(error => {
                messageDiv.textContent = error.message;
                messageDiv.className = 'error';
            });
        }
    });
});