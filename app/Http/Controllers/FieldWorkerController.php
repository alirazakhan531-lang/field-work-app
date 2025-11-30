<?php

namespace App\Http\Controllers;

use App\Models\FieldWorker;
use Illuminate\Http\Request;

class FieldWorkerController extends Controller
{
    public function index()
    {
        return FieldWorker::all();
    }

    public function store(Request $request)
    {
        return FieldWorker::create($request->all());
    }

    public function show(string $id)
    {
        return FieldWorker::findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $worker = FieldWorker::findOrFail($id);
        $worker->update($request->all());
        return $worker;
    }

    public function destroy(string $id)
    {
        $worker = FieldWorker::findOrFail($id);
        $worker->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
