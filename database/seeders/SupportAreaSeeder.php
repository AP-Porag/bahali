<?php
// database/seeders/SupportAreaSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SupportArea;

class SupportAreaSeeder extends Seeder
{
    public function run(): void
    {
        $supportAreas = [
            'Anxiety',
            'Depression',
            'Trauma / PTSD',
            'Grief & Loss',
            'Parenting',
            'Children & Adolescents',
            'Family Conflict',
            'Couples & Relationships',
            'Substance Use',
            'Stress Management',
            'Burnout',
            'School Concerns',
            'Identity & Cultural Adjustment',
            'Immigration Stress',
            'Disaster Recovery',
            'Sexual Trauma',
            'Postpartum Mental Health',
            'Behavioral Challenges',
            'ADHD',
            'Autism',
            'Aging & Caregiving',
            'Spiritual Care',
            'Community Healing',
        ];

        foreach ($supportAreas as $index => $area) {
            SupportArea::create([
                'name' => $area,
                'slug' => \Illuminate\Support\Str::slug($area),
                'description' => 'Support for ' . strtolower($area),
                'display_order' => $index + 1,
            ]);
        }
    }
}
