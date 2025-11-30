<?php

namespace App\Http\Controllers;

use App\Models\FieldWorker;
use App\Models\Task;

class PwaController extends Controller
{
    public function index()
    {
        $workers = FieldWorker::all();
        $tasks = Task::with('fieldWorker')->latest()->get();

        return view('pwa.index', compact('workers', 'tasks'));
    }
}
