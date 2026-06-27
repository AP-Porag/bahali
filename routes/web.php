<?php

use App\Http\Controllers\Admin\Dashboard\DashboardController;
use App\Http\Controllers\Admin\Provider\ProviderController;
// use App\Http\Controllers\Provider\ProviderTypeController;
use App\Http\Controllers\Admin\User\UserController;
use App\Http\Controllers\Provider\ProviderDirectoryController;
use App\Http\Controllers\Web\JoinController;
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

Route::get('/join', [JoinController::class, 'index'])->name('providers.join');
//->prefix('admin')->as('admin.')
Route::get('/provider/directory/create', [ProviderDirectoryController::class, 'create'])
    ->name('providers.create');

Route::post('/provider/directory/store', [ProviderDirectoryController::class, 'store'])
    ->name('providers.store');
Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {

    Route::get('/under-development', function (\Illuminate\Http\Request $request) {
        return Inertia::render('shared/underDevelopment', [
            'module' => $request->get('module'),
        ]);
    })->name('under-development');

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // Route::resource('users', UserController::class);


    // Pending Provider
    Route::get('/pending/providers', [ProviderDirectoryController::class, 'pendingProvider'])
        ->name('providers.pending');


    // Pending Provider Show (Single Provider Details)
    Route::get('/providers/verification/show/{id}', [ProviderDirectoryController::class, 'show'])
        ->name('providers.verification.show');



    // Route::resource('provider-type', ProviderTypeController::class);
    // Route::resource('providers', ProviderController::class);
    Route::post('change/status/provider/{selectedRow}', [ProviderController::class, 'changeStatus']);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
