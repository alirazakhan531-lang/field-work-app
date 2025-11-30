<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PwaController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/pwa', [PwaController::class, 'index'])->name('pwa.index');
Route::get('/offline', function () {
    return view('offline');
})->name('offline');
