<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\DirectorySearch;
use App\Services\Provider\ProviderService;
use App\Services\Web\BlogRenderer;
use App\Services\Web\ProviderDirectoryPageService;
use App\Services\Web\ProviderProfilePageService;
use App\Support\ConnectTaxonomy;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Bahali Connect — Get Help, Find support (the provider directory) and provider profiles.
 *
 * Privacy (GET_HELP_FINAL_HANDOFF.md): areas of support, keywords and other search choices are never put in
 * the page address. Every search is POSTed, kept in the session and the directory is opened with a clean URL.
 * Results come from the existing ProviderService::getPublicDirectory() — approved, published records only.
 */
class FindSupportController extends Controller
{
    private const SESSION_FILTERS = 'connect.directory.filters';
    private const SESSION_PAGE = 'connect.directory.page';
    private const SESSION_SEED = 'connect.search.seed';
    private const SESSION_RECORD = 'connect.search.record';
    private const PER_PAGE = 6;

    /** Directory filters (same set as the original provider directory). */
    private const EMPTY = [
        'location'             => '',
        'region'               => '',
        'city'                 => '',
        'include_virtual'      => false,
        'areas'                => [],
        'payment'              => '',
        'insurer'              => '',
        'fee_min'              => '',
        'fee_max'              => '',
        'population'           => '',
        'session_format'       => '',
        'language'             => [],
        'provider_type'        => '',
        'accepting'            => false,
        'lgbtq_affirming'      => '',
        'culturally_affirming' => '',
        'keyword'              => '',
    ];

    /** Homepage: search form needs the same vocabulary. */
    public function home(ProviderService $providers, BlogRenderer $renderer): Response
    {
        return Inertia::render('connect/Home', $this->vocabulary($providers) + [
            'filters' => $this->searchFormFilters(),
            'reading' => $this->homeReading($renderer),
        ]);
    }

    /** "Start with understanding." — articles marked for the homepage, else the two newest public articles. */
    private function homeReading(BlogRenderer $renderer): array
    {
        $posts = BlogPost::published()->where('on_homepage', true)->orderByDesc('published_at')->orderBy('id')->limit(2)->get();
        if ($posts->isEmpty()) {
            $posts = BlogPost::published()->where('category', '!=', 'For Providers')->orderByDesc('published_at')->orderBy('id')->limit(2)->get();
        }

        return $posts->map(fn (BlogPost $p) => [
            'slug'     => $p->slug,
            'title'    => $p->title,
            'category' => $p->categoryLabel(),
            'excerpt'  => $p->summary,
            'minutes'  => BlogRenderer::minutes($renderer->plainText($p->body)),
        ])->values()->all();
    }

    public function getHelp(ProviderService $providers): Response
    {
        return Inertia::render('connect/GetHelp', $this->vocabulary($providers) + ['filters' => $this->searchFormFilters()]);
    }

    /** POST /find-support — Home / Get Help search (concern + location), then the directory with a clean address. */
    public function search(Request $request, ProviderService $providers): RedirectResponse
    {
        $data = $request->validate([
            'country'  => ['nullable', 'string', 'max:150'],
            'region'   => ['nullable', 'string', 'max:150'],
            'topic'    => ['nullable', 'string', 'max:100'],
            'virtual'  => ['nullable', 'boolean'],
            'language' => ['nullable', 'string', 'max:100'],
        ]);

        $countries = collect($providers->getCountriesForForm());
        $country = $countries->firstWhere('name', (string) ($data['country'] ?? ''));
        $region = (string) ($data['region'] ?? '');
        $regionOk = $country && collect($country['regions'])->contains(fn ($r) => $r['name'] === $region);
        $topic = (string) ($data['topic'] ?? '');

        $this->store($request, array_merge(self::EMPTY, [
            'location'        => $country['name'] ?? '',
            // The parish/region must belong to the chosen country; otherwise it is cleared.
            'region'          => $regionOk ? $region : '',
            'include_virtual' => $country ? (bool) ($data['virtual'] ?? false) : false,
            'areas'           => ConnectTaxonomy::isTopic($topic) ? ConnectTaxonomy::areasFor($topic) : [],
            'language'        => ! empty($data['language']) ? [(string) $data['language']] : [],
        ]), 1);

        return redirect()->route('connect.results');
    }

