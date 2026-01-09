// ========== Data Setup ==========

const defaultDecks = {
  programming: {
    name: "Programming Basics",
    cards: [
      {
        id: "prog-1",
        question: "What does HTML stand for?",
        answer: "HyperText Markup Language",
      },
      {
        id: "prog-2",
        question: "What does CSS control in a web page?",
        answer: "The visual style: layout, colors, fonts, spacing, etc.",
      },
      {
        id: "prog-3",
        question: "What is a variable in JavaScript?",
        answer:
          "A named container used to store a value that can change over time.",
      },
      {
        id: "prog-4",
        question: "Which keyword declares a block-scoped variable?",
        answer: "let and const",
      },
      {
        id: "prog-5",
        question: "What is the DOM?",
        answer:
          "The Document Object Model: a tree representation of the HTML page that JavaScript can interact with.",
      },
    ],
  },
  math: {
    name: "Math Fundamentals",
    cards: [
      {
        id: "math-1",
        question: "What is the Pythagorean theorem?",
        answer: "In a right triangle: a² + b² = c².",
      },
      {
        id: "math-2",
        question: "What is the derivative of x²?",
        answer: "2x",
      },
      {
        id: "math-3",
        question: "What is 7 × 8?",
        answer: "56",
      },
      {
        id: "math-4",
        question: "What is a prime number?",
        answer:
          "A number greater than 1 that has no positive divisors other than 1 and itself.",
      },
      {
        id: "math-5",
        question: "What is the value of π (pi) approximately?",
        answer: "About 3.14",
      },
    ],
  },
  ai: {
    name: "AI Concepts",
    cards: [
      {
        id: "ai-1",
        question: "What does AI stand for?",
        answer: "Artificial Intelligence",
      },
      {
        id: "ai-2",
        question: "What is supervised learning?",
        answer:
          "A machine learning task where models are trained using labeled examples.",
      },
      {
        id: "ai-3",
        question: "What is a neural network?",
        answer:
          "A model inspired by the brain, made of interconnected layers of simple units called neurons.",
      },
      {
        id: "ai-4",
        question: "What is overfitting?",
        answer:
          "When a model learns noise in training data and performs poorly on new data.",
      },
      {
        id: "ai-5",
        question: "Name a common activation function.",
        answer: "ReLU, sigmoid, or tanh.",
      },
    ],
  },
};

// Storage keys
const STORAGE_KEYS = {
  DECKS: "flashcards.decks",
  PROGRESS: "flashcards.progress",
  ACTIVE_DECK: "flashcards.activeDeck",
  TIMED_SETTINGS: "flashcards.timedSettings",
};

const THEME_STORAGE_KEY = "flashcards.theme";

// ========== State ==========

let decks = {};
let progress = {};
let activeDeckId = "programming";

// timed session state
let isTimedSessionActive = false;
let timedModeKind = "practice"; // "practice" | "challenge"
let timePerCardSeconds = 15;
let timerIntervalId = null;
let remainingSeconds = null;
let timedStats = null; // { deckId, cardIndices, pointer, reviewed, onTime, timeouts, timeoutIndices }
let reviewOnlyTimeoutIndices = null;

// DOM elements
const deckSelectEl = document.getElementById("deck-select");
const newDeckSelectEl = document.getElementById("new-deck-select");
const cardEl = document.getElementById("card");
const cardQuestionEl = document.getElementById("card-question");
const cardAnswerEl = document.getElementById("card-answer");
const flipBtn = document.getElementById("flip-btn");
const markHardBtn = document.getElementById("mark-hard-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const shuffleBtn = document.getElementById("shuffle-btn");
const resetProgressBtn = document.getElementById("reset-progress-btn");
const progressTextEl = document.getElementById("progress-text");
const hardCountEl = document.getElementById("hard-count");
const studiedCountEl = document.getElementById("studied-count");
const addCardForm = document.getElementById("add-card-form");
const themeDots = document.querySelectorAll(".theme-dot");

// timed mode DOM
const timedModeBtn = document.getElementById("timed-mode-btn");
const timedModal = document.getElementById("timed-modal");
const timedStartBtn = document.getElementById("timed-start-btn");
const timedCancelBtn = document.getElementById("timed-cancel-btn");
const presetButtons = document.querySelectorAll(".preset-btn");
const customSecondsInput = document.getElementById("custom-seconds");
const timerLabelEl = document.getElementById("timer-label");
const timerCountdownEl = document.getElementById("timer-countdown");
const timerStatusEl = document.getElementById("timer-status");

// summary modal
const summaryModal = document.getElementById("summary-modal");
const summaryTotalEl = document.getElementById("summary-total");
const summaryOnTimeEl = document.getElementById("summary-on-time");
const summaryTimeoutsEl = document.getElementById("summary-timeouts");
const summaryTimeoutListEl = document.getElementById("summary-timeout-list");
const summaryCloseBtn = document.getElementById("summary-close-btn");
const summaryReviewTimeoutsBtn = document.getElementById(
  "summary-review-timeouts-btn"
);

// ========== Local Storage Helpers ==========

function saveDecks() {
  localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(decks));
}

