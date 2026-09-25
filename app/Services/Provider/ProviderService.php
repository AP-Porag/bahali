<?php

namespace App\Services\Provider;

use App\Models\Provider;
use App\Services\BaseService;
use App\Utils\GlobalConstant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use App\Models\Country;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use App\Models\Language;

class ProviderService extends BaseService
{
    public function __construct()
    {
        parent::__construct(new Provider());
    }

    /* =====================================================================
     |  Grouped payment mapping (client: Insurance / Self-pay / Sliding /
     |  Free or low-cost) -> underlying payment_methods values.
     * ===================================================================== */
    private const PAYMENT_GROUPS = [
        'insurance'      => ['Insurance Accepted', 'Medicaid', 'Medicare', 'Employee Assistance Programs (EAP)'],
        'self_pay'       => ['Self-Pay'],
        'sliding_scale'  => ['Sliding Scale'],
        'free_low_cost'  => ['No-Cost Services', 'Pro Bono / Volunteer Services', 'Donation-Based', 'Government-Funded', 'Grant-Funded', 'Sliding Scale'],
    ];

    /** Availability freshness window (guide §5.3). */
    private const AVAILABILITY_FRESH_DAYS = 60;

    /* =====================================================================
     |  PUBLIC API
     * ===================================================================== */

    public function getPublicDirectory(array $filters): array
    {
        $perPage = max(3, min((int) ($filters['perPage'] ?? 6), 48));
        $page    = max(1, (int) ($filters['page'] ?? 1));
        $keyword = trim((string) ($filters['keyword'] ?? ''));
        $seed    = (int) ($filters['seed'] ?? $this->defaultSeed());

        $query = $this->baseApprovedQuery();

        if ($keyword !== '') {
            $this->applyKeywordSearch($query, $keyword);
        }

        // ✅ সব filter এখানে apply হবে
        $this->applyFilters($query, $filters);

        // ✅ Ordering একদম শেষে
        if ($keyword !== '') {
            $this->applyRelevanceOrder($query, $keyword);
        } else {
            $this->applyRotatingOrder($query, $seed);
        }

        $paginator = $query->paginate($perPage, ['*'], 'page', $page);


        $items = collect($paginator->items())
            ->map(fn(Provider $p) => $this->transformCard($p))
            ->all();



        return [
            'providers' => $items,
            'pagination' => [
                'currentPage' => $paginator->currentPage(),
                'lastPage'    => $paginator->lastPage(),
                'perPage'     => $paginator->perPage(),
                'total'       => $paginator->total(),
                'hasMore'     => $paginator->hasMorePages(),
            ],
            'seed' => $seed,
        ];
    }

    public function getFilterOptions(): array
    {
        return Cache::remember('public_provider_filter_options', now()->addMinutes(10), function () {
            $locations = Country::query()->orderBy('name')->pluck('name')->toArray();

            $areas = DB::table('provider_support_areas')
                ->select('area')->distinct()->orderBy('area')
                ->pluck('area')->filter()->toArray();

            $languages = Language::query()->orderBy('name')->pluck('name')->toArray();


            $providers = Provider::query()
                ->where('status', GlobalConstant::VERIFICATION_STATUS_APPROVED)
                ->get([
                    'id',
                    'provider_type',
                    'populations_served',
                    'treatment_approaches',
                    'payment_methods',
                    'insurance_plans',
                    'service_formats',
                ]);
            $sessionFormats = $providers
                ->flatMap(fn($p) => $this->toList($p->service_formats))
                ->filter()
                ->unique()
                ->sort()
                ->values()
                ->all();

            $populations = $this->distinctFromJson($providers, 'populations_served');
            $services    = $this->distinctFromJson($providers, 'treatment_approaches');

            // Insurers = distinct insurance_plans entries (for the "which insurer?" dropdown).
            $insurers = $providers
                ->flatMap(fn($p) => $this->toList($p->insurance_plans))
                ->filter()->unique()->sort()->values()->all();

            // $providerTypes = $providers->pluck('provider_type')->filter()->unique()->sort()->values()->all();
            $providerTypes = $providers->pluck('provider_type')->filter()->unique()->sort()->values()->map(function ($type) {
                return [
                    'value' => $type,
                    'label' => ucwords(str_replace('_', ' ', $type)),
                ];
            })->all();

            $payments = collect()
                ->merge($this->distinctFromJson($providers, 'payment_methods'))
                ->merge($insurers)
                ->filter()->unique()->sort()->values()->all();

            return [
                'locations'      => array_values(array_unique($locations)),
                'areasOfSupport' => array_values(array_unique($areas)),
                'populations'    => $populations,
                'services'       => $services,
                'languages'      => array_values(array_unique($languages)),
                'sessionFormats' => $sessionFormats,
                'payments'       => $payments,
                'insurers'       => $insurers,
                'providerTypes'  => $providerTypes,
            ];
        });
    }

