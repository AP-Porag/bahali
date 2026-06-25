<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\Provider;
use Inertia\Inertia;

class JoinController extends Controller
{
    /**
     * Render the public "Join the Circle" provider acquisition landing page.
     *
     * Route (suggested):
     *   Route::get('/join', [JoinController::class, 'index'])->name('providers.join');
     *
     * The three counters are optional — they make the reassurance band feel
     * alive with real data. If you'd rather hard-code them, delete this method's
     * body and just `return Inertia::render('provider/JoinTheCircle');`.
     */
    public function index()
    {
        // Region/territory count — distinct countries available in the directory.
        $regionCount = Country::query()->count();

        // Languages families can filter by. If you store these in a table, count
        // that instead. For now this mirrors the 8 options in the registration form.
        $languageCount = 8;

        // Verified, publicly-listed providers. Adjust the scope to match your schema
        // (e.g. ->where('status', 'approved')). Falls back to 0 gracefully.
        $providerCount = Provider::query()
            ->when(
                \Schema::hasColumn('providers', 'status'),
                fn($q) => $q->where('status', 'approved')
            )
            ->count();

        return Inertia::render('provider/JoinTheCircle', [
            'regionCount'   => $regionCount > 0 ? $regionCount : 28,
            'languageCount' => $languageCount,
            'providerCount' => $providerCount,
        ]);
    }
}
