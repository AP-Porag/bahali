<?php

namespace App\Services\Web;

use App\Models\PageContent;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

/**
 * Bahali Connect website text (Admin → CMS → Home / Website Pages).
 * Same storage and behaviour as ProviderDirectoryPageService: page_contents rows (page = "connect-{page}"),
 * defaults from ConnectContentSchema. Only the saved values are cached (until an editor saves); the defaults are
 * merged on every request, so a deploy that adds a field or changes a default shows it without `cache:clear`.
 */
class ConnectContentService
{
    private const UPLOAD_DIR = 'page-contents/connect';

    /** Max length per field type (also used by the admin form). */
    public const MAX_LENGTH = ['text' => 500, 'textarea' => 5000, 'markdown' => 30000];

    public static function exists(string $page): bool
    {
        return array_key_exists($page, ConnectContentSchema::pages());
    }

    /** Flat list of a page's fields keyed by field key. */
    public static function fields(string $page): array
    {
        return collect(ConnectContentSchema::sections($page))
            ->flatMap(fn (array $section) => $section['fields'])
            ->keyBy('key')
            ->all();
    }

    public static function keys(string $page): array
    {
        return array_keys(self::fields($page));
    }

    public static function fieldType(string $page, ?string $key): ?string
    {
        return $key ? (self::fields($page)[$key]['type'] ?? null) : null;
    }

    /* ------------------------------------------------------------------ */
    /*  Read                                                               */
    /* ------------------------------------------------------------------ */

    /** Public page text: defaults merged with saved values. */
    public function getContent(string $page): array
    {
        if (! self::exists($page)) {
            return [];
        }

        $defaults = collect(self::fields($page))
            ->mapWithKeys(fn (array $field) => [$field['key'] => $field['default']])
            ->all();

        $saved = Cache::rememberForever(self::cacheKey($page), fn () => PageContent::query()
            ->where('page', self::storagePage($page))
            ->pluck('value', 'key')
            ->filter(fn ($value) => $value !== null && $value !== '')
            ->all());

        // Saved values for fields that no longer exist in the schema are ignored.
        return array_merge($defaults, array_intersect_key($saved, $defaults));
    }

    /** Admin view: sections with the current value (and default) on each field. */
    public function getAdminSections(string $page): array
    {
        $content = $this->getContent($page);

        return collect(ConnectContentSchema::sections($page))
            ->map(function (array $section) use ($content) {
                $section['fields'] = collect($section['fields'])
                    ->map(fn (array $field) => [
                        'key'       => $field['key'],
                        'label'     => $field['label'],
                        'type'      => $field['type'],
                        'group'     => $field['group'],
                        'hint'      => $field['hint'],
                        'value'     => $content[$field['key']] ?? $field['default'],
                        'default'   => $field['default'],
                        'maxLength' => self::MAX_LENGTH[$field['type']] ?? null,
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

    public function updateText(string $page, string $key, string $value): void
    {
        $this->save($page, $key, trim(str_replace(["\r\n", "\r"], "\n", $value)));
    }

    public function updateImage(string $page, string $key, UploadedFile $file): void
    {
        $old = $this->getContent($page)[$key] ?? null;

        // Read from the temp path directly — $file->store() relies on getRealPath(),
        // which returns false on some Windows setups ("Path cannot be empty").
        $path = self::UPLOAD_DIR . '/' . $page . '/' . $file->hashName();
        $stream = fopen($file->getPathname(), 'r');

        Storage::disk('public')->put($path, $stream);

        if (is_resource($stream)) {
            fclose($stream);
        }

        $this->save($page, $key, '/storage/' . $path);

        // Remove the previously uploaded file (never touches the default /images/* file).
        if ($old && str_starts_with($old, '/storage/' . self::UPLOAD_DIR . '/')) {
            Storage::disk('public')->delete(substr($old, strlen('/storage/')));
        }
    }

    /** "Reset to default": removes the saved value so the original text/image is used again. */
    public function reset(string $page, string $key): void
    {
        $old = $this->getContent($page)[$key] ?? null;

        PageContent::query()->where('page', self::storagePage($page))->where('key', $key)->delete();
        Cache::forget(self::cacheKey($page));

        if ($old && self::fieldType($page, $key) === 'image' && str_starts_with($old, '/storage/' . self::UPLOAD_DIR . '/')) {
            Storage::disk('public')->delete(substr($old, strlen('/storage/')));
        }
    }

    private function save(string $page, string $key, string $value): void
    {
        PageContent::updateOrCreate(
            ['page' => self::storagePage($page), 'key' => $key],
            ['value' => $value]
        );

        Cache::forget(self::cacheKey($page));
    }

    private static function storagePage(string $page): string
    {
        return 'connect-' . $page;
    }

    private static function cacheKey(string $page): string
    {
        // "saved_": this cache holds only the editor's saved values (older caches held the merged text).
        return 'page_content_connect_saved_' . $page;
    }
}
