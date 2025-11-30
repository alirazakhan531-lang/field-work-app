<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Field Workers PWA</title>
  <link rel="manifest" href="/manifest.json">
  <link rel="icon" href="/icons/icon-192.png" type="image/png">
  <link rel="apple-touch-icon" href="/icons/icon-512.png">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="//unpkg.com/alpinejs" defer></script>
</head>
<body class="bg-gray-100 min-h-screen flex flex-col">
  <header class="bg-blue-600 text-white p-4 shadow-md">
    <h1 class="text-xl font-bold">📋 Field Workers & Tasks</h1>
    <p class="text-sm text-blue-100">Works offline too</p>
  </header>

  <main class="flex-1 p-6">
    <div class="bg-white p-4 rounded shadow mb-6">
      <h2 class="text-lg font-semibold mb-2">👷 Field Workers</h2>
      <ul>
        @forelse($workers as $worker)
          <li class="border-b py-1">{{ $worker->name }} ({{ $worker->email }})</li>
        @empty
          <li class="text-gray-500">No workers found</li>
        @endforelse
      </ul>
    </div>

    <div class="bg-white p-4 rounded shadow mb-6">
      <h2 class="text-lg font-semibold mb-2">📝 Add Task</h2>

      <form id="taskForm" class="flex flex-col md:flex-row gap-2 mb-4">
        @csrf
        <input type="text" name="title" placeholder="Task title" class="border p-2 rounded flex-1" required>
        <select name="field_worker_id" class="border p-2 rounded" required>
          <option value="">Select Worker</option>
          @foreach($workers as $worker)
            <option value="{{ $worker->id }}">{{ $worker->name }}</option>
          @endforeach
        </select>
        <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Add Task</button>
      </form>

      <ul>
        @forelse($tasks as $task)
          <li class="border-b py-1 flex justify-between items-center">
            <span>{{ $task->title }} - <i class="text-gray-500">{{ $task->fieldWorker->name ?? 'Unassigned' }}</i></span>
            <form action="/api/tasks/{{ $task->id }}" method="POST" onsubmit="return confirm('Delete this task?')">
              @csrf @method('DELETE')
              <button class="text-red-500 hover:underline">Delete</button>
            </form>
          </li>
        @empty
          <li class="text-gray-500">No tasks yet</li>
        @endforelse
      </ul>
    </div>
  </main>

  <footer class="bg-gray-200 text-center text-sm text-gray-600 p-3">PWA Demo • Offline Ready • {{ now()->format('Y') }}</footer>

  <script type="module" src="/js/task-form.js"></script>
  <script src="/js/sw-register.js"></script>
</body>
</html>
