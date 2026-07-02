const firebaseConfig = {
  apiKey: "AIzaSyDKx2zROcaCfljHIUXXmvXeXJQUU5xobac",
  authDomain: "tunecanvas-4680c.firebaseapp.com",
  databaseURL: "https://tunecanvas-4680c-default-rtdb.firebaseio.com",
  projectId: "tunecanvas-4680c",
  storageBucket: "tunecanvas-4680c.firebasestorage.app",
  messagingSenderId: "1056849938609",
  appId: "1:1056849938609:web:306fde6385ed9e1a207a90"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const ROOM_WORDS = ["VIBE", "GLOW", "WAVE", "DUSK", "ECHO", "DAWN", "FIZZ", "HAZE", "SPIN", "DRIP", "MELT", "BLOOM"];

function generateRoomCode() {
  const word = ROOM_WORDS[Math.floor(Math.random() * ROOM_WORDS.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${word}-${num}`;
}

const landingScreen = document.getElementById("landingScreen");
const appScreen = document.getElementById("appScreen");
const createRoomBtn = document.getElementById("createRoomBtn");
const showJoinBtn = document.getElementById("showJoinBtn");
const joinForm = document.getElementById("joinForm");
const joinCodeInput = document.getElementById("joinCodeInput");
const joinRoomBtn = document.getElementById("joinRoomBtn");
const roomCodeDisplay = document.getElementById("roomCodeDisplay");
const copyCodeBtn = document.getElementById("copyCodeBtn");

function enterRoom(code) {
  localStorage.setItem("tunecanvas_room", code);
  roomCodeDisplay.textContent = code;
  landingScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");
  localStorage.setItem("tunecanvas_room", code);
  roomCodeDisplay.textContent = code;
  landingScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");

  if (myCardId) {
    db.ref(`rooms/${code}/cards/${myCardId}`).once("value").then((snapshot) => {
      if (snapshot.exists()) {
        const saved = snapshot.val();
        state = { ...state, ...saved };
        renderCard();
      }
    });
  }
}
let myCardId = localStorage.getItem("tunecanvas_card_id") || null;

function saveCardToRoom() {
  const room = localStorage.getItem("tunecanvas_room");
  if (!room) return;

  if (!myCardId) {
    myCardId = db.ref(`rooms/${room}/cards`).push().key;
    localStorage.setItem("tunecanvas_card_id", myCardId);
  }

  db.ref(`rooms/${room}/cards/${myCardId}`).set({
    creator: state.creator,
    title: state.title,
    desc: state.desc,
    mood: state.mood,
    moodEmoji: state.moodEmoji,
    songs: state.songs.filter(s => s.title),
    updatedAt: Date.now()
  });
}

createRoomBtn.addEventListener("click", async () => {
  const code = generateRoomCode();
  await db.ref(`rooms/${code}`).set({ createdAt: Date.now() });
  enterRoom(code);
});

showJoinBtn.addEventListener("click", () => {
  joinForm.classList.toggle("open");
});

joinRoomBtn.addEventListener("click", () => {
  const code = joinCodeInput.value.trim().toUpperCase();
  if (!code) return;

  db.ref(`rooms/${code}`).once("value").then((snapshot) => {
    if (snapshot.exists()) {
      enterRoom(code);
    } else {
      alert("Room not found — double check the code and try again.");
    }
  });
});

copyCodeBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(roomCodeDisplay.textContent).then(() => {
    copyCodeBtn.textContent = "✓";
    setTimeout(() => (copyCodeBtn.textContent = "copy"), 1500);
  });
});
const MOOD_THEMES = {
  dreamy: { base: "#C9BFE8", accent: "#8B7FC7" },
  golden: { base: "#F4C3B6", accent: "#D98E5C" },
  moody:  { base: "#A8C0CE", accent: "#5C7A8E" },
  chill:  { base: "#C3D4B5", accent: "#7A9463" },
  fiery:  { base: "#F4A896", accent: "#D9634F" }
};

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
const downloadBtn = document.getElementById("downloadBtn");

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
  const theme = MOOD_THEMES[state.mood] || MOOD_THEMES.golden;
  card.style.setProperty("--mood-base", theme.base);
  card.style.setProperty("--mood-accent", theme.accent);
  card.querySelector(".card-mood").textContent = `${state.moodEmoji} ${state.mood}`;
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
downloadBtn.addEventListener("click", async () => {
  const editBtn = document.getElementById("openModalBtn");

  editBtn.style.visibility = "hidden";
  downloadBtn.disabled = true;
  downloadBtn.textContent = "saving...";

  try {
    const canvas = await html2canvas(card, {
      backgroundColor: "#ffffff",
      scale: 2,
      ignoreElements: (el) => el.id === "downloadBtn" || el.id === "openModalBtn"
    });

    const link = document.createElement("a");
    link.download = `${state.title.replace(/\s+/g, "-").toLowerCase() || "tunecanvas-card"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (err) {
    console.error("download failed:", err);
    alert("couldn't save the image, try again");
  } finally {
    editBtn.style.visibility = "visible";
    downloadBtn.disabled = false;
    downloadBtn.innerHTML = `<span>⬇</span> save image`;
  }
});

// ── Form submit just closes modal (preview already live) ──
cardForm.addEventListener("submit", (e) => {
  e.preventDefault();
  saveCardToRoom();
  modalOverlay.classList.remove("open");
});


const savedRoom = localStorage.getItem("tunecanvas_room");
if (savedRoom) {
  enterRoom(savedRoom);
}

renderMoodPicker();
renderCard();