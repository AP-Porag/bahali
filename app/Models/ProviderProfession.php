<?php
// app/Models/ProviderProfession.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProviderProfession extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'is_clinical',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'is_clinical' => 'boolean',
        'is_active' => 'boolean',
        'display_order' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(ProviderProfessionCategory::class, 'provider_profession_category_id');
    }

    public function providers()
    {
        return $this->belongsToMany(Provider::class, 'provider_profession')
            ->withPivot('is_primary', 'custom_profession', 'requires_admin_review')
            ->withTimestamps();
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeClinical($query)
    {
        return $query->where('is_clinical', true);
    }

    public function scopeNonClinical($query)
    {
        return $query->where('is_clinical', false);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order');
    }
}
