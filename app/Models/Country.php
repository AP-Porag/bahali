<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    use HasFactory;

    protected $table = 'countries';

    protected $fillable = [
        'name',
        'code',
        'is_caribbean',
        'is_diaspora',
        'display_order',
    ];

    protected $casts = [
        'is_caribbean' => 'boolean',
        'is_diaspora' => 'boolean',
        'display_order' => 'integer',
    ];
}
