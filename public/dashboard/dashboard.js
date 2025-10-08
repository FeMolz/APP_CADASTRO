// dashboard.js (versão completa com edição)

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/login/'; return; }

    // --- SELEÇÃO DE ELEMENTOS ---
    const createBtn = document.querySelector('.btn-create-container');
    const toggleMenuBtn = document.querySelector('.toggle-menu-container');
    const logoutIcon = document.querySelector('.config-icons-container .bi-person-circle');
    
    const modal = document.getElementById('task-modal');
    const modalTitle = document.getElementById('modal-title');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const taskForm = document.getElementById('task-form');
    const taskListContainer = document.getElementById('task-list-container');
    const saveTaskBtn = document.getElementById('save-task-btn');

    // --- VARIÁVEL DE ESTADO ---
    // Guarda o ID da tarefa que está sendo editada. Se for null, estamos criando uma nova.
    let editingTaskId = null;

    // --- FUNÇÕES ---

    // Abre e fecha o modal
    const openModal = () => modal.classList.remove('hidden');
    const closeModal = () => {
        modal.classList.add('hidden');
        taskForm.reset();
        editingTaskId = null; // Limpa o estado de edição
        modalTitle.textContent = 'Nova Tarefa';
        saveTaskBtn.textContent = 'Salvar Tarefa';
    };

    // Busca e renderiza as tarefas (sem alterações)
    const fetchAndRenderTasks = async () => { /* ... seu código existente ... */ };
    
    // NOVO: Preenche o formulário para edição
    const populateFormForEdit = (taskCard) => {
        editingTaskId = taskCard.dataset.id;
        
        const title = taskCard.querySelector('h3').textContent;
        const description = taskCard.querySelector('p').textContent;

        document.getElementById('task-title').value = title;
        document.getElementById('task-description').value = description;
        // Limpamos o campo de imagem, pois não podemos pré-visualizá-lo por segurança
        document.getElementById('task-image').value = '';

        modalTitle.textContent = 'Editar Tarefa';
        saveTaskBtn.textContent = 'Atualizar Tarefa';

        openModal();
    };

    // Manipula o envio do formulário (CRIAR e EDITAR)
    const handleTaskFormSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(taskForm);
        
        const isEditing = editingTaskId !== null;
        const url = isEditing ? `/api/tasks/${editingTaskId}` : '/api/tasks';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            if (!res.ok) throw new Error('Falha ao salvar a tarefa');
            
            closeModal();
            await fetchAndRenderTasks();
        } catch (error) { console.error(error); }
    };
    
    // Manipula cliques na lista de tarefas (DELETAR e EDITAR)
    const handleTaskListClick = async (e) => {
        const deleteBtn = e.target.closest('.delete-btn');
        const editBtn = e.target.closest('.edit-btn');
        
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

        if (editBtn) {
            const taskCard = editBtn.closest('.task-card');

            populateFormForEdit(taskCard);
        }
    };

    // --- EVENT LISTENERS ---
    // Modificado: O botão "Create" agora prepara o modal para criação
    createBtn.addEventListener('click', () => {
        editingTaskId = null;
        taskForm.reset();
        modalTitle.textContent = 'Nova Tarefa';
        saveTaskBtn.textContent = 'Salvar Tarefa';
        openModal();
    });

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    taskForm.addEventListener('submit', handleTaskFormSubmit);
    taskListContainer.addEventListener('click', handleTaskListClick);
    
    toggleMenuBtn.addEventListener('click', () => document.body.classList.toggle('sidebar-collapsed'));
    logoutIcon.addEventListener('click', () => {
        if(confirm('Deseja sair?')){localStorage.removeItem('token'); window.location.href = '/login/';}
    });

    // --- INICIALIZAÇÃO ---
    // Reutilizando a função fetchAndRenderTasks que você já tem
    (async () => {
        try {
            const res = await fetch('/api/tasks', { headers: { 'Authorization': `Bearer ${token}` } });
            if (!res.ok) throw new Error('Falha ao carregar tarefas');
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
                taskCard.innerHTML = `<h3>${task.title}</h3><p>${task.description||''}</p>${task.imageUrl?`<img src="${task.imageUrl}" alt="${task.title}">`:''}<div class="task-card-actions"><button class="edit-btn" title="Editar"><i class="bi bi-pencil-square"></i></button><button class="delete-btn" title="Apagar"><i class="bi bi-trash3-fill"></i></button></div>`;
                taskListContainer.appendChild(taskCard);
            });
        } catch (error) { console.error(error); }
    })();
});