<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * A search made in the public provider directory (no personal data).
 * Feeds the admin dashboard: search demand, zero-result searches and coverage gaps.
 */
class DirectorySearch extends Model
{
    public const UPDATED_AT = null;

    protected $fillable = [
        'location',
        'region',
        'city',
        'areas',
        'keyword',
        'include_virtual',
        'results_count',
    ];

    protected $casts = [
        'areas'           => 'array',
        'include_virtual' => 'boolean',
        'results_count'   => 'integer',
        'created_at'      => 'datetime',
    ];

    /**
     * Log one directory search. Only real searches are logged (a location, an area of support
     * or a keyword was chosen), and the same search is counted once per visitor session, so
     * paging through results or reloading the page doesn't inflate the numbers.
     */
    public static function record(array $filters, int $resultsCount, Request $request): void
    {
        try {
            $location = trim((string) ($filters['location'] ?? ''));
            $keyword  = trim((string) ($filters['keyword'] ?? ''));
            $areas    = array_values(array_filter(array_map('trim', (array) ($filters['areas'] ?? []))));

            if ($location === '' && $keyword === '' && empty($areas)) {
                return; // just browsing
            }

            $row = [
                'location'        => $location ?: null,
                'region'          => trim((string) ($filters['region'] ?? '')) ?: null,
                'city'            => trim((string) ($filters['city'] ?? '')) ?: null,
                'areas'           => $areas ?: null,
                'keyword'         => $keyword !== '' ? mb_substr($keyword, 0, 160) : null,
                'include_virtual' => (bool) ($filters['include_virtual'] ?? false),
            ];

            // Same search in the same session → count once.
            if ($request->hasSession()) {
                $signature = md5(json_encode($row));
                $seen = (array) $request->session()->get('directory_search_log', []);
                if (in_array($signature, $seen, true)) {
                    return;
                }
                $seen[] = $signature;
                $request->session()->put('directory_search_log', array_slice($seen, -30));
            }

            static::create($row + ['results_count' => max(0, $resultsCount)]);
        } catch (\Throwable $e) {
            // Logging must never break the directory page.
            Log::warning('[directory-search] Could not log search', ['error' => $e->getMessage()]);
        }
    }
}
