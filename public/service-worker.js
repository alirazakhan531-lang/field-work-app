const CACHE_NAME = "field-work-cache-v7";
const OFFLINE_URL = "/offline";

/* -------------------------
   1. STATIC FILES TO CACHE
---------------------------- */
const STATIC_ASSETS = [
  OFFLINE_URL,
  "/pwa",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/js/task-form.js",
  "/js/db.js",
  "/css/app.css",
];

/* -------------------------
   2. INSTALL — PRECACHE
---------------------------- */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const url of STATIC_ASSETS) {
        try {
          await cache.add(url);
        } catch (e) {
          console.warn("Cache failed:", url, e);
        }
      }
    })
  );
  self.skipWaiting();
});

/* -------------------------
   3. ACTIVATE — CLEAN OLD CACHE
---------------------------- */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null))
      )
    )
  );
  self.clients.claim();
});

/* ------------------------------------------
   4. FETCH — MAIN LOGIC (includes /pwa fix)
--------------------------------------------- */
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Ignore non-GET
  if (req.method !== "GET") return;

  // Don't cache favicon
  if (req.url.endsWith("favicon.ico")) return;

  /* --------------------------------------
       A) API: field workers (GET)
  ----------------------------------------- */
  if (req.url.includes("/api/field-workers")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          if (cached) return cached;

          return new Response(JSON.stringify([]), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        })
    );
    return;
  }

  /* --------------------------------------
       B) HANDLE ALL NAVIGATION REQUESTS
         (HTML pages including /pwa)
  ----------------------------------------- */
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          return await fetch(req); // normal online fetch
        } catch (e) {
          // Offline fallback
          const cachedPage = await caches.match(req.url);
          if (cachedPage) return cachedPage;

          // Important: keep /pwa working offline
          if (req.url.includes("/pwa")) {
            return caches.match("/pwa");
          }

          return caches.match(OFFLINE_URL);
        }
      })()
    );
    return;
  }

  /* --------------------------------------
       C) STATIC FILES (JS, CSS, images)
  ----------------------------------------- */
  event.respondWith(
    (async () => {
      try {
        const fresh = await fetch(req);
        const clone = fresh.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        return fresh;
      } catch {
        const cached = await caches.match(req);
        return cached || new Response("", { status: 200 });
      }
    })()
  );
});

/* --------------------------------------
   5. BACKGROUND SYNC: sync offline tasks
----------------------------------------- */
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-tasks") {
    event.waitUntil(syncPendingTasks());
  }
});

/* --------------------------------------
   6. IndexedDB Helper
----------------------------------------- */
async function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("fieldWorkDB", 1);

    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("pendingTasks")) {
        db.createObjectStore("pendingTasks", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/* --------------------------------------
   7. Background Sync Logic
----------------------------------------- */
async function syncPendingTasks() {
  const db = await openDB();
  const tx = db.transaction("pendingTasks", "readonly");
  const store = tx.objectStore("pendingTasks");
  const req = store.getAll();

  return new Promise((resolve) => {
    req.onsuccess = async () => {
      const tasks = req.result || [];

      for (const task of tasks) {
        try {
          const res = await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task),
          });

          if (!res.ok) return resolve(false);
        } catch (err) {
          return resolve(false);
        }
      }

      // Clear DB only after full success
      const clearTx = db.transaction("pendingTasks", "readwrite");
      clearTx.objectStore("pendingTasks").clear();

      clearTx.oncomplete = () => resolve(true);
    };

    req.onerror = () => resolve(false);
  });
}