function saveProgress() {
  const serializableProgress = {};
  for (const [deckId, data] of Object.entries(progress)) {
    serializableProgress[deckId] = {
      currentIndex: data.currentIndex,
      studiedCardIds: Array.from(data.studiedCardIds),
      hardCardIds: Array.from(data.hardCardIds),
    };
  }
  localStorage.setItem(
    STORAGE_KEYS.PROGRESS,
    JSON.stringify(serializableProgress)
  );
}

function saveActiveDeck() {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_DECK, activeDeckId);
}

function loadFromLocalStorage() {
  const storedDecks = localStorage.getItem(STORAGE_KEYS.DECKS);
  const storedProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  const storedActiveDeck = localStorage.getItem(STORAGE_KEYS.ACTIVE_DECK);

  if (storedDecks) {
    try {
      decks = JSON.parse(storedDecks);
    } catch (e) {
      decks = structuredClone(defaultDecks);
    }
  } else {
    decks = structuredClone(defaultDecks);
  }

  if (storedProgress) {
    try {
      const rawProgress = JSON.parse(storedProgress);
      progress = {};
      for (const [deckId, data] of Object.entries(rawProgress)) {
        progress[deckId] = {
          currentIndex: data.currentIndex ?? 0,
          studiedCardIds: new Set(data.studiedCardIds || []),
          hardCardIds: new Set(data.hardCardIds || []),
        };
      }
    } catch (e) {
      progress = {};
    }
  } else {
    progress = {};
  }

  if (storedActiveDeck && decks[storedActiveDeck]) {
    activeDeckId = storedActiveDeck;
  } else {
    activeDeckId = Object.keys(decks)[0] || "programming";
  }
}

// timed settings per deck
function loadTimedSettings() {
  const raw = localStorage.getItem(STORAGE_KEYS.TIMED_SETTINGS);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveTimedSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.TIMED_SETTINGS, JSON.stringify(settings));
}

// ========== Theme Helpers ==========

function setTheme(themeName) {
  const body = document.body;
  body.classList.remove(
    "theme-purple",
    "theme-green",
    "theme-blue",
    "theme-red",
    "theme-grey"
  );

  const validThemes = ["purple", "green", "blue", "red", "grey"];
  const finalTheme = validThemes.includes(themeName) ? themeName : "purple";

  body.classList.add(`theme-${finalTheme}`);
  localStorage.setItem(THEME_STORAGE_KEY, finalTheme);
}

// ========== Utility Functions ==========

function getOrCreateDeckProgress(deckId) {
  if (!progress[deckId]) {
    progress[deckId] = {
      currentIndex: 0,
      studiedCardIds: new Set(),
      hardCardIds: new Set(),
    };
  }
  return progress[deckId];
}

function shuffleCurrentDeck() {
  const deck = decks[activeDeckId];
  if (!deck || deck.cards.length < 2) return;

  for (let i = deck.cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck.cards[i], deck.cards[j]] = [deck.cards[j], deck.cards[i]];
  }

  const deckProg = getOrCreateDeckProgress(activeDeckId);
  deckProg.currentIndex = 0;
  saveDecks();
  saveProgress();
}

// ========== Timed Mode Core ==========

function openTimedModal() {
  const settings = loadTimedSettings();
  const deckSettings = settings[activeDeckId];
  if (deckSettings) {
    customSecondsInput.value = deckSettings.seconds;
    const radios = document.querySelectorAll('input[name="timed-mode-kind"]');
    radios.forEach((r) => {
      r.checked = r.value === deckSettings.mode;
    });
  } else {
    customSecondsInput.value = "";
    const radios = document.querySelectorAll('input[name="timed-mode-kind"]');
    radios.forEach((r) => {
      r.checked = r.value === "practice";
    });
  }

  timerStatusEl.textContent = "";
  timerCountdownEl.textContent = "";
  timerLabelEl.textContent = "Timer: off";

  timedModal.classList.add("is-open");
  timedModal.setAttribute("aria-hidden", "false");
}

function closeTimedModal() {
  timedModal.classList.remove("is-open");
  timedModal.setAttribute("aria-hidden", "true");
}

presetButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const secs = btn.getAttribute("data-seconds");
    customSecondsInput.value = secs;
  });
});

function startTimedSessionFromModal() {
  const secs = parseInt(customSecondsInput.value, 10);
  if (Number.isNaN(secs) || secs < 3) {
    alert("Please choose at least 3 seconds per card.");
    return;
  }

  const radios = document.querySelectorAll('input[name="timed-mode-kind"]');
  let mode = "practice";
  radios.forEach((r) => {
    if (r.checked) mode = r.value;
  });

  const settings = loadTimedSettings();
  settings[activeDeckId] = { seconds: secs, mode };
  saveTimedSettings(settings);

  timePerCardSeconds = secs;
  timedModeKind = mode;
  reviewOnlyTimeoutIndices = null; // normal deck order

  // requirement: reset progress automatically when timed session starts
  progress[activeDeckId] = {
    currentIndex: 0,
    studiedCardIds: new Set(),
    hardCardIds: new Set(),
  };
  saveProgress();

  startTimedSession();
  closeTimedModal();
}

function startTimedSession() {
  const deck = decks[activeDeckId];
  if (!deck || deck.cards.length === 0) {
    alert("No cards in this deck.");
    return;
  }

  const totalCards = deck.cards.length;
  let cardIndices;

  if (reviewOnlyTimeoutIndices && reviewOnlyTimeoutIndices.length > 0) {
    cardIndices = [...reviewOnlyTimeoutIndices];
  } else {
    cardIndices = Array.from({ length: totalCards }, (_, i) => i);
  }

  timedStats = {
    deckId: activeDeckId,
    cardIndices,
    pointer: 0,
    reviewed: 0,
    onTime: 0,
    timeouts: 0,
    timeoutIndices: [],
  };

  isTimedSessionActive = true;
  timerLabelEl.textContent =
    `Timer: ${timePerCardSeconds}s · ` +
    (timedModeKind === "practice" ? "Practice" : "Challenge");
  timerStatusEl.textContent = "";

  moveToTimedCard(0);
}

function endTimedSession(showSummary = true) {
  isTimedSessionActive = false;
  clearTimerCountdown();
  timerLabelEl.textContent = "Timer: off";
  timerCountdownEl.textContent = "";
  timerStatusEl.textContent = "";

  if (showSummary && timedStats) {
    showSummaryModal();
  }
}

function moveToTimedCard(pointer) {
  const deck = decks[activeDeckId];
  if (!deck || !timedStats) return;

  if (pointer < 0 || pointer >= timedStats.cardIndices.length) {
    endTimedSession(true);
    return;
  }

  timedStats.pointer = pointer;
  const indexInDeck = timedStats.cardIndices[pointer];

  const deckProg = getOrCreateDeckProgress(activeDeckId);
  deckProg.currentIndex = indexInDeck;

  renderCurrentCard();
  startCardCountdown();
}

function startCardCountdown() {
  clearTimerCountdown();
  remainingSeconds = timePerCardSeconds;
  timerCountdownEl.textContent = remainingSeconds + "s";
  timerStatusEl.textContent = "";
  timerIntervalId = setInterval(tickCountdown, 1000);
}

function clearTimerCountdown() {
  if (timerIntervalId !== null) {
    clearInterval(timerIntervalId);
    timerIntervalId = null;
  }
}

function tickCountdown() {
  if (!isTimedSessionActive) {
    clearTimerCountdown();
    return;
  }

  remainingSeconds -= 1;
  if (remainingSeconds <= 0) {
    timerCountdownEl.textContent = "0s";
    clearTimerCountdown();
    handleCardTimeout();
  } else {
    timerCountdownEl.textContent = remainingSeconds + "s";
  }
}

function markCurrentAsAnsweredOnTime() {
  if (!isTimedSessionActive || !timedStats) return;
  timedStats.reviewed += 1;
  timedStats.onTime += 1;
}

// called only when timer hits zero
function handleCardTimeout() {
  if (!isTimedSessionActive || !timedStats) return;

  const deck = decks[activeDeckId];
  const deckProg = getOrCreateDeckProgress(activeDeckId);
  const currentIndex = deckProg.currentIndex;
  const currentCard = deck.cards[currentIndex];

  timedStats.reviewed += 1;
  timedStats.timeouts += 1;
  timedStats.timeoutIndices.push(currentIndex);

  if (timedModeKind === "practice") {
    timerStatusEl.textContent = "Suggested time exceeded.";
    // user will manually go next; timer restarts on next
  } else {
    timerStatusEl.textContent = "Time out! Marked as hard.";
    deckProg.hardCardIds.add(currentCard.id);
    renderCurrentCard(); // update hard count

    const nextPointer = timedStats.pointer + 1;
    moveToTimedCard(nextPointer);
  }
}

