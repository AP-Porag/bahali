<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * Order matters (FK dependencies):
     * countries → region_types → regions → languages → credentials → users → providers → provider_support_areas
     */
    public function run(): void
    {
        $this->call([
            CountrySeeder::class,
            RegionTypeSeeder::class,
            RegionSeeder::class,
            LanguageSeeder::class,
            CredentialSeeder::class,
            UserSeeder::class,
            ProviderSeeder::class,
            ProviderSupportAreaSeeder::class,
        ]);

        // Public directory filter dropdowns are cached — refresh after seeding
        Cache::forget('public_provider_filter_options');
    }
}
