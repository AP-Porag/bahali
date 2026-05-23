<?php
// database/seeders/RegionTypeSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RegionTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $regionTypes = [
            // Caribbean Region Types
            ['name' => 'District / Village', 'label' => 'Select District / Village'],
            ['name' => 'Parish / Dependency', 'label' => 'Select Parish / Dependency'],
            ['name' => 'Region / District', 'label' => 'Select Region / District'],
            ['name' => 'Island / District', 'label' => 'Select Island / District'],
            ['name' => 'Parish', 'label' => 'Select Parish'],
            ['name' => 'District', 'label' => 'Select District'],
            ['name' => 'Parish / Municipality', 'label' => 'Select Parish / Municipality'],
            ['name' => 'District / Area', 'label' => 'Select District / Area'],
            ['name' => 'Province', 'label' => 'Select Province'],
            ['name' => 'Province / National District', 'label' => 'Select Province / National District'],
            ['name' => 'Arrondissement / Commune', 'label' => 'Select Arrondissement / Commune'],
            ['name' => 'Region', 'label' => 'Select Region'],
            ['name' => 'Department', 'label' => 'Select Department'],
            ['name' => 'Municipality', 'label' => 'Select Municipality'],
            ['name' => 'Village / Area', 'label' => 'Select Village / Area'],
            ['name' => 'Quarter / Area', 'label' => 'Select Quarter / Area'],
            ['name' => 'Territory / Area', 'label' => 'Select Territory / Area'],
            ['name' => 'Area', 'label' => 'Select Area'],
            ['name' => 'Municipality / Borough / City / Ward', 'label' => 'Select Municipality / Borough / City / Ward'],

            // Diaspora Region Types
            ['name' => 'State', 'label' => 'Select State'],
            ['name' => 'Province / Territory', 'label' => 'Select Province / Territory'],
            ['name' => 'Country / Region', 'label' => 'Select Country / Region'],
            ['name' => 'Region / Department', 'label' => 'Select Region / Department'],
            ['name' => 'Province / Municipality', 'label' => 'Select Province / Municipality'],
            ['name' => 'Autonomous Community / Province', 'label' => 'Select Autonomous Community / Province'],
        ];

        DB::table('region_types')->insert($regionTypes);
    }
}
