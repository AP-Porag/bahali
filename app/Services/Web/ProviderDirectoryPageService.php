<?php

namespace App\Services\Web;

use App\Models\PageContent;
use App\Services\BaseService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class ProviderDirectoryPageService extends BaseService
{
    public const PAGE = 'provider-directory';

    private const CACHE_KEY = 'page_content_provider_directory';

    private const UPLOAD_DIR = 'page-contents/provider-directory';

    public function __construct()
    {
        parent::__construct(new PageContent());
    }

    /* ------------------------------------------------------------------ */
    /*  Schema — single source of truth for every editable field          */
    /*  type: text | textarea | image                                      */
    /* ------------------------------------------------------------------ */
    public static function schema(): array
    {
        return [
            [
                'key' => 'seo',
                'title' => 'SEO & Meta',
                'description' => 'Browser tab title for the provider directory.',
                'fields' => [
                    self::field('seo.title', 'Page Title', 'text', 'Find the right support — Bahali'),
                ],
            ],
            [
                'key' => 'hero',
                'title' => 'Hero',
                'description' => 'Intro text and image at the top of the directory.',
                'fields' => [
                    self::field('hero.image', 'Hero Image', 'image', '/images/hero-caribbean-adults.png', null, 'Transparent PNG works best — it sits in the top-right corner on desktop (about 1040×760).'),
                    self::field('hero.eyebrow', 'Eyebrow', 'text', 'Find culturally-grounded care'),
                    self::field('hero.title', 'Heading', 'text', 'Let’s help you find support'),
                    self::field('hero.description', 'Description', 'textarea', 'Answer as much or as little as you like. You don’t need to know what kind of professional you’re looking for.'),
                ],
            ],
            [
                'key' => 'search',
                'title' => 'Find Support Panel',
                'description' => 'Labels and questions in the search panel.',
                'fields' => [
                    self::field('search.label', 'Panel Label', 'text', 'Find support'),
                    self::field('search.location_question', 'Location Question', 'text', 'Where are you looking for support?'),
                    self::field('search.areas_question', 'Areas Question', 'text', 'What would you like help with?'),
                    self::field('search.areas_hint', 'Areas Helper Text', 'text', 'Select one or more.'),
                    self::field('search.button', 'Search Button Text', 'text', 'Find providers'),
                ],
            ],
            [
                'key' => 'crisis',
                'title' => 'Crisis Notice',
                'description' => 'Safety notice shown when a search contains crisis keywords.',
                'fields' => [
                    self::field('crisis.title', 'Notice Heading', 'textarea', 'If you’re in immediate danger, please contact your local emergency services or a crisis line right away.'),
                    self::field('crisis.body', 'Notice Text', 'textarea', 'Bahali is a directory to help you find a provider — it is not an emergency service and cannot provide crisis support.'),
                ],
            ],
            [
                'key' => 'empty',
                'title' => 'No Results',
                'description' => 'Message shown when no provider matches the search.',
                'fields' => [
                    self::field('empty.title', 'Heading', 'text', 'We didn’t find an exact match for your selections'),
                    self::field('empty.body', 'Description', 'textarea', 'Try one of these adjustments — each keeps your other filters in place.'),
                ],
            ],
        ];
    }

    /* ------------------------------------------------------------------ */
    /*  Schema helpers                                                     */
    /* ------------------------------------------------------------------ */

    private static function field(
        string $key,
        string $label,
        string $type,
        string $default,
        ?string $group = null,
        ?string $hint = null
    ): array {
        return compact('key', 'label', 'type', 'default', 'group', 'hint');
    }

    /** Flat list of all fields keyed by field key. */
    public static function fields(): array
    {
        return collect(self::schema())
            ->flatMap(fn(array $section) => $section['fields'])
            ->keyBy('key')
            ->all();
    }

    public static function keys(): array
    {
        return array_keys(self::fields());
    }

    public static function fieldType(?string $key): ?string
    {
        if (! $key) {
            return null;
        }

        return self::fields()[$key]['type'] ?? null;
    }

    /* ------------------------------------------------------------------ */
    /*  Read                                                               */
    /* ------------------------------------------------------------------ */

    /** Public page content: defaults merged with saved values. */
    public function getContent(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, function () {
            $defaults = collect(self::fields())
                ->mapWithKeys(fn(array $field) => [$field['key'] => $field['default']])
                ->all();

            $saved = PageContent::query()
                ->where('page', self::PAGE)
                ->whereIn('key', array_keys($defaults))
                ->pluck('value', 'key')
                ->filter(fn($value) => $value !== null && $value !== '')
                ->all();

            return array_merge($defaults, $saved);
        });
    }

    /** Admin view: schema sections with the current value on each field. */
    public function getAdminSections(): array
    {
        $content = $this->getContent();

        return collect(self::schema())
            ->map(function (array $section) use ($content) {
                $section['fields'] = collect($section['fields'])
                    ->map(fn(array $field) => [
                        'key' => $field['key'],
                        'label' => $field['label'],
                        'type' => $field['type'],
                        'group' => $field['group'],
                        'hint' => $field['hint'],
                        'value' => $content[$field['key']] ?? $field['default'],
                    ])
                    ->values()
                    ->all();

                return $section;
            })
            ->values()
            ->all();
    }

    /* ------------------------------------------------------------------ */
    /*  Write                                                              */
    /* ------------------------------------------------------------------ */

    public function updateText(string $key, string $value): void
    {
        $this->save($key, trim($value));
    }

    public function updateImage(string $key, UploadedFile $file): void
    {
        $old = $this->getContent()[$key] ?? null;

        // Read from the temp path directly — $file->store() relies on getRealPath(),
        // which returns false on some Windows setups ("Path cannot be empty").
        $path = self::UPLOAD_DIR . '/' . $file->hashName();
        $stream = fopen($file->getPathname(), 'r');

        Storage::disk('public')->put($path, $stream);

        if (is_resource($stream)) {
            fclose($stream);
        }

        $this->save($key, '/storage/' . $path);

        // Remove the previously uploaded file (never touches the default /images/* file)
        if ($old && str_starts_with($old, '/storage/' . self::UPLOAD_DIR . '/')) {
            Storage::disk('public')->delete(substr($old, strlen('/storage/')));
        }
    }

    private function save(string $key, string $value): void
    {
        PageContent::updateOrCreate(
            ['page' => self::PAGE, 'key' => $key],
            ['value' => $value]
        );

        Cache::forget(self::CACHE_KEY);
    }
}
