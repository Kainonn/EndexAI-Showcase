<?php

use App\Http\Controllers\OrionChatController;
use App\Http\Controllers\OrionHistoryController;
use App\Http\Controllers\OrionVisualStateController;
use App\Http\Controllers\ProspectoController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('orion', 'orion/chat')->name('orion.page');
    Route::get('prospectos', [ProspectoController::class, 'index'])->name('prospectos.index');
    Route::patch('prospectos/{prospecto}', [ProspectoController::class, 'update'])->name('prospectos.update');
    Route::get('orion/face', fn () => response()->file(base_path('external/Orion/index.html')))->name('orion.face');
    Route::post('orion/chat', OrionChatController::class)->name('orion.chat');

    Route::get('orion/states', [OrionVisualStateController::class, 'index'])->name('orion.states.index');
    Route::post('orion/states', [OrionVisualStateController::class, 'store'])->name('orion.states.store');
    Route::put('orion/states/{orionVisualState}', [OrionVisualStateController::class, 'update'])->name('orion.states.update');
    Route::delete('orion/states/{orionVisualState}', [OrionVisualStateController::class, 'destroy'])->name('orion.states.destroy');

    Route::get('orion/history', [OrionHistoryController::class, 'index'])->name('orion.history.index');
    Route::delete('orion/history', [OrionHistoryController::class, 'destroy'])->name('orion.history.destroy');
});

require __DIR__.'/settings.php';