    public function getPublicProfile(int $id): ?array
    {
        $p = Provider::query()
            ->where('status', GlobalConstant::VERIFICATION_STATUS_APPROVED)
            ->with('supportAreas')
            ->find($id);

        if (! $p) {
            return null;
        }

        return [
            'id'              => $p->id,
            'name'            => $p->organization_name,
            'title'           => $this->displayTitle($p),
            'credentials'     => $p->credentials,
            'photo'           => $p->profile_photo ? Storage::url($p->profile_photo) : null,
            'additionalPhotos' => collect($this->toArray($p->additional_photos))
                ->map(fn($path) => Storage::url($path))->values()->all(),
            'bio'             => $p->short_bio,
            'yearsExperience' => $p->years_experience,
            'location'        => $this->displayLocation($p),
            'servesMultiple'  => (bool) $p->multiple_locations,
            'telehealthRegions' => $this->toArray($p->telehealth_regions),
            'sessionFormats' => $this->toArray($p->service_formats),
            'practiceSettings' => $this->toArray($p->practice_settings),
            'languages'       => $this->toArray($p->languages),
            'culturalApproach' => $p->cultural_approach,
            'culturallyAffirming' => $p->culturally_affirming,    // ← যোগ করুন
            'lgbtqAffirming'      => $p->lgbtq_affirming,         // ← যোগ করুন
            'providerType' => $p->provider_type,
            'licenceVerified' => (bool) $p->licence_verified,

            'caribbeanIdentity'   => $p->caribbean_identity,
            'caribbeanExperience' => (bool) $p->caribbean_experience,
            'supportAreas'    => $p->supportAreas->groupBy('category')->map(fn($rows, $cat) => [
                'category' => $cat,
                'areas'    => $rows->pluck('area')->filter()->values(),
            ])->values(),
            'populations'         => $this->toArray($p->populations_served),
            'treatmentApproaches' => $this->toArray($p->treatment_approaches),
            'specializedTraining' => $this->toArray($p->specialized_training),
            'certifications'      => $this->toArray($p->certifications),
            'accessibility'       => $this->toArray($p->accessibility),
            'payment' => [
                'methods'   => $this->toArray($p->payment_methods),
                'insurance' => $this->toArray($p->insurance_plans),
            ],
            'contact' => [
                'phone'   => $p->phone,
                'email'   => $p->contact_email,
                'website' => $p->website,
                'booking' => $p->booking_url,
                'social'  => $this->toArray($p->social_links),
            ],
            'fee'             => $p->fee_range ?: null,
            'availability'    => $this->availabilityState($p),
            'availabilityConfirmedAt' => $p->availability_confirmed_at?->format('F j, Y'),
            'acceptingNewClients' => $this->availabilityState($p) === 'accepting'
                ? true : ($this->availabilityState($p) === 'not_accepting' ? false : null),
        ];
    }

    /* =====================================================================
     |  QUERY BUILDERS
     * ===================================================================== */

    private function baseApprovedQuery(): Builder
    {
        return Provider::query()
            ->where('status', GlobalConstant::VERIFICATION_STATUS_APPROVED)
            ->with(['supportAreas']);
    }

    private function applyKeywordSearch(Builder $query, string $keyword): void
    {
        $like = '%' . str_replace(['%', '_'], ['\%', '\_'], $keyword) . '%';

        $query->where(function (Builder $q) use ($like) {
            $q->where('organization_name', 'like', $like)
                ->orWhere('professional_title', 'like', $like)
                ->orWhere('professional_title_other', 'like', $like)
                ->orWhere('city', 'like', $like)
                ->orWhere('state_province', 'like', $like)
                ->orWhere('country', 'like', $like)
                ->orWhere('languages', 'like', $like)
                ->orWhere('treatment_approaches', 'like', $like)
                ->orWhere('specialized_training', 'like', $like)
                ->orWhere('populations_served', 'like', $like)
                ->orWhereHas('supportAreas', function (Builder $sa) use ($like) {
                    $sa->where('area', 'like', $like)->orWhere('category', 'like', $like);
                });
        });
    }



