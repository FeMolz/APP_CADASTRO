// Espera o documento HTML ser completamente carregado para então executar o código
document.addEventListener('DOMContentLoaded', function() {

    // 1. Seleciona todos os elementos que são itens clicáveis da sidebar
    const sidebarItems = document.querySelectorAll('.itens-sidebar');
    
    // (Bônus) Seleciona o título principal que vamos atualizar
    const mainTitle = document.getElementById('main-title');

    // 2. Para cada item encontrado, adiciona um "ouvinte" de evento de clique
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            
            // 3. Quando um item é clicado, primeiro remove a classe 'active' de TODOS os itens
            sidebarItems.forEach(innerItem => {
                innerItem.classList.remove('active');
            });

            // 4. Depois, adiciona a classe 'active' APENAS no item que foi clicado
            item.classList.add('active');

            // 5. (Bônus) Atualiza o título da página com o texto do item clicado
            // Procura pelo `span` dentro do item clicado e pega o texto dele
            const newTitle = item.querySelector('span').textContent;
            mainTitle.textContent = newTitle;
            
        });
    });

});