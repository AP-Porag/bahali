<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Provider extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'is_public',
        'email',
        'phone',
        'provider_type_id',
        'region',
        'service',
        'status',
        'verification_status',
        'bio',
        'location',
        'avatar',
        'verified_at',
        'published_at',
        'verification_expires_at',
        'suspended_at',
        'internal_notes	',
        'suspension_reason',
        'approved_by',
    ];

    public function providerType()
    {
        return $this->belongsTo(ProviderType::class, 'provider_type_id');
    }
}
