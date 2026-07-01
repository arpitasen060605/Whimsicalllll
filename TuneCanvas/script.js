// ── App State ──
let state = {
  creator: "arpita",
  title: "late night drives",
  desc: "songs for windows-down, no destination moments 🌙",
  mood: "dreamy",
  moodEmoji: "☁️",
  songs: [
    { title: "Midnight Rain", artist: "Taylor Swift" },
    { title: "Golden Hour", artist: "JVKE" },
    { title: "Lavender Haze", artist: "Taylor Swift" },
    { title: "From the Start", artist: "Laufey" }
  ]
};

// ── Elements ──
const card = document.querySelector(".card");
const openModalBtn = document.getElementById("openModalBtn");
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const cardForm = document.getElementById("cardForm");

const inputCreator = document.getElementById("inputCreator");
const inputTitle = document.getElementById("inputTitle");
const inputDesc = document.getElementById("inputDesc");
const moodPicker = document.getElementById("moodPicker");
const songRows = document.getElementById("songRows");
const addSongBtn = document.getElementById("addSongBtn");

// ── Open / Close Modal ──
openModalBtn.addEventListener("click", () => {
  fillFormFromState();
  modalOverlay.classList.add("open");
});
modalClose.addEventListener("click", () => modalOverlay.classList.remove("open"));
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) modalOverlay.classList.remove("open");
});

// ── Fill form with current state (so reopening the modal doesn't lose data) ──
function fillFormFromState() {
  inputCreator.value = state.creator;
  inputTitle.value = state.title;
  inputDesc.value = state.desc;
  renderMoodPicker();
  renderSongRows();
}

// ── Mood Picker ──
function renderMoodPicker() {
  [...moodPicker.children].forEach(btn => {
    btn.classList.toggle("selected", btn.dataset.mood === state.mood);
  });
}
moodPicker.addEventListener("click", (e) => {
  if (!e.target.classList.contains("mood-option")) return;
  state.mood = e.target.dataset.mood;
  state.moodEmoji = e.target.dataset.emoji;
  renderMoodPicker();
  renderCard();
});

// ── Song Rows ──
function renderSongRows() {
  songRows.innerHTML = "";
  state.songs.forEach((song, i) => {
    const row = document.createElement("div");
    row.className = "song-row";
    row.innerHTML = `
      <input type="text" placeholder="song title" value="${song.title}" data-index="${i}" data-field="title" />
      <input type="text" placeholder="artist" value="${song.artist}" data-index="${i}" data-field="artist" />
      <button type="button" class="remove-song-btn" data-index="${i}">✕</button>
    `;
    songRows.appendChild(row);
  });
}

addSongBtn.addEventListener("click", () => {
  state.songs.push({ title: "", artist: "" });
  renderSongRows();
});

songRows.addEventListener("click", (e) => {
  if (!e.target.classList.contains("remove-song-btn")) return;
  const i = Number(e.target.dataset.index);
  state.songs.splice(i, 1);
  renderSongRows();
  renderCard();
});

songRows.addEventListener("input", (e) => {
  const i = Number(e.target.dataset.index);
  const field = e.target.dataset.field;
  if (i === undefined || !field) return;
  state.songs[i][field] = e.target.value;
  renderCard();
});

// ── Text fields → live preview ──
[inputCreator, inputTitle, inputDesc].forEach(el => {
  el.addEventListener("input", () => {
    state.creator = inputCreator.value || "you";
    state.title = inputTitle.value || "untitled playlist";
    state.desc = inputDesc.value;
    renderCard();
  });
});

// ── Render the actual card ──
function renderCard() {
  card.querySelector(".card-mood").textContent = `${state.moodEmoji} ${state.mood}`;
  card.querySelector(".card-creator").textContent = `by ${state.creator}`;
  card.querySelector(".card-title").textContent = state.title;
  card.querySelector(".card-desc").textContent = state.desc;

  const list = card.querySelector(".song-list");
  list.innerHTML = "";
  state.songs.forEach((song, i) => {
    if (!song.title) return; // skip empty rows
    const num = String(i + 1).padStart(2, "0");
    const el = document.createElement("div");
    el.className = "song";
    el.innerHTML = `
      <span class="song-num">${num}</span>
      <div class="song-info">
        <span class="song-title">${song.title}</span>
        <span class="song-artist">${song.artist}</span>
      </div>
    `;
    list.appendChild(el);
  });

  const count = state.songs.filter(s => s.title).length;
  card.querySelector(".song-count").textContent = `${count} song${count === 1 ? "" : "s"}`;
}

// ── Form submit just closes modal (preview already live) ──
cardForm.addEventListener("submit", (e) => {
  e.preventDefault();
  modalOverlay.classList.remove("open");
});

// ── Init ──
renderMoodPicker();
renderCard();