    private function applyFilters(Builder $query, array $filters): void
    {
        // 1) Location
        if (! empty($filters['location'])) {
            $this->applyLocationFilter(
                $query,
                (string) $filters['location'],
                (string) ($filters['region'] ?? ''),
                ! empty($filters['include_virtual'])
            );
        } elseif (! empty($filters['include_virtual'])) {
            $query->where(fn(Builder $q) => $q
                ->whereJsonContains('service_formats', 'Virtual')
                ->orWhereJsonContains('service_formats', 'Telehealth'));
        }

        // 2) Areas of Support
        $areas = $this->normaliseAreas($filters['areas'] ?? ($filters['area_of_support'] ?? []));
        if (! empty($areas)) {
            $query->whereHas('supportAreas', fn(Builder $q) => $q->whereIn('area', $areas));
        }

        // 3) UK City (third-level)
        if (! empty($filters['city'])) {
            $query->where(function (Builder $q) use ($filters) {
                $q->where('city', $filters['city'])
                    ->orWhere('state_province', $filters['city']);
            });
        }

        // 4) Grouped payment
        if (! empty($filters['payment'])) {
            $this->applyPaymentGroupFilter(
                $query,
                (string) $filters['payment'],
                (string) ($filters['insurer'] ?? '')
            );
        }

        // 5) Price range
        $feeMin = $filters['fee_min'] ?? '';
        $feeMax = $filters['fee_max'] ?? '';
        if ($feeMin !== '' || $feeMax !== '') {
            $query->whereNotNull('fee_range')->where('fee_range', '!=', '');

            $firstNum  = "REGEXP_SUBSTR(fee_range, '[0-9]+', 1, 1)";
            $secondNum = "REGEXP_SUBSTR(fee_range, '[0-9]+', 1, 2)";
            $lowExpr   = "CAST($firstNum AS UNSIGNED)";
            $highExpr  = "CAST(COALESCE($secondNum, $firstNum) AS UNSIGNED)";

            if ($feeMin !== '') {
                $query->whereRaw("$highExpr >= ?", [(int) $feeMin]);
            }
            if ($feeMax !== '') {
                $query->whereRaw("$lowExpr <= ?", [(int) $feeMax]);
            }
        }

        // 6) Refine filters
        if (! empty($filters['population'])) {
            $query->whereJsonContains('populations_served', $filters['population']);
        }
        if (! empty($filters['service'])) {
            $query->whereJsonContains('treatment_approaches', $filters['service']);
        }
        $languages = $this->normaliseAreas($filters['language'] ?? []);
        if (! empty($languages)) {
            $query->where(function (Builder $q) use ($languages) {
                foreach ($languages as $lang) {
                    $q->orWhereJsonContains('languages', $lang);
                }
            });
        }
        if (! empty($filters['provider_type'])) {
            $query->where('provider_type', $filters['provider_type']);
        }
        if (! empty($filters['session_format'])) {
            $this->applySessionFormatFilter($query, $filters['session_format']);
        }

        // 7) ✅ Identity-affirming care (NEW — এটাই missing ছিল)
        if (! empty($filters['lgbtq_affirming'])) {
            $query->where('lgbtq_affirming', $filters['lgbtq_affirming']);
        }
        if (! empty($filters['culturally_affirming'])) {
            $query->where('culturally_affirming', $filters['culturally_affirming']);
        }

        // 8) Availability
        if (! empty($filters['accepting'])) {
            $query->where('accepting_new_clients', true)
                ->whereNotNull('availability_confirmed_at')
                ->where('availability_confirmed_at', '>=', now()->subDays(self::AVAILABILITY_FRESH_DAYS));
        }
    }

    private function applyLocationFilter(Builder $query, string $loc, string $region, bool $includeVirtual): void
    {
        $query->where(function (Builder $q) use ($loc, $includeVirtual) {
            $q->where('country', $loc)
                ->orWhere('state_province', $loc)
                ->orWhere('city', $loc)
                ->orWhereJsonContains('telehealth_regions', $loc);

            if ($includeVirtual) {
                $q->orWhereJsonContains('service_formats', 'Virtual')
                    ->orWhereJsonContains('service_formats', 'Telehealth');
            }
        });

        // Secondary geography (parish/state/province) narrows within the country.
        if ($region !== '') {
            $query->where(fn(Builder $q) => $q
                ->where('state_province', $region)
                ->orWhere('city', $region)
                ->orWhereJsonContains('telehealth_regions', $region));
        }
    }

