<?php
// database/seeders/CountrySeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CountrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $countries = [
            // Caribbean Countries
            ['name' => 'Anguilla', 'code' => 'AI', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 1],
            ['name' => 'Antigua and Barbuda', 'code' => 'AG', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 2],
            ['name' => 'Aruba', 'code' => 'AW', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 3],
            ['name' => 'Bahamas', 'code' => 'BS', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 4],
            ['name' => 'Barbados', 'code' => 'BB', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 5],
            ['name' => 'Belize', 'code' => 'BZ', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 6],
            ['name' => 'Bermuda', 'code' => 'BM', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 7],
            ['name' => 'Bonaire', 'code' => 'BQ', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 8],
            ['name' => 'British Virgin Islands', 'code' => 'VG', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 9],
            ['name' => 'Cayman Islands', 'code' => 'KY', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 10],
            ['name' => 'Cuba', 'code' => 'CU', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 11],
            ['name' => 'Curaçao', 'code' => 'CW', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 12],
            ['name' => 'Dominica', 'code' => 'DM', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 13],
            ['name' => 'Dominican Republic', 'code' => 'DO', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 14],
            ['name' => 'Grenada', 'code' => 'GD', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 15],
            ['name' => 'Guadeloupe', 'code' => 'GP', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 16],
            ['name' => 'Guyana', 'code' => 'GY', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 17],
            ['name' => 'Haiti', 'code' => 'HT', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 18],
            ['name' => 'Jamaica', 'code' => 'JM', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 19],
            ['name' => 'Martinique', 'code' => 'MQ', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 20],
            ['name' => 'Montserrat', 'code' => 'MS', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 21],
            ['name' => 'Puerto Rico', 'code' => 'PR', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 22],
            ['name' => 'Saba', 'code' => 'SX', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 23],
            ['name' => 'Saint Barthélemy', 'code' => 'BL', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 24],
            ['name' => 'Saint Kitts and Nevis', 'code' => 'KN', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 25],
            ['name' => 'Saint Lucia', 'code' => 'LC', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 26],
            ['name' => 'Saint Martin / Sint Maarten', 'code' => 'MF', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 27],
            ['name' => 'Saint Vincent and the Grenadines', 'code' => 'VC', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 28],
            ['name' => 'Sint Eustatius', 'code' => 'BQ-SE', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 29],
            ['name' => 'Suriname', 'code' => 'SR', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 30],
            ['name' => 'Trinidad and Tobago', 'code' => 'TT', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 31],
            ['name' => 'Turks and Caicos Islands', 'code' => 'TC', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 32],
            ['name' => 'United States Virgin Islands', 'code' => 'VI', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 33],

            // Diaspora Countries
            ['name' => 'United States', 'code' => 'US', 'is_caribbean' => false, 'is_diaspora' => true, 'display_order' => 100],
            ['name' => 'Canada', 'code' => 'CA', 'is_caribbean' => false, 'is_diaspora' => true, 'display_order' => 101],
            ['name' => 'United Kingdom', 'code' => 'GB', 'is_caribbean' => false, 'is_diaspora' => true, 'display_order' => 102],
            ['name' => 'France', 'code' => 'FR', 'is_caribbean' => false, 'is_diaspora' => true, 'display_order' => 103],
            ['name' => 'Netherlands', 'code' => 'NL', 'is_caribbean' => false, 'is_diaspora' => true, 'display_order' => 104],
            ['name' => 'Spain', 'code' => 'ES', 'is_caribbean' => false, 'is_diaspora' => true, 'display_order' => 105],
            ['name' => 'Panama', 'code' => 'PA', 'is_caribbean' => false, 'is_diaspora' => true, 'display_order' => 106],
            ['name' => 'Costa Rica', 'code' => 'CR', 'is_caribbean' => false, 'is_diaspora' => true, 'display_order' => 107],
            ['name' => 'Spanish Virgin Islands', 'code' => 'VI-ES', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 34],
        ];

        DB::table('countries')->insert($countries);
    }
}
