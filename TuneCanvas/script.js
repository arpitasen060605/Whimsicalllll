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

const MOOD_THEMES = {
  dreamy: { base: "#C9BFE8", accent: "#8B7FC7" },
  golden: { base: "#F4C3B6", accent: "#D98E5C" },
  moody:  { base: "#A8C0CE", accent: "#5C7A8E" },
  chill:  { base: "#C3D4B5", accent: "#7A9463" },
  fiery:  { base: "#F4A896", accent: "#D9634F" }
};

const ROOM_WORDS = ["VIBE", "GLOW", "WAVE", "DUSK", "ECHO", "DAWN", "FIZZ", "HAZE", "SPIN", "DRIP", "MELT", "BLOOM"];

function generateRoomCode() {
  const word = ROOM_WORDS[Math.floor(Math.random() * ROOM_WORDS.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${word}-${num}`;
}

function hashRotation(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) % 1000;
  return (hash % 9) - 4;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

let state = {
  creator: "",
  title: "",
  desc: "",
  mood: "dreamy",
  moodEmoji: "☁️",
  songs: [{ title: "", artist: "" }]
};

let myCardId = localStorage.getItem("tunecanvas_card_id") || null;
let roomCards = {};
let currentRoom = null;

const landingScreen = document.getElementById("landingScreen");
const appScreen = document.getElementById("appScreen");
const createRoomBtn = document.getElementById("createRoomBtn");
const showJoinBtn = document.getElementById("showJoinBtn");
const joinForm = document.getElementById("joinForm");
const joinCodeInput = document.getElementById("joinCodeInput");
const joinRoomBtn = document.getElementById("joinRoomBtn");
const roomCodeDisplay = document.getElementById("roomCodeDisplay");
const copyCodeBtn = document.getElementById("copyCodeBtn");
const downloadBtn = document.getElementById("downloadBtn");
const wallContainer = document.getElementById("wallContainer");

const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const cardForm = document.getElementById("cardForm");
const inputCreator = document.getElementById("inputCreator");
const inputTitle = document.getElementById("inputTitle");
const inputDesc = document.getElementById("inputDesc");
const moodPicker = document.getElementById("moodPicker");
const songRows = document.getElementById("songRows");
const addSongBtn = document.getElementById("addSongBtn");

function cardTemplate(id, data, isMine) {
  const theme = MOOD_THEMES[data.mood] || MOOD_THEMES.golden;
  const rot = hashRotation(id);
  const songs = data.songs || [];
  const songsHtml = songs.map((s, i) => `
    <div class="song">
      <span class="song-num">${String(i + 1).padStart(2, "0")}</span>
      <div class="song-info">
        <span class="song-title">${escapeHtml(s.title)}</span>
        <span class="song-artist">${escapeHtml(s.artist)}</span>
      </div>
    </div>
  `).join("");

  return `
    <div class="card" data-card-id="${id}" style="--mood-base:${theme.base};--mood-accent:${theme.accent};--rot:${rot}deg">
      ${isMine ? `<button class="edit-btn" data-edit="${id}" title="edit card">✎</button>` : ""}
      <div class="card-header">
        <span class="card-mood">${data.moodEmoji || ""} ${escapeHtml(data.mood || "")}</span>
        <span class="card-creator">by ${escapeHtml(data.creator || "someone")}</span>
      </div>
      <h2 class="card-title">${escapeHtml(data.title || "untitled")}</h2>
      <p class="card-desc">${escapeHtml(data.desc || "")}</p>
      <div class="song-list">${songsHtml}</div>
      <div class="card-footer">
        <span class="song-count">${songs.length} song${songs.length === 1 ? "" : "s"}</span>
        <span class="card-tag">🎨 TuneCanvas</span>
      </div>
    </div>
  `;
}

function emptyTile() {
  return `
    <div class="card empty-card">
      <p class="empty-card-text">you haven't added a card yet</p>
      <button id="createCardBtn" class="landing-btn primary">+ create your card</button>
    </div>
  `;
}

function renderWall() {
  const entries = Object.entries(roomCards);
  let html = "";

  if (!myCardId || !roomCards[myCardId]) {
    html += emptyTile();
  }

  entries.forEach(([id, data]) => {
    html += cardTemplate(id, data, id === myCardId);
  });

  wallContainer.innerHTML = html;
}

wallContainer.addEventListener("click", (e) => {
  if (e.target.closest("[data-edit]") || e.target.id === "createCardBtn") {
    openEditModal();
  }
});

function openEditModal() {
  const existing = myCardId ? roomCards[myCardId] : null;
  if (existing) {
    state = {
      creator: existing.creator || "",
      title: existing.title || "",
      desc: existing.desc || "",
      mood: existing.mood || "dreamy",
      moodEmoji: existing.moodEmoji || "☁️",
      songs: existing.songs && existing.songs.length ? existing.songs : [{ title: "", artist: "" }]
    };
  }
  inputCreator.value = state.creator;
  inputTitle.value = state.title;
  inputDesc.value = state.desc;
  renderMoodPicker();
  renderSongRows();
  modalOverlay.classList.add("open");
}

modalClose.addEventListener("click", () => modalOverlay.classList.remove("open"));
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) modalOverlay.classList.remove("open");
});

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
});

function renderSongRows() {
  songRows.innerHTML = "";
  state.songs.forEach((song, i) => {
    const row = document.createElement("div");
    row.className = "song-row";
    row.innerHTML = `
      <input type="text" placeholder="song title" value="${escapeHtml(song.title)}" data-index="${i}" data-field="title" />
      <input type="text" placeholder="artist" value="${escapeHtml(song.artist)}" data-index="${i}" data-field="artist" />
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
  state.songs.splice(Number(e.target.dataset.index), 1);
  renderSongRows();
});
songRows.addEventListener("input", (e) => {
  const i = Number(e.target.dataset.index);
  const field = e.target.dataset.field;
  if (i === undefined || !field) return;
  state.songs[i][field] = e.target.value;
});
[inputCreator, inputTitle, inputDesc].forEach(el => {
  el.addEventListener("input", () => {
    state.creator = inputCreator.value;
    state.title = inputTitle.value;
    state.desc = inputDesc.value;
  });
});

function saveCardToRoom() {
  if (!currentRoom) return;
  if (!myCardId) {
    myCardId = db.ref(`rooms/${currentRoom}/cards`).push().key;
    localStorage.setItem("tunecanvas_card_id", myCardId);
  }
  db.ref(`rooms/${currentRoom}/cards/${myCardId}`).set({
    creator: state.creator || "someone",
    title: state.title || "untitled playlist",
    desc: state.desc,
    mood: state.mood,
    moodEmoji: state.moodEmoji,
    songs: state.songs.filter(s => s.title),
    updatedAt: Date.now()
  });
}

cardForm.addEventListener("submit", (e) => {
  e.preventDefault();
  saveCardToRoom();
  modalOverlay.classList.remove("open");
});

function enterRoom(code) {
  currentRoom = code;
  localStorage.setItem("tunecanvas_room", code);
  roomCodeDisplay.textContent = code;
  landingScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");

  db.ref(`rooms/${code}/cards`).on("value", (snapshot) => {
    roomCards = snapshot.val() || {};
    renderWall();
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

downloadBtn.addEventListener("click", async () => {
  if (!myCardId) {
    alert("Create your card first!");
    return;
  }
  const myCardEl = document.querySelector(`[data-card-id="${myCardId}"]`);
  if (!myCardEl) return;

  downloadBtn.disabled = true;
  downloadBtn.textContent = "saving...";

  try {
    const canvas = await html2canvas(myCardEl, {
      backgroundColor: "#ffffff",
      scale: 2,
      ignoreElements: (el) => el.classList && el.classList.contains("edit-btn")
    });
    const link = document.createElement("a");
    link.download = `${(state.title || "tunecanvas-card").replace(/\s+/g, "-").toLowerCase()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (err) {
    console.error("download failed:", err);
    alert("couldn't save the image, try again");
  } finally {
    downloadBtn.disabled = false;
    downloadBtn.textContent = "save image";
  }
});

const savedRoom = localStorage.getItem("tunecanvas_room");
if (savedRoom) {
  enterRoom(savedRoom);
}