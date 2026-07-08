<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProviderSupportArea extends Model
{
    protected $fillable = ['provider_id', 'category', 'area'];

    public function provider(): BelongsTo
    {
        return $this->belongsTo(Provider::class);
    }
}
