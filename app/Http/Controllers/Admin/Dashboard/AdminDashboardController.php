<?php

namespace App\Http\Controllers\Admin\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\Admin\Dashboard\AdminDashboardService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Admin "Provider Directory Dashboard".
 */
class AdminDashboardController extends Controller
{
    public function index(Request $request, AdminDashboardService $dashboard): Response
    {
        return Inertia::render('admin/dashboard/index', $dashboard->data((int) $request->input('range', 90)));
    }

    /**
     * "Send reminder" on Action Required → runs the same availability reminder as the daily
     * schedule right now (each provider still gets at most one email per 60-day cycle).
     */
    public function sendAvailabilityReminders(): RedirectResponse
    {
        try {
            Artisan::call('providers:availability-reminders');
            preg_match('/(\d+)/', Artisan::output(), $m);
            $sent = (int) ($m[1] ?? 0);

            return back()->with('success', $sent > 0
                ? "Availability reminder sent to {$sent} " . ($sent === 1 ? 'provider.' : 'providers.')
                : 'No new reminders to send — everyone due has already been reminded this cycle.');
        } catch (\Throwable $e) {
            Log::error('[dashboard] Availability reminders failed', ['error' => $e->getMessage()]);

            return back()->with('error', 'Reminders could not be sent. Please check the mail settings.');
        }
    }
}