    private function applyPaymentGroupFilter(Builder $query, string $group, string $insurer = ''): void
    {
        if ($group === 'insurance') {
            $query->where(function (Builder $q) use ($insurer) {
                $q->whereJsonContains('payment_methods', 'Insurance Accepted')
                    ->orWhere(fn(Builder $qq) => $qq->whereNotNull('insurance_plans')->where('insurance_plans', '!=', '')->where('insurance_plans', '!=', '[]'));
                if ($insurer !== '') {
                    $q->where('insurance_plans', 'like', '%' . str_replace(['%', '_'], ['\%', '\_'], $insurer) . '%');
                }
            });
            return;
        }

        $values = self::PAYMENT_GROUPS[$group] ?? [$group];
        $query->where(function (Builder $q) use ($values) {
            foreach ($values as $v) {
                $q->orWhereJsonContains('payment_methods', $v);
            }
        });
    }

    private function applySessionFormatFilter(Builder $query, string $format): void
    {
        $format   = strtolower($format);
        $inPerson = ['In-Person', 'In Person'];
        $tele     = ['Virtual', 'Telehealth'];

        $matchAny = fn(Builder $q, array $vals) => $q->where(function (Builder $qq) use ($vals) {
            foreach ($vals as $v) {
                $qq->orWhereJsonContains('service_formats', $v);
            }
        });

        if (in_array($format, ['in person', 'in-person'], true)) {
            $matchAny($query, $inPerson);
        } elseif ($format === 'telehealth') {
            $matchAny($query, $tele);
        } elseif ($format === 'both') {
            $matchAny($query, $inPerson);
            $matchAny($query, $tele);
        }
    }

    private function applyRotatingOrder(Builder $query, int $seed): void
    {
        $query->orderByRaw('CRC32(CONCAT(id, ?))', [$seed]);
    }

