// Globální proměnné a nastavení
let runningCount = 0;
let deckCount = 1;
let cardHistory = [];
let currentProfit = 0; // kumulativní zisk
let initialBank = 1000;
let targetProfit = 200;
let lossThreshold = 200;
let baseBet = 10;
let countingSystem = 'hi-lo';
let strategyEnabled = true;
let betEnabled = true;

// Mapování hodnot pro různé systémy
const cardValuesMap = {
  'hi-lo': {
    '2': 1, '3': 1, '4': 1, '5': 1, '6': 1,
    '7': 0, '8': 0, '9': 0,
    '10': -1, 'J': -1, 'Q': -1, 'K': -1, 'A': -1
  },
  'ko': {
    '2': 1, '3': 1, '4': 1, '5': 1, '6': 1,
    '7': 0, '8': 0, '9': 0,
    '10': -1, 'J': -1, 'Q': -1, 'K': -1, 'A': 0
  },
  'hi-opt': {
    '2': 1, '3': 1, '4': 0, '5': 0, '6': 1,
    '7': 0, '8': 0, '9': 0,
    '10': -1, 'J': -1, 'Q': -1, 'K': -1, 'A': 0
  }
};

// DOM elementy
const runningCountEl = document.getElementById('running-count');
const trueCountEl = document.getElementById('true-count');
const betRecommendationEl = document.getElementById('bet-recommendation');
const deckCountEl = document.getElementById('deck-count');
const resetBtn = document.getElementById('reset-btn');
const decksIncreaseBtn = document.getElementById('decks-increase');
const decksDecreaseBtn = document.getElementById('decks-decrease');
const cardButtons = document.querySelectorAll('.card-input .cards button');
const historyTableBody = document.querySelector('#history-table tbody');
const clearHistoryBtn = document.getElementById('clear-history');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

// Bank & Sázení elementy
const initialBankEl = document.getElementById('initial-bank');
const currentBankEl = document.getElementById('current-bank');
const currentProfitEl = document.getElementById('current-profit');
const recommendedBetEl = document.getElementById('recommended-bet');

// Výsledek kola tlačítka
const winBtn = document.getElementById('win-btn');
const lossBtn = document.getElementById('loss-btn');

// Strategie
const playerScoreInput = document.getElementById('player-score');
const dealerCardInput = document.getElementById('dealer-card');
const strategyBtn = document.getElementById('strategy-btn');
const strategyAdviceEl = document.getElementById('strategy-advice');

// Přepínání sekcí
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    // Speciální zpracování pro nápovědu – ta se zobrazuje jako modální okno (handled v help.js)
    if(link.id === 'help-link'){
      return;
    }
    navLinks.forEach(lnk => lnk.classList.remove('active'));
    link.classList.add('active');
    const target = link.getAttribute('data-section');
    sections.forEach(sec => {
      sec.classList.toggle('active', sec.id === target);
    });
  });
});

// Aktualizace zobrazení
function updateDisplay() {
  runningCountEl.textContent = runningCount;
  const trueCount = deckCount > 0 ? (runningCount / deckCount).toFixed(1) : 0;
  trueCountEl.textContent = trueCount;

  // Výpočet doporučené sázky
  let betRec = '-';
  if (betEnabled) {
    const multiplier = trueCount > 0 ? parseFloat(trueCount) + 1 : 1;
    let recBet = Math.round(baseBet * multiplier);
    recBet = Math.min(recBet, getCurrentBank());
    betRec = `${recBet} (x${multiplier.toFixed(1)})`;
  }
  betRecommendationEl.textContent = betRec;

  // Barevné indikátory pro true count
  if (trueCount <= 0) {
    trueCountEl.style.color = 'red';
  } else if (trueCount <= 2) {
    trueCountEl.style.color = 'orange';
  } else {
    trueCountEl.style.color = 'green';
  }

  // Aktualizace bank informací
  initialBankEl.textContent = initialBank;
  currentBankEl.textContent = getCurrentBank();
  currentProfitEl.textContent = currentProfit;
  recommendedBetEl.textContent = betRec;
}

