<?php
// database/seeders/ProviderProfessionCategorySeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProviderProfessionCategory;
use Illuminate\Support\Str;

class ProviderProfessionCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Clinical & Mental Health Professionals',
                'slug' => 'clinical-mental-health',
                'description' => 'Licensed clinical and mental health professionals',
                'display_order' => 1,
            ],
            [
                'name' => 'Assessment & Educational Specialists',
                'slug' => 'assessment-educational',
                'description' => 'Assessment and educational specialists',
                'display_order' => 2,
            ],
            [
                'name' => 'Medical & Health Professionals',
                'slug' => 'medical-health',
                'description' => 'Medical and health professionals',
                'display_order' => 3,
            ],
            [
                'name' => 'Family, Parenting & Perinatal Support',
                'slug' => 'family-parenting-perinatal',
                'description' => 'Family, parenting and perinatal support providers',
                'display_order' => 4,
            ],
            [
                'name' => 'Faith-Based & Spiritual Support Providers',
                'slug' => 'faith-based-spiritual',
                'description' => 'Faith-based and spiritual support providers',
                'display_order' => 5,
            ],
            [
                'name' => 'Community-Based Support Providers',
                'slug' => 'community-based',
                'description' => 'Community-based support providers',
                'display_order' => 6,
            ],
            [
                'name' => 'Creative & Holistic Wellness Providers',
                'slug' => 'creative-holistic',
                'description' => 'Creative and holistic wellness providers',
                'display_order' => 7,
            ],
            [
                'name' => 'Aging & Caregiver Support',
                'slug' => 'aging-caregiver',
                'description' => 'Aging and caregiver support providers',
                'display_order' => 8,
            ],
            [
                'name' => 'Organizational & Program Providers',
                'slug' => 'organizational-program',
                'description' => 'Organizational and program providers',
                'display_order' => 9,
            ],
        ];

        foreach ($categories as $category) {
            ProviderProfessionCategory::create($category);
        }
    }
}
