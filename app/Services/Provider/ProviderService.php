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

class ProviderService extends BaseService
{
    public function __construct()
    {
        // BaseService requires the model in its constructor.
        parent::__construct(new Provider());
    }

    /* =====================================================================
     |  PUBLIC API
     * ===================================================================== */

    /**
     * Module 3/4/5/6/10 — approved providers, keyword + filters, and
     * relevance-aware ordering (or a fair rotating order by default).
     */
    public function getPublicDirectory(array $filters): array
    {
        $perPage = (int) ($filters['perPage'] ?? 12);
        $perPage = max(3, min($perPage, 48));
        $page    = max(1, (int) ($filters['page'] ?? 1));
        $keyword = trim((string) ($filters['keyword'] ?? ''));
        $seed    = (int) ($filters['seed'] ?? $this->defaultSeed());

        $query = $this->baseApprovedQuery();

        if ($keyword !== '') {
            $this->applyKeywordSearch($query, $keyword);
        }

        $this->applyFilters($query, $filters);

        // Module 4: keyword -> relevance order; otherwise rotating/randomized.
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

    /**
     * Module 6/7 — options for the public filter dropdowns, built ONLY from
     * approved providers. Cached to stay cheap as the directory grows.
     */
    public function getFilterOptions(): array
    {
        return Cache::remember('public_provider_filter_options', now()->addMinutes(10), function () {
            $providers = Provider::query()
                ->where('status', GlobalConstant::VERIFICATION_STATUS_APPROVED)
                ->with('supportAreas:id,provider_id,area')
                ->get([
                    'id',
                    'country',
                    'state_province',
                    'city',
                    'populations_served',
                    'treatment_approaches',
                    'languages',
                    'service_formats',
                    'payment_methods',
                    'insurance_plans',
                ]);

            $locations = $providers
                ->flatMap(fn($p) => array_filter([$p->country, $p->state_province]))
                ->unique()->sort()->values()->all();

            $areas = $providers
                ->flatMap(fn($p) => $p->supportAreas->pluck('area'))
                ->filter()->unique()->sort()->values()->all();

            $payments = collect()
                ->merge($this->distinctFromJson($providers, 'payment_methods'))
                ->merge($this->distinctFromJson($providers, 'insurance_plans'))
                ->filter()->unique()->sort()->values()->all();

            return [
                'locations'      => $locations,
                'areasOfSupport' => $areas,
                'populations'    => $this->distinctFromJson($providers, 'populations_served'),
                'services'       => $this->distinctFromJson($providers, 'treatment_approaches'),
                'languages'      => $this->distinctFromJson($providers, 'languages'),
                'sessionFormats' => ['In Person', 'Telehealth', 'Both'],
                'payments'       => $payments,
            ];
        });
    }

    /**
     * Module 8/9 — a single approved provider, public-safe fields only.
     */
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
            'sessionFormat'   => $this->resolveSessionFormat($this->toArray($p->service_formats)),
            'practiceSettings' => $this->toArray($p->practice_settings),
            'languages'       => $this->toArray($p->languages),
            'culturalApproach' => $p->cultural_approach,
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
                'website' => $p->website,
                'social'  => $this->toArray($p->social_links),
            ],
            // Deliberately NOT exposed (Module 9): license_number,
            // verification_document, verification_note, consent_*,
            // user email, internal statuses, reviewed_at.
        ];
    }

    /* =====================================================================
     |  QUERY BUILDERS
     * ===================================================================== */

    private function baseApprovedQuery(): Builder
    {
        return Provider::query()
            ->where('status', GlobalConstant::VERIFICATION_STATUS_APPROVED)
            // Optional: honour the provider's public-display consent:
            // ->where('consent_public', true)
            ->with(['supportAreas']);
    }

    /** Module 5 — one keyword across name, specialties, location, languages, areas of support. */
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
                // JSON columns are stored as text — LIKE works for keyword search
                ->orWhere('languages', 'like', $like)
                ->orWhere('treatment_approaches', 'like', $like)
                ->orWhere('specialized_training', 'like', $like)
                ->orWhere('populations_served', 'like', $like)
                ->orWhereHas('supportAreas', function (Builder $sa) use ($like) {
                    $sa->where('area', 'like', $like)
                        ->orWhere('category', 'like', $like);
                });
        });
    }

    /** Module 6 — the 7 primary public filters. */
    private function applyFilters(Builder $query, array $filters): void
    {
        if (! empty($filters['location'])) {
            $loc = $filters['location'];
            $query->where(fn(Builder $q) => $q
                ->where('country', $loc)
                ->orWhere('state_province', $loc)
                ->orWhere('city', $loc));
        }

        if (! empty($filters['area_of_support'])) {
            $query->whereHas('supportAreas', fn(Builder $q) => $q->where('area', $filters['area_of_support']));
        }

        if (! empty($filters['population'])) {
            $query->whereJsonContains('populations_served', $filters['population']);
        }

        // "Services Offered" -> treatment_approaches. Remap if your schema differs.
        if (! empty($filters['service'])) {
            $query->whereJsonContains('treatment_approaches', $filters['service']);
        }

        if (! empty($filters['language'])) {
            $query->whereJsonContains('languages', $filters['language']);
        }

        if (! empty($filters['session_format'])) {
            $this->applySessionFormatFilter($query, $filters['session_format']);
        }

        if (! empty($filters['payment'])) {
            $payment = $filters['payment'];
            $query->where(fn(Builder $q) => $q
                ->whereJsonContains('payment_methods', $payment)
                ->orWhereJsonContains('insurance_plans', $payment)
                ->orWhere('insurance_plans', 'like', '%' . $payment . '%'));
        }
    }

    /** Session Format = In Person / Telehealth / Both, derived from service_formats. */
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

    /**
     * Module 4 (default state) — rotating/randomized order.
     * RAND(seed) gives a reproducible shuffle, so "Load more" stays
     * consistent within one browse session while a new seed rotates who
     * appears first for the next visitor. No provider is permanently pinned.
     *
     * Scale-up note: for very large tables, replace this with a precomputed
     * "shuffle_order" column reshuffled by a scheduled job.
     * (RAND(seed) is MySQL syntax — swap for your driver if not MySQL.)
     */
    private function applyRotatingOrder(Builder $query, int $seed): void
    {
        $query->orderByRaw('RAND(?)', [$seed])->orderBy('id');
    }

    /** Module 4 (search state) — relevance: name > area > title > training > language > location. */
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
        return [
            'id'          => $p->id,
            'name'        => $p->organization_name,
            'credentials' => $p->credentials,
            'title'       => $this->displayTitle($p),
            'photo'       => $p->profile_photo ? Storage::url($p->profile_photo) : null,
            'location'    => $this->displayLocation($p),
            'languages'   => $this->toArray($p->languages),
            'sessionFormat' => $this->resolveSessionFormat($this->toArray($p->service_formats)),
            'specialties' => $this->cardSpecialties($p),
            'populations' => array_slice($this->toArray($p->populations_served), 0, 3),
            'caribbeanExperience' => (bool) $p->caribbean_experience,
            // Module 13 placeholder — badge not wired yet:
            'acceptingNewClients' => null,
        ];
    }

    private function cardSpecialties(Provider $p): array
    {
        $areas = $p->relationLoaded('supportAreas')
            ? $p->supportAreas->pluck('area')->filter()->values()->all()
            : [];

        if (empty($areas)) {
            $areas = $this->toArray($p->treatment_approaches);
        }

        return array_slice(array_values(array_unique($areas)), 0, 3);
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

    private function resolveSessionFormat(array $formats): ?string
    {
        $formats  = array_map('strtolower', $formats);
        $inPerson = in_array('in-person', $formats, true) || in_array('in person', $formats, true);
        $tele     = in_array('virtual', $formats, true) || in_array('telehealth', $formats, true);

        if ($inPerson && $tele) return 'Both';
        if ($tele)              return 'Telehealth';
        if ($inPerson)          return 'In Person';
        return null;
    }

    private function distinctFromJson($collection, string $column): array
    {
        return $collection
            ->flatMap(fn($p) => $this->toArray($p->{$column}))
            ->filter()->unique()->sort()->values()->all();
    }

    private function toArray($value): array
    {
        if (is_array($value)) {
            return array_values(array_filter($value, fn($v) => $v !== null && $v !== ''));
        }
        if (is_string($value) && $value !== '') {
            $decoded = json_decode($value, true);
            return is_array($decoded)
                ? array_values(array_filter($decoded))
                : [$value];
        }
        return [];
    }

    private function defaultSeed(): int
    {
        return (int) now()->format('Ymd');
    }
    public function getCountriesForForm(): array
    {
        return Country::with('regions.regionType')
            ->orderBy('name')
            ->get()
            ->map(fn($country) => [
                'id' => $country->id,
                'name' => $country->name,
                'code' => $country->code,
                'regions' => $country->regions
                    ->sortBy('name')
                    ->map(fn($region) => [
                        'id' => $region->id,
                        'name' => $region->name,
                        'regionTypeName' => $region->regionType?->name,
                        'regionTypeLabel' => $region->regionType?->label,
                    ])
                    ->values()
                    ->toArray(),
            ])
            ->values()
            ->toArray();
    }

    /**
     * Everything the provider's own edit form needs, in a form-friendly shape.
     * Custom "Other" values were merged into the arrays at save time; the React
     * form splits them back out using its option lists.
     */
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

    /**
     * Save a provider's own edits. Module 2: every edit pushes the profile back
     * into Pending so an admin re-approves before it is public again.
     * Files are only replaced when a new upload is provided.
     */
    public function updateOwnProfile(Provider $provider, $request): Provider
    {
        $data = $request->validated();

        // Not editable from the profile edit screen.
        unset($data['email'], $data['password']);

        // Re-read JSON array columns straight from input (mirrors registration store()).
        $data['license_states']       = $request->input('license_states', []);
        $data['telehealth_regions']   = $request->input('telehealth_regions', []);
        $data['accessibility']        = $request->input('accessibility', []);
        $data['practice_settings']    = $request->input('practice_settings', []);
        $data['treatment_approaches'] = $request->input('treatment_approaches', []);
        $data['specialized_training'] = $request->input('specialized_training', []);
        $data['certifications']       = $request->input('certifications', []);

        // Module 2 — back to Pending on any edit.
        $data['status'] = GlobalConstant::VERIFICATION_STATUS_PENDING;

        $supportAreas = $request->mappedAreasOfSupport();

        // Non-column / separately-handled keys.
        unset(
            $data['areas_of_support'],
            $data['existing_additional_photos'],
            $data['verification_document'],
            $data['profile_photo'],
            $data['additional_photos'],
        );

        // Files — replace only when a new one is uploaded; otherwise keep existing.
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

        // Additional photos = kept existing paths + any newly uploaded.
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

    /**
     * Store an uploaded file safely (same approach as the registration controller).
     */
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
}
