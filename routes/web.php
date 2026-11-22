<?php

use App\Http\Controllers\Admin\Dashboard\DashboardController;
use App\Http\Controllers\Admin\Provider\ProviderController;
// use App\Http\Controllers\Provider\ProviderTypeController;
use App\Http\Controllers\Admin\User\UserController;
use App\Http\Controllers\Provider\DashboardController as ProviderDashboardController;
use App\Http\Controllers\Provider\ProviderDirectoryController;
use App\Http\Controllers\Web\JoinController;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\Web\JoinTheCircleController as AdminJoinTheCircleController;
use App\Http\Controllers\Web\JoinTheCircleController;
use App\Http\Controllers\Web\ConnectController;
use App\Http\Controllers\Web\FindSupportController;
use App\Http\Controllers\Web\BlogController;
use App\Http\Controllers\Admin\Web\BlogPostController as AdminBlogPostController;
use App\Http\Middleware\EnsureUserIsAdmin;
use App\Http\Controllers\Admin\Web\ProviderDirectoryPageController;
use App\Http\Controllers\Admin\Web\ProviderProfilePageController;
use App\Http\Controllers\Admin\Dashboard\AdminDashboardController;
use Inertia\Inertia;


Route::get('/execute-command', function () {
    //    return redirect()->route('login');
    Artisan::call('storage:link');
    Artisan::call('migrate:fresh --seed');
    Artisan::call('cache:clear');
    Artisan::call('view:clear');
    Artisan::call('route:clear');
    Artisan::call('optimize');
    dd('All commands executed successfully');

    //deploy command
    ///opt/alt/php84/usr/bin/php artisan migrate:fresh --seed -vvv

});
/*
|--------------------------------------------------------------------------
| Bahali Connect — public website (Marsha's handoff, 18 November 2026)
|--------------------------------------------------------------------------
| The homepage is now the visitor homepage; provider recruitment moved to /for-providers.
| Search preferences are POSTed and kept in the session (no health topics in page addresses).
*/
Route::get('/', [FindSupportController::class, 'home'])->name('home');
Route::get('/get-help', [FindSupportController::class, 'getHelp'])->name('connect.help');
Route::get('/find-support', [FindSupportController::class, 'index'])->name('connect.results');
Route::post('/find-support', [FindSupportController::class, 'search'])->middleware('throttle:60,1')->name('connect.search');
Route::post('/find-support/refine', [FindSupportController::class, 'refine'])->middleware('throttle:120,1')->name('connect.refine');
Route::get('/provider-profile/{id}', [FindSupportController::class, 'profile'])->whereNumber('id')->name('connect.profile');

Route::get('/about', [ConnectController::class, 'about'])->name('connect.about');
Route::get('/how-it-works', [ConnectController::class, 'howItWorks'])->name('connect.how');
Route::get('/for-providers', [ConnectController::class, 'forProviders'])->name('connect.providers');
Route::get('/urgent-help', [ConnectController::class, 'urgentHelp'])->name('connect.urgent');
Route::get('/provider-spotlight-policy', [ConnectController::class, 'spotlight'])->name('connect.spotlight');
Route::get('/privacy', [ConnectController::class, 'policy'])->defaults('kind', 'privacy')->name('landing.privacy');
Route::get('/terms', [ConnectController::class, 'policy'])->defaults('kind', 'terms')->name('connect.terms');
Route::get('/directory-verification', [ConnectController::class, 'policy'])->defaults('kind', 'directory')->name('connect.directory');
Route::get('/accessibility', [ConnectController::class, 'policy'])->defaults('kind', 'accessibility')->name('connect.accessibility');
Route::get('/contact', [ConnectController::class, 'contact'])->name('connect.contact');
Route::post('/contact', [ConnectController::class, 'submit'])->middleware('throttle:5,1')->name('connect.contact.send');
Route::get('/report-a-concern', [ConnectController::class, 'report'])->name('connect.report');
Route::post('/report-a-concern', [ConnectController::class, 'submit'])->middleware('throttle:5,1')->name('connect.report.send');
Route::get('/blog', [BlogController::class, 'index'])->name('connect.blog.index');
Route::get('/blog/{slug}', [BlogController::class, 'show'])->where('slug', '[a-z0-9-]+')->name('connect.blog.show');

// Earlier addresses → their Bahali Connect pages (301, keeps old links and search results working).
Route::permanentRedirect('/join', '/for-providers')->name('providers.join');
Route::permanentRedirect('/join-the-circle', '/for-providers')->name('join-the-circle');
Route::permanentRedirect('/disclaimer', '/directory-verification')->name('landing.disclaimer');
Route::permanentRedirect('/urgent-support', '/urgent-help')->name('landing.urgent-support');
Route::permanentRedirect('/provider/login', '/login');
Route::permanentRedirect('/provider/signup', '/provider/directory/create');
//->prefix('admin')->as('admin.')
Route::get('/provider/directory/create', [ProviderDirectoryController::class, 'create'])
    ->name('providers.create');

