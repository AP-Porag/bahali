<?php
// database/seeders/CountrySeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CountrySeeder extends Seeder
{
    public function run(): void
    {
        // পুরনো data clear
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('regions')->truncate();
        DB::table('countries')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $countries = [
            // Caribbean Countries
            ['id' => 1,  'name' => 'Anguilla', 'code' => 'AI', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 1],
            ['id' => 2,  'name' => 'Antigua and Barbuda', 'code' => 'AG', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 2],
            ['id' => 3,  'name' => 'Aruba', 'code' => 'AW', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 3],
            ['id' => 4,  'name' => 'Bahamas', 'code' => 'BS', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 4],
            ['id' => 5,  'name' => 'Barbados', 'code' => 'BB', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 5],
            ['id' => 6,  'name' => 'Belize', 'code' => 'BZ', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 6],
            ['id' => 7,  'name' => 'Bermuda', 'code' => 'BM', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 7],
            ['id' => 8,  'name' => 'Bonaire', 'code' => 'BQ', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 8],
            ['id' => 9,  'name' => 'British Virgin Islands', 'code' => 'VG', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 9],
            ['id' => 10, 'name' => 'Cayman Islands', 'code' => 'KY', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 10],
            ['id' => 11, 'name' => 'Cuba', 'code' => 'CU', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 11],
            ['id' => 12, 'name' => 'Curaçao', 'code' => 'CW', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 12],
            ['id' => 13, 'name' => 'Dominica', 'code' => 'DM', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 13],
            ['id' => 14, 'name' => 'Dominican Republic', 'code' => 'DO', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 14],
            ['id' => 15, 'name' => 'Grenada', 'code' => 'GD', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 15],
            ['id' => 16, 'name' => 'Guadeloupe', 'code' => 'GP', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 16],
            ['id' => 17, 'name' => 'Guyana', 'code' => 'GY', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 17],
            ['id' => 18, 'name' => 'Haiti', 'code' => 'HT', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 18],
            ['id' => 19, 'name' => 'Jamaica', 'code' => 'JM', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 19],
            ['id' => 20, 'name' => 'Martinique', 'code' => 'MQ', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 20],
            ['id' => 21, 'name' => 'Montserrat', 'code' => 'MS', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 21],
            ['id' => 22, 'name' => 'Puerto Rico', 'code' => 'PR', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 22],
            ['id' => 23, 'name' => 'Saba', 'code' => 'SX', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 23],
            ['id' => 24, 'name' => 'Saint Barthélemy', 'code' => 'BL', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 24],
            ['id' => 25, 'name' => 'Saint Kitts and Nevis', 'code' => 'KN', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 25],
            ['id' => 26, 'name' => 'Saint Lucia', 'code' => 'LC', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 26],
            ['id' => 27, 'name' => 'Saint Martin / Sint Maarten', 'code' => 'MF', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 27],
            ['id' => 28, 'name' => 'Saint Vincent and the Grenadines', 'code' => 'VC', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 28],
            ['id' => 29, 'name' => 'Sint Eustatius', 'code' => 'BQ-SE', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 29],
            ['id' => 30, 'name' => 'Suriname', 'code' => 'SR', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 30],
            ['id' => 31, 'name' => 'Trinidad and Tobago', 'code' => 'TT', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 31],
            ['id' => 32, 'name' => 'Turks and Caicos Islands', 'code' => 'TC', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 32],
            ['id' => 33, 'name' => 'United States Virgin Islands', 'code' => 'VI', 'is_caribbean' => true, 'is_diaspora' => false, 'display_order' => 33],

            // Diaspora Countries
            ['id' => 34, 'name' => 'United States', 'code' => 'US', 'is_caribbean' => false, 'is_diaspora' => true, 'display_order' => 100],
            ['id' => 35, 'name' => 'Canada', 'code' => 'CA', 'is_caribbean' => false, 'is_diaspora' => true, 'display_order' => 101],
            ['id' => 36, 'name' => 'United Kingdom', 'code' => 'GB', 'is_caribbean' => false, 'is_diaspora' => true, 'display_order' => 102],
            ['id' => 37, 'name' => 'France', 'code' => 'FR', 'is_caribbean' => false, 'is_diaspora' => true, 'display_order' => 103],
            ['id' => 38, 'name' => 'Netherlands', 'code' => 'NL', 'is_caribbean' => false, 'is_diaspora' => true, 'display_order' => 104],
            ['id' => 39, 'name' => 'Spain', 'code' => 'ES', 'is_caribbean' => false, 'is_diaspora' => true, 'display_order' => 105],
            ['id' => 40, 'name' => 'Panama', 'code' => 'PA', 'is_caribbean' => false, 'is_diaspora' => true, 'display_order' => 106],
            ['id' => 41, 'name' => 'Costa Rica', 'code' => 'CR', 'is_caribbean' => false, 'is_diaspora' => true, 'display_order' => 107],
        ];

        DB::table('countries')->insert($countries);
    }
}
