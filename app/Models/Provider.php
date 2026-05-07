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
        'email',
        'phone',
        'provider_type_id',
        'region',
        'service',
        'status',
        'verification_status',
        'bio',
        'location',
        'avatar'
    ];

    public function providerType()
    {
        return $this->belongsTo(ProviderType::class, 'provider_type_id');
    }
}
