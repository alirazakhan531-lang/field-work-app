📦 Offline Task Manager (PWA)

A Progressive Web App (PWA) built with Laravel + Vanilla JavaScript + Service Workers + IndexedDB, allowing field workers to:

✅ Add tasks without internet
✅ Store tasks in IndexedDB
✅ Automatically sync tasks to the server when back online
✅ Use the app offline with a custom offline page
✅ Install the app on mobile/desktop like a native app

This project demonstrates how a backend developer can implement offline-first capabilities using modern web APIs.

🚀 Key Features
1. Offline Form Submission

When the device is offline, the task is saved inside IndexedDB instead of sending it to the API.

When the device becomes online, all pending tasks automatically sync to the server.

2. Background Sync

Uses SyncManager to sync tasks even if the user closes the browser, when internet returns.

3. IndexedDB Local Storage

Stores tasks temporarily when no connection.

4. Service Worker

Caches important assets (HTML, CSS, JS)

Serves offline fallback page

Handles background sync logic

Injects API requests from IndexedDB

5. Fully functional API (Laravel backend)

The backend receives synced tasks at:

POST /api/tasks

🧠 What We Built in This Project

This project is a full offline-capable PWA workflow, including:

🧱 1. IndexedDB (frontend local database)

IndexedDB is used to store tasks locally when offline.

Our functions:

savePendingTask() → store task locally

getPendingTasks() → read all stored tasks

clearPendingTasks() → remove after syncing

IndexedDB allows storing data without internet, similar to a lightweight NoSQL DB inside the browser.

🔧 2. Service Worker

The service worker handles:

✔ Caching assets

(HTML, CSS, JS, offline page)

✔ Network fallback

If a page fails to load → show offline page

✔ Background Sync

When online returns → upload stored tasks to API

This makes the app feel like a real mobile app even without internet.

🔌 3. JavaScript Logic

The frontend JS handles:

Detecting online/offline

Submitting form either:

Online → send to API

Offline → save to IndexedDB

Registering background sync

🖥️ 4. Laravel Backend

The backend provides:

✔ /api/tasks endpoint

Accepts tasks posted by both:

Online mode

Automatic sync mode

✔ Controller

Stores data into DB normally.

This proves how backend developers can support PWA offline features with minimal changes.

📂 Project Structure
/public
    /js
        task-form.js
        db.js
    sw.js
    offline.html
/resources/views/pwa/index.blade.php
/routes/api.php
/app/Http/Controllers/TaskController.php

▶️ How to Run the Project
1. Install dependencies
composer install
npm install

2. Build frontend (if needed)
npm run dev

3. Start Laravel server
php artisan serve

4. Visit the PWA
http://localhost:8000/pwa

5. Install the app (Add to Home Screen)
🧪 How to Test Offline Features
✔ Step 1 — Go Online → Add Task

Task will be added normally.

✔ Step 2 — Turn off WiFi

Browser → Dev Tools → Network → Offline
Add another task → It will store in IndexedDB.

✔ Step 3 — Turn WiFi ON

The service worker auto-syncs tasks with the server.

🔮 Future Improvements (Advanced Version)

These are planned improvements:

⭐ 1. Offline Task Listing

Show all saved tasks even while offline.

⭐ 2. Two-way Sync

If backend updates tasks → sync back to PWA.

⭐ 3. Push Notifications

Notify user when background sync completes.

⭐ 4. Background Sync for Images/files

Upload photos taken by field workers even when offline.

⭐ 5. User Authentication in Offline Mode

JWT token caching + silent refresh.

⭐ 6. UI Framework Integration

React / Vue / Inertia.js version of PWA.

⭐ 7. Error Monitoring

Log failures in sync queue.

🤝 Contributing

Pull requests are welcome!
Fork → Update → Submit PR.

📜 License

MIT License