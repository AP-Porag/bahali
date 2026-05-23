<?php
// app/Models/Provider.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Provider extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'name',
        'organization_name',
        'slug',
        'bio',
        'verification_status',
        'offers_in_person',
        'offers_virtual',
        'offers_hybrid',
        'offers_home_based',
        'offers_group_based',
        'address',
        'city',
        'state',
        'country',
        'postal_code',
        'latitude',
        'longitude',
        'regions_served',
        'email',
        'phone',
        'website',
        'booking_link',
        'fees_description',
        'accepts_insurance',
        'offers_sliding_scale',
        'free_community_service',
        'is_published',
        'is_featured',
        'verified_at',
        'admin_notes',
    ];

    protected $casts = [
        'offers_in_person' => 'boolean',
        'offers_virtual' => 'boolean',
        'offers_hybrid' => 'boolean',
        'offers_home_based' => 'boolean',
        'offers_group_based' => 'boolean',
        'accepts_insurance' => 'boolean',
        'offers_sliding_scale' => 'boolean',
        'free_community_service' => 'boolean',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
        'verified_at' => 'datetime',
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
    ];

    protected $dates = [
        'verified_at',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function professions()
    {
        return $this->belongsToMany(ProviderProfession::class, 'provider_profession')
            ->withPivot('is_primary', 'custom_profession', 'requires_admin_review')
            ->withTimestamps();
    }

    public function credentials()
    {
        return $this->belongsToMany(Credential::class, 'provider_credential')
            ->withPivot(
                'license_number',
                'issuing_authority',
                'issue_date',
                'expiry_date',
                'is_verified',
                'verified_at',
                'verification_notes'
            )
            ->withTimestamps();
    }

    public function supportAreas()
    {
        return $this->belongsToMany(SupportArea::class, 'provider_support_area')
            ->withPivot('is_primary')
            ->withTimestamps();
    }

    public function languages()
    {
        return $this->belongsToMany(Language::class, 'provider_language')
            ->withPivot('proficiency')
            ->withTimestamps();
    }

    public function populations()
    {
        return $this->belongsToMany(Population::class, 'provider_population')
            ->withTimestamps();
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeVerified($query)
    {
        return $query->whereNotNull('verified_at');
    }

    public function scopeByProfession($query, $professionSlug)
    {
        return $query->whereHas('professions', function ($q) use ($professionSlug) {
            $q->where('slug', $professionSlug);
        });
    }

    public function scopeByCategory($query, $categorySlug)
    {
        return $query->whereHas('professions.category', function ($q) use ($categorySlug) {
            $q->where('slug', $categorySlug);
        });
    }

    public function scopeBySupportArea($query, $supportAreaSlug)
    {
        return $query->whereHas('supportAreas', function ($q) use ($supportAreaSlug) {
            $q->where('slug', $supportAreaSlug);
        });
    }

    // Accessors & Mutators
    public function getServiceFormatsAttribute()
    {
        $formats = [];
        if ($this->offers_in_person) $formats[] = 'in_person';
        if ($this->offers_virtual) $formats[] = 'virtual';
        if ($this->offers_hybrid) $formats[] = 'hybrid';
        if ($this->offers_home_based) $formats[] = 'home_based';
        if ($this->offers_group_based) $formats[] = 'group_based';
        return $formats;
    }

    public function getIsLicensedProviderAttribute()
    {
        return in_array($this->verification_status, ['verified_licensed']);
    }

    public function getFullAddressAttribute()
    {
        return implode(', ', array_filter([
            $this->address,
            $this->city,
            $this->state,
            $this->postal_code,
            $this->country
        ]));
    }

    // Helper Methods
    public function verify()
    {
        $this->verified_at = now();
        $this->verification_status = 'verified_licensed';
        $this->save();
    }

    public function publish()
    {
        $this->is_published = true;
        $this->save();
    }

    public function unpublish()
    {
        $this->is_published = false;
        $this->save();
    }

    public function getPrimaryProfession()
    {
        return $this->professions()->wherePivot('is_primary', true)->first();
    }

    public function hasProfession($slug)
    {
        return $this->professions()->where('slug', $slug)->exists();
    }

    public function isClinicalProvider()
    {
        return $this->professions()->where('is_clinical', true)->exists();
    }
}