    private function applyRelevanceOrder(Builder $query, string $keyword): void
    {
        $esc    = str_replace(['%', '_'], ['\%', '\_'], $keyword);
        $like   = '%' . $esc . '%';
        $starts = $esc . '%';

        $query->select('providers.*')->selectRaw(
            '(
                (CASE WHEN organization_name LIKE ? THEN 100 ELSE 0 END) +
                (CASE WHEN organization_name LIKE ? THEN 60  ELSE 0 END) +
                (CASE WHEN EXISTS (
                    SELECT 1 FROM provider_support_areas psa
                    WHERE psa.provider_id = providers.id
                      AND (psa.area LIKE ? OR psa.category LIKE ?)
                ) THEN 45 ELSE 0 END) +
                (CASE WHEN professional_title LIKE ?  THEN 40 ELSE 0 END) +
                (CASE WHEN specialized_training LIKE ? THEN 35 ELSE 0 END) +
                (CASE WHEN treatment_approaches LIKE ? THEN 30 ELSE 0 END) +
                (CASE WHEN languages LIKE ? THEN 25 ELSE 0 END) +
                (CASE WHEN (city LIKE ? OR state_province LIKE ? OR country LIKE ?) THEN 20 ELSE 0 END)
            ) as relevance_score',
            [$starts, $like, $like, $like, $like, $like, $like, $like, $like, $like, $like]
        )
            ->orderByDesc('relevance_score')
            ->orderBy('organization_name');
    }

    /* =====================================================================
     |  TRANSFORMERS / HELPERS
     * ===================================================================== */

    private function transformCard(Provider $p): array
    {
        $formats  = $this->toArray($p->service_formats);
        $payments = $this->toArray($p->payment_methods);

        return [
            'id'          => $p->id,
            'name'        => $p->organization_name,
            'credentials' => $p->credentials,
            'title'       => $this->displayTitle($p),
            'providerType' => $p->provider_type,
            'photo'       => $p->profile_photo ? Storage::url($p->profile_photo) : null,
            'location'    => $this->displayLocation($p),

            'sessionFormats' => $formats,
            'formatKey'     => $this->formatKey($formats),

            'specialties' => $this->cardSpecialties($p),
            'populations' => array_slice($this->toArray($p->populations_served), 0, 4),
            'languages'   => array_slice($this->toArray($p->languages), 0, 3),

            // Payment (guide §4.2)
            'insurances'   => array_slice($this->toList($p->insurance_plans), 0, 6),
            'selfPay'      => in_array('Self-Pay', $payments, true),
            'slidingScale' => in_array('Sliding Scale', $payments, true),
            'freeLowCost'  => (bool) array_intersect($payments, self::PAYMENT_GROUPS['free_low_cost']),
            'fee'          => $p->fee_range ?: null,

            // Availability — 3 states (guide §5.1): accepting | not_accepting | unknown
            'availability' => $this->availabilityState($p),

            // Verification indicator — approved profiles are Bahali-verified.
            'verified'     => true,
            'licenceVerified' => (bool) $p->licence_verified,

            'caribbeanExperience' => (bool) $p->caribbean_experience,
        ];
    }

    /**
     * Resolve the public availability state (guide §5.1).
     * unknown when never set OR confirmation older than the 60-day window.
     */
    private function availabilityState(Provider $p): string
    {
        if (is_null($p->accepting_new_clients) || is_null($p->availability_confirmed_at)) {
            return 'unknown';
        }
        if ($p->availability_confirmed_at->lt(now()->subDays(self::AVAILABILITY_FRESH_DAYS))) {
            return 'unknown';
        }
        return $p->accepting_new_clients ? 'accepting' : 'not_accepting';
    }

    private function formatKey(array $formats): ?string
    {
        $lc = array_map('strtolower', $formats);
        $hasInPerson = (bool) array_intersect($lc, ['in-person', 'in person']);
        $hasVirtual  = (bool) array_intersect($lc, ['virtual', 'telehealth']);
        if ($hasInPerson && $hasVirtual) return 'both';
        if ($hasInPerson) return 'in_person';
        if ($hasVirtual) return 'virtual';
        return null;
    }

    private function normaliseAreas($areas): array
    {
        if (is_string($areas)) {
            $areas = $areas === '' ? [] : [$areas];
        }
        return array_values(array_filter((array) $areas, fn($a) => trim((string) $a) !== ''));
    }

    private function cardSpecialties(Provider $p): array
    {
        $areas = $p->relationLoaded('supportAreas')
            ? $p->supportAreas->pluck('area')->filter()->values()->all()
            : [];

        if (empty($areas)) {
            $areas = $this->toArray($p->treatment_approaches);
        }

        return array_slice(array_values(array_unique($areas)), 0, 6);
    }

    private function displayTitle(Provider $p): ?string
    {
        $titles = $this->toArray($p->professional_title);
        if (! empty($p->professional_title_other)) {
            $titles[] = $p->professional_title_other;
        }
        $titles = array_values(array_unique(array_filter($titles)));
        return count($titles) ? implode(', ', $titles) : $p->credentials;
    }

    private function displayLocation(Provider $p): ?string
    {
        $parts = array_filter([$p->city, $p->state_province, $p->country]);
        return count($parts) ? implode(', ', $parts) : null;
    }

    private function distinctFromJson($collection, string $column): array
    {
        return $collection
            ->flatMap(fn($p) => $this->toArray($p->{$column}))
            ->filter()->unique()->sort()->values()->all();
    }

    private function defaultSeed(): int
    {
        return (int) now()->format('Ymd');
    }

    /* ---------- (edit / dashboard / profile — UNCHANGED below) ---------- */

    // app/Services/ProviderService.php

    public function getCountriesForForm()
    {
        return Country::with([
            'regions' => function ($q) {
                $q->select('id', 'country_id', 'parent_id', 'name', 'region_type_id', 'display_order')
                    ->where('is_active', true)
                    ->with('regionType:id,name,label')
                    ->orderBy('parent_id')
                    ->orderBy('name');
            }
        ])
            ->orderBy('name')
            ->get()
            ->map(fn($c) => [
                'id'   => $c->id,
                'name' => $c->name,
                'regions' => $c->regions->map(fn($r) => [
                    'id'              => $r->id,
                    'name'            => $r->name,
                    'parentId'        => $r->parent_id,      // ← frontend expects this
                    'regionTypeLabel' => $r->regionType?->label,
                ]),
            ]);
    }

    public function getEditData(Provider $provider): array
    {
        $provider->loadMissing(['supportAreas', 'user']);

        return [
            'provider' => [
                'provider_type'        => $provider->provider_type,
                'organization_name'    => $provider->organization_name,
                'credentials'          => $provider->credentials,
                'professional_title'   => $this->toArray($provider->professional_title),
                'short_bio'            => $provider->short_bio,
                'years_experience'     => $provider->years_experience,
                'license_number'       => $provider->license_number,
                'license_not_applicable' => (bool) $provider->license_not_applicable,
                'license_states'       => $this->toArray($provider->license_states),
                'license_status'       => $provider->license_status,
                'populations_served'   => $this->toArray($provider->populations_served),
                'caribbean_identity'   => $provider->caribbean_identity,
                'caribbean_experience' => $provider->caribbean_experience,
                'languages'            => $this->toArray($provider->languages),
                'cultural_approach'    => $provider->cultural_approach,
                'treatment_approaches' => $this->toArray($provider->treatment_approaches),
                'specialized_training' => $this->toArray($provider->specialized_training),
                'certifications'       => $this->toArray($provider->certifications),
                'service_formats'      => $this->toArray($provider->service_formats),
                'practice_settings'    => $this->toArray($provider->practice_settings),
                'address'              => $provider->address,
                'city'                 => $provider->city,
                'state_province'       => $provider->state_province,
                'country'              => $provider->country,
                'multiple_locations'   => $provider->multiple_locations,
                'hide_address'         => (bool) $provider->hide_address,
                'telehealth_regions'   => $this->toArray($provider->telehealth_regions),
                'accessibility'        => $this->toArray($provider->accessibility),
                'payment_methods'      => $this->toArray($provider->payment_methods),
                'insurance_plans'      => is_array($provider->insurance_plans)
                    ? implode(', ', $this->toArray($provider->insurance_plans))
                    : $provider->insurance_plans,
                'phone'                => $provider->phone,
                'website'              => $provider->website,
                'social_links'         => is_array($provider->social_links)
                    ? implode(', ', $this->toArray($provider->social_links))
                    : $provider->social_links,
                'status'               => $provider->status,
                'email'                => $provider->user?->email ?? $provider->email,
                'lgbtq_affirming'      => $provider->lgbtq_affirming === null ? '' : ($provider->lgbtq_affirming ? 'yes' : 'no'),
                'culturally_affirming' => $provider->culturally_affirming === null ? '' : ($provider->culturally_affirming ? 'yes' : 'no'),
                'fee_range'            => $provider->fee_range,

                // Availability (guide §5)
                'accepting_new_clients'      => $provider->accepting_new_clients, // true|false|null
                'availability_confirmed_at'  => $provider->availability_confirmed_at?->format('F j, Y'),
            ],
            'supportAreas' => $provider->supportAreas
                ->map(fn($r) => ['category' => $r->category, 'area' => $r->area])
                ->values(),
            'existingProfilePhoto' => $provider->profile_photo
                ? Storage::url($provider->profile_photo) : null,
            'existingVerificationDoc' => $provider->verification_document
                ? Storage::url($provider->verification_document) : null,
            'existingAdditionalPhotos' => collect($this->toArray($provider->additional_photos))
                ->map(fn($path) => ['path' => $path, 'url' => Storage::url($path)])
                ->values(),
        ];
    }

    public function updateOwnProfile(Provider $provider, $request): Provider
    {
        $data = $request->validated();
        unset($data['email'], $data['password']);

        $data['license_states']       = $request->input('license_states', []);
        $data['telehealth_regions']   = $request->input('telehealth_regions', []);
        $data['accessibility']        = $request->input('accessibility', []);
        $data['practice_settings']    = $request->input('practice_settings', []);
        $data['treatment_approaches'] = $request->input('treatment_approaches', []);
        $data['specialized_training'] = $request->input('specialized_training', []);
        $data['certifications']       = $request->input('certifications', []);


        // Session fee range -> "$min–$max / session" (guide §4.2).
        $feeMin = $request->input('fee_min');
        $feeMax = $request->input('fee_max');
        $fmt = static function ($v): string {
            // Keep whole numbers clean (150 not 150.00) but preserve real decimals.
            $n = (float) $v;
            return $n == (int) $n ? (string) (int) $n : rtrim(rtrim(number_format($n, 2, '.', ''), '0'), '.');
        };

        if ($feeMin !== null && $feeMin !== '' && $feeMax !== null && $feeMax !== '') {
            $data['fee_range'] = '$' . $fmt($feeMin) . '–$' . $fmt($feeMax) . ' / session';
        } elseif ($feeMin !== null && $feeMin !== '') {
            $data['fee_range'] = 'From $' . $fmt($feeMin) . ' / session';
        } else {
            $data['fee_range'] = null;
        }
        unset($data['fee_min'], $data['fee_max']);

        $data['status'] = GlobalConstant::VERIFICATION_STATUS_PENDING;
        // Availability (guide §5) — stamp confirmation time so the 60-day
        // freshness window resets on every profile save.
        $data['availability_confirmed_at'] = now();

        $supportAreas = $request->mappedAreasOfSupport();

        unset(
            $data['areas_of_support'],
            $data['existing_additional_photos'],
            $data['verification_document'],
            $data['profile_photo'],
            $data['additional_photos'],
        );

        if ($request->hasFile('verification_document')) {
            $data['verification_document'] = $this->storeUpload(
                $request->file('verification_document'),
                'providers/verification'
            );
        }
        if ($request->hasFile('profile_photo')) {
            $data['profile_photo'] = $this->storeUpload(
                $request->file('profile_photo'),
                'providers/photos'
            );
        }

        $kept = array_values($request->input('existing_additional_photos', []));
        $newPhotos = [];
        if ($request->hasFile('additional_photos')) {
            foreach ($request->file('additional_photos') as $photo) {
                $path = $this->storeUpload($photo, 'providers/photos');
                if ($path) {
                    $newPhotos[] = $path;
                }
            }
        }
        $data['additional_photos'] = array_values(array_merge($kept, $newPhotos));

        DB::transaction(function () use ($provider, $data, $supportAreas) {
            $provider->update($data);
            $provider->supportAreas()->delete();
            if (! empty($supportAreas)) {
                $provider->supportAreas()->createMany($supportAreas);
            }
        });

        Cache::forget('public_provider_filter_options');

        return $provider->fresh(['supportAreas']);
    }

    private function storeUpload(?UploadedFile $file, string $dir): ?string
    {
        if (! $file || ! $file->isValid()) {
            return null;
        }
        $publicPath = storage_path('app/public/' . $dir);
        if (! is_dir($publicPath)) {
            mkdir($publicPath, 0755, true);
        }
        $filename = $file->hashName();
        $file->move($publicPath, $filename);
        return $dir . '/' . $filename;
    }

    public function getDashboardData(Provider $provider): array
    {
        $provider->loadMissing(['supportAreas', 'user']);

        $status = $provider->status ?: GlobalConstant::VERIFICATION_STATUS_PENDING;
        $isPublic = $status === GlobalConstant::VERIFICATION_STATUS_APPROVED;
        $completeness = $this->profileCompleteness($provider);

        return [
            'provider' => [
                'id'                   => $provider->id,
                'organization_name'    => $provider->organization_name,
                'professional_title'   => $this->toArray($provider->professional_title),
                'credentials'          => $provider->credentials,
                'short_bio'            => $provider->short_bio,
                'years_experience'     => $provider->years_experience,
                'email'                => $provider->user?->email ?? $provider->email,
                'phone'                => $provider->phone,
                'website'              => $provider->website,
                'social_links'         => $provider->social_links,
                'address'              => $provider->address,
                'city'                 => $provider->city,
                'state_province'       => $provider->state_province,
                'country'              => $provider->country,
                'hide_address'         => (bool) $provider->hide_address,
                'multiple_locations'   => $provider->multiple_locations,
                'service_formats'      => $this->toArray($provider->service_formats),
                'practice_settings'    => $this->toArray($provider->practice_settings),
                'areas_of_support'     => $provider->supportAreas
                    ->map(fn($area) => $area->name ?? $area->area ?? (string) $area)
                    ->values()
                    ->toArray(),
                'populations_served'   => $this->toArray($provider->populations_served),
                'languages'            => $this->toArray($provider->languages),
                'treatment_approaches' => $this->toArray($provider->treatment_approaches),
                'specialized_training' => $this->toArray($provider->specialized_training),
                'certifications'       => $this->toArray($provider->certifications),
                'caribbean_identity'   => $provider->caribbean_identity,
                'caribbean_experience' => $provider->caribbean_experience,
                'cultural_approach'    => $provider->cultural_approach,
                'payment_methods'      => $this->toArray($provider->payment_methods),
                'insurance_plans'      => $provider->insurance_plans,
                'accessibility'        => $this->toArray($provider->accessibility),
                'profile_photo'        => $provider->profile_photo
                    ? Storage::url($provider->profile_photo)
                    : null,
                'telehealth_regions'   => $this->toArray($provider->telehealth_regions),
                'license_number'       => $provider->license_number,
                'license_status'       => $provider->license_status,
                'license_states'       => $this->toArray($provider->license_states),
                'verification_document' => $provider->verification_document
                    ? Storage::url($provider->verification_document)
                    : null,
                'submitted_at'         => $provider->created_at?->format('F j, Y'),
                'reviewed_at'          => $provider->reviewed_at?->format('F j, Y'),
                'review_note'          => $provider->note,
                'status'               => $status,
                'accepting_new_clients'      => $provider->accepting_new_clients, // true|false|null
                'availability_confirmed_at'  => $provider->availability_confirmed_at?->format('M j, Y'),
                'availability_next_reminder' => $provider->availability_confirmed_at?->copy()->addDays(60)->format('M j, Y'),
            ],
            'status' => [
                'value'       => $status,
                'label'       => ucfirst($status),
                'isPublic'    => $isPublic,
                'description' => $this->statusDescription($status),
            ],
            'completeness' => $completeness,
            'stats' => [
                'supportAreas'  => $provider->supportAreas->count(),
                'languages'     => count($this->toArray($provider->languages)),
                'populations'   => count($this->toArray($provider->populations_served)),
                'sessionFormat' => $this->resolveSessionFormat($this->toArray($provider->service_formats)),
            ],
            'links' => [
                'editProfile'   => '/provider/profile/edit',
                'publicProfile' => $isPublic ? "/provider/{$provider->id}" : null,
                'directory'     => '/provider',
            ],
        ];
    }

    private function statusDescription(string $status): string
    {
        return match ($status) {
            GlobalConstant::VERIFICATION_STATUS_APPROVED  => 'Your profile is approved and visible in the public directory.',
            GlobalConstant::VERIFICATION_STATUS_PENDING   => 'Your profile is awaiting review. It will appear publicly once approved.',
            GlobalConstant::VERIFICATION_STATUS_REJECTED  => 'Your profile needs changes before it can be published. Please review any notes and resubmit.',
            GlobalConstant::VERIFICATION_STATUS_SUSPENDED => 'Your listing is temporarily suspended. Contact Bahali for details.',
            GlobalConstant::VERIFICATION_STATUS_INACTIVE  => 'Your listing is inactive and not shown publicly.',
            default => 'Your profile status is being processed.',
        };
    }

    private function profileCompleteness(Provider $provider): array
    {
        $checks = [
            'Basic information'   => (bool) $provider->organization_name && count($this->toArray($provider->professional_title)) > 0,
            'About & bio'         => (bool) trim((string) $provider->short_bio),
            'Licensure'           => (bool) $provider->license_status,
            'Areas of support'    => $provider->supportAreas->count() > 0,
            'Populations served'  => count($this->toArray($provider->populations_served)) > 0,
            'Languages'           => count($this->toArray($provider->languages)) > 0,
            'Service information'  => count($this->toArray($provider->service_formats)) > 0,
            'Location'            => (bool) $provider->city && (bool) $provider->country,
            'Payment methods'     => count($this->toArray($provider->payment_methods)) > 0,
            'Contact information' => (bool) $provider->phone,
            'Profile photo'       => (bool) $provider->profile_photo,
        ];

        $done = count(array_filter($checks));
        $total = count($checks);
        $missing = array_keys(array_filter($checks, fn($ok) => ! $ok));

        return [
            'percent'  => $total ? (int) round(($done / $total) * 100) : 0,
            'done'     => $done,
            'total'    => $total,
            'missing'  => array_values($missing),
        ];
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

    private function resolveSessionFormat(array $formats): string
    {
        $formats = array_map('strtolower', $formats);
        if (in_array('in-person', $formats) && in_array('virtual', $formats)) {
            return 'In Person + Telehealth';
        }
        if (in_array('in-person', $formats)) {
            return 'In Person';
        }
        if (in_array('virtual', $formats)) {
            return 'Telehealth';
        }
        return 'Not specified';
    }
    /**
     * Split comma-separated string OR pass through an array (insurance_plans, etc.).
     */
    private function toList($value): array
    {
        if (is_array($value)) {
            return array_values(array_filter(array_map('trim', $value), fn($v) => $v !== ''));
        }
        if (is_string($value) && trim($value) !== '') {
            // Try JSON array first; fall back to comma-separated.
            $decoded = json_decode($value, true);
            if (is_array($decoded)) {
                return array_values(array_filter(array_map('trim', $decoded), fn($v) => $v !== ''));
            }
            return array_values(array_filter(array_map('trim', explode(',', $value)), fn($v) => $v !== ''));
        }
        return [];
    }
}
