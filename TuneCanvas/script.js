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
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

const MOOD_THEMES = {
  dreamy: { base: "#C9BFE8", accent: "#8B7FC7" },
  golden: { base: "#F4C3B6", accent: "#D98E5C" },
  moody:  { base: "#A8C0CE", accent: "#5C7A8E" },
  chill:  { base: "#C3D4B5", accent: "#7A9463" },
  fiery:  { base: "#F4A896", accent: "#D9634F" }
};
const REACTIONS = ["🎵", "✨", "🔥"];
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

let state = { creator: "", title: "", desc: "", mood: "dreamy", moodEmoji: "☁️", songs: [{ title: "", artist: "" }] };
let roomCards = {};
let currentRoom = null;
let currentUser = null;
let editingCardId = null; // null = creating a new card, otherwise editing this existing one

const loginScreen = document.getElementById("loginScreen");
const googleSignInBtn = document.getElementById("googleSignInBtn");
const signOutBtn = document.getElementById("signOutBtn");
const landingScreen = document.getElementById("landingScreen");
const appScreen = document.getElementById("appScreen");
const createRoomBtn = document.getElementById("createRoomBtn");
const showJoinBtn = document.getElementById("showJoinBtn");
const joinForm = document.getElementById("joinForm");
const joinCodeInput = document.getElementById("joinCodeInput");
const joinRoomBtn = document.getElementById("joinRoomBtn");
const roomCodeDisplay = document.getElementById("roomCodeDisplay");
const copyCodeBtn = document.getElementById("copyCodeBtn");
const newCardBtn = document.getElementById("newCardBtn");
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

// ── Auth ──
googleSignInBtn.addEventListener("click", () => {
  auth.signInWithPopup(googleProvider).catch((err) => {
    console.error(err);
    alert("sign-in failed, try again");
  });
});
signOutBtn.addEventListener("click", () => auth.signOut());

auth.onAuthStateChanged((user) => {
  currentUser = user;
  if (user) {
    loginScreen.classList.add("hidden");
    state.creator = user.displayName || "friend";
    const savedRoom = localStorage.getItem("tunecanvas_room");
    if (savedRoom) enterRoom(savedRoom);
    else landingScreen.classList.remove("hidden");
  } else {
    loginScreen.classList.remove("hidden");
    landingScreen.classList.add("hidden");
    appScreen.classList.add("hidden");
    currentRoom = null;
  }
});

// ── Card rendering ──
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

  const reactionsHtml = REACTIONS.map(emoji => {
    const reactedBy = (data.reactions && data.reactions[emoji]) || {};
    const count = Object.keys(reactedBy).length;
    const active = currentUser && !!reactedBy[currentUser.uid];
    return `<button class="reaction-btn ${active ? "active" : ""}" data-react="${emoji}" data-card="${id}">
      <span>${emoji}</span>${count > 0 ? `<span class="reaction-count">${count}</span>` : ""}
    </button>`;
  }).join("");

  const actionsHtml = isMine ? `
    <div class="card-actions">
      <button class="icon-btn" data-edit="${id}" title="edit">✎</button>
      <button class="icon-btn" data-dl="${id}" title="download">⬇</button>
      <button class="icon-btn delete" data-del="${id}" title="delete">🗑</button>
    </div>
  ` : "";

  return `
    <div class="card" data-card-id="${id}" style="--mood-base:${theme.base};--mood-accent:${theme.accent};--rot:${rot}deg">
      ${actionsHtml}
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
      <div class="reactions">${reactionsHtml}</div>
    </div>
  `;
}

function renderWall() {
  const myUid = currentUser ? currentUser.uid : null;
  const html = Object.entries(roomCards)
    .map(([id, data]) => cardTemplate(id, data, data.ownerUid === myUid))
    .join("");
  wallContainer.innerHTML = html;
}

wallContainer.addEventListener("click", async (e) => {
  const editBtn = e.target.closest("[data-edit]");
  if (editBtn) { openEditModal(editBtn.dataset.edit); return; }

  const delBtn = e.target.closest("[data-del]");
  if (delBtn) { deleteCard(delBtn.dataset.del); return; }

  const dlBtn = e.target.closest("[data-dl]");
  if (dlBtn) { downloadCard(dlBtn.dataset.dl); return; }

  const reactBtn = e.target.closest("[data-react]");
  if (reactBtn) toggleReaction(reactBtn.dataset.card, reactBtn.dataset.react);
});

