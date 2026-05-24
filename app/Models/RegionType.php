<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegionType extends Model
{
    use HasFactory;

    protected $table = 'region_types';

    protected $fillable = [
        'name',
        'label',
    ];

    public function regions()
    {
        return $this->hasMany(Region::class);
    }
}
