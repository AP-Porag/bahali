<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Services\Provider\ProviderService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Provider portal home (Module 1) — authenticated provider only.
     */
    public function index(Request $request, ProviderService $service): Response
    {

        $provider = $request->user()?->provider;

        abort_if(! $provider, 404, 'No provider profile found for this account.');

        return Inertia::render('provider/dashboard/index', $service->getDashboardData($provider));
    }
}
