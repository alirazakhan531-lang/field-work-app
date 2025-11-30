// public/js/db.js
export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("fieldWorkDB", 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("pendingTasks")) {
        db.createObjectStore("pendingTasks", { keyPath: "id", autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function savePendingTask(task) {
  const db = await openDB();
  const tx = db.transaction("pendingTasks", "readwrite");
  tx.objectStore("pendingTasks").add(task);
  return new Promise((res, rej) => {
    tx.oncomplete = () => res(true);
    tx.onerror = () => rej(tx.error);
  });
}

export async function getPendingTasks() {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction("pendingTasks", "readonly");
    const req = tx.objectStore("pendingTasks").getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => resolve([]);
  });
}

export async function clearPendingTasks() {
  const db = await openDB();
  const tx = db.transaction("pendingTasks", "readwrite");
  tx.objectStore("pendingTasks").clear();
  return new Promise((res, rej) => {
    tx.oncomplete = () => res(true);
    tx.onerror = () => rej(tx.error);
  });
}

export async function syncPendingTasks() {
  const tasks = await getPendingTasks();
  if (!tasks.length) return;

  for (const task of tasks) {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      if (!res.ok) throw new Error("Server rejected");
    } catch (err) {
      console.warn("Manual sync failed, will retry later:", err);
      return;
    }
  }

  await clearPendingTasks();
  console.log("All pending tasks synced");
}
