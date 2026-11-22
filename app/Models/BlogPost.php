<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Bahali Connect blog article. Public pages, search, homepage cards and related links only ever
 * read published() records — drafts, review copies and archived posts are never exposed.
 */
class BlogPost extends Model
{
    public const CATEGORIES = ['Taking the first step', 'Finding your fit', 'Supporting someone', 'For Providers'];

    /** Visitor-facing category names (reference BlogPages.jsx → categoryLabel). */
    public const CATEGORY_LABELS = [
        'Taking the first step' => 'Considering support',
        'Finding your fit'      => 'Finding your way',
        'Supporting someone'    => 'Supporting someone',
        'For Providers'         => 'For Providers',
    ];

    public const STATUSES = [
        'draft'     => 'Draft',
        'in_review' => 'In review',
        'approved'  => 'Approved',
        'scheduled' => 'Scheduled',
        'published' => 'Published',
        'archived'  => 'Archived',
    ];

    protected $fillable = [
        'title', 'slug', 'summary', 'category', 'reading_paths', 'body', 'image', 'image_alt',
        'author_name', 'author_role', 'reviewer_name', 'reviewed_at', 'margin_quote', 'cta_label', 'cta_url',
        'signoff', 'signature', 'related_post_ids', 'is_featured', 'on_homepage', 'seo_title', 'seo_description',
        'status', 'published_at', 'created_by', 'updated_by',
    ];

    protected $casts = [
        'reading_paths'    => 'array',
        'related_post_ids' => 'array',
        'is_featured'      => 'boolean',
        'on_homepage'      => 'boolean',
        'reviewed_at'      => 'date',
        'published_at'     => 'datetime',
    ];

    /** Live on the site: published, or scheduled with a publish time that has passed. */
    public function scopePublished(Builder $query): Builder
    {
        return $query->whereIn('status', ['published', 'scheduled'])
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function isPublic(): bool
    {
        return in_array($this->status, ['published', 'scheduled'], true) && $this->published_at && $this->published_at->lte(now());
    }

    public function redirects(): HasMany
    {
        return $this->hasMany(BlogPostRedirect::class);
    }

    public function categoryLabel(): string
    {
        return self::CATEGORY_LABELS[$this->category] ?? $this->category;
    }
}
