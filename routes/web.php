<?php

use App\Http\Controllers\Admin\Dashboard\DashboardController;
use App\Http\Controllers\Admin\Provider\ProviderController;
use App\Http\Controllers\Admin\ProviderType\ProviderTypeController;
use App\Http\Controllers\Admin\User\UserController;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/execute-command', function () {
    //    return redirect()->route('login');
    //    Artisan::call('storage:link');
    Artisan::call('migrate:fresh --seed');
    Artisan::call('cache:clear');
    Artisan::call('view:clear');
    Artisan::call('route:clear');
    Artisan::call('optimize');
    dd('All commands executed successfully');

    //deploy command
    ///opt/alt/php84/usr/bin/php artisan migrate:fresh --seed -vvv

});
Route::get('/', function () {
    return redirect()->route('login');
    //    return Inertia::render('welcome');
})->name('home');
//->prefix('admin')->as('admin.')
Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {

    // Route::get('/under-development', function (\Illuminate\Http\Request $request) {
    //     return Inertia::render('shared/underDevelopment', [
    //         'module' => $request->get('module'),
    //     ]);
    // })->name('under-development');

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // Route::resource('users', UserController::class);

    Route::resource('provider-type', ProviderTypeController::class);
    Route::resource('providers', ProviderController::class);

    Route::post('verify/provider/{provider}', [ProviderController::class, 'verify']);
    Route::post('provisional/provider/{provider}', [ProviderController::class, 'provisional']);

    Route::post('suspend/provider/{provider}', [ProviderController::class, 'suspend']);

    Route::post('expire/provider/{provider}', [ProviderController::class, 'expire']);
    Route::post('publish/provider/{provider}', [ProviderController::class, 'publish']);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
