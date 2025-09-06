<?php
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\TransfertController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\VisiteurController;
use App\Http\Controllers\ClubController;
use App\Http\Controllers\VenteController;
use App\Http\Controllers\ProduitController;


Route::get('/clubs', [ClubController::class, 'index'])->name('clubs.index');

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::post('/visiteurs/{cin}/convert', [VisiteurController::class, 'convertToClient']);


Route::prefix('visiteurs')->group(function () {
    Route::get('/', [VisiteurController::class, 'index'])->name('visiteurs.index');
    Route::post('/', [VisiteurController::class, 'store'])->name('visiteurs.store');
    Route::patch('/{cin}/status', [VisiteurController::class, 'updateStatus'])->name('visiteurs.updateStatus');

});

// Routes pour les clients
Route::prefix('clients')->group(function () {
    Route::get('/', [ClientController::class, 'index'])->name('clients.index');
    Route::get('/stats', [ClientController::class, 'stats']);
    Route::get('/search', [ClientController::class, 'search']);
    Route::get('/{id}', [ClientController::class, 'show']);
    Route::post('/', [ClientController::class, 'store']);
    Route::put('/{id}', [ClientController::class, 'update']);
    Route::delete('/{id}', [ClientController::class, 'destroy']);
});

// Routes pour les ventes
Route::prefix('ventes')->group(function () {
    Route::get('/', [VenteController::class, 'index']);
    Route::get('/stats', [VenteController::class, 'stats']);
    Route::get('/search', [VenteController::class, 'search']);
    Route::get('/client/{clientId}', [VenteController::class, 'getByClient']);
    Route::get('/{id}', [VenteController::class, 'show']);
    Route::post('/', [VenteController::class, 'store']);
    Route::put('/{id}', [VenteController::class, 'update']);
    Route::delete('/{id}', [VenteController::class, 'destroy']);
});

// Routes pour les produits
Route::prefix('produits')->group(function () {
    Route::get('/', [ProduitController::class, 'index']);
    Route::get('/stats', [ProduitController::class, 'stats']);
    Route::get('/{id}', [ProduitController::class, 'show']);
    Route::post('/', [ProduitController::class, 'store']);
    Route::put('/{id}', [ProduitController::class, 'update']);
    Route::delete('/{id}', [ProduitController::class, 'destroy']);
});

Route::prefix('transferts')->group(function () {
    Route::get('/', [TransfertController::class, 'index']);
    Route::get('/stats', [TransfertController::class, 'stats']);
    Route::get('/search', [TransfertController::class, 'search']);
    Route::get('/client/{clientId}', [TransfertController::class, 'getByClient']);
    Route::get('/{id}', [TransfertController::class, 'show']);
    Route::post('/', [TransfertController::class, 'store']);
    Route::put('/{id}', [TransfertController::class, 'update']);
    Route::delete('/{id}', [TransfertController::class, 'destroy']);
    Route::post('/{id}/validate', [TransfertController::class, 'validateTransfert']);
    Route::post('/{id}/cancel', [TransfertController::class, 'cancelTransfert']);
});

// Routes pour les clubs
Route::prefix('clubs')->group(function () {
    Route::get('/', [ClubController::class, 'index']);
    Route::get('/stats', [ClubController::class, 'stats']);
    Route::get('/search', [ClubController::class, 'search']);
    Route::get('/check-name', [ClubController::class, 'checkName']);
    Route::get('/{id}', [ClubController::class, 'show']);
    Route::post('/', [ClubController::class, 'store']);
    Route::put('/{id}', [ClubController::class, 'update']);
    Route::delete('/{id}', [ClubController::class, 'destroy']);
});

Route::prefix('ribs')->group(function () {
    Route::get('/', [\App\Http\Controllers\RibController::class, 'index']);
    Route::get('/{id}', [\App\Http\Controllers\RibController::class, 'show']);
    Route::post('/', [\App\Http\Controllers\RibController::class, 'store']);
    Route::put('/{id}', [\App\Http\Controllers\RibController::class, 'update']);
    Route::delete('/{id}', [\App\Http\Controllers\RibController::class, 'destroy']);
});
