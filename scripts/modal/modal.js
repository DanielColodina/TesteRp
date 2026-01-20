console.log('Modal carregado');


document.addEventListener('DOMContentLoaded', () => { //Evita erro de elemento não carregado
    const openBtn = document.getElementById('openModal');
    const modal = document.getElementById('modal');
    const closeBtn = document.getElementById('closeModal');

    /*CASO O MODAL NÃO EXISTA EM ALGUMA PAGINA*/ 
    if(!openBtn || !modal || !closeBtn) return;

    openBtn.addEventListener('click', () => {
        modal.style.display ='flex';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal ) {
            modal.style.display = 'none';
        }
    });
});