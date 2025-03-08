// Zobrazení a skrytí modálního okna s nápovědou
const helpLink = document.getElementById('help-link');
const helpModal = document.getElementById('help-modal');
const closeHelpBtn = document.getElementById('close-help');

helpLink.addEventListener('click', e => {
  e.preventDefault();
  helpModal.style.display = 'flex';
});

closeHelpBtn.addEventListener('click', () => {
  helpModal.style.display = 'none';
});

// Zavření modálu po kliknutí mimo obsah
window.addEventListener('click', e => {
  if (e.target === helpModal) {
    helpModal.style.display = 'none';
  }
});
