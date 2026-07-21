<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RegionTypeSeeder::class,
            CountrySeeder::class,
            RegionSeeder::class,
            CredentialSeeder::class,
            LanguageSeeder::class,

            // Real exported data (bahali.org)
            UserSeeder::class,      // aage — admin + provider users (id soho)
            ProviderSeeder::class,  // pore — user_id-e link kore
        ]);
    }
}
