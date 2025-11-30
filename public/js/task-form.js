import { savePendingTask, syncPendingTasks } from "./db.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("taskForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));

    // ensure created_at or any server-required fields exist if needed
    data.created_at = new Date().toISOString();

    if (navigator.onLine) {
      try {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Server error");
        alert("✅ Task saved online!");
      } catch (err) {
        console.warn("Online save failed, saving locally:", err);
        await savePendingTask(data);
        alert("⚠️ Saved locally (will sync).");
      }
    } else {
      await savePendingTask(data);
      alert("📦 Offline: task saved locally (will sync when online).");
    }

    form.reset();
  });
});

// When back online, prefer background sync; fallback to manual sync
window.addEventListener("online", async () => {
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    try {
      const reg = await navigator.serviceWorker.ready;
      await reg.sync.register("sync-tasks");
      console.log("Background sync registered");
    } catch (err) {
      console.warn("Background sync registration failed, falling back:", err);
      await syncPendingTasks();
    }
  } else {
    await syncPendingTasks();
  }
});
