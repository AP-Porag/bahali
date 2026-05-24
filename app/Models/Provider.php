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
        // Basic Information
        'provider_name',
        'email',
        'phone',

        // Location Information
        'country_id',
        'region_type',
        'region',
        'city_town',
        'service_area',

        // Service Format
        'service_format',

        // Professional Information
        'professions',
        'credentials',
        'support_areas',

        // Private Address
        'street_address1',
        'street_address2',
        'postal_code',
        'latitude',
        'longitude',

        // Admin Address
        'verification_address',
        'billing_address',

        // Visibility Settings
        'address_visibility_preference',
        'location_sensitivity_flag',

        // Status
        'status',
        'email_verified_at',
        'approved_at',
        'approved_by',
    ];

    protected $casts = [
        // Cast JSON fields to arrays
        'professions' => 'array',
        'credentials' => 'array',
        'support_areas' => 'array',

    ];

    // Relationships
    public function country()
    {
        return $this->belongsTo(Country::class);
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
}
