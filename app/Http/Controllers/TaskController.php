<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Task::with('fieldWorker')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return Task::create($request->all());
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $task = Task::with('fieldWorker')->findOrFail($id);
        return $task;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $task = Task::findOrFail($id);
        $task->update($request->all());
        return $task;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $task = Task::findOrFail($id);
        $task->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

    public function bulkSync(Request $request)
    {
        $tasks = $request->input('tasks', []);
        foreach ($tasks as $t) {
            Task::create($t);
        }
        return response()->json(['synced' => count($tasks)]);
    }
}
