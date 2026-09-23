<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Spanish Virgin Islands এবং এর সব regions remove
        DB::table('regions')->where('country_id', 42)->delete();
        DB::table('countries')->where('id', 42)->delete();
    }

    public function down(): void
    {
        // rollback
        DB::table('countries')->insert([
            'id' => 42,
            'name' => 'Spanish Virgin Islands',
            'code' => 'VI-ES',
            'is_caribbean' => 1,
            'is_diaspora' => 0,
            'display_order' => 34,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
};
