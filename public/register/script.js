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

    // Só adiciona o listener se o campo de confirmação existir
    if (document.getElementById('toggleConfirmPasswordIcon') && confirmPasswordInput) {
        document.getElementById('toggleConfirmPasswordIcon').addEventListener('click', () => {
            togglePasswordVisibility(confirmPasswordInput, document.getElementById('toggleConfirmPasswordIcon'));
        });
    }

    // Função para verificar a força da senha
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        let className = '';
        let width = '0';
        switch (score) {
            case 1:
            case 2:
                className = 'strength-weak'; width = '25%'; break;
            case 3:
                className = 'strength-medium'; width = '50%'; break;
            case 4:
                className = 'strength-good'; width = '75%'; break;
            case 5:
                className = 'strength-strong'; width = '100%'; break;
            default:
                className = ''; width = '0';
        }
        passwordStrengthDiv.innerHTML = `<div class="${className}" style="width:${width}"></div>`;
    });

    // Função para mostrar erro
    const showError = (input, message) => {
        const formGroup = input.parentElement.closest('.form-group');
        formGroup.classList.remove('success');
        formGroup.classList.add('error');
        showTempMessage(message, 'error');
    };

    // Função para mostrar sucesso
    const showSuccess = (input) => {
        const formGroup = input.parentElement.closest('.form-group');
        formGroup.classList.remove('error');
        formGroup.classList.add('success');
    };

    // Função para mostrar mensagem temporária
    function showTempMessage(message, type) {
        messageDiv.textContent = message;
        // Adiciona a classe de mensagem (ex: 'error' ou 'success' no #message)
        messageDiv.className = type; 

        setTimeout(() => {
            // Limpa a mensagem de texto
            messageDiv.textContent = '';
            messageDiv.className = '';
            
            // ADICIONADO: Limpa as classes de erro/sucesso de TODOS os campos
            const allFormGroups = form.querySelectorAll('.form-group');
            allFormGroups.forEach(group => {
                group.classList.remove('error', 'success');
            });

        }, 2500); 
    }
    
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
        // Só adiciona inputs que existem no HTML
        const inputs = [nameInput, emailInput, passwordInput]
            .concat(confirmEmailInput ? [confirmEmailInput] : [])
            .concat(confirmPasswordInput ? [confirmPasswordInput] : []);
        
        // Resetar estilos
        inputs.forEach(input => {
            input.parentElement.closest('.form-group').classList.remove('error', 'success');
        });

        // 1. Verificar campos vazios
        inputs.forEach(input => {
            if (input.value.trim() === '') {
                showError(input, 'Todos os campos são obrigatórios');
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
        if (confirmEmailInput) {
            if (emailInput.value !== confirmEmailInput.value) {
                showError(confirmEmailInput, 'Os e-mails não coincidem.');
                isValid = false;
            } else {
                if(isValidEmail(emailInput.value)) showSuccess(confirmEmailInput);
            }
        }

        // 4. Validar senha (mínimo 8 caracteres)
        if (passwordInput.value.length < 8) {
            showError(passwordInput, 'A senha deve ter no mínimo 8 caracteres.');
            isValid = false;
        } else {
            showSuccess(passwordInput);
        }

        // 5. Confirmar Senha
        if (confirmPasswordInput) {
            if (passwordInput.value !== confirmPasswordInput.value) {
                showError(confirmPasswordInput, 'As senhas não coincidem.');
                isValid = false;
            } else {
                if(passwordInput.value.length >= 8) showSuccess(confirmPasswordInput);
            }
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
                    showTempMessage(data.message || 'Cadastro realizado com sucesso!', 'success');
                    form.reset();
                    passwordStrengthDiv.innerHTML = '';
                } else {
                    throw new Error(data.message || 'Erro ao cadastrar.');
                }
            })
            .catch(error => {   
                showTempMessage(error.message, 'error');
            });
        }
    });
});