function getCurrentBank() {
  return initialBank + currentProfit;
}

// Zpracování tlačítek pro karty
cardButtons.forEach(button => {
  button.addEventListener('click', () => {
    const card = button.getAttribute('data-value');
    const value = cardValuesMap[countingSystem][card] || 0;
    runningCount += value;
    updateDisplay();
  });
});

// Změna počtu balíčků
decksIncreaseBtn.addEventListener('click', () => {
  if (deckCount < 8) {
    deckCount++;
    deckCountEl.textContent = deckCount;
    updateDisplay();
  }
});

decksDecreaseBtn.addEventListener('click', () => {
  if (deckCount > 1) {
    deckCount--;
    deckCountEl.textContent = deckCount;
    updateDisplay();
  }
});

// Reset (zamíchání karet) a uložení historie
resetBtn.addEventListener('click', () => {
  const timestamp = new Date().toLocaleTimeString();
  const trueCount = deckCount > 0 ? (runningCount / deckCount).toFixed(1) : 0;
  cardHistory.push({ time: timestamp, running: runningCount, true: trueCount });
  saveHistory();
  updateHistoryTable();
  runningCount = 0;
  updateDisplay();
});

// Ukládání a načítání historie
function saveHistory() {
  localStorage.setItem('bjHistory', JSON.stringify(cardHistory));
}

function loadHistory() {
  const data = localStorage.getItem('bjHistory');
  cardHistory = data ? JSON.parse(data) : [];
}

function updateHistoryTable() {
  historyTableBody.innerHTML = '';
  cardHistory.slice().reverse().forEach(record => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${record.time}</td><td>${record.running}</td><td>${record.true}</td>`;
    historyTableBody.appendChild(row);
  });
}

// Vymazání historie
clearHistoryBtn.addEventListener('click', () => {
  cardHistory = [];
  saveHistory();
  updateHistoryTable();
});

// Zpracování výsledku kola
winBtn.addEventListener('click', () => {
  let amount = prompt("Zadej výši výhry:");
  amount = parseFloat(amount);
  if (!isNaN(amount)) {
    currentProfit += amount;
    updateDisplay();
    checkProfit();
  }
});

lossBtn.addEventListener('click', () => {
  let amount = prompt("Zadej výši prohry:");
  amount = parseFloat(amount);
  if (!isNaN(amount)) {
    currentProfit -= amount;
    updateDisplay();
    checkProfit();
  }
});

// Kontrola dosažení cíle či ztrátového limitu
function checkProfit() {
  if (currentProfit >= targetProfit) {
    alert("Gratuluji! Dosáhl jsi očekávané výhry.");
  }
  if (currentProfit <= -lossThreshold) {
    alert("Pozor, jsi ve ztrátě!");
  }
}

// Jednoduchá strategie – doporučení
function getStrategyAdvice(playerScore, dealerCard) {
  let advice = '';
  if (playerScore <= 11) {
    advice = "Ber další kartu (Hit)";
  } else if (playerScore >= 17) {
    advice = "Stůj (Stand)";
  } else {
    advice = dealerCard >= 7 ? "Ber další kartu (Hit)" : "Stůj (Stand)";
  }
  return advice;
}

strategyBtn.addEventListener('click', () => {
  const playerScore = parseInt(playerScoreInput.value);
  const dealerCard = parseInt(dealerCardInput.value);
  if (isNaN(playerScore) || isNaN(dealerCard)) {
    alert("Zadej prosím obě hodnoty správně.");
    return;
  }
  const advice = getStrategyAdvice(playerScore, dealerCard);
  strategyAdviceEl.textContent = advice;
});

// Registrace Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(reg => console.log('Service Worker registrován:', reg))
    .catch(err => console.error('Chyba registrace SW:', err));
}

// Inicializace: načtení historie a aktualizace zobrazení
loadHistory();
updateHistoryTable();
updateDisplay();
