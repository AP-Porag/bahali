<?php

namespace App\Services\Admin\Dashboard;

use App\Models\DirectorySearch;
use App\Models\Provider;
use App\Services\Provider\ProviderService;
use App\Utils\GlobalConstant;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Route;

/**
 * Everything the admin "Provider Directory Dashboard" shows.
 * All numbers come from the providers table, provider_support_areas and directory_searches.
 */
class AdminDashboardService
{
    /** Period options in the header (days). */
    public const RANGES = [30, 90, 365];

    private const IN_PERSON = ['In-Person', 'Hybrid'];
    private const VIRTUAL   = ['Virtual', 'Telehealth'];

    /** Availability counts as current for 60 days (same as the public listing). */
    private const AVAILABILITY_FRESH_DAYS = 60;

    /** A search location / area with this many matching providers or fewer is a coverage gap. */
    private const LIMITED_COVERAGE = 2;

    public function __construct(private ProviderService $providerService) {}

    public function data(int $days): array
    {
        $days      = in_array($days, self::RANGES, true) ? $days : 90;
        $now       = now();
        $start     = $now->copy()->subDays($days);
        $prevStart = $start->copy()->subDays($days);

        // Published (approved) providers with what the dashboard needs.
        $published = Provider::with('supportAreas')
            ->where('status', GlobalConstant::VERIFICATION_STATUS_APPROVED)
            ->get();

        $actions  = $this->actionRequired($published, $now);
        $searches = $this->searchStats($start, $prevStart, $now);

        $verifiedNow = $published->filter(fn($p) => $p->provider_type === 'individual' && $p->licence_verified)->count();
        $verifiedThen = $published->filter(fn($p) => $p->provider_type === 'individual' && $p->licence_verified
            && $this->publishedAt($p)->lt($start))->count();
        $publishedThen = $published->filter(fn($p) => $this->publishedAt($p)->lt($start))->count();

        $bahaliSide   = collect($actions)->whereIn('key', ['new', 'verification'])->sum('count');
        $providerSide = collect($actions)->whereIn('key', ['corrections', 'reconfirmation'])->sum('count');

        $coverage = $published->map(fn($p) => $this->coverageRow($p))->values();

        return [
            'range'  => $days,
            'ranges' => self::RANGES,
            'kpis'   => [
                'published'   => ['count' => $published->count(), 'change' => $this->change($published->count(), $publishedThen)],
                'pending'     => ['count' => Provider::where('status', GlobalConstant::VERIFICATION_STATUS_PENDING)->count()],
                'action'      => ['count' => $bahaliSide + $providerSide, 'bahali' => $bahaliSide, 'provider' => $providerSide],
                'verified'    => ['count' => $verifiedNow, 'change' => $this->change($verifiedNow, $verifiedThen)],
                'searches'    => ['count' => $searches['total'], 'change' => $this->change($searches['total'], $searches['prevTotal'])],
                'zeroResults' => ['count' => $searches['zero'], 'change' => $this->change($searches['zero'], $searches['prevZero'])],
            ],
            'actions'        => $actions,
            'verification'   => [
                'verified'      => $verifiedNow,
                'pending'       => Provider::where('status', ProviderService::STATUS_PENDING_VERIFICATION)->count(),
                'unverified'    => $published->filter(fn($p) => $p->provider_type === 'individual' && ! $p->licence_verified)->count(),
                'organizations' => $published->filter(fn($p) => $p->provider_type !== 'individual')->count(),
            ],
            'health'         => $this->profileHealth($published, $now),
            'searchDemand'   => $searches['byLocation'],
            'searchOutcomes' => [
                'total'       => $searches['total'],
                'withResults' => $searches['total'] - $searches['zero'],
                'zero'        => $searches['zero'],
                'successRate' => $searches['total'] > 0
                    ? round((($searches['total'] - $searches['zero']) / $searches['total']) * 100, 1)
                    : null,
            ],
            'coverage'       => $coverage,
            'gaps'           => $this->coverageGaps($start, $now, $coverage),
            'activity'       => $this->recentActivity(),
            'links'          => [
                'pending'      => $this->link('providers.pending'),
                'verification' => $this->link('providers.pending', ['status' => ProviderService::STATUS_PENDING_VERIFICATION]),
                'published'    => $this->link('providers.approved'),
                'reminders'    => $this->link('admin.dashboard.availability-reminders'),
            ],
        ];
    }

