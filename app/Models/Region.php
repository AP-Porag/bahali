<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    use HasFactory;

    protected $table = 'regions';

    protected $fillable = [
        'country_id',
        'region_type_id',
        'name',
        'slug',
        'is_active',
        'display_order',
    ];

    /**
     * Relationship: Region belongs to Country
     */
    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    /**
     * Relationship: Region belongs to RegionType
     */
    public function regionType()
    {
        return $this->belongsTo(RegionType::class);
    }
}
