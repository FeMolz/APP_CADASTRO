document.addEventListener('DOMContentLoaded', () => {
    // 1. VERIFICAÇÃO DE AUTENTICAÇÃO
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login/';
        return;
    }

    // 2. SELEÇÃO DE TODOS OS ELEMENTOS DA PÁGINA
    const createBtn = document.querySelector('.btn-create-container');
    const toggleMenuBtn = document.querySelector('.toggle-menu-container');
    const logoutBtn = document.querySelector('.config-icons-container .bi-person-circle');
    const sidebarItems = document.querySelectorAll('.sidebar .itens-sidebar');
    const taskListContainer = document.getElementById('task-list-container');
    
    const formModal = document.getElementById('task-modal');
    const taskForm = document.getElementById('task-form');
    const modalTitle = document.getElementById('modal-title');
    const saveTaskBtn = document.getElementById('save-task-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');

    const viewModal = document.getElementById('view-task-modal');
    const closeViewModalBtn = document.getElementById('close-view-modal-btn');
    const viewTaskTitle = document.getElementById('view-task-title');
    const viewTaskDescription = document.getElementById('view-task-description');
    const viewTaskImageContainer = document.getElementById('view-task-image-container');

    // 3. VARIÁVEIS DE ESTADO
    let editingTaskId = null;
    let allTasks = [];

    // 4. FUNÇÕES
    const openFormModal = () => formModal.classList.remove('hidden');
    const closeFormModal = () => {
        formModal.classList.add('hidden');
        taskForm.reset();
        editingTaskId = null;
    };

    const openViewModal = (task) => {
        if (!task) return;
        viewTaskTitle.textContent = task.title;
        viewTaskDescription.textContent = task.description || 'Nenhuma descrição fornecida.';
        viewTaskImageContainer.innerHTML = '';
        if (task.imageUrl) {
            const img = document.createElement('img');
            img.src = task.imageUrl;
            img.alt = task.title;
            viewTaskImageContainer.appendChild(img);
        }
        viewModal.classList.remove('hidden');
    };
    const closeViewModal = () => viewModal.classList.add('hidden');

    const fetchAndRenderTasks = async () => {
        try {
            const res = await fetch('/api/tasks', { headers: { 'Authorization': `Bearer ${token}` } });
            if (!res.ok) throw new Error('Falha ao carregar tarefas');
            allTasks = await res.json();
            taskListContainer.innerHTML = '';
            if (allTasks.length === 0) {
                taskListContainer.innerHTML = '<p>Nenhuma tarefa no Inbox. Clique em "Create" para começar!</p>';
                return;
            }
            allTasks.forEach(task => {
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
            closeFormModal();
            await fetchAndRenderTasks();
        } catch (error) { console.error(error); }
    };

    const handleTaskListClick = (e) => {
        const taskCard = e.target.closest('.task-card');
        if (!taskCard) return;
        const taskId = taskCard.dataset.id;
        const editBtn = e.target.closest('.edit-btn');
        const deleteBtn = e.target.closest('.delete-btn');
        if (editBtn) {
            editingTaskId = taskId;
            const taskToEdit = allTasks.find(task => task._id === taskId);
            if (!taskToEdit) return;
            taskForm.reset();
            document.getElementById('task-title').value = taskToEdit.title;
            document.getElementById('task-description').value = taskToEdit.description || '';
            modalTitle.textContent = 'Editar Tarefa';
            saveTaskBtn.textContent = 'Atualizar Tarefa';
            openFormModal();
        } else if (deleteBtn) {
            if (confirm('Tem certeza que deseja apagar esta tarefa?')) {
                fetch(`/api/tasks/${taskId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
                    .then(res => {
                        if (!res.ok) throw new Error('Falha ao deletar a tarefa');
                        fetchAndRenderTasks();
                    })
                    .catch(error => console.error(error));
            }
        } else {
            const taskToView = allTasks.find(task => task._id === taskId);
            openViewModal(taskToView);
        }
    };
    
    const renderPlaceholder = (title) => {
        taskListContainer.innerHTML = `<p>Funcionalidade '${title}' em construção...</p>`;
    };
    
    // 5. EVENT LISTENERS
    createBtn.addEventListener('click', () => {
        editingTaskId = null;
        taskForm.reset();
        modalTitle.textContent = 'Nova Tarefa';
        saveTaskBtn.textContent = 'Salvar Tarefa';
        openFormModal();
    });

    closeModalBtn.addEventListener('click', closeFormModal);
    formModal.addEventListener('click', (e) => { if (e.target === formModal) closeFormModal(); });
    closeViewModalBtn.addEventListener('click', closeViewModal);
    viewModal.addEventListener('click', (e) => { if (e.target === viewModal) closeViewModal(); });
    
    taskForm.addEventListener('submit', handleTaskFormSubmit);
    taskListContainer.addEventListener('click', handleTaskListClick);

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

    toggleMenuBtn.addEventListener('click', () => document.body.classList.toggle('sidebar-collapsed'));
    logoutBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja sair?')) {
            localStorage.removeItem('token');
            window.location.href = '/login/';
        }
    });

    // 6. INICIALIZAÇÃO
    fetchAndRenderTasks();
});