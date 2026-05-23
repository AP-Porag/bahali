<?php
// database/seeders/CredentialSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Credential;

class CredentialSeeder extends Seeder
{
    public function run(): void
    {
        $credentials = [
            // Degrees
            ['name' => 'PsyD', 'type' => 'degree'],
            ['name' => 'PhD', 'type' => 'degree'],
            ['name' => 'MD', 'type' => 'degree'],
            ['name' => 'DO', 'type' => 'degree'],
            ['name' => 'MSW', 'type' => 'degree'],
            ['name' => 'MPH', 'type' => 'degree'],

            // Licenses
            ['name' => 'LCSW', 'type' => 'license'],
            ['name' => 'LMSW', 'type' => 'license'],
            ['name' => 'LMHC', 'type' => 'license'],
            ['name' => 'LPC', 'type' => 'license'],
            ['name' => 'LMFT', 'type' => 'license'],

            // Certifications
            ['name' => 'Certified Coach', 'type' => 'certification'],
            ['name' => 'Certified Peer Specialist', 'type' => 'certification'],
            ['name' => 'Board Certification or Specialty Certification', 'type' => 'certification'],

            // Ordination
            ['name' => 'Ordained Minister', 'type' => 'ordination'],

            // Nursing
            ['name' => 'NP', 'type' => 'license'],
            ['name' => 'RN', 'type' => 'license'],
        ];

        foreach ($credentials as $credential) {
            Credential::create([
                'name' => $credential['name'],
                'slug' => \Illuminate\Support\Str::slug($credential['name']),
                'type' => $credential['type'],
            ]);
        }
    }
}
