<?php
// database/seeders/RegionTypeSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RegionTypeSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('region_types')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $regionTypes = [
            ['id' => 1,  'name' => 'District / Village', 'label' => 'Select District / Village'],
            ['id' => 2,  'name' => 'Parish / Dependency', 'label' => 'Select Parish / Dependency'],
            ['id' => 3,  'name' => 'Region / District', 'label' => 'Select Region / District'],
            ['id' => 4,  'name' => 'Island', 'label' => 'Select Island'],
            ['id' => 5,  'name' => 'Parish', 'label' => 'Select Parish'],
            ['id' => 6,  'name' => 'District', 'label' => 'Select District'],
            ['id' => 7,  'name' => 'Parish / Municipality', 'label' => 'Select Parish / Municipality'],
            ['id' => 8,  'name' => 'District / Area', 'label' => 'Select District / Area'],
            ['id' => 9,  'name' => 'Province', 'label' => 'Select Province'],
            ['id' => 10, 'name' => 'Province / National District', 'label' => 'Select Province / National District'],
            ['id' => 11, 'name' => 'Arrondissement / Commune', 'label' => 'Select Arrondissement / Commune'],
            ['id' => 12, 'name' => 'Region', 'label' => 'Select Region'],
            ['id' => 13, 'name' => 'Department', 'label' => 'Select Department'],
            ['id' => 14, 'name' => 'Municipality', 'label' => 'Select Municipality'],
            ['id' => 15, 'name' => 'Village / Area', 'label' => 'Select Village / Area'],
            ['id' => 16, 'name' => 'Quarter / Area', 'label' => 'Select Quarter / Area'],
            ['id' => 17, 'name' => 'Territory', 'label' => 'Select Territory'],
            ['id' => 18, 'name' => 'Area', 'label' => 'Select Area'],
            ['id' => 19, 'name' => 'Municipality / Tobago', 'label' => 'Select Municipality / Tobago'],
            ['id' => 20, 'name' => 'State', 'label' => 'Select State'],
            ['id' => 21, 'name' => 'Province / Territory', 'label' => 'Select Province / Territory'],
            ['id' => 22, 'name' => 'Country / Region', 'label' => 'Select Country / Region'],
            ['id' => 23, 'name' => 'Region / Department', 'label' => 'Select Region / Department'],
            ['id' => 24, 'name' => 'Province / Municipality', 'label' => 'Select Province / Municipality'],
            ['id' => 25, 'name' => 'Autonomous Community', 'label' => 'Select Autonomous Community'],
            ['id' => 26, 'name' => 'Island / Island Group', 'label' => 'Select Island / Island Group'],
            ['id' => 27, 'name' => 'District / Island', 'label' => 'Select District / Island'],
            ['id' => 28, 'name' => 'Province / Special Municipality', 'label' => 'Select Province / Special Municipality'],
            ['id' => 29, 'name' => 'City / Local Area', 'label' => 'Select City / Local Area'],
        ];

        DB::table('region_types')->insert($regionTypes);
    }
}
