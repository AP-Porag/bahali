<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/** Old blog address → article (kept when an article's slug changes). */
class BlogPostRedirect extends Model
{
    protected $fillable = ['old_slug', 'blog_post_id'];

    public function post(): BelongsTo
    {
        return $this->belongsTo(BlogPost::class, 'blog_post_id');
    }
}
