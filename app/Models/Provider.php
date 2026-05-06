<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Provider extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'provider_type_id',
        'region',
        'service',
        'status',
        'bio',
        'location',
        'avatar'
    ];

    public function providerType()
    {
        return $this->belongsTo(ProviderType::class, 'provider_type_id');
    }
}
