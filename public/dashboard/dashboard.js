document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificar se existe um token no localStorage
    const token = localStorage.getItem('token');

    if (!token) {
        // Se não houver token, o usuário não está logado.
        // Redireciona de volta para a página de login.
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'login.html';
    }

    // Lógica do botão de logout
    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', () => {
        // 1. Remover o token do localStorage
        localStorage.removeItem('token');

        // 2. Redirecionar para a página de login
        alert('Você foi desconectado.');
        window.location.href = 'login.html';
    });
});