    /* ------------------------------------------------------------------ */
    /*  Action Required                                                    */
    /* ------------------------------------------------------------------ */
    private function actionRequired(Collection $published, Carbon $now): array
    {
        $queue = function (string $status, string $since) use ($now) {
            $row = Provider::where('status', $status)
                ->selectRaw("COUNT(*) AS total, MIN(COALESCE({$since}, created_at)) AS oldest")
                ->first();
            return [
                'count'      => (int) ($row->total ?? 0),
                'oldestDays' => $row && $row->oldest ? (int) Carbon::parse($row->oldest)->diffInDays($now) : null,
            ];
        };

        // Submitted → waiting since the last submission (an edited profile is re-submitted).
        $new = $queue(GlobalConstant::VERIFICATION_STATUS_PENDING, 'updated_at');
        // Moved to a stage by a reviewer → waiting since that review.
        $verification = $queue(ProviderService::STATUS_PENDING_VERIFICATION, 'reviewed_at');
        $corrections  = $queue(ProviderService::STATUS_NEEDS_CORRECTION, 'reviewed_at');

        // Published profiles whose availability is missing or due (day 53+ of 60).
        $remindAfter = ProviderService::availabilityRemindAfter();
        $due = $published->filter(fn($p) => is_null($p->accepting_new_clients)
            || is_null($p->availability_confirmed_at)
            || $p->availability_confirmed_at->lte($remindAfter));
        $oldestDue = $due->map(fn($p) => ($p->availability_confirmed_at ?? $this->publishedAt($p))->diffInDays($now))->max();

        return [
            [
                'key' => 'new',
                'label' => 'New applications awaiting review',
                'icon' => 'file',
                'count' => $new['count'],
                'oldestDays' => $new['oldestDays'],
                'action' => 'Review',
                'href' => $this->link('providers.pending', ['status' => GlobalConstant::VERIFICATION_STATUS_PENDING]),
            ],
            [
                'key' => 'verification',
                'label' => 'Verification requests in review',
                'icon' => 'shield',
                'count' => $verification['count'],
                'oldestDays' => $verification['oldestDays'],
                'action' => 'Review',
                'href' => $this->link('providers.pending', ['status' => ProviderService::STATUS_PENDING_VERIFICATION]),
            ],
            [
                'key' => 'corrections',
                'label' => 'Profiles need corrections',
                'icon' => 'pencil',
                'count' => $corrections['count'],
                'oldestDays' => $corrections['oldestDays'],
                'action' => 'Follow up',
                'href' => $this->link('providers.pending', ['status' => ProviderService::STATUS_NEEDS_CORRECTION]),
            ],
            [
                'key' => 'reconfirmation',
                'label' => 'Profiles due for reconfirmation',
                'icon' => 'refresh',
                'count' => $due->count(),
                'oldestDays' => $oldestDue !== null ? (int) $oldestDue : null,
                'action' => 'Send reminder',
                'href' => $this->link('admin.dashboard.availability-reminders'),
                'method' => 'post',
            ],
        ];
    }

