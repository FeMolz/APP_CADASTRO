document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificar se existe um token no localStorage
    const token = localStorage.getItem('token');

    if (!token) {
        // Se não houver token, o usuário não está logado.
        alert('Você precisa estar logado para acessar esta página.');

        window.location.href = '/login/'; 
    }

    // Lógica do botão de logout
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) { 
        logoutButton.addEventListener('click', () => {
            // 1. Remover o token do localStorage
            localStorage.removeItem('token');

            // 2. Redirecionar para a página de login
            alert('Você foi desconectado.');

            window.location.href = '/login/'; 
        });
    }
});