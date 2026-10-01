<?php
// database/seeders/UserSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Real users exported from the live bahali.org database.
     * Passwords are the original bcrypt hashes — providers can log in
     * with their existing credentials.
     */
    public function run(): void
    {
        $users = [
            [
                'id' => 1,
                'name' => 'Admin Main',
                'email' => 'admin@app.com',
                'email_verified_at' => '2026-07-10 12:41:55',
                'password' => '$2y$12$KAHHPqyQ9VNcmNQxPGVINe0RmGT8OAYM5DQtx6WFC6FEu4vp2Prsm',
                'role' => 'admin',
                'otp_code' => null,
                'otp_expires_at' => null,
                'remember_token' => null,
                'created_at' => '2026-07-10 12:41:55',
                'updated_at' => '2026-07-10 12:41:55',
            ]
        ];

        DB::table('users')->insert($users);
    }
}