    /* ------------------------------------------------------------------ */
    /*  Profile Health (published profiles)                                */
    /* ------------------------------------------------------------------ */
    private function profileHealth(Collection $published, Carbon $now): array
    {
        $counts = ['complete' => 0, 'needs_updates' => 0, 'incomplete' => 0, 'overdue' => 0];
        $percentSum = 0;

        foreach ($published as $p) {
            $percent = $this->providerService->profileCompleteness($p)['percent'];
            $percentSum += $percent;

            $availabilityCurrent = ! is_null($p->accepting_new_clients)
                && $p->availability_confirmed_at
                && $p->availability_confirmed_at->gte($now->copy()->subDays(self::AVAILABILITY_FRESH_DAYS));

            if (! $availabilityCurrent) {
                $counts['overdue']++;
            } elseif ($percent >= 100) {
                $counts['complete']++;
            } elseif ($percent < 70) {
                $counts['incomplete']++;
            } else {
                $counts['needs_updates']++;
            }
        }

        $total = $published->count();
        $pct = fn(int $n) => $total ? (int) round($n / $total * 100) : 0;

        return [
            'total'    => $total,
            'average'  => $total ? (int) round($percentSum / $total) : 0,
            'segments' => [
                ['key' => 'complete',      'label' => 'Complete',             'count' => $counts['complete'],      'percent' => $pct($counts['complete'])],
                ['key' => 'needs_updates', 'label' => 'Needs updates',        'count' => $counts['needs_updates'], 'percent' => $pct($counts['needs_updates'])],
                ['key' => 'incomplete',    'label' => 'Incomplete',           'count' => $counts['incomplete'],    'percent' => $pct($counts['incomplete'])],
                ['key' => 'overdue',       'label' => 'Overdue confirmation', 'count' => $counts['overdue'],       'percent' => $pct($counts['overdue'])],
            ],
        ];
    }

    /* ------------------------------------------------------------------ */
    /*  Directory searches                                                 */
    /* ------------------------------------------------------------------ */
    private function searchStats(Carbon $start, Carbon $prevStart, Carbon $now): array
    {
        $period = fn() => DirectorySearch::query()->whereBetween('created_at', [$start, $now]);
        $prev   = fn() => DirectorySearch::query()->where('created_at', '>=', $prevStart)->where('created_at', '<', $start);

        $byLocation = $period()
            ->whereNotNull('location')
            ->selectRaw('location, COUNT(*) AS total')
            ->groupBy('location')
            ->orderByDesc('total')
            ->get();
        $withLocation = (int) $byLocation->sum('total');

        return [
            'total'      => $period()->count(),
            'zero'       => $period()->where('results_count', 0)->count(),
            'prevTotal'  => $prev()->count(),
            'prevZero'   => $prev()->where('results_count', 0)->count(),
            'byLocation' => $byLocation->take(5)->map(fn($r) => [
                'location' => $r->location,
                'count'    => (int) $r->total,
                'percent'  => $withLocation ? (int) round($r->total / $withLocation * 100) : 0,
            ])->values()->all(),
        ];
    }

    /**
     * Locations + areas of support people search for, with few or no published providers.
     */
    private function coverageGaps(Carbon $start, Carbon $now, Collection $coverage): array
    {
        $demand = [];
        DirectorySearch::query()
            ->whereBetween('created_at', [$start, $now])
            ->whereNotNull('location')
            ->whereNotNull('areas')
            ->latest('created_at')
            ->limit(20000)
            ->get(['location', 'areas'])
            ->each(function ($s) use (&$demand) {
                foreach ((array) $s->areas as $area) {
                    $key = $s->location . '|' . $area;
                    $demand[$key] = ($demand[$key] ?? 0) + 1;
                }
            });

        $rows = [];
        foreach ($demand as $key => $searches) {
            [$location, $area] = explode('|', $key, 2);
            $loc = mb_strtolower($location);
            $matching = $coverage->filter(fn($c) => in_array($area, $c['a'], true)
                && in_array($loc, array_map('mb_strtolower', $c['s']), true))->count();

            if ($matching <= self::LIMITED_COVERAGE) {
                $rows[] = [
                    'location'  => $location,
                    'area'      => $area,
                    'searches'  => $searches,
                    'providers' => $matching,
                    'href'      => url('/provider') . '?' . http_build_query(['location' => $location, 'areas' => [$area]]),
                ];
            }
        }

        usort($rows, fn($a, $b) => [$a['providers'], -$a['searches']] <=> [$b['providers'], -$b['searches']]);

        return array_slice($rows, 0, 6);
    }

