<?php

namespace App\Http\Middleware;

use App\Models\Provider;
use App\Services\Provider\ProviderService;
use App\Utils\GlobalConstant;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return array_merge(parent::share($request), [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'app_url' => config('app.url'),
            // Sidebar badges — only on admin pages for a logged-in user.
            // "Pending" matches the Pending Providers page (Submitted + Needs correction + Pending verification).
            'providerCounts' => fn() => $request->user() && $request->is('admin/*')
                ? [
                    'approved' => Provider::where('status', GlobalConstant::VERIFICATION_STATUS_APPROVED)->count(),
                    'pending'  => Provider::whereIn('status', ProviderService::IN_REVIEW_STATUSES)->count(),
                    'rejected'  => Provider::where('status', GlobalConstant::VERIFICATION_STATUS_REJECTED)->count(),
                    'suspended' => Provider::where('status', GlobalConstant::VERIFICATION_STATUS_SUSPENDED)->count(),
                    'inactive'  => Provider::where('status', GlobalConstant::VERIFICATION_STATUS_INACTIVE)->count(),
                ]
                : null,
        ]);
    }
}
