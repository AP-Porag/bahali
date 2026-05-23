<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    use HasFactory;

    protected $table = 'cities';

    protected $fillable = [
        'country_id',
        'region_id',
        'name',
        'slug',
        'is_major',
    ];

    /**
     * Relationship: City belongs to Country
     */
    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    /**
     * Relationship: City belongs to Region (optional)
     */
    public function region()
    {
        return $this->belongsTo(Region::class);
    }
}
