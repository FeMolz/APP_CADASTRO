document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    // Guarda de rota: Se não há token, redireciona para o login.
    if (!token) {
        window.location.href = '/login/';
        return;
    }

    // --- SELEÇÃO DE ELEMENTOS ---
    const projectList = document.getElementById('project-list');
    const newProjectForm = document.getElementById('new-project-form');
    const newProjectNameInput = document.getElementById('new-project-name');
    const logoutButton = document.getElementById('logout-button');

    // --- FUNÇÕES ---

    // Função para buscar e renderizar os projetos
    const fetchAndRenderProjects = async () => {
        try {
            const response = await fetch('/api/projects', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                // Se o token for inválido/expirado, o servidor retornará um erro 401
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login/';
                }
                throw new Error('Falha ao buscar projetos.');
            }

            const projects = await response.json();

            // Limpa a lista atual
            projectList.innerHTML = ''; 

            // Adiciona cada projeto à lista na sidebar
            projects.forEach(project => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<a href="#" data-project-id="${project._id}"><i class="bi bi-folder"></i> ${project.name}</a>`;
                projectList.appendChild(listItem);
            });

        } catch (error) {
            console.error('Erro:', error);
        }
    };

    // Função para criar um novo projeto
    const handleNewProjectSubmit = async (event) => {
        event.preventDefault();
        const projectName = newProjectNameInput.value.trim();

        if (!projectName) return; // Não faz nada se o nome estiver vazio

        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: projectName })
            });

            if (!response.ok) throw new Error('Falha ao criar projeto.');

            newProjectNameInput.value = ''; // Limpa o campo de input
            await fetchAndRenderProjects(); // Atualiza a lista de projetos na tela

        } catch (error) {
            console.error('Erro:', error);
        }
    };

    // --- EVENT LISTENERS ---

    // Listener para o formulário de novo projeto
    newProjectForm.addEventListener('submit', handleNewProjectSubmit);

    // Listener para o botão de logout
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');

        window.location.href = '/login/';
    });

    // --- INICIALIZAÇÃO ---
    // Busca os projetos assim que a página carrega
    fetchAndRenderProjects();
});