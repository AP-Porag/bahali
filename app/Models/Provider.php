<?php
// app/Models/Provider.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Provider extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',

        // Basic
        'provider_type',
        'organization_name',
        'credentials',
        'professional_title',
        'professional_title_other',

        // About
        'short_bio',
        'years_experience',

        // Licensure
        'license_number',
        'license_states',
        'license_status',
        'verification_document',

        // Support / populations
        'areas_of_support',
        'areas_of_support_other',
        'populations_served',

        // Culture & language
        'caribbean_identity',
        'caribbean_experience',
        'languages',
        'languages_other',
        'cultural_approach',

        // Service
        'service_formats',
        'practice_settings',

        // Location
        'address',
        'city',
        'state_province',
        'country',
        'multiple_locations',
        'hide_address',
        'telehealth_regions',

        // Payment
        'payment_methods',
        'insurance_plans',

        // Contact
        'phone',
        'website',
        'social_links',

        // Media
        'profile_photo',
        'additional_photos',

        // Status
        'status',

        // Note
        'note',

        // Accessibility
        'accessibility',

        // Consent
        'consent_accurate',
        'consent_notify',
        'consent_no_endorsement',
        'consent_public',
    ];

    protected $casts = [
        'license_states'      => 'array',
        'professional_title' => 'array',
        'areas_of_support'    => 'array',
        'populations_served'  => 'array',
        'languages'           => 'array',
        'service_formats'     => 'array',
        'practice_settings'   => 'array',
        'telehealth_regions'  => 'array',
        'payment_methods'     => 'array',
        'accessibility'       => 'array',
        'additional_photos'   => 'array',
        'hide_address'            => 'boolean',
        'consent_accurate'        => 'boolean',
        'consent_notify'          => 'boolean',
        'consent_no_endorsement'  => 'boolean',
        'consent_public'          => 'boolean',
        'is_public'              => 'boolean',
        'reviewed_at'            => 'datetime',
        'license_verified_at'    => 'datetime',





    ];

    // Relationships
    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    // User রিলেশনশিপ
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeVirtual($query)
    {
        return $query->where('service_format', 'virtual');
    }

    public function scopeInPerson($query)
    {
        return $query->where('service_format', 'in_person');
    }

    // Accessors & Mutators
    public function getFullAddressAttribute(): string
    {
        $parts = array_filter([
            $this->street_address1,
            $this->street_address2,
            $this->city_town,
            $this->region,
            $this->postal_code,
        ]);

        return implode(', ', $parts);
    }

    public function getPublicAddressAttribute(): ?string
    {
        return match ($this->address_visibility_preference) {
            'no_display' => null,
            'city_region_only' => implode(', ', array_filter([$this->city_town, $this->region])),
            'service_area' => $this->service_area,
            'full_address' => $this->full_address,
            default => null,
        };
    }

    // Helper Methods
    public function approve(?int $approvedBy = null): void
    {
        $this->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => $approvedBy,
        ]);
    }

    public function reject(): void
    {
        $this->update(['status' => 'rejected']);
    }

    public function suspend(): void
    {
        $this->update(['status' => 'suspended']);
    }

    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    public function supportAreas(): HasMany
    {
        return $this->hasMany(ProviderSupportArea::class);
    }
}