Route::post('/provider/directory/register-account', [ProviderDirectoryController::class, 'registerAccount'])
    ->name('providers.register-account');

Route::post('/provider/directory/verify-otp', [ProviderDirectoryController::class, 'verifyOtp'])
    ->name('providers.verify-otp');

Route::post('/provider/directory/resend-otp', [ProviderDirectoryController::class, 'resendOtp'])
    ->name('providers.resend-otp');

Route::post('/provider/directory/store', [ProviderDirectoryController::class, 'store'])
    ->name('providers.store');

//Public provider directory
// Old public directory addresses now open Bahali Connect (Find support / provider profile).
Route::get('/provider', fn () => redirect('/find-support?browse=1', 301))->name('provider.index');
Route::get('/provider/{id}', fn (int $id) => redirect("/provider-profile/{$id}", 301))->whereNumber('id')->name('provider.show');

Route::middleware(['auth'])->prefix('provider')->group(function () {
    Route::get('/profile/edit', [ProviderDirectoryController::class, 'edit'])->name('provider.profile.edit');
    Route::post('/profile/update', [ProviderDirectoryController::class, 'updateProvider'])->name('provider.profile.update');

    // Availability — provider sets/reconfirms "accepting new clients" (guide §5).
    Route::post('/availability', [ProviderDirectoryController::class, 'updateAvailability'])->name('provider.availability.update');

    Route::get('/dashboard', [ProviderDashboardController::class, 'index'])->name('provider.dashboard');
});



Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {

    Route::get('/under-development', function (\Illuminate\Http\Request $request) {
        return Inertia::render('shared/underDevelopment', [
            'module' => $request->get('module'),
        ]);
    })->name('under-development');

    Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
    Route::post('dashboard/availability-reminders', [AdminDashboardController::class, 'sendAvailabilityReminders'])
        ->name('admin.dashboard.availability-reminders');
    // Route::resource('users', UserController::class);


    // Pending Provider
    Route::get('/pending/providers', [ProviderDirectoryController::class, 'pendingProvider'])
        ->name('providers.pending');

    // Approved Provider
    Route::get('/approved/providers', [ProviderDirectoryController::class, 'approvedProvider'])
        ->name('providers.approved');

    // Rejected Provider
    Route::get('/rejected/providers', [ProviderDirectoryController::class, 'rejectedProvider'])
        ->name('providers.rejected');

    // Suspended Provider
    Route::get('/suspended/providers', [ProviderDirectoryController::class, 'suspendedProvider'])
        ->name('providers.suspended');

    Route::get('/inactive/providers', [ProviderDirectoryController::class, 'inactiveProvider'])
        ->name('providers.inactive');


    // Pending Provider Show (Single Provider Details)
    Route::get('/providers/verification/show/{id}', [ProviderDirectoryController::class, 'show'])
        ->name('providers.verification.show');

    // Pending Provider Show (Single Provider Details)
    Route::Post('/providers/verification/update/{id}', [ProviderDirectoryController::class, 'update'])
        ->name('providers.verification.update');




    // Route::resource('provider-type', ProviderTypeController::class);
    // Route::resource('providers', ProviderController::class);
    Route::post('change/status/provider/{selectedRow}', [ProviderController::class, 'changeStatus']);

    Route::get('/web/join-the-circle', [AdminJoinTheCircleController::class, 'index'])->name('join-the-circle.index');
    Route::post('/web/join-the-circle', [AdminJoinTheCircleController::class, 'update'])->name('join-the-circle.update');

    Route::get('/web/provider-directory', [ProviderDirectoryPageController::class, 'index'])->name('provider-directory-page.index');
    Route::post('/web/provider-directory', [ProviderDirectoryPageController::class, 'update'])->name('provider-directory-page.update');

    Route::get('/web/provider-profile', [ProviderProfilePageController::class, 'index'])->name('provider-profile-page.index');
    Route::post('/web/provider-profile', [ProviderProfilePageController::class, 'update'])->name('provider-profile-page.update');
});


/*
| Bahali Connect blog CMS — administrators only (provider accounts get 403).
*/
Route::middleware(['auth', 'verified', EnsureUserIsAdmin::class])->prefix('admin/blog')->name('admin.blog.')->group(function () {
    Route::get('/', [AdminBlogPostController::class, 'index'])->name('index');
    Route::get('/create', [AdminBlogPostController::class, 'create'])->name('create');
    Route::post('/', [AdminBlogPostController::class, 'store'])->name('store');
    Route::post('/preview', [AdminBlogPostController::class, 'preview'])->name('preview');
    Route::post('/upload-image', [AdminBlogPostController::class, 'uploadImage'])->name('upload-image');
    Route::get('/{post}/edit', [AdminBlogPostController::class, 'edit'])->whereNumber('post')->name('edit');
    Route::put('/{post}', [AdminBlogPostController::class, 'update'])->whereNumber('post')->name('update');
    Route::delete('/{post}', [AdminBlogPostController::class, 'destroy'])->whereNumber('post')->name('destroy');
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
