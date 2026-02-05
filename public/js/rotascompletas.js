// Rotas Completas - JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Event delegation para accordions
  document.querySelectorAll('.accordion-header[data-toggle="accordion"]').forEach(function(header) {
    header.addEventListener('click', function() {
      this.classList.toggle('active');
      const content = this.nextElementSibling;
      content.classList.toggle('open');
    });
  });
});
