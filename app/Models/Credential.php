<?php
// app/Models/Credential.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Credential extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'type',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function providers()
    {
        return $this->belongsToMany(Provider::class, 'provider_credential')
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

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }
}