// summary

function openSummaryModal() {
  summaryModal.classList.add("is-open");
  summaryModal.setAttribute("aria-hidden", "false");
}

function closeSummaryModal() {
  summaryModal.classList.remove("is-open");
  summaryModal.setAttribute("aria-hidden", "true");
}

function showSummaryModal() {
  const deck = decks[activeDeckId];
  if (!deck || !timedStats) return;

  summaryTotalEl.textContent = timedStats.reviewed;
  summaryOnTimeEl.textContent = timedStats.onTime;
  summaryTimeoutsEl.textContent = timedStats.timeouts;

  summaryTimeoutListEl.innerHTML = "";
  timedStats.timeoutIndices.forEach((idx, i) => {
    const card = deck.cards[idx];
    if (!card) return;
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${card.question}`;
    summaryTimeoutListEl.appendChild(li);
  });

  openSummaryModal();
}

// review only timed-out cards
function startReviewOnlyTimeoutCards() {
  const deck = decks[activeDeckId];
  if (!deck || !timedStats || timedStats.timeoutIndices.length === 0) {
    alert("No timed-out cards to review.");
    return;
  }

  reviewOnlyTimeoutIndices = [...timedStats.timeoutIndices];
  closeSummaryModal();
  startTimedSession();
}

// ========== Rendering Functions ==========

function renderDeckOptions() {
  const deckIds = Object.keys(decks);

  deckSelectEl.innerHTML = "";
  newDeckSelectEl.innerHTML = "";

  deckIds.forEach((id) => {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = decks[id].name;
    deckSelectEl.appendChild(opt);

    const opt2 = opt.cloneNode(true);
    newDeckSelectEl.appendChild(opt2);
  });

  deckSelectEl.value = activeDeckId;
  newDeckSelectEl.value = activeDeckId;
}

function renderCurrentCard() {
  const deck = decks[activeDeckId];
  if (!deck || deck.cards.length === 0) {
    cardQuestionEl.textContent = "No cards in this deck yet.";
    cardAnswerEl.textContent = "Use the form below to add cards.";
    progressTextEl.textContent = "Card 0 of 0";
    hardCountEl.textContent = "Hard cards: 0";
    studiedCountEl.textContent = "Studied cards: 0";
    markHardBtn.disabled = true;
    flipBtn.disabled = true;
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    return;
  }

  const deckProg = getOrCreateDeckProgress(activeDeckId);

  if (deckProg.currentIndex < 0) deckProg.currentIndex = 0;
  if (deckProg.currentIndex >= deck.cards.length) {
    deckProg.currentIndex = deck.cards.length - 1;
  }

  const card = deck.cards[deckProg.currentIndex];

  cardQuestionEl.textContent = card.question;
  cardAnswerEl.textContent = card.answer;

  cardEl.classList.remove("is-flipped");

  const cardNumber = deckProg.currentIndex + 1;
  const totalCards = deck.cards.length;
  progressTextEl.textContent = `Card ${cardNumber} of ${totalCards}`;

  deckProg.studiedCardIds.add(card.id);
  const hardCount = deckProg.hardCardIds.size;
  const studiedCount = deckProg.studiedCardIds.size;

  hardCountEl.textContent = `Hard cards: ${hardCount}`;
  studiedCountEl.textContent = `Studied cards: ${studiedCount}`;

  if (deckProg.hardCardIds.has(card.id)) {
    markHardBtn.classList.add("is-active");
    markHardBtn.textContent = "Hard ✓";
  } else {
    markHardBtn.classList.remove("is-active");
    markHardBtn.textContent = "Mark Hard";
  }

  markHardBtn.disabled = false;
  flipBtn.disabled = false;
  prevBtn.disabled = totalCards <= 1;
  nextBtn.disabled = totalCards <= 1;

  saveProgress();
}

// ========== Event Handlers ==========

function handleFlipCard() {
  cardEl.classList.toggle("is-flipped");
}

function handlePrevCard() {
  const deck = decks[activeDeckId];
  if (!deck || deck.cards.length === 0) return;
  const deckProg = getOrCreateDeckProgress(activeDeckId);

  deckProg.currentIndex =
    (deckProg.currentIndex - 1 + deck.cards.length) % deck.cards.length;
  renderCurrentCard();

  if (isTimedSessionActive && timedStats) {
    // sync pointer by index
    const idx = deckProg.currentIndex;
    const pointer = timedStats.cardIndices.indexOf(idx);
    if (pointer !== -1) {
      timedStats.pointer = pointer;
      startCardCountdown();
    }
  }
}

function handleNextCard() {
  const deck = decks[activeDeckId];
  if (!deck || deck.cards.length === 0) return;
  const deckProg = getOrCreateDeckProgress(activeDeckId);

  if (isTimedSessionActive && timedStats) {
    // user answered within time -> mark as onTime
    markCurrentAsAnsweredOnTime();
    const nextPointer = timedStats.pointer + 1;
    moveToTimedCard(nextPointer);
    return;
  }

  deckProg.currentIndex = (deckProg.currentIndex + 1) % deck.cards.length;
  renderCurrentCard();
}

function handleMarkHard() {
  const deck = decks[activeDeckId];
  if (!deck || deck.cards.length === 0) return;
  const deckProg = getOrCreateDeckProgress(activeDeckId);
  const card = deck.cards[deckProg.currentIndex];

  if (deckProg.hardCardIds.has(card.id)) {
    deckProg.hardCardIds.delete(card.id);
  } else {
    deckProg.hardCardIds.add(card.id);
  }

  renderCurrentCard();
}

function handleDeckChange() {
  activeDeckId = deckSelectEl.value;
  saveActiveDeck();
  renderCurrentCard();
  newDeckSelectEl.value = activeDeckId;
}

function handleShuffle() {
  shuffleCurrentDeck();
  renderCurrentCard();
}

function handleResetProgress() {
  if (!confirm("Reset studied and hard cards for this deck?")) return;
  progress[activeDeckId] = {
    currentIndex: 0,
    studiedCardIds: new Set(),
    hardCardIds: new Set(),
  };
  saveProgress();
  renderCurrentCard();
}

function handleAddCardSubmit(event) {
  event.preventDefault();

  const deckId = newDeckSelectEl.value;
  const question = document.getElementById("new-question").value.trim();
  const answer = document.getElementById("new-answer").value.trim();

  if (!question || !answer) {
    alert("Please enter both a question and an answer.");
    return;
  }

  const deck = decks[deckId];
  if (!deck) return;

  const newId = `${deckId}-${Date.now()}-${deck.cards.length + 1}`;

  deck.cards.push({
    id: newId,
    question,
    answer,
  });

  saveDecks();

  addCardForm.reset();
  newDeckSelectEl.value = deckId;

  if (deckId === activeDeckId) {
    renderCurrentCard();
  }

  alert("New flashcard added!");
}

function handleKeyDown(event) {
  const tag = event.target.tagName.toLowerCase();
  if (tag === "textarea" || tag === "input" || tag === "select") return;

  if (event.code === "Space" || event.code === "Enter") {
    event.preventDefault();
    handleFlipCard();
  } else if (event.key === "ArrowRight") {
    handleNextCard();
  } else if (event.key === "ArrowLeft") {
    handlePrevCard();
  }
}

// ========== Initialization ==========

function init() {
  loadFromLocalStorage();
  renderDeckOptions();
  renderCurrentCard();

  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || "purple";
  setTheme(savedTheme);

  themeDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const theme = dot.getAttribute("data-theme");
      setTheme(theme);
    });
  });

  flipBtn.addEventListener("click", handleFlipCard);
  cardEl.addEventListener("click", handleFlipCard);
  prevBtn.addEventListener("click", handlePrevCard);
  nextBtn.addEventListener("click", handleNextCard);
  markHardBtn.addEventListener("click", handleMarkHard);
  deckSelectEl.addEventListener("change", handleDeckChange);
  shuffleBtn.addEventListener("click", handleShuffle);
  resetProgressBtn.addEventListener("click", handleResetProgress);
  addCardForm.addEventListener("submit", handleAddCardSubmit);
  window.addEventListener("keydown", handleKeyDown);

  // timed mode
  timedModeBtn.addEventListener("click", openTimedModal);
  timedCancelBtn.addEventListener("click", () => {
    closeTimedModal();
  });
  timedStartBtn.addEventListener("click", startTimedSessionFromModal);

  // close modals by clicking backdrop
  [timedModal, summaryModal].forEach((modalEl) => {
    modalEl.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-backdrop")) {
        modalEl.classList.remove("is-open");
        modalEl.setAttribute("aria-hidden", "true");
      }
    });
  });

  summaryCloseBtn.addEventListener("click", () => {
    closeSummaryModal();
  });

  summaryReviewTimeoutsBtn.addEventListener("click", () => {
    startReviewOnlyTimeoutCards();
  });
}

document.addEventListener("DOMContentLoaded", init);
