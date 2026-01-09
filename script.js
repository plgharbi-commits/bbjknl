document.addEventListener("DOMContentLoaded", () => {
  // ---------- Storage keys ----------
  const LS = {
    decks: "cf_decks",
    theme: "cf_theme",
    dark:  "cf_dark",
  };

  // ---------- DOM ----------
  const $ = (id) => document.getElementById(id);

  const views = {
    library: $("view-library"),
    create:  $("view-create"),
    study:   $("view-study"),
    manage:  $("view-manage"),
    info:    $("view-info"),
  };

  const overlay   = $("overlay");
  const drawer    = $("drawer");
  const drawerBtn = $("drawerBtn");

  const tabHome = $("tabHome");
  const tabInfo = $("tabInfo");

  // Library
  const deckGrid = $("deckGrid");

  // Create
  const backCreate   = $("backCreate");
  const deckName     = $("deckName");
  const cardsList    = $("cardsList");
  const addCardBtn   = $("addCard");
  const createDeckBtn= $("createDeckBtn");
  const typeBasic    = $("typeBasic");
  const typeMultiple = $("typeMultiple");

  // Study
  const backStudy  = $("backStudy");
  const studyTitle = $("studyTitle");
  const studyMeta  = $("studyMeta");
  const studyCard  = $("studyCard");
  const studyBadgeFront = $("studyBadgeFront");
  const studyBadgeBack  = $("studyBadgeBack");
  const studyTextFront  = $("studyTextFront");
  const studyTextBack   = $("studyTextBack");
  const markHardBtn= $("markHardBtn");
  const nextBtn    = $("nextBtn");
  const prevBtn    = $("prevBtn");
  const shuffleBtn = $("shuffleBtn");
  const resetProgressBtn = $("resetProgressBtn");
  const studyTimer = $("studyTimer");
  const studyTimerValue = $("studyTimerValue");
  const studyCounts = $("studyCounts");

  // Manage
  const backManage   = $("backManage");
  const manageTitle  = $("manageTitle");
  const manageMeta   = $("manageMeta");
  const manageList   = $("manageList");
  const deleteDeckBtn= $("deleteDeckBtn");
  const addCardToExistingBtn = $("addCardToExistingBtn");
  const manageDeckName = $("manageDeckName");

  // Card Editor Modal
  const cardEditorModal = $("cardEditorModal");
  const modalOverlay = $("modalOverlay");
  const closeCardEditorBtn = $("closeCardEditorBtn");
  const editorTypeBasic = $("editorTypeBasic");
  const editorTypeMultiple = $("editorTypeMultiple");
  const basicCardEditor = $("basicCardEditor");
  const multipleChoiceEditor = $("multipleChoiceEditor");
  const editorQuestionBasic = $("editorQuestionBasic");
  const editorAnswerBasic = $("editorAnswerBasic");
  const editorQuestionMultiple = $("editorQuestionMultiple");
  const editorChoice1 = $("editorChoice1");
  const editorChoice2 = $("editorChoice2");
  const editorChoice3 = $("editorChoice3");
  const editorChoice4 = $("editorChoice4");
  const editorCorrectAnswer = $("editorCorrectAnswer");
  const editorPhotoInput = $("editorPhotoInput");
  const editorPhotoPreview = $("editorPhotoPreview");
  const cancelCardEditorBtn = $("cancelCardEditorBtn");
  const saveCardEditorBtn = $("saveCardEditorBtn");

  // Info
  const goCreateFromInfo = $("goCreateFromInfo");

  // Drawer prefs
  const darkToggle = $("darkToggle");
  const palette    = $("palette");

  // Timed config modal
  const timedConfigModal = $("timedConfigModal");
  const timedModalOverlay = $("timedModalOverlay");
  const closeTimedConfigBtn = $("closeTimedConfigBtn");
  const cancelTimedConfigBtn = $("cancelTimedConfigBtn");
  const startTimedSessionBtn = $("startTimedSessionBtn");
  const timedCustomSeconds = $("timedCustomSeconds");
  const timedPracticeBtn = $("timedPracticeBtn");
  const timedChallengeBtn = $("timedChallengeBtn");

  // Session summary modal
  const sessionSummaryModal = $("sessionSummaryModal");
  const sessionSummaryOverlay = $("sessionSummaryOverlay");
  const closeSessionSummaryBtn = $("closeSessionSummaryBtn");
  const summaryCloseBtn = $("summaryCloseBtn");
  const summaryReviewTimeoutsBtn = $("summaryReviewTimeoutsBtn");
  const summaryStats = $("summaryStats");
  const summaryTimeoutList = $("summaryTimeoutList");

  // ---------- State ----------
  let decks = loadDecks();
  let activeDeckId = null;
  let currentCardType = "basic"; // "basic" or "multiple"
  let editorCardType = "basic"; // for modal editor
  let editorPhotoData = null; // for modal photo

  // study session state
  let study = {
    deckId: null,
    index: 0,
    side: "q", // q or a
    answeredCount: 0
  };

  // timed mode state
  let timed = {
    active: false,
    mode: "challenge",
    perCardSeconds: 15,
    lastPerDeck: {},
    timerId: null,
    remaining: 0,
    reviewed: 0,
    answeredInTime: 0,
    timedOutCards: []
  };

  // ---------- Helpers ----------
  function uid() {
    return "d_" + Math.random().toString(16).slice(2) + Date.now().toString(16);
  }

  function safeText(s) {
    return String(s)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

  function openDrawer() {
    drawer.classList.add("open");
    overlay.classList.add("open");
    drawer.setAttribute("aria-hidden","false");
    overlay.setAttribute("aria-hidden","false");
  }
  function closeDrawer() {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
    drawer.setAttribute("aria-hidden","true");
    overlay.setAttribute("aria-hidden","true");
  }

  function showView(name) {
    Object.values(views).forEach(v => v.classList.remove("is-active"));
    views[name].classList.add("is-active");

    const info = (name === "info");
    tabHome.classList.toggle("is-active", !info);
    tabInfo.classList.toggle("is-active", info);
  }

  function setRoute(route) {
    location.hash = "#/" + route;
  }

  function parseRoute() {
    const h = (location.hash || "#/library").replace("#/","");
    const parts = h.split("/").filter(Boolean);
    return { name: parts[0] || "library", id: parts[1] || null };
  }

  // ---------- Persistence ----------
  function loadDecks() {
    try {
      const raw = localStorage.getItem(LS.decks);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [
      {
        id: uid(),
        name: "Programming",
        cards: [
          { type: "basic", q: "What is a variable?", a: "A named storage location for a value.", hard: true },
          { type: "basic", q: "What is a function?", a: "A reusable block of code.", hard: false }
        ],
      },
      {
        id: uid(),
        name: "Math",
        cards: [
          { type: "basic", q: "Derivative?", a: "Rate of change of a function.", hard: true },
          { type: "basic", q: "Matrix?", a: "A rectangular array of numbers.", hard: false }
        ],
      },
    ];
  }

  function saveDecks() {
    localStorage.setItem(LS.decks, JSON.stringify(decks));
  }

  // ---------- Theme / Dark ----------
  function applyTheme(color) {
    document.documentElement.style.setProperty("--primary", color);
    localStorage.setItem(LS.theme, color);

    [...palette.querySelectorAll(".swatch")].forEach(s => s.classList.remove("is-active"));
    const active = palette.querySelector(`.swatch[data-color="${CSS.escape(color)}"]`);
    if (active) active.classList.add("is-active");
  }

  function applyDark(isDark) {
    document.body.classList.toggle("dark", isDark);
    darkToggle.checked = isDark;
    localStorage.setItem(LS.dark, isDark ? "1" : "0");
  }

  function restorePrefs() {
    const t = localStorage.getItem(LS.theme);
    if (t) applyTheme(t);

    const d = localStorage.getItem(LS.dark) === "1";
    applyDark(d);
  }

  // ---------- Library render ----------
  function hardCount(deck) {
    return deck.cards.filter(c => c.hard).length;
  }

  function renderLibrary() {
    deckGrid.innerHTML = "";

    for (const d of decks) {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${safeText(d.name)}</h3>
        <div class="meta-line">${d.cards.length} cards · ${hardCount(d)} hard</div>
        <div class="row" style="margin-top:14px">
          <button class="btn" data-manage="${d.id}">Manage</button>
          <button class="btn primary" data-study="${d.id}">Start Studying</button>
        </div>
        <div class="row" style="margin-top:8px">
          <button class="btn" data-timed="${d.id}">Timed test mode</button>
        </div>
      `;
      deckGrid.appendChild(card);
    }

    const createTile = document.createElement("div");
    createTile.className = "card create-tile";
    createTile.textContent = "Create New Deck";
    createTile.addEventListener("click", () => setRoute("create"));
    deckGrid.appendChild(createTile);

    deckGrid.querySelectorAll("[data-study]").forEach(btn => {
      btn.addEventListener("click", () => setRoute(`study/${btn.dataset.study}`));
    });

    deckGrid.querySelectorAll("[data-manage]").forEach(btn => {
      btn.addEventListener("click", () => setRoute(`manage/${btn.dataset.manage}`));
    });

    deckGrid.querySelectorAll("[data-timed]").forEach(btn => {
      btn.addEventListener("click", () => openTimedConfig(btn.dataset.timed));
    });
  }

  // ---------- Create Deck ----------
  function resetCreateForm() {
    deckName.value = "";
    currentCardType = "basic";
    typeBasic.classList.add("is-active");
    typeMultiple.classList.remove("is-active");
    cardsList.innerHTML = "";
    addCardRow();
  }

  function addCardRow(q = "", a = "", choices = ["", "", "", ""], type = null, photo = null) {
    const cardType = type || currentCardType;
    const row = document.createElement("div");
    row.className = "card-row";
    row.dataset.type = cardType;
    const photoId = "photo_" + uid();

    if (cardType === "basic") {
      row.innerHTML = `
        <div class="card-row-head">
          <div class="small">CARD</div>
          <button class="trash" type="button" aria-label="Remove">✕</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div>
            <div class="small muted" style="margin:0 0 8px 6px">QUESTION</div>
            <textarea class="textarea" placeholder="Enter question...">${safeText(q)}</textarea>
          </div>
          <div>
            <div class="small muted" style="margin:0 0 8px 6px">ANSWER</div>
            <textarea class="textarea" placeholder="Enter answer...">${safeText(a)}</textarea>
          </div>
        </div>
        <div style="margin-top:12px">
          <div class="small muted" style="margin:0 0 8px 6px">PHOTO (OPTIONAL)</div>
          <div class="photo-upload">
            <input type="file" id="${photoId}" class="photo-input" accept="image/*" style="display:none" />
            <label for="${photoId}" class="photo-label">
              <span class="photo-placeholder">📷 Add Photo</span>
            </label>
            <div class="photo-preview" style="display:none"></div>
          </div>
        </div>
      `;
    } else {
      row.innerHTML = `
        <div class="card-row-head">
          <div class="small">CARD - MULTIPLE CHOICE</div>
          <button class="trash" type="button" aria-label="Remove">✕</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px">
          <div>
            <div class="small muted" style="margin:0 0 8px 6px">QUESTION</div>
            <textarea class="textarea" placeholder="Enter question...">${safeText(q)}</textarea>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div>
              <div class="small muted" style="margin:0 0 8px 6px">CHOICE 1</div>
              <input class="input choice-input" type="text" placeholder="Choice 1" value="${safeText(choices[0] || '')}" />
            </div>
            <div>
              <div class="small muted" style="margin:0 0 8px 6px">CHOICE 2</div>
              <input class="input choice-input" type="text" placeholder="Choice 2" value="${safeText(choices[1] || '')}" />
            </div>
            <div>
              <div class="small muted" style="margin:0 0 8px 6px">CHOICE 3</div>
              <input class="input choice-input" type="text" placeholder="Choice 3" value="${safeText(choices[2] || '')}" />
            </div>
            <div>
              <div class="small muted" style="margin:0 0 8px 6px">CHOICE 4</div>
              <input class="input choice-input" type="text" placeholder="Choice 4" value="${safeText(choices[3] || '')}" />
            </div>
          </div>
          <div>
            <div class="small muted" style="margin:0 0 8px 6px">CORRECT ANSWER (1-4)</div>
            <select class="input correct-answer-select" style="height:50px;">
              <option value="0" ${a === "0" ? "selected" : ""}>Choice 1</option>
              <option value="1" ${a === "1" ? "selected" : ""}>Choice 2</option>
              <option value="2" ${a === "2" ? "selected" : ""}>Choice 3</option>
              <option value="3" ${a === "3" ? "selected" : ""}>Choice 4</option>
            </select>
          </div>
          <div>
            <div class="small muted" style="margin:0 0 8px 6px">PHOTO (OPTIONAL)</div>
            <div class="photo-upload">
              <input type="file" id="${photoId}" class="photo-input" accept="image/*" style="display:none" />
              <label for="${photoId}" class="photo-label">
                <span class="photo-placeholder">📷 Add Photo</span>
              </label>
              <div class="photo-preview" style="display:none"></div>
            </div>
          </div>
        </div>
      `;
    }

    const photoInput = row.querySelector(".photo-input");
    const photoPreview = row.querySelector(".photo-preview");
    const photoPlaceholder = row.querySelector(".photo-placeholder");

    photoInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const photoData = event.target.result;
          row.dataset.photo = photoData;
          photoPreview.innerHTML = `<img src="${photoData}" style="width:100%;max-height:150px;border-radius:10px;object-fit:cover" />`;
          photoPreview.style.display = "block";
          photoPlaceholder.textContent = "✓ Photo Added";
        };
        reader.readAsDataURL(file);
      }
    });

    if (photo) {
      row.dataset.photo = photo;
      photoPreview.innerHTML = `<img src="${photo}" style="width:100%;max-height:150px;border-radius:10px;object-fit:cover" />`;
      photoPreview.style.display = "block";
      photoPlaceholder.textContent = "✓ Photo Added";
    }

    row.querySelector(".trash").addEventListener("click", () => {
      if (cardsList.children.length <= 1) return;
      row.remove();
      renumberCreateRows();
    });

    cardsList.appendChild(row);
    renumberCreateRows();
  }

  function renumberCreateRows() {
    [...cardsList.children].forEach((r, i) => {
      const label = r.querySelector(".card-row-head .small");
      if (label) label.textContent = `CARD ${i + 1}`;
    });
  }

  function createDeckFromForm() {
    const name = deckName.value.trim();
    if (!name) {
      alert("Please enter a deck name.");
      return;
    }

    const rows = [...cardsList.querySelectorAll(".card-row")];
    const cards = rows.map(r => {
      const type = r.dataset.type;
      const photo = r.dataset.photo || null;

      if (type === "basic") {
        const t = r.querySelectorAll("textarea");
        return {
          type: "basic",
          q: t[0].value.trim(),
          a: t[1].value.trim(),
          photo: photo,
          hard: false
        };
      } else {
        const question = r.querySelector("textarea").value.trim();
        const choiceInputs = r.querySelectorAll(".choice-input");
        const choices = [
          choiceInputs[0].value.trim(),
          choiceInputs[1].value.trim(),
          choiceInputs[2].value.trim(),
          choiceInputs[3].value.trim()
        ];
        const correctAnswer = r.querySelector(".correct-answer-select").value;
        return {
          type: "multiple",
          q: question,
          choices: choices,
          a: correctAnswer,
          photo: photo,
          hard: false
        };
      }
    }).filter(c => {
      if (c.type === "basic") return c.q && c.a;
      else return c.q && c.choices.every(ch => ch);
    });

    if (!cards.length) {
      alert("Add at least one complete card.");
      return;
    }

    decks.unshift({ id: uid(), name, cards });
    saveDecks();
    renderLibrary();
    resetCreateForm();
    setRoute("library");
  }

  // ---------- Study ----------
  function startStudy(deckId, timedMode = false) {
    const deck = decks.find(d => d.id === deckId);
    if (!deck) {
      setRoute("library");
      return;
    }

    study = { deckId, index: 0, side: "q", answeredCount: 0 };
    timed.active = timedMode;
    timed.reviewed = 0;
    timed.answeredInTime = 0;
    timed.timedOutCards = [];
    clearInterval(timed.timerId);
    timed.timerId = null;

    showView("study");
    renderStudy();
    if (timedMode) startCardTimer();
  }

  function startTimedStudy(deckId) {
    startStudy(deckId, true);
  }

  function renderStudy() {
    const deck = decks.find(d => d.id === study.deckId);
    if (!deck) return;

    const total = deck.cards.length;
    const i = study.index;

    if (i >= total) {
      endStudySession(deck);
      return;
    }

    const card = deck.cards[i];
    studyTitle.textContent = `Study — ${deck.name}`;
    studyMeta.textContent = `${i + 1} / ${total}`;

    const hardTotal = deck.cards.filter(c => c.hard).length;
    studyCounts.textContent = `Answered: ${study.answeredCount} · Hard: ${hardTotal}`;

    if (timed.active) {
      studyTimer.style.display = "block";
      studyTimerValue.textContent = timed.remaining || timed.perCardSeconds;
    } else {
      studyTimer.style.display = "none";
    }

    const photoHTML = card.photo ? `<img src="${card.photo}" style="width:100%;max-height:200px;border-radius:10px;object-fit:cover;margin-bottom:14px" />` : "";

    if (card.type === "multiple") {
      studyCard.classList.remove("is-flipped");
      studyCard.style.cursor = "default";
      const choicesHTML = card.choices.map(choice =>
        `<div class="choice-option">${safeText(choice)}</div>`
      ).join("");
      studyBadgeFront.textContent = "QUESTION";
      studyTextFront.innerHTML = `${photoHTML}<div>${safeText(card.q)}</div><div style="margin-top:14px;display:flex;flex-direction:column;gap:10px">${choicesHTML}</div>`;
      studyBadgeBack.textContent = "ANSWER";
      const correctIdx = parseInt(card.a);
      studyTextBack.innerHTML = `${photoHTML}<div style="color:var(--primary);font-weight:950">Correct Answer:</div><div style="margin-top:10px">${safeText(card.choices[correctIdx])}</div>`;
      markHardBtn.textContent = card.hard ? "Hard ✓" : "Mark Hard";
    } else {
      studyCard.style.cursor = "pointer";
      const isQ = study.side === "q";
      if (isQ) {
        studyCard.classList.remove("is-flipped");
      } else {
        studyCard.classList.add("is-flipped");
      }
      studyBadgeFront.textContent = "QUESTION";
      studyTextFront.innerHTML = `${photoHTML}<div>${safeText(card.q)}</div>`;
      studyBadgeBack.textContent = "ANSWER";
      studyTextBack.innerHTML = `${photoHTML}<div>${safeText(card.a)}</div>`;
      markHardBtn.textContent = card.hard ? "Hard ✓" : "Mark Hard";
    }
  }

  function flipStudy() {
    const deck = decks.find(d => d.id === study.deckId);
    if (!deck) return;
    const card = deck.cards[study.index];
    if (!card) return;
    if (card.type === "multiple") {
      study.side = (study.side === "q") ? "a" : "q";
      renderStudy();
      return;
    }
    study.side = (study.side === "q") ? "a" : "q";
    renderStudy();
  }

  function nextStudy(fromTimeout = false) {
    const deck = decks.find(d => d.id === study.deckId);
    if (!deck) return;
    const card = deck.cards[study.index];

    if (timed.active && !fromTimeout) {
      timed.reviewed += 1;
      if (timed.remaining > 0) {
        timed.answeredInTime += 1;
      }
    }

    if (!fromTimeout) {
      study.answeredCount += 1;
    }

    study.index += 1;
    study.side = "q";
    renderStudy();
    if (timed.active && study.index < deck.cards.length) {
      startCardTimer();
    }
  }

  function toggleHard() {
    const deck = decks.find(d => d.id === study.deckId);
    if (!deck) return;

    const card = deck.cards[study.index];
    if (!card) return;
    card.hard = !card.hard;

    saveDecks();
    renderStudy();
  }

  // ---------- Timed mode ----------
  function openTimedConfig(deckId) {
    study.deckId = deckId;
    const last = timed.lastPerDeck[deckId];
    if (last) {
      timed.mode = last.mode;
      timed.perCardSeconds = last.seconds;
    } else {
      timed.mode = "challenge";
      timed.perCardSeconds = 15;
    }
    timedCustomSeconds.value = timed.perCardSeconds;

    if (timed.mode === "practice") {
      timedPracticeBtn.classList.add("primary");
      timedChallengeBtn.classList.remove("primary");
    } else {
      timedChallengeBtn.classList.add("primary");
      timedPracticeBtn.classList.remove("primary");
    }

    timedConfigModal.style.display = "flex";
  }

  function closeTimedConfig() {
    timedConfigModal.style.display = "none";
  }

  function startCardTimer() {
    clearInterval(timed.timerId);
    const deck = decks.find(d => d.id === study.deckId);
    if (!deck) return;

    timed.remaining = timed.perCardSeconds;
    studyTimerValue.textContent = timed.remaining;
    timed.timerId = setInterval(() => {
      timed.remaining -= 1;
      if (timed.remaining <= 0) {
        clearInterval(timed.timerId);
        timed.timerId = null;
        handleTimeUp();
      } else {
        studyTimerValue.textContent = timed.remaining;
      }
    }, 1000);
  }

  function handleTimeUp() {
    const deck = decks.find(d => d.id === study.deckId);
    if (!deck) return;
    const card = deck.cards[study.index];
    if (!card) return;

    timed.reviewed += 1;

    if (timed.mode === "practice") {
      alert("Suggested time exceeded");
      return;
    }

    card.hard = true;
    timed.timedOutCards.push({ q: card.q, index: study.index });
    saveDecks();
    nextStudy(true);
  }

  // ---------- Manage ----------
  function openManage(deckId) {
    const deck = decks.find(d => d.id === deckId);
    if (!deck) {
      setRoute("library");
      return;
    }

    activeDeckId = deckId;
    manageTitle.textContent = `Manage — ${deck.name}`;
    manageMeta.textContent = `${deck.cards.length} cards`;
    manageDeckName.value = deck.name;

    manageList.innerHTML = deck.cards.map((c, idx) => {
      const photoHTML = c.photo ? `<img src="${c.photo}" style="width:100%;max-height:100px;border-radius:8px;object-fit:cover;margin-top:10px" />` : "";
      if (c.type === "multiple") {
        return `
          <div class="manage-item" data-card-index="${idx}">
            <div class="manage-item-head">
              <div>
                <input class="input" style="margin-bottom:6px" value="${safeText(c.q)}" data-field="q" />
                ${c.choices.map((ch, i) =>
                  `<input class="input choice-input" style="margin-top:4px" value="${safeText(ch)}" data-field="choice${i}" />`
                ).join("")}
                <select class="input" data-field="correct" style="margin-top:6px">
                  ${c.choices.map((ch, i) =>
                    `<option value="${i}" ${String(i) === String(c.a) ? "selected" : ""}>Correct: Choice ${i+1}</option>`
                  ).join("")}
                </select>
                <div class="small muted" style="margin-top:10px">Hard: ${c.hard ? "Yes" : "No"}</div>
                ${photoHTML}
              </div>
            </div>
            <button class="trash" data-delete-card="${idx}" type="button" aria-label="Delete card">✕</button>
          </div>
        `;
      } else {
        return `
          <div class="manage-item" data-card-index="${idx}">
            <div class="manage-item-head">
              <div>
                <input class="input" style="margin-bottom:6px" value="${safeText(c.q)}" data-field="q" />
                <textarea class="textarea" data-field="a">${safeText(c.a)}</textarea>
                <div class="small muted" style="margin-top:10px">Hard: ${c.hard ? "Yes" : "No"}</div>
                ${photoHTML}
              </div>
            </div>
            <button class="trash" data-delete-card="${idx}" type="button" aria-label="Delete card">✕</button>
          </div>
        `;
      }
    }).join("");

    manageList.querySelectorAll("[data-delete-card]").forEach(btn => {
      btn.addEventListener("click", () => {
        const cardIdx = parseInt(btn.dataset.deleteCard, 10);
        deleteCard(cardIdx);
      });
    });

    manageList.querySelectorAll(".manage-item").forEach(item => {
      const idx = parseInt(item.dataset.cardIndex, 10);
      const card = deck.cards[idx];
      if (!card) return;

      item.querySelectorAll("[data-field]").forEach(input => {
        const field = input.dataset.field;
        const handler = () => {
          if (card.type === "multiple") {
            if (field === "q") card.q = input.value.trim();
            else if (field.startsWith("choice")) {
              const i = parseInt(field.replace("choice",""), 10);
              card.choices[i] = input.value.trim();
            } else if (field === "correct") {
              card.a = input.value;
            }
          } else {
            if (field === "q") card.q = input.value.trim();
            if (field === "a") card.a = input.value.trim();
          }
          saveDecks();
        };
        input.addEventListener("change", handler);
        input.addEventListener("blur", handler);
      });
    });
  }

  function deleteCard(cardIdx) {
    const deck = decks.find(d => d.id === activeDeckId);
    if (!deck) return;

    const card = deck.cards[cardIdx];
    const ok = confirm(`Delete card "${card.q}"?`);
    if (!ok) return;

    deck.cards.splice(cardIdx, 1);
    saveDecks();
    openManage(activeDeckId);
  }

  function deleteDeck() {
    const deck = decks.find(d => d.id === activeDeckId);
    if (!deck) return;

    const ok = confirm(`Delete deck "${deck.name}"?`);
    if (!ok) return;

    decks = decks.filter(d => d.id !== activeDeckId);
    saveDecks();
    renderLibrary();
    setRoute("library");
  }

  // ---------- Rename deck from manage ----------
  manageDeckName.addEventListener("change", () => {
    const deck = decks.find(d => d.id === activeDeckId);
    if (!deck) return;
    const name = manageDeckName.value.trim();
    if (!name) return;
    deck.name = name;
    saveDecks();
    manageTitle.textContent = `Manage — ${deck.name}`;
    renderLibrary();
  });

  // ---------- Card Editor Modal ----------
  function openCardEditorModal() {
    editorCardType = "basic";
    editorPhotoData = null;

    editorQuestionBasic.value = "";
    editorAnswerBasic.value = "";
    editorQuestionMultiple.value = "";
    editorChoice1.value = "";
    editorChoice2.value = "";
    editorChoice3.value = "";
    editorChoice4.value = "";
    editorCorrectAnswer.value = "0";
    editorPhotoInput.value = "";
    editorPhotoPreview.style.display = "none";
    editorPhotoPreview.innerHTML = "";
    cardEditorModal.querySelector(".photo-placeholder").textContent = "📷 Add Photo";

    basicCardEditor.style.display = "block";
    multipleChoiceEditor.style.display = "none";
    editorTypeBasic.classList.add("is-active");
    editorTypeMultiple.classList.remove("is-active");

    cardEditorModal.style.display = "flex";
  }

  function closeCardEditorModal() {
    cardEditorModal.style.display = "none";
  }

  function saveCardFromModal() {
    const deck = decks.find(d => d.id === activeDeckId);
    if (!deck) return;

    let newCard;

    if (editorCardType === "basic") {
      const q = editorQuestionBasic.value.trim();
      const a = editorAnswerBasic.value.trim();
      if (!q || !a) {
        alert("Please enter both question and answer.");
        return;
      }
      newCard = {
        type: "basic",
        q,
        a,
        photo: editorPhotoData,
        hard: false
      };
    } else {
      const q = editorQuestionMultiple.value.trim();
      const choices = [
        editorChoice1.value.trim(),
        editorChoice2.value.trim(),
        editorChoice3.value.trim(),
        editorChoice4.value.trim()
      ];
      const correctAnswer = editorCorrectAnswer.value;
      if (!q || !choices.every(ch => ch)) {
        alert("Please enter question and all 4 choices.");
        return;
      }
      newCard = {
        type: "multiple",
        q,
        choices,
        a: correctAnswer,
        photo: editorPhotoData,
        hard: false
      };
    }

    deck.cards.push(newCard);
    saveDecks();
    closeCardEditorModal();
    openManage(activeDeckId);
  }

  // ---------- Session summary ----------
  function endStudySession(deck) {
    clearInterval(timed.timerId);
    timed.timerId = null;

    const total = deck.cards.length;
    const totalReviewed = timed.active ? timed.reviewed : study.answeredCount;
    const timeouts = timed.active ? timed.timedOutCards.length : 0;
    const answeredInTime = timed.active ? timed.answeredInTime : study.answeredCount;

    summaryStats.textContent =
      `Total cards: ${total} · Reviewed: ${totalReviewed} · In time: ${answeredInTime} · Time-outs: ${timeouts}`;

    if (timeouts > 0) {
      summaryReviewTimeoutsBtn.style.display = "inline-flex";
      summaryTimeoutList.innerHTML = timed.timedOutCards.map((c, idx) =>
        `<div class="small">#${idx + 1} · ${safeText(c.q)}</div>`
      ).join("");
    } else {
      summaryReviewTimeoutsBtn.style.display = "none";
      summaryTimeoutList.innerHTML = `<div class="small muted">No time-out cards.</div>`;
    }

    sessionSummaryModal.style.display = "flex";
  }

  function closeSessionSummary() {
    sessionSummaryModal.style.display = "none";
    setRoute("library");
  }

  summaryReviewTimeoutsBtn.addEventListener("click", () => {
    const deck = decks.find(d => d.id === study.deckId);
    if (!deck) return;
    const indices = timed.timedOutCards.map(c => c.index);
    const subset = indices.map(i => deck.cards[i]).filter(Boolean);
    if (!subset.length) return;

    const newDeck = { id: uid(), name: deck.name + " — Timeouts", cards: subset };
    decks.push(newDeck);
    saveDecks();
    sessionSummaryModal.style.display = "none";
    setRoute("study/" + newDeck.id);
  });

  closeSessionSummaryBtn.addEventListener("click", closeSessionSummary);
  summaryCloseBtn.addEventListener("click", closeSessionSummary);
  sessionSummaryOverlay.addEventListener("click", closeSessionSummary);

  // ---------- Info ----------
  function renderInfo() {
    const features = [
      { title: "Perfect Organization", text: "Create structured decks by subject or topic." },
      { title: "Efficient Learning", text: "Use question-and-answer cards for retention." },
      { title: "Instant Results", text: "Study quickly and track progress." },
      { title: "Personalized Style", text: "Theme colors and dark mode included." },
    ];

    const grid = $("infoGrid");
    grid.innerHTML = features.map(f => `
      <div class="feature">
        <h3>${safeText(f.title)}</h3>
        <p>${safeText(f.text)}</p>
      </div>
    `).join("");
  }

  // ---------- Router ----------
  function router() {
    const { name, id } = parseRoute();

    closeDrawer();

    if (name === "library") {
      showView("library");
      renderLibrary();
      return;
    }
    if (name === "create") {
      showView("create");
      resetCreateForm();
      return;
    }
    if (name === "info") {
      showView("info");
      return;
    }
    if (name === "study" && id) {
      startStudy(id, false);
      return;
    }
    if (name === "manage" && id) {
      showView("manage");
      openManage(id);
      return;
    }
    setRoute("library");
  }

  // ---------- Events ----------
  drawerBtn.addEventListener("click", () => {
    if (drawer.classList.contains("open")) closeDrawer();
    else openDrawer();
  });
  overlay.addEventListener("click", closeDrawer);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });

  drawer.querySelectorAll("[data-route]").forEach(btn => {
    btn.addEventListener("click", () => setRoute(btn.dataset.route));
  });

  [tabHome, tabInfo].forEach(btn => {
    btn.addEventListener("click", () => setRoute(btn.dataset.route));
  });

  // create actions
  backCreate.addEventListener("click", () => setRoute("library"));

  typeBasic.addEventListener("click", () => {
    currentCardType = "basic";
    typeBasic.classList.add("is-active");
    typeMultiple.classList.remove("is-active");
    cardsList.innerHTML = "";
    addCardRow();
  });

  typeMultiple.addEventListener("click", () => {
    currentCardType = "multiple";
    typeMultiple.classList.add("is-active");
    typeBasic.classList.remove("is-active");
    cardsList.innerHTML = "";
    addCardRow();
  });

  addCardBtn.addEventListener("click", () => addCardRow());
  createDeckBtn.addEventListener("click", createDeckFromForm);

  // study actions
  backStudy.addEventListener("click", () => setRoute("library"));
  studyCard.addEventListener("click", flipStudy);
  studyCard.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") flipStudy();
  });
  nextBtn.addEventListener("click", () => nextStudy(false));
  markHardBtn.addEventListener("click", toggleHard);

  prevBtn.addEventListener("click", () => {
    if (study.index > 0) {
      study.index -= 1;
      study.side = "q";
      renderStudy();
      if (timed.active) startCardTimer();
    }
  });

  shuffleBtn.addEventListener("click", () => {
    const deck = decks.find(d => d.id === study.deckId);
    if (!deck) return;
    deck.cards.sort(() => Math.random() - 0.5);
    saveDecks();
    study.index = 0;
    study.side = "q";
    renderStudy();
    if (timed.active) startCardTimer();
  });

  resetProgressBtn.addEventListener("click", () => {
    const deck = decks.find(d => d.id === study.deckId);
    if (!deck) return;
    deck.cards.forEach(c => c.hard = false);
    saveDecks();
    study.index = 0;
    study.side = "q";
    study.answeredCount = 0;
    renderStudy();
    if (timed.active) startCardTimer();
  });

  // manage actions
  backManage.addEventListener("click", () => setRoute("library"));
  deleteDeckBtn.addEventListener("click", deleteDeck);
  addCardToExistingBtn.addEventListener("click", () => {
    const deck = decks.find(d => d.id === activeDeckId);
    if (!deck) return;
    openCardEditorModal();
  });

  // Card editor modal events
  closeCardEditorBtn.addEventListener("click", closeCardEditorModal);
  modalOverlay.addEventListener("click", closeCardEditorModal);
  cancelCardEditorBtn.addEventListener("click", closeCardEditorModal);
  saveCardEditorBtn.addEventListener("click", saveCardFromModal);

  editorTypeBasic.addEventListener("click", () => {
    editorCardType = "basic";
    editorTypeBasic.classList.add("is-active");
    editorTypeMultiple.classList.remove("is-active");
    basicCardEditor.style.display = "block";
    multipleChoiceEditor.style.display = "none";
  });

  editorTypeMultiple.addEventListener("click", () => {
    editorCardType = "multiple";
    editorTypeMultiple.classList.add("is-active");
    editorTypeBasic.classList.remove("is-active");
    basicCardEditor.style.display = "none";
    multipleChoiceEditor.style.display = "block";
  });

  editorPhotoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        editorPhotoData = event.target.result;
        editorPhotoPreview.innerHTML = `<img src="${editorPhotoData}" style="width:100%;max-height:150px;border-radius:10px;object-fit:cover" />`;
        editorPhotoPreview.style.display = "block";
        cardEditorModal.querySelector(".photo-placeholder").textContent = "✓ Photo Added";
      };
      reader.readAsDataURL(file);
    }
  });

  // timed config events
  [8,15,25].forEach(sec => {
    timedConfigModal.querySelector(`[data-tpreset="${sec}"]`).addEventListener("click", () => {
      timed.perCardSeconds = sec;
      timedCustomSeconds.value = sec;
    });
  });

  timedPracticeBtn.addEventListener("click", () => {
    timed.mode = "practice";
    timedPracticeBtn.classList.add("primary");
    timedChallengeBtn.classList.remove("primary");
  });

  timedChallengeBtn.addEventListener("click", () => {
    timed.mode = "challenge";
    timedChallengeBtn.classList.add("primary");
    timedPracticeBtn.classList.remove("primary");
  });

  closeTimedConfigBtn.addEventListener("click", closeTimedConfig);
  cancelTimedConfigBtn.addEventListener("click", closeTimedConfig);
  timedModalOverlay.addEventListener("click", closeTimedConfig);

  startTimedSessionBtn.addEventListener("click", () => {
    const custom = parseInt(timedCustomSeconds.value, 10);
    if (!isNaN(custom) && custom >= 3 && custom <= 120) {
      timed.perCardSeconds = custom;
    }
    if (study.deckId) {
      timed.lastPerDeck[study.deckId] = { mode: timed.mode, seconds: timed.perCardSeconds };
    }
    closeTimedConfig();
    startTimedStudy(study.deckId);
  });

  // info action
  goCreateFromInfo.addEventListener("click", () => setRoute("create"));

  // prefs
  darkToggle.addEventListener("change", (e) => applyDark(e.target.checked));
  palette.addEventListener("click", (e) => {
    const sw = e.target.closest(".swatch");
    if (!sw) return;
    applyTheme(sw.dataset.color);
  });

  // route changes
  window.addEventListener("hashchange", router);

  // ---------- Init ----------
  restorePrefs();
  renderInfo();

  if (!location.hash) setRoute("library");
  router();
});
