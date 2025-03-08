// Elementy formuláře nastavení
const settingsForm = document.getElementById('settings-form');
const countingSystemSelect = document.getElementById('counting-system');
const strategyToggle = document.getElementById('strategy-toggle');
const betToggle = document.getElementById('bet-toggle');
const discreetModeToggle = document.getElementById('discreet-mode');
const darkModeToggle = document.getElementById('dark-mode');

// Nové nastavení pro bank a sázky
const bankInput = document.getElementById('bank');
const targetProfitInput = document.getElementById('target-profit');
const lossThresholdInput = document.getElementById('loss-threshold');
const baseBetInput = document.getElementById('base-bet');

// Načtení nastavení z localStorage
function loadSettings() {
  const settings = JSON.parse(localStorage.getItem('bjSettings')) || {};
  if (settings.countingSystem) {
    countingSystemSelect.value = settings.countingSystem;
    window.countingSystem = settings.countingSystem;
  }
  if (typeof settings.strategyEnabled !== 'undefined') {
    strategyToggle.checked = settings.strategyEnabled;
    window.strategyEnabled = settings.strategyEnabled;
  }
  if (typeof settings.betEnabled !== 'undefined') {
    betToggle.checked = settings.betEnabled;
    window.betEnabled = settings.betEnabled;
  }
  if (settings.discreetMode) {
    discreetModeToggle.checked = settings.discreetMode;
    document.body.classList.toggle('discreet', settings.discreetMode);
  }
  if (settings.darkMode) {
    darkModeToggle.checked = settings.darkMode;
    document.body.classList.toggle('dark', settings.darkMode);
  }
  if (settings.bank) {
    bankInput.value = settings.bank;
    window.initialBank = parseFloat(settings.bank);
  }
  if (settings.targetProfit) {
    targetProfitInput.value = settings.targetProfit;
    window.targetProfit = parseFloat(settings.targetProfit);
  }
  if (settings.lossThreshold) {
    lossThresholdInput.value = settings.lossThreshold;
    window.lossThreshold = parseFloat(settings.lossThreshold);
  }
  if (settings.baseBet) {
    baseBetInput.value = settings.baseBet;
    window.baseBet = parseFloat(settings.baseBet);
  }
}

// Uložení nastavení
settingsForm.addEventListener('submit', e => {
  e.preventDefault();
  const settings = {
    countingSystem: countingSystemSelect.value,
    strategyEnabled: strategyToggle.checked,
    betEnabled: betToggle.checked,
    discreetMode: discreetModeToggle.checked,
    darkMode: darkModeToggle.checked,
    bank: bankInput.value,
    targetProfit: targetProfitInput.value,
    lossThreshold: lossThresholdInput.value,
    baseBet: baseBetInput.value
  };
  localStorage.setItem('bjSettings', JSON.stringify(settings));
  // Aktualizace globálních proměnných
  window.countingSystem = settings.countingSystem;
  window.strategyEnabled = settings.strategyEnabled;
  window.betEnabled = settings.betEnabled;
  window.initialBank = parseFloat(settings.bank);
  window.targetProfit = parseFloat(settings.targetProfit);
  window.lossThreshold = parseFloat(settings.lossThreshold);
  window.baseBet = parseFloat(settings.baseBet);
  document.body.classList.toggle('discreet', settings.discreetMode);
  document.body.classList.toggle('dark', settings.darkMode);
  alert('Nastavení uloženo!');
  // Aktualizace zobrazení v hlavní části, pokud je načtena
  if (typeof updateDisplay === 'function') {
    updateDisplay();
  }
});

// Načtení nastavení při startu
loadSettings();
