// Modal de usuários
const modal = document.getElementById('modal');
const openModal = document.getElementById('openModal');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');

if (openModal) {
  openModal.addEventListener('click', () => {
    modal.style.display = 'block';
  });
}

if (closeModal) {
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

if (cancelBtn) {
  cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});


