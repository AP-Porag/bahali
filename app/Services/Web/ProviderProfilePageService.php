<?php

namespace App\Services\Web;

use App\Models\PageContent;
use App\Services\BaseService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class ProviderProfilePageService extends BaseService
{
    public const PAGE = 'provider-profile';

    private const CACHE_KEY = 'page_content_provider_profile';

    private const UPLOAD_DIR = 'page-contents/provider-profile';

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
                'key' => 'page',
                'title' => 'Page Header',
                'description' => 'Links above the provider profile card.',
                'fields' => [
                    self::field('page.back', 'Back Link Text', 'text', 'Back to results'),
                    self::field('page.eyebrow', 'Eyebrow', 'text', 'Provider profile'),
                ],
            ],
            [
                'key' => 'availability',
                'title' => 'Availability Box',
                'description' => 'Helper notes inside the "Current availability" box.',
                'fields' => [
                    self::field('availability.accepting_note', 'Accepting — Note', 'text', 'This information is provided by the provider.'),
                    self::field('availability.unknown_note', 'Availability Unknown — Note', 'textarea', 'Contact the provider directly to confirm current availability.'),
                ],
            ],
            [
                'key' => 'contact',
                'title' => 'Contact Panel',
                'description' => 'Text in the contact box, the mobile contact popup and the mobile contact bar.',
                'fields' => [
                    self::field('contact.disclaimer', 'Contact Box Disclaimer', 'textarea', 'Bahali does not manage appointments or communications between you and the provider.'),
                    self::field('contact.modal_intro', 'Mobile Popup Intro', 'textarea', 'Reach the provider directly. Bahali does not manage appointments or communications between you and the provider.'),
                    self::field('contact.empty', 'No Contact Method Text', 'text', "This provider hasn't listed a contact method yet."),
                    self::field('contact.mobile_button', 'Mobile Button Text', 'text', 'Contact provider'),
                ],
            ],
            [
                'key' => 'crisis',
                'title' => 'Crisis Note',
                'description' => 'Small safety note under the contact options.',
                'fields' => [
                    self::field('crisis.label', 'Bold Label', 'text', 'Please note.'),
                    self::field('crisis.body', 'Note Text', 'textarea', 'If you are in crisis or need immediate support, contact your local emergency services or a crisis helpline. Bahali is not an emergency service.'),
                ],
            ],
            [
                'key' => 'fees',
                'title' => 'Fees & Insurance',
                'description' => 'Fallback and helper text for fees and insurance.',
                'fields' => [
                    self::field('fees.no_fee', 'No Fee Listed Text', 'text', 'Contact provider for fee information'),
                    self::field('fees.insurance_note', 'Insurance Note', 'text', 'Coverage varies by plan — confirm directly with the provider.'),
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
