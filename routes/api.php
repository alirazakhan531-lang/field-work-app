<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FieldWorkerController;
use App\Http\Controllers\TaskController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/field-workers', [FieldWorkerController::class, 'index']);
Route::apiResource('tasks', TaskController::class)->only(['index','store','show','update','destroy']);
// Route::post('/tasks/bulk-sync', [TaskController::class, 'bulkSync']);