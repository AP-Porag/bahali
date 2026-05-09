<?php

use App\Http\Controllers\Admin\Provider\ProviderController as ProviderProviderController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\Provider\ProviderController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application.
| These routes are loaded by the RouteServiceProvider and assigned
| to the "api" middleware group.
|
*/

Route::get('providers', [ProviderController::class, 'getProvidersForApi']);