function toggleReaction(cardId, emoji) {
  if (!currentUser) return;
  const path = `rooms/${currentRoom}/cards/${cardId}/reactions/${emoji}/${currentUser.uid}`;
  const already = roomCards[cardId] && roomCards[cardId].reactions &&
    roomCards[cardId].reactions[emoji] && roomCards[cardId].reactions[emoji][currentUser.uid];
  if (already) db.ref(path).remove();
  else db.ref(path).set(true);
}

function deleteCard(cardId) {
  if (!confirm("Delete this playlist card? This can't be undone.")) return;
  db.ref(`rooms/${currentRoom}/cards/${cardId}`).remove();
}

async function downloadCard(cardId) {
  const el = document.querySelector(`[data-card-id="${cardId}"]`);
  if (!el) return;
  try {
    const canvas = await html2canvas(el, {
      backgroundColor: "#ffffff",
      scale: 2,
      ignoreElements: (node) => node.classList &&
        (node.classList.contains("card-actions") || node.classList.contains("reactions"))
    });
    const title = (roomCards[cardId] && roomCards[cardId].title) || "tunecanvas-card";
    const link = document.createElement("a");
    link.download = `${title.replace(/\s+/g, "-").toLowerCase()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (err) {
    console.error("download failed:", err);
    alert("couldn't save the image, try again");
  }
}

// ── Edit / create modal ──
function openEditModal(cardId) {
  editingCardId = cardId || null;
  const existing = cardId ? roomCards[cardId] : null;

  state = {
    creator: currentUser.displayName || "friend",
    title: existing ? existing.title || "" : "",
    desc: existing ? existing.desc || "" : "",
    mood: existing ? existing.mood || "dreamy" : "dreamy",
    moodEmoji: existing ? existing.moodEmoji || "☁️" : "☁️",
    songs: existing && existing.songs && existing.songs.length ? existing.songs : [{ title: "", artist: "" }]
  };

  inputCreator.value = state.creator;
  inputTitle.value = state.title;
  inputDesc.value = state.desc;
  renderMoodPicker();
  renderSongRows();
  modalOverlay.classList.add("open");
}
newCardBtn.addEventListener("click", () => openEditModal(null));
modalClose.addEventListener("click", () => modalOverlay.classList.remove("open"));
modalOverlay.addEventListener("click", (e) => { if (e.target === modalOverlay) modalOverlay.classList.remove("open"); });

function renderMoodPicker() {
  [...moodPicker.children].forEach(btn => btn.classList.toggle("selected", btn.dataset.mood === state.mood));
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
addSongBtn.addEventListener("click", () => { state.songs.push({ title: "", artist: "" }); renderSongRows(); });
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

function saveCard() {
  if (!currentRoom || !currentUser) return;
  const payload = {
    ownerUid: currentUser.uid,
    creator: state.creator || currentUser.displayName || "friend",
    title: state.title || "untitled playlist",
    desc: state.desc,
    mood: state.mood,
    moodEmoji: state.moodEmoji,
    songs: state.songs.filter(s => s.title),
    updatedAt: Date.now()
  };

  if (editingCardId) {
    db.ref(`rooms/${currentRoom}/cards/${editingCardId}`).update(payload);
  } else {
    payload.createdAt = Date.now();
    db.ref(`rooms/${currentRoom}/cards`).push(payload);
  }
}
cardForm.addEventListener("submit", (e) => {
  e.preventDefault();
  saveCard();
  modalOverlay.classList.remove("open");
});

// ── Rooms ──
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
showJoinBtn.addEventListener("click", () => joinForm.classList.toggle("open"));
joinRoomBtn.addEventListener("click", () => {
  const code = joinCodeInput.value.trim().toUpperCase();
  if (!code) return;
  db.ref(`rooms/${code}`).once("value").then((snapshot) => {
    if (snapshot.exists()) enterRoom(code);
    else alert("Room not found — double check the code and try again.");
  });
});
copyCodeBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(roomCodeDisplay.textContent).then(() => {
    copyCodeBtn.textContent = "✓";
    setTimeout(() => (copyCodeBtn.textContent = "copy"), 1500);
  });
});