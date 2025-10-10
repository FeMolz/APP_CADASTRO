document.addEventListener('DOMContentLoaded', () => {

    const createBtn = document.querySelector('.btn-create-container');
    const toggleMenuBtn = document.querySelector('.toggle-menu-container');
    const modal = document.getElementById('task-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    const openModal = () => {
        if (modal) modal.classList.remove('hidden');
    };

    const closeModal = () => {
        if (modal) modal.classList.add('hidden');
    };

    const handleToggleMenu = () => {
        document.body.classList.toggle('sidebar-collapsed');
    };



   
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            
            document.dispatchEvent(new CustomEvent('startCreateTask'));
            openModal();
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
   
    window.ui = { openModal, closeModal };
});