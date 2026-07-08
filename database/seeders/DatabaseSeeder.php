<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
            // DemoProviderSeeder::class, // Optional: for testing
        ]);

        // 4. Admin user (independent, can be last)
        User::factory()->create([
            'name' => 'Admin Main',
            'email' => 'admin@app.com',
            'password' => bcrypt('12345678'),
            'role' => 'admin',
        ]);
    }
}