    /** POST /find-support/refine — every change made on the directory page (filters, "Load more"). */
    public function refine(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'location'             => ['nullable', 'string', 'max:150'],
            'region'               => ['nullable', 'string', 'max:150'],
            'city'                 => ['nullable', 'string', 'max:150'],
            'include_virtual'      => ['nullable', 'boolean'],
            'areas'                => ['nullable', 'array', 'max:150'],
            'areas.*'              => ['string', 'max:150'],
            'payment'              => ['nullable', 'in:insurance,self_pay,sliding_scale,free_low_cost'],
            'insurer'              => ['nullable', 'string', 'max:150'],
            'fee_min'              => ['nullable', 'integer', 'min:0', 'max:1000000'],
            'fee_max'              => ['nullable', 'integer', 'min:0', 'max:1000000'],
            'population'           => ['nullable', 'string', 'max:150'],
            'session_format'       => ['nullable', 'string', 'max:100'],
            'language'             => ['nullable', 'array', 'max:50'],
            'language.*'           => ['string', 'max:100'],
            'provider_type'        => ['nullable', 'string', 'max:100'],
            'accepting'            => ['nullable', 'boolean'],
            'lgbtq_affirming'      => ['nullable', 'in:yes'],
            'culturally_affirming' => ['nullable', 'in:yes'],
            'keyword'              => ['nullable', 'string', 'max:150'],
            'page'                 => ['nullable', 'integer', 'min:1', 'max:1000'],
        ]);

        $filters = self::EMPTY;
        foreach (self::EMPTY as $key => $default) {
            $value = $data[$key] ?? $default;
            $filters[$key] = match (true) {
                is_bool($default)  => (bool) $value,
                is_array($default) => array_values(array_unique(array_filter(array_map('strval', (array) $value), fn ($v) => trim($v) !== ''))),
                default            => trim((string) $value),
            };
        }

        $this->store($request, $filters, (int) ($data['page'] ?? 1));

        return redirect()->route('connect.results');
    }

    /** GET /find-support — the directory for the stored filters. "?browse=1" (Browse providers) starts fresh, keeping only the location. */
    public function index(Request $request, ProviderService $providers): Response|RedirectResponse
    {
        if ($request->boolean('browse')) {
            $kept = $this->filters();
            $this->store($request, array_merge(self::EMPTY, [
                'location' => $kept['location'],
                'region'   => $kept['region'],
                'city'     => $kept['city'],
            ]), 1, false);

            return redirect()->route('connect.results');
        }

        $filters = $this->filters();
        $page = max(1, (int) $request->session()->pull(self::SESSION_PAGE, 1));
        $seed = (int) $request->session()->get(self::SESSION_SEED, 0) ?: random_int(1, 999999);
        $request->session()->put(self::SESSION_SEED, $seed);

        $directoryFilters = $filters + ['service' => '', 'perPage' => self::PER_PAGE, 'page' => $page, 'seed' => $seed];
        $result = $providers->getPublicDirectory($directoryFilters);

        // Admin dashboard search demand / coverage gaps: once per new search, aggregate only.
        if ($request->session()->pull(self::SESSION_RECORD, false)) {
            DirectorySearch::record($directoryFilters, (int) ($result['pagination']['total'] ?? 0), $request);
        }

        return Inertia::render('connect/FindSupport', [
            'providers'     => $result['providers'],
            'pagination'    => $result['pagination'],
            'filters'       => $filters,
            'seed'          => $result['seed'],
            'dataVersion'   => $result['pagination']['total'] . '-' . now()->timestamp,
            'filterOptions' => fn () => $providers->getFilterOptions(),
            'countries'     => fn () => $providers->getCountriesForForm(),
            'content'       => fn () => app(ProviderDirectoryPageService::class)->getContent(),
        ]);
    }

    /** GET /provider-profile/{id} — approved, published profiles only (404 otherwise). */
    public function profile(int $id, ProviderService $providers): Response
    {
        $provider = $providers->getPublicProfile($id);
        abort_if($provider === null, 404);

        return Inertia::render('connect/ProviderProfile', [
            'provider' => $provider,
            'content'  => app(ProviderProfilePageService::class)->getContent(),
        ]);
    }

    /* ------------------------------------------------------------------ */

    /** Save the filters; a first page means a new search (new order + one search-demand record). */
    private function store(Request $request, array $filters, int $page, bool $record = true): void
    {
        $request->session()->put(self::SESSION_FILTERS, $filters);
        $request->session()->put(self::SESSION_PAGE, max(1, $page));
        if ($page <= 1) {
            $request->session()->put(self::SESSION_SEED, random_int(1, 999999));
            if ($record) {
                $request->session()->put(self::SESSION_RECORD, true);
            }
        }
    }

    private function filters(): array
    {
        return array_merge(self::EMPTY, (array) session(self::SESSION_FILTERS, []));
    }

    /** Home / Get Help form: the stored location, virtual choice and (when it matches exactly) the concern. */
    private function searchFormFilters(): array
    {
        $f = $this->filters();
        $areas = $f['areas'];
        sort($areas);
        $topic = '';
        foreach (ConnectTaxonomy::topics() as $t) {
            $candidate = ConnectTaxonomy::areasFor($t['name']);
            sort($candidate);
            if ($areas && $candidate === $areas) {
                $topic = $t['name'];
                break;
            }
        }

        return [
            'country'  => $f['location'],
            'region'   => $f['region'],
            'topic'    => $topic,
            'virtual'  => (bool) $f['include_virtual'],
            'language' => $f['language'][0] ?? '',
            'role'     => '',
        ];
    }

    private function vocabulary(ProviderService $providers): array
    {
        return [
            'topics'    => ConnectTaxonomy::topics(),
            'countries' => $providers->getCountriesForForm(),
        ];
    }
}
