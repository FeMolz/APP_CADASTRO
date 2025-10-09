// public/dashboard/dashStyle.js

document.addEventListener('DOMContentLoaded', () => {
    // --- SELEÇÃO DE ELEMENTOS PARA INTERAÇÃO VISUAL ---
    const createBtn = document.querySelector('.btn-create-container');
    const toggleMenuBtn = document.querySelector('.toggle-menu-container');
    const modal = document.getElementById('task-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // --- FUNÇÕES DE CONTROLE DA INTERFACE (UI) ---

    // Abre o modal
    const openModal = () => {
        if (modal) modal.classList.remove('hidden');
    };

    // Fecha o modal
    const closeModal = () => {
        if (modal) modal.classList.add('hidden');
    };

    // Alterna a sidebar entre recolhida e expandida
    const handleToggleMenu = () => {
        document.body.classList.toggle('sidebar-collapsed');
    };

    // --- EVENT LISTENERS PARA A INTERFACE ---

    // Abre o modal para CRIAR uma nova tarefa
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            // Dispara um evento customizado para que o dashboard.js saiba que deve preparar o formulário para CRIAÇÃO
            document.dispatchEvent(new CustomEvent('startCreateTask'));
            openModal();
        });
    }
    
    // Fecha o modal pelo botão 'x'
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    // Fecha o modal se clicar fora do conteúdo
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Recolhe/expande a sidebar
    if (toggleMenuBtn) {
        toggleMenuBtn.addEventListener('click', handleToggleMenu);
    }
    
    // Expõe as funções de UI globalmente para que o dashboard.js possa usá-las (ex: para abrir o modal no modo de edição)
    window.ui = { openModal, closeModal };
});