document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/login/'; return; }

    // --- SELEÇÃO DE ELEMENTOS ---
    const createBtn = document.querySelector('.btn-create-container');
    const toggleMenuBtn = document.querySelector('.toggle-menu-container');
    const logoutIcon = document.querySelector('.config-icons-container .bi-person-circle');
    
    // Elementos para as tarefas
    const modal = document.getElementById('task-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const taskForm = document.getElementById('task-form');
    const taskListContainer = document.getElementById('task-list-container');

    // --- FUNÇÕES DE INTERFACE (UI) ---
    const openModal = () => modal.classList.remove('hidden');
    const closeModal = () => modal.classList.add('hidden');
    const handleToggleMenu = () => document.body.classList.toggle('sidebar-collapsed');
    const handleLogout = () => {
        if (confirm('Tem certeza que deseja sair?')) {
            localStorage.removeItem('token');
            window.location.href = '/login/';
        }
    };

    // --- FUNÇÕES DE TAREFAS ---
    const fetchAndRenderTasks = async () => {
        try {
            const res = await fetch('/api/tasks', { headers: { 'Authorization': `Bearer ${token}` } });
            if (!res.ok) {
                if (res.status === 401) { // Token expirado/inválido
                    handleLogout();
                }
                throw new Error('Falha ao carregar tarefas');
            }
            const tasks = await res.json();

            taskListContainer.innerHTML = '';
            if (tasks.length === 0) {
                taskListContainer.innerHTML = '<p>Você ainda não tem tarefas. Clique em "Create" para adicionar uma!</p>';
                return;
            }

            tasks.forEach(task => {
                const taskCard = document.createElement('div');
                taskCard.className = 'task-card';
                taskCard.setAttribute('data-id', task._id);
                taskCard.innerHTML = `
                    <h3>${task.title}</h3>
                    <p>${task.description || ''}</p>
                    ${task.imageUrl ? `<img src="${task.imageUrl}" alt="${task.title}">` : ''}
                    <div class="task-card-actions">
                        <button class="edit-btn" title="Editar"><i class="bi bi-pencil-square"></i></button>
                        <button class="delete-btn" title="Apagar"><i class="bi bi-trash3-fill"></i></button>
                    </div>
                `;
                taskListContainer.appendChild(taskCard);
            });
        } catch (error) { console.error(error); }
    };

    const handleTaskFormSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(taskForm);

        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            if (!res.ok) throw new Error('Falha ao salvar a tarefa');
            
            closeModal();
            taskForm.reset();
            await fetchAndRenderTasks();
        } catch (error) { console.error(error); }
    };

    const handleTaskListClick = async (e) => {
        const deleteBtn = e.target.closest('.delete-btn');
        if (deleteBtn) {
            const taskCard = deleteBtn.closest('.task-card');
            const taskId = taskCard.dataset.id;
            
            if (confirm('Tem certeza que deseja apagar esta tarefa?')) {
                try {
                    const res = await fetch(`/api/tasks/${taskId}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!res.ok) throw new Error('Falha ao deletar a tarefa');
                    await fetchAndRenderTasks();
                } catch (error) { console.error(error); }
            }
        }
        // Lógica para editar pode ser adicionada aqui no futuro
    };

    // --- EVENT LISTENERS ---
    createBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    taskForm.addEventListener('submit', handleTaskFormSubmit);
    taskListContainer.addEventListener('click', handleTaskListClick);
    toggleMenuBtn.addEventListener('click', handleToggleMenu);
    logoutIcon.addEventListener('click', handleLogout);

    // --- INICIALIZAÇÃO ---
    fetchAndRenderTasks();
});