    /* ------------------------------------------------------------------ */
    /*  Coverage by location (chart is filtered in the browser)            */
    /* ------------------------------------------------------------------ */
    private function coverageRow(Provider $p): array
    {
        $formats = $this->toArray($p->service_formats);
        $extra = collect($this->toArray($p->additional_locations))
            ->pluck('country')->filter()->values()->all();
        $telehealth = $this->toArray($p->telehealth_regions);

        return [
            'b'  => (string) $p->country,                                        // base country
            'e'  => array_values(array_unique($extra)),                           // other in-person locations
            't'  => array_values(array_unique($telehealth)),                      // virtual / telehealth regions
            's'  => array_values(array_unique(array_filter([$p->country, ...$extra, ...$telehealth]))), // everywhere served
            'ip' => (bool) array_intersect($formats, self::IN_PERSON),
            'v'  => (bool) array_intersect($formats, self::VIRTUAL),
            'c'  => $p->supportAreas->pluck('category')->filter()->unique()->values()->all(),
            'a'  => $p->supportAreas->pluck('area')->filter()->unique()->values()->all(),
        ];
    }

    /* ------------------------------------------------------------------ */
    /*  Recent activity (built from review / submission timestamps)        */
    /* ------------------------------------------------------------------ */
    private function recentActivity(): array
    {
        $items = collect();

        Provider::latest('created_at')->limit(8)->get(['id', 'organization_name', 'created_at'])
            ->each(fn($p) => $items->push(['type' => 'application', 'text' => 'New application', 'name' => $p->organization_name, 'at' => $p->created_at]));

        $reviewText = [
            GlobalConstant::VERIFICATION_STATUS_APPROVED  => ['approved', 'Provider approved'],
            ProviderService::STATUS_PENDING_VERIFICATION  => ['verification', 'Moved to verification'],
            ProviderService::STATUS_NEEDS_CORRECTION      => ['correction', 'Returned for correction'],
            GlobalConstant::VERIFICATION_STATUS_REJECTED  => ['rejected', 'Application rejected'],
            GlobalConstant::VERIFICATION_STATUS_SUSPENDED => ['suspended', 'Listing suspended'],
            GlobalConstant::VERIFICATION_STATUS_INACTIVE  => ['suspended', 'Listing set to inactive'],
        ];
        Provider::whereNotNull('reviewed_at')->whereIn('status', array_keys($reviewText))
            ->latest('reviewed_at')->limit(8)->get(['id', 'organization_name', 'status', 'reviewed_at'])
            ->each(fn($p) => $items->push([
                'type' => $reviewText[$p->status][0],
                'text' => $reviewText[$p->status][1],
                'name' => $p->organization_name,
                'at' => $p->reviewed_at,
            ]));

        // Reconfirmations (not the first answer given at registration).
        Provider::whereNotNull('availability_confirmed_at')
            ->whereRaw('availability_confirmed_at > DATE_ADD(created_at, INTERVAL 1 HOUR)')
            ->latest('availability_confirmed_at')->limit(8)->get(['id', 'organization_name', 'availability_confirmed_at'])
            ->each(fn($p) => $items->push([
                'type' => 'reconfirmation',
                'text' => 'Availability confirmed',
                'name' => $p->organization_name,
                'at' => $p->availability_confirmed_at,
            ]));

        return $items->sortByDesc('at')->take(6)->map(fn($i) => [
            'type' => $i['type'],
            'text' => $i['text'],
            'name' => $i['name'] ?: 'Provider',
            'at'   => Carbon::parse($i['at'])->toIso8601String(),
        ])->values()->all();
    }

    /* ------------------------------------------------------------------ */
    /*  Helpers                                                            */
    /* ------------------------------------------------------------------ */
    /** Best guess of when a published profile went live. */
    private function publishedAt(Provider $p): Carbon
    {
        return $p->reviewed_at ?? $p->created_at ?? now();
    }

    /** % change, or null when there is nothing to compare with. */
    private function change(int $now, int $before): ?float
    {
        if ($before <= 0) {
            return null;
        }
        return round((($now - $before) / $before) * 100, 1);
    }

    private function link(string $name, array $params = []): ?string
    {
        return Route::has($name) ? route($name, $params) : null;
    }

    private function toArray($value): array
    {
        if (is_array($value)) {
            return $value;
        }
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            return is_array($decoded) ? $decoded : [];
        }
        return [];
    }
}
