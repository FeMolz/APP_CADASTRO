document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/login/'; return; }

    const logoutBtn = document.querySelector('.config-icons-container .bi-person-circle');
    const sidebarItems = document.querySelectorAll('.sidebar .itens-sidebar');
    const taskForm = document.getElementById('task-form');
    const taskListContainer = document.getElementById('task-list-container');
    const modalTitle = document.getElementById('modal-title');
    const saveTaskBtn = document.getElementById('save-task-btn');

    let editingTaskId = null;

    const fetchAndRenderTasks = async () => {
        try {
            const res = await fetch('/api/tasks', { headers: { 'Authorization': `Bearer ${token}` } });
            if (!res.ok) {
                if (res.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login/';
                }
                throw new Error('Falha ao carregar tarefas');
            }
            const tasks = await res.json();
            taskListContainer.innerHTML = '';
            if (tasks.length === 0) {
                taskListContainer.innerHTML = '<p style="text-align:center; padding: 40px; color: #888;">Nenhuma tarefa no Inbox. Clique em "Create" para começar!</p>';
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
        const isEditing = editingTaskId !== null;
        const url = isEditing ? `/api/tasks/${editingTaskId}` : '/api/tasks';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}` }, body: formData });
            if (!res.ok) throw new Error(`Falha ao ${isEditing ? 'atualizar' : 'salvar'} a tarefa`);
            
            window.ui.closeModal();
            taskForm.reset();
            await fetchAndRenderTasks();
        } catch (error) { console.error(error); }
    };

    const handleTaskListClick = async (e) => {
        const editBtn = e.target.closest('.edit-btn');
        const deleteBtn = e.target.closest('.delete-btn');

        if (editBtn) {
            const taskCard = editBtn.closest('.task-card');
            editingTaskId = taskCard.dataset.id;
            
            // Prepara o formulário para edição
            taskForm.reset();
            document.getElementById('task-title').value = taskCard.querySelector('h3').textContent;
            document.getElementById('task-description').value = taskCard.querySelector('p').textContent;
            modalTitle.textContent = 'Editar Tarefa';
            saveTaskBtn.textContent = 'Atualizar Tarefa';

            window.ui.openModal(); // Usa a função do outro script para abrir o modal
        }

        if (deleteBtn) {
            const taskCard = deleteBtn.closest('.task-card');
            const taskId = taskCard.dataset.id;
            if (confirm('Tem certeza que deseja apagar esta tarefa?')) {
                try {
                    const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                    if (!res.ok) throw new Error('Falha ao deletar a tarefa');
                    await fetchAndRenderTasks();
                } catch (error) { console.error(error); }
            }
        }
    };
    
    const renderPlaceholder = (title) => {
        taskListContainer.innerHTML = `<p style="text-align:center; padding: 40px; color: #888;">Funcionalidade '${title}' em construção...</p>`;
    };
    
    const handleLogout = () => {
        if (confirm('Tem certeza que deseja sair?')) {
            localStorage.removeItem('token');
            window.location.href = '/login/';
        }
    };

    // --- EVENT LISTENERS PARA LÓGICA DE DADOS ---
    if (taskForm) taskForm.addEventListener('submit', handleTaskFormSubmit);
    if (taskListContainer) taskListContainer.addEventListener('click', handleTaskListClick);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    // Navegação da Sidebar
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const filterText = item.querySelector('span').textContent;
            
            switch (filterText.toLowerCase()) {
                case 'inbox':
                    fetchAndRenderTasks();
                    break;
                
                default:
                    renderPlaceholder(filterText);
            }
        });
    });

    document.addEventListener('startCreateTask', () => {
        editingTaskId = null;
    });

    fetchAndRenderTasks();
});