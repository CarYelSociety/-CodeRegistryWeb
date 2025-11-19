const DB_NAME = "codeDB", STORE = "codes"; let db;
async function openDB() {
  return new Promise((res, rej) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onerror = () => rej(req.error);
    req.onsuccess = () => { db = req.result; res(); };
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, {keyPath: "id", autoIncrement: true});
    };
  });
}
async function addCode(code) { const tx = db.transaction(STORE, "readwrite"); tx.objectStore(STORE).add(code); return tx.complete; }
async function getAllCodes() { const tx = db.transaction(STORE); return tx.objectStore(STORE).getAll(); }
async function deleteCode(id) { const tx = db.transaction(STORE, "readwrite"); tx.objectStore(STORE).delete(id); return tx.complete; }

const form = document.getElementById("form"), list = document.getElementById("list");
function render() {
  getAllCodes().then(codes => {
    list.innerHTML = "";
    codes.reverse().forEach(c => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${c.platform}</strong> – ${c.code}<br>
        <small>Canjeado: ${c.redeemDate}</small>
        <button style="float:right;background:#d32f2f;color:#fff;border:none;padding:.3rem .6rem;border-radius:3px;">×</button>
      `;
      li.querySelector("button").onclick = () => deleteCode(c.id).then(render);
      list.appendChild(li);
    });
  });
}
form.addEventListener("submit", e => {
  e.preventDefault();
  addCode({platform: form.platform.value.trim(), code: form.code.value.trim(), redeemDate: form.date.value}).then(() => {
    form.reset(); render();
  });
});
openDB().then(render);
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");
