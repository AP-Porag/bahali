<?php
// app/Models/Provider.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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
        'telehealth_regions_other',

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
        'note',

        // Consent
        'consent_accurate',
        'consent_notify',
        'consent_no_endorsement',
        'consent_public',

        // NEW: Professional Expertise
        'treatment_approaches',
        'specialized_training',
        'certifications',
        'accessibility',
    ];

    protected $casts = [
        'license_states'       => 'array',
        'professional_title'   => 'array',
        'areas_of_support'     => 'array',
        'populations_served'   => 'array',
        'languages'            => 'array',
        'service_formats'      => 'array',
        'practice_settings'    => 'array',
        'telehealth_regions'   => 'array',
        'payment_methods'      => 'array',
        'accessibility'        => 'array',
        'additional_photos'    => 'array',
        'treatment_approaches' => 'array',
        'specialized_training' => 'array',
        'certifications'       => 'array',
        'hide_address'         => 'boolean',
        'consent_accurate'     => 'boolean',
        'consent_notify'       => 'boolean',
        'consent_no_endorsement' => 'boolean',
        'consent_public'       => 'boolean',
        'reviewed_at'          => 'datetime',
        'license_verified_at'  => 'datetime',
    ];

    // Relationships
    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function supportAreas(): HasMany
    {
        return $this->hasMany(ProviderSupportArea::class);
